import React from "react"
import { motion } from "framer-motion"
import darkCitadelBg from "@/assets/dark-citadel-bg.png"

export const BattleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
      
      {/* Base Citadel Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity"
        style={{ backgroundImage: `url(${darkCitadelBg})` }}
      />
      
      {/* Deep dungeon radial gradient (Kabut tebal) */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-red-950/70 to-[#050505]/90 mix-blend-multiply"
        animate={{ opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ancient floor pattern with 3D perspective distortion */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[50%] opacity-20"
        style={{ transform: "perspective(1000px) rotateX(60deg) scale(1.5)", transformOrigin: "bottom" }}
      >
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dungeon-floor" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="100" height="100" fill="none" stroke="#475569" strokeWidth="2" />
              <path d="M 0 0 L 100 100 M 100 0 L 0 100" stroke="#334155" strokeWidth="1" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="5 5" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dungeon-floor)" />
        </svg>
      </div>

      {/* Floating Magic Dust / Ember Particles */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => {
          const size = Math.random() * 4 + 2;
          return (
            <motion.div
              key={`dust-${i}`}
              className="absolute rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] bg-red-500"
              style={{
                width: size,
                height: size,
                bottom: `${Math.random() * 20}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -200 - Math.random() * 300],
                x: Math.random() * 100 - 50,
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 5,
              }}
            />
          )
        })}
      </div>

      {/* Aura Glow Behind Boss (Center Top) */}
      <motion.div 
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Heavy Vignette around the edges */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />

    </div>
  )
}
