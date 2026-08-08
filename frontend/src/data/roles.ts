export interface CharacterRole {
  id: "warrior" | "mage" | "ranger" | "rogue";
  name: string;
  title: string;
  description: string;
  icon: string;
  storyStyle: string;
  aiGuidance: string;
}

export const CHARACTER_ROLES: CharacterRole[] = [
  {
    id: "warrior",
    name: "Warrior",
    title: "Penguasa Medan Pertempuran",
    description: "Maju ke garis depan. Materi belajar diibaratkan sebagai musuh yang harus ditaklukkan dengan keberanian dan kekuatan fisik.",
    icon: "⚔️",
    storyStyle: "heroik, berani, penuh tantangan fisik dan pertempuran epik",
    aiGuidance: "Gunakan analogi tentang senjata, pertarungan fisik, strategi perang, dan keberanian. Kalahkan monster pengetahuan dengan kekuatan murni."
  },
  {
    id: "mage",
    name: "Mage",
    title: "Pengendali Pengetahuan dan Sihir",
    description: "Membaca rahasia alam semesta. Setiap baris teks adalah mantra yang membongkar hukum sihir kuno.",
    icon: "🧙",
    storyStyle: "misterius, arcane, penuh sihir, mantra kuno, dan penemuan kebijaksanaan rahasia",
    aiGuidance: "Gunakan analogi tentang mantra, rune kuno, energi mistis, perpustakaan astral, dan eksperimen sihir. Pengetahuan adalah kunci untuk menguasai sihir."
  },
  {
    id: "ranger",
    name: "Ranger",
    title: "Pengamat yang Menemukan Pola Tersembunyi",
    description: "Bertahan di alam liar. Informasi bagaikan jejak kaki yang membawamu menemukan pola dan rahasia tersembunyi.",
    icon: "🏹",
    storyStyle: "eksploratif, observatif, alam liar, penuh penelusuran, dan ketajaman insting",
    aiGuidance: "Gunakan analogi tentang berburu, bertahan hidup di alam liar, membaca jejak, panah presisi, dan menemukan pola tersembunyi. Alam bebas adalah guru terbaik."
  },
  {
    id: "rogue",
    name: "Rogue",
    title: "Ahli Strategi dari Bayangan",
    description: "Bekerja dalam hening. Masalah diselesaikan melalui infiltrasi, manipulasi cerdas, dan membongkar teka-teki.",
    icon: "🗡️",
    storyStyle: "strategis, penuh teka-teki, infiltrasi, kelicikan, pencurian informasi, dan problem solving",
    aiGuidance: "Gunakan analogi tentang membongkar kunci, menyusup ke markas musuh, strategi bayangan, jebakan, dan kelicikan. Kepintaran adalah senjatamu yang paling tajam."
  }
];

export const getRoleById = (id: string | null | undefined): CharacterRole | undefined => {
  if (!id) return undefined;
  return CHARACTER_ROLES.find(r => r.id === id);
};
