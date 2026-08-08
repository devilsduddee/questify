import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Skull, Swords, Coins } from "lucide-react"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useAdventureStore } from "@/store/useAdventureStore"
import { usePlayerStore } from "@/store/usePlayerStore"
import { useBattleStore } from "@/store/useBattleStore"
import { generateQuiz } from "@/services/ai.service"
import { logger } from "@/utils/logger"
import { MotionButton } from "@/components/ui/button"
import { SlideUp, ScaleIn } from "@/components/common/AnimationWrapper"
import { BattleBackground } from "@/components/battle/BattleBackground"
import { QuizArena } from "@/components/battle/QuizArena"
import { getRoleById } from "@/data/roles"

// Module-level guard to prevent duplicate concurrent AI requests across re-renders (StrictMode safe)
const quizGenerationInFlight = new Set<string>()

export const BattlePage: React.FC = () => {
  const { nodeId } = useParams<{ nodeId: string }>()
  const navigate = useNavigate()
  
  const activeAdventure = useAdventureStore(state => state.getActive())
  const completeNode = useAdventureStore(state => state.completeNode)
  const gainXp = useAdventureStore(state => state.gainXp)
  const gainGold = useAdventureStore(state => state.gainGold)
  const unlockAchievement = useAdventureStore(state => state.unlockAchievement)
  const { role, name } = usePlayerStore()
  
  const nodes = activeAdventure?.nodes || []
  
  const battle = useBattleStore()

  const [isLoading, setIsLoading] = useState(() => {
    if (battle.status === "active" && battle.currentBossId === nodeId) return false
    return true
  })
  const [error, setError] = useState<string | null>(null)
  
  // Animation triggers
  const [bossHit, setBossHit] = useState(false)
  const [playerHit, setPlayerHit] = useState(false)
  
  // Tracking selected answer for visual feedback before applying damage
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerState, setAnswerState] = useState<"correct" | "wrong" | null>(null)
  
  // Rotating loading messages
  const LOADING_MESSAGES = [
    "AI sedang membaca materi...",
    "AI sedang menyusun pertanyaan...",
    "Menyiapkan arena pertarungan...",
    "Memanggil entitas dari kegelapan..."
  ]
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)

  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isLoading])

  const node = nodes.find(n => n.id === nodeId)

  useEffect(() => {
    if (!node) return
    
    if (battle.status === "active" && battle.currentBossId === nodeId) {
      if (isLoading) setIsLoading(false)
      return
    }

    // LAYER 1: Existing Data Guard
    if ((node as any).quizData) {
      if (isLoading) {
        logger.success('Battle', '✅ Quiz loaded from cache')
        logger.info('AI', `⏭️ generateQuiz SKIPPED - existing data node=${node.id}`)
        battle.initBattle(node.id, (node as any).quizData.bossName, (node as any).quizData.questions)
        setIsLoading(false)
      }
      return
    }

    // LAYER 2: In-Flight Guard
    if (quizGenerationInFlight.has(node.id)) {
      logger.info('AI', `⏭️ generateQuiz SKIPPED - already in flight node=${node.id}`)
      return
    }

    const fetchQuiz = async () => {
      logger.info('Battle', '⚔️ Opening battle')
      logger.info('Battle', '🔍 Checking quiz cache...')
      logger.error('Battle', '❌ Quiz not found')
      
      quizGenerationInFlight.add(node.id)
      setIsLoading(true)
      
      try {
        logger.info('AI', `🤖 generateQuiz START node=${node.id}`)
        const context = `Berikan kuis pertarungan bos yang sulit untuk menguji pengetahuan tentang ${node.title}: ${node.description}`
        const roleDef = getRoleById(role)
        const result = await generateQuiz(node.title, context, 5, roleDef?.name, roleDef?.storyStyle)
        
        logger.info('AI', `✅ generateQuiz SUCCESS node=${node.id}`)
        
        // LAYER 3: Immediate State Update
        battle.initBattle(node.id, result.bossName, result.questions)
        useAdventureStore.getState().saveNodeQuiz(node.id, result)
        
        logger.info('Cloud', `☁️ quiz saved node=${node.id}`)
        logger.success('Battle', '🎯 Quiz ready')
        logger.info('Battle', '⚔️ Battle initialized')
      } catch (err) {
        setError("Gagal memanggil Bos. Silakan periksa Koneksi atau API Key Anda.")
      } finally {
        quizGenerationInFlight.delete(node.id)
        setIsLoading(false)
      }
    }

    if (battle.status === "idle" || battle.status === "victory" || battle.status === "lose") {
      fetchQuiz()
    }
  }, [node?.id, node?.title, node?.description, (node as any)?.quizData, nodeId, battle.status, battle.currentBossId, role, isLoading]) // Added strict primitive dependencies

  if (isLoading) {
    return (
      <DashboardLayout variant="quest">
        <BattleBackground />
        <div className="flex-1 relative overflow-y-auto w-full pt-24 md:pt-20">
          <div className="min-h-full flex flex-col items-center justify-center p-6 text-center">
            <AnimatePresence mode="wait">
              <ScaleIn key={loadingMsgIdx}>
                <Skull className="w-32 h-32 text-destructive mb-8 animate-pulse shadow-glow-boss mx-auto" />
                <h1 className="font-heading text-4xl md:text-5xl text-destructive text-glow mb-4 uppercase tracking-widest">
                  Memanggil Penjaga...
                </h1>
                <p className="font-pixel text-secondary text-sm h-6 opacity-90 animate-pulse">
                  {LOADING_MESSAGES[loadingMsgIdx]}
                </p>
              </ScaleIn>
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !battle.bossName) {
    return (
      <DashboardLayout variant="quest">
        <BattleBackground />
        <div className="flex-1 relative overflow-y-auto w-full pt-24 md:pt-20">
          <div className="min-h-full flex flex-col items-center justify-center p-6 text-center">
            <h1 className="font-heading text-4xl text-destructive text-glow mb-6">Pertarungan Batal</h1>
            <p className="font-sans text-muted-foreground mb-10 text-lg bg-black/50 p-4 rounded-lg">{error || "Data pertarungan tidak ditemukan."}</p>
            <MotionButton onClick={() => navigate("/map")} variant="outline" size="lg" className="border-secondary text-secondary hover:bg-secondary/20 font-pixel">
              Kembali ke Peta
            </MotionButton>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const handleAnswer = (selectedIndex: number) => {
    if (selectedAnswer !== null) return // Prevent multiple clicks

    const currentQ = battle.questions[battle.currentQuestionIndex]
    const isCorrect = selectedIndex === currentQ.answerIndex

    setSelectedAnswer(selectedIndex)
    setAnswerState(isCorrect ? "correct" : "wrong")

    setTimeout(() => {
      if (isCorrect) {
        setBossHit(true)
        setTimeout(() => setBossHit(false), 500)
      } else {
        setPlayerHit(true)
        setTimeout(() => setPlayerHit(false), 500)
      }
      battle.answerQuestion(isCorrect)
      setSelectedAnswer(null)
      setAnswerState(null)
    }, 1000)
  }

  const handleVictory = () => {
    if (node) completeNode(node.id)
    gainXp(500)
    gainGold(200)
    unlockAchievement("BOSS_SLAYER")
    battle.resetBattle()
    navigate('/map')
  }

  const handleDefeat = () => {
    battle.resetBattle()
    navigate('/map')
  }

  const currentQuestion = battle.questions[battle.currentQuestionIndex]
  const progressPercentage = (battle.currentQuestionIndex / battle.questions.length) * 100

  return (
    <DashboardLayout variant="quest">
      <BattleBackground />
      <div className="flex-1 relative overflow-y-auto custom-scrollbar w-full pt-[calc(1rem+6rem)] md:pt-[calc(2rem+5rem)] pb-32">
        <div className="max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col">
        
        {/* Quest Header */}
        {battle.status === "active" && (
          <SlideUp className="mb-8">
            <div className="bg-[#1E293B]/90 backdrop-blur-md border-b-2 border-primary/50 shadow-lg rounded-b-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-destructive/20 text-destructive font-pixel text-[10px] px-2 py-0.5 rounded border border-destructive/50">HARD</span>
                  <span className="bg-secondary/20 text-secondary font-pixel text-[10px] px-2 py-0.5 rounded border border-secondary/50">BOSS BATTLE</span>
                </div>
                <h1 className="font-heading text-2xl text-foreground text-glow">{node?.title}</h1>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <span className="font-pixel text-[10px] text-muted-foreground mb-1">REWARD</span>
                  <div className="flex gap-3 font-pixel text-sm">
                    <span className="text-primary">+500 XP</span>
                    <span className="text-secondary flex items-center gap-1"><Coins className="w-3 h-3" />200</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-border/50 hidden md:block" />
                <div className="flex flex-col items-end min-w-[120px]">
                  <span className="font-pixel text-[10px] text-muted-foreground mb-2">PROGRESS {battle.currentQuestionIndex + 1}/{battle.questions.length}</span>
                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-border">
                    <motion.div 
                      className="h-full bg-secondary shadow-glow-achievement"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SlideUp>
        )}

          {/* Battle Arena */}
          <div className="flex flex-col flex-1 mt-6">
            <AnimatePresence mode="wait">
              {battle.status === "active" && (
                <motion.div
                  key="active-battle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <QuizArena
                    bossName={battle.bossName}
                    bossHp={battle.bossHp}
                    maxBossHp={battle.maxBossHp}
                    playerName={name}
                    playerHp={battle.playerHp}
                    maxPlayerHp={battle.maxPlayerHp}
                    currentQuestion={currentQuestion || null}
                    selectedAnswer={selectedAnswer}
                    answerState={answerState}
                    onAnswer={handleAnswer}
                    bossHit={bossHit}
                    playerHit={playerHit}
                  />
                </motion.div>
              )}

              {battle.status === "victory" && (
                <ScaleIn key="victory" className="text-center flex flex-col items-center gap-8 py-20">
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                    className="w-40 h-40 rounded-full bg-success/20 flex items-center justify-center shadow-panel border-4 border-success"
                  >
                    <Trophy className="w-20 h-20 text-success" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <h2 className="font-heading text-6xl text-success text-glow uppercase tracking-widest">VICTORY</h2>
                    <p className="text-muted-foreground font-pixel text-lg">Sang Bos telah lenyap menjadi debu.</p>
                  </div>
                  
                  <div className="flex gap-8 mt-6 bg-[#1E293B]/80 backdrop-blur border border-border/50 rounded-2xl p-8 shadow-xl">
                    <div className="text-center flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary">
                        <Swords className="w-6 h-6 text-primary" />
                      </div>
                      <div className="font-pixel text-primary text-2xl drop-shadow-md">+500</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground font-pixel">XP Obtained</div>
                    </div>
                    <div className="w-px bg-border/50" />
                    <div className="text-center flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center border border-secondary">
                        <Coins className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="font-pixel text-secondary text-2xl drop-shadow-md">+200</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground font-pixel">Gold Looted</div>
                    </div>
                  </div>

                  <MotionButton size="lg" className="mt-8 font-pixel px-12 py-6 text-lg hover:shadow-glow-quest" onClick={handleVictory}>
                    KLAIM HADIAH
                  </MotionButton>
                </ScaleIn>
              )}

              {battle.status === "lose" && (
                <ScaleIn key="lose" className="text-center flex flex-col items-center gap-8 py-20">
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-40 h-40 rounded-full bg-destructive/20 flex items-center justify-center shadow-glow-boss border-4 border-destructive"
                  >
                    <Skull className="w-20 h-20 text-destructive" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <h2 className="font-heading text-6xl text-destructive text-glow uppercase tracking-widest">DEFEATED</h2>
                    <p className="text-muted-foreground font-sans text-xl bg-black/40 px-6 py-2 rounded-full border border-destructive/20">
                      Pengetahuanmu belum cukup untuk mengalahkan Bos ini.
                    </p>
                  </div>
                  
                  <MotionButton size="lg" variant="destructive" className="mt-8 font-pixel px-12 py-6 text-lg" onClick={handleDefeat}>
                    MUNDUR DAN BELAJAR
                  </MotionButton>
                </ScaleIn>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
