import React from 'react';

interface LoreMasteryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoreMasteryPanel: React.FC<LoreMasteryPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#0b1326]/80 backdrop-blur-sm z-40 pointer-events-none"></div>
      <div 
        className={`absolute right-0 top-0 bottom-0 w-full max-w-[800px] bg-[#ffddb8]/95 backdrop-blur-md shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-50 overflow-y-auto transform transition-transform duration-500 ease-out border-l-4 border-[#653e00] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} 
        id="quest-scroll-panel"
      >
        <div className="p-16 relative">
          <div className="absolute top-0 right-0 p-6">
            <button 
              className="w-10 h-10 flex items-center justify-center bg-[#2a1700] text-[#ffddb8] hover:bg-[#653e00] transition-colors" 
              onClick={onClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="mb-12 text-center relative z-10">
            <div className="inline-flex items-center gap-1 mb-2 px-4 py-1 bg-[#2a1700] text-[#ffddb8] shadow-glow-achievement">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span className="font-pixel text-[12px] uppercase">Penguasaan Lore</span>
            </div>
            <h1 className="font-heading text-5xl text-[#653e00] mb-4">Kisah Obsidian</h1>
            <div className="w-24 h-1 bg-[#653e00]/30 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12 relative z-10">
            <div className="md:col-span-8 space-y-4">
              <h2 className="font-heading text-3xl text-[#653e00]">Ringkasan Artefak</h2>
              <p className="font-sans text-base text-[#2a1700]/80 leading-relaxed">
                Sebelum Kehancuran Besar, para Arch-Mage Eldoria mengikat mantra mereka yang paling kuat ke dalam artefak fisik. Relik-relik ini, yang tersebar di seluruh benua, memegang kunci untuk memulihkan garis ley. Misimu melibatkan pelacakan pecahan pengetahuan kuno ini dan memahami fungsi utamanya. Modul ini mencakup artefak dasar yang ditemukan di Perpustakaan Runtuh Oakhaven.
              </p>
              <p className="font-sans text-base text-[#2a1700]/80 leading-relaxed">
                Menguasai konsep-konsep ini sangat penting; mengidentifikasi sifat sejati sebuah Relik mencegah serangan balik mana yang dahsyat selama ritual ekstraksi. Perhatikan baik-baik sigil visual dan dengungan elemen laten yang dipancarkan setiap objek.
              </p>
            </div>
            <div className="md:col-span-4 flex items-start justify-center">
              <div className="relative w-full aspect-square bg-[#2a1700] shadow-[0_0_20px_#6d28d9] p-2">
                <div className="absolute inset-0 bg-[#ffb95f]/10 mix-blend-overlay"></div>
                <div 
                  className="w-full h-full bg-cover bg-center border border-[#ffb95f]/30" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxO24jyUcBmfL3DDz-TKp5prvuk8TX5q5Z09nrxpaqTQMut8Y4jAPD_Dx1hDAnWTJpdRPMMMssaDA1YUJKU-I0iBKy9nonHfKjRxnhu8aU37JDdPk5hY583qqcMYBnu1lN2rhncFhVqVMKCyeyjuB_JLGGsqvH3vri7QwvNalJ9u2Poi3WEUeD8MdseUODrImLFDYKROb0ldNZf4ylu57ezlQrnJL1v8JlCDOASXHJ5JEOVJi6YRXQ')" }}
                ></div>
                <div className="absolute -bottom-4 -right-4 bg-[#d3bbff] px-2 py-1 text-[#3f008d] font-pixel text-[12px] shadow-md shadow-[#d3bbff]/20">
                  RELIC_ID: 0x8F
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-12 relative z-10">
            <div className="flex items-center justify-between mb-6 border-b-2 border-[#653e00]/20 pb-2">
              <h2 className="font-heading text-3xl text-[#653e00]">Artefak Pengingat</h2>
              <div className="font-pixel text-[12px] text-[#2a1700]/60">
                4 ARTEFAK
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-1000">
              {/* Card 1 */}
              <div className="group h-64 w-full" style={{ perspective: '1000px' }}>
                <div className="relative h-full w-full transition-transform duration-700 cursor-pointer" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 bg-[#2a1700] p-4 shadow-panel flex flex-col items-center justify-center border border-[#ffb95f]/20 group-hover:opacity-0 transition-hover">
                    <span className="material-symbols-outlined text-[#ffb95f] text-4xl mb-2">bolt</span>
                    <h3 className="font-heading text-2xl text-[#ffddb8] text-center">Saluran Aether</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#222a3d] p-4 shadow-glow-quest flex flex-col items-center justify-center text-center border-2 border-[#d3bbff]/40 opacity-0 group-hover:opacity-100 transition-hover">
                    <p className="font-sans text-base text-[#ccc3d7]">
                      Silinder kristal yang digunakan untuk menyalurkan energi magis mentah dari garis ley ke dalam jaringan mantra lokal. Sangat tidak stabil jika retak.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="group h-64 w-full" style={{ perspective: '1000px' }}>
                <div className="relative h-full w-full transition-transform duration-700 cursor-pointer" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 bg-[#2a1700] p-4 shadow-panel flex flex-col items-center justify-center border border-[#ffb95f]/20 group-hover:opacity-0 transition-hover">
                    <span className="material-symbols-outlined text-[#ffb95f] text-4xl mb-2">local_fire_department</span>
                    <h3 className="font-heading text-2xl text-[#ffddb8] text-center">Inti Ignis</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#222a3d] p-4 shadow-glow-quest flex flex-col items-center justify-center text-center border-2 border-[#d3bbff]/40 opacity-0 group-hover:opacity-100 transition-hover">
                    <p className="font-sans text-base text-[#ccc3d7]">
                      Jantung yang masih menyala dari golem pandai besi kuno. Memberikan panas abadi dan dapat melelehkan logam berpesona tingkat rendah.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group h-64 w-full" style={{ perspective: '1000px' }}>
                <div className="relative h-full w-full transition-transform duration-700 cursor-pointer" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 bg-[#2a1700] p-4 shadow-panel flex flex-col items-center justify-center border border-[#ffb95f]/20 group-hover:opacity-0 transition-hover">
                    <span className="material-symbols-outlined text-[#ffb95f] text-4xl mb-2">visibility</span>
                    <h3 className="font-heading text-2xl text-[#ffddb8] text-center">Lensa Oracle</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#222a3d] p-4 shadow-glow-quest flex flex-col items-center justify-center text-center border-2 border-[#d3bbff]/40 opacity-0 group-hover:opacity-100 transition-hover">
                    <p className="font-sans text-base text-[#ccc3d7]">
                      Cakram kaca yang dipoles yang mengungkapkan ilusi tersembunyi dan tulisan tak terlihat ketika diangkat ke cahaya bulan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group h-64 w-full" style={{ perspective: '1000px' }}>
                <div className="relative h-full w-full transition-transform duration-700 cursor-pointer" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 bg-[#2a1700] p-4 shadow-panel flex flex-col items-center justify-center border border-[#ffb95f]/20 group-hover:opacity-0 transition-hover">
                    <span className="material-symbols-outlined text-[#ffb95f] text-4xl mb-2">book</span>
                    <h3 className="font-heading text-2xl text-[#ffddb8] text-center">Pecahan Codex</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#222a3d] p-4 shadow-glow-quest flex flex-col items-center justify-center text-center border-2 border-[#d3bbff]/40 opacity-0 group-hover:opacity-100 transition-hover">
                    <p className="font-sans text-base text-[#ccc3d7]">
                      Halaman yang robek dari Master Grimoire. Teksnya terus-menerus mengubah bahasa sampai diikat oleh mantra stabilisasi.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="mt-12 flex justify-center pb-12 relative z-10">
            <button 
              className="bg-[#d3bbff] text-[#3f008d] px-12 py-4 font-pixel text-[12px] uppercase tracking-widest shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2)] hover:shadow-glow-quest hover:-translate-y-1 transition-hover flex items-center gap-2 group"
              onClick={onClose}
            >
              Selesaikan Sesi Belajar
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
