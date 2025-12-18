
import React, { useEffect, useState, useCallback } from 'react';
import Hero from './components/Hero';
import VHFRadio from './components/VHFRadio';
import InfoPanel from './components/InfoPanel';
import MarinaMap from './components/MarinaMap';
import ServicesSection from './components/ServicesSection';
import BookingSearch from './components/BookingSearch';
import Logbook from './components/Logbook';
import { MARINA_CONFIG, MOCK_WEATHER, TRANSLATIONS, FACILITIES_TRANSLATIONS, FOOTER_LINKS } from './constants';
import { initializeAI } from './services/geminiService';
import { Ship, Anchor, Zap, Wifi, Globe, Smartphone, User, Shield, Calendar, CheckCircle, QrCode, X, Menu, CreditCard, Clock, ExternalLink, Waves, Navigation, Book } from 'lucide-react';
import { Language, Slip, LogEntry } from './types';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [bookingTrigger, setBookingTrigger] = useState<Slip | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<any>(null);
  const [bookingState, setBookingState] = useState<'IDLE' | 'PRE_BOOKED' | 'PAYING' | 'CONFIRMED'>('IDLE');
  const [pnr, setPnr] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Logbook State (Hafıza Modülü)
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('commodore_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('commodore_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    initializeAI(lang);
  }, [lang]);

  const generatePNR = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(chars.length * Math.random()));
    }
    return result;
  };

  const handleBookSlip = (slip: Slip) => {
    const newPnr = generatePNR();
    setPnr(newPnr);
    setBookingTrigger(slip);
    setBookingState('PRE_BOOKED');
    setIsMenuOpen(false);
  };

  const confirmPayment = () => {
    setBookingState('PAYING');
    setTimeout(() => {
      setBookingState('CONFIRMED');
    }, 2000);
  };

  const handleSearch = (criteria: any) => {
    setSearchCriteria(criteria);
  };

  const closeModals = () => {
    setBookingState('IDLE');
    setBookingTrigger(null);
  };

  const handleNewLog = useCallback((entry: LogEntry) => {
    setLogs(prev => [entry, ...prev]);
  }, []);

  const getPastLogs = useCallback(() => {
    return logs;
  }, [logs]);

  return (
    <div className="relative min-h-screen bg-emerald-950 selection:bg-brass-500 selection:text-emerald-950 font-sans text-ivory-100/90">
      
      {/* Live Ticker */}
      <div className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-brass-500/20 h-10 flex items-center overflow-hidden">
        <div className="flex animate-[ticker_60s_linear_infinite] whitespace-nowrap gap-16 text-[10px] font-mono tracking-[0.4em] text-brass-400/80 items-center font-bold">
            <span className="flex items-center gap-3"><Waves className="w-3 h-3" /> WIND: NW 8KTS</span>
            <span className="flex items-center gap-3"><Navigation className="w-3 h-3" /> TIDE: +0.4M (HIGH)</span>
            <span className="flex items-center gap-3"><Shield className="w-3 h-3" /> SECURITY STATUS: PROTECTED</span>
            <span className="flex items-center gap-3"><Anchor className="w-3 h-3" /> ADA MEMORY: ONLINE</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-10 w-full z-40 px-6 md:px-12 py-6 flex justify-between items-center backdrop-blur-2xl bg-emerald-900/40 border-b border-brass-500/10">
        <div className="flex items-center gap-4 group cursor-pointer">
            <Anchor className="w-8 h-8 text-brass-500 group-hover:rotate-12 transition-transform" />
            <span className="font-heading font-bold text-xl md:text-2xl text-ivory-50 tracking-[0.2em] uppercase">
              THE <span className="text-brass-500 italic">COMMODORE</span>
            </span>
        </div>
        
        <div className="flex items-center gap-12">
            <div className="hidden lg:flex gap-12 text-[11px] font-bold tracking-[0.4em] text-ivory-100/70 uppercase">
                <a href="#marina-map" className="hover:text-brass-500 transition-colors">LOKASYON</a>
                <button onClick={() => setIsLogbookOpen(true)} className="hover:text-brass-500 transition-colors flex items-center gap-2">
                   <Book className="w-4 h-4" /> LOGBOOK
                </button>
                <a href="#heritage" className="hover:text-brass-500 transition-colors">MİRAS</a>
            </div>

            <div className="hidden sm:flex items-center gap-6">
                <div className="relative group">
                    <button className="flex items-center gap-3 text-ivory-100/70 border border-brass-500/30 px-5 py-2.5 rounded-sm hover:border-brass-500 transition-colors bg-white/5">
                        <Globe className="w-4 h-4" />
                        <span className="uppercase text-[10px] font-sans tracking-[0.3em] font-bold">{lang}</span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-40 bg-emerald-900 border border-brass-500/20 rounded-sm shadow-2xl hidden group-hover:block overflow-hidden z-[100] backdrop-blur-3xl">
                        {(['tr', 'en', 'de'] as Language[]).map(l => (
                             <button 
                                key={l}
                                onClick={() => setLang(l)}
                                className={`w-full text-left px-6 py-5 text-[11px] uppercase tracking-[0.3em] hover:bg-brass-500 hover:text-emerald-950 transition-all font-bold ${lang === l ? 'text-brass-500' : 'text-ivory-100'}`}>
                                {l === 'tr' ? 'TÜRKÇE' : l === 'en' ? 'ENGLISH' : 'DEUTSCH'}
                            </button>
                        ))}
                    </div>
                </div>
                <a href="#" className="flex items-center gap-3 text-emerald-950 bg-brass-500 px-10 py-3.5 rounded-sm hover:bg-ivory-50 transition-all text-[11px] font-bold tracking-[0.4em] uppercase shadow-[0_10px_20px_rgba(197,160,89,0.3)]">
                    <User className="w-4 h-4" /> GİRİŞ
                </a>
            </div>
            
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-brass-500 p-2">
              {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
        </div>
      </nav>

      <main>
        <Hero lang={lang} />
        <BookingSearch lang={lang} onSearch={handleSearch} />
        <ServicesSection lang={lang} />
        <MarinaMap lang={lang} onBookSlip={handleBookSlip} searchCriteria={searchCriteria} />

        <footer className="bg-emerald-900/60 pt-40 pb-20 px-8 border-t border-brass-500/10 text-sm">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-20 mb-32">
                <div className="col-span-1 lg:col-span-2">
                     <div className="flex items-center gap-4 mb-10">
                        <Anchor className="w-9 h-9 text-brass-500" />
                        <span className="font-heading font-bold text-2xl text-ivory-50 tracking-widest uppercase">THE <span className="text-brass-500 italic">COMMODORE</span></span>
                    </div>
                    <p className="text-ivory-100/50 mb-10 leading-relaxed font-light text-lg max-w-sm font-serif italic">The pinnacle of Mediterranean heritage. Experience the legacy of excellence in the heart of the Riviera.</p>
                </div>
                <div>
                    <h4 className="text-brass-500 font-heading text-[12px] mb-10 tracking-[0.5em] uppercase font-bold">LOCATIONS</h4>
                    <ul className="space-y-4 text-ivory-100/40 text-[11px] tracking-widest font-bold">
                        {FOOTER_LINKS[lang].turkey.map(m => <li key={m} className="hover:text-brass-400 cursor-pointer transition-colors uppercase">{m}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="text-brass-500 font-heading text-[12px] mb-10 tracking-[0.5em] uppercase font-bold">CONTACT</h4>
                    <ul className="space-y-4 text-ivory-100/40 text-[11px] tracking-widest font-bold uppercase">
                        <li>VHF CH 11 (ADA)</li>
                        <li>+377 98 06 20 00</li>
                        <li>ada@commodore.mc</li>
                    </ul>
                </div>
            </div>
        </footer>
      </main>

      {/* Booking Modal */}
      {bookingState !== 'IDLE' && bookingTrigger && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-3xl bg-emerald-950/80 animate-fade-in overflow-y-auto">
           <div className="relative w-full max-w-2xl bg-[#0d2a26] border-[1px] border-brass-500/30 shadow-[0_100px_200px_rgba(0,0,0,0.8)] p-12 md:p-16 md:rounded-[5rem] overflow-hidden">
              <button onClick={closeModals} className="absolute top-10 right-10 text-ivory-100/30 hover:text-white transition-colors bg-white/5 p-4 rounded-full border border-white/10">
                 <X className="w-6 h-6" />
              </button>
              
              {bookingState === 'PRE_BOOKED' && (
                <div className="animate-fade-in text-center">
                   <Clock className="w-20 h-20 text-brass-500 mx-auto mb-8 opacity-60 animate-pulse" />
                   <h2 className="font-heading text-4xl text-ivory-50 mb-4 uppercase tracking-tighter">6 HOUR <span className="italic text-brass-500 font-serif lowercase">hold</span></h2>
                   <p className="text-[11px] text-ivory-100/50 tracking-[0.5em] uppercase mb-12 font-bold">PNR: {pnr}</p>
                   <div className="bg-emerald-950/40 p-10 border border-brass-500/20 rounded-xl mb-12 font-mono text-[12px] uppercase tracking-[0.2em] space-y-6">
                      <div className="flex justify-between border-b border-white/5 pb-6">
                         <span>Vessel Suite</span>
                         <span className="text-ivory-50 font-bold">{bookingTrigger.pontoon}-{bookingTrigger.number}</span>
                      </div>
                      <div className="flex justify-between text-xl">
                         <span>Total Amount</span>
                         <span className="text-brass-500 font-heading font-bold">€{bookingTrigger.price}</span>
                      </div>
                   </div>
                   <button onClick={confirmPayment} className="w-full py-8 bg-brass-500 text-emerald-950 font-bold tracking-[0.6em] uppercase hover:bg-ivory-50 transition-all shadow-xl flex items-center justify-center gap-6">
                        <CreditCard className="w-6 h-6" /> PROCEED TO PAYMENT
                   </button>
                </div>
              )}

              {bookingState === 'PAYING' && (
                <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
                   <div className="w-24 h-24 border-t-2 border-brass-500 rounded-full animate-spin mb-12"></div>
                   <h3 className="font-heading text-2xl text-ivory-50 tracking-[0.5em]">PROCESSING...</h3>
                </div>
              )}

              {bookingState === 'CONFIRMED' && (
                <div className="animate-fade-in text-center">
                   <div className="w-28 h-28 bg-emerald-400/10 border border-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-12 text-emerald-400 shadow-[0_0_80px_rgba(52,211,153,0.3)]">
                      <CheckCircle className="w-16 h-16" />
                   </div>
                   <h2 className="font-heading text-5xl text-ivory-50 mb-6 uppercase tracking-tighter">VOYAGE <span className="italic text-brass-500 font-serif lowercase">secured</span></h2>
                   <p className="text-[11px] text-ivory-100/40 tracking-[0.5em] uppercase mb-16 font-bold">PNR: {pnr}</p>
                   <div className="bg-white p-8 rounded-2xl mb-16 inline-block">
                      <QrCode className="w-40 h-40 text-emerald-950" />
                   </div>
                   <button onClick={closeModals} className="w-full py-8 bg-emerald-950 text-brass-500 font-bold tracking-[0.5em] uppercase border border-brass-500/30">
                     RETURN TO BRIDGE
                   </button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* VHF Radio Component */}
      <VHFRadio 
        config={MARINA_CONFIG} 
        lang={lang} 
        triggerBooking={bookingTrigger} 
        bookingState={bookingState} 
        pnr={pnr} 
        onLogEntry={handleNewLog}
        getPastLogs={getPastLogs}
      />

      {/* Logbook Viewer */}
      <Logbook 
        logs={logs} 
        isOpen={isLogbookOpen} 
        onClose={() => setIsLogbookOpen(false)} 
        onClear={() => {
           if(confirm("Tüm seyir kayıtları silinecek. Onaylıyor musunuz?")) {
             setLogs([]);
             localStorage.removeItem('commodore_logs');
           }
        }}
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
