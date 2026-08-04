import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PlayerState {
  name: string
  
  setName: (name: string) => void
  resetPlayer: () => void
}

const INITIAL_STATE = {
  name: "Hero",
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setName: (name) => set({ name }),
      resetPlayer: () => set(INITIAL_STATE)
    }),
    {
      name: 'questify-player-storage'
    }
  )
)
