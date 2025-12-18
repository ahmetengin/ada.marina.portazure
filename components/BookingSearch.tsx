
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
    <div className="w-full max-w-6xl mx-auto -mt-12 relative z-30 px-4">
      <div className="bg-navy-900 border border-gold-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 md:p-3 rounded-sm flex flex-col lg:flex-row gap-2 lg:items-center">
        
        {/* Date Inputs */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50 group-focus-within:text-gold-500 transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
            <input 
              type="date" 
              value={dates.arrival}
              onChange={(e) => setDates({ ...dates, arrival: e.target.value })}
              className="w-full bg-navy-950/50 border border-white/5 py-4 pl-12 pr-4 text-xs font-bold tracking-widest text-white focus:outline-none focus:border-gold-500/50 transition-all uppercase" 
              placeholder={t.arrival}
            />
            <span className="absolute -top-2 left-4 bg-navy-900 px-1 text-[8px] text-slate-500 uppercase tracking-widest">{t.arrival}</span>
          </div>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50 group-focus-within:text-gold-500 transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
            <input 
              type="date" 
              value={dates.departure}
              onChange={(e) => setDates({ ...dates, departure: e.target.value })}
              className="w-full bg-navy-950/50 border border-white/5 py-4 pl-12 pr-4 text-xs font-bold tracking-widest text-white focus:outline-none focus:border-gold-500/50 transition-all uppercase" 
              placeholder={t.departure}
            />
             <span className="absolute -top-2 left-4 bg-navy-900 px-1 text-[8px] text-slate-500 uppercase tracking-widest">{t.departure}</span>
          </div>
        </div>

        {/* Dimension Inputs */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50 group-focus-within:text-gold-500 transition-colors">
              <Ruler className="w-4 h-4" />
            </div>
            <input 
              type="number" 
              value={dims.length}
              onChange={(e) => setDims({ ...dims, length: e.target.value })}
              className="w-full bg-navy-950/50 border border-white/5 py-4 pl-12 pr-4 text-xs font-bold tracking-widest text-white focus:outline-none focus:border-gold-500/50 transition-all" 
              placeholder="LOA (m)"
            />
            <span className="absolute -top-2 left-4 bg-navy-900 px-1 text-[8px] text-slate-500 uppercase tracking-widest">{t.loa}</span>
          </div>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50 group-focus-within:text-gold-500 transition-colors">
              <Ship className="w-4 h-4" />
            </div>
            <input 
              type="number" 
              value={dims.beam}
              onChange={(e) => setDims({ ...dims, beam: e.target.value })}
              className="w-full bg-navy-950/50 border border-white/5 py-4 pl-12 pr-4 text-xs font-bold tracking-widest text-white focus:outline-none focus:border-gold-500/50 transition-all" 
              placeholder="BEAM (m)"
            />
            <span className="absolute -top-2 left-4 bg-navy-900 px-1 text-[8px] text-slate-500 uppercase tracking-widest">{t.beam}</span>
          </div>
        </div>

        <button 
          onClick={handleSearch}
          className="lg:w-auto w-full bg-gold-500 text-navy-950 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl active:scale-95">
          <Search className="w-4 h-4" /> {t.cta}
        </button>
      </div>
    </div>
  );
};

export default BookingSearch;
