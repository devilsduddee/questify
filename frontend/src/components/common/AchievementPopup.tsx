import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAchievementUIStore } from "@/store/useAchievementUIStore"
import { ACHIEVEMENT_REGISTRY } from "@/data/achievements"

const rarityColors = {
  Common: "from-gray-500 to-gray-700 border-gray-400 text-gray-200",
  Rare: "from-blue-600 to-blue-800 border-blue-400 text-blue-200",
  Epic: "from-purple-600 to-purple-800 border-purple-400 text-purple-200",
  Legendary: "from-yellow-500 to-yellow-700 border-yellow-300 text-yellow-100",
}

const rarityGlows = {
  Common: "shadow-panel",
  Rare: "shadow-glow-info",
  Epic: "shadow-glow-quest",
  Legendary: "shadow-glow-achievement animate-pulse",
}

export const AchievementPopup: React.FC = () => {
  const { queue, isPopupActive, setPopupActive, shiftQueue } = useAchievementUIStore()
  
  // Handle manual dismissal
  const handleDismiss = () => {
    setPopupActive(false)
    setTimeout(() => shiftQueue(), 500)
  }

  useEffect(() => {
    if (queue.length > 0 && !isPopupActive) {
      setPopupActive(true)
      
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setPopupActive(false)
        setTimeout(() => shiftQueue(), 500) // Wait for exit animation
      }, 4500)
      
      return () => clearTimeout(timer)
    }
  }, [queue, isPopupActive, setPopupActive, shiftQueue])

  if (queue.length === 0) return null

  const currentItem = queue[0]
  const achievement = ACHIEVEMENT_REGISTRY[currentItem.achievementId]

  if (!achievement) {
    // Failsafe: if id invalid, shift immediately
    setTimeout(() => {
      setPopupActive(false)
      shiftQueue()
    }, 0)
    return null
  }

  const Icon = achievement.icon
  const colorClass = rarityColors[achievement.rarity]
  const glowClass = rarityGlows[achievement.rarity]

  return (
    <div className="fixed top-6 right-6 z-[150] pointer-events-none flex flex-col gap-2 w-full max-w-[320px]">
      <AnimatePresence>
        {isPopupActive && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`relative flex items-center gap-4 p-4 border-[2px] pixel-borders rounded-lg ${colorClass} ${glowClass} overflow-hidden pointer-events-auto bg-background/95 backdrop-blur-sm shadow-xl`}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 translate-x-[-100%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {/* Close Button */}
            <button 
              onClick={handleDismiss}
              className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-colors z-10"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
            
            <div className="relative shrink-0 w-12 h-12 bg-black/40 border-2 border-white/20 flex items-center justify-center rounded">
              <Icon className="w-6 h-6 drop-shadow-md" />
              {achievement.rarity === "Legendary" && (
                <div className="absolute inset-0 bg-yellow-400/20 mix-blend-overlay animate-pulse" />
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center pr-2">
              <div className="text-[9px] font-pixel text-white/70 uppercase mb-1 tracking-widest flex justify-between items-center">
                <span>Achievement Unlocked</span>
              </div>
              <h3 className="font-heading font-bold text-sm text-white drop-shadow-sm truncate">
                {achievement.title}
              </h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
