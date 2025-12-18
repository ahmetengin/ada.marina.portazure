
import React from 'react';
import { ChevronDown, Smartphone, Ship, Anchor } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const scrollToMap = () => {
    const mapSection = document.getElementById('marina-map');
    mapSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-emerald-950">
      <div className="absolute inset-0 bg-emerald-950/60 z-10"></div>
      
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2670&auto=format&fit=crop" 
          alt="Vintage Yacht Club" 
          className="w-full h-full object-cover opacity-70 scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-emerald-950"></div>
      </div>

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        
        <div className="mb-6 md:mb-8 flex items-center gap-3 md:gap-4 animate-fade-in-up">
            <div className="h-[1px] md:h-[2px] w-8 md:w-16 bg-brass-500"></div>
            <span className="text-brass-400 text-[9px] md:text-xs font-heading tracking-[0.4em] uppercase">{t.hero.systemOnline}</span>
            <div className="h-[1px] md:h-[2px] w-8 md:w-16 bg-brass-500"></div>
        </div>
        
        <h1 className="font-heading text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-ivory-50 mb-6 md:mb-8 tracking-tighter drop-shadow-2xl leading-[1.1]">
          THE <span className="italic text-brass-500">COMMODORE'S</span> COVE
        </h1>
        
        <p className="max-w-2xl text-ivory-100/80 text-base md:text-2xl font-serif italic mb-10 md:mb-14 leading-relaxed tracking-wide">
          "{t.hero.subtitle}"
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 w-full sm:w-auto">
          <button 
            onClick={scrollToMap}
            className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-brass-500 text-emerald-950 text-[10px] font-heading font-bold tracking-[0.3em] hover:bg-ivory-50 transition-all duration-700 uppercase shadow-2xl flex items-center justify-center gap-3">
             <Anchor className="w-4 h-4" /> {t.hero.ctaServices}
          </button>
          <button className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 border-2 border-brass-500/30 text-brass-500 hover:border-brass-500 hover:bg-brass-500/10 transition-all duration-500 flex items-center justify-center gap-3 uppercase text-[10px] font-heading tracking-[0.3em] backdrop-blur-md">
             <Smartphone className="w-4 h-4" /> {t.hero.ctaListen}
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce text-brass-500/30">
        <ChevronDown className="w-6 h-6 md:w-8 md:h-8" />
      </div>
    </div>
  );
};

export default Hero;
