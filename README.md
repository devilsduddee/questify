⚔️ Questify: Pixel Fantasy RPG
> **"Ubah Silabus Jadi Petualangan, Naikkan Level Belajarmu!"**  
> *Turn your syllabus into your next big quest and level up your study game!*
---
🎮 Tentang Questify
Questify adalah platform web edukasi (EdTech) berbasis gamifikasi RPG (Role-Playing Game) retro 8-bit yang didukung oleh kecerdasan buatan (Generative AI / Gemini API). Aplikasi ini dirancang khusus untuk merevolusi metode belajar mandiri konvensional yang kaku dan membosankan menjadi petualangan belajar yang interaktif, adiktif, dan terstruktur.
Dengan mengunggah dokumen kurikulum atau silabus kuliah/sekolah, teknologi AI di latar belakang secara otomatis melakukan parsing dan menyusun peta misi belajar visual (Quest Map), kartu belajar (Flashcards), serta arena kuis (Boss Battle Quiz) untuk menguji kompetensi pengguna secara menyenangkan.
---
✨ Fitur Utama
1. 📂 AI Syllabus Upload & Parsing
Drag-and-Drop Portal: Pengguna cukup mengunggah file silabus (format PDF atau TXT) ke dalam portal ajaib.
Instant Map Generation: AI (Gemini API) secara cerdas menganalisis bab materi, merangkum poin-poin penting, dan mengubahnya menjadi struktur petualangan kuis berformat JSON secara instan.
🗺️ 2. Interactive Adventure Quest Map
Peta petualangan visual linier bergaya game RPG 8-bit klasik.
State Node Interaktif:
🔒 Locked Node: Berwarna abu-abu (grayscale) dengan ikon gembok terkunci.
✨ Available Node: Memiliki efek pendar emas (pulsing golden glow) tanda siap dijelajahi.
✅ Completed Node: Ditandai centang hijau bersinar tanda petualangan sukses dilalui.
👹 Boss Node (Ujian Akhir): Berupa kastil monster besar berdenyut merah sebagai gerbang evaluasi kelulusan.
📜 3. Quest Knowledge Scroll & Flashcard Relics
Ancient Scroll Summary: Membaca ringkasan materi komprehensif dari gulungan kitab kuno yang bersih dan mudah dipahami.
3D Flip Flashcards: Mengingat istilah dan glosarium penting menggunakan kartu belajar ajaib bertema artefak kuno (ancient relics) yang dapat membalik secara interaktif dengan animasi 3D.
👾 4. Character Status Widget (Client-Side State)
Dasbor karakter mengambang (floating status widget) bergaya status bar RPG.
Menampilkan Avatar Penyihir (Mage 8-bit), indikator Level, bar kemajuan XP (Experience Points), dan animasi koin emas (Gold) berputar yang terintegrasi secara dinamis menggunakan Zustand dan tersimpan otomatis di browser (LocalStorage).
⚔️ 5. Boss Battle Quiz Arena
Evaluasi materi dikemas sebagai pertarungan kuis pilihan ganda yang mendebarkan!
Interactive HP Bar: Pengguna dan Boss masing-masing memiliki indikator HP (Hit Points).
Visual Damage Feedback:
Jawaban Benar: Menghantam Boss, memicu animasi guncangan musuh (damage-shake), mengurangi HP Boss, dan menjatuhkan koin emas.
Jawaban Salah: Karakter terkena serangan, HP berkurang, dan layar bergetar merah (screen-shake).
Victory & Level Up: Kalahkan Boss untuk membuka stage berikutnya, raih bonus XP besar, dan rasakan kepuasan naik tingkat!
---
🛠️ Tech Stack & Dependencies
Platform ini dikembangkan dengan arsitektur modern berkinerja tinggi tanpa membutuhkan server database eksternal (Serverless Local Persistence):
Frontend Library: React (TypeScript `.tsx` & React Hooks)
Build Tool & Bundler: Vite
Styling & Theme: Tailwind CSS (dengan palet warna custom RPG & font khusus)
Animations: Framer Motion (untuk transisi halaman, efek kartu membalik, dan guncangan pertarungan)
State Management: Zustand (untuk sinkronisasi progres permainan)
AI Integration: `@google/generative-ai` (Gemini API SDK)
Document Reader: `pdfjs-dist` (untuk memproses file PDF secara client-side)
Icons: Lucide Icons
Storage: Browser LocalStorage (untuk menyimpan data petualangan XP, Gold, Level, dan Misi secara instan)
---
🚀 Cara Menjalankan Proyek Secara Lokal
Ikuti panduan berikut untuk memasang dan menjalankan Questify di komputer Anda:
1. Clone Repositori
```bash
git clone https://github.com/devilsduddee/questify.git
cd questify
```
2. Masuk ke Folder Frontend
```bash
cd frontend
```
3. Instalasi Dependensi
```bash
npm install
```
4. Konfigurasi API Key (Penting untuk Fitur AI)
Aplikasi ini memanfaatkan Gemini API untuk menyusun misi dari silabus secara cerdas. Anda harus menyematkan API Key Anda terlebih dahulu:
Buat file baru bernama `.env` di dalam folder `frontend/`.
Tambahkan variabel berikut dan masukkan API Key Gemini Anda:
    ```env
    VITE_GEMINI_API_KEY=Isi_Dengan_API_Key_Gemini_Milik_Anda
    ```
5. Jalankan Server Lokal
```bash
npm run dev
```
Setelah server menyala, buka browser Anda dan akses tautan lokal:  
🔗 `http://localhost:5173`
---
📁 Struktur Folder Proyek
```text
questify/
├── documents/               # Berkas dokumentasi proposal & aset
└── frontend/
    ├── src/
    │   ├── assets/          # Gambar logo, avatar mage, dan background petualangan
    │   ├── components/      # Komponen UI (CharacterWidget, AdventureMap, QuizArena, dll.)
    │   ├── store/           # Zustand state store (useGameStore.ts)
    │   ├── App.tsx          # Halaman utama & router aplikasi
    │   ├── index.css        # Konfigurasi style global & Google Fonts
    │   └── main.tsx
    ├── .env.template        # Panduan konfigurasi API Key
    ├── tailwind.config.js   # Konfigurasi kustomisasi tema RPG Tailwind
    ├── package.json
    └── vite.config.ts
```
---
🏆 Tim Pengembang (Vibecoders)
Proyek ini dikembangkan dengan dedikasi penuh untuk ajang kompetisi Bitsmikro Innovative Vibecode 2026 oleh:
🔥 APIPI WITHYOU 
👤 AHMAD RIDHO SYAFAAT
👤 MUHAMMAD RIFAT HAKIM
Play your syllabus, master your future! Selamat berpetualang di dunia Questify! 🎮✨
