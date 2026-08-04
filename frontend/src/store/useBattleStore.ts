import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { QuizQuestion } from '@/services/ai.service'

export type BattleStatus = "idle" | "loading" | "active" | "victory" | "lose"

export interface BattleState {
  currentBossId: string | null
  bossName: string
  questions: QuizQuestion[]
  currentQuestionIndex: number
  
  playerHp: number
  maxPlayerHp: number
  bossHp: number
  maxBossHp: number
  
  status: BattleStatus
  
  initBattle: (bossId: string, bossName: string, questions: QuizQuestion[]) => void
  answerQuestion: (isCorrect: boolean) => void
  resetBattle: () => void
}

const INITIAL_STATE = {
  currentBossId: null,
  bossName: "Unknown Entity",
  questions: [],
  currentQuestionIndex: 0,
  playerHp: 100,
  maxPlayerHp: 100,
  bossHp: 100,
  maxBossHp: 100,
  status: "idle" as BattleStatus
}

export const useBattleStore = create<BattleState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      initBattle: (bossId, bossName, questions) => {
        // Calculate max boss HP based on number of questions (e.g., each question deals 20 damage)
        const totalHp = questions.length * 20
        set({
          currentBossId: bossId,
          bossName,
          questions,
          currentQuestionIndex: 0,
          playerHp: 100, // Player always starts with 100 HP
          maxPlayerHp: 100,
          bossHp: totalHp,
          maxBossHp: totalHp,
          status: "active"
        })
      },

      answerQuestion: (isCorrect) => set((state) => {
        if (state.status !== "active") return state

        let newPlayerHp = state.playerHp
        let newBossHp = state.bossHp
        
        if (isCorrect) {
          newBossHp = Math.max(0, state.bossHp - 20)
        } else {
          // Player takes damage, let's say 25 damage per wrong answer
          newPlayerHp = Math.max(0, state.playerHp - 34) 
        }

        const newIndex = state.currentQuestionIndex + 1
        let newStatus: BattleStatus = state.status

        if (newBossHp <= 0) {
          newStatus = "victory"
        } else if (newPlayerHp <= 0) {
          newStatus = "lose"
        } else if (newIndex >= state.questions.length && newBossHp > 0) {
          // Ran out of questions but boss still alive
          newStatus = "lose"
        }

        return {
          playerHp: newPlayerHp,
          bossHp: newBossHp,
          currentQuestionIndex: Math.min(newIndex, state.questions.length - 1),
          status: newStatus
        }
      }),

      resetBattle: () => set(INITIAL_STATE)
    }),
    {
      name: 'questify-battle-storage'
    }
  )
)
