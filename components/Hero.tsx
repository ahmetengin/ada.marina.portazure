
import React from 'react';
import { ChevronDown, Anchor, Navigation } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="relative h-[80vh] md:h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 overflow-hidden bg-emerald-950">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540944065248-f17736ee8f6e?q=80&w=2600&auto=format&fit=crop" 
          alt="Luxury Marina View" 
          className="w-full h-full object-cover opacity-20 md:opacity-30 scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-transparent to-[#010505]"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-10 opacity-60">
           <div className="w-8 md:w-12 h-px bg-brass-500"></div>
           <span className="text-brass-500 text-[8px] md:text-xs tracking-[0.4em] md:tracking-[0.6em] uppercase font-bold">The Côte d'Azur of the Aegean</span>
           <div className="w-8 md:w-12 h-px bg-brass-500"></div>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-ivory-50 mb-6 md:mb-10 leading-[0.9] tracking-tighter">
           PORT <span className="text-gradient">AZURE</span><br/>
           <span className="italic font-serif text-2xl sm:text-4xl md:text-7xl font-normal lowercase tracking-normal text-ivory-100/40">maritime excellence</span>
        </h1>

        <p className="max-w-2xl mx-auto text-ivory-100/50 text-base md:text-2xl font-serif italic mb-10 md:mb-16 leading-relaxed px-4">
           "The Mediterranean's most secure and technologically advanced entry point for the world's finest vessels."
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
           <a href="#operations" className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-brass-500 text-emerald-950 text-[10px] md:text-[11px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase hover:bg-white hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4">
              <Anchor className="w-4 h-4 md:w-5 md:h-5" /> Docking Plan
           </a>
           <button className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 border border-brass-500/30 text-brass-500 text-[10px] md:text-[11px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase hover:bg-brass-500/10 transition-all flex items-center justify-center gap-4 backdrop-blur-md">
              <Navigation className="w-4 h-4 md:w-5 md:h-5" /> Arrival Guide
           </button>
        </div>
      </div>

      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-4 opacity-30 animate-bounce">
         <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase">Explore Bridge</span>
         <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
      </div>
    </section>
  );
};

export default Hero;
