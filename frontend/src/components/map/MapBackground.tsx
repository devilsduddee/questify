import React from "react"
import { motion } from "framer-motion"
import adventureMapImg from "@/assets/adventure-map.png"

export const MapBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Layer 1: Night fantasy gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#0F172A]" />

      {/* Layer 1.5: Adventure Map Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay bg-repeat bg-[length:128px_128px]"
        style={{ backgroundImage: `url(${adventureMapImg})` }}
      />

      {/* Layer 7: Distant mountains (SVG polygon, blurred) */}
      <div className="absolute top-0 left-0 w-full h-64 opacity-20 blur-[2px]">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full fill-[#0f172a]">
          <polygon points="0,200 0,100 100,50 200,120 350,40 500,150 650,80 800,130 900,60 1000,100 1000,200" />
        </svg>
      </div>

      {/* Layer 8: Moonlight */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />

      {/* Layer 4: Ancient terrain (SVG Pattern) */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="terrain" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 20 20 Q 30 10 40 20 T 60 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary" />
              <circle cx="80" cy="50" r="1" fill="currentColor" className="text-primary" />
              <path d="M 70 80 L 80 90 M 80 80 L 70 90" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#terrain)" />
        </svg>
      </div>

      {/* Layer 6: Ancient ruins */}
      <div className="absolute bottom-0 left-0 w-full h-full opacity-10 flex flex-col justify-between">
        <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" className="w-full h-full fill-[#000000]">
          {/* Pillar 1 */}
          <rect x="50" y="200" width="20" height="150" />
          <rect x="40" y="190" width="40" height="10" />
          {/* Broken arch */}
          <path d="M 800 500 Q 850 400 900 500 L 880 500 Q 850 450 820 500 Z" />
          <rect x="800" y="500" width="20" height="100" />
          <rect x="880" y="500" width="20" height="100" />
        </svg>
      </div>

      {/* Layer 3: Pixel stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white rounded-full animate-twinkle box-glow"
            style={{
              width: Math.random() > 0.8 ? '3px' : '2px',
              height: Math.random() > 0.8 ? '3px' : '2px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Layer 9: Magic clouds */}
      <div className="absolute inset-0 opacity-10">
        <motion.svg
          viewBox="0 0 1000 200"
          className="w-[200%] h-full fill-white"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        >
          <path d="M 100 100 Q 150 50 200 100 Q 250 150 300 100 T 500 100 Q 550 50 600 100 T 800 100 T 1000 100" fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="round" className="blur-[10px]" />
          {/* Duplicated for smooth loop */}
          <path d="M 600 100 Q 650 50 700 100 Q 750 150 800 100 T 1000 100 Q 1050 50 1100 100 T 1300 100 T 1500 100" fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="round" className="blur-[10px]" />
        </motion.svg>
      </div>

      {/* Layer 2: Mist/fog */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 5: Magic particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-secondary rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            style={{
              bottom: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100 - Math.random() * 100],
              opacity: [0, 0.8, 0],
              x: Math.random() * 40 - 20
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Layer 10: Lighting vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />

    </div>
  )
}
