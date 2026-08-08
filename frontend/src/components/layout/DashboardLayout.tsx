import React, { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
// usePlayerStore removed
import { useAdventureStore } from "@/store/useAdventureStore"
import { CharacterWidget } from "@/components/layout/CharacterWidget"

import questifyLogo from "@/assets/questify-q-logo.png"
import mageAvatar from "@/assets/mage-avatar.png"

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
    ? "border-b-[3px] border-secondary bg-background/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 py-2 px-6 flex items-center justify-between shadow-panel"
    : "border-b-[3px] border-secondary bg-background/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 py-2 px-6 flex items-center justify-between shadow-panel transition-all transition-screen"

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
        <div className="flex items-center justify-end gap-4 w-auto md:w-1/4 relative md:static">
          <CharacterWidget />



          {/* Mobile Hamburger Menu */}
          <button 
            className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-amber-500/30 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 bg-background overflow-hidden shadow-[0_0_8px_rgba(245,158,11,0.4)]">
              <img src={mageAvatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400 mr-1" /> : <Menu className="w-5 h-5 text-amber-400 mr-1" />}
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
                  className="fixed inset-0 z-[998] md:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden absolute top-[110%] right-4 z-[999] w-64 bg-slate-900/95 backdrop-blur-md border border-amber-500/50 rounded-xl p-4 shadow-2xl overflow-hidden"
                >
                  <div className="flex flex-col gap-4">
                    
                    {/* Top Section: Player Stats */}
                    <div className="flex items-center gap-3 border-b border-purple-500/30 pb-4">
                      <div className="w-12 h-12 rounded-full border-2 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] bg-background overflow-hidden shrink-0">
                        <img src={mageAvatar} alt="Mage Avatar" className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="flex justify-between items-center">
                          <div className="bg-gradient-to-b from-amber-400 to-amber-600 text-[#1a0f2e] text-[9px] font-pixel px-1.5 py-0.5 rounded border border-[#1a0f2e] shadow-sm">
                            LVL {level}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-amber-400 text-xs drop-shadow-[0_0_4px_rgba(245,158,11,0.8)]">toll</span>
                            <span className="font-pixel text-amber-400 text-[10px]">{gold.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="w-full h-2 bg-black/50 rounded-full border border-purple-500/30 overflow-hidden relative shadow-inner">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-fuchsia-400 shadow-[0_0_8px_#a855f7]"
                            style={{ width: `${Math.min(100, Math.floor((xp / maxXp) * 100))}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-pixel text-purple-300">
                          <span className="tracking-wider">EXP</span>
                          <span>{xp}/{maxXp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quests Status */}
                    <div className="flex justify-between items-center bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                      <span className="font-pixel text-[9px] text-slate-300">Quests Selesai:</span>
                      <span className="font-pixel text-[10px] text-green-400">{totalBosses + (nodes.filter(n => n.status === "completed" && !n.isBoss).length)} / {totalQuests + totalBosses}</span>
                    </div>

                    {/* Bottom Section: Navigation */}
                    <div className="flex flex-col gap-2 mt-1">
                      <Link to="/map" className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="material-symbols-outlined text-purple-400 text-sm">explore</span>
                        <span className="font-heading text-sm text-white">Peta Petualangan</span>
                      </Link>
                      <Link to="/adventures" className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="material-symbols-outlined text-blue-400 text-sm">history_edu</span>
                        <span className="font-heading text-sm text-white">Petualanganku</span>
                      </Link>
                    </div>

                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </header>



      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {children}
      </main>

    </div>
  )
}
