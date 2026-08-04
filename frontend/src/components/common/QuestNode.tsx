import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import { Lock, Check, Skull } from "lucide-react"

export type NodeState = "locked" | "available" | "completed" | "boss"

interface QuestNodeProps {
  state: NodeState
  label: string
  onClick?: () => void
  className?: string
}

export const QuestNode: React.FC<QuestNodeProps> = ({ state, label, onClick, className }) => {
  const getIcon = () => {
    switch (state) {
      case "locked":
        return <Lock className="w-5 h-5 text-muted-foreground" />
      case "completed":
        return <Check className="w-5 h-5 text-success font-bold" />
      case "boss":
        return <Skull className="w-8 h-8 text-destructive animate-pulse" />
      case "available":
      default:
        return <div className="w-4 h-4 rounded-full bg-secondary" />
    }
  }

  const getStyle = () => {
    switch (state) {
      case "locked":
        return "bg-muted border-muted-foreground opacity-70 grayscale pixel-emboss"
      case "completed":
        return "bg-background border-success box-glow pixel-emboss"
      case "boss":
        return "bg-background border-destructive glow-purple w-16 h-16 rpg-frame-inset animate-magic-pulse"
      case "available":
        return "bg-background border-secondary box-glow-gold animate-pulse-glow pixel-emboss"
      default:
        return "bg-background border-primary pixel-emboss"
    }
  }

  const isClickable = state === "available" || state === "boss" || state === "completed"

  return (
    <div className={cn("flex flex-col items-center gap-2 animate-float", className)}>
      <motion.button
        className={cn(
          "w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all relative sound-hover sound-click",
          getStyle(),
          isClickable ? "cursor-pointer hover:brightness-110" : "cursor-not-allowed"
        )}
        whileHover={isClickable ? { scale: 1.1 } : {}}
        whileTap={isClickable ? { scale: 0.95 } : {}}
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
      >
        {getIcon()}
        {state === "completed" && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-sparkle box-glow-gold" />
        )}
      </motion.button>
      <span className={cn("text-xs font-pixel text-center max-w-[100px]", state === "locked" ? "text-muted-foreground" : "text-foreground text-glow")}>
        {label}
      </span>
    </div>
  )
}
