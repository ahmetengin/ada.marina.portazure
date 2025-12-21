
import React, { useState } from 'react';
import { MOCK_SLIPS } from '../constants';
import { Language, Slip } from '../types';
import { Wifi, Zap, Droplets, Terminal, Compass, Activity, ShieldCheck, Anchor } from 'lucide-react';

interface MarinaMapProps {
  lang: Language;
  onBookSlip: (slip: Slip) => void;
  lastLogs?: string[];
  searchCriteria?: any;
}

const MarinaMap: React.FC<MarinaMapProps> = ({ onBookSlip, lastLogs = [], searchCriteria }) => {
  const [hoveredSlip, setHoveredSlip] = useState<string | null>(null);

  return (
    <div className="flex flex-col xl:flex-row gap-12">
      {/* 1. Berth Selection Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SLIPS.map(slip => (
          <div 
            key={slip.id} 
            onMouseEnter={() => setHoveredSlip(slip.id)}
            onMouseLeave={() => setHoveredSlip(null)}
            className={`group p-8 border transition-all duration-700 relative overflow-hidden flex flex-col ${
              hoveredSlip === slip.id 
              ? 'bg-brass-500/10 border-brass-500 shadow-[0_20px_50px_rgba(197,160,89,0.15)]' 
              : 'bg-black/40 border-brass-500/10 hover:border-brass-500/40'
            }`}
          >
            {/* Background Texture */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
              <Anchor className="w-32 h-32" />
            </div>

            <div className="flex justify-between items-start mb-10">
               <div className="text-[10px] font-mono font-bold text-brass-500/60 tracking-widest uppercase">{slip.pontoon} BERTH</div>
               <div className={`w-2 h-2 rounded-full ${slip.status === 'available' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'} animate-pulse`}></div>
            </div>

            <div className="flex-1">
              <h4 className="font-heading text-5xl text-ivory-50 mb-2">{slip.number}</h4>
              <p className="text-[10px] font-mono text-ivory-100/30 uppercase tracking-[0.3em] mb-10">{slip.length}m x {slip.beam}m</p>
              
              <div className="flex gap-6 mb-12">
                 <div className="flex flex-col items-center gap-2">
                    <Wifi className="w-4 h-4 text-brass-500/30 group-hover:text-brass-500 transition-colors" />
                    <span className="text-[8px] font-bold text-ivory-100/20 uppercase">NET</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <Zap className="w-4 h-4 text-brass-500/30 group-hover:text-brass-500 transition-colors" />
                    <span className="text-[8px] font-bold text-ivory-100/20 uppercase">PWR</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <Droplets className="w-4 h-4 text-brass-500/30 group-hover:text-brass-500 transition-colors" />
                    <span className="text-[8px] font-bold text-ivory-100/20 uppercase">H2O</span>
                 </div>
              </div>
            </div>

            <button 
              onClick={() => onBookSlip(slip)}
              className="w-full py-4 border border-brass-500/20 text-brass-500 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-brass-500 hover:text-emerald-950 transition-all flex items-center justify-center gap-3 group-hover:border-brass-500"
            >
              <ShieldCheck className="w-4 h-4" /> Secure Berth
            </button>
          </div>
        ))}
      </div>

      {/* 2. Operational Control Side (LOGS) */}
      <div className="w-full xl:w-[450px]">
        <div className="bg-black/60 border border-brass-500/10 h-full flex flex-col shadow-2xl relative overflow-hidden group">
           {/* Top Scanning Line */}
           <div className="absolute top-0 left-0 w-full h-1 bg-brass-500/20 animate-pulse"></div>

           <div className="p-8 border-b border-brass-500/10 bg-brass-500/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <Terminal className="w-5 h-5 text-brass-500" />
                 <div>
                   <h3 className="text-[10px] font-bold text-brass-500 tracking-[0.4em] uppercase">Operational Intelligence</h3>
                   <p className="text-[8px] text-ivory-100/20 font-mono mt-1">REALTIME_PORT_ANALYTICS // ON</p>
                 </div>
              </div>
              <div className="flex gap-1">
                 <div className="w-1 h-4 bg-brass-500/20 animate-[pulse_1s_infinite]"></div>
                 <div className="w-1 h-6 bg-brass-500/30 animate-[pulse_1.2s_infinite]"></div>
                 <div className="w-1 h-3 bg-brass-500/20 animate-[pulse_0.8s_infinite]"></div>
              </div>
           </div>
           
           <div className="flex-1 p-8 font-mono text-[10px] space-y-6 overflow-y-auto custom-scrollbar">
              {lastLogs.map((log, i) => (
                <div key={i} className="group/item relative pl-6 py-2 border-l border-brass-500/10 hover:border-brass-500 transition-colors">
                   <div className="absolute -left-1 top-2 w-2 h-2 rounded-full bg-brass-500/20 group-hover/item:bg-brass-500 transition-colors"></div>
                   <div className="text-ivory-100/60 leading-relaxed font-mono">{log}</div>
                </div>
              ))}
              {lastLogs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center py-20">
                   <Compass className="w-16 h-16 mb-6 animate-spin-slow" />
                   <p className="tracking-[0.5em] text-[10px] font-bold uppercase">Awaiting Neural Link...</p>
                </div>
              )}
           </div>

           <div className="p-8 bg-black/40 border-t border-brass-500/10 flex justify-between items-center px-10">
              <div className="flex items-center gap-3">
                 <Activity className="w-3 h-3 text-emerald-500/40" />
                 <span className="text-[8px] font-bold text-ivory-100/20 tracking-widest uppercase">BRIDGE_SYNC: PERFECT</span>
              </div>
              <div className="text-[8px] font-mono text-brass-500/30">{new Date().toLocaleTimeString()}</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MarinaMap;
