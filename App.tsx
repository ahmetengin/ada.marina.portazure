
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Hero from './components/Hero';
import VHFRadio from './components/VHFRadio';
import InfoPanel from './components/InfoPanel';
import MarinaMap from './components/MarinaMap';
import ServicesSection from './components/ServicesSection';
import BookingSearch from './components/BookingSearch';
import Logbook from './components/Logbook';
import FileSystemSidebar from './components/FileSystemSidebar';
import { MARINA_CONFIG, MOCK_WEATHER, TRANSLATIONS } from './constants';
import { 
  Anchor, 
  HardDrive, 
  Navigation, 
  Globe, 
  User, 
  CheckCircle, 
  Waves, 
  X, 
  CreditCard, 
  Clock, 
  QrCode, 
  ExternalLink, 
  Smartphone,
  ShieldCheck,
  Zap,
  Droplets,
  Wifi,
  Activity,
  Radio
} from 'lucide-react';
import { Language, Slip } from './types';

const INITIAL_VFS = {
  '/docs/alesta-hotel.md': '# ALESTA YACHT HOTEL\n- 52 Özel Oda\n- Roof Restaurant\n- SPA & Wellness',
  '/docs/alesta-yachting.md': '# ALESTA YACHTING\n- 14 Profesyonel Yat\n- Mavi Tur Operasyonları',
  '/docs/alesta-beach.md': '# ALESTA BEACH CLUB\n- Aksazlar Koyu\n- Ücretsiz Shuttle Boat Hizmeti',
  '/docs/logs/rezervasyonlar.md': '# REZERVASYON KAYITLARI\n| PNR | GUEST | SERVICE | DATE | STATUS |\n| :--- | :--- | :--- | :--- | :--- |\n| ALST-00000 | SYSTEM | INIT | 2025-01-01 | ACTIVE |',
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [isRadioActive, setIsRadioActive] = useState(false);
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);
  const [activePath, setActivePath] = useState<string>('/docs/alesta-hotel.md');
  const [vfs, setVfs] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('ada_vfs_v13_5');
    return saved ? JSON.parse(saved) : INITIAL_VFS;
  });

  // Booking Flow State
  const [bookingTrigger, setBookingTrigger] = useState<Slip | null>(null);
  const [bookingState, setBookingState] = useState<'IDLE' | 'PRE_BOOKED' | 'PAYING' | 'CONFIRMED'>('IDLE');
  const [pnr, setPnr] = useState('');
  const [searchCriteria, setSearchCriteria] = useState<any>(null);

  const sessionId = useMemo(() => {
    const existing = sessionStorage.getItem('ada_session_id');
    if (existing) return existing;
    const newId = `BASE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    sessionStorage.setItem('ada_session_id', newId);
    return newId;
  }, []);

  useEffect(() => {
    localStorage.setItem('ada_vfs_v13_5', JSON.stringify(vfs));
  }, [vfs]);

  const updateFile = useCallback((path: string, content: string) => {
    setVfs(prev => ({ ...prev, [path]: content }));
    setActivePath(path);
  }, []);

  const readFile = useCallback((path: string) => vfs[path] || null, [vfs]);

  const generatePNR = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'ALST-';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(chars.length * Math.random()));
    }
    return result;
  };

  const handleBookSlip = (slip: Slip) => {
    const newPnr = generatePNR();
    setPnr(newPnr);
    setBookingTrigger(slip);
    setBookingState('PRE_BOOKED');
  };

  const confirmPayment = () => {
    setBookingState('PAYING');
    setTimeout(() => {
      setBookingState('CONFIRMED');
      // Auto-log to VFS on successful booking
      const timestamp = new Date().toISOString().split('T')[0];
      const newEntry = `| ${pnr} | GUEST_WEB | BERTH_${bookingTrigger?.number} | ${timestamp} | CONFIRMED |`;
      const currentLog = vfs['/docs/logs/rezervasyonlar.md'] || '';
      const lines = currentLog.split('\n');
      // Insert after header and alignment row
      lines.splice(4, 0, newEntry);
      updateFile('/docs/logs/rezervasyonlar.md', lines.join('\n'));
    }, 2500);
  };

  const closeModals = () => {
    setBookingState('IDLE');
    setBookingTrigger(null);
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-ivory-100/90 font-sans selection:bg-brass-500 selection:text-emerald-950">
      
      {/* Status Bar */}
      <div className="fixed top-0 w-full z-[100] bg-black/90 backdrop-blur-md border-b border-brass-500/10 h-10 flex items-center overflow-hidden">
        <div className="flex animate-[ticker_60s_linear_infinite] whitespace-nowrap gap-16 text-[9px] font-mono tracking-[0.4em] text-brass-400/80 items-center font-bold">
            <span className="flex items-center gap-3"><Waves className="w-3 h-3" /> PNR PROTOCOL: ACTIVE</span>
            <span className="flex items-center gap-3"><Navigation className="w-3 h-3" /> SESSION: {sessionId}</span>
            <span className="flex items-center gap-3 text-emerald-500"><CheckCircle className="w-3 h-3" /> ADA NEURAL LINK: ONLINE</span>
            <span className="flex items-center gap-3"><ShieldCheck className="w-3 h-3" /> SECURE_PAYMENT: ENABLED</span>
        </div>
      </div>

      <nav className="fixed top-10 w-full z-[90] px-6 md:px-12 py-4 flex justify-between items-center backdrop-blur-2xl bg-emerald-900/40 border-b border-brass-500/10">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <Anchor className="w-8 h-8 text-brass-500" />
            <span className="font-heading font-bold text-xl text-ivory-50 tracking-widest uppercase">PORT <span className="text-brass-500 italic">AZURE</span></span>
        </div>
        
        <div className="flex items-center gap-8">
            <div className="hidden lg:flex gap-10 text-[10px] font-bold tracking-widest text-ivory-100/70 uppercase">
                <button onClick={() => setIsLogbookOpen(true)} className="hover:text-brass-500 transition-colors flex items-center gap-2 font-bold tracking-widest"><HardDrive className="w-4 h-4" /> ARŞİV</button>
                <a href="#services" className="hover:text-brass-500 transition-colors tracking-widest">ALESTA HUB</a>
            </div>
            <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="text-[10px] font-bold tracking-widest border border-brass-500/30 px-4 py-2 hover:border-brass-500 transition-colors bg-white/5 uppercase">
                <Globe className="w-4 h-4 inline mr-2" /> {lang}
            </button>
            <button className="hidden sm:block text-[10px] font-bold tracking-widest bg-brass-500 text-emerald-950 px-8 py-3 hover:bg-ivory-50 transition-all uppercase">
                <User className="w-4 h-4 inline mr-2" /> GİRİŞ
            </button>
        </div>
      </nav>

      <div className="flex pt-24 min-h-screen">
        <aside className="hidden xl:block w-72 border-r border-brass-500/10 bg-black/20 overflow-y-auto">
           <FileSystemSidebar files={vfs} activePath={activePath} onFileSelect={(p) => { setActivePath(p); setIsLogbookOpen(true); }} />
        </aside>

        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
           <Hero lang={lang} />
           <BookingSearch lang={lang} onSearch={setSearchCriteria} />
           <ServicesSection lang={lang} />
           
           <div id="operations" className="py-32 px-6 md:px-20 bg-[#010505] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brass-500/20 to-transparent"></div>
              <div className="max-w-7xl mx-auto mb-20">
                <span className="text-brass-500 text-[10px] tracking-[0.5em] uppercase font-bold mb-4 block">Bridge View</span>
                <h2 className="font-heading text-4xl md:text-6xl text-ivory-50 uppercase tracking-tight">Vessel <span className="italic text-brass-500 lowercase">Deployment</span></h2>
              </div>
              <MarinaMap lang={lang} onBookSlip={handleBookSlip} searchCriteria={searchCriteria} />
           </div>

           <footer className="bg-emerald-900/40 py-16 text-center border-t border-brass-500/10">
              <div className="flex justify-center gap-8 mb-8 opacity-40">
                <Zap className="w-5 h-5 text-brass-500" />
                <Wifi className="w-5 h-5 text-brass-500" />
                <Droplets className="w-5 h-5 text-brass-500" />
              </div>
              <div className="font-mono text-[9px] text-brass-500/30 tracking-[0.4em] uppercase">
                © 2025 PORT AZURE MARITIME & ALESTA GROUP SYNC. OVER.
              </div>
           </footer>
        </main>
      </div>

      {/* Floating Radio Trigger */}
      <div className="fixed bottom-10 right-10 z-[150]">
         <button 
           onClick={() => setIsRadioActive(true)}
           className="w-20 h-20 bg-brass-500 rounded-full flex items-center justify-center text-emerald-950 shadow-[0_0_50px_rgba(197,160,89,0.4)] hover:scale-110 active:scale-95 transition-all relative overflow-hidden group"
         >
            <Radio className="w-8 h-8 relative z-10" />
            <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping opacity-20"></div>
         </button>
      </div>

      {/* Modern Refactored Booking Modal */}
      {bookingState !== 'IDLE' && bookingTrigger && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-emerald-950/80 animate-fade-in overflow-y-auto">
           <div className="relative w-full max-w-2xl bg-[#051412] border-[1px] border-brass-500/30 shadow-[0_100px_200px_rgba(0,0,0,0.8)] md:rounded-[4rem] overflow-hidden">
              
              <button onClick={closeModals} className="absolute top-8 right-8 text-ivory-100/20 hover:text-red-500 transition-colors p-4 rounded-full bg-white/5 border border-white/10">
                 <X className="w-6 h-6" />
              </button>
              
              <div className="p-12 md:p-16">
                {/* Step Indicators */}
                <div className="flex justify-between mb-16 px-4">
                  {['BERTH', 'PAYMENT', 'SYNC'].map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-3">
                      <div className={`w-3 h-3 rounded-full border-2 transition-all duration-700 ${
                        (i === 0 && bookingState === 'PRE_BOOKED') || 
                        (i === 1 && bookingState === 'PAYING') || 
                        (i === 2 && bookingState === 'CONFIRMED') ? 'bg-brass-500 border-brass-500 shadow-[0_0_15px_#c5a059]' : 'bg-emerald-950 border-brass-500/20'
                      }`}></div>
                      <span className={`text-[8px] font-mono tracking-widest uppercase font-bold ${
                        (i === 0 && bookingState === 'PRE_BOOKED') || (i === 1 && bookingState === 'PAYING') || (i === 2 && bookingState === 'CONFIRMED') ? 'text-brass-500' : 'text-ivory-100/20'
                      }`}>{step}</span>
                    </div>
                  ))}
                </div>

                {bookingState === 'PRE_BOOKED' && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-4 mb-10 opacity-60">
                       <ShieldCheck className="w-5 h-5 text-emerald-500" />
                       <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-ivory-100/60">Deployment Confirmation</span>
                    </div>

                    <h2 className="font-heading text-4xl text-ivory-50 mb-8 uppercase tracking-tighter">PREPARING <span className="italic text-brass-500 lowercase">berth {bookingTrigger.number}</span></h2>
                    
                    <div className="bg-emerald-950/40 p-10 border border-brass-500/10 rounded-2xl mb-12 font-mono text-[11px] uppercase tracking-[0.2em] space-y-6">
                       <div className="flex justify-between border-b border-white/5 pb-4">
                          <span className="text-ivory-100/30">Vessel Slip</span>
                          <span className="text-ivory-50">{bookingTrigger.pontoon} // {bookingTrigger.number}</span>
                       </div>
                       <div className="flex justify-between border-b border-white/5 pb-4">
                          <span className="text-ivory-100/30">Dimensions</span>
                          <span className="text-ivory-50">{bookingTrigger.length}m x {bookingTrigger.beam}m</span>
                       </div>
                       <div className="flex justify-between pt-4">
                          <span className="text-ivory-100/30">Amount Due</span>
                          <span className="text-brass-500 font-heading text-2xl">€{bookingTrigger.price}</span>
                       </div>
                    </div>

                    <button 
                      onClick={confirmPayment}
                      className="w-full py-8 bg-brass-500 text-emerald-950 font-bold tracking-[0.5em] uppercase hover:bg-ivory-50 transition-all shadow-2xl flex items-center justify-center gap-6 text-[11px]"
                    >
                      <CreditCard className="w-5 h-5" /> AUTHORIZE PAYMENT
                    </button>
                    <p className="mt-8 text-[9px] text-center text-ivory-100/30 tracking-widest uppercase italic">Secure link established via Ada's Neural Hub.</p>
                  </div>
                )}

                {bookingState === 'PAYING' && (
                  <div className="flex flex-col items-center justify-center py-24 animate-fade-in text-center">
                    <div className="w-20 h-20 border-t-2 border-brass-500 rounded-full animate-spin mb-10 shadow-[0_0_30px_rgba(197,160,89,0.2)]"></div>
                    <h3 className="font-heading text-xl text-ivory-50 tracking-widest mb-4">SYNCING WITH MARITIME LEDGER...</h3>
                    <p className="text-[10px] text-ivory-100/30 tracking-widest uppercase font-bold">Verifying PNR: {pnr}</p>
                  </div>
                )}

                {bookingState === 'CONFIRMED' && (
                  <div className="animate-fade-in text-center">
                    <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-10 text-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.2)]">
                       <CheckCircle className="w-12 h-12" />
                    </div>
                    <h2 className="font-heading text-5xl text-ivory-50 mb-4 uppercase tracking-tighter">BERTH <span className="italic text-brass-500 lowercase">secured</span></h2>
                    <p className="text-[10px] text-ivory-100/30 tracking-[0.4em] uppercase mb-12 font-bold font-mono">PNR: {pnr}</p>

                    <div className="bg-white p-6 rounded-2xl mb-12 inline-block shadow-2xl border-4 border-emerald-900">
                       <QrCode className="w-32 h-32 text-emerald-950" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                       <button className="py-4 border border-brass-500/20 text-brass-500 text-[9px] tracking-widest font-bold uppercase hover:bg-brass-500 hover:text-emerald-950 transition-all flex items-center justify-center gap-3">
                          <Smartphone className="w-4 h-4" /> WALLET
                       </button>
                       <button className="py-4 border border-brass-500/20 text-brass-500 text-[9px] tracking-widest font-bold uppercase hover:bg-brass-500 hover:text-emerald-950 transition-all flex items-center justify-center gap-3">
                          <ExternalLink className="w-4 h-4" /> LOGBOOK
                       </button>
                    </div>

                    <button 
                      onClick={closeModals}
                      className="w-full py-6 bg-emerald-950 text-brass-500 font-bold tracking-[0.4em] uppercase hover:bg-brass-500 hover:text-emerald-950 transition-all text-[10px] border border-brass-500/20"
                    >
                      RETURN TO COMMAND BRIDGE
                    </button>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}

      <VHFRadio 
        config={MARINA_CONFIG} lang={lang} sessionId={sessionId} 
        onFileUpdate={updateFile} readFile={readFile} 
        isActive={isRadioActive} onToggle={() => setIsRadioActive(!isRadioActive)} 
        availableFiles={Object.keys(vfs)} 
      />
      
      <Logbook files={vfs} isOpen={isLogbookOpen} onClose={() => setIsLogbookOpen(false)} activePath={activePath} onFileSelect={setActivePath} />
      
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c5a059; border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .brass-glow { box-shadow: 0 0 40px rgba(197, 160, 89, 0.2); }
      `}</style>
    </div>
  );
};

export default App;
