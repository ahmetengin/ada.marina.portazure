
import React, { useEffect, useState, useCallback } from 'react';
import Hero from './Hero';
import VHFRadio from './VHFRadio';
import InfoPanel from './InfoPanel';
import MarinaMap from './MarinaMap';
import ServicesSection from './ServicesSection';
import BookingSearch from './BookingSearch';
// Fixed: Corrected import paths to point to root constants and services
import { MARINA_CONFIG, MOCK_WEATHER, TRANSLATIONS, FACILITIES_TRANSLATIONS, FOOTER_LINKS } from '../constants';
import { initializeAI } from '../services/geminiService';
import { Ship, Anchor, Zap, Wifi, Globe, Smartphone, User, Shield, Calendar, CheckCircle, QrCode, X, Menu, CreditCard, Clock, ExternalLink, Waves, Navigation } from 'lucide-react';
import { Language, Slip } from '../types';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [bookingTrigger, setBookingTrigger] = useState<Slip | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<any>(null);
  const [bookingState, setBookingState] = useState<'IDLE' | 'PRE_BOOKED' | 'PAYING' | 'CONFIRMED'>('IDLE');
  const [pnr, setPnr] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Added sessionId state management for VHFRadio
  const [sessionId] = useState(() => {
    const existing = sessionStorage.getItem('ada_session_id');
    if (existing) return existing;
    const newId = `SSN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    sessionStorage.setItem('ada_session_id', newId);
    return newId;
  });
  
  const t = TRANSLATIONS[lang];
  const f = FACILITIES_TRANSLATIONS[lang];
  const fl = FOOTER_LINKS[lang];

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

  return (
    <div className="relative min-h-screen bg-emerald-950 selection:bg-brass-500 selection:text-emerald-950 font-sans text-ivory-100/90">
      
      {/* Live Ticker - Radiant Brass */}
      <div className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-brass-500/20 h-10 flex items-center overflow-hidden">
        <div className="flex animate-[ticker_60s_linear_infinite] whitespace-nowrap gap-16 text-[10px] font-mono tracking-[0.4em] text-brass-400/80 items-center font-bold">
            <span className="flex items-center gap-3"><Waves className="w-3 h-3" /> WIND: NW 8KTS</span>
            <span className="flex items-center gap-3"><Navigation className="w-3 h-3" /> TIDE: +0.4M (HIGH)</span>
            <span className="flex items-center gap-3"><Shield className="w-3 h-3" /> SECURITY STATUS: PROTECTED</span>
            <span className="flex items-center gap-3"><Anchor className="w-3 h-3" /> PNR SERVICES: ACTIVE</span>
        </div>
      </div>

      {/* Navigation - Translucent Ivory/Emerald */}
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
                <a href="#marina-map" className="hover:text-brass-500 transition-colors">REZERVASYON</a>
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

        {/* Mobile Sidebar */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-[88px] bg-emerald-950/98 z-50 flex flex-col p-12 gap-10 lg:hidden animate-fade-in backdrop-blur-3xl">
             <a href="#marina-map" onClick={() => setIsMenuOpen(false)} className="text-3xl font-heading text-ivory-50 tracking-widest border-b border-brass-500/10 pb-6">LOKASYON</a>
             <a href="#marina-map" onClick={() => setIsMenuOpen(false)} className="text-3xl font-heading text-ivory-50 tracking-widest border-b border-brass-500/10 pb-6">REZERVASYON</a>
             <a href="#heritage" onClick={() => setIsMenuOpen(false)} className="text-3xl font-heading text-ivory-50 tracking-widest border-b border-brass-500/10 pb-6">MİRASIMIZ</a>
             <div className="mt-auto flex flex-col gap-6">
                <button className="w-full py-6 bg-brass-500 text-emerald-950 font-bold uppercase tracking-[0.5em] text-sm shadow-2xl">ÜYE GİRİŞİ</button>
                <div className="flex justify-center gap-12 mt-6">
                   <button onClick={() => setLang('tr')} className={`text-sm font-bold tracking-widest ${lang === 'tr' ? 'text-brass-500 border-b border-brass-500' : 'text-ivory-100/40'}`}>TR</button>
                   <button onClick={() => setLang('en')} className={`text-sm font-bold tracking-widest ${lang === 'en' ? 'text-brass-500 border-b border-brass-500' : 'text-ivory-100/40'}`}>EN</button>
                   <button onClick={() => setLang('de')} className={`text-sm font-bold tracking-widest ${lang === 'de' ? 'text-brass-500 border-b border-brass-500' : 'text-ivory-100/40'}`}>DE</button>
                </div>
             </div>
          </div>
        )}
      </nav>

      <main>
        <Hero lang={lang} />
        <BookingSearch lang={lang} onSearch={handleSearch} />
        <ServicesSection lang={lang} />
        <MarinaMap lang={lang} onBookSlip={handleBookSlip} searchCriteria={searchCriteria} />

        {/* FOOTER - Brightened with subtle brass texture */}
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
                        {fl.turkey.map(m => <li key={m} className="hover:text-brass-400 cursor-pointer transition-colors uppercase border-b border-transparent hover:border-brass-400/20 inline-block">{m}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="text-brass-500 font-heading text-[12px] mb-10 tracking-[0.5em] uppercase font-bold">MEMBERSHIP</h4>
                    <ul className="space-y-4 text-ivory-100/40 text-[11px] tracking-widest font-bold">
                        <li className="hover:text-brass-400 cursor-pointer uppercase">Yacht Club</li>
                        <li className="hover:text-brass-400 cursor-pointer uppercase">Legacy Access</li>
                        <li className="hover:text-brass-400 cursor-pointer uppercase">Elite Concierge</li>
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
            <div className="max-w-[1600px] mx-auto border-t border-brass-500/10 pt-16 flex flex-col md:flex-row justify-between items-center text-[10px] text-ivory-100/30 tracking-[0.3em] uppercase text-center gap-10 font-bold">
                <div>© 2025 The Commodore's Cove / Monte Carlo Heritage Group. All rights reserved.</div>
                <div className="flex gap-10">
                   <span className="hover:text-brass-500 cursor-pointer">PRIVACY</span>
                   <span className="hover:text-brass-500 cursor-pointer">TERMS</span>
                   <span className="hover:text-brass-500 cursor-pointer">COOKIE POLICY</span>
                </div>
            </div>
        </footer>
      </main>

      {/* Booking Confirmation - Translucent & Airy */}
      {bookingState !== 'IDLE' && bookingTrigger && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-3xl bg-emerald-950/80 animate-fade-in overflow-y-auto">
           <div className="relative w-full max-w-2xl bg-[#0d2a26] border-[1px] border-brass-500/30 shadow-[0_100px_200px_rgba(0,0,0,0.8)] p-12 md:p-16 md:rounded-[5rem] overflow-hidden">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brass-500 to-transparent opacity-50"></div>
              
              <button onClick={closeModals} className="absolute top-10 right-10 text-ivory-100/30 hover:text-white transition-colors bg-white/5 p-4 rounded-full border border-white/10 hover:border-red-500/50">
                 <X className="w-6 h-6" />
              </button>
              
              {/* Step Indicators */}
              <div className="flex justify-between mb-16 px-10 relative">
                 <div className="absolute top-1/2 left-0 w-full h-px bg-brass-500/10 -translate-y-1/2 z-0"></div>
                 {['PRE-BOOK', 'PAYMENT', 'FINAL'].map((step, i) => (
                    <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                       <div className={`w-4 h-4 rounded-full border-2 transition-all duration-700 ${
                         (i === 0 && bookingState === 'PRE_BOOKED') || 
                         (i === 1 && bookingState === 'PAYING') || 
                         (i === 2 && bookingState === 'CONFIRMED') ? 'bg-brass-500 border-brass-500 scale-150 shadow-[0_0_20px_#c5a059]' : 'bg-emerald-950 border-brass-500/20'
                       }`}></div>
                       <span className={`text-[9px] font-mono tracking-[0.3em] uppercase font-bold ${
                         (i === 0 && bookingState === 'PRE_BOOKED') || (i === 1 && bookingState === 'PAYING') || (i === 2 && bookingState === 'CONFIRMED') ? 'text-brass-500' : 'text-ivory-100/30'
                       }`}>{step}</span>
                    </div>
                 ))}
              </div>

              {bookingState === 'PRE_BOOKED' && (
                <div className="animate-fade-in">
                   <div className="text-center mb-12">
                      <Clock className="w-20 h-20 text-brass-500 mx-auto mb-8 opacity-60 animate-pulse" />
                      <h2 className="font-heading text-4xl text-ivory-50 mb-4 uppercase tracking-tighter">6 HOUR <span className="italic text-brass-500 font-serif lowercase">hold</span></h2>
                      <p className="text-[11px] text-ivory-100/50 tracking-[0.5em] uppercase font-bold">PNR: {pnr}</p>
                   </div>

                   <div className="bg-emerald-950/40 p-10 border border-brass-500/20 rounded-xl mb-12 font-mono text-[12px] uppercase tracking-[0.2em] space-y-6 shadow-inner">
                      <div className="flex justify-between border-b border-white/5 pb-6">
                         <span className="text-ivory-100/40">Vessel Suite</span>
                         <span className="text-ivory-50 font-bold">{bookingTrigger.pontoon}-{bookingTrigger.number}</span>
                      </div>
                      <div className="flex justify-between text-xl">
                         <span className="text-ivory-100/40">Total Amount</span>
                         <span className="text-brass-500 font-heading font-bold">€{bookingTrigger.price}</span>
                      </div>
                   </div>

                   <div className="flex flex-col gap-6">
                      <button 
                        onClick={confirmPayment}
                        className="w-full py-8 bg-brass-500 text-emerald-950 font-bold tracking-[0.6em] uppercase hover:bg-ivory-50 transition-all shadow-[0_30px_60px_rgba(197,160,89,0.3)] flex items-center justify-center gap-6 text-[12px]"
                      >
                        <CreditCard className="w-6 h-6" /> PROCEED TO PAYMENT
                      </button>
                      <p className="text-[10px] text-center text-ivory-100/40 tracking-[0.3em] uppercase italic font-bold">Ada is standing by on VHF 11 to guide your approach.</p>
                   </div>
                </div>
              )}

              {bookingState === 'PAYING' && (
                <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
                   <div className="w-24 h-24 border-t-2 border-brass-500 rounded-full animate-spin mb-12 shadow-[0_0_40px_rgba(197,160,89,0.2)]"></div>
                   <h3 className="font-heading text-2xl text-ivory-50 tracking-[0.5em]">SECURE LINK ACTIVE...</h3>
                   <p className="text-[11px] text-ivory-100/40 mt-6 tracking-[0.3em] uppercase font-bold">Authenticating with marine payment gateway.</p>
                </div>
              )}

              {bookingState === 'CONFIRMED' && (
                <div className="animate-fade-in text-center">
                   <div className="w-28 h-28 bg-emerald-400/10 border border-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-12 text-emerald-400 shadow-[0_0_80px_rgba(52,211,153,0.3)]">
                      <CheckCircle className="w-16 h-16" />
                   </div>
                   <h2 className="font-heading text-5xl text-ivory-50 mb-6 uppercase tracking-tighter">VOYAGE <span className="italic text-brass-500 font-serif lowercase">secured</span></h2>
                   <p className="text-[11px] text-ivory-100/40 tracking-[0.5em] uppercase mb-16 font-bold">FINAL FOLIO: {pnr}</p>

                   <div className="bg-white p-8 rounded-2xl mb-16 inline-block shadow-[0_40px_100px_rgba(255,255,255,0.1)] group hover:scale-105 transition-transform duration-500">
                      <QrCode className="w-40 h-40 text-emerald-950" />
                   </div>

                   <div className="grid grid-cols-2 gap-6 mb-12">
                      <button className="py-5 border-2 border-brass-500/30 text-brass-500 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-brass-500 hover:text-emerald-950 transition-all flex items-center justify-center gap-3">
                         <Smartphone className="w-5 h-5" /> ADD TO PASSKIT
                      </button>
                      <button className="py-5 border-2 border-brass-500/30 text-brass-500 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-brass-500 hover:text-emerald-950 transition-all flex items-center justify-center gap-3">
                         <ExternalLink className="w-5 h-5" /> EXPORT PDF
                      </button>
                   </div>

                   <button 
                     onClick={closeModals}
                     className="w-full py-8 bg-emerald-950 text-brass-500 font-bold tracking-[0.5em] uppercase hover:bg-brass-500 hover:text-emerald-950 transition-all text-[12px] border border-brass-500/30"
                   >
                     RETURN TO BRIDGE
                   </button>
                </div>
              )}

           </div>
        </div>
      )}

      {/* Fixed: Passed required sessionId prop and corrected config reference */}
      <VHFRadio config={MARINA_CONFIG} lang={lang} sessionId={sessionId} onFileUpdate={() => {}} readFile={() => null} isActive={false} onToggle={() => {}} availableFiles={[]} />
      
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(50px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c5a059; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
