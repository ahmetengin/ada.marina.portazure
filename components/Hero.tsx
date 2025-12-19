
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
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-emerald-950/20 z-10"></div>
      
      <div className="absolute inset-0 z-0">
        {/* New refreshing Aegean Coast image */}
        <img 
          src="https://images.unsplash.com/photo-1540202404-a2f29033882c?q=80&w=2600&auto=format&fit=crop" 
          alt="Turquoise Aegean Coast" 
          className="w-full h-full object-cover opacity-90 scale-105 animate-pulse-slow"
        />
        {/* Gradient for content transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-transparent to-emerald-950"></div>
      </div>

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        
        <div className="mb-6 md:mb-8 flex items-center gap-4 animate-fade-in-up">
            <div className="h-[1px] w-12 md:w-24 bg-brass-500/50"></div>
            <span className="text-brass-400 text-[10px] md:text-sm font-heading tracking-[0.6em] uppercase drop-shadow-lg">{t.hero.systemOnline}</span>
            <div className="h-[1px] w-12 md:w-24 bg-brass-500/50"></div>
        </div>
        
        <h1 className="font-heading text-4xl sm:text-7xl md:text-8xl lg:text-[10rem] text-ivory-50 mb-6 md:mb-10 tracking-tighter drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)] leading-[0.9]">
          THE <span className="italic text-brass-500">COMMODORE'S</span> COVE
        </h1>
        
        <p className="max-w-3xl text-ivory-100/90 text-lg md:text-3xl font-serif italic mb-12 md:mb-16 leading-relaxed tracking-wide drop-shadow-lg">
          "{t.hero.subtitle}"
        </p>

        <div className="flex flex-col sm:flex-row gap-6 md:gap-10 w-full sm:w-auto">
          <button 
            onClick={scrollToMap}
            className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-6 bg-brass-500 text-emerald-950 text-[11px] font-heading font-bold tracking-[0.4em] hover:bg-ivory-50 transition-all duration-700 uppercase shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center gap-4 group">
             <Anchor className="w-5 h-5 group-hover:rotate-12 transition-transform" /> {t.hero.ctaServices}
          </button>
          <button className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-6 border-2 border-brass-500/50 text-ivory-50 hover:border-brass-500 hover:bg-brass-500/20 transition-all duration-500 flex items-center justify-center gap-4 uppercase text-[11px] font-heading tracking-[0.4em] backdrop-blur-md">
             <Smartphone className="w-5 h-5" /> {t.hero.ctaListen}
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-brass-500/60">
        <ChevronDown className="w-8 h-8 md:w-10 md:h-10" />
      </div>
    </div>
  );
};

export default Hero;
