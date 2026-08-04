import React, { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { cn } from "@/utils/cn"

interface FlashcardProps {
  keyword: string
  definition: string
  className?: string
}

export const Flashcard: React.FC<FlashcardProps> = ({ keyword, definition, className }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className={cn("relative w-full h-48 cursor-pointer [perspective:1000px]", className)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl border-2 border-secondary bg-[#2D1B13] box-glow-gold flex flex-col items-center justify-center p-6 text-center hover:scale-105 transition-transform">
          <Sparkles className="w-8 h-8 text-secondary mb-4" />
          <h3 className="font-heading text-xl text-glow text-secondary">{keyword}</h3>
          <span className="text-xs text-muted-foreground font-pixel mt-4 opacity-50">Click to reveal</span>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl border-2 border-primary bg-background box-glow flex flex-col items-center justify-center p-6 text-center [transform:rotateY(180deg)]">
          <p className="font-sans text-sm text-foreground/90 leading-relaxed overflow-y-auto custom-scrollbar">
            {definition}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
