import React from "react"
import { useNavigate } from "react-router-dom"
import landingBgImg from "@/assets/landing-bg.png"
import { Target, Trophy, Play, Wand2, Sword } from "lucide-react"

import { MotionButton } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FadeIn, SlideUp, ScaleIn } from "@/components/common/AnimationWrapper"
import { QuestNode } from "@/components/common/QuestNode"
import { SyllabusUpload } from "@/features/upload/SyllabusUpload"
import { useAdventureStore } from "@/store/useAdventureStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const adventures = useAdventureStore(state => state.adventures)
  const hasAdventures = adventures.length > 0

  if (hasAdventures) {
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
          <FadeIn className="flex flex-col items-center mb-16">
            <Sword className="w-16 h-16 text-secondary mb-4 drop-shadow-md" />
            <h1 className="font-heading text-6xl text-glow text-secondary tracking-widest font-bold text-center">QUESTIFY</h1>
            <p className="font-pixel text-muted-foreground text-sm mt-4 tracking-widest uppercase">The Kingdom of Knowledge</p>
          </FadeIn>

          <SlideUp className="w-full flex flex-col gap-4">
            <MotionButton 
              size="lg" 
              variant="default" 
              className="w-full font-pixel text-lg py-8 group relative overflow-hidden bg-[#1E293B] border-[3px] border-primary hover:bg-primary/20 hover:border-primary shadow-glow-quest hover:shadow-glow-quest transition-hover"
              onClick={() => navigate('/map')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 -translate-x-full" />
              <Play className="mr-3 w-5 h-5 group-hover:animate-pulse text-secondary" /> Lanjutkan Petualangan
            </MotionButton>
            
            <MotionButton 
              size="lg" 
              variant="outline" 
              className="w-full font-pixel text-base py-6 bg-card/80 border-border hover:bg-secondary/10 hover:border-secondary/50 hover:text-secondary transition-all group flex items-center justify-center"
              onClick={() => navigate('/adventures')}
            >
              <span className="material-symbols-outlined text-amber-400 group-hover:rotate-12 transition-transform mr-2">explore</span> Petualanganku
            </MotionButton>

            <Dialog>
              <DialogTrigger asChild>
                <MotionButton 
                  size="lg" 
                  variant="outline" 
                  className="w-full font-pixel text-base py-6 bg-card/80 border-border hover:bg-success/10 hover:border-success/50 hover:text-success transition-all group flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-amber-400 group-hover:scale-110 transition-transform mr-2">auto_awesome</span> Petualangan Baru
                </MotionButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl bg-card border-secondary/50 max-h-[90vh] overflow-y-auto">
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
          </SlideUp>

          <FadeIn className="mt-16 text-center">
            <p className="text-xs text-muted-foreground font-sans">
              &copy; {new Date().getFullYear()} Questify. All Rights Reserved.
            </p>
          </FadeIn>
        </div>
      </div>
    )
  }

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
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Sword className="w-8 h-8 text-secondary" />
            <span className="font-heading text-2xl text-glow text-secondary tracking-widest font-bold">Questify</span>
          </div>
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
                <MotionButton size="lg" variant="default" className="w-full sm:w-auto font-pixel text-sm group" onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" })}>
                  <Play className="mr-2 w-4 h-4 group-hover:animate-pulse" /> Mulai Petualangan
                </MotionButton>
              </div>
            </ScaleIn>
          </div>
          <div className="flex-1 w-full max-w-lg relative">
            <FadeIn>
              <div className="relative w-full aspect-[4/3] rounded-2xl backdrop-blur-md bg-slate-900/60 border-[3px] border-secondary/40 shadow-glow-quest overflow-hidden flex items-center justify-center p-xl">
                
                {/* Floating Badge */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1a0f2e] border border-primary/50 px-4 py-1 rounded shadow-glow-quest z-20">
                  <span className="font-pixel text-[10px] tracking-widest text-[#d3bbff] whitespace-nowrap">QUEST MAP PREVIEW</span>
                </div>

                {/* Map Grid Background */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                
                <div className="relative w-full h-full">
                  {/* Connecting Lines */}
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    <path d="M 70 70 Q 50 85 30 60" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2,2" className="animate-pulse" />
                    <path d="M 30 60 Q 20 20 50 30" fill="none" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="2,2" className="animate-pulse" style={{ animationDelay: '500ms' }} />
                  </svg>

                  {/* Nodes */}
                  <div className="absolute top-[70%] left-[70%] -translate-x-1/2 -translate-y-1/2 hover:-translate-y-2 hover:drop-shadow-md transition-hover z-10 cursor-pointer">
                    <QuestNode state="completed" label="Bab 1" />
                  </div>
                  
                  <div className="absolute top-[60%] left-[30%] -translate-x-1/2 -translate-y-1/2 hover:-translate-y-2 hover:drop-shadow-md transition-hover z-10 cursor-pointer">
                    <QuestNode state="available" label="Bab 2" />
                  </div>

                  <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 hover:-translate-y-2 hover:drop-shadow-md transition-hover z-10 cursor-pointer">
                    <QuestNode state="boss" label="Ujian Akhir" className="scale-125" />
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
        <section className="py-24 bg-card/30 rounded-3xl border border-border/50 my-12 px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-glow mb-4">Perjalanan Pahlawan</h2>
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
                <h3 className="text-2xl font-heading font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </ScaleIn>
            ))}
          </div>
        </section>

        {/* Upload CTA Section */}
        <section id="upload-section" className="py-24 flex flex-col items-center">
          <SlideUp className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-glow mb-4 text-secondary">Siap Menempa Takdirmu?</h2>
              <p className="text-muted-foreground text-lg">Masukkan materi belajarmu di bawah ini untuk membuat petualangan pertamamu.</p>
            </div>
            <div className="px-4">
              <SyllabusUpload />
            </div>
          </SlideUp>
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
