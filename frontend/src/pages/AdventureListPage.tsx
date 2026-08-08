import React from "react"
import { useNavigate, Link } from "react-router-dom"
// removed motion
import { Sword, Trash2, Play, Calendar, Trophy, Coins } from "lucide-react"
import questifyLogo from "@/assets/questify-q-logo.png"
import { MapBackground } from "@/components/map/MapBackground"

import { useAdventureStore } from "@/store/useAdventureStore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MotionButton } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/common/AnimationWrapper"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export const AdventureListPage: React.FC = () => {
  const { adventures, activeAdventureId, setActiveAdventure, deleteAdventure } = useAdventureStore()
  const navigate = useNavigate()

  const handlePlay = (id: string) => {
    setActiveAdventure(id)
    navigate("/map")
  }

  const handleDelete = (id: string) => {
    deleteAdventure(id)
  }

  return (
    <div className="min-h-screen bg-slate-950/90 relative selection:bg-primary/30 font-sans overflow-hidden">
      <MapBackground />
      
      {/* Navbar Minimalist */}
      <nav className="relative z-10 h-20 border-b border-secondary/20 bg-background/80 backdrop-blur-md px-4 md:px-8 flex items-center shadow-panel">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center shadow-glow-quest bg-black/50 rounded overflow-hidden border border-primary/50">
            <img src={questifyLogo} alt="Questify Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-heading font-bold text-xl tracking-wider text-glow text-secondary hidden lg:block">
            QUESTIFY
          </span>
        </Link>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        <FadeIn>
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-glow mb-4 text-white">Petualanganku</h1>
            <p className="text-muted-foreground text-lg">Daftar dunia dan silabus yang sedang kamu jelajahi. Pilih petualanganmu.</p>
          </div>
        </FadeIn>

        {adventures.length === 0 ? (
          <SlideUp>
            <div className="text-center py-20 bg-card/30 rounded-3xl border border-border/50">
              <Sword className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
              <h2 className="text-2xl font-heading text-foreground mb-4">Belum Ada Petualangan</h2>
              <p className="text-muted-foreground mb-8">Kamu belum memiliki dunia untuk dijelajahi. Mulailah perjalananmu sekarang.</p>
              <MotionButton size="lg" onClick={() => navigate("/")} className="font-pixel text-sm">
                Mulai Petualangan
              </MotionButton>
            </div>
          </SlideUp>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adventures.map((adv, idx) => {
              const isSelected = activeAdventureId === adv.id
              const completedQuests = adv.nodes.filter(n => n.status === "completed").length
              
              return (
                <SlideUp key={adv.id} style={{ transitionDelay: `${idx * 100}ms` }}>
                  <Card className={`relative flex flex-col h-full overflow-hidden transition-all transition-hover hover:scale-[1.02] ${isSelected ? 'border-primary shadow-glow-quest bg-primary/5' : 'border-border/50 bg-card/80'}`}>
                    
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-pixel px-3 py-1 rounded-bl-lg">
                        AKTIF
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="w-full pr-12 overflow-hidden">
                          <CardTitle className="font-heading text-xl md:text-2xl text-foreground mb-1 break-words whitespace-normal leading-tight">{adv.worldName}</CardTitle>
                          <div className="text-secondary font-pixel text-xs break-all line-clamp-2 mt-2">{adv.courseName}</div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-pixel text-muted-foreground">Level / XP</span>
                            <span className="font-sans font-bold text-sm">{adv.level} <span className="text-muted-foreground font-normal text-xs">({adv.xp}/{adv.maxXp})</span></span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sword className="w-4 h-4 text-destructive" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-pixel text-muted-foreground">Progress</span>
                            <span className="font-sans font-bold text-sm">{completedQuests} / {adv.nodes.length} Quest</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-secondary" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-pixel text-muted-foreground">Gold</span>
                            <span className="font-sans font-bold text-sm">{adv.gold}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-pixel text-muted-foreground">Terakhir Main</span>
                            <span className="font-sans font-medium text-xs">{new Date(adv.lastPlayedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <MotionButton 
                          className="flex-1 font-pixel text-xs gap-2" 
                          variant={isSelected ? "default" : "secondary"}
                          onClick={() => handlePlay(adv.id)}
                        >
                          <Play className="w-4 h-4" /> Mainkan
                        </MotionButton>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <MotionButton variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10 px-3">
                              <Trash2 className="w-4 h-4" />
                            </MotionButton>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-card border-destructive/50">
                            <DialogHeader>
                              <DialogTitle className="font-heading text-destructive text-xl">Hapus Petualangan?</DialogTitle>
                              <DialogDescription className="font-sans text-muted-foreground mt-2">
                                Apakah kamu yakin ingin menghapus <strong>{adv.worldName}</strong>? Seluruh progress (Level, XP, Gold) pada petualangan ini akan hilang selamanya.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
                              <DialogTrigger asChild>
                                <Button variant="ghost">Batal</Button>
                              </DialogTrigger>
                              <DialogTrigger asChild>
                                <Button variant="destructive" onClick={() => handleDelete(adv.id)}>Ya, Hapus Dunia</Button>
                              </DialogTrigger>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </SlideUp>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
