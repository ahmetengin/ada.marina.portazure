import React from 'react';
import { ChevronDown, Smartphone, Ship } from 'lucide-react';
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
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-navy-950/40 z-10"></div>
      
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2574&auto=format&fit=crop" 
          alt="Luxury Marina" 
          className="w-full h-full object-cover animate-pan-slow opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/50 to-transparent"></div>
      </div>

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        
        <div className="mb-6 flex items-center gap-3 animate-fade-in-up">
            <div className="h-[1px] w-12 bg-gold-500"></div>
            <span className="text-gold-400 text-xs font-sans tracking-[0.3em] uppercase">{t.hero.systemOnline}</span>
            <div className="h-[1px] w-12 bg-gold-500"></div>
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 tracking-wide drop-shadow-xl">
          PORT <span className="italic text-gold-500">AZURE</span>
        </h1>
        
        <p className="max-w-2xl text-slate-200 text-lg md:text-xl font-light mb-12 leading-relaxed font-sans tracking-wide">
          {t.hero.subtitle}
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <button 
            onClick={scrollToMap}
            className="px-10 py-4 bg-gold-500 text-navy-950 text-sm font-bold tracking-widest hover:bg-white transition-all duration-500 uppercase shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-3">
             <Ship className="w-4 h-4" /> {t.hero.ctaServices}
          </button>
          <button className="px-10 py-4 border border-white/30 text-white hover:border-gold-500 hover:text-gold-400 transition-all duration-300 flex items-center justify-center gap-3 uppercase text-sm tracking-widest backdrop-blur-sm">
             <Smartphone className="w-4 h-4" /> {t.hero.ctaListen}
          </button>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce text-gold-500/50">
        <ChevronDown className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Hero;