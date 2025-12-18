
import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import VHFRadio from './components/VHFRadio';
import InfoPanel from './components/InfoPanel';
import MarinaMap from './components/MarinaMap';
import ServicesSection from './components/ServicesSection';
import BookingSearch from './components/BookingSearch';
import { MARINA_CONFIG, MOCK_WEATHER, TRANSLATIONS, FACILITIES_TRANSLATIONS, FOOTER_LINKS } from './constants';
import { initializeAI } from './services/geminiService';
import { Ship, Anchor, Zap, Wifi, Globe, Smartphone, User, Shield, Calendar, ArrowRight, Wind, Waves, CheckCircle, QrCode, X, Menu } from 'lucide-react';
import { Language, Slip } from './types';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [bookingTrigger, setBookingTrigger] = useState<Slip | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<any>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  
  const t = TRANSLATIONS[lang];
  const f = FACILITIES_TRANSLATIONS[lang];
  const fl = FOOTER_LINKS[lang];

  useEffect(() => {
    initializeAI(lang);
  }, [lang]);

  const handleBookSlip = (slip: Slip) => {
    setBookingTrigger(slip);
    setIsBookingConfirmed(true);
  };

  const handleSearch = (criteria: any) => {
    setSearchCriteria(criteria);
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
        <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap gap-8 md:gap-12 text-[9px] font-mono tracking-[0.2em] text-brass-500/60 items-center">
            <span className="flex items-center gap-2"><Wind className="w-3 h-3" /> WIND: NW 8KTS</span>
            <span className="flex items-center gap-2"><Waves className="w-3 h-3" /> TIDE: +0.4M (HIGH)</span>
            <span className="flex items-center gap-2"><Ship className="w-3 h-3" /> TRAFFIC: LOW</span>
            <span className="flex items-center gap-2"><Anchor className="w-3 h-3" /> STATUS: CLEAR</span>
            <span className="flex items-center gap-2"><Wind className="w-3 h-3" /> WIND: NW 8KTS</span>
            <span className="flex items-center gap-2"><Waves className="w-3 h-3" /> TIDE: +0.4M (HIGH)</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-8 w-full z-40 px-4 md:px-8 py-4 md:py-6 flex justify-between items-center backdrop-blur-lg bg-emerald-950/80 border-b border-brass-500/10">
        <div className="flex items-center gap-2 md:gap-3">
            <Anchor className="w-5 h-5 md:w-6 md:h-6 text-brass-500" />
            <span className="font-heading font-bold text-sm md:text-xl text-ivory-50 tracking-widest uppercase">
              THE <span className="text-brass-500 italic">COMMODORE</span>
            </span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-8">
            <div className="hidden lg:flex gap-8 text-[10px] font-bold tracking-[0.2em] text-ivory-100/60 uppercase">
                <a href="#marina-map" className="hover:text-brass-500 transition-colors duration-300">{t.nav.services}</a>
                <a href="#news" className="hover:text-brass-500 transition-colors duration-300">{t.nav.prices}</a>
                <a href="#heritage" className="hover:text-brass-500 transition-colors duration-300">{t.nav.gallery}</a>
            </div>

            <div className="relative group">
                <button className="flex items-center gap-2 text-ivory-100/60 border border-brass-500/20 px-3 py-1.5 md:px-4 md:py-2 rounded-sm hover:border-brass-500 transition-colors">
                    <Globe className="w-3 h-3" />
                    <span className="uppercase text-[9px] font-sans tracking-[0.2em]">{lang}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-32 bg-emerald-900 border border-brass-500/10 rounded-sm shadow-2xl hidden group-hover:block overflow-hidden z-[100]">
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

            <a href="#" className="hidden sm:flex items-center gap-2 text-emerald-950 bg-brass-500 px-6 md:px-8 py-2 md:py-3 rounded-sm hover:bg-ivory-50 transition-all text-[10px] font-bold tracking-widest uppercase shadow-xl">
                <User className="w-3.5 h-3.5" /> {t.nav.login}
            </a>
            
            <button className="lg:hidden text-brass-500">
              <Menu className="w-6 h-6" />
            </button>
        </div>
      </nav>

      <main>
        <Hero lang={lang} />
        <BookingSearch lang={lang} onSearch={handleSearch} />
        
        <ServicesSection lang={lang} />

        {/* APP FEATURES SECTION */}
        <section className="bg-emerald-900 py-16 md:py-32 px-4 md:px-12 relative overflow-hidden">
             <div className="max-w-[1400px] mx-auto">
                 <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-10 lg:mb-20">
                     <div className="flex-1 text-center lg:text-left">
                        <span className="text-brass-500 text-xs tracking-[0.4em] uppercase mb-4 block font-bold">Heritage Digital Suite</span>
                        <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-ivory-50 mb-6 lg:mb-8 leading-tight">
                            Elevate Your <span className="italic text-brass-500">Legacy</span>
                        </h2>
                        <p className="text-ivory-100/60 leading-relaxed text-sm md:text-base max-w-xl mx-auto lg:mx-0 font-light">
                            Experience unprecedented control over your maritime lifestyle. From AI-assisted concierge to real-time berth power monitoring, the Commodore's suite is always with you.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8 lg:mt-12">
                             <button className="bg-ivory-50 text-emerald-950 px-6 md:px-8 py-3 md:py-4 rounded-sm font-bold text-[9px] uppercase tracking-[0.2em] hover:bg-brass-500 transition-colors shadow-lg">
                                 App Store
                             </button>
                             <button className="border border-brass-500/20 text-brass-500 px-6 md:px-8 py-3 md:py-4 rounded-sm font-bold text-[9px] uppercase tracking-[0.2em] hover:border-brass-500 hover:bg-brass-500/10 transition-colors">
                                 Google Play
                             </button>
                        </div>
                     </div>
                     <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 relative w-full">
                        <div className="absolute inset-0 bg-brass-500/5 blur-[100px] rounded-full"></div>
                        {APP_FEATURES.map((feat, i) => (
                            <div key={i} className="relative z-10 bg-emerald-950/40 p-6 md:p-8 border border-brass-500/10 hover:border-brass-500/40 transition-all duration-500 group">
                                <feat.icon className="w-8 h-8 md:w-10 md:h-10 text-brass-500 mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-ivory-50 font-heading text-lg mb-2">{feat.title}</h3>
                                <p className="text-ivory-100/40 text-xs leading-relaxed font-light">{feat.desc}</p>
                            </div>
                        ))}
                     </div>
                 </div>
             </div>
        </section>
        
        <MarinaMap lang={lang} onBookSlip={handleBookSlip} searchCriteria={searchCriteria} />

        <footer className="bg-emerald-950 pt-20 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 border-t border-brass-500/10 text-sm">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-16 md:mb-24">
                <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                     <div className="flex items-center gap-3 mb-6">
                        <Anchor className="w-7 h-7 text-brass-500" />
                        <span className="font-heading font-bold text-xl text-ivory-50 tracking-widest uppercase">THE <span className="text-brass-500 italic">COMMODORE</span></span>
                    </div>
                    <p className="text-ivory-100/40 mb-8 leading-relaxed font-light max-w-sm">The pinnacle of Mediterranean heritage. Experience the legacy of excellence in the heart of the Riviera.</p>
                </div>
                <div>
                    <h4 className="text-ivory-50 font-heading text-sm mb-6 tracking-widest">LOCATIONS</h4>
                    <ul className="space-y-3 text-ivory-100/30 text-[10px] tracking-widest font-light">
                        {fl.france.map(m => <li key={m} className="hover:text-brass-500 cursor-pointer transition-colors uppercase">{m}</li>)}
                        {fl.italy.map(m => <li key={m} className="hover:text-brass-500 cursor-pointer transition-colors uppercase">{m}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="text-ivory-50 font-heading text-sm mb-6 tracking-widest">MEMBERSHIP</h4>
                    <ul className="space-y-3 text-ivory-100/30 text-[10px] tracking-widest font-light">
                        <li className="hover:text-brass-500 cursor-pointer transition-colors uppercase">Yacht Club</li>
                        <li className="hover:text-brass-500 cursor-pointer transition-colors uppercase">Legacy Access</li>
                        <li className="hover:text-brass-500 cursor-pointer transition-colors uppercase">Elite Concierge</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-ivory-50 font-heading text-sm mb-6 tracking-widest">CONTACT</h4>
                    <ul className="space-y-3 text-ivory-100/30 text-[10px] tracking-widest font-light uppercase">
                        <li>VHF Channel 11</li>
                        <li>+377 98 06 20 00</li>
                        <li>steward@cove.mc</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-[1600px] mx-auto border-t border-brass-500/5 pt-10 flex flex-col md:flex-row justify-between items-center text-[9px] text-ivory-100/20 tracking-[0.2em] uppercase text-center gap-6">
                <div>© 2025 The Commodore's Cove / Monte Carlo Heritage Group. All rights reserved.</div>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-brass-500 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-brass-500 transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
      </main>

      {/* Confirmation Modal */}
      {isBookingConfirmed && bookingTrigger && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-xl bg-emerald-950/90 animate-fade-in">
           <div className="relative w-full max-w-lg bg-emerald-900 border border-brass-500/20 shadow-2xl p-6 md:p-10 overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <button onClick={() => setIsBookingConfirmed(false)} className="text-ivory-100/40 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="text-center mb-8">
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-brass-500/10 border border-brass-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-brass-500">
                    <CheckCircle className="w-8 h-8 md:w-10 md:h-10" />
                 </div>
                 <h2 className="font-heading text-2xl md:text-3xl text-ivory-50 mb-1">RESERVATION <span className="italic text-brass-500">LOGGED</span></h2>
                 <p className="text-[9px] text-ivory-100/30 tracking-[0.3em] uppercase">FOLIO: MC-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>

              <div className="space-y-4 mb-8 bg-emerald-950/60 p-5 md:p-6 border border-brass-500/10 font-mono text-[10px] uppercase tracking-widest">
                 <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-ivory-100/30">Vessel Suite</span>
                    <span className="text-ivory-50">{bookingTrigger.pontoon}-{bookingTrigger.number}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-ivory-100/30">Category</span>
                    <span className="text-brass-500">Admiral's Class</span>
                 </div>
                 <div className="flex justify-between pt-1">
                    <span className="text-ivory-100/30">Daily Rate</span>
                    <span className="text-lg text-ivory-50 font-heading">€{bookingTrigger.price}</span>
                 </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6 mb-8 bg-ivory-50/5 p-4 rounded-sm">
                 <div className="p-2 bg-ivory-50 rounded-sm">
                    <QrCode className="w-10 h-10 text-emerald-950" />
                 </div>
                 <div className="flex-1">
                    <p className="text-[9px] text-ivory-100/40 leading-relaxed tracking-wider uppercase">IDENTIFY VIA <span className="text-brass-500 font-bold">VHF CH 11</span> UPON ENTRY TO THE COVE.</p>
                 </div>
              </div>

              <button 
                onClick={() => setIsBookingConfirmed(false)}
                className="w-full py-4 md:py-5 bg-brass-500 text-emerald-950 font-bold tracking-[0.3em] uppercase hover:bg-ivory-50 transition-all shadow-xl text-[10px]"
              >
                RETURN TO BRIDGE
              </button>
              
              <div className="mt-6 text-center">
                 <p className="text-[8px] text-brass-500/60 font-heading tracking-widest animate-pulse">THE STEWARD IS STANDING BY ON RADIO...</p>
              </div>
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
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
