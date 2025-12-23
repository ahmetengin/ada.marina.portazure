
import React from 'react';
import { ChevronDown, Anchor, Navigation, Radio, MapPin, Wind } from 'lucide-react';
import { Language } from '../types';
import { MARINA_CONFIG, MOCK_WEATHER } from '../constants';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2600&auto=format&fit=crop" 
          alt="Azure Marina" 
          className="w-full h-full object-cover opacity-20 scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/40 to-navy-950"></div>
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16 animate-float">
            <div className="px-8 py-3 bg-navy-900/60 border-2 border-azure-500/40 rounded-full flex items-center gap-4 shadow-2xl backdrop-blur-md">
                <Radio className="w-5 h-5 text-azure-400 animate-pulse" />
                <span className="text-white text-[12px] tracking-[0.2em] font-black uppercase">VHF: {MARINA_CONFIG.vhfChannel} (ADA)</span>
            </div>
            <div className="px-8 py-3 bg-navy-900/60 border-2 border-azure-500/40 rounded-full flex items-center gap-4 shadow-2xl backdrop-blur-md">
                <MapPin className="w-5 h-5 text-azure-400" />
                <span className="text-white text-[12px] tracking-[0.2em] font-black uppercase">{MARINA_CONFIG.coordinates.lat} N</span>
            </div>
            <div className="px-8 py-3 bg-navy-900/60 border-2 border-sunlight-500/40 rounded-full flex items-center gap-4 shadow-2xl backdrop-blur-md">
                <Wind className="w-5 h-5 text-sunlight-400" />
                <span className="text-white text-[12px] tracking-[0.2em] font-black uppercase">{MOCK_WEATHER.windSpeed} KTS {MOCK_WEATHER.windDir}</span>
            </div>
        </div>

        <h1 className="font-heading text-6xl sm:text-8xl md:text-[10rem] text-white mb-10 leading-[0.85] tracking-tight uppercase text-glow">
           PORT <span className="text-azure-500">AZURE</span><br/>
           <span className="italic font-serif text-3xl sm:text-5xl md:text-6xl font-normal lowercase tracking-widest text-azure-400">digital bridge</span>
        </h1>

        <p className="max-w-4xl mx-auto text-white/90 text-2xl md:text-3xl font-serif italic mb-20 leading-relaxed drop-shadow-lg">
           "Senkronize liman giriş protokolü. Ada AI, kanal koordinatlarınız için Kanal 11 üzerinden hazır bekliyor."
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
           <a 
            href="#operations" 
            className="w-full sm:w-auto px-12 py-7 bg-azure-600 text-white text-[14px] font-black tracking-[0.3em] uppercase hover:bg-azure-500 transition-all shadow-[0_20px_50px_rgba(14,165,233,0.4)] rounded-2xl flex items-center justify-center gap-5 active:scale-95"
           >
              <Anchor className="w-6 h-6" /> BAĞLAMA PLANINI GÖR
           </a>
           <a 
            href="#services" 
            className="w-full sm:w-auto px-12 py-7 border-2 border-azure-400 text-azure-400 text-[14px] font-black tracking-[0.3em] uppercase hover:bg-azure-600 hover:text-white transition-all flex items-center justify-center gap-5 rounded-2xl bg-navy-950/40 backdrop-blur-md active:scale-95"
           >
              <Navigation className="w-6 h-6" /> HİZMETLERİMİZ
           </a>
        </div>
      </div>

      <a 
        href="#services"
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 animate-bounce cursor-pointer group"
      >
         <span className="text-[11px] font-black tracking-[0.5em] uppercase text-azure-400 group-hover:text-white transition-colors">KEŞFET</span>
         <ChevronDown className="w-8 h-8 text-azure-500" />
      </a>
    </section>
  );
};

export default Hero;
