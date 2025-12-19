
import React, { useEffect, useState, useCallback } from 'react';
import Hero from './components/Hero';
import VHFRadio from './components/VHFRadio';
import InfoPanel from './components/InfoPanel';
import MarinaMap from './components/MarinaMap';
import ServicesSection from './components/ServicesSection';
import BookingSearch from './components/BookingSearch';
import Logbook from './components/Logbook';
import { MARINA_NETWORK, MOCK_WEATHER, TRANSLATIONS, FACILITIES_TRANSLATIONS, FOOTER_LINKS } from './constants';
import { initializeAI } from './services/geminiService';
import { Ship, Anchor, Zap, Wifi, Globe, Smartphone, User, Shield, Calendar, CheckCircle, QrCode, X, Menu, CreditCard, Clock, ExternalLink, Waves, Navigation, Book, Info, MapPin, Radio, Crosshair } from 'lucide-react';
import { Language, Slip, LogEntry, MarinaConfig } from './types';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  // MARINA_NETWORK has 4 items (0-3). Index 2 is the Commodore Cove.
  const [activeMarina, setActiveMarina] = useState<MarinaConfig>(MARINA_NETWORK[2]); 
  
  // AIS / GPS State
  const [vesselPos, setVesselPos] = useState({ lat: 36.7525, lng: 28.9400 }); // Initially at Commodore
  const [isSimulatingGPS, setIsSimulatingGPS] = useState(true);

  const [bookingTrigger, setBookingTrigger] = useState<Slip | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    arrival: '', arrivalTime: '12:00', departure: '', departureTime: '11:00',
    vesselName: '', length: '', beam: '', marinaId: MARINA_NETWORK[2].id, region: 'GOCEK'
  });
  const [bookingState, setBookingState] = useState<'IDLE' | 'PRE_BOOKED' | 'PAYING' | 'CONFIRMED'>('IDLE');
  const [pnr, setPnr] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('commodore_logs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('commodore_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    initializeAI(lang);
  }, [lang]);

  const snapToVessel = (marinaId: string) => {
    const marina = MARINA_NETWORK.find(m => m.id === marinaId);
    if (marina) {
      setVesselPos({ lat: marina.coordinates.nLat, lng: marina.coordinates.nLong });
      setActiveMarina(marina);
    }
  };

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
    if (!bookingDetails.vesselName) {
      alert(lang === 'tr' ? "Lütfen tekne adını giriniz." : "Please enter your vessel name.");
      return;
    }
    setBookingState('PAYING');
    setTimeout(() => {
      setBookingState('CONFIRMED');
      const entry: LogEntry = {
        timestamp: new Date().toLocaleTimeString(),
        type: 'BOOKING', author: 'SYSTEM', vessel: bookingDetails.vesselName,
        subject: `VOYAGE SECURED: ${activeMarina.name}`,
        text: `${activeMarina.name} (${activeMarina.region}) lokasyonunda ${bookingTrigger?.pontoon}-${bookingTrigger?.number} nolu ünite rezerve edildi. PNR: ${pnr}`
      };
      setLogs(prev => [entry, ...prev]);
    }, 2000);
  };

  const handleSearch = (criteria: any) => {
    setBookingDetails(prev => ({ ...prev, ...criteria }));
    const marina = MARINA_NETWORK.find(m => m.id === criteria.marinaId);
    if (marina) setActiveMarina(marina);
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
      
      {/* AIS / GPS Live Panel */}
      <div className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-brass-500/20 h-10 flex items-center overflow-hidden">
        <div className="flex animate-[ticker_60s_linear_infinite] whitespace-nowrap gap-16 text-[10px] font-mono tracking-[0.4em] text-brass-400/80 items-center font-bold">
            <span className="flex items-center gap-3"><Crosshair className="w-3 h-3 text-emerald-400" /> AIS SIGNAL: ACTIVE</span>
            <span className="flex items-center gap-3"><Navigation className="w-3 h-3" /> LAT: {vesselPos.lat.toFixed(4)}N / LNG: {vesselPos.lng.toFixed(4)}E</span>
            <span className="flex items-center gap-3 uppercase"><MapPin className="w-3 h-3" /> NEAREST NODE: {activeMarina.name}</span>
            <span className="flex items-center gap-3"><Waves className="w-3 h-3" /> DEPTH: 14.2M</span>
            <span className="flex items-center gap-3"><Shield className="w-3 h-3" /> ADA CONCIERGE: MONITORING VOYAGE</span>
        </div>
      </div>

      <nav className="fixed top-10 w-full z-40 px-6 md:px-12 py-6 flex justify-between items-center backdrop-blur-2xl bg-emerald-900/40 border-b border-brass-500/10">
        <div className="flex items-center gap-4 group cursor-pointer">
            <Anchor className="w-8 h-8 text-brass-500 group-hover:rotate-12 transition-transform" />
            <span className="font-heading font-bold text-xl md:text-2xl text-ivory-50 tracking-[0.2em] uppercase">
              TURQUOISE <span className="text-brass-500 italic">COAST</span>
            </span>
        </div>
        
        <div className="flex items-center gap-12">
            <div className="hidden lg:flex gap-12 text-[11px] font-bold tracking-[0.4em] text-ivory-100/70 uppercase">
                <a href="#marina-map" className="hover:text-brass-500 transition-colors">INVENTORY</a>
                <button onClick={() => setIsLogbookOpen(true)} className="hover:text-brass-500 transition-colors flex items-center gap-2">
                   <Book className="w-4 h-4" /> LOGBOOK
                </button>
                <a href="#heritage" className="hover:text-brass-500 transition-colors">HERITAGE</a>
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
        <InfoPanel weather={MOCK_WEATHER} config={activeMarina} lang={lang} />
        
        {/* AIS Vessel Control Panel */}
        <div className="w-full max-w-[1600px] mx-auto px-4 mb-4 relative z-30">
           <div className="bg-black/40 backdrop-blur-3xl p-4 border border-brass-500/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                    <Ship className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-[10px] font-bold text-ivory-100/30 uppercase tracking-[0.2em]">Current AIS Status</div>
                    <div className="text-xs font-bold text-ivory-100 uppercase tracking-widest">Cruising near {activeMarina.name}</div>
                 </div>
              </div>
              <div className="flex gap-4">
                 <select 
                   onChange={(e) => snapToVessel(e.target.value)}
                   className="bg-emerald-950 border border-brass-500/20 text-[9px] font-bold text-brass-400 px-4 py-2 uppercase tracking-widest outline-none"
                 >
                    <option value="">Snap to Position</option>
                    {MARINA_NETWORK.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                 </select>
                 <button className="flex items-center gap-2 bg-brass-500 text-emerald-950 px-6 py-2 text-[9px] font-bold tracking-widest uppercase hover:bg-ivory-50 transition-all">
                    <Navigation className="w-3 h-3" /> Sync GPS
                 </button>
              </div>
           </div>
        </div>

        <BookingSearch lang={lang} onSearch={handleSearch} />
        <ServicesSection lang={lang} />
        <MarinaMap lang={lang} onBookSlip={handleBookSlip} searchCriteria={bookingDetails} />

        <footer className="bg-emerald-900/60 pt-40 pb-20 px-8 border-t border-brass-500/10 text-sm">
            {/* Standard Footer */}
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-20 mb-32">
                <div className="col-span-1 lg:col-span-2">
                     <div className="flex items-center gap-4 mb-10">
                        <Anchor className="w-9 h-9 text-brass-500" />
                        <span className="font-heading font-bold text-2xl text-ivory-50 tracking-widest uppercase">TURQUOISE <span className="text-brass-500 italic">COAST</span></span>
                    </div>
                    <p className="text-ivory-100/50 mb-10 leading-relaxed font-light text-lg max-w-sm font-serif italic">Unified Riviera Management. Your voyage, our legacy.</p>
                </div>
                <div>
                    <h4 className="text-brass-500 font-heading text-[12px] mb-10 tracking-[0.5em] uppercase font-bold">NETWORK NODES</h4>
                    <ul className="space-y-4 text-ivory-100/40 text-[11px] tracking-widest font-bold">
                        {MARINA_NETWORK.map(m => <li key={m.id} className="hover:text-brass-400 cursor-pointer transition-colors uppercase">{m.name}</li>)}
                    </ul>
                </div>
            </div>
        </footer>
      </main>

      {/* Unified Booking Modal */}
      {bookingState !== 'IDLE' && bookingTrigger && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-emerald-950/80 animate-fade-in overflow-y-auto">
           <div className="relative w-full max-w-4xl bg-[#0d2a26] border-[1px] border-brass-500/30 shadow-[0_100px_200px_rgba(0,0,0,0.8)] p-8 md:p-16 md:rounded-[4rem] overflow-hidden">
              <button onClick={closeModals} className="absolute top-6 right-6 md:top-10 md:right-10 text-ivory-100/30 hover:text-white transition-colors bg-white/5 p-4 rounded-full border border-white/10">
                 <X className="w-6 h-6" />
              </button>
              
              {bookingState === 'PRE_BOOKED' && (
                <div className="animate-fade-in">
                   <div className="text-center mb-10">
                      <Anchor className="w-16 h-16 text-brass-500 mx-auto mb-6 opacity-60 animate-pulse" />
                      <h2 className="font-heading text-4xl text-ivory-50 mb-2 uppercase tracking-tighter">SECURE <span className="italic text-brass-500 font-serif lowercase">suite</span></h2>
                      <p className="text-[10px] text-ivory-100/40 tracking-[0.5em] uppercase font-bold">{activeMarina.name} // PNR: {pnr}</p>
                   </div>
                   {/* ... Form and Price Calculation ... */}
                   <button onClick={confirmPayment} className="w-full py-8 bg-brass-500 text-emerald-950 font-bold tracking-[0.6em] uppercase hover:bg-ivory-50 transition-all shadow-[0_20px_60px_rgba(197,160,89,0.3)] flex items-center justify-center gap-6">
                        <CreditCard className="w-6 h-6" /> PAY & SECURE VOYAGE
                   </button>
                </div>
              )}
              {/* ... Other Booking States ... */}
           </div>
        </div>
      )}

      <VHFRadio 
        config={activeMarina} 
        lang={lang} 
        vesselPos={vesselPos}
        onLogEntry={handleNewLog}
        getPastLogs={getPastLogs}
      />

      <Logbook logs={logs} isOpen={isLogbookOpen} onClose={() => setIsLogbookOpen(false)} onClear={() => {
           if(confirm("Tüm kayıtlar silinsin mi?")) { setLogs([]); localStorage.removeItem('commodore_logs'); }
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
