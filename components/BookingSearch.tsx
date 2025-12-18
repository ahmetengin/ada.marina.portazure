
import React, { useState } from 'react';
import { Calendar, Ruler, Ship, ChevronRight, Search } from 'lucide-react';
import { Language } from '../types';

interface BookingSearchProps {
  lang: Language;
  onSearch: (criteria: any) => void;
}

const BookingSearch: React.FC<BookingSearchProps> = ({ lang, onSearch }) => {
  const [dates, setDates] = useState({ arrival: '', departure: '' });
  const [dims, setDims] = useState({ length: '', beam: '' });

  const handleSearch = () => {
    onSearch({ ...dates, ...dims });
    const section = document.getElementById('marina-map');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const t = {
    tr: {
      arrival: 'Geliş',
      departure: 'Dönüş',
      loa: 'Boy (LOA)',
      beam: 'En (Beam)',
      cta: 'Müsaitlik Kontrolü',
      dimensions: 'Tekne Ölçüleri'
    },
    en: {
      arrival: 'Arrival',
      departure: 'Departure',
      loa: 'Length (LOA)',
      beam: 'Beam',
      cta: 'Check Availability',
      dimensions: 'Vessel Specs'
    }
  }[lang === 'tr' ? 'tr' : 'en'];

  return (
    <div className="w-full max-w-6xl mx-auto -mt-16 md:-mt-12 relative z-30 px-4">
      <div className="bg-emerald-900 border border-brass-500/20 shadow-2xl p-3 md:p-4 rounded-sm flex flex-col lg:flex-row gap-3 md:gap-4 lg:items-center">
        
        {/* Date Inputs */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="relative group">
            <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-brass-500/50 group-focus-within:text-brass-500 transition-colors pointer-events-none">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <input 
              type="date" 
              value={dates.arrival}
              onChange={(e) => setDates({ ...dates, arrival: e.target.value })}
              className="w-full bg-emerald-950/50 border border-brass-500/10 py-3 md:py-4 pl-10 md:pl-12 pr-2 text-[10px] md:text-xs font-bold tracking-widest text-ivory-50 focus:outline-none focus:border-brass-500 transition-all uppercase appearance-none" 
            />
            <span className="absolute -top-2 left-3 bg-emerald-900 px-1 text-[7px] text-ivory-100/40 uppercase tracking-widest">{t.arrival}</span>
          </div>
          <div className="relative group">
            <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-brass-500/50 group-focus-within:text-brass-500 transition-colors pointer-events-none">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <input 
              type="date" 
              value={dates.departure}
              onChange={(e) => setDates({ ...dates, departure: e.target.value })}
              className="w-full bg-emerald-950/50 border border-brass-500/10 py-3 md:py-4 pl-10 md:pl-12 pr-2 text-[10px] md:text-xs font-bold tracking-widest text-ivory-50 focus:outline-none focus:border-brass-500 transition-all uppercase appearance-none" 
            />
             <span className="absolute -top-2 left-3 bg-emerald-900 px-1 text-[7px] text-ivory-100/40 uppercase tracking-widest">{t.departure}</span>
          </div>
        </div>

        {/* Dimension Inputs */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="relative group">
            <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-brass-500/50 group-focus-within:text-brass-500 transition-colors pointer-events-none">
              <Ruler className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <input 
              type="number" 
              value={dims.length}
              onChange={(e) => setDims({ ...dims, length: e.target.value })}
              className="w-full bg-emerald-950/50 border border-brass-500/10 py-3 md:py-4 pl-10 md:pl-12 pr-2 text-[10px] md:text-xs font-bold tracking-widest text-ivory-50 focus:outline-none focus:border-brass-500 transition-all" 
              placeholder="0.0"
            />
            <span className="absolute -top-2 left-3 bg-emerald-900 px-1 text-[7px] text-ivory-100/40 uppercase tracking-widest">{t.loa}</span>
          </div>
          <div className="relative group">
            <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-brass-500/50 group-focus-within:text-brass-500 transition-colors pointer-events-none">
              <Ship className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <input 
              type="number" 
              value={dims.beam}
              onChange={(e) => setDims({ ...dims, beam: e.target.value })}
              className="w-full bg-emerald-950/50 border border-brass-500/10 py-3 md:py-4 pl-10 md:pl-12 pr-2 text-[10px] md:text-xs font-bold tracking-widest text-ivory-50 focus:outline-none focus:border-brass-500 transition-all" 
              placeholder="0.0"
            />
            <span className="absolute -top-2 left-3 bg-emerald-900 px-1 text-[7px] text-ivory-100/40 uppercase tracking-widest">{t.beam}</span>
          </div>
        </div>

        <button 
          onClick={handleSearch}
          className="lg:w-auto w-full bg-brass-500 text-emerald-950 px-8 py-3.5 md:py-4 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-ivory-50 transition-all shadow-xl active:scale-95">
          <Search className="w-4 h-4" /> {t.cta}
        </button>
      </div>
    </div>
  );
};

export default BookingSearch;
