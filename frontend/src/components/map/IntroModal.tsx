import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAdventureStore } from "@/store/useAdventureStore"
import { Scroll, X } from "lucide-react"

export const IntroModal: React.FC = () => {
  const activeAdventure = useAdventureStore(state => state.getActive())
  const markIntroAsSeen = useAdventureStore(state => state.markIntroAsSeen)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (activeAdventure && !activeAdventure.hasSeenIntro && activeAdventure.openingNarration) {
      // Small delay for dramatic effect
      const timer = setTimeout(() => setIsOpen(true), 500)
      return () => clearTimeout(timer)
    }
  }, [activeAdventure])

  if (!activeAdventure || !activeAdventure.openingNarration) return null

  const handleClose = () => {
    setIsOpen(false)
    markIntroAsSeen(activeAdventure.id)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Dark Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-background-deep border-[3px] border-secondary shadow-panel pixel-borders p-lg md:p-xl"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-secondary hover:text-secondary-foreground transition-hover"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center text-center">
              <Scroll className="w-12 h-12 text-secondary mb-6 animate-pulse" />
              
              <h2 className="font-heading text-title-section md:text-title-world text-secondary mb-8 tracking-widest uppercase text-glow">
                Prologue
              </h2>
              
              <div className="relative">
                {/* Decorative Quotes */}
                <span className="absolute -top-6 -left-6 text-display text-secondary/30 font-serif">"</span>
                
                <p className="font-sans text-xl md:text-2xl leading-relaxed text-foreground italic mb-12">
                  {activeAdventure.openingNarration}
                </p>
                
                <span className="absolute -bottom-10 -right-6 text-display text-secondary/30 font-serif">"</span>
              </div>

              <button 
                onClick={handleClose}
                className="px-8 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-pixel text-sm uppercase transition-all shadow-button hover:shadow-glow-achievement hover:-translate-y-[2px]"
              >
                Mulai Petualangan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
