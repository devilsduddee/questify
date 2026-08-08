import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdventureStore } from '../../store/useAdventureStore';
import mageAvatar from '../../assets/mage-avatar.png';
import { Trophy, LogOut } from 'lucide-react';
import { AchievementBook } from '../ui/AchievementBook';
import { getAllAchievements } from '../../data/achievements';

import { usePlayerStore } from '../../store/usePlayerStore';
import { getRoleById } from '../../data/roles';
import { AVAILABLE_AVATARS } from '../common/AvatarSelection';

export const CharacterWidget: React.FC = () => {
  const { name, role, avatarId, globalAchievements } = usePlayerStore();
  const adventure = useAdventureStore((state) => state.getActive());
  const [isBookOpen, setIsBookOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    import('@/lib/supabase').then(async ({ supabase }) => {
      await supabase.auth.signOut()
      useAdventureStore.getState().resetAdventures()
      usePlayerStore.getState().resetPlayer()
      navigate('/')
    })
  }

  if (!adventure) return null;

  const totalUnlocked = globalAchievements.length + (adventure.achievements?.length || 0);
  const totalAvailable = getAllAchievements().length;
  const roleDef = getRoleById(role);

  const xpPercent = Math.min(100, Math.floor((adventure.xp / adventure.maxXp) * 100));
  const selectedAvatarImg = AVAILABLE_AVATARS.find(a => a.id === avatarId)?.img || mageAvatar;

  return (
    <div className="hidden md:flex items-center gap-2 md:gap-3 bg-slate-900/80 backdrop-blur-md pl-3 pr-5 py-1.5 rounded-xl border border-amber-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300 group/widget min-w-[220px]">
      
      {/* Avatar Section */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 ring-2 ring-amber-400/80 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)] group-hover/widget:shadow-[0_0_15px_rgba(245,158,11,0.7)] bg-background flex items-center justify-center overflow-hidden transition-all duration-300 transform group-hover/widget:scale-105">
          <img src={selectedAvatarImg} alt="Hero Avatar" className="w-full h-full object-cover pixelated" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex flex-col justify-center">
        {/* Identity Row */}
        <div className="flex items-center gap-1.5 mb-0.5 leading-none">
          <span className="text-[12px] drop-shadow-md" title={roleDef?.name}>{roleDef?.icon || '👤'}</span>
          <span className="font-heading text-sm text-amber-400 text-glow tracking-wider">{name.toUpperCase()}</span>
        </div>

        {/* Level and Role Row */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-pixel text-[8px] text-muted-foreground uppercase">{roleDef?.name || 'Adventurer'}</span>
          <div className="bg-gradient-to-b from-amber-400 to-amber-600 text-[#1a0f2e] text-[9px] font-pixel px-1.5 py-0.5 rounded border border-[#1a0f2e] shadow-sm whitespace-nowrap leading-none">
            LVL {adventure.level}
          </div>
          <div className="flex items-center gap-1.5 w-24">
            <div className="w-full h-1.5 bg-black/50 rounded-full border border-purple-500/30 overflow-hidden relative shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-fuchsia-400 shadow-[0_0_8px_#a855f7] transition-all duration-700 ease-out relative"
                style={{ width: `${xpPercent}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/30 skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <span className="font-pixel text-[7px] text-purple-300 min-w-[35px] text-right whitespace-nowrap">{adventure.xp}/{adventure.maxXp}</span>
          </div>
        </div>

        {/* Bottom Row: Currency & Trophies */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 hover:-translate-y-0.5 transition-transform cursor-default">
            <span className="material-symbols-outlined text-amber-400 text-[12px] drop-shadow-[0_0_4px_rgba(245,158,11,0.8)]">toll</span>
            <span className="font-pixel text-amber-400 text-[10px] mt-0.5 drop-shadow-md">{adventure.gold.toLocaleString()}</span>
          </div>
          
          <div className="w-[1px] h-2.5 bg-amber-500/30"></div>
          
          <button 
            onClick={() => setIsBookOpen(true)}
            className="flex items-center gap-1 hover:-translate-y-0.5 transition-transform group"
            title="Buku Pencapaian"
          >
            <Trophy className="w-3 h-3 text-blue-400 group-hover:text-blue-300 drop-shadow-[0_0_4px_rgba(59,130,246,0.6)] transition-all" />
            <span className="font-pixel text-blue-400 group-hover:text-blue-300 text-[10px] mt-0.5 drop-shadow-md">{totalUnlocked}/{totalAvailable}</span>
          </button>
          
          <div className="w-[1px] h-2.5 bg-amber-500/30"></div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 hover:-translate-y-0.5 transition-transform group"
            title="Keluar"
          >
            <LogOut className="w-3 h-3 text-destructive/70 group-hover:text-destructive drop-shadow-[0_0_4px_rgba(239,68,68,0.3)] transition-all" />
          </button>
        </div>
      </div>

      <AchievementBook isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} />
    </div>
  );
};
