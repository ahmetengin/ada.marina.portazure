
import React, { useEffect, useState, useCallback } from 'react';
import Hero from './components/Hero';
import VHFRadio from './components/VHFRadio';
import InfoPanel from './components/InfoPanel';
import MarinaMap from './components/MarinaMap';
import ServicesSection from './components/ServicesSection';
import BookingSearch from './components/BookingSearch';
import Logbook from './components/Logbook';
import FileSystemSidebar from './components/FileSystemSidebar';
import { MARINA_NETWORK, MOCK_WEATHER } from './constants';
import { initializeAI } from './services/geminiService';
import { Anchor, Globe, User, X, Menu, HardDrive, Terminal } from 'lucide-react';
import { Language, Slip, MarinaConfig } from './types';

// Sadece dosya yolları. İçerikler projedeki bağımsız .md dosyalarından çekilir.
const VFS_MANIFEST = [
  '/docs/goecek-rehberi.md',
  '/docs/fethiye-goecek-koylar.md',
  '/docs/symi-rodos-rehberi.md',
  '/docs/hudut-gecis-kurallari.md',
  '/docs/yat-prosedur-detay.md',
  '/docs/didim-rehberi.md',
  '/docs/bodrum-rehberi.md',
  '/docs/marmaris-rehberi.md',
  '/docs/fethiye-goecek-koylar-detay.md',
  '/docs/yakit-ve-ikmal-noktalari.md',
  '/docs/logs/2025-03.md'
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [activeMarina, setActiveMarina] = useState<MarinaConfig>(MARINA_NETWORK[2]); 
  const [vesselPos, setVesselPos] = useState({ lat: 36.7525, lng: 28.9400 }); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);
  const [activePath, setActivePath] = useState<string>('/docs/goecek-rehberi.md');
  const [vfs, setVfs] = useState<Record<string, string>>({});

  // Dosyaları sanal belleğe (VFS) yükle
  const mountFiles = useCallback(async () => {
    const loadedVfs: Record<string, string> = {};
    for (const path of VFS_MANIFEST) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          loadedVfs[path] = await response.text();
        }
      } catch (e) {
        console.error(`Mount Error: ${path}`);
      }
    }
    // Değişiklikleri localStorage'dan yükle (Sync)
    const savedChanges = localStorage.getItem('ada_drive_sync');
    if (savedChanges) {
      const sync = JSON.parse(savedChanges);
      Object.assign(loadedVfs, sync);
    }
    setVfs(loadedVfs);
  }, []);

  useEffect(() => {
    mountFiles();
    initializeAI(lang);
  }, [lang, mountFiles]);

  const updateFile = useCallback((path: string, content: string) => {
    setVfs(prev => {
      const next = { ...prev, [path]: content };
      const sync = JSON.parse(localStorage.getItem('ada_drive_sync') || '{}');
      sync[path] = content;
      localStorage.setItem('ada_drive_sync', JSON.stringify(sync));
      return next;
    });
    setActivePath(path);
  }, []);

  const readFile = useCallback((path: string) => {
    return vfs[path] || null;
  }, [vfs]);

  return (
    <div className="relative min-h-screen bg-emerald-950 selection:bg-brass-500 selection:text-emerald-950 font-sans text-ivory-100/90 flex flex-col">
      {/* AIS Ticker */}
      <div className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-brass-500/20 h-10 flex items-center overflow-hidden">
        <div className="flex animate-[ticker_60s_linear_infinite] whitespace-nowrap gap-16 text-[10px] font-mono tracking-[0.4em] text-brass-400/80 items-center font-bold">
            <span>AIS: ONLINE</span>
            <span>LAT: {vesselPos.lat.toFixed(4)}N / LNG: {vesselPos.lng.toFixed(4)}E</span>
            <span>DRIVE_STATUS: MOUNTED (/docs)</span>
            <span>FILES_LOADED: {Object.keys(vfs).length}</span>
        </div>
      </div>

      <nav className="fixed top-10 w-full z-40 px-6 md:px-12 py-6 flex justify-between items-center backdrop-blur-2xl bg-emerald-900/40 border-b border-brass-500/10">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.reload()}>
            <Anchor className="w-8 h-8 text-brass-500" />
            <span className="font-heading font-bold text-xl md:text-2xl text-ivory-50 tracking-[0.2em] uppercase">
              PORT <span className="text-brass-500 italic">AZURE</span>
            </span>
        </div>
        <div className="flex items-center gap-12">
            <button onClick={() => setIsLogbookOpen(true)} className="hidden lg:flex items-center gap-2 text-[11px] font-bold tracking-[0.4em] text-ivory-100/70 uppercase hover:text-brass-500 transition-colors">
               <HardDrive className="w-4 h-4" /> NEURAL_DRIVE
            </button>
            <div className="hidden sm:flex items-center gap-6">
                <a href="#" className="flex items-center gap-3 text-emerald-950 bg-brass-500 px-10 py-3.5 rounded-sm text-[11px] font-bold tracking-[0.4em] uppercase">
                    <User className="w-4 h-4" /> GİRİŞ
                </a>
            </div>
        </div>
      </nav>

      <div className="flex-1 flex pt-[104px]">
        {/* Persistent File Explorer Sidebar */}
        <div className="hidden xl:block fixed left-0 top-[104px] bottom-0 z-30">
           <FileSystemSidebar files={vfs} onFileSelect={(path) => { setActivePath(path); setIsLogbookOpen(true); }} activePath={activePath} />
        </div>

        <div className="flex-1 xl:ml-72 transition-all">
          <main>
            <Hero lang={lang} />
            <InfoPanel weather={MOCK_WEATHER} config={activeMarina} lang={lang} />
            
            <div className="w-full max-w-[1400px] mx-auto px-4 mb-4 relative z-30">
               <div className="bg-black/60 backdrop-blur-3xl p-4 border border-brass-500/10 flex items-center justify-between rounded-sm">
                  <div className="flex items-center gap-4">
                     <Terminal className="w-5 h-5 text-brass-500" />
                     <div>
                        <div className="text-[10px] font-bold text-ivory-100/30 uppercase tracking-[0.2em]">Active Neural Stream</div>
                        <div className="text-xs font-bold text-ivory-100 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          {activePath}
                        </div>
                     </div>
                  </div>
                  <button onClick={() => setIsLogbookOpen(true)} className="flex items-center gap-2 border border-brass-500/30 text-brass-500 px-6 py-2 text-[9px] font-bold tracking-widest uppercase hover:bg-brass-500/10 transition-all">
                    OPEN_FS
                  </button>
               </div>
            </div>

            <BookingSearch lang={lang} onSearch={() => {}} />
            <ServicesSection lang={lang} />
            <MarinaMap lang={lang} onBookSlip={() => {}} searchCriteria={{}} />
          </main>
        </div>
      </div>

      <VHFRadio 
        config={activeMarina} 
        lang={lang} 
        vesselPos={vesselPos} 
        onFileUpdate={updateFile} 
        readFile={readFile} 
      />
      
      <Logbook 
        files={vfs} 
        isOpen={isLogbookOpen} 
        onClose={() => setIsLogbookOpen(false)} 
        activePath={activePath}
        onFileSelect={setActivePath}
      />
      
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(50px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c5a059; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
