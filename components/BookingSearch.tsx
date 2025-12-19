
import React, { useState, useEffect } from 'react';
import { Calendar, Ruler, Ship, Search, Clock, Anchor, MapPin, Globe } from 'lucide-react';
import { Language, Region } from '../types';
import { MARINA_NETWORK, REGIONS } from '../constants';

interface BookingSearchProps {
  lang: Language;
  onSearch: (criteria: any) => void;
}

const BookingSearch: React.FC<BookingSearchProps> = ({ lang, onSearch }) => {
  const [dates, setDates] = useState({ 
    arrival: new Date().toISOString().split('T')[0],
    arrivalTime: '12:00',
    departure: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    departureTime: '11:00'
  });
  const [selectedRegion, setSelectedRegion] = useState<Region | 'ALL'>('GOCEK');
  const [marinaId, setMarinaId] = useState(MARINA_NETWORK.find(m => m.region === 'GOCEK')?.id || '');
  const [dims, setDims] = useState({ length: '', beam: '' });
  const [nights, setNights] = useState(1);

  useEffect(() => {
    const start = new Date(dates.arrival);
    const end = new Date(dates.departure);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    setNights(diff > 0 ? diff : 0);
  }, [dates.arrival, dates.departure]);

  useEffect(() => {
    onSearch({ ...dates, ...dims, marinaId, region: selectedRegion });
  }, []);

  const handleSearch = () => {
    onSearch({ ...dates, ...dims, marinaId, region: selectedRegion });
    const section = document.getElementById('marina-map');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredMarinas = MARINA_NETWORK.filter(m => selectedRegion === 'ALL' || m.region === selectedRegion);

  const t = {
    tr: {
      region: 'Bölge Seçin',
      destination: 'Marina / Koy Seçin',
      arrival: 'Geliş',
      departure: 'Dönüş',
      cta: 'YER BUL',
      stay: 'Gece'
    },
    en: {
      region: 'Select Region',
      destination: 'Marina / Bay',
      arrival: 'Arrival',
      departure: 'Departure',
      cta: 'FIND SLIP',
      stay: 'Nights'
    }
  }[lang === 'tr' ? 'tr' : 'en'];

  return (
    <div className="w-full max-w-[1600px] mx-auto -mt-20 md:-mt-16 relative z-30 px-4">
      <div className="bg-emerald-900 border border-brass-500/20 shadow-[0_40px_120px_rgba(0,0,0,0.7)] p-4 md:p-6 rounded-sm flex flex-col xl:flex-row gap-4 xl:items-center backdrop-blur-3xl">
        
        {/* Region Selector */}
        <div className="relative group xl:w-60 w-full">
           <select 
             value={selectedRegion}
             onChange={(e) => {
               const reg = e.target.value as Region | 'ALL';
               setSelectedRegion(reg);
               const firstInReg = MARINA_NETWORK.find(m => reg === 'ALL' || m.region === reg);
               if (firstInReg) setMarinaId(firstInReg.id);
             }}
             className="w-full bg-emerald-950/50 border border-brass-500/10 py-5 pl-12 pr-10 text-xs font-bold tracking-widest text-ivory-50 focus:border-brass-500 transition-all uppercase appearance-none cursor-pointer"
           >
             <option value="ALL">Tüm Kıyılar</option>
             {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
           </select>
           <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brass-500" />
           <span className="absolute -top-2 left-4 bg-emerald-900 px-1 text-[7px] text-ivory-100/40 uppercase tracking-widest font-bold">{t.region}</span>
        </div>

        {/* Marina / Bay Selector */}
        <div className="relative group flex-grow">
           <select 
             value={marinaId}
             onChange={(e) => setMarinaId(e.target.value)}
             className="w-full bg-emerald-950/50 border border-brass-500/10 py-5 pl-12 pr-10 text-xs font-bold tracking-widest text-ivory-50 focus:border-brass-500 transition-all uppercase appearance-none cursor-pointer"
           >
             {filteredMarinas.map(m => (
               <option key={m.id} value={m.id} className="bg-emerald-950">
                 {m.type === 'BAY_RESTAURANT' ? '⚓ ' : '🏛️ '}{m.name}
               </option>
             ))}
           </select>
           <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brass-500" />
           <span className="absolute -top-2 left-4 bg-emerald-900 px-1 text-[7px] text-ivory-100/40 uppercase tracking-widest font-bold">{t.destination}</span>
        </div>

        {/* Date & Time Group */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2">
             <div className="relative group flex-grow">
                <input 
                  type="date" 
                  value={dates.arrival}
                  onChange={(e) => setDates({ ...dates, arrival: e.target.value })}
                  className="w-full bg-emerald-950/50 border border-brass-500/10 py-5 pl-12 pr-4 text-xs font-bold tracking-widest text-ivory-50 focus:border-brass-500 transition-all" 
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brass-500/50" />
                <span className="absolute -top-2 left-4 bg-emerald-900 px-1 text-[7px] text-ivory-100/40 uppercase tracking-widest font-bold">{t.arrival}</span>
             </div>
             <div className="relative group w-32">
                <input 
                  type="time" 
                  value={dates.arrivalTime}
                  onChange={(e) => setDates({ ...dates, arrivalTime: e.target.value })}
                  className="w-full bg-emerald-950/50 border border-brass-500/10 py-5 pl-10 pr-4 text-xs font-bold tracking-widest text-ivory-50 focus:border-brass-500 transition-all" 
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brass-500/50" />
             </div>
          </div>

          <div className="flex gap-2">
             <div className="relative group flex-grow">
                <input 
                  type="date" 
                  value={dates.departure}
                  onChange={(e) => setDates({ ...dates, departure: e.target.value })}
                  className="w-full bg-emerald-950/50 border border-brass-500/10 py-5 pl-12 pr-4 text-xs font-bold tracking-widest text-ivory-50 focus:border-brass-500 transition-all" 
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brass-500/50" />
                <span className="absolute -top-2 left-4 bg-emerald-900 px-1 text-[7px] text-ivory-100/40 uppercase tracking-widest font-bold">{t.departure}</span>
             </div>
             <div className="relative group w-32">
                <input 
                  type="time" 
                  value={dates.departureTime}
                  onChange={(e) => setDates({ ...dates, departureTime: e.target.value })}
                  className="w-full bg-emerald-950/50 border border-brass-500/10 py-5 pl-10 pr-4 text-xs font-bold tracking-widest text-ivory-50 focus:border-brass-500 transition-all" 
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brass-500/50" />
             </div>
          </div>
        </div>

        {/* CTA */}
        <button 
          onClick={handleSearch}
          className="xl:w-60 w-full bg-brass-500 text-emerald-950 px-10 py-5 text-[11px] font-bold tracking-[0.4em] uppercase flex items-center justify-center gap-3 hover:bg-ivory-50 transition-all shadow-xl">
          <Search className="w-4 h-4" /> {t.cta}
        </button>
      </div>
    </div>
  );
};

export default BookingSearch;
