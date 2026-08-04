import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

interface ProgressBarProps {
  progress: number // 0 to 100
  colorClass?: string
  bgClass?: string
  className?: string
  heightClass?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  colorClass = "bg-primary",
  bgClass = "bg-muted",
  heightClass = "h-2",
  className,
}) => {
  return (
    <div className={cn("w-full overflow-hidden rounded-full", bgClass, heightClass, className)}>
      <motion.div
        className={cn("h-full", colorClass)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  )
}
