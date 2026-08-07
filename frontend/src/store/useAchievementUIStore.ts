import { create } from 'zustand'

interface AchievementQueueItem {
  id: string
  achievementId: string
}

interface AchievementUIState {
  queue: AchievementQueueItem[]
  isPopupActive: boolean
  
  enqueuePopup: (achievementId: string) => void
  setPopupActive: (active: boolean) => void
  shiftQueue: () => void
}

export const useAchievementUIStore = create<AchievementUIState>((set) => ({
  queue: [],
  isPopupActive: false,

  enqueuePopup: (achievementId) => set((state) => ({
    queue: [...state.queue, { id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2), achievementId }]
  })),

  setPopupActive: (active) => set({ isPopupActive: active }),

  shiftQueue: () => set((state) => ({
    queue: state.queue.slice(1)
  }))
}))
