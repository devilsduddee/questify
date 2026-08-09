import React from "react"
import { motion } from "framer-motion"
import { useAdventureStore } from "@/store/useAdventureStore"
import { logger } from "@/utils/logger"
import { QuestNode } from "@/components/common/QuestNode"
import { CardTitle } from "@/components/ui/card"
import { MotionButton } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { MapBackground } from "@/components/map/MapBackground"
import { MapPath } from "@/components/map/MapPath"
import { QuestAreaDecoration } from "@/components/map/QuestAreaDecoration"
import { WorldBanner } from "@/components/map/WorldBanner"
import { IntroModal } from "@/components/map/IntroModal"

export const AdventureMap: React.FC = () => {
  const activeAdventure = useAdventureStore(state => state.getActive())
  const nodes = activeAdventure?.nodes || []
  const activeNodeId = activeAdventure?.activeNodeId || null
  const navigate = useNavigate()
  
  const activeNode = nodes.find(n => n.id === activeNodeId)

  return (
    <div className="w-full h-full flex flex-col lg:flex-row relative bg-[#0F172A] overflow-hidden overflow-x-hidden">
      
      {/* Map Area */}
      <div className="flex-1 relative overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-12 pt-[calc(3rem+6rem)] md:pt-[calc(3rem+5rem)] lg:pr-[22rem]">
        
        {/* The Kingdom of Databaseia Map Background */}
        <MapBackground />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center pb-32 pt-8">
          
          <WorldBanner />
          
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
      <div className="fixed right-0 lg:right-6 top-24 h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] z-20 hidden lg:flex w-80 bg-background/90 backdrop-blur-md border-[3px] border-border/50 rounded-xl p-4 lg:p-6 flex-col shadow-panel pixel-borders overflow-y-auto">
        <h3 className="font-heading text-xl text-secondary mb-6 text-glow border-b border-border/50 pb-4 shrink-0">Active Quest</h3>
        
        {activeNode ? (
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-full overflow-hidden relative">
            <div className="flex flex-col items-start gap-1 shrink-0">
              {activeNode.status === "completed" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-pixel text-[10px] tracking-wider mb-2">✓ SUDAH PAHAM</span>
              )}
              <CardTitle className="text-lg">{activeNode.title}</CardTitle>
            </div>
            
            <div className="flex-1 flex flex-col justify-between min-h-0 overflow-hidden pr-2">
              
              <div className="flex flex-col gap-2 font-pixel text-xs mt-auto mb-6 shrink-0">
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
                className="w-full font-pixel text-xs shrink-0" 
                variant={activeNode.isBoss ? "destructive" : "default"}
                onClick={() => {
                  if (activeNode.isBoss) {
                    logger.info('Navigation', '⚔️ → Battle')
                    navigate(`/battle/${activeNode.id}`)
                  } else {
                    logger.info('Navigation', '📖 → Quest')
                    navigate(`/quest/${activeNode.id}`)
                  }
                }}
              >
                {activeNode.status === "completed" 
                  ? (activeNode.isBoss ? "REVISIT ARENA" : "KUNJUNGI KEMBALI") 
                  : (activeNode.isBoss ? "ENTER ARENA" : "START QUEST")}
              </MotionButton>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm italic">
            No active quest selected.
          </div>
        )}
      </div>

      <IntroModal />
    </div>
  )
}
