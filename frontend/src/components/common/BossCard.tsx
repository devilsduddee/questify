import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressBar } from "./ProgressBar"
import { Shake } from "./AnimationWrapper"

interface BossCardProps {
  name: string
  currentHp: number
  maxHp: number
  isHit?: boolean
  className?: string
}

export const BossCard: React.FC<BossCardProps> = ({ name, currentHp, maxHp, isHit = false, className }) => {
  const hpPercentage = (currentHp / maxHp) * 100
  const [damagePopups, setDamagePopups] = useState<{ id: number; damage: number }[]>([])

  // Track previous HP to calculate damage for popup
  const [prevHp, setPrevHp] = useState(currentHp)

  useEffect(() => {
    if (currentHp < prevHp) {
      const damage = prevHp - currentHp
      const id = Date.now()
      setDamagePopups((prev) => [...prev, { id, damage }])
      // Remove popup after animation
      setTimeout(() => {
        setDamagePopups((prev) => prev.filter((p) => p.id !== id))
      }, 1000)
    }
    setPrevHp(currentHp)
  }, [currentHp, prevHp])

  return (
    <Shake trigger={isHit} className={className}>
      <Card variant="boss" className="max-w-xl mx-auto text-center border-0 bg-transparent shadow-none">
        <CardContent className="p-0 relative flex flex-col items-center">
          
          {/* Boss Aura */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-destructive/30 rounded-full blur-[50px] -z-10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating Damage Numbers */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 z-50 pointer-events-none">
            <AnimatePresence>
              {damagePopups.map((popup) => (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -50, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute left-1/2 -translate-x-1/2 font-heading text-4xl text-white font-bold drop-shadow-[0_0_10px_rgba(239,68,68,1)]"
                  style={{ textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000" }}
                >
                  -{popup.damage}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Boss Sprite with Idle Hover */}
          <motion.div 
            className="relative w-48 h-48 mx-auto mb-6 bg-gradient-to-b from-[#2D1B13] to-destructive/20 border-4 border-destructive rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.6)]"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-7xl font-pixel drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">☠️</span>
            {isHit && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/50 rounded-full z-10"
              />
            )}
          </motion.div>

          {/* Boss Labels */}
          <div className="flex gap-2 mb-2 font-pixel text-[10px] uppercase tracking-widest text-muted-foreground bg-[#0F172A]/80 px-4 py-1 rounded-full border border-border/50">
            <span className="text-destructive">BOSS</span>
            <span>•</span>
            <span className="text-secondary">Lv. 99</span>
            <span>•</span>
            <span className="text-primary">Element: Dark</span>
          </div>

          <h2 className="text-destructive font-heading font-bold text-3xl mb-4 text-glow tracking-widest uppercase">
            {name}
          </h2>

          <div className="flex flex-col gap-2 w-full max-w-[400px]">
            <div className="flex justify-between items-center text-sm font-pixel px-2">
              <span className="text-destructive drop-shadow-md">HP</span>
              <span className="text-white drop-shadow-md">{currentHp} / {maxHp}</span>
            </div>
            {/* Enhanced HP Bar */}
            <div className="relative p-1 bg-black/50 rounded-full border-2 border-destructive/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <ProgressBar
                progress={hpPercentage}
                colorClass="bg-gradient-to-r from-red-700 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                bgClass="bg-transparent"
                heightClass="h-6"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Shake>
  )
}
