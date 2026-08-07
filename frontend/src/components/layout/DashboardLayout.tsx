import React, { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
// usePlayerStore removed
import { useAdventureStore } from "@/store/useAdventureStore"
import { CharacterWidget } from "@/components/layout/CharacterWidget"
import { XpBar } from "@/components/common/XpBar"
import questifyLogo from "@/assets/questify-q-logo.png"

interface DashboardLayoutProps {
  children: React.ReactNode
  variant?: "map" | "quest"
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, variant = "map" }) => {
  // Player info is now handled by CharacterWidget on desktop
  const activeAdventure = useAdventureStore(state => state.getActive())
  const { xp = 0, level = 1, maxXp = 100, gold = 0, worldName = "Peta Petualangan", nodes = [] } = activeAdventure || {}
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Derived stats for the center section
  const totalQuests = nodes.filter(n => !n.isBoss).length
  const totalBosses = nodes.filter(n => n.isBoss).length

  // Conditional styles based on variant
  const isQuest = variant === "quest"
  const headerClasses = isQuest
    ? "h-24 md:h-20 border-b-[3px] border-secondary bg-background/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 px-4 md:px-8 flex items-center justify-between shadow-panel"
    : "h-24 md:h-20 border-b-[3px] border-secondary bg-background/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 px-4 md:px-8 flex items-center justify-between shadow-panel transition-all transition-screen"

  return (
    <div className="min-h-screen bg-[#0F172A] text-foreground flex flex-col font-sans overflow-x-hidden">
      
      {/* Topbar HUD */}
      <header className={headerClasses}>
        
        {/* LEFT SECTION: Logo & Brand */}
        <div className="flex items-center gap-3 w-1/4">
          <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center shadow-glow-quest bg-black/50 rounded overflow-hidden border border-primary/50">
                <img src={questifyLogo} alt="Questify Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-heading font-bold text-xl tracking-wider text-glow text-secondary hidden lg:block">
                QUESTIFY
              </span>
            </Link>
          </motion.div>
        </div>



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
          <CharacterWidget />



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
