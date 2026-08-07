import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAchievementUIStore } from './useAchievementUIStore'

export interface PlayerState {
  name: string
  globalAchievements: { id: string; unlockedAt: number }[]
  
  setName: (name: string) => void
  unlockGlobalAchievement: (id: string) => void
  resetPlayer: () => void
}

const INITIAL_STATE = {
  name: "Hero",
  globalAchievements: [],
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setName: (name) => set({ name }),
      
      unlockGlobalAchievement: (id) => {
        let wasUnlocked = false
        set(state => {
          if (!state.globalAchievements.find(a => a.id === id)) {
            wasUnlocked = true
            return {
              globalAchievements: [...state.globalAchievements, { id, unlockedAt: Date.now() }]
            }
          }
          return state
        })
        
        if (wasUnlocked) {
          useAchievementUIStore.getState().enqueuePopup(id)
        }
      },

      resetPlayer: () => set(INITIAL_STATE)
    }),
    {
      name: 'questify-player-storage'
    }
  )
)
