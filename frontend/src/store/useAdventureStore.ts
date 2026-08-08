import { create } from 'zustand'

import { useAchievementUIStore } from './useAchievementUIStore'
import { usePlayerStore } from './usePlayerStore'
import { ACH_FIRST_ADVENTURE, ACH_LEVEL_MASTER, ACH_QUEST_MASTER, ACH_EXPLORER } from '../data/achievements'
// removed uuid import
type NodeStatus = "locked" | "available" | "completed"

export interface QuestNodeModel {
  id: string
  title: string
  description: string
  isBoss: boolean
  status: NodeStatus
  chapterTheme?: string
  boss?: {
    name: string
    description: string
  }
}

interface Adventure {
  id: string
  courseName: string // Optional, could be derived from filename or just default
  worldName: string
  createdAt: number
  lastPlayedAt: number
  
  // World Identity
  worldSubtitle?: string
  worldDescription?: string
  worldElement?: string
  difficulty?: string
  openingNarration?: string
  theme?: {
    id: string
    palette: string
    terrain: string
    atmosphere: string
  }
  
  // Metadata
  worldIcon?: string
  estimatedPlayTime?: string
  completionReward?: string
  
  // States
  hasSeenIntro?: boolean
  
  // Progress
  level: number
  xp: number
  maxXp: number
  gold: number
  achievements: { id: string; unlockedAt: number }[]
  
  // Nodes
  nodes: QuestNodeModel[]
  activeNodeId: string | null
}

export interface AdventureState {
  adventures: Adventure[]
  activeAdventureId: string | null
  
  // Adventure Management Actions
  createNewAdventure: (courseName: string, worldName: string, nodes: Omit<QuestNodeModel, 'status'>[], identity?: Partial<Adventure>) => void
  setActiveAdventure: (id: string) => void
  deleteAdventure: (id: string) => void
  markIntroAsSeen: (id: string) => void
  
  // Active Adventure Mutations
  gainXp: (amount: number) => void
  gainGold: (amount: number) => void
  unlockAchievement: (achievement: string) => void
  completeNode: (nodeId: string) => void
  resetActiveAdventureQuests: () => void
  
  // Helper Getters
  getActive: () => Adventure | null
  
  // Cloud Sync
  loadFromCloud: (adventures: Adventure[]) => void
  resetAdventures: () => void
}

const INITIAL_ADVENTURE_STATE = {
  level: 1,
  xp: 0,
  maxXp: 100,
  gold: 0,
  achievements: [],
}

export const useAdventureStore = create<AdventureState>()(
    (set, get) => ({
      adventures: [],
      activeAdventureId: null,

      getActive: () => {
        const { adventures, activeAdventureId } = get()
        return adventures.find(a => a.id === activeAdventureId) || null
      },

      createNewAdventure: (courseName, worldName, nodes, identity) => {
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
          hasSeenIntro: false,
          ...identity
        }

        set(state => ({
          adventures: [...state.adventures, newAdventure],
          activeAdventureId: newAdventure.id
        }))

        // Trigger First Adventure Achievement
        const playerStore = usePlayerStore.getState()
        if (!playerStore.globalAchievements.find(a => a.id === ACH_FIRST_ADVENTURE)) {
          playerStore.unlockGlobalAchievement(ACH_FIRST_ADVENTURE)
        }
        
        import('@/services/cloudSync.service').then(({ cloudSyncService }) => {
          cloudSyncService.syncAdventureImmediate(newAdventure)
        })
      },

      setActiveAdventure: (id) => set(state => {
        // Update lastPlayedAt for the selected adventure
        const updated = state.adventures.map(a => 
          a.id === id ? { ...a, lastPlayedAt: Date.now() } : a
        )
        return { adventures: updated, activeAdventureId: id }
      }),

      markIntroAsSeen: (id) => set(state => {
        const updated = state.adventures.map(a =>
          a.id === id ? { ...a, hasSeenIntro: true } : a
        )
        const adv = updated.find(a => a.id === id)
        if (adv) {
          import('@/services/cloudSync.service').then(({ cloudSyncService }) => {
            cloudSyncService.syncAdventure(adv)
          })
        }
        return { adventures: updated }
      }),

      deleteAdventure: (id) => set(state => {
        const remaining = state.adventures.filter(a => a.id !== id)
        
        import('@/services/cloudSync.service').then(({ cloudSyncService }) => {
          cloudSyncService.deleteAdventure(id)
        })
        
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

        const newState = {
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

        // Post-update: check for Level Master achievement
        const updatedAdv = newState.adventures.find((a: Adventure) => a.id === activeAdventureId)
        if (updatedAdv && updatedAdv.level >= 5) {
          const playerStore = usePlayerStore.getState()
          if (!playerStore.globalAchievements.find((a: { id: string }) => a.id === ACH_LEVEL_MASTER)) {
            playerStore.unlockGlobalAchievement(ACH_LEVEL_MASTER)
          }
        }
        
        if (updatedAdv) {
          import('@/services/cloudSync.service').then(({ cloudSyncService }) => {
            cloudSyncService.syncAdventure(updatedAdv)
          })
        }

        return newState
      }),

      gainGold: (amount) => set(state => {
        const { activeAdventureId, adventures } = state
        if (!activeAdventureId) return state
        
        const updatedAdv = adventures.find(a => a.id === activeAdventureId)
        if (updatedAdv) {
          const syncedAdv = { ...updatedAdv, gold: updatedAdv.gold + amount, lastPlayedAt: Date.now() }
          import('@/services/cloudSync.service').then(({ cloudSyncService }) => {
            cloudSyncService.syncAdventure(syncedAdv)
          })
        }
        
        return {
          adventures: adventures.map(adv => 
            adv.id === activeAdventureId 
              ? { ...adv, gold: adv.gold + amount, lastPlayedAt: Date.now() } 
              : adv
          )
        }
      }),

      unlockAchievement: (achievementId) => set(state => {
        const { activeAdventureId, adventures } = state
        if (!activeAdventureId) return state
        
        let wasUnlocked = false
        const newState = {
          adventures: adventures.map(adv => {
            if (adv.id === activeAdventureId && !adv.achievements.find(a => a.id === achievementId)) {
              wasUnlocked = true
              return { ...adv, achievements: [...adv.achievements, { id: achievementId, unlockedAt: Date.now() }], lastPlayedAt: Date.now() }
            }
            return adv
          })
        }
        
        if (wasUnlocked) {
          useAchievementUIStore.getState().enqueuePopup(achievementId)
          const updatedAdv = newState.adventures.find(a => a.id === activeAdventureId)
          if (updatedAdv) {
            import('@/services/cloudSync.service').then(({ cloudSyncService }) => {
              cloudSyncService.syncAdventure(updatedAdv)
            })
          }
        }
        
        return newState
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

            // Check if all non-boss quests are completed
            const allQuestsCompleted = newNodes.filter(n => !n.isBoss).every(n => n.status === "completed")
            
            // Check if final boss is now available
            const finalBossAvailable = newNodes.find(n => n.isBoss)?.status === "available"
            
            const newAdv = { ...adv, nodes: newNodes, activeNodeId: newActiveId, lastPlayedAt: Date.now() }
            
            if (allQuestsCompleted && !newAdv.achievements.find(a => a.id === ACH_QUEST_MASTER)) {
              newAdv.achievements.push({ id: ACH_QUEST_MASTER, unlockedAt: Date.now() })
              useAchievementUIStore.getState().enqueuePopup(ACH_QUEST_MASTER)
            }
            if (finalBossAvailable && !newAdv.achievements.find(a => a.id === ACH_EXPLORER)) {
              newAdv.achievements.push({ id: ACH_EXPLORER, unlockedAt: Date.now() })
              useAchievementUIStore.getState().enqueuePopup(ACH_EXPLORER)
            }
            
            import('@/services/cloudSync.service').then(({ cloudSyncService }) => {
              cloudSyncService.syncAdventure(newAdv)
            })
            
            return newAdv
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
            const newAdv = {
              ...adv,
              nodes: mappedNodes,
              activeNodeId: mappedNodes[0]?.id || null,
              lastPlayedAt: Date.now()
            }
            import('@/services/cloudSync.service').then(({ cloudSyncService }) => {
              cloudSyncService.syncAdventure(newAdv)
            })
            return newAdv
          })
        }
      }),

      loadFromCloud: (adventures) => set({ 
        adventures, 
        activeAdventureId: adventures.length > 0 ? adventures[0].id : null 
      }),

      resetAdventures: () => {
        set({ adventures: [], activeAdventureId: null })
      }
    })
)
