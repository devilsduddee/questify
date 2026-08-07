import React from 'react';
import { useAdventureStore } from '../../store/useAdventureStore';
import mageAvatar from '../../assets/mage-avatar.png';
import { Trophy } from 'lucide-react';
import { AchievementBook } from '../ui/AchievementBook';
import { getAllAchievements } from '../../data/achievements';

import { usePlayerStore } from '../../store/usePlayerStore';

export const CharacterWidget: React.FC = () => {
  const { globalAchievements } = usePlayerStore();
  const adventure = useAdventureStore((state) => state.getActive());
  const [isBookOpen, setIsBookOpen] = React.useState(false);

  if (!adventure) return null;

  const totalUnlocked = globalAchievements.length + (adventure.achievements?.length || 0);
  const totalAvailable = getAllAchievements().length;

  const xpPercent = Math.min(100, Math.floor((adventure.xp / adventure.maxXp) * 100));

  return (
    <div className="flex items-center gap-4 bg-background-deep p-sm md:p-md border-[3px] border-secondary pixel-borders shadow-glow-achievement">
      <div className="text-right flex flex-col items-end">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-sans text-xs font-bold text-gray-400 uppercase">LVL</span>
          <span className="font-pixel text-secondary text-sm">{adventure.level}</span>
        </div>
        <div className="w-32 h-2 bg-background border border-gray-600 overflow-hidden relative">
          <div
            className="h-full bg-secondary shadow-glow-achievement transition-screen"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-primary shadow-glow-quest bg-background flex items-center justify-center font-heading font-bold text-xl text-primary overflow-hidden">
          <img src={mageAvatar} alt="Mage Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex items-center gap-2 bg-background p-sm border border-secondary/40 shadow-button ml-4">
        <span className="material-symbols-outlined text-secondary">toll</span>
        <span className="font-pixel text-secondary text-sm">{adventure.gold.toLocaleString()}</span>
      </div>
      <button 
        onClick={() => setIsBookOpen(true)}
        className="flex items-center gap-2 bg-background hover:bg-background-deep p-sm border border-secondary shadow-button hover:shadow-glow-achievement transition-hover ml-2 group"
        title="Buku Pencapaian"
      >
        <Trophy className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
        <span className="font-pixel text-secondary text-xs mt-1">{totalUnlocked} / {totalAvailable}</span>
      </button>

      <AchievementBook isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} />
    </div>
  );
};
