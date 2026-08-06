import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-8 pt-8">
      {/* Top Split-screen: Boss vs Player */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 w-full">
        {/* Player Avatar and HP */}
        <motion.div 
          animate={playerHit ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex-1 w-full bg-background-deep p-6 pixel-borders glow-purple flex flex-col gap-4 items-center md:items-start"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-background rounded-full border-2 border-primary flex items-center justify-center text-primary font-heading text-2xl font-bold">
              {playerName.charAt(0)}
            </div>
            <div className="font-pixel text-primary text-xl uppercase">{playerName}</div>
          </div>
          <div className="w-full relative bg-background border border-border h-6 mt-2">
            <div 
              className="h-full bg-success-green transition-all duration-300"
              style={{ width: `${Math.max(0, (playerHp / maxPlayerHp) * 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-pixel text-[10px] text-foreground">
              {playerHp} / {maxPlayerHp} HP
            </div>
          </div>
        </motion.div>

        <div className="font-heading text-4xl text-secondary animate-pulse">VS</div>

        {/* Boss Sprite and HP */}
        <motion.div 
          animate={bossHit ? { x: [-10, 10, -10, 10, 0], filter: ['brightness(1)', 'brightness(2) hue-rotate(90deg)', 'brightness(1)'] } : {}}
          transition={{ duration: 0.4 }}
          className="flex-1 w-full bg-background-deep p-6 pixel-borders glow-red flex flex-col gap-4 items-center md:items-end"
        >
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="w-24 h-24 bg-background border-2 border-boss-red flex items-center justify-center text-boss-red text-5xl">
              💀
            </div>
            <div className="font-pixel text-boss-red text-xl uppercase">{bossName}</div>
          </div>
          <div className="w-full relative bg-background border border-border h-6 mt-2">
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
      <div className="flex-1 flex flex-col items-center justify-center w-full mt-8">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div 
              key={currentQuestion.question}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col gap-6"
            >
              {/* Question Manuscript */}
              <div className="bg-[#f4e4bc] text-[#3e2723] p-10 relative border-[12px] border-double border-[#8d6e63] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform -rotate-1">
                <div className="absolute inset-0 bg-[#3e2723] opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3e2723 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                <h3 className="font-heading text-2xl md:text-3xl leading-relaxed text-center relative z-10">
                  {currentQuestion.question}
                </h3>
              </div>
              
              {/* Answer Choices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  let btnClass = "border-primary text-foreground bg-background-deep hover:bg-primary/20 hover:border-primary glow-purple";
                  
                  if (isSelected) {
                    if (answerState === "correct") {
                      btnClass = "border-success-green bg-success-green/20 glow-green";
                    } else if (answerState === "wrong") {
                      btnClass = "border-boss-red bg-boss-red/20 glow-red";
                    } else {
                      btnClass = "border-secondary bg-secondary/20 glow-gold";
                    }
                  } else if (selectedAnswer !== null) {
                    btnClass = "border-muted bg-background opacity-50 grayscale";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => onAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`relative text-left p-6 pixel-borders transition-all duration-300 flex items-start gap-4 ${btnClass}`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center font-pixel text-sm shrink-0 border border-current`}>
                        {['A','B','C','D'][idx]}
                      </div>
                      <span className="font-sans text-lg mt-0.5">
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
