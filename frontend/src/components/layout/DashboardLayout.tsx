import React, { useState } from "react"
import { Sword, Bell, Settings, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { usePlayerStore } from "@/store/usePlayerStore"
import { useAdventureStore } from "@/store/useAdventureStore"
import { XpBar } from "@/components/common/XpBar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DashboardLayoutProps {
  children: React.ReactNode
  variant?: "map" | "quest"
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, variant = "map" }) => {
  const { name } = usePlayerStore()
  const activeAdventure = useAdventureStore(state => state.getActive())
  const { xp = 0, level = 1, maxXp = 100, gold = 0, worldName = "Peta Petualangan", nodes = [] } = activeAdventure || {}
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Derived stats for the center section
  const totalQuests = nodes.filter(n => !n.isBoss).length
  const totalBosses = nodes.filter(n => n.isBoss).length

  // Conditional styles based on variant
  const isQuest = variant === "quest"
  const headerClasses = isQuest
    ? "h-24 md:h-20 border-b-[3px] border-[#8B5A2B] bg-[#0F172A]/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 px-4 md:px-8 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
    : "h-24 md:h-20 border-b-[3px] border-[#8B5A2B] bg-[#0F172A]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 px-4 md:px-8 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300"

  return (
    <div className="min-h-screen bg-[#0F172A] text-foreground flex flex-col font-sans overflow-x-hidden">
      
      {/* Topbar HUD */}
      <header className={headerClasses}>
        
        {/* LEFT SECTION: Logo & Brand */}
        <div className="flex items-center gap-3 w-1/4">
          <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary text-primary shadow-[0_0_12px_rgba(109,40,217,0.5)]">
                <Sword className="w-6 h-6" />
              </div>
              <span className="font-heading font-bold text-xl tracking-wider text-glow text-secondary hidden lg:block">
                QUESTIFY
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Home Button (New) */}
        {!isQuest && (
          <Link to="/" className="hidden md:flex items-center gap-2 px-3 py-1.5 mr-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 rounded-full font-pixel text-xs transition-colors sound-hover sound-click">
            Main Menu
          </Link>
        )}

        {/* CENTER SECTION: Area Context (Hidden on mobile) */}
        <div className="hidden md:flex flex-col items-center justify-center flex-1 text-center">
          <h2 className="font-heading text-xl md:text-2xl text-primary text-glow tracking-wide">
            {worldName || "Peta Petualangan"}
          </h2>
          <div className="text-xs text-muted-foreground font-pixel mt-1 flex gap-2 opacity-80">
            <span>Bab 1</span>
            <span>•</span>
            <span>{totalQuests} Quest</span>
            <span>•</span>
            <span>{totalBosses} Boss</span>
          </div>
        </div>

        {/* RIGHT SECTION: Player HUD */}
        <div className="flex items-center justify-end gap-4 w-auto md:w-1/4">
          
          {/* Gold */}
          <div className="hidden md:flex items-center gap-1 font-pixel text-secondary text-sm bg-[#1a1a2e] px-3 py-1.5 rounded-full rpg-frame-inset glow-gold">
            <span>🪙</span>
            <motion.span key={gold} initial={{ scale: 1.5, color: "#fff" }} animate={{ scale: 1, color: "#f59e0b" }}>
              {gold}
            </motion.span>
          </div>

          {/* Player Card (Avatar + Info) */}
          <div className="flex items-center gap-3 bg-[#1E293B]/80 border-border/50 rounded-lg p-2 pr-4 shadow-lg transition-colors rpg-frame-inset hover:glow-blue-magic cursor-pointer sound-hover">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Avatar className="w-10 h-10 border-2 border-secondary box-glow-gold">
                <AvatarFallback className="bg-primary/20 text-primary font-heading font-bold">{name.charAt(0)}</AvatarFallback>
              </Avatar>
            </motion.div>
            
            <div className="hidden sm:flex flex-col min-w-[120px]">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-heading text-sm text-foreground truncate max-w-[80px]">{name}</span>
                <span className="font-pixel text-[10px] text-primary">Lvl {level}</span>
              </div>
              <XpBar currentXp={xp} maxXp={maxXp} />
              <span className="font-pixel text-[8px] text-muted-foreground mt-0.5 text-right">
                {xp} / {maxXp} XP
              </span>
            </div>
          </div>

          {/* Actions (Notifications & Settings) */}
          <div className="hidden sm:flex items-center gap-2 border-l border-border/50 pl-4">
            <button className="relative p-2 rounded-full hover:bg-primary/20 transition-colors group sound-hover sound-click">
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-[#1E293B] shadow-[0_0_5px_rgba(239,68,68,1)] animate-pulse" />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary/20 transition-colors group sound-hover sound-click">
              <Settings className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
            </button>
          </div>

          {/* Mobile Hamburger Menu */}
          <button 
            className="sm:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden bg-[#1E293B] border-b border-border/50 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="text-center pb-4 border-b border-border/20">
                <h2 className="font-heading text-lg text-primary text-glow">{worldName}</h2>
                <div className="font-pixel text-[10px] text-muted-foreground mt-1">Bab 1 • {totalQuests} Quest • {totalBosses} Boss</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-pixel text-secondary text-sm">
                  <span>🪙</span> {gold}
                </div>
                <div className="flex gap-4">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between font-pixel text-[10px]">
                  <span className="text-primary">Lvl {level}</span>
                  <span className="text-muted-foreground">{xp} / {maxXp} XP</span>
                </div>
                <XpBar currentXp={xp} maxXp={maxXp} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {children}
      </main>

    </div>
  )
}
