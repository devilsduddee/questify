import React from 'react';
import { useAdventureStore } from '../../store/useAdventureStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import mageAvatar from '../../assets/mage-avatar.png';

export const CharacterWidget: React.FC = () => {
  const { name } = usePlayerStore();
  const adventure = useAdventureStore((state) => state.getActive());

  if (!adventure) return null;

  const xpPercent = Math.min(100, Math.floor((adventure.xp / adventure.maxXp) * 100));

  return (
    <div className="flex items-center gap-4 bg-background-deep px-6 py-2 border-2 border-secondary/50 glow-gold pixel-borders">
      <div className="text-right flex flex-col items-end">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-sans text-xs font-bold text-gray-400 uppercase">LVL</span>
          <span className="font-pixel text-secondary text-sm">{adventure.level}</span>
        </div>
        <div className="w-32 h-2 bg-background border border-gray-600 overflow-hidden relative">
          <div
            className="h-full bg-secondary shadow-[0_0_10px_#F59E0B] transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-primary glow-purple bg-background flex items-center justify-center font-heading font-bold text-xl text-primary overflow-hidden">
          <img src={mageAvatar} alt="Mage Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex items-center gap-2 bg-background px-3 py-1 border border-secondary/40 shadow-[inset_0_0_8px_rgba(245,158,11,0.2)] ml-4">
        <span className="material-symbols-outlined text-secondary">toll</span>
        <span className="font-pixel text-secondary text-sm">{adventure.gold.toLocaleString()}</span>
      </div>
    </div>
  );
};
