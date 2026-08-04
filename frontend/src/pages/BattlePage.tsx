import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Skull, Swords, ShieldAlert, Coins } from "lucide-react"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useAdventureStore } from "@/store/useAdventureStore"
import { usePlayerStore } from "@/store/usePlayerStore"
import { useBattleStore } from "@/store/useBattleStore"
import { generateQuiz } from "@/services/ai.service"
import { BossCard } from "@/components/common/BossCard"
import { ProgressBar } from "@/components/common/ProgressBar"
import { Card } from "@/components/ui/card"
import { MotionButton } from "@/components/ui/button"
import { SlideUp, Shake, ScaleIn } from "@/components/common/AnimationWrapper"
import { BattleBackground } from "@/components/battle/BattleBackground"

export const BattlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const activeAdventure = useAdventureStore(state => state.getActive())
  const completeNode = useAdventureStore(state => state.completeNode)
  const gainXp = useAdventureStore(state => state.gainXp)
  const gainGold = useAdventureStore(state => state.gainGold)
  const unlockAchievement = useAdventureStore(state => state.unlockAchievement)
  const nodes = activeAdventure?.nodes || []
  
  const { name } = usePlayerStore()
  const battle = useBattleStore()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Animation triggers
  const [bossHit, setBossHit] = useState(false)
  const [playerHit, setPlayerHit] = useState(false)
  
  // Tracking selected answer for visual feedback before applying damage
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerState, setAnswerState] = useState<"correct" | "wrong" | null>(null)

  const node = nodes.find(n => n.id === id)

  useEffect(() => {
    if (!node) return
    
    if (battle.status === "active" && battle.currentBossId === id) return

    const fetchQuiz = async () => {
      setIsLoading(true)
      try {
        const context = `Berikan kuis pertarungan bos yang sulit untuk menguji pengetahuan tentang ${node.title}: ${node.description}`
        const result = await generateQuiz(node.title, context, 5)
        
        battle.initBattle(node.id, result.bossName, result.questions)
      } catch {
        setError("Gagal memanggil Bos. Silakan periksa Koneksi atau API Key Anda.")
      } finally {
        setIsLoading(false)
      }
    }

    if (battle.status === "idle" || battle.status === "victory" || battle.status === "lose") {
      fetchQuiz()
    }
  }, [node, id, battle.status, battle.currentBossId, battle])

  if (isLoading) {
    return (
      <DashboardLayout variant="quest">
        <BattleBackground />
        <div className="flex-1 relative overflow-y-auto w-full pt-24 md:pt-20">
          <div className="min-h-full flex flex-col items-center justify-center p-6 text-center">
            <AnimatePresence>
              <ScaleIn>
                <Skull className="w-32 h-32 text-destructive mb-8 animate-pulse drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] mx-auto" />
                <h1 className="font-heading text-5xl text-destructive text-glow mb-4 uppercase tracking-widest">Memanggil Bos...</h1>
                <p className="font-pixel text-secondary text-sm">Menyiapkan arena pertarungan gelap...</p>
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
                      className="h-full bg-secondary shadow-[0_0_8px_rgba(245,158,11,0.8)]"
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
        <div className="flex flex-col flex-1 gap-10 mt-6">
            
          {/* Top: Boss */}
          {battle.status === "active" && (
            <div className="flex justify-center pt-8 mb-4">
              <SlideUp>
                <BossCard 
                  name={battle.bossName} 
                  currentHp={battle.bossHp} 
                  maxHp={battle.maxBossHp} 
                  isHit={bossHit} 
                />
              </SlideUp>
            </div>
          )}

          {/* Center: Quiz or Result */}
          <div className="flex-1 flex flex-col items-center w-full">
            <AnimatePresence mode="wait">
              {battle.status === "active" && currentQuestion && (
                <motion.div 
                  key={`q-${battle.currentQuestionIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl flex flex-col gap-8"
                >
                  {/* Question Card */}
                  <Card className="border-secondary/50 box-glow-gold p-8 md:p-10 text-center bg-[#0F172A]/90 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />
                    <ShieldAlert className="w-12 h-12 text-secondary/20 absolute top-4 left-4" />
                    
                    <h3 className="font-sans text-2xl md:text-3xl leading-relaxed text-foreground font-medium drop-shadow-md relative z-10">
                      {currentQuestion.question}
                    </h3>
                  </Card>
                  
                  {/* Answer Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = selectedAnswer === idx
                      let cardStateClass = "border-primary/30 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(109,40,217,0.4)]"
                      let iconColor = "text-primary/50"
                      
                      if (isSelected) {
                        if (answerState === "correct") {
                          cardStateClass = "border-success bg-success/20 shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                          iconColor = "text-success"
                        } else if (answerState === "wrong") {
                          cardStateClass = "border-destructive bg-destructive/20 shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-95"
                          iconColor = "text-destructive"
                        } else {
                          cardStateClass = "border-secondary bg-secondary/20 shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-105"
                          iconColor = "text-secondary"
                        }
                      } else if (selectedAnswer !== null) {
                        cardStateClass = "border-border/50 bg-background/50 opacity-50 grayscale"
                      }

                      return (
                        <motion.button
                          key={idx}
                          whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                          whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                          className={`relative text-left p-6 rounded-xl border-2 transition-all duration-300 flex items-start gap-4 ${cardStateClass}`}
                          onClick={() => handleAnswer(idx)}
                          disabled={selectedAnswer !== null}
                        >
                          <div className={`w-8 h-8 rounded bg-background/50 flex items-center justify-center font-pixel text-sm shrink-0 border border-current ${iconColor}`}>
                            {['A','B','C','D'][idx]}
                          </div>
                          <span className="font-sans text-lg text-foreground leading-relaxed mt-0.5">
                            {opt}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {battle.status === "victory" && (
                <ScaleIn key="victory" className="text-center flex flex-col items-center gap-8 py-20">
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                    className="w-40 h-40 rounded-full bg-success/20 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.8)] border-4 border-success"
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

                  <MotionButton size="lg" className="mt-8 font-pixel px-12 py-6 text-lg hover:shadow-[0_0_20px_rgba(109,40,217,0.8)]" onClick={handleVictory}>
                    KLAIM HADIAH
                  </MotionButton>
                </ScaleIn>
              )}

              {battle.status === "lose" && (
                <ScaleIn key="lose" className="text-center flex flex-col items-center gap-8 py-20">
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-40 h-40 rounded-full bg-destructive/20 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.8)] border-4 border-destructive"
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
    </div>

      {/* Fixed Bottom Player Stats */}
      {battle.status === "active" && (
        <div className="fixed bottom-0 left-0 w-full p-4 pointer-events-none z-50 flex justify-center">
          <SlideUp className="pointer-events-auto">
            <Shake trigger={playerHit}>
              <Card className="w-96 border-2 border-primary/50 bg-[#0F172A]/90 backdrop-blur-md p-4 flex items-center gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] rounded-2xl">
                <div className="w-16 h-16 bg-muted rounded-xl pixel-border border-secondary flex items-center justify-center text-3xl shadow-inner">
                  🛡️
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-pixel">
                    <span className="text-primary drop-shadow-md text-glow">{name}</span>
                    <motion.span 
                      key={battle.playerHp}
                      initial={{ scale: 1.5, color: "#ef4444" }}
                      animate={{ scale: 1, color: "#f87171" }}
                      className="text-destructive drop-shadow-md"
                    >
                      {battle.playerHp}/{battle.maxPlayerHp} HP
                    </motion.span>
                  </div>
                  <div className="relative p-1 bg-black/50 rounded-full border border-destructive/30 shadow-inner">
                    <ProgressBar 
                      progress={(battle.playerHp / battle.maxPlayerHp) * 100} 
                      colorClass="bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.8)]" 
                      bgClass="bg-transparent"
                      heightClass="h-4"
                    />
                  </div>
                </div>
              </Card>
            </Shake>
          </SlideUp>
        </div>
      )}

    </DashboardLayout>
  )
}
