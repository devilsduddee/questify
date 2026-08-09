import { create } from 'zustand'

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

export const useBattleStore = create<BattleState>()((set) => ({
      ...INITIAL_STATE,

      initBattle: (bossId, bossName, questions) => {
        // Player and Boss start with strictly 100 HP
        set({
          currentBossId: bossId,
          bossName,
          questions,
          currentQuestionIndex: 0,
          playerHp: 100,
          maxPlayerHp: 100,
          bossHp: 100,
          maxBossHp: 100,
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
          // Player takes 20 damage per wrong answer
          newPlayerHp = Math.max(0, state.playerHp - 20) 
        }

        const newIndex = state.currentQuestionIndex + 1
        let newStatus: BattleStatus = state.status

        if (newBossHp <= 0) {
          newStatus = "victory"
        } else if (newPlayerHp <= 0) {
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
    }))
