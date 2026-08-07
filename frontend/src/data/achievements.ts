import { Shield, Scroll, Sword, Crown, Compass, Zap, BookOpen, Star } from "lucide-react"
import { LucideIcon } from "lucide-react"

export type AchievementRarity = "Common" | "Rare" | "Epic" | "Legendary"
export type AchievementScope = "global" | "adventure"

export interface AchievementDef {
  id: string
  title: string
  description: string
  icon: LucideIcon
  rarity: AchievementRarity
  scope: AchievementScope
  category: string
  xpReward: number
}

// Registry IDs
export const ACH_FIRST_ADVENTURE = "GLOBAL_FIRST_ADVENTURE"
export const ACH_LEVEL_MASTER = "GLOBAL_LEVEL_MASTER_5"
export const ACH_KNOWLEDGE_COLLECTOR = "GLOBAL_KNOWLEDGE_COLLECTOR"
export const ACH_SPEED_LEARNER = "GLOBAL_SPEED_LEARNER"

export const ACH_EXPLORER = "ADV_EXPLORER"
export const ACH_QUEST_MASTER = "ADV_QUEST_MASTER"
export const ACH_BOSS_SLAYER = "ADV_BOSS_SLAYER"
export const ACH_PERFECT_SCORE = "ADV_PERFECT_SCORE"

export const ACHIEVEMENT_REGISTRY: Record<string, AchievementDef> = {
  // --- GLOBAL ACHIEVEMENTS ---
  [ACH_FIRST_ADVENTURE]: {
    id: ACH_FIRST_ADVENTURE,
    title: "Awal Perjalanan",
    description: "Memasuki dunia pertama di Questify.",
    icon: Compass,
    rarity: "Common",
    scope: "global",
    category: "First Adventure",
    xpReward: 50,
  },
  [ACH_LEVEL_MASTER]: {
    id: ACH_LEVEL_MASTER,
    title: "Pahlawan Muda",
    description: "Mencapai Level 5 untuk pertama kalinya.",
    icon: Crown,
    rarity: "Rare",
    scope: "global",
    category: "Level Master",
    xpReward: 200,
  },
  [ACH_KNOWLEDGE_COLLECTOR]: {
    id: ACH_KNOWLEDGE_COLLECTOR,
    title: "Pencari Ilmu",
    description: "Menyelesaikan 10 Quest secara total.",
    icon: Scroll,
    rarity: "Epic",
    scope: "global",
    category: "Knowledge Collector",
    xpReward: 500,
  },
  [ACH_SPEED_LEARNER]: {
    id: ACH_SPEED_LEARNER,
    title: "Kilat Menyambar",
    description: "Menyelesaikan sebuah Quest dalam waktu kurang dari 5 menit.",
    icon: Zap,
    rarity: "Rare",
    scope: "global",
    category: "Speed Learner",
    xpReward: 300,
  },

  // --- ADVENTURE ACHIEVEMENTS ---
  [ACH_EXPLORER]: {
    id: ACH_EXPLORER,
    title: "Pakar Pemetaan",
    description: "Membuka seluruh area dalam petualangan ini.",
    icon: BookOpen,
    rarity: "Rare",
    scope: "adventure",
    category: "Explorer",
    xpReward: 150,
  },
  [ACH_QUEST_MASTER]: {
    id: ACH_QUEST_MASTER,
    title: "Quest Master",
    description: "Menyelesaikan seluruh quest sebelum menantang Bos Akhir.",
    icon: Shield,
    rarity: "Epic",
    scope: "adventure",
    category: "Quest Master",
    xpReward: 400,
  },
  [ACH_BOSS_SLAYER]: {
    id: ACH_BOSS_SLAYER,
    title: "Boss Slayer",
    description: "Berhasil mengalahkan penjaga pengetahuan.",
    icon: Sword,
    rarity: "Legendary",
    scope: "adventure",
    category: "Boss Slayer",
    xpReward: 1000,
  },
  [ACH_PERFECT_SCORE]: {
    id: ACH_PERFECT_SCORE,
    title: "Kesempurnaan Murni",
    description: "Menjawab kuis Boss tanpa terkena damage sama sekali.",
    icon: Star,
    rarity: "Legendary",
    scope: "adventure",
    category: "Perfect Score",
    xpReward: 1500,
  },
}

export const getAllAchievements = () => Object.values(ACHIEVEMENT_REGISTRY)
export const getGlobalAchievements = () => getAllAchievements().filter(a => a.scope === "global")
export const getAdventureAchievements = () => getAllAchievements().filter(a => a.scope === "adventure")
