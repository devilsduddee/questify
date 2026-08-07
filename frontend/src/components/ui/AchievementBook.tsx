import React, { useMemo, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, Trophy } from "lucide-react"
import { usePlayerStore } from "@/store/usePlayerStore"
import { useAdventureStore } from "@/store/useAdventureStore"
import { 
  ACHIEVEMENT_REGISTRY, 
  AchievementDef,
  getGlobalAchievements,
  getAdventureAchievements
} from "@/data/achievements"

interface AchievementBookProps {
  isOpen: boolean
  onClose: () => void
}

const rarityColors = {
  Common: "text-gray-400 border-gray-600 bg-gray-900/50",
  Rare: "text-blue-400 border-blue-600 bg-blue-900/30",
  Epic: "text-purple-400 border-purple-600 bg-purple-900/30",
  Legendary: "text-yellow-400 border-yellow-600 bg-yellow-900/30",
}

const rarityIconColors = {
  Common: "text-gray-400",
  Rare: "text-blue-400",
  Epic: "text-purple-400",
  Legendary: "text-yellow-400 drop-shadow-md",
}

export const AchievementBook: React.FC<AchievementBookProps> = ({ isOpen, onClose }) => {
  const { globalAchievements } = usePlayerStore()
  const activeAdventure = useAdventureStore(state => state.getActive())
  const adventureAchievements = activeAdventure?.achievements || []

  // Create lookup maps for fast O(1) checking
  const globalUnlockedMap = useMemo(() => {
    return new Map(globalAchievements.map(a => [a.id, a.unlockedAt]))
  }, [globalAchievements])

  const adventureUnlockedMap = useMemo(() => {
    return new Map(adventureAchievements.map(a => [a.id, a.unlockedAt]))
  }, [adventureAchievements])

  const renderAchievementCard = (achievement: AchievementDef, scope: "global" | "adventure") => {
    const isUnlocked = scope === "global" 
      ? globalUnlockedMap.has(achievement.id)
      : adventureUnlockedMap.has(achievement.id)
    
    const unlockedAt = scope === "global"
      ? globalUnlockedMap.get(achievement.id)
      : adventureUnlockedMap.get(achievement.id)

    const Icon = achievement.icon

    if (!isUnlocked) {
      return (
        <div key={achievement.id} className="relative flex items-center gap-4 p-4 border-2 border-gray-800 bg-gray-950/50 opacity-60 grayscale pixel-borders rounded-lg">
          <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-gray-900 border-2 border-gray-800 rounded">
            <Lock className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-heading text-gray-400 truncate tracking-wide text-lg">???</h4>
            <p className="font-sans text-xs text-gray-600 truncate">{achievement.description}</p>
          </div>
          <div className="shrink-0 text-center">
            <span className="font-pixel text-[10px] text-gray-600 block mb-1">XP</span>
            <span className="font-pixel text-xs text-gray-500">{achievement.xpReward}</span>
          </div>
        </div>
      )
    }

    // Unlocked UI
    const containerClass = rarityColors[achievement.rarity]
    const iconColor = rarityIconColors[achievement.rarity]
    const dateStr = new Date(unlockedAt!).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })

    return (
      <div key={achievement.id} className={`relative flex items-center gap-4 p-4 border-2 pixel-borders rounded-lg ${containerClass} transition-all hover:scale-[1.02]`}>
        <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-black/50 border border-current rounded relative overflow-hidden">
          <Icon className={`w-7 h-7 ${iconColor} relative z-10`} />
          {achievement.rarity === "Legendary" && (
            <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h4 className={`font-heading font-bold text-lg truncate tracking-wide ${iconColor}`}>
              {achievement.title}
            </h4>
            <span className="font-pixel text-[10px] bg-black/40 px-2 py-0.5 rounded opacity-80 uppercase ml-2 shrink-0">
              {achievement.rarity}
            </span>
          </div>
          <p className="font-sans text-xs opacity-90 truncate mb-1">{achievement.description}</p>
          <p className="font-pixel text-[9px] opacity-60">Unlocked: {dateStr}</p>
        </div>
        <div className="shrink-0 text-center flex flex-col items-center justify-center bg-black/30 px-3 py-1 border border-current/30 rounded">
          <span className="font-pixel text-[10px] mb-1 opacity-80">XP</span>
          <span className="font-pixel text-sm">+{achievement.xpReward}</span>
        </div>
      </div>
    )
  }

  const globalDefs = getGlobalAchievements()
  const adventureDefs = getAdventureAchievements()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-md sm:p-lg">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-background-deep border-[3px] border-secondary shadow-panel pixel-borders flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 px-6 py-4 border-b-2 border-secondary/50 flex justify-between items-center bg-background">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-secondary" />
                <h2 className="font-heading text-title-section text-secondary tracking-widest uppercase text-glow">
                  Achievement Book
                </h2>
              </div>
              <button onClick={onClose} className="text-secondary hover:text-secondary-foreground transition-hover">
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              
              {/* Global Section */}
              <div className="mb-10">
                <div className="flex items-end justify-between border-b border-gray-700 pb-2 mb-6">
                  <h3 className="font-heading text-xl text-gray-300 tracking-wider">Koleksi Global</h3>
                  <span className="font-pixel text-xs text-gray-500">{globalUnlockedMap.size} / {globalDefs.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {globalDefs.map(ach => renderAchievementCard(ach, "global"))}
                </div>
              </div>

              {/* Adventure Section */}
              <div>
                <div className="flex items-end justify-between border-b border-gray-700 pb-2 mb-6">
                  <h3 className="font-heading text-xl text-gray-300 tracking-wider">
                    Petualangan: <span className="text-secondary">{activeAdventure?.worldName || "Dunia Tidak Dikenal"}</span>
                  </h3>
                  <span className="font-pixel text-xs text-gray-500">{adventureUnlockedMap.size} / {adventureDefs.length}</span>
                </div>
                {!activeAdventure ? (
                  <p className="text-gray-500 font-sans text-center italic py-8">
                    Tidak ada petualangan aktif. Masuk ke sebuah dunia untuk melihat pencapaian lokal.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {adventureDefs.map(ach => renderAchievementCard(ach, "adventure"))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  // Use createPortal to ensure the modal is mounted at the root of the DOM
  // This prevents parent containers with transform, filter, or overflow from breaking position: fixed
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}
