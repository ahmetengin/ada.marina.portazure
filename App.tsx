
import React, { useEffect, useState, useCallback } from 'react';
import Hero from './components/Hero';
import VHFRadio from './components/VHFRadio';
import InfoPanel from './components/InfoPanel';
import MarinaMap from './components/MarinaMap';
import ServicesSection from './components/ServicesSection';
import BookingSearch from './components/BookingSearch';
import { MARINA_CONFIG, MOCK_WEATHER, TRANSLATIONS, FACILITIES_TRANSLATIONS, FOOTER_LINKS } from './constants';
import { initializeAI } from './services/geminiService';
import { Ship, Anchor, Zap, Wifi, Globe, Smartphone, User, Shield, Calendar, CheckCircle, QrCode, X, Menu, CreditCard, Clock, ExternalLink } from 'lucide-react';
import { Language, Slip } from './types';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [bookingTrigger, setBookingTrigger] = useState<Slip | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<any>(null);
  const [bookingState, setBookingState] = useState<'IDLE' | 'PRE_BOOKED' | 'PAYING' | 'CONFIRMED'>('IDLE');
  const [pnr, setPnr] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
      // Fix: Changed 'char.length' to 'chars.length'
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
    // Simulate payment aggregator delay
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

  const APP_FEATURES = [
      { icon: User, title: f.account, desc: "Personal Details & Boat Profile" },
      { icon: Zap, title: f.energy, desc: "Smart Metering & Top-up" },
      { icon: Wifi, title: f.wifi, desc: "High-Speed Connectivity" },
      { icon: Ship, title: f.booking, desc: "Real-time Reservations" },
      { icon: Shield, title: f.security, desc: "24/7 Smart Monitoring" },
      { icon: Calendar, title: f.events, desc: "Exclusive Events & News" },
  ];

  return (
    <div className="relative min-h-screen bg-emerald-950 selection:bg-brass-500 selection:text-emerald-950 font-sans text-ivory-100/80">
      
      {/* Live Ticker */}
      <div className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-brass-500/10 h-8 flex items-center overflow-hidden">
        <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap gap-12 text-[9px] font-mono tracking-[0.2em] text-brass-500/60 items-center">
            <span className="flex items-center gap-2">WIND: NW 8KTS</span>
            <span className="flex items-center gap-2">TIDE: +0.4M (HIGH)</span>
            <span className="flex items-center gap-2">TRAFFIC: LOW</span>
            <span className="flex items-center gap-2">PNR SERVICES ACTIVE</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-8 w-full z-40 px-6 md:px-8 py-5 flex justify-between items-center backdrop-blur-lg bg-emerald-950/90 border-b border-brass-500/10">
        <div className="flex items-center gap-3">
            <Anchor className="w-6 h-6 text-brass-500" />
            <span className="font-heading font-bold text-lg md:text-xl text-ivory-50 tracking-widest uppercase">
              THE <span className="text-brass-500 italic">COMMODORE</span>
            </span>
        </div>
        
        <div className="flex items-center gap-8">
            <div className="hidden lg:flex gap-10 text-[10px] font-bold tracking-[0.3em] text-ivory-100/60 uppercase">
                <a href="#marina-map" className="hover:text-brass-500 transition-colors">LOKASYON</a>
                <a href="#marina-map" className="hover:text-brass-500 transition-colors">REZERVASYON</a>
                <a href="#heritage" className="hover:text-brass-500 transition-colors">MİRAS</a>
            </div>

            <div className="hidden sm:flex items-center gap-4">
                <div className="relative group">
                    <button className="flex items-center gap-2 text-ivory-100/60 border border-brass-500/20 px-4 py-2 rounded-sm hover:border-brass-500 transition-colors">
                        <Globe className="w-3 h-3" />
                        <span className="uppercase text-[9px] font-sans tracking-[0.2em]">{lang}</span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-36 bg-emerald-900 border border-brass-500/10 rounded-sm shadow-2xl hidden group-hover:block overflow-hidden z-[100]">
                        {(['tr', 'en', 'de'] as Language[]).map(l => (
                             <button 
                                key={l}
                                onClick={() => setLang(l)}
                                className={`w-full text-left px-5 py-4 text-[10px] uppercase tracking-widest hover:bg-emerald-800 transition-colors ${lang === l ? 'text-brass-500' : 'text-ivory-100'}`}>
                                {l === 'tr' ? 'TÜRKÇE' : l === 'en' ? 'ENGLISH' : 'DEUTSCH'}
                            </button>
                        ))}
                    </div>
                </div>
                <a href="#" className="flex items-center gap-2 text-emerald-950 bg-brass-500 px-8 py-3 rounded-sm hover:bg-ivory-50 transition-all text-[10px] font-bold tracking-widest uppercase shadow-xl">
                    <User className="w-3.5 h-3.5" /> GİRİŞ
                </a>
            </div>
            
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-brass-500 p-2">
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
        </div>

        {/* Mobile Sidebar */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-[72px] bg-emerald-950/98 z-50 flex flex-col p-10 gap-8 lg:hidden animate-fade-in">
             <a href="#marina-map" onClick={() => setIsMenuOpen(false)} className="text-2xl font-heading text-ivory-50 tracking-widest border-b border-brass-500/10 pb-4">LOKASYON</a>
             <a href="#marina-map" onClick={() => setIsMenuOpen(false)} className="text-2xl font-heading text-ivory-50 tracking-widest border-b border-brass-500/10 pb-4">REZERVASYON</a>
             <a href="#heritage" onClick={() => setIsMenuOpen(false)} className="text-2xl font-heading text-ivory-50 tracking-widest border-b border-brass-500/10 pb-4">MİRASIMIZ</a>
             <div className="mt-auto flex flex-col gap-4">
                <button className="w-full py-5 bg-brass-500 text-emerald-950 font-bold uppercase tracking-widest">ÜYE GİRİŞİ</button>
                <div className="flex justify-center gap-8 mt-4">
                   <button onClick={() => setLang('tr')} className={`text-xs ${lang === 'tr' ? 'text-brass-500' : ''}`}>TR</button>
                   <button onClick={() => setLang('en')} className={`text-xs ${lang === 'en' ? 'text-brass-500' : ''}`}>EN</button>
                   <button onClick={() => setLang('de')} className={`text-xs ${lang === 'de' ? 'text-brass-500' : ''}`}>DE</button>
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

        {/* FOOTER */}
        <footer className="bg-emerald-950 pt-32 pb-16 px-6 border-t border-brass-500/10 text-sm">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-24">
                <div className="col-span-1 lg:col-span-2">
                     <div className="flex items-center gap-3 mb-8">
                        <Anchor className="w-7 h-7 text-brass-500" />
                        <span className="font-heading font-bold text-xl text-ivory-50 tracking-widest uppercase">THE <span className="text-brass-500 italic">COMMODORE</span></span>
                    </div>
                    <p className="text-ivory-100/40 mb-8 leading-relaxed font-light max-w-sm">The pinnacle of Mediterranean heritage. Experience the legacy of excellence in the heart of the Riviera.</p>
                </div>
                <div>
                    <h4 className="text-ivory-50 font-heading text-sm mb-8 tracking-widest uppercase">LOCATIONS</h4>
                    <ul className="space-y-3 text-ivory-100/30 text-[10px] tracking-widest font-light">
                        {fl.turkey.map(m => <li key={m} className="hover:text-brass-500 cursor-pointer transition-colors uppercase">{m}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="text-ivory-50 font-heading text-sm mb-8 tracking-widest uppercase">MEMBERSHIP</h4>
                    <ul className="space-y-3 text-ivory-100/30 text-[10px] tracking-widest font-light">
                        <li className="hover:text-brass-500 cursor-pointer uppercase">Yacht Club</li>
                        <li className="hover:text-brass-500 cursor-pointer uppercase">Legacy Access</li>
                        <li className="hover:text-brass-500 cursor-pointer uppercase">Elite Concierge</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-ivory-50 font-heading text-sm mb-8 tracking-widest uppercase">CONTACT</h4>
                    <ul className="space-y-3 text-ivory-100/30 text-[10px] tracking-widest font-light uppercase">
                        <li>VHF Channel 11 (ADA)</li>
                        <li>+377 98 06 20 00</li>
                        <li>ada@commodore.mc</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-[1600px] mx-auto border-t border-brass-500/5 pt-10 flex flex-col md:flex-row justify-between items-center text-[9px] text-ivory-100/20 tracking-[0.2em] uppercase text-center gap-6">
                <div>© 2025 The Commodore's Cove / Monte Carlo Heritage Group. All rights reserved.</div>
            </div>
        </footer>
      </main>

      {/* Booking Confirmation / PNR / Payment Flow Modal */}
      {bookingState !== 'IDLE' && bookingTrigger && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-emerald-950/95 animate-fade-in overflow-y-auto">
           <div className="relative w-full max-w-xl bg-[#0a1a15] border-[12px] border-[#10241e] shadow-[0_80px_160px_rgba(0,0,0,1)] p-8 md:p-12 md:rounded-[4rem] ring-1 ring-brass-500/30">
              
              <button onClick={closeModals} className="absolute top-8 right-8 text-ivory-100/30 hover:text-white transition-colors bg-black/40 p-3 rounded-full border border-white/5">
                 <X className="w-5 h-5" />
              </button>
              
              {/* Step Indicators */}
              <div className="flex justify-between mb-12 px-4 relative">
                 <div className="absolute top-1/2 left-0 w-full h-px bg-brass-500/10 -translate-y-1/2 z-0"></div>
                 {['PRE-BOOK', 'PAYMENT', 'FINAL'].map((step, i) => (
                    <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                       <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                         (i === 0 && bookingState === 'PRE_BOOKED') || 
                         (i === 1 && bookingState === 'PAYING') || 
                         (i === 2 && bookingState === 'CONFIRMED') ? 'bg-brass-500 border-brass-500 scale-125 shadow-[0_0_15px_#c5a059]' : 'bg-emerald-950 border-brass-500/30'
                       }`}></div>
                       <span className={`text-[8px] font-mono tracking-[0.2em] uppercase ${
                         (i === 0 && bookingState === 'PRE_BOOKED') || (i === 1 && bookingState === 'PAYING') || (i === 2 && bookingState === 'CONFIRMED') ? 'text-brass-500' : 'text-ivory-100/20'
                       }`}>{step}</span>
                    </div>
                 ))}
              </div>

              {bookingState === 'PRE_BOOKED' && (
                <div className="animate-fade-in">
                   <div className="text-center mb-10">
                      <Clock className="w-16 h-16 text-brass-500 mx-auto mb-6 opacity-40 animate-pulse" />
                      <h2 className="font-heading text-3xl text-ivory-50 mb-2 uppercase tracking-tighter">6 HOUR <span className="italic text-brass-500">HOLD</span></h2>
                      <p className="text-[10px] text-ivory-100/40 tracking-[0.3em] uppercase">PNR: {pnr}</p>
                   </div>

                   <div className="bg-emerald-950/60 p-8 border border-brass-500/10 rounded-sm mb-10 font-mono text-[11px] uppercase tracking-widest space-y-4">
                      <div className="flex justify-between border-b border-white/5 pb-4">
                         <span className="text-ivory-100/30">Vessel Suite</span>
                         <span className="text-ivory-50">{bookingTrigger.pontoon}-{bookingTrigger.number}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-ivory-100/30">Total Amount</span>
                         <span className="text-lg text-brass-500 font-heading">€{bookingTrigger.price}</span>
                      </div>
                   </div>

                   <div className="flex flex-col gap-4">
                      <button 
                        onClick={confirmPayment}
                        className="w-full py-6 bg-brass-500 text-emerald-950 font-bold tracking-[0.4em] uppercase hover:bg-ivory-50 transition-all shadow-2xl flex items-center justify-center gap-4 text-[11px]"
                      >
                        <CreditCard className="w-5 h-5" /> PROCEED TO PAYMENT
                      </button>
                      <p className="text-[9px] text-center text-ivory-100/30 tracking-[0.2em] uppercase italic">Ada is standing by on VHF 11 to guide your approach.</p>
                   </div>
                </div>
              )}

              {bookingState === 'PAYING' && (
                <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                   <div className="w-20 h-20 border-t-2 border-brass-500 rounded-full animate-spin mb-10"></div>
                   <h3 className="font-heading text-xl text-ivory-50 tracking-widest">CONNECTING TO AGGREGATOR...</h3>
                   <p className="text-[10px] text-ivory-100/40 mt-4 tracking-[0.2em] uppercase">Securing your legacy bridge.</p>
                </div>
              )}

              {bookingState === 'CONFIRMED' && (
                <div className="animate-fade-in text-center">
                   <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-10 text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                      <CheckCircle className="w-12 h-12" />
                   </div>
                   <h2 className="font-heading text-4xl text-ivory-50 mb-4 uppercase tracking-tighter">VOYAGE <span className="italic text-brass-500">SECURED</span></h2>
                   <p className="text-[10px] text-ivory-100/30 tracking-[0.3em] uppercase mb-12">FINAL FOLIO: {pnr}</p>

                   <div className="bg-ivory-50 p-6 rounded-sm mb-12 inline-block shadow-2xl">
                      <QrCode className="w-32 h-32 text-emerald-950" />
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-10">
                      <button className="py-4 border border-brass-500/20 text-brass-500 text-[10px] tracking-widest font-bold uppercase hover:bg-brass-500/10 flex items-center justify-center gap-2">
                         <Smartphone className="w-4 h-4" /> ADD TO PASSKIT
                      </button>
                      <button className="py-4 border border-brass-500/20 text-brass-500 text-[10px] tracking-widest font-bold uppercase hover:bg-brass-500/10 flex items-center justify-center gap-2">
                         <ExternalLink className="w-4 h-4" /> PRINT FOLIO
                      </button>
                   </div>

                   <button 
                     onClick={closeModals}
                     className="w-full py-6 bg-brass-500 text-emerald-950 font-bold tracking-[0.4em] uppercase hover:bg-ivory-50 transition-all text-[11px]"
                   >
                     CLOSE CONSOLE
                   </button>
                </div>
              )}

           </div>
        </div>
      )}

      <VHFRadio config={MARINA_CONFIG} lang={lang} triggerBooking={bookingTrigger} />
      
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default App;
