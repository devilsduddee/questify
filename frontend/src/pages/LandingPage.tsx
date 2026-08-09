import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import landingBgImg from "@/assets/landing-bg.png"
import { Target, Trophy, Play, Wand2, Sword, LogOut, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { MotionButton } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FadeIn, SlideUp, ScaleIn } from "@/components/common/AnimationWrapper"
import { QuestNode } from "@/components/common/QuestNode"
import { SyllabusUpload } from "@/features/upload/SyllabusUpload"
import { useAdventureStore } from "@/store/useAdventureStore"
import { useAuthStore } from "@/store/useAuthStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { session, appStatus } = useAuthStore()
  const adventures = useAdventureStore(state => state.adventures)
  const hasAdventures = adventures.length > 0
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  // If user is authenticated -> Render Main Menu RPG
  if (session) {
    return (
      <div 
        className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30 flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${landingBgImg})` }}
      >
        {/* Background Particles/Stars */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-secondary rounded-full animate-float" style={{ animationDelay: "0s" }} />
          <div className="absolute top-[30%] right-[15%] w-3 h-3 bg-primary rounded-full animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-[20%] left-[10%] w-2 h-2 bg-success rounded-full animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[60%] right-[30%] w-2 h-2 bg-secondary rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
        </div>

        {/* Abstract Hero Image / Map Representation in Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="relative aspect-square w-full max-w-3xl">
            <div className="absolute inset-0 bg-card rounded-full border-4 border-primary/30 shadow-glow-achievement overflow-hidden animate-pulse-glow">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-md px-4">
          <FadeIn className="flex flex-col items-center mb-12">
            <Sword className="w-16 h-16 text-secondary mb-4 drop-shadow-md" />
            <h1 className="font-heading text-6xl text-glow text-secondary tracking-widest font-bold text-center">QUESTIFY</h1>
            <p className="font-pixel text-muted-foreground text-sm mt-4 tracking-widest uppercase">The Kingdom of Knowledge</p>
          </FadeIn>

          {appStatus === 'HYDRATING' ? (
            <SlideUp className="flex flex-col items-center justify-center gap-6 w-full py-12">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-secondary/30 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <Sword className="w-6 h-6 text-secondary animate-pulse" />
              </div>
              <p className="font-pixel text-secondary text-glow animate-pulse tracking-widest uppercase text-center">
                MEMBUKA GERBANG DUNIA...
              </p>
            </SlideUp>
          ) : (
            <SlideUp className="flex flex-col items-center justify-center gap-3 w-full">
            {hasAdventures ? (
              <>
                <MotionButton 
                  size="lg" 
                  variant="default" 
                  className="w-full text-xs md:text-base px-6 py-4 font-pixel group relative overflow-hidden bg-[#1E293B] border-[3px] border-primary hover:bg-primary/20 hover:border-primary shadow-glow-quest transition-hover tracking-wider"
                  onClick={() => {
                    // Navigate to the last played adventure
                    const latest = [...adventures].sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)[0]
                    useAdventureStore.getState().setActiveAdventure(latest.id)
                    navigate('/map')
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 -translate-x-full" />
                  <Play className="mr-2 w-5 h-5 group-hover:animate-pulse text-secondary shrink-0" /> Lanjutkan Petualangan
                </MotionButton>
                
                <MotionButton 
                  size="lg" 
                  variant="outline" 
                  className="w-full text-xs md:text-base px-6 py-4 font-pixel bg-card/80 hover:bg-secondary/10 hover:border-secondary/50 hover:text-secondary transition-all group tracking-wider"
                  onClick={() => navigate('/adventures')}
                >
                  <span className="material-symbols-outlined text-amber-400 group-hover:rotate-12 transition-transform mr-2 text-base shrink-0">explore</span> Petualanganku
                </MotionButton>
              </>
            ) : (
              <div className="mb-6 text-center">
                <p className="font-pixel text-muted-foreground mb-4">Belum ada petualangan.</p>
              </div>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <MotionButton 
                  size="lg" 
                  variant={hasAdventures ? "outline" : "default"} 
                  className={`w-full whitespace-normal h-auto text-[10px] sm:text-xs md:text-sm px-4 py-3 md:px-6 md:py-4 font-pixel transition-all group tracking-wider ${
                    hasAdventures 
                      ? "bg-card/80 hover:bg-success/10 hover:border-success/50 hover:text-success" 
                      : "bg-[#1E293B] border-[3px] border-primary hover:bg-primary/20 hover:border-primary shadow-glow-quest"
                  }`}
                >
                  <span className={`material-symbols-outlined ${hasAdventures ? "text-amber-400" : "text-secondary"} group-hover:scale-110 transition-transform mr-2 text-sm md:text-base shrink-0`}>auto_awesome</span> 
                  {hasAdventures ? "Petualangan Baru" : "Buat Petualangan Pertama"}
                </MotionButton>
              </DialogTrigger>
              <DialogContent className="border-amber-500/40">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl text-secondary text-glow">Mulai Petualangan Baru</DialogTitle>
                  <DialogDescription className="font-sans text-muted-foreground">
                    Unggah silabus baru untuk membuat dunia baru. Petualangan lama Anda akan tetap aman.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <SyllabusUpload />
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Logout Button */}
            <MotionButton 
              size="lg" 
              variant="outline" 
              className="w-full text-xs md:text-sm px-6 py-4 font-pixel bg-card/80 border-border/30 text-white hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all group mt-2"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform shrink-0" /> Keluar
            </MotionButton>
          </SlideUp>
          )}

          <FadeIn className="mt-12 text-center">
            <p className="text-xs text-muted-foreground font-sans">
              &copy; {new Date().getFullYear()} Questify. All Rights Reserved.
            </p>
          </FadeIn>
        </div>
      </div>
    )
  }

  // If user is NOT authenticated -> Render Anonymous Landing
  return (
    <div 
      className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30 bg-cover bg-center"
      style={{ backgroundImage: `url(${landingBgImg})` }}
    >
      {/* Background Particles/Stars (Static representation) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-secondary rounded-full animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[30%] right-[15%] w-3 h-3 bg-primary rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[20%] left-[10%] w-2 h-2 bg-success rounded-full animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[60%] right-[30%] w-2 h-2 bg-secondary rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        
        {/* Navbar */}
        <nav className="flex justify-between items-center mb-16 px-4 py-3 bg-card/10 backdrop-blur-sm rounded-2xl border border-border/30 md:bg-transparent md:border-transparent md:backdrop-blur-none relative z-50">
          <div className="flex items-center gap-2">
            <Sword className="w-8 h-8 text-secondary" />
            <span className="font-heading text-2xl text-glow text-secondary tracking-widest font-bold">Questify</span>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="font-pixel text-xs text-muted-foreground hover:text-primary transition-colors">MASUK</Link>
            <Link to="/register" className="font-pixel text-xs bg-primary/20 border border-primary text-primary px-4 py-2 hover:bg-primary/30 transition-colors">DAFTAR</Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="flex items-center justify-center p-2 rounded-xl bg-slate-900/80 border border-amber-500/30 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-amber-400" />}
          </button>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Overlay to handle click outside */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[998] md:hidden bg-background/50 backdrop-blur-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden absolute top-[110%] right-4 left-4 z-[999] bg-slate-900/95 backdrop-blur-md border border-amber-500/50 rounded-xl p-4 shadow-2xl overflow-hidden"
                >
                  <div className="flex flex-col gap-3">
                    <Link to="/login" className="font-pixel text-sm text-center py-3 border border-border/50 rounded-lg hover:bg-slate-800 transition-colors text-slate-200" onClick={() => setIsMobileMenuOpen(false)}>MASUK</Link>
                    <Link to="/register" className="font-pixel text-sm text-center py-3 bg-primary/20 border border-primary rounded-lg text-primary hover:bg-primary/30 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>DAFTAR</Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 py-12 lg:py-24">
          <div className="flex-1 text-center lg:text-left">
            <FadeIn>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6 text-white text-glow">
                Ubah Silabusmu Menjadi <span className="text-secondary">Petualangan Epik</span>
              </h1>
            </FadeIn>
            <SlideUp>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 font-sans">
                Questify adalah platform belajar berbasis AI yang menyulap materi bacaan membosankan menjadi petualangan RPG 8-bit interaktif. Tingkatkan level pengetahuanmu hari ini!
              </p>
            </SlideUp>
            <ScaleIn>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <MotionButton size="lg" variant="default" className="text-xs sm:text-sm md:text-base font-pixel px-3 py-2.5 sm:px-4 sm:py-3 w-full sm:w-auto mx-auto lg:mx-0 group" onClick={() => navigate('/login')}>
                  <Play className="mr-2 w-4 h-4 group-hover:animate-pulse" /> Mulai Petualangan
                </MotionButton>
              </div>
            </ScaleIn>
          </div>
          <div className="flex-1 w-full max-w-lg relative">
            <FadeIn>
              <div className="w-full max-w-sm mx-auto p-4 sm:p-6 min-h-[320px] flex flex-col justify-between relative overflow-hidden rounded-2xl backdrop-blur-md bg-slate-900/60 border-[3px] border-secondary/40 shadow-glow-quest">
                
                {/* Floating Badge */}
                <div className="relative mb-4 mx-auto bg-[#1a0f2e] border border-primary/50 px-4 py-1 rounded shadow-glow-quest z-20">
                  <span className="font-pixel text-[10px] sm:text-xs tracking-widest text-[#d3bbff] whitespace-nowrap">QUEST MAP PREVIEW</span>
                </div>

                {/* Map Grid Background */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                
                {/* Connecting Lines */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <path d="M 20 85 C 40 95, 70 75, 80 55" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
                  <path d="M 80 55 C 80 35, 70 20, 50 15" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" style={{ animationDelay: '500ms' }} />
                </svg>

                  <div className="flex-1 w-full flex flex-col-reverse justify-between relative z-10 px-4 sm:px-8 pb-2">
                    {/* Nodes */}
                    <div className="self-start relative hover:-translate-y-2 hover:drop-shadow-md transition-all duration-300 cursor-pointer">
                      <QuestNode state="completed" label="Bab 1 (Quest 1-6)" className="scale-[0.85] sm:scale-100 origin-left" />
                    </div>
                    
                    <div className="self-end relative hover:-translate-y-2 hover:drop-shadow-md transition-all duration-300 cursor-pointer">
                      <QuestNode state="available" label="Bab 2 (Quest 7-12)" className="scale-[0.85] sm:scale-100 origin-right" />
                    </div>

                    <div className="self-center relative hover:-translate-y-2 hover:drop-shadow-md transition-all duration-300 cursor-pointer -mt-4">
                      <QuestNode state="boss" label="Final Boss" className="scale-100 sm:scale-125 origin-top" />
                    </div>
                  </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <SlideUp>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-glow mb-4">Senjata Pengetahuan</h2>
              <p className="text-muted-foreground text-lg">Semua yang kamu butuhkan untuk menaklukkan setiap mata kuliah.</p>
            </div>
          </SlideUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Pembuat Peta AI", icon: <Wand2 className="w-8 h-8 text-primary" />, desc: "Ubah silabus apa pun secara otomatis menjadi peta petualangan terstruktur menggunakan AI." },
              { title: "Sistem Progres RPG", icon: <Target className="w-8 h-8 text-success" />, desc: "Dapatkan XP, kumpulkan Emas, dan tingkatkan level karaktermu seiring penyelesaian misi." },
              { title: "Pertarungan Bos", icon: <Sword className="w-8 h-8 text-destructive" />, desc: "Uji pemahamanmu dalam arena pertarungan kuis bergaya retro melawan bos ujian yang tangguh." },
              { title: "Sistem Pencapaian", icon: <Trophy className="w-8 h-8 text-secondary" />, desc: "Buka lencana dan relik magis atas dedikasi dan kecepatan belajarmu." }
            ].map((feature, idx) => (
              <SlideUp key={idx} style={{ transitionDelay: `${idx * 100}ms` }}>
                <Card variant="scroll" className="h-full hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground/80">{feature.desc}</CardDescription>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-6 md:p-8 my-12 relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-glow mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Perjalanan Pahlawan</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-1 bg-gradient-to-r from-primary via-secondary to-success -translate-y-1/2 opacity-30 pixelated" />
            
            {[
              { step: "1", title: "Unggah Gulungan", desc: "Tarik dan lepas file PDF silabus atau masukkan teks materimu." },
              { step: "2", title: "Penyusunan AI", desc: "AI akan meracik materi tersebut menjadi peta petualangan kustom untukmu." },
              { step: "3", title: "Mulai Petualangan", desc: "Mulai belajar, kalahkan bos ujian, dan klaim hadiahmu!" }
            ].map((item, idx) => (
              <ScaleIn key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-background border-4 border-secondary flex items-center justify-center font-pixel text-xl mb-6 shadow-glow-achievement text-secondary">
                  {item.step}
                </div>
                <h3 className="text-2xl font-heading font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-slate-100">{item.title}</h3>
                <p className="text-slate-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{item.desc}</p>
              </ScaleIn>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card py-8 mt-12 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sword className="w-5 h-5 text-secondary" />
            <span className="font-heading text-xl text-secondary">Questify</span>
          </div>
          <p className="text-sm text-muted-foreground font-sans text-center">
            &copy; {new Date().getFullYear()} Questify. A Vibe Coding AI Education Demo.
          </p>
          <div className="hidden md:block w-[100px]"></div> {/* Invisible spacer to keep copyright centered */}
        </div>
      </footer>
    </div>
  )
}
