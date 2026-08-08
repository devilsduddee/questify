import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ReactMarkdown from 'react-markdown'
import { BookOpen, Star, ArrowRight, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useAdventureStore } from "@/store/useAdventureStore"
import { generateSummary, LearningSummary } from "@/services/ai.service"
import { Card, CardContent } from "@/components/ui/card"
import { MotionButton } from "@/components/ui/button"
import { SlideUp, ScaleIn } from "@/components/common/AnimationWrapper"
import { Flashcard } from "@/components/common/Flashcard"
// removed ProgressBar

export const QuestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const activeAdventure = useAdventureStore(state => state.getActive())
  const completeNode = useAdventureStore(state => state.completeNode)
  const gainXp = useAdventureStore(state => state.gainXp)
  const gainGold = useAdventureStore(state => state.gainGold)
  const nodes = activeAdventure?.nodes || []

  const [summary, setSummary] = useState<LearningSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVictoryModal, setShowVictoryModal] = useState(false)

  const node = nodes.find(n => n.id === id)

  useEffect(() => {
    if (!node) return

    const fetchKnowledge = async () => {
      setIsLoading(true)
      try {
        const context = `Provide a comprehensive learning overview about ${node.title}: ${node.description}`
        const result = await generateSummary(node.title, context)
        setSummary(result)
      } catch {
        setError("Sang Pustakawan AI gagal membaca materi ini. Coba lagi nanti.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchKnowledge()
  }, [node])

  if (!activeAdventure) {
    return (
      <DashboardLayout variant="quest">
        <div className="flex-1 overflow-y-auto flex items-center justify-center flex-col gap-4 pt-24 md:pt-20">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="font-pixel text-sm text-secondary animate-pulse">Memuat Petualangan...</p>
          <MotionButton onClick={() => navigate('/')} className="mt-4">Kembali ke Beranda</MotionButton>
        </div>
      </DashboardLayout>
    )
  }

  if (!node) {
    return (
      <DashboardLayout variant="quest">
        <div className="flex-1 overflow-y-auto flex items-center justify-center flex-col gap-4 pt-24 md:pt-20">
          <h2 className="text-2xl font-heading text-destructive">Misi Tidak Ditemukan</h2>
          <MotionButton onClick={() => navigate('/map')}>Kembali ke Peta</MotionButton>
        </div>
      </DashboardLayout>
    )
  }

  const handleComplete = () => {
    completeNode(node.id)
    gainXp(100)
    gainGold(50)
    setShowVictoryModal(true)
  }

  return (
    <DashboardLayout variant="quest">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 pt-[calc(1.5rem+6rem)] md:pt-[calc(3rem+5rem)] bg-background/50">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => navigate("/map")} 
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-amber-500/30 text-amber-400 transition-all flex items-center justify-center shrink-0"
              title="Kembali ke Peta"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-glow text-primary">
              {node?.title || "Misi Tidak Diketahui"}
            </h1>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="font-pixel text-sm text-secondary animate-pulse">Menyusun materi pembelajaran...</p>
            </div>
          ) : error ? (
            <Card variant="boss" className="p-6 text-center">
              <h3 className="text-xl font-heading text-destructive mb-2">Pengetahuan Terlarang</h3>
              <p className="text-muted-foreground">{error}</p>
              <MotionButton className="mt-4" onClick={() => window.location.reload()}>Coba Lagi</MotionButton>
            </Card>
          ) : summary ? (
            <div className="flex flex-col gap-12 pb-24">
              
              {/* Learning Content */}
              <SlideUp>
                <Card variant="default" className="border-secondary/50 mb-8 p-1">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <BookOpen className="w-8 h-8 text-secondary shrink-0 mt-1" />
                      <div>
                        <h2 className="text-2xl font-heading text-secondary mb-4">Materi Bacaan Utama</h2>
                        <div className="text-lg text-foreground/90 font-sans leading-relaxed whitespace-pre-wrap prose prose-invert prose-p:mb-4">
                          <ReactMarkdown>{summary.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SlideUp>

              {/* Flashcards */}
              <div className="mb-12">
                <h3 className="text-xl font-heading text-primary mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5" /> Poin Penting
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(summary?.keyPoints || []).map((point, idx) => (
                    <ScaleIn key={idx} style={{ transitionDelay: `${idx * 150}ms` }}>
                      <Flashcard 
                        keyword={`Konsep ${idx + 1}`} 
                        definition={point.replace(/\*\*/g, '')} 
                      />
                    </ScaleIn>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end pt-6 border-t border-border/50">
                <MotionButton 
                  size="lg" 
                  onClick={handleComplete}
                  className="font-heading text-lg tracking-wide"
                >
                  Selesaikan Misi <ArrowRight className="ml-2 w-5 h-5" />
                </MotionButton>
              </div>

            </div>
          ) : null}

        </div>
      </div>

      {showVictoryModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.3)] text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 translate-x-[-100%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

              <h2 className="font-heading text-2xl text-amber-400 mb-2 drop-shadow-md">
                BERHASIL MENYELESAIKAN<br/>
                <span className="text-white">{node.title}</span>
              </h2>
              <p className="text-slate-300 font-sans text-sm mb-6">
                Selamat! Anda telah menguasai materi ini dan mendapatkan hadiah berikut:
              </p>

              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex flex-col items-center bg-slate-800/50 border border-slate-700 rounded-xl p-3 w-28 shadow-inner">
                  <span className="material-symbols-outlined text-amber-400 text-3xl mb-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">toll</span>
                  <span className="font-pixel text-amber-400 text-sm drop-shadow-md">+50 Gold</span>
                </div>
                <div className="flex flex-col items-center bg-slate-800/50 border border-slate-700 rounded-xl p-3 w-28 shadow-inner">
                  <Star className="text-purple-400 w-8 h-8 mb-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  <span className="font-pixel text-purple-400 text-sm drop-shadow-md">+100 EXP</span>
                </div>
              </div>

              <MotionButton
                onClick={() => navigate('/map')}
                className="w-full font-heading text-lg py-6 shadow-glow-quest"
              >
                Lanjutkan Petualangan
              </MotionButton>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

    </DashboardLayout>
  )
}
