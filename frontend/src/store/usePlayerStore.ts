import { create } from 'zustand'

import { useAchievementUIStore } from './useAchievementUIStore'

export interface PlayerState {
  name: string
  role: string | null
  avatarId: string | null
  globalAchievements: { id: string; unlockedAt: number }[]
  
  setName: (name: string) => void
  setRole: (role: string) => void
  setAvatarId: (avatarId: string) => void
  unlockGlobalAchievement: (id: string) => void
  resetPlayer: () => void
  loadFromCloud: (cloudData: any) => void
}

const INITIAL_STATE = {
  name: "Hero",
  role: null,
  avatarId: null,
  globalAchievements: [],
}

export const usePlayerStore = create<PlayerState>()((set) => ({
      ...INITIAL_STATE,

      setName: (name) => set(state => {
        const newState = { ...state, name }
        import('@/services/cloudSync.service').then(({ cloudSyncService }) => {
          cloudSyncService.syncProfile(newState.name, newState.role, newState.globalAchievements)
        })
        return { name }
      }),

      setRole: (role) => set(state => {
        const newState = { ...state, role }
        import('@/services/cloudSync.service').then(({ cloudSyncService }) => {
          cloudSyncService.syncProfile(newState.name, newState.role, newState.globalAchievements)
        })
        return newState
      }),

      setAvatarId: (avatarId) => set({ avatarId }),
      
      unlockGlobalAchievement: (id) => {
        let wasUnlocked = false
        set(state => {
          if (!state.globalAchievements.find(a => a.id === id)) {
            wasUnlocked = true
            const newAchievements = [...state.globalAchievements, { id, unlockedAt: Date.now() }]
            
            import('@/services/cloudSync.service').then(({ cloudSyncService }) => {
              cloudSyncService.syncProfile(state.name, state.role, newAchievements)
            })

            return {
              globalAchievements: newAchievements
            }
          }
          return state
        })
        
        if (wasUnlocked) {
          useAchievementUIStore.getState().enqueuePopup(id)
        }
      },

      resetPlayer: () => set(INITIAL_STATE),
      
      loadFromCloud: (cloudData) => set({
        name: cloudData.name || "Hero",
        role: cloudData.role || null,
        avatarId: cloudData.avatarId || null,
        globalAchievements: cloudData.globalAchievements || [],
      })
    }))
