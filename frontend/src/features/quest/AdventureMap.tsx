import React, { useState } from "react"
import { motion } from "framer-motion"
import { useAdventureStore } from "@/store/useAdventureStore"
import { QuestNode } from "@/components/common/QuestNode"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MotionButton } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { MapBackground } from "@/components/map/MapBackground"
import { MapPath } from "@/components/map/MapPath"
import { QuestAreaDecoration } from "@/components/map/QuestAreaDecoration"
import { LoreMasteryPanel } from "@/components/map/LoreMasteryPanel"
import { WorldBanner } from "@/components/map/WorldBanner"
import { IntroModal } from "@/components/map/IntroModal"

export const AdventureMap: React.FC = () => {
  const [isLoreOpen, setIsLoreOpen] = useState(false)
  const activeAdventure = useAdventureStore(state => state.getActive())
  const worldName = activeAdventure?.worldName || "Peta Petualangan"
  const nodes = activeAdventure?.nodes || []
  const activeNodeId = activeAdventure?.activeNodeId || null
  const navigate = useNavigate()
  
  const activeNode = nodes.find(n => n.id === activeNodeId)

  return (
    <div className="w-full h-full flex flex-col lg:flex-row relative bg-[#0F172A] overflow-hidden">
      
      {/* Map Area */}
      <div className="flex-1 relative overflow-y-auto custom-scrollbar p-12 pt-[calc(3rem+6rem)] md:pt-[calc(3rem+5rem)] lg:pr-[22rem]">
        
        {/* The Kingdom of Databaseia Map Background */}
        <MapBackground />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center pb-32 pt-8">
          
          <WorldBanner onOpenLore={() => setIsLoreOpen(true)} />
          
          {/* Winding path container */}
          <div className="relative flex flex-col items-center w-full min-h-[500px]">
            
            {/* The SVG Path connecting nodes */}
            <MapPath nodes={nodes} />

            {nodes.map((node, index) => {
              // Alternate left and right for winding effect
              const offsetClass = index % 2 === 0 ? "mr-auto ml-[10%] lg:ml-[25%]" : "ml-auto mr-[10%] lg:mr-[25%]"
              const isBoss = node.isBoss
              const nodeState = node.status === "available" ? (isBoss ? "boss" : "available") : node.status

              return (
                <motion.div 
                  key={node.id}
                  className={`relative z-10 w-full flex py-12 ${offsetClass}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <QuestAreaDecoration index={index} state={nodeState} title={node.title}>
                    <QuestNode 
                      state={nodeState} 
                      label={node.title} 
                      onClick={() => {
                        if (isBoss) {
                          navigate(`/battle/${node.id}`)
                        } else {
                          navigate(`/quest/${node.id}`)
                        }
                      }}
                    />
                  </QuestAreaDecoration>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Side Mission Tracker (Desktop only) */}
      <div className="fixed right-0 lg:right-6 top-24 h-[calc(100vh-7rem)] z-20 hidden lg:flex w-80 bg-background/90 backdrop-blur-md border-[3px] border-border/50 rounded-xl p-lg flex-col shadow-panel pixel-borders">
        <h3 className="font-heading text-xl text-secondary mb-6 text-glow border-b border-border/50 pb-4">Active Quest</h3>
        
        {activeNode ? (
          <Card variant="scroll" className="bg-[#2D1B13]/80 border-none shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{activeNode.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6 font-sans">
                {activeNode.description}
              </p>
              
              <div className="flex flex-col gap-2 font-pixel text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className={activeNode.isBoss ? "text-destructive" : "text-primary"}>
                    {activeNode.isBoss ? "HARD" : "NORMAL"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reward:</span>
                  <span className="text-secondary">+{activeNode.isBoss ? "500" : "100"} XP</span>
                </div>
              </div>

              <MotionButton 
                className="w-full mt-6 font-pixel text-xs" 
                variant={activeNode.isBoss ? "destructive" : "default"}
                onClick={() => {
                  if (activeNode.isBoss) {
                    navigate(`/battle/${activeNode.id}`)
                  } else {
                    navigate(`/quest/${activeNode.id}`)
                  }
                }}
              >
                {activeNode.isBoss ? "ENTER ARENA" : "START QUEST"}
              </MotionButton>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-muted-foreground text-sm italic">
            No active quest selected.
          </div>
        )}
      </div>

      <LoreMasteryPanel isOpen={isLoreOpen} onClose={() => setIsLoreOpen(false)} />
      <IntroModal />
    </div>
  )
}
