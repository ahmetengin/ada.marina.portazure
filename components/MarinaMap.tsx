
import React, { useState, useMemo } from 'react';
import { MOCK_SLIPS, TRANSLATIONS } from '../constants';
import { Language, Slip } from '../types';
import { Ship, Anchor, Wifi, Zap, Droplets, Compass, ZoomIn, ZoomOut, Map as MapIcon, List, CheckCircle2, Star, Sparkles, Navigation, Waves, ShieldCheck } from 'lucide-react';

interface MarinaMapProps {
  lang: Language;
  onBookSlip: (slip: Slip) => void;
  searchCriteria?: any;
}

const CATEGORIES = [
  { 
    id: 'horizon', 
    title: 'Azure Horizon Suites', 
    desc: 'Uninterrupted panoramic sunset views. Prime front-row berthing.', 
    pontoons: ['ADMIRAL'],
    view: 'Ocean Panorama'
  },
  { 
    id: 'grand', 
    title: 'Deep Water Grand Suites', 
    desc: 'Specially engineered for vessels with 5m+ draft.', 
    pontoons: ['CAPTAIN'],
    view: 'Marina Skyline'
  },
  { 
    id: 'privacy', 
    title: 'Steward Suites', 
    desc: 'Isolated pontoons with private dock-hand.', 
    pontoons: ['STEWARD'],
    view: 'Private Cove'
  }
];

const MarinaMap: React.FC<MarinaMapProps> = ({ lang, onBookSlip, searchCriteria }) => {
  const t = TRANSLATIONS[lang];
  const [selectedSlip, setSelectedSlip] = useState<Slip | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [zoomLevel, setZoomLevel] = useState(0.8);

  const filteredSlips = useMemo(() => {
    return MOCK_SLIPS.filter(slip => {
      if (searchCriteria?.length && slip.length < parseFloat(searchCriteria.length)) return false;
      if (searchCriteria?.beam && slip.beam < parseFloat(searchCriteria.beam)) return false;
      return true;
    });
  }, [searchCriteria]);

  const pontoons = useMemo(() => Array.from(new Set(filteredSlips.map(s => s.pontoon))).sort(), [filteredSlips]);

  const getAmenityIcon = (feature: string) => {
    if (feature.includes('Wifi')) return <Wifi className="w-3 h-3" />;
    if (feature.includes('Power')) return <Zap className="w-3 h-3" />;
    if (feature.includes('Water')) return <Droplets className="w-3 h-3" />;
    if (feature.includes('Concierge')) return <Sparkles className="w-3 h-3" />;
    return <CheckCircle2 className="w-3 h-3" />;
  };

  return (
    <section id="marina-map" className="relative py-16 md:py-24 bg-emerald-950 overflow-hidden border-t border-brass-500/10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 md:mb-16 gap-6 md:gap-8">
          <div className="flex-1 text-center lg:text-left">
            <span className="text-brass-500 text-xs tracking-[0.4em] uppercase mb-3 block font-bold">Reserving Excellence</span>
            <h2 className="font-heading text-3xl md:text-5xl text-ivory-50 tracking-wide">Choose Your <span className="italic text-brass-500">Suite</span></h2>
            <p className="text-ivory-100/40 mt-4 text-xs md:text-sm font-light max-w-xl mx-auto lg:mx-0">
              {searchCriteria?.length ? `Optimized for ${searchCriteria.length}m vessels.` : 'Browse our collection of elite berthing categories.'}
            </p>
          </div>
          <div className="flex bg-emerald-900 p-1 rounded-sm border border-brass-500/10 shadow-xl self-center lg:self-end">
            <button onClick={() => setViewMode('list')} className={`px-4 md:px-6 py-2 flex items-center gap-2 text-[9px] md:text-[10px] font-bold tracking-widest transition-all ${viewMode === 'list' ? 'bg-brass-500 text-emerald-950 shadow-lg' : 'text-ivory-100/40 hover:text-white'}`}>
              <List className="w-4 h-4" /> LIST VIEW
            </button>
            <button onClick={() => setViewMode('map')} className={`px-4 md:px-6 py-2 flex items-center gap-2 text-[9px] md:text-[10px] font-bold tracking-widest transition-all ${viewMode === 'map' ? 'bg-brass-500 text-emerald-950 shadow-lg' : 'text-ivory-100/40 hover:text-white'}`}>
              <MapIcon className="w-4 h-4" /> CHART VIEW
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 md:gap-12">
          <div className="flex-1 min-h-[500px] md:min-h-[700px]">
            {viewMode === 'list' ? (
              <div className="space-y-12 md:space-y-16">
                {CATEGORIES.map(cat => {
                  const slipsInCat = filteredSlips.filter(s => cat.pontoons.includes(s.pontoon) && s.status === 'available');
                  if (slipsInCat.length === 0) return null;

                  return (
                    <div key={cat.id} className="animate-fade-in group">
                      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 pb-4 border-b border-brass-500/10 gap-4 text-center md:text-left">
                        <div>
                          <div className="flex items-center justify-center md:justify-start gap-2 text-brass-500 mb-2">
                            <Waves className="w-4 h-4" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{cat.title}</span>
                          </div>
                          <p className="text-ivory-100/40 text-xs font-light max-w-2xl">{cat.desc}</p>
                        </div>
                        <div className="hidden md:flex items-center gap-3 text-[9px] text-brass-500/40 font-mono tracking-widest uppercase">
                           <ShieldCheck className="w-3 h-3" /> {cat.view}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {slipsInCat.slice(0, 3).map(slip => (
                          <div 
                            key={slip.id} 
                            onClick={() => setSelectedSlip(slip)}
                            className={`p-6 md:p-8 border transition-all duration-500 cursor-pointer flex flex-col justify-between group/card ${selectedSlip?.id === slip.id ? 'bg-brass-500/10 border-brass-500 ring-1 ring-brass-500/20 shadow-2xl' : 'bg-emerald-900/40 border-brass-500/10 hover:border-brass-500/40'}`}
                          >
                            <div className="mb-6 md:mb-8">
                              <div className="flex justify-between items-start mb-6">
                                <div className="text-[9px] text-ivory-100/30 uppercase tracking-widest">
                                   Starting From
                                   <div className="text-xl md:text-2xl text-ivory-50 font-heading tracking-wide mt-1">€{slip.price}</div>
                                </div>
                                <div className="flex gap-1">
                                   {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-brass-500 text-brass-500" />)}
                                </div>
                              </div>
                              <h4 className="font-heading text-2xl md:text-3xl text-ivory-50 mb-1">{slip.pontoon}-{slip.number}</h4>
                              <p className="text-[9px] font-mono text-ivory-100/40 uppercase tracking-[0.2em] mb-6">
                                {slip.length}m x {slip.beam}m
                              </p>
                              
                              <div className="space-y-2.5">
                                {slip.features.slice(0, 3).map(f => (
                                  <div key={f} className="flex items-center gap-3 text-[11px] text-ivory-100/60 font-light">
                                    <div className="w-5 h-5 rounded-full bg-brass-500/10 flex items-center justify-center text-brass-500">
                                      {getAmenityIcon(f)}
                                    </div>
                                    <span className="truncate">{f}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button 
                              onClick={(e) => { e.stopPropagation(); onBookSlip(slip); }}
                              className="w-full py-3.5 md:py-4 bg-emerald-950 text-brass-500 border border-brass-500/20 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-brass-500 hover:text-emerald-950 transition-all duration-300"
                            >
                              Reserve Now
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full bg-emerald-900/40 rounded-sm border border-brass-500/10 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <div className="bg-black/60 backdrop-blur-md border border-brass-500/20 rounded-sm flex flex-col">
                    <button onClick={() => setZoomLevel(z => Math.min(z + 0.1, 1.2))} className="p-2.5 hover:bg-white/5 transition-colors border-b border-brass-500/10"><ZoomIn className="w-4 h-4 text-brass-500" /></button>
                    <button onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.4))} className="p-2.5 hover:bg-white/5 transition-colors"><ZoomOut className="w-4 h-4 text-brass-500" /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-8 md:p-12 custom-scrollbar">
                  <div className="min-w-[1000px] flex flex-col gap-12 Origin-top-left" style={{ transform: `scale(${zoomLevel})` }}>
                    {pontoons.map(pID => (
                      <div key={pID} className="flex items-center gap-6 group">
                        <div className="w-24 h-10 bg-emerald-950 border border-brass-500/20 flex items-center justify-center font-heading text-sm text-brass-500 tracking-widest">{pID}</div>
                        <div className="flex gap-1.5">
                          {filteredSlips.filter(s => s.pontoon === pID).map(slip => (
                            <button
                              key={slip.id}
                              onClick={() => slip.status === 'available' && setSelectedSlip(slip)}
                              className={`w-6 h-10 rounded-sm border transition-all ${slip.status === 'available' ? (selectedSlip?.id === slip.id ? 'bg-brass-500 border-white shadow-[0_0_15px_rgba(197,160,89,0.5)]' : 'bg-brass-500/10 border-brass-500/30') : 'bg-emerald-950 border-white/5 opacity-10'}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full xl:w-[450px] space-y-6 md:space-y-8">
            <div className={`glass-panel p-6 md:p-10 rounded-sm border-t-2 border-brass-500 transition-all duration-500 ${selectedSlip ? 'opacity-100 translate-y-0 shadow-2xl' : 'opacity-40 translate-y-4 pointer-events-none'}`}>
              {selectedSlip ? (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-heading text-3xl md:text-4xl text-ivory-50 mb-1">{selectedSlip.pontoon}-{selectedSlip.number}</h3>
                      <div className="flex items-center gap-2 text-brass-500/40 font-mono text-[8px] uppercase tracking-widest">
                         <Navigation className="w-3 h-3" /> FOLIO: {selectedSlip.id}
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-brass-500/10 border border-brass-500/20 text-brass-500 text-[8px] font-bold tracking-widest rounded-full uppercase">AVAILABLE</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
                    <div className="p-4 md:p-5 bg-emerald-950/60 border border-brass-500/10">
                      <div className="text-[9px] text-ivory-100/30 mb-1.5 uppercase tracking-widest">Dimensions</div>
                      <div className="text-base md:text-lg text-ivory-50 font-heading">{selectedSlip.length}m x {selectedSlip.beam}m</div>
                    </div>
                    <div className="p-4 md:p-5 bg-emerald-950/60 border border-brass-500/10">
                      <div className="text-[9px] text-ivory-100/30 mb-1.5 uppercase tracking-widest">Class</div>
                      <div className="text-base md:text-lg text-ivory-50 font-heading">Deep Draft</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <h4 className="text-[9px] text-brass-500 font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                       <Sparkles className="w-3 h-3" /> SUITE AMENITIES
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {selectedSlip.features.map(f => (
                        <div key={f} className="flex items-center gap-3 text-xs text-ivory-100/60 font-light">
                          <div className="w-5 h-5 rounded-full bg-brass-500/5 flex items-center justify-center text-brass-500">
                            {getAmenityIcon(f)}
                          </div>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-brass-500/10 pt-6 md:pt-8 mb-8">
                     <div className="flex justify-between items-center font-bold">
                        <div className="text-[11px] text-brass-500 uppercase tracking-widest">Daily Rate</div>
                        <div className="text-2xl md:text-3xl text-ivory-50 font-heading">€{selectedSlip.price}</div>
                     </div>
                  </div>

                  <button 
                    onClick={() => onBookSlip(selectedSlip)}
                    className="w-full py-4 md:py-6 bg-brass-500 text-emerald-950 font-bold tracking-[0.3em] uppercase hover:bg-ivory-50 transition-all shadow-xl flex items-center justify-center gap-3 text-[10px]"
                  >
                    <Anchor className="w-4 h-4" /> CONFIRM SELECTION
                  </button>
                </div>
              ) : (
                <div className="h-64 md:h-96 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-brass-500/10 flex items-center justify-center mb-6 opacity-20">
                    <Ship className="w-8 h-8 md:w-10 md:h-10 text-brass-500" />
                  </div>
                  <p className="font-serif italic text-ivory-100/40 text-sm">Select a heritage suite to view refined amenities and seasonal rates.</p>
                </div>
              )}
            </div>

            <div className="p-4 md:p-6 bg-emerald-900 border border-brass-500/10 flex items-center gap-4 group">
               <div className="w-10 h-10 rounded-full bg-brass-500/10 flex items-center justify-center text-brass-500 group-hover:scale-110 transition-transform">
                 <ShieldCheck className="w-5 h-5" />
               </div>
               <div>
                  <div className="text-[9px] font-bold text-ivory-50 uppercase tracking-widest mb-1">Cove Protection</div>
                  <div className="text-[10px] text-ivory-100/30 uppercase tracking-wider">Heritage insurance & 24/7 security.</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarinaMap;
