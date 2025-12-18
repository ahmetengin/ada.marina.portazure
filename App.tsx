
import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import VHFRadio from './components/VHFRadio';
import InfoPanel from './components/InfoPanel';
import MarinaMap from './components/MarinaMap';
import ServicesSection from './components/ServicesSection';
import BookingSearch from './components/BookingSearch';
import { MARINA_CONFIG, MOCK_WEATHER, TRANSLATIONS, FACILITIES_TRANSLATIONS, MARINA_LIST, FOOTER_LINKS } from './constants';
import { initializeAI } from './services/geminiService';
import { Ship, Anchor, Zap, Wifi, Globe, Smartphone, User, Shield, Calendar, ArrowRight, Wind, Waves, CheckCircle, QrCode, X } from 'lucide-react';
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
    <div className="relative min-h-screen bg-navy-950 selection:bg-gold-500 selection:text-navy-950 font-sans text-slate-300">
      
      {/* Live Ticker */}
      <div className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 h-8 flex items-center overflow-hidden">
        <div className="flex animate-[ticker_30s_linear_infinite] whitespace-nowrap gap-12 text-[10px] font-mono tracking-[0.2em] text-gold-500/60 items-center">
            <span className="flex items-center gap-2"><Wind className="w-3 h-3" /> WIND: NW 8KTS</span>
            <span className="flex items-center gap-2"><Waves className="w-3 h-3" /> TIDE: +0.4M (HIGH)</span>
            <span className="flex items-center gap-2"><Ship className="w-3 h-3" /> TRAFFIC: 4 ARRIVALS IN 1H</span>
            <span className="flex items-center gap-2"><Anchor className="w-3 h-3" /> PORT STATUS: CLEAR</span>
            <span className="flex items-center gap-2"><Wind className="w-3 h-3" /> WIND: NW 8KTS</span>
            <span className="flex items-center gap-2"><Waves className="w-3 h-3" /> TIDE: +0.4M (HIGH)</span>
            <span className="flex items-center gap-2"><Ship className="w-3 h-3" /> TRAFFIC: 4 ARRIVALS IN 1H</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-8 w-full z-40 px-6 py-6 flex justify-between items-center backdrop-blur-md bg-navy-950/80 border-b border-white/5">
        <div className="flex items-center gap-3">
            <Anchor className="w-6 h-6 text-gold-500" />
            <span className="font-serif font-bold text-xl text-white tracking-widest uppercase">PORT <span className="text-gold-500 italic">AZURE</span></span>
        </div>
        
        <div className="flex items-center gap-8">
            <div className="hidden lg:flex gap-8 text-[11px] font-bold tracking-[0.2em] text-slate-300 uppercase">
                <a href="#marina-map" className="hover:text-gold-500 transition-colors duration-300">{t.nav.services}</a>
                <a href="#news" className="hover:text-gold-500 transition-colors duration-300">{t.nav.prices}</a>
                <a href="#blog" className="hover:text-gold-500 transition-colors duration-300">{t.nav.gallery}</a>
            </div>

            <div className="relative group">
                <button className="flex items-center gap-2 text-slate-300 border border-white/10 px-4 py-2 rounded-sm hover:border-gold-500 transition-colors">
                    <Globe className="w-3 h-3" />
                    <span className="uppercase text-[10px] font-sans tracking-[0.2em]">{lang}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-32 bg-navy-900 border border-white/10 rounded-sm shadow-2xl hidden group-hover:block overflow-hidden z-[100]">
                    {(['tr', 'en', 'de'] as Language[]).map(l => (
                         <button 
                            key={l}
                            onClick={() => setLang(l)}
                            className={`w-full text-left px-5 py-4 text-[10px] uppercase tracking-widest hover:bg-navy-800 transition-colors ${lang === l ? 'text-gold-500' : 'text-slate-300'}`}>
                            {l === 'tr' ? 'TÜRKÇE' : l === 'en' ? 'ENGLISH' : 'DEUTSCH'}
                        </button>
                    ))}
                </div>
            </div>

            <a href="#" className="hidden md:flex items-center gap-2 text-navy-950 bg-gold-500 px-8 py-3 rounded-sm hover:bg-white transition-all text-[11px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <Smartphone className="w-4 h-4" /> {t.nav.login}
            </a>
        </div>
      </nav>

      <main>
        <Hero lang={lang} />
        <BookingSearch lang={lang} onSearch={handleSearch} />
        
        <ServicesSection lang={lang} />

        {/* APP FEATURES SECTION */}
        <section className="bg-navy-900 py-32 px-6 md:px-12 relative overflow-hidden">
             <div className="max-w-[1400px] mx-auto">
                 <div className="flex flex-col md:flex-row gap-20 items-center mb-20">
                     <div className="flex-1">
                        <span className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-4 block font-bold">Premium Digital Experience</span>
                        <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 leading-tight">
                            Elevate Your <span className="italic text-gold-500">Yachting</span> Journey
                        </h2>
                        <p className="text-slate-400 leading-relaxed text-sm md:text-base max-w-xl font-light">
                            Experience unprecedented control over your maritime lifestyle. From AI-assisted concierge to real-time berth power monitoring, everything you need is at your fingertips.
                        </p>
                        <div className="flex gap-6 mt-12">
                             <button className="bg-white text-navy-950 px-8 py-4 rounded-sm font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors shadow-lg">
                                 App Store
                             </button>
                             <button className="border border-white/20 text-white px-8 py-4 rounded-sm font-bold text-[10px] uppercase tracking-[0.2em] hover:border-gold-500 hover:text-gold-500 transition-colors">
                                 Google Play
                             </button>
                        </div>
                     </div>
                     <div className="flex-1 grid grid-cols-2 gap-4 relative">
                        <div className="absolute inset-0 bg-gold-500/5 blur-[100px] rounded-full"></div>
                        {APP_FEATURES.map((feat, i) => (
                            <div key={i} className="relative z-10 bg-navy-800/50 p-8 border border-white/5 hover:border-gold-500/30 transition-all duration-500 group">
                                <feat.icon className="w-10 h-10 text-gold-500 mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-white font-serif text-xl mb-3">{feat.title}</h3>
                                <p className="text-slate-500 text-xs leading-relaxed font-light">{feat.desc}</p>
                            </div>
                        ))}
                     </div>
                 </div>
             </div>
        </section>
        
        <MarinaMap lang={lang} onBookSlip={handleBookSlip} searchCriteria={searchCriteria} />

        <footer className="bg-navy-950 pt-32 pb-16 px-6 border-t border-white/5 text-sm">
            <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-16 mb-24">
                <div className="col-span-2 md:col-span-4 lg:col-span-2">
                     <div className="flex items-center gap-3 mb-8">
                        <Anchor className="w-8 h-8 text-gold-500" />
                        <span className="font-serif font-bold text-2xl text-white tracking-widest uppercase">PORT <span className="text-gold-500 italic">AZURE</span></span>
                    </div>
                    <p className="text-slate-500 mb-8 leading-relaxed font-light">The pinnacle of Mediterranean yachting. Experience the D-Marin standard in the heart of Bodrum's azure waters.</p>
                </div>
                <div>
                    <h4 className="text-white font-serif text-lg mb-8">Spain</h4>
                    <ul className="space-y-4 text-slate-500 text-xs tracking-widest font-light">
                        {fl.spain.map(m => <li key={m} className="hover:text-gold-500 cursor-pointer transition-colors uppercase">{m}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-serif text-lg mb-8">Italy</h4>
                    <ul className="space-y-4 text-slate-500 text-xs tracking-widest font-light">
                        {fl.italy.map(m => <li key={m} className="hover:text-gold-500 cursor-pointer transition-colors uppercase">{m}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-serif text-lg mb-8">Croatia</h4>
                    <ul className="space-y-4 text-slate-500 text-xs tracking-widest font-light">
                        {fl.croatia.map(m => <li key={m} className="hover:text-gold-500 cursor-pointer transition-colors uppercase">{m}</li>)}
                    </ul>
                </div>
            </div>
            <div className="max-w-[1600px] mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 tracking-[0.2em] uppercase">
                <div>© 2025 Port Azure / D-Marin Excellence Group. All rights reserved.</div>
                <div className="flex gap-8 mt-6 md:mt-0">
                  <a href="#" className="hover:text-gold-500 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-gold-500 transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
      </main>

      {/* Confirmation Modal */}
      {isBookingConfirmed && bookingTrigger && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-navy-950/80 animate-fade-in">
           <div className="relative w-full max-w-lg bg-navy-900 border border-gold-500/20 shadow-[0_50px_100px_rgba(0,0,0,0.8)] p-10 overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                 <button onClick={() => setIsBookingConfirmed(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="text-center mb-10">
                 <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                 </div>
                 <h2 className="font-serif text-3xl text-white mb-2">Reservation <span className="italic text-gold-500">Confirmed</span></h2>
                 <p className="text-xs text-slate-500 tracking-widest uppercase">Booking ID: AZ-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>

              <div className="space-y-6 mb-10 bg-navy-950 p-6 border-y border-white/5 font-mono text-xs uppercase tracking-widest">
                 <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-slate-500">Vessel Berth</span>
                    <span className="text-white">{bookingTrigger.pontoon}-{bookingTrigger.number}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-slate-500">Category</span>
                    <span className="text-gold-500">Premium Suite</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-slate-500">Dates</span>
                    <span className="text-white">{searchCriteria?.arrival || 'TBD'} - {searchCriteria?.departure || 'TBD'}</span>
                 </div>
                 <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Total Price</span>
                    <span className="text-xl text-white font-serif">€{bookingTrigger.price}</span>
                 </div>
              </div>

              <div className="flex items-center gap-6 mb-10">
                 <div className="p-4 bg-white rounded-sm">
                    <QrCode className="w-12 h-12 text-navy-950" />
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] text-slate-500 leading-relaxed">Present this code or identify yourself on <span className="text-gold-500 font-bold">VHF Channel 16</span> upon arrival at the breakwater.</p>
                 </div>
              </div>

              <button 
                onClick={() => setIsBookingConfirmed(false)}
                className="w-full py-5 bg-gold-500 text-navy-950 font-bold tracking-[0.3em] uppercase hover:bg-white transition-all shadow-xl"
              >
                Return to Dashboard
              </button>
              
              <div className="mt-6 text-center">
                 <p className="text-[9px] text-emerald-500/60 font-bold animate-pulse">AZURE CONCIERGE IS STANDING BY ON RADIO...</p>
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
