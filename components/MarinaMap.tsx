
import React, { useState, useMemo } from 'react';
import { MOCK_SLIPS, TRANSLATIONS, MARINA_NETWORK } from '../constants';
import { Language, Slip } from '../types';
import { Ship, Anchor, Wifi, Zap, Droplets, List, Map as MapIcon, Star, Sparkles, Navigation, Waves, ShieldCheck } from 'lucide-react';

interface MarinaMapProps {
  lang: Language;
  onBookSlip: (slip: Slip) => void;
  searchCriteria?: any;
}

const CATEGORIES = [
  { id: 'horizon', title: 'Platinum Waterfront', desc: 'Front-row berthing with elite access.', pontoons: ['ADMIRAL'], view: 'Panoramic' },
  { id: 'grand', title: 'Deep Water Suites', desc: 'Optimized for high-tonnage vessels.', pontoons: ['CAPTAIN'], view: 'Skyline' },
  { id: 'privacy', title: 'Steward Pier', desc: 'Private and secure docking.', pontoons: ['STEWARD'], view: 'Isolated' }
];

const MarinaMap: React.FC<MarinaMapProps> = ({ lang, onBookSlip, searchCriteria }) => {
  const t = TRANSLATIONS[lang];
  const [selectedSlip, setSelectedSlip] = useState<Slip | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredSlips = useMemo(() => {
    return MOCK_SLIPS.filter(slip => {
      // Marina filtresi
      if (searchCriteria?.marinaId && slip.marinaId !== searchCriteria.marinaId) return false;
      // Boyut filtresi
      if (searchCriteria?.length && slip.length < parseFloat(searchCriteria.length)) return false;
      return true;
    });
  }, [searchCriteria]);

  const activeMarinaName = useMemo(() => {
    return MARINA_NETWORK.find(m => m.id === searchCriteria?.marinaId)?.name || 'Network Node';
  }, [searchCriteria]);

  const getAmenityIcon = (feature: string) => {
    if (feature.includes('Wifi')) return <Wifi className="w-3 h-3" />;
    if (feature.includes('Shore Power')) return <Zap className="w-3 h-3" />;
    if (feature.includes('Water')) return <Droplets className="w-3 h-3" />;
    return <Sparkles className="w-3 h-3" />;
  };

  return (
    <section id="marina-map" className="relative py-16 md:py-24 bg-emerald-950 overflow-hidden border-t border-brass-500/10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 gap-6">
          <div className="flex-1 text-center lg:text-left">
            <span className="text-brass-500 text-xs tracking-[0.4em] uppercase mb-3 block font-bold">Riviera Inventory</span>
            <h2 className="font-heading text-3xl md:text-5xl text-ivory-50 tracking-wide">Select Your <span className="italic text-brass-500">Berth</span></h2>
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-4">
               <div className="bg-brass-500/10 border border-brass-500/20 px-4 py-1.5 text-[9px] font-bold text-brass-500 tracking-widest uppercase rounded-full flex items-center gap-2">
                 <Anchor className="w-3 h-3" /> {activeMarinaName}
               </div>
               <span className="text-ivory-100/30 text-[10px] uppercase tracking-widest">{filteredSlips.length} Available Slots</span>
            </div>
          </div>
          <div className="flex bg-emerald-900 p-1 rounded-sm border border-brass-500/10 self-center lg:self-end">
            <button onClick={() => setViewMode('list')} className={`px-6 py-2 flex items-center gap-2 text-[10px] font-bold tracking-widest transition-all ${viewMode === 'list' ? 'bg-brass-500 text-emerald-950 shadow-lg' : 'text-ivory-100/40 hover:text-white'}`}>
              <List className="w-4 h-4" /> LIST VIEW
            </button>
            <button onClick={() => setViewMode('map')} className={`px-6 py-2 flex items-center gap-2 text-[10px] font-bold tracking-widest transition-all ${viewMode === 'map' ? 'bg-brass-500 text-emerald-950 shadow-lg' : 'text-ivory-100/40 hover:text-white'}`}>
              <MapIcon className="w-4 h-4" /> CHART
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-12">
          <div className="flex-1 min-h-[600px]">
            {viewMode === 'list' ? (
              <div className="space-y-16">
                {CATEGORIES.map(cat => {
                  const slipsInCat = filteredSlips.filter(s => cat.pontoons.includes(s.pontoon) && s.status === 'available');
                  if (slipsInCat.length === 0) return null;

                  return (
                    <div key={cat.id} className="animate-fade-in group">
                      <div className="flex items-end justify-between mb-8 pb-4 border-b border-brass-500/10">
                        <div>
                          <div className="flex items-center gap-2 text-brass-500 mb-2">
                            <Waves className="w-4 h-4" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{cat.title}</span>
                          </div>
                          <p className="text-ivory-100/40 text-xs font-light">{cat.desc}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {slipsInCat.slice(0, 3).map(slip => (
                          <div 
                            key={slip.id} 
                            onClick={() => setSelectedSlip(slip)}
                            className={`p-8 border transition-all duration-500 cursor-pointer flex flex-col justify-between group/card ${selectedSlip?.id === slip.id ? 'bg-brass-500/10 border-brass-500 shadow-2xl scale-[1.02]' : 'bg-emerald-900/40 border-brass-500/10 hover:border-brass-500/40'}`}
                          >
                            <div className="mb-8">
                              <div className="flex justify-between items-start mb-6">
                                <div className="text-[9px] text-ivory-100/30 uppercase tracking-widest">Rate / Night <div className="text-2xl text-ivory-50 font-heading mt-1">€{slip.price}</div></div>
                                <div className="flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-brass-500 text-brass-500" />)}</div>
                              </div>
                              <h4 className="font-heading text-3xl text-ivory-50 mb-1">{slip.pontoon}-{slip.number}</h4>
                              <p className="text-[9px] font-mono text-ivory-100/40 uppercase tracking-[0.2em] mb-6">{slip.length}m x {slip.beam}m</p>
                              
                              <div className="space-y-2.5">
                                {slip.features.slice(0, 3).map(f => (
                                  <div key={f} className="flex items-center gap-3 text-[11px] text-ivory-100/60 font-light">
                                    <div className="w-5 h-5 rounded-full bg-brass-500/10 flex items-center justify-center text-brass-500">{getAmenityIcon(f)}</div>
                                    <span className="truncate">{f}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); onBookSlip(slip); }} className="w-full py-4 bg-emerald-950 text-brass-500 border border-brass-500/20 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-brass-500 hover:text-emerald-950 transition-all">Select</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full bg-emerald-900/40 rounded-sm border border-brass-500/10 flex items-center justify-center text-ivory-100/20 font-serif italic text-2xl">
                Technical chart data for {activeMarinaName} loading...
              </div>
            )}
          </div>

          <div className="w-full xl:w-[450px] space-y-8">
            <div className={`glass-panel p-10 rounded-sm border-t-2 border-brass-500 transition-all duration-500 ${selectedSlip ? 'opacity-100 translate-y-0 shadow-2xl' : 'opacity-40 translate-y-4'}`}>
              {selectedSlip ? (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-heading text-4xl text-ivory-50 mb-1">{selectedSlip.pontoon}-{selectedSlip.number}</h3>
                      <div className="text-brass-500 font-bold text-[9px] tracking-widest uppercase">{activeMarinaName}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-5 bg-emerald-950/60 border border-brass-500/10 text-center">
                       <div className="text-[9px] text-ivory-100/30 mb-1 uppercase tracking-widest">Length</div>
                       <div className="text-xl text-ivory-50 font-heading">{selectedSlip.length}m</div>
                    </div>
                    <div className="p-5 bg-emerald-950/60 border border-brass-500/10 text-center">
                       <div className="text-[9px] text-ivory-100/30 mb-1 uppercase tracking-widest">Beam</div>
                       <div className="text-xl text-ivory-50 font-heading">{selectedSlip.beam}m</div>
                    </div>
                  </div>
                  <button onClick={() => onBookSlip(selectedSlip)} className="w-full py-6 bg-brass-500 text-emerald-950 font-bold tracking-[0.3em] uppercase hover:bg-ivory-50 transition-all shadow-xl flex items-center justify-center gap-3 text-[10px]">
                    <Anchor className="w-4 h-4" /> START RESERVATION
                  </button>
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-center p-10 opacity-30">
                  <Ship className="w-12 h-12 text-brass-500 mb-6" />
                  <p className="font-serif italic text-sm">Explore our network of premium berths across Göcek's finest marinas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarinaMap;
