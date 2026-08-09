import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from "@/store/usePlayerStore";
import { useAdventureStore } from "@/store/useAdventureStore";
import { AVAILABLE_AVATARS } from "@/components/common/AvatarSelection";
import mageAvatar from "@/assets/mage-avatar.png";
import bossDarkImg from "@/assets/boss-dark.png";
import { Sparkles, Coins } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  answerIndex: number;
}

interface QuizArenaProps {
  bossName: string;
  bossHp: number;
  maxBossHp: number;
  playerName: string;
  playerHp: number;
  maxPlayerHp: number;
  currentQuestion: Question | null;
  selectedAnswer: number | null;
  answerState: "correct" | "wrong" | null;
  onAnswer: (index: number) => void;
  bossHit: boolean;
  playerHit: boolean;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  bossName,
  bossHp,
  maxBossHp,
  playerName,
  playerHp,
  maxPlayerHp,
  currentQuestion,
  selectedAnswer,
  answerState,
  onAnswer,
  bossHit,
  playerHit,
}) => {
  const { avatarId, role } = usePlayerStore();
  const avatarImg = AVAILABLE_AVATARS.find(a => a.id === avatarId)?.img || mageAvatar;
  const activeAdventure = useAdventureStore(state => state.getActive());
  const gold = activeAdventure?.gold || 0;
  const deductGold = useAdventureStore(state => state.deductGold);

  const [hintActive, setHintActive] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);

  useEffect(() => {
    // Reset hint state when question changes
    setHintActive(false);
    setEliminatedOptions([]);
  }, [currentQuestion?.question]);

  const handleBuyHint = () => {
    if (gold >= 500 && !hintActive && currentQuestion) {
      deductGold(500);
      setHintActive(true);
      
      const wrongIndices: number[] = [];
      currentQuestion.options.forEach((_, idx) => {
        if (idx !== currentQuestion.answerIndex) wrongIndices.push(idx);
      });
      
      // Shuffle and pick 2 wrong options to eliminate
      wrongIndices.sort(() => 0.5 - Math.random());
      setEliminatedOptions(wrongIndices.slice(0, 2));
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-8 pt-8">
      {/* Top Split-screen: Boss vs Player */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8 my-6">
        {/* Player Avatar and HP */}
        <motion.div 
          animate={playerHit ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-between p-4 md:p-6 w-full min-h-[140px] md:min-h-[160px] bg-slate-900/90 border-2 border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.2)] rounded-2xl relative gap-4"
        >
          <div className="flex flex-row items-center gap-4 w-full justify-center md:justify-start">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-amber-400 overflow-hidden shadow-lg shadow-amber-400/20 bg-black flex-shrink-0">
              <img src={avatarImg} alt="Player Avatar" className="w-full h-full object-cover pixelated" />
            </div>
            <div className="flex flex-col text-left">
              <div className="font-pixel text-primary text-base md:text-xl uppercase leading-tight">{playerName}</div>
              <div className="font-pixel text-[10px] md:text-xs text-amber-400 mt-1 uppercase">{role || 'Novice'}</div>
            </div>
          </div>
          <div className="w-full relative bg-background border border-border h-6 flex-shrink-0 rounded overflow-hidden mt-auto">
            <div 
              className="h-full bg-success-green transition-all duration-300"
              style={{ width: `${Math.max(0, (playerHp / maxPlayerHp) * 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-pixel text-[10px] text-foreground">
              {playerHp} / {maxPlayerHp} HP
            </div>
          </div>
        </motion.div>

        {/* Center VS Badge */}
        <div className="text-3xl md:text-4xl font-pixel text-amber-400 animate-pulse drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] z-10 shrink-0 text-center mx-auto">VS</div>

        {/* Boss Sprite and HP */}
        <motion.div 
          animate={bossHit ? { x: [-10, 10, -10, 10, 0], filter: ['brightness(1)', 'brightness(2) hue-rotate(90deg)', 'brightness(1)'] } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-between p-4 md:p-6 w-full min-h-[140px] md:min-h-[160px] bg-slate-900/90 border-2 border-red-600/70 shadow-[0_0_20px_rgba(220,38,38,0.3)] rounded-2xl relative overflow-hidden gap-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex flex-row-reverse items-center gap-4 w-full justify-center md:justify-start relative z-10">
            {/* Transparent Boss Cutout Hovering */}
            <div className="relative group shrink-0">
               {/* Atmospheric dark smoke/glow effect behind boss */}
               <div className="absolute inset-0 bg-red-950/60 animate-pulse mix-blend-overlay z-10 rounded-full blur-md"></div>
               <div className="absolute -inset-4 bg-[radial-gradient(circle,_rgba(239,68,68,0.4)_0%,_transparent_70%)] opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>
               
               {/* Boss Artwork - No Frame, mix-blend-screen for transparent fake-out */}
               <img src={bossDarkImg} alt="Dark Boss" className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] filter brightness-110 mix-blend-screen relative z-0 transform group-hover:scale-110 transition-transform duration-[2000ms]" />
               
               {/* Subtle red particle overlay effect */}
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDAsIDAsIDAuMykiLz4KPC9zdmc+')] opacity-30 animate-[pulse_3s_ease-in-out_infinite] z-20 pointer-events-none"></div>
            </div>
            
            <div className="flex flex-col text-right flex-1 justify-center">
              <h3 className="text-[10px] md:text-xs lg:text-sm font-pixel text-red-500 tracking-wider text-right drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] leading-relaxed break-words max-w-[200px] ml-auto">{bossName}</h3>
            </div>
          </div>
          <div className="w-full relative bg-background border border-border h-6 flex-shrink-0 z-10 rounded overflow-hidden mt-auto">
            <div 
              className="h-full bg-boss-red transition-all duration-300 shadow-[0_0_10px_#EF4444]"
              style={{ width: `${Math.max(0, (bossHp / maxBossHp) * 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-pixel text-[10px] text-foreground">
              {bossHp} / {maxBossHp} HP
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom: Ancient Manuscript Card */}
      <div className="flex-1 flex flex-col items-center justify-center w-full mt-8 overflow-hidden px-2 py-4">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div 
              key={currentQuestion.question}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl mx-auto flex flex-col gap-6 px-2 md:px-4"
            >
              {/* Question Manuscript */}
              <div className="bg-[#f4e4bc] text-[#3e2723] p-6 md:p-10 relative border-[12px] border-double border-[#8d6e63] shadow-[0_10px_30px_rgba(0,0,0,0.5)] mx-2 md:mx-0 rounded-sm">
                <div className="absolute inset-0 bg-[#3e2723] opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3e2723 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                <h3 className="font-heading text-lg md:text-2xl leading-loose tracking-widest px-2 md:px-6 text-justify relative z-10 break-words">
                  {currentQuestion.question}
                </h3>
                
                {/* Hint Feature */}
                <div className="relative z-10 mt-6 flex justify-center border-t-2 border-[#8d6e63]/30 pt-4">
                  {!hintActive ? (
                    <button 
                      onClick={handleBuyHint}
                      disabled={gold < 500 || selectedAnswer !== null}
                      className={`flex items-center gap-2 px-4 py-2 font-pixel text-xs md:text-sm rounded transition-all duration-300 border-2 ${gold >= 500 ? 'bg-indigo-900/80 text-amber-300 border-indigo-400 hover:bg-indigo-800 hover:scale-105 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800/80 text-slate-400 border-slate-600 cursor-not-allowed opacity-70'}`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {gold >= 500 ? "Beli Hint (500 Koin)" : "Koin Tidak Cukup (Butuh 500)"}
                      <div className="flex items-center gap-1 ml-2 bg-black/30 px-2 py-0.5 rounded">
                        <Coins className="w-3 h-3 text-amber-400" /> {gold}
                      </div>
                    </button>
                  ) : (
                    <div className="bg-indigo-900/80 border-2 border-indigo-400 text-indigo-100 p-3 rounded-lg text-xs md:text-sm font-sans flex items-start gap-3 shadow-[0_0_20px_rgba(99,102,241,0.4)] max-w-lg w-full">
                      <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <p><strong>Petunjuk Magis:</strong> 2 jawaban yang salah telah dihilangkan oleh sihir kuno...</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Answer Choices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isEliminated = eliminatedOptions.includes(idx);
                  let btnClass = "bg-slate-900/90 hover:bg-slate-800/90 border-purple-500/50 hover:border-amber-400 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:-translate-y-0.5";
                  
                  if (isSelected) {
                    if (answerState === "correct") {
                      btnClass = "border-success-green bg-success-green/20 shadow-[0_0_20px_rgba(34,197,94,0.4)]";
                    } else if (answerState === "wrong") {
                      btnClass = "border-boss-red bg-boss-red/20 shadow-[0_0_20px_rgba(239,68,68,0.4)]";
                    } else {
                      btnClass = "border-amber-400 bg-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.4)]";
                    }
                  } else if (isEliminated) {
                    btnClass = "border-slate-700 bg-slate-900/50 opacity-30 grayscale cursor-not-allowed";
                  } else if (selectedAnswer !== null) {
                    btnClass = "border-slate-700 bg-slate-900/50 opacity-50 grayscale cursor-not-allowed";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => onAnswer(idx)}
                      disabled={selectedAnswer !== null || isEliminated}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 w-full ${btnClass}`}
                    >
                      <div className="w-10 h-10 min-w-[40px] flex items-center justify-center rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 font-bold font-pixel text-base shadow-[0_0_10px_rgba(251,191,36,0.4)] border border-amber-300 shrink-0">
                        {['A','B','C','D'][idx]}
                      </div>
                      <span className="text-amber-100 font-semibold text-sm md:text-base tracking-wide leading-snug font-pixel" style={{ textDecoration: isEliminated ? 'line-through' : 'none' }}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
