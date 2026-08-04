import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// removed uuid import
type NodeStatus = "locked" | "available" | "completed"

export interface QuestNodeModel {
  id: string
  title: string
  description: string
  isBoss: boolean
  status: NodeStatus
}

interface Adventure {
  id: string
  courseName: string // Optional, could be derived from filename or just default
  worldName: string
  createdAt: number
  lastPlayedAt: number
  
  // Progress
  level: number
  xp: number
  maxXp: number
  gold: number
  achievements: string[]
  
  // Nodes
  nodes: QuestNodeModel[]
  activeNodeId: string | null
}

export interface AdventureState {
  adventures: Adventure[]
  activeAdventureId: string | null
  
  // Adventure Management Actions
  createNewAdventure: (courseName: string, worldName: string, nodes: Omit<QuestNodeModel, 'status'>[]) => void
  setActiveAdventure: (id: string) => void
  deleteAdventure: (id: string) => void
  
  // Active Adventure Mutations
  gainXp: (amount: number) => void
  gainGold: (amount: number) => void
  unlockAchievement: (achievement: string) => void
  completeNode: (nodeId: string) => void
  resetActiveAdventureQuests: () => void
  
  // Helper Getters
  getActive: () => Adventure | null
}

const INITIAL_ADVENTURE_STATE = {
  level: 1,
  xp: 0,
  maxXp: 100,
  gold: 0,
  achievements: [],
}

export const useAdventureStore = create<AdventureState>()(
  persist(
    (set, get) => ({
      adventures: [],
      activeAdventureId: null,

      getActive: () => {
        const { adventures, activeAdventureId } = get()
        return adventures.find(a => a.id === activeAdventureId) || null
      },

      createNewAdventure: (courseName, worldName, nodes) => {
        const mappedNodes = nodes.map((n, idx) => ({
          ...n,
          status: (idx === 0 ? "available" : "locked") as any
        }))
        
        const newAdventure: Adventure = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
          courseName,
          worldName,
          createdAt: Date.now(),
          lastPlayedAt: Date.now(),
          ...INITIAL_ADVENTURE_STATE,
          nodes: mappedNodes,
          activeNodeId: mappedNodes[0]?.id || null,
        }

        set(state => ({
          adventures: [...state.adventures, newAdventure],
          activeAdventureId: newAdventure.id
        }))
      },

      setActiveAdventure: (id) => set(state => {
        // Update lastPlayedAt for the selected adventure
        const updated = state.adventures.map(a => 
          a.id === id ? { ...a, lastPlayedAt: Date.now() } : a
        )
        return { adventures: updated, activeAdventureId: id }
      }),

      deleteAdventure: (id) => set(state => {
        const remaining = state.adventures.filter(a => a.id !== id)
        return {
          adventures: remaining,
          activeAdventureId: state.activeAdventureId === id 
            ? (remaining.length > 0 ? remaining[0].id : null)
            : state.activeAdventureId
        }
      }),

      gainXp: (amount) => set(state => {
        const { activeAdventureId, adventures } = state
        if (!activeAdventureId) return state

        return {
          adventures: adventures.map(adv => {
            if (adv.id !== activeAdventureId) return adv

            let newXp = adv.xp + amount
            let newLevel = adv.level
            let newMaxXp = adv.maxXp

            while (newXp >= newMaxXp) {
              newXp -= newMaxXp
              newLevel += 1
              newMaxXp = Math.floor(newMaxXp * 1.5)
            }

            return { ...adv, xp: newXp, level: newLevel, maxXp: newMaxXp, lastPlayedAt: Date.now() }
          })
        }
      }),

      gainGold: (amount) => set(state => {
        const { activeAdventureId, adventures } = state
        if (!activeAdventureId) return state
        
        return {
          adventures: adventures.map(adv => 
            adv.id === activeAdventureId 
              ? { ...adv, gold: adv.gold + amount, lastPlayedAt: Date.now() } 
              : adv
          )
        }
      }),

      unlockAchievement: (achievement) => set(state => {
        const { activeAdventureId, adventures } = state
        if (!activeAdventureId) return state
        
        return {
          adventures: adventures.map(adv => 
            adv.id === activeAdventureId && !adv.achievements.includes(achievement)
              ? { ...adv, achievements: [...adv.achievements, achievement], lastPlayedAt: Date.now() }
              : adv
          )
        }
      }),

      completeNode: (nodeId) => set(state => {
        const { activeAdventureId, adventures } = state
        if (!activeAdventureId) return state

        return {
          adventures: adventures.map(adv => {
            if (adv.id !== activeAdventureId) return adv

            const currentIndex = adv.nodes.findIndex(n => n.id === nodeId)
            if (currentIndex === -1) return adv

            const newNodes = [...adv.nodes]
            newNodes[currentIndex] = { ...newNodes[currentIndex], status: "completed" }

            let newActiveId = adv.activeNodeId

            if (currentIndex + 1 < newNodes.length) {
              newNodes[currentIndex + 1] = { ...newNodes[currentIndex + 1], status: "available" }
              newActiveId = newNodes[currentIndex + 1].id
            }

            return { ...adv, nodes: newNodes, activeNodeId: newActiveId, lastPlayedAt: Date.now() }
          })
        }
      }),

      resetActiveAdventureQuests: () => set(state => {
        const { activeAdventureId, adventures } = state
        if (!activeAdventureId) return state
        
        return {
          adventures: adventures.map(adv => {
            if (adv.id !== activeAdventureId) return adv
            const mappedNodes = adv.nodes.map((n, idx) => ({
              ...n,
              status: (idx === 0 ? "available" : "locked") as any
            }))
            return {
              ...adv,
              nodes: mappedNodes,
              activeNodeId: mappedNodes[0]?.id || null,
              lastPlayedAt: Date.now()
            }
          })
        }
      })
    }),
    {
      name: 'questify-adventure-storage',
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return

        // Migration Logic from Old Storage to New Storage
        if (state.adventures.length === 0) {
          try {
            const oldPlayerStr = localStorage.getItem('questify-player-storage')
            const oldMapStr = localStorage.getItem('questify-map-storage')
            
            if (oldMapStr) {
              const oldMap = JSON.parse(oldMapStr)
              const oldPlayer = oldPlayerStr ? JSON.parse(oldPlayerStr) : null
              
              if (oldMap.state && oldMap.state.nodes && oldMap.state.nodes.length > 0) {
                // We have old data to migrate
                const migratedAdventure: Adventure = {
                  id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
                  courseName: "Materi Terunggah",
                  worldName: oldMap.state.worldName || "The Kingdom of Databaseia",
                  createdAt: Date.now(),
                  lastPlayedAt: Date.now(),
                  level: oldPlayer?.state?.level || 1,
                  xp: oldPlayer?.state?.xp || 0,
                  maxXp: oldPlayer?.state?.maxXp || 100,
                  gold: oldPlayer?.state?.gold || 0,
                  achievements: oldPlayer?.state?.achievements || [],
                  nodes: oldMap.state.nodes,
                  activeNodeId: oldMap.state.activeNodeId || null
                }
                
                // Use setState to properly trigger re-renders and save
                useAdventureStore.setState({
                  adventures: [migratedAdventure],
                  activeAdventureId: migratedAdventure.id
                })
                
                localStorage.removeItem('questify-map-storage')
              }
            }
          } catch {
            // Migration failed, silently ignore
          }
        }
      }
    }
  )
)
