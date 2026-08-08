import React from "react"
import { CHARACTER_ROLES } from "@/data/roles"
import { cn } from "@/utils/cn"

interface RoleSelectionProps {
  selectedRole: string | null;
  onSelectRole: (roleId: string) => void;
  className?: string;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ selectedRole, onSelectRole, className }) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CHARACTER_ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={cn(
                "relative flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer overflow-hidden group",
                isSelected 
                  ? "bg-primary/20 border-primary shadow-glow-quest scale-[1.02]" 
                  : "bg-card/60 border-border hover:border-primary/50 hover:bg-card/80"
              )}
            >
              <div className="flex items-center gap-3 mb-2 z-10">
                <span className="text-3xl drop-shadow-md">{role.icon}</span>
                <div className="flex flex-col">
                  <span className={cn("font-heading text-xl tracking-wider", isSelected ? "text-primary text-glow" : "text-foreground")}>
                    {role.name}
                  </span>
                  <span className="font-pixel text-[10px] text-muted-foreground uppercase">{role.title}</span>
                </div>
              </div>
              <p className="font-sans text-xs text-foreground/80 z-10 leading-relaxed">
                {role.description}
              </p>
              
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}
