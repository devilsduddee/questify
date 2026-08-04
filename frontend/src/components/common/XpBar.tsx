import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

interface XpBarProps {
  currentXp: number
  maxXp: number
  className?: string
}

export const XpBar: React.FC<XpBarProps> = ({ currentXp, maxXp, className }) => {
  const percentage = (currentXp / maxXp) * 100

  return (
    <div className={cn("relative w-full h-3 rounded-sm bg-slate-900 overflow-hidden rpg-frame-inset", className)}>
      <motion.div
        className="h-full bg-gradient-to-r from-secondary to-primary box-glow-gold relative"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
      </motion.div>
    </div>
  )
}
