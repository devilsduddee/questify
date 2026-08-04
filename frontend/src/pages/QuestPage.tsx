import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, BookOpen, Star, ArrowRight } from "lucide-react"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useAdventureStore } from "@/store/useAdventureStore"
import { generateSummary, LearningSummary } from "@/services/ai.service"
import { Card, CardContent } from "@/components/ui/card"
import { Button, MotionButton } from "@/components/ui/button"
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
    navigate('/map')
  }

  return (
    <DashboardLayout variant="quest">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 pt-[calc(1.5rem+6rem)] md:pt-[calc(3rem+5rem)] bg-background/50">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" onClick={() => navigate("/map")} className="font-pixel text-xs text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" /> Peta
            </Button>
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
                        <p className="text-lg text-foreground/90 font-sans leading-relaxed whitespace-pre-wrap">
                          {summary.content}
                        </p>
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
                  {summary.keyPoints.map((point, idx) => (
                    <ScaleIn key={idx} style={{ transitionDelay: `${idx * 150}ms` }}>
                      <Flashcard 
                        keyword={`Konsep ${idx + 1}`} 
                        definition={point} 
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
    </DashboardLayout>
  )
}
