import React from "react"
import { motion } from "framer-motion"
import { NodeState } from "@/components/common/QuestNode"

interface QuestAreaDecorationProps {
  children: React.ReactNode
  index: number
  state: NodeState
  title: string
}

export const QuestAreaDecoration: React.FC<QuestAreaDecorationProps> = ({ children, index, state, title }) => {
  const isLeft = index % 2 === 0
  
  // Determine area type from title loosely
  const t = title.toLowerCase()
  let AreaIcon = Temple
  if (t.includes("diagram") || t.includes("teori") || t.includes("pengenalan")) AreaIcon = Library
  else if (t.includes("sql") || t.includes("query") || t.includes("select")) AreaIcon = TradeCity
  else if (t.includes("normalisasi") || t.includes("relasi")) AreaIcon = Temple
  else if (t.includes("transaksi") || t.includes("join") || t.includes("fungsi")) AreaIcon = Fortress
  
  if (state === "boss") AreaIcon = Castle

  const isCompleted = state === "completed"
  const isAvailable = state === "available" || state === "boss"
  const isLocked = state === "locked"

  // Base colors
  const pathColor = isCompleted ? "stroke-secondary" : isAvailable ? "stroke-primary" : "stroke-slate-700"
  const dropShadow = isCompleted ? "drop-shadow-glow-achievement" : isAvailable ? "drop-shadow-glow-quest" : ""

  return (
    <div className="relative w-full flex items-center justify-center">
      
      {/* Magical tether to the center path */}
      <div className={`absolute top-1/2 -translate-y-1/2 w-1/2 h-4 pointer-events-none ${isLeft ? 'right-0' : 'left-0'} flex items-center`}>
        <svg width="100%" height="20" className={`overflow-visible ${dropShadow}`}>
          <motion.path 
            d={isLeft ? "M 0 10 Q 50 10 100 10" : "M 100 10 Q 50 10 0 10"} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            className={pathColor}
            strokeDasharray="5 5"
            animate={!isLocked ? { strokeDashoffset: [0, -20] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Decorative Building Behind Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 scale-150">
        <AreaIcon className={isCompleted ? "text-secondary" : "text-muted-foreground"} />
      </div>

      {/* Ambient magic dust around the building */}
      {!isLocked && (
        <motion.div 
          className="absolute w-24 h-24 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className={`absolute top-0 left-1/2 w-1 h-1 rounded-full ${isCompleted ? 'bg-secondary' : 'bg-primary'} shadow-glow-achievement`} />
          <div className={`absolute bottom-0 right-1/4 w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-secondary' : 'bg-primary'} shadow-glow-achievement`} />
        </motion.div>
      )}

      {/* The Actual QuestNode */}
      <div className="relative z-10">
        {children}
      </div>
      
    </div>
  )
}

// Minimalistic SVG Icons for Areas
const Library = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" width="80" height="80" className={className} fill="currentColor">
    <path d="M 20 80 L 80 80 L 80 20 L 50 10 L 20 20 Z" />
    <rect x="30" y="30" width="10" height="15" fill="none" stroke="black" />
    <rect x="60" y="30" width="10" height="15" fill="none" stroke="black" />
  </svg>
)

const TradeCity = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" width="80" height="80" className={className} fill="currentColor">
    <rect x="20" y="40" width="20" height="40" />
    <rect x="40" y="20" width="20" height="60" />
    <rect x="60" y="50" width="20" height="30" />
    <polygon points="20,40 30,20 40,40" />
    <polygon points="40,20 50,0 60,20" />
    <polygon points="60,50 70,30 80,50" />
  </svg>
)

const Temple = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" width="80" height="80" className={className} fill="currentColor">
    <polygon points="10,80 90,80 80,70 20,70" />
    <rect x="25" y="40" width="10" height="30" />
    <rect x="45" y="40" width="10" height="30" />
    <rect x="65" y="40" width="10" height="30" />
    <polygon points="15,40 85,40 50,10" />
  </svg>
)

const Fortress = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" width="80" height="80" className={className} fill="currentColor">
    <rect x="20" y="40" width="60" height="40" />
    <rect x="10" y="30" width="20" height="50" />
    <rect x="70" y="30" width="20" height="50" />
    <polygon points="10,30 15,20 20,30" />
    <polygon points="20,30 25,20 30,30" />
    <polygon points="70,30 75,20 80,30" />
    <polygon points="80,30 85,20 90,30" />
  </svg>
)

const Castle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" width="100" height="100" className={className} fill="currentColor">
    <rect x="30" y="40" width="40" height="40" />
    <rect x="10" y="20" width="25" height="60" />
    <rect x="65" y="20" width="25" height="60" />
    <polygon points="10,20 22.5,0 35,20" />
    <polygon points="65,20 77.5,0 90,20" />
    <rect x="40" y="60" width="20" height="20" fill="black" />
  </svg>
)
