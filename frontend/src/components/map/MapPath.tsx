import React from "react"
import { motion } from "framer-motion"
import { QuestNodeModel } from "@/store/useAdventureStore"

interface MapPathProps {
  nodes: QuestNodeModel[]
}

export const MapPath: React.FC<MapPathProps> = ({ nodes }) => {
  // If no nodes, return empty
  if (!nodes || nodes.length === 0) return null

  // The path changes color based on how many nodes are completed.
  // We can just draw the path in segments or use a gradient.
  // Since we want the completed path to be gold, we can draw a gradient
  // that transitions from gold to blue at the point of completion.
  
  const totalNodes = nodes.length
  const completedNodes = nodes.filter(n => n.status === "completed").length
  
  // Calculate completion percentage, slightly pushed up so the active node feels reached
  const completionPercentage = totalNodes > 1 ? (completedNodes / (totalNodes - 1)) * 100 : 0

  return (
    <div className="absolute inset-0 pointer-events-none flex justify-center w-full z-0">
      
      {/* Background track (Ancient stone pathway style) */}
      <svg width="20" height="100%" className="overflow-visible drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
        <defs>
          <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" /> {/* Gold/Secondary */}
            <stop offset={`${Math.max(0, completionPercentage)}%`} stopColor="#f59e0b" />
            <stop offset={`${Math.max(0, completionPercentage + 5)}%`} stopColor="#334155" /> {/* Slate-700 */}
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          
          <linearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset={`${Math.max(0, completionPercentage)}%`} stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset={`${Math.max(0, completionPercentage + 5)}%`} stopColor="#6d28d9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {/* Outer Glow */}
        <motion.line 
          x1="10" y1="0" x2="10" y2="100%" 
          stroke="url(#glowGradient)" 
          strokeWidth="12" 
          strokeLinecap="round"
          animate={{ strokeOpacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner Solid Path (Dashed to look like stone slabs) */}
        <line 
          x1="10" y1="0" x2="10" y2="100%" 
          stroke="url(#pathGradient)" 
          strokeWidth="6" 
          strokeDasharray="20 10" 
          strokeLinecap="square"
          className="drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]"
        />
        
      </svg>

      {/* Magic Particles flowing down the path (Replaced SVG circle with div to fix Framer Motion SVG percent bugs) */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#f59e0b] drop-shadow-[0_0_10px_#f59e0b] glow-gold"
        animate={{ top: ["0%", `${Math.max(10, completionPercentage)}%`] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#fff] drop-shadow-[0_0_5px_#fff]"
        animate={{ top: ["0%", `${Math.max(10, completionPercentage)}%`] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.2 }}
      />
      
    </div>
  )
}
