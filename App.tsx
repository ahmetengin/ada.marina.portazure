
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Hero from './components/Hero';
import VHFRadio from './components/VHFRadio';
import InfoPanel from './components/InfoPanel';
import MarinaMap from './components/MarinaMap';
import ServicesSection from './components/ServicesSection';
import BookingSearch from './components/BookingSearch';
import Logbook from './components/Logbook';
import { MARINA_CONFIG, MOCK_WEATHER, TRANSLATIONS, FOOTER_LINKS } from './constants';
import { initializeAI } from './services/geminiService';
import { 
  Anchor, 
  HardDrive, 
  Navigation, 
  Globe, 
  CheckCircle, 
  Waves, 
  X, 
  CreditCard, 
  QrCode, 
  Radio, 
  Menu, 
  Clock, 
  Compass, 
  ShieldCheck,
  Smartphone,
  ExternalLink,
  User
} from 'lucide-react';
import { Language, Slip, BookingStatus } from './types';

const INITIAL_VFS = {
  '/docs/alesta-yacht-hotel.md': '# ALESTA YACHT HOTEL (Fethiye)\n- 52 boutique units directly across the harbor.\n- **Alarga Restaurant**: Rooftop gourmet dining with sunset view.\n- **Spa**: Traditional Turkish bath and wellness center.',
  '/docs/alesta-beach-club.md': '# ALESTA BEACH CLUB\n- Private beach at Aksazlar Bay.\n- **Shuttle**: Free boat transfer from the hotel pier every 30 minutes.\n- **Season**: Open from May 15 to October 15.',
  '/docs/port-guide.md': '# PORT AZURE MARITIME ENTRY\n- **VHF Channel**: 11 (Call Sign: Ada)\n- **Coordinates**: 36°45\'09"N / 28°56\'24"E\n- Standby 24/7 for berthing coordination.',
  '/docs/logs/reservations.md': '# MASTER RESERVATION LOG\n| PNR | GUEST | BERTH | DATE | STATUS |\n| :--- | :--- | :--- | :--- | :--- |\n| ALST-00000 | SYSTEM | INIT | 2025-01-01 | ACTIVE |',
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [isRadioActive, setIsRadioActive] = useState(false);
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);
  const [activePath, setActivePath] = useState<string>('/docs/port-guide.md');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // VFS State Management
  const [vfs, setVfs] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('alesta_vfs_v16');
    return saved ? JSON.parse(saved) : INITIAL_VFS;
  });

  const [bookingTrigger, setBookingTrigger] = useState<Slip | null>(null);
  const [bookingState, setBookingState] = useState<BookingStatus>('IDLE');
  const [pnr, setPnr] = useState('');

  const sessionId = useMemo(() => {
    const existing = sessionStorage.getItem('ada_session_id');
    if (existing) return existing;
    const newId = `ADA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    sessionStorage.setItem('ada_session_id', newId);
    return newId;
  }, []);

  useEffect(() => {
    localStorage.setItem('alesta_vfs_v16', JSON.stringify(vfs));
  }, [vfs]);

  useEffect(() => {
    initializeAI(lang, Object.keys(vfs));
  }, [lang, vfs]);

  const updateFile = useCallback((path: string, content: string) => {
    setVfs(prev => ({ ...prev, [path]: content }));
    setActivePath(path);
  }, []);

  const readFile = useCallback((path: string) => vfs[path] || null, [vfs]);

  const handleBookSlip = useCallback((slip: Slip) => {
    const newPnr = 'ALST-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    setPnr(newPnr);
    setBookingTrigger(slip);
    setBookingState('PRE_BOOKED');
  }, []);

  const confirmPayment = useCallback(() => {
    setBookingState('PAYING');
    setTimeout(() => {
      setBookingState('CONFIRMED');
      const log = `| ${pnr} | GUEST_MARINER | ${bookingTrigger?.number} | ${new Date().toISOString().split('T')[0]} | CONFIRMED |`;
      const current = vfs['/docs/logs/reservations.md'] || '';
      updateFile('/docs/logs/reservations.md', current + '\n' + log);
    }, 2500);
  }, [pnr, bookingTrigger, vfs, updateFile]);

  return (
    <div className="min-h-screen bg-navy-950 text-white font-sans selection:bg-azure-500 selection:text-white">
      
      {/* Top Status Ticker - High Visibility */}
      <div className="fixed top-0 w-full z-[100] bg-azure-600 text-white h-10 flex items-center overflow-hidden shadow-xl border-b border-white/20">
        <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap gap-16 text-[11px] font-mono tracking-[0.2em] font-black uppercase items-center">
            <span className="flex items-center gap-3"><Navigation className="w-3.5 h-3.5" /> LAT: {MARINA_CONFIG.coordinates.lat} N</span>
            <span className="flex items-center gap-3"><Radio className="w-3.5 h-3.5 text-sunlight-400" /> VHF_CH: {MARINA_CONFIG.vhfChannel} (STANDBY)</span>
            <span className="flex items-center gap-3"><Waves className="w-3.5 h-3.5" /> TIDE: STABLE</span>
            <span className="flex items-center gap-3"><ShieldCheck className="w-3.5 h-3.5" /> SYNC: SECURE</span>
            <span className="flex items-center gap-3 opacity-90 font-bold"><Clock className="w-3.5 h-3.5" /> {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <nav className="fixed top-10 w-full z-40 px-6 md:px-12 py-6 flex justify-between items-center nav-blur bg-navy-950/90 border-b border-azure-500/20 shadow-lg">
        <div 
          className="flex items-center gap-4 group cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <div className="w-12 h-12 bg-azure-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-azure-900/50 group-hover:scale-110 transition-transform">
               <Anchor className="w-7 h-7" />
            </div>
            <span className="font-heading font-bold text-2xl md:text-3xl tracking-[0.05em] uppercase text-white">
              PORT <span className="text-azure-500 italic">AZURE</span>
            </span>
        </div>
        
        <div className="flex items-center gap-10">
            <div className="hidden lg:flex gap-10 text-[12px] font-black tracking-[0.25em] text-white uppercase">
                <a href="#services" className="hover:text-azure-400 transition-all border-b-2 border-transparent hover:border-azure-500 pb-1">Hizmetler</a>
                <a href="#operations" className="hover:text-azure-400 transition-all border-b-2 border-transparent hover:border-azure-500 pb-1">Bağlama Planı</a>
                <button 
                  onClick={() => setIsLogbookOpen(true)} 
                  className="hover:text-azure-400 transition-all border-b-2 border-transparent hover:border-azure-500 pb-1 flex items-center gap-2"
                >
                  <HardDrive className="w-4 h-4" /> Arşiv
                </button>
            </div>

            <div className="flex items-center gap-6">
                <button 
                  onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} 
                  className="text-white bg-azure-900/40 border-2 border-azure-500/30 px-5 py-2 text-[11px] font-black hover:bg-azure-600 transition-all uppercase rounded-full flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" /> {lang.toUpperCase()}
                </button>
                <button 
                  className="hidden md:flex bg-azure-500 text-white px-8 py-3 rounded-full hover:bg-azure-400 transition-all text-[12px] font-black tracking-[0.15em] uppercase shadow-lg items-center gap-3 active:scale-95"
                >
                    <User className="w-5 h-5" /> PANEL
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-azure-400"><Menu className="w-8 h-8" /></button>
            </div>
        </div>
      </nav>

      {/* Floating ADA AI Button */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-5">
          <div className="bg-navy-900 border-2 border-azure-500/40 px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.3em] text-azure-400 uppercase animate-fade-in shadow-2xl">
             VHF CH 11 // STANDBY
          </div>
          <button 
            onClick={() => setIsRadioActive(true)}
            className="group relative w-24 h-24 bg-azure-600 text-white rounded-full flex items-center justify-center shadow-[0_30px_70px_rgba(14,165,233,0.5)] hover:shadow-[0_40px_90px_rgba(14,165,233,0.7)] transition-all duration-500 hover:-translate-y-3 active:scale-90 border-4 border-azure-400/40"
          >
              <div className="absolute inset-0 rounded-full bg-azure-400 animate-ping opacity-20 group-hover:opacity-40"></div>
              <Radio className="w-10 h-10 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-cyan-400 rounded-full border-4 border-navy-950 flex items-center justify-center">
                 <div className="w-2 h-2 bg-navy-950 rounded-full animate-pulse"></div>
              </div>
          </button>
      </div>

      <main className="pt-10">
        <Hero lang={lang} />
        <BookingSearch lang={lang} onSearch={() => {}} />
        
        <div id="services">
          <ServicesSection lang={lang} />
        </div>
        
        <div id="operations" className="max-w-[1400px] mx-auto py-32 px-6">
          <MarinaMap lang={lang} onBookSlip={handleBookSlip} />
        </div>
      </main>

      <InfoPanel weather={MOCK_WEATHER} config={MARINA_CONFIG} lang={lang} />
      
      <VHFRadio 
        config={MARINA_CONFIG} 
        lang={lang} 
        sessionId={sessionId} 
        onFileUpdate={updateFile} 
        readFile={readFile} 
        isActive={isRadioActive} 
        onToggle={() => setIsRadioActive(!isRadioActive)}
        availableFiles={Object.keys(vfs)}
      />

      <Logbook 
        files={vfs} 
        isOpen={isLogbookOpen} 
        onClose={() => setIsLogbookOpen(false)} 
        activePath={activePath}
        onFileSelect={setActivePath}
      />

      {/* Booking Modal */}
      {bookingState !== 'IDLE' && bookingTrigger && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-xl bg-navy-950/90 animate-fade-in">
           <div className="relative w-full max-w-xl bg-navy-900 border-2 border-azure-500/30 p-12 rounded-[3rem] shadow-2xl ring-1 ring-white/10 overflow-hidden">
              <button 
                onClick={() => setBookingState('IDLE')} 
                className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-7 h-7" />
              </button>
              
              {bookingState === 'PRE_BOOKED' && (
                <div className="animate-fade-in">
                   <div className="text-center mb-12">
                      <div className="w-24 h-24 bg-azure-600/20 text-azure-400 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-azure-500/30">
                         <Clock className="w-12 h-12 animate-pulse" />
                      </div>
                      <h2 className="font-heading text-4xl text-white mb-4 uppercase tracking-tight">REZERVASYON</h2>
                      <p className="text-[11px] text-azure-400/60 tracking-[0.5em] uppercase font-black font-mono">PNR: {pnr}</p>
                   </div>
                   <div className="bg-navy-950/80 p-8 rounded-[2rem] border border-azure-500/20 mb-10 text-[14px] space-y-5 font-mono">
                      <div className="flex justify-between border-b border-azure-500/10 pb-4">
                         <span className="text-white/40 uppercase">Bağlama Alanı</span>
                         <span className="text-azure-400 font-black">{bookingTrigger.number} ({bookingTrigger.pontoon})</span>
                      </div>
                      <div className="flex justify-between text-xl font-heading pt-4">
                         <span className="text-white/40 uppercase text-xs">Günlük Ücret</span>
                         <span className="text-sunlight-500 font-bold">€{bookingTrigger.price}</span>
                      </div>
                   </div>
                   <button 
                    onClick={confirmPayment} 
                    className="w-full py-6 bg-azure-600 text-white font-black tracking-[0.3em] uppercase hover:bg-azure-500 transition-all shadow-2xl rounded-2xl flex items-center justify-center gap-4 active:scale-95"
                   >
                     <CreditCard className="w-6 h-6" /> ÖDEMEYİ ONAYLA
                   </button>
                </div>
              )}

              {bookingState === 'PAYING' && (
                <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
                   <div className="w-20 h-20 border-t-4 border-azure-400 rounded-full animate-spin mb-10"></div>
                   <h3 className="font-heading text-2xl text-white tracking-[0.2em] uppercase">İŞLEM YAPILIYOR...</h3>
                </div>
              )}

              {bookingState === 'CONFIRMED' && (
                <div className="animate-fade-in text-center">
                   <div className="w-24 h-24 bg-azure-500/20 text-azure-400 rounded-full flex items-center justify-center mx-auto mb-10 border-2 border-azure-400/40">
                      <CheckCircle className="w-14 h-14" />
                   </div>
                   <h2 className="font-heading text-4xl text-white mb-4 uppercase tracking-tight">İŞLEM BAŞARILI</h2>
                   <p className="text-[11px] text-azure-400/60 tracking-[0.5em] uppercase mb-12 font-black font-mono">REFERANS: {pnr}</p>
                   <div className="bg-white p-6 rounded-3xl mb-12 inline-block"><QrCode className="w-40 h-40 text-navy-950" /></div>
                   <button 
                    onClick={() => setBookingState('IDLE')} 
                    className="w-full py-6 bg-navy-950 border-2 border-azure-500/30 text-azure-400 font-black tracking-[0.3em] uppercase hover:bg-azure-600 hover:text-white transition-all rounded-2xl"
                   >
                    KAPAT
                   </button>
                </div>
              )}
           </div>
        </div>
      )}

      <footer className="bg-navy-950 pt-56 pb-24 px-8 text-center relative overflow-hidden border-t border-azure-500/20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-azure-500/40 to-transparent"></div>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-5 mb-12">
            <Anchor className="w-12 h-12 text-azure-600" />
            <span className="font-heading font-bold text-3xl text-white tracking-widest uppercase">PORT AZURE</span>
          </div>
          <p className="text-white/50 text-[14px] tracking-[0.2em] uppercase mb-20 leading-loose max-w-3xl mx-auto font-medium">
            Akdeniz'in en seçkin liman operasyonları ve lüks misafirperverlik ağı.<br/>
            Alesta Group Network'ün bir parçasıdır.
          </p>
          <div className="flex justify-center flex-wrap gap-12 text-[12px] font-black tracking-[0.25em] text-white/30 uppercase mb-20">
            <a href="#" className="hover:text-azure-400 transition-colors">Güvenlik</a>
            <a href="#" className="hover:text-azure-400 transition-colors">Liman Kuralları</a>
            <a href="#" className="hover:text-azure-400 transition-colors">VHF İletişim</a>
            <a href="#" className="hover:text-azure-400 transition-colors">Gizlilik</a>
          </div>
          <div className="text-[11px] text-white/20 tracking-[0.4em] uppercase font-mono font-bold">
            © 2025 PORT AZURE MARITIME // SYNC_CORE_V16
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
