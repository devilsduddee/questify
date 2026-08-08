import React from "react"
import { cn } from "@/utils/cn"

import mage_m from "@/assets/avatars/mage_m.png"
import warrior_m from "@/assets/avatars/warrior_m.png"
import king from "@/assets/avatars/king.png"
import dragon_knight from "@/assets/avatars/dragon_knight.png"
import mage_f from "@/assets/avatars/mage_f.png"
import warrior_f from "@/assets/avatars/warrior_f.png"
import queen from "@/assets/avatars/queen.png"
import rogue_f from "@/assets/avatars/rogue_f.png"

export const AVAILABLE_AVATARS = [
  { id: 'mage_m', name: 'Male Mage', img: mage_m },
  { id: 'warrior_m', name: 'Male Warrior', img: warrior_m },
  { id: 'king', name: 'King', img: king },
  { id: 'dragon_knight', name: 'Dragon Knight', img: dragon_knight },
  { id: 'mage_f', name: 'Female Mage', img: mage_f },
  { id: 'warrior_f', name: 'Female Warrior', img: warrior_f },
  { id: 'queen', name: 'Queen', img: queen },
  { id: 'rogue_f', name: 'Female Rogue', img: rogue_f },
]

interface AvatarSelectionProps {
  selectedAvatar: string | null;
  onSelectAvatar: (avatarId: string) => void;
  className?: string;
}

export const AvatarSelection: React.FC<AvatarSelectionProps> = ({ selectedAvatar, onSelectAvatar, className }) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <label className="font-pixel text-xs text-muted-foreground uppercase text-center block mb-2">Pilih Avatar Pahlawanmu</label>
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {AVAILABLE_AVATARS.map((avatar) => {
          const isSelected = selectedAvatar === avatar.id;
          return (
            <div
              key={avatar.id}
              onClick={() => onSelectAvatar(avatar.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer overflow-hidden aspect-square bg-slate-900",
                isSelected 
                  ? "ring-4 ring-amber-400 bg-amber-500/20 scale-105 shadow-glow-quest z-10" 
                  : "border-2 border-slate-700 hover:border-amber-400/50 hover:bg-slate-800"
              )}
              title={avatar.name}
            >
              <img 
                src={avatar.img} 
                alt={avatar.name} 
                className="w-full h-full object-cover pointer-events-none drop-shadow-md pixelated rounded"
              />
            </div>
          );
        })}
      </div>
    </div>
  )
}
