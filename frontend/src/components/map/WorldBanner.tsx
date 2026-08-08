import React from "react"
import { useAdventureStore } from "@/store/useAdventureStore"

export const WorldBanner: React.FC = () => {
  const activeAdventure = useAdventureStore(state => state.getActive())
  if (!activeAdventure) return null

  const { 
    worldName, 
    worldSubtitle, 
    worldDescription, 
    worldIcon, 
    worldElement, 
    difficulty,
    estimatedPlayTime,
    completionReward,
    theme
  } = activeAdventure

  // Default theme properties if not available
  const themePalette = theme?.palette || "bg-secondary"
  // const themeAtmosphere = theme?.atmosphere || "epic"

  return (
    <div className="w-full text-center mb-16 relative z-20 flex flex-col items-center">
      {/* Dynamic Theme Banner Background (optional aesthetic) */}
      <div className={`absolute -inset-10 opacity-20 blur-3xl pointer-events-none rounded-full ${themePalette}`} />

      {/* World Identity Core */}
      <div className="bg-background/80 backdrop-blur-md border-[3px] border-secondary rounded-2xl p-md md:p-lg max-w-4xl shadow-panel shadow-glow-achievement pixel-borders">
        <div className="flex flex-col items-center">
          
          {worldIcon && (
            <div className="text-5xl mb-4 drop-shadow-md animate-bounce-slow">
              {worldIcon}
            </div>
          )}

          <h1 className="text-title-world md:text-display font-heading font-bold text-glow text-secondary mb-2 tracking-wider uppercase">
            {worldName || "Peta Petualangan"}
          </h1>
          
          <h2 className="text-title-section text-primary font-heading tracking-widest mb-4">
            {worldSubtitle || "Perjalanan Dimulai"}
          </h2>
          
          {worldDescription && (
            <p className="text-muted-foreground font-sans font-medium text-body mb-6 max-w-2xl px-4">
              {worldDescription}
            </p>
          )}

          {/* Metadata Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {worldElement && (
              <span className="bg-primary/20 border-border-badge text-primary px-3 py-1 rounded font-pixel text-label uppercase">
                Elemen: {worldElement}
              </span>
            )}
            {difficulty && (
              <span className="bg-destructive/20 border-border-badge text-destructive px-3 py-1 rounded font-pixel text-label uppercase">
                Level: {difficulty}
              </span>
            )}
            {estimatedPlayTime && (
              <span className="bg-secondary/20 border-border-badge text-secondary px-3 py-1 rounded font-pixel text-label uppercase">
                Durasi: {estimatedPlayTime}
              </span>
            )}
            {completionReward && (
              <span className="bg-success/20 border-border-badge text-success px-3 py-1 rounded font-pixel text-label uppercase">
                Hadiah: {completionReward}
              </span>
            )}
            {theme?.terrain && (
              <span className="bg-accent/20 border-border-badge text-accent-foreground px-3 py-1 rounded font-pixel text-label uppercase">
                Area: {theme.terrain}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
