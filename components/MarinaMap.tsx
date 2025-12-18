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
    desc: 'Uninterrupted panoramic sunset views. Prime front-row berthing with wide maneuvering space.', 
    pontoons: ['A', 'C'],
    view: 'Ocean Panorama'
  },
  { 
    id: 'grand', 
    title: 'Deep Water Grand Suites', 
    desc: 'Specially engineered for vessels with 5m+ draft. High-amperage 400A shore power included.', 
    pontoons: ['B'],
    view: 'Marina Skyline'
  },
  { 
    id: 'privacy', 
    title: 'The Enclave (Stealth-Tech)', 
    desc: 'Isolated, high-security pontoons with private golf cart access and 24/7 dedicated dock-hand.', 
    pontoons: ['E', 'H'],
    view: 'Private Cove'
  },
  { 
    id: 'club', 
    title: 'Navigator Club Rooms', 
    desc: 'Convenient access to the Main Pier and Yacht Club. Perfect for social interaction and dining.', 
    pontoons: ['F', 'G', 'I'],
    view: 'Clubhouse View'
  }
];

const MarinaMap: React.FC<MarinaMapProps> = ({ lang, onBookSlip, searchCriteria }) => {
  const t = TRANSLATIONS[lang];
  const [selectedSlip, setSelectedSlip] = useState<Slip | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [zoomLevel, setZoomLevel] = useState(1);

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
    <section id="marina-map" className="relative py-24 bg-navy-950 overflow-hidden border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="flex-1">
            <span className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-3 block font-bold">Reserving Excellence</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white tracking-wide">Choose Your <span className="italic text-gold-500">Suite</span></h2>
            <p className="text-slate-500 mt-4 text-sm font-light max-w-xl">
              {searchCriteria?.length ? `Optimized for ${searchCriteria.length}m vessels.` : 'Browse our collection of elite berthing categories.'}
            </p>
          </div>
          <div className="flex bg-navy-900 p-1 rounded-sm border border-white/5 shadow-2xl">
            <button onClick={() => setViewMode('list')} className={`px-6 py-2 flex items-center gap-2 text-[10px] font-bold tracking-widest transition-all ${viewMode === 'list' ? 'bg-gold-500 text-navy-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              <List className="w-4 h-4" /> LIST VIEW
            </button>
            <button onClick={() => setViewMode('map')} className={`px-6 py-2 flex items-center gap-2 text-[10px] font-bold tracking-widest transition-all ${viewMode === 'map' ? 'bg-gold-500 text-navy-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              <MapIcon className="w-4 h-4" /> CHART VIEW
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-12">
          <div className="flex-1 min-h-[700px]">
            {viewMode === 'list' ? (
              <div className="space-y-16">
                {CATEGORIES.map(cat => {
                  const slipsInCat = filteredSlips.filter(s => cat.pontoons.includes(s.pontoon) && s.status === 'available');
                  if (slipsInCat.length === 0) return null;

                  return (
                    <div key={cat.id} className="animate-fade-in group">
                      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/5 gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-gold-500 mb-2">
                            <Waves className="w-4 h-4" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{cat.title}</span>
                          </div>
                          <p className="text-slate-400 text-xs font-light max-w-2xl">{cat.desc}</p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gold-500/60 font-mono tracking-widest uppercase">
                           <ShieldCheck className="w-3 h-3" /> {cat.view}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {slipsInCat.slice(0, 3).map(slip => (
                          <div 
                            key={slip.id} 
                            onClick={() => setSelectedSlip(slip)}
                            className={`p-8 border transition-all duration-500 cursor-pointer flex flex-col justify-between group/card ${selectedSlip?.id === slip.id ? 'bg-gold-500/10 border-gold-500 ring-1 ring-gold-500/20 shadow-[0_0_40px_rgba(212,175,55,0.1)]' : 'bg-navy-900/40 border-white/5 hover:border-gold-500/30'}`}
                          >
                            <div className="mb-8">
                              <div className="flex justify-between items-start mb-6">
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                                   Starting From
                                   <div className="text-2xl text-white font-serif tracking-wide mt-1">€{slip.price} <span className="text-[10px] opacity-40">/ NIGHT</span></div>
                                </div>
                                <div className="flex gap-1">
                                   {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-gold-500 text-gold-500" />)}
                                </div>
                              </div>
                              <h4 className="font-serif text-3xl text-white mb-2">{slip.pontoon}-{slip.number}</h4>
                              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-6">
                                Optimized for {slip.length}m x {slip.beam}m
                              </p>
                              
                              <div className="space-y-3">
                                {slip.features.slice(0, 3).map(f => (
                                  <div key={f} className="flex items-center gap-3 text-xs text-slate-400">
                                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-gold-500">
                                      {getAmenityIcon(f)}
                                    </div>
                                    <span>{f}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button 
                              onClick={() => onBookSlip(slip)}
                              className="w-full py-4 bg-navy-950 text-gold-500 border border-gold-500/20 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gold-500 hover:text-navy-950 transition-all duration-300"
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
              <div className="h-full bg-navy-900/50 rounded-sm border border-white/5 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-sm flex flex-col">
                    <button onClick={() => setZoomLevel(z => Math.min(z + 0.1, 1.5))} className="p-3 hover:bg-white/5 transition-colors border-b border-white/5"><ZoomIn className="w-5 h-5 text-gold-500" /></button>
                    <button onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.7))} className="p-3 hover:bg-white/5 transition-colors"><ZoomOut className="w-5 h-5 text-gold-500" /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-12 custom-scrollbar">
                  <div className="min-w-[1200px] flex flex-col gap-20 origin-top-left" style={{ transform: `scale(${zoomLevel})` }}>
                    {pontoons.map(pID => (
                      <div key={pID} className="flex items-center gap-8 group">
                        <div className="w-20 h-12 bg-navy-800 border-y border-gold-500/30 flex items-center justify-center font-serif text-lg text-gold-500">{pID}</div>
                        <div className="flex gap-2">
                          {filteredSlips.filter(s => s.pontoon === pID).map(slip => (
                            <button
                              key={slip.id}
                              onClick={() => slip.status === 'available' && setSelectedSlip(slip)}
                              className={`w-8 h-12 rounded-sm border transition-all ${slip.status === 'available' ? (selectedSlip?.id === slip.id ? 'bg-gold-500 border-white shadow-[0_0_15px_#D4AF37]' : 'bg-emerald-900/20 border-emerald-500/40') : 'bg-navy-950 border-white/5 opacity-20'}`}
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

          <div className="w-full xl:w-[450px] space-y-8">
            <div className={`glass-panel p-10 rounded-sm border-t-2 border-gold-500 transition-all duration-500 ${selectedSlip ? 'opacity-100 translate-y-0 shadow-[0_30px_60px_rgba(0,0,0,0.6)]' : 'opacity-40 translate-y-4 pointer-events-none'}`}>
              {selectedSlip ? (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h3 className="font-serif text-4xl text-white mb-2">{selectedSlip.pontoon}-{selectedSlip.number}</h3>
                      <div className="flex items-center gap-2 text-gold-500/60 font-mono text-[9px] uppercase tracking-widest">
                         <Navigation className="w-3 h-3" /> LOC ID: {selectedSlip.id}
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[9px] font-bold tracking-widest rounded-full uppercase">Verified Available</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="p-5 bg-navy-950 border border-white/5">
                      <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Berth Dimensions</div>
                      <div className="text-lg text-white font-serif">{selectedSlip.length}m x {selectedSlip.beam}m</div>
                    </div>
                    <div className="p-5 bg-navy-950 border border-white/5">
                      <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Draft Access</div>
                      <div className="text-lg text-white font-serif">Deep Draft</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <h4 className="text-[10px] text-gold-500 font-bold tracking-widest uppercase flex items-center gap-2">
                       <Sparkles className="w-3 h-3" /> Platinum Amenities
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedSlip.features.map(f => (
                        <div key={f} className="flex items-center gap-4 text-xs text-slate-400 group">
                          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                            {getAmenityIcon(f)}
                          </div>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-8 mb-10">
                     <div className="flex justify-between items-center mb-4">
                        <div className="text-xs text-slate-500">Nightly Rate</div>
                        <div className="text-xl text-white font-serif">€{selectedSlip.price}</div>
                     </div>
                     <div className="flex justify-between items-center font-bold">
                        <div className="text-sm text-gold-500 uppercase tracking-widest">Stay Total</div>
                        <div className="text-3xl text-white font-serif">€{selectedSlip.price}</div>
                     </div>
                  </div>

                  <button 
                    onClick={() => onBookSlip(selectedSlip)}
                    className="w-full py-6 bg-gold-500 text-navy-950 font-bold tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-3 text-xs"
                  >
                    <Anchor className="w-4 h-4" /> CONFIRM RESERVATION
                  </button>
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mb-6 opacity-20">
                    <Ship className="w-10 h-10 text-slate-600" />
                  </div>
                  <p className="font-serif italic text-slate-500">Select a berth category to view detailed amenities and pricing.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-navy-900 border border-white/5 flex items-center gap-4 group">
               <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 group-hover:scale-110 transition-transform">
                 <ShieldCheck className="w-5 h-5" />
               </div>
               <div>
                  <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">D-Marin Protected</div>
                  <div className="text-xs text-slate-500">Full insurance and 24/7 security surveillance active.</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarinaMap;