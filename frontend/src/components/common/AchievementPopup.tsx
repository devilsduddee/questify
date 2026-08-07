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

  useEffect(() => {
    if (queue.length > 0 && !isPopupActive) {
      setPopupActive(true)
      
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setPopupActive(false)
        setTimeout(() => shiftQueue(), 500) // Wait for exit animation
      }, 4000)
      
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
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] pointer-events-none flex justify-center w-full max-w-md px-4">
      <AnimatePresence>
        {isPopupActive && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative flex items-center gap-4 p-4 border-[3px] pixel-borders rounded-lg ${colorClass} ${glowClass} overflow-hidden pointer-events-auto`}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 translate-x-[-100%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="relative shrink-0 w-14 h-14 bg-black/40 border-2 border-white/20 flex items-center justify-center rounded">
              <Icon className="w-8 h-8 drop-shadow-md" />
              {achievement.rarity === "Legendary" && (
                <div className="absolute inset-0 bg-yellow-400/20 mix-blend-overlay animate-pulse" />
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="text-[10px] font-pixel text-white/70 uppercase mb-1 tracking-widest flex justify-between items-center">
                <span>Achievement Unlocked</span>
                <span className="text-white bg-black/30 px-1 py-0.5 rounded">{achievement.rarity}</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white drop-shadow-sm truncate">
                {achievement.title}
              </h3>
              <p className="font-sans text-xs text-white/90 truncate">
                {achievement.description}
              </p>
            </div>
            
            {achievement.xpReward > 0 && (
              <div className="shrink-0 flex flex-col items-center justify-center bg-black/40 border border-white/20 px-2 py-1 rounded">
                <span className="text-[10px] font-pixel text-secondary">XP</span>
                <span className="font-pixel text-sm text-white">+{achievement.xpReward}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
