
import React, { useState } from 'react';
import { MOCK_SLIPS } from '../constants';
import { Language, Slip } from '../types';
import { Wifi, Zap, Droplets, Terminal, ShieldCheck, Anchor, Activity, Info, Ruler } from 'lucide-react';

interface MarinaMapProps {
  lang: Language;
  onBookSlip: (slip: Slip) => void;
}

const MarinaMap: React.FC<MarinaMapProps> = ({ onBookSlip }) => {
  const [hoveredSlip, setHoveredSlip] = useState<string | null>(null);

  return (
    <div id="operations" className="flex flex-col xl:flex-row gap-16 scroll-mt-32">
      <div className="flex-1">
        <div className="mb-16">
           <span className="text-azure-400 text-[11px] tracking-[0.4em] font-bold uppercase mb-4 block">GÖCEK HAVZASI</span>
           <h2 className="font-heading text-4xl text-white uppercase tracking-tight">Gerçek Zamanlı <span className="italic text-azure-400 lowercase font-serif">Bağlama</span> Planı</h2>
           <p className="text-white/60 font-serif italic text-lg mt-4 leading-relaxed">Müsait rıhtımları inceleyin ve yaklaşma rotanızı belirleyin.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_SLIPS.map(slip => (
            <div 
              key={slip.id} 
              onMouseEnter={() => setHoveredSlip(slip.id)}
              onMouseLeave={() => setHoveredSlip(null)}
              className={`group p-8 border-2 rounded-[2.5rem] transition-all duration-500 relative overflow-hidden flex flex-col ${
                hoveredSlip === slip.id 
                ? 'bg-azure-600 border-azure-600 text-white shadow-2xl scale-[1.02]' 
                : 'bg-navy-900 border-azure-500/20 text-white hover:border-azure-400/40'
              }`}
            >
              <div className="flex justify-between items-start mb-8">
                 <div className={`text-[10px] font-mono font-black tracking-[0.3em] uppercase ${hoveredSlip === slip.id ? 'text-white/80' : 'text-azure-400/60'}`}>
                    PONTOON: {slip.pontoon}
                 </div>
                 <div className={`w-3 h-3 rounded-full ${slip.status === 'available' ? 'bg-cyan-400 shadow-[0_0_15px_#22d3ee]' : 'bg-red-500'} animate-pulse`}></div>
              </div>

              <div className="flex-1">
                <h4 className="font-heading text-6xl mb-4 tracking-tighter text-white">{slip.number}</h4>
                <div className="flex items-center gap-3 mb-8">
                   <Ruler className={`w-4 h-4 ${hoveredSlip === slip.id ? 'text-white' : 'text-azure-400/60'}`} />
                   <p className={`text-[11px] font-mono uppercase tracking-[0.4em] font-black ${hoveredSlip === slip.id ? 'text-white/80' : 'text-white/40'}`}>
                    {slip.length}M x {slip.beam}M
                   </p>
                </div>
                
                <div className="flex gap-6 mb-10">
                   {['WIFI', 'POWER', 'WATER'].map((feat, idx) => (
                     <div key={idx} className="flex flex-col items-center gap-2">
                        {feat === 'WIFI' && <Wifi className={`w-5 h-5 ${hoveredSlip === slip.id ? 'text-white' : 'text-azure-400/60'}`} />}
                        {feat === 'POWER' && <Zap className={`w-5 h-5 ${hoveredSlip === slip.id ? 'text-white' : 'text-azure-400/60'}`} />}
                        {feat === 'WATER' && <Droplets className={`w-5 h-5 ${hoveredSlip === slip.id ? 'text-white' : 'text-azure-400/60'}`} />}
                        <span className={`text-[8px] font-black uppercase tracking-widest ${hoveredSlip === slip.id ? 'text-white/60' : 'text-white/20'}`}>{feat}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-8 border-t border-white/5 pt-6">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${hoveredSlip === slip.id ? 'text-white/80' : 'text-white/40'}`}>GÜNLÜK</span>
                  <span className={`text-2xl font-heading font-black ${hoveredSlip === slip.id ? 'text-white' : 'text-sunlight-500'}`}>€{slip.price}</span>
              </div>

              <button 
                onClick={() => onBookSlip(slip)}
                className={`w-full py-5 rounded-2xl text-[11px] font-black tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  hoveredSlip === slip.id 
                  ? 'bg-white text-azure-600 hover:bg-azure-50' 
                  : 'bg-navy-950 text-azure-400 border-2 border-azure-500/30 hover:bg-azure-600 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-5 h-5" /> REZERVE ET
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full xl:w-[420px]">
        <div className="bg-navy-900 border-2 border-azure-500/20 rounded-[3rem] h-full flex flex-col shadow-xl overflow-hidden ring-1 ring-white/5">
           <div className="p-8 border-b border-azure-500/20 bg-navy-950/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-azure-600 p-3 rounded-2xl text-white shadow-lg">
                   <Terminal className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="text-[10px] font-bold text-white tracking-[0.3em] uppercase">Bridge Terminal</h3>
                   <p className="text-[8px] text-azure-400 font-mono mt-0.5 uppercase font-black">Port_Ops_V16.0 // ONLINE</p>
                 </div>
              </div>
           </div>
           
           <div className="flex-1 p-8 font-mono text-[11px] space-y-6 overflow-y-auto custom-scrollbar bg-navy-950/10">
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                 <Activity className="w-12 h-12 mb-4 animate-float text-azure-400" />
                 <p className="tracking-[0.5em] text-[10px] font-black uppercase text-white">Trafik İzleniyor...</p>
                 <span className="text-[8px] mt-2 tracking-normal opacity-50 italic text-azure-400 font-bold">VHF Ch 11 Aktif Tarama</span>
              </div>
              
              <div className="space-y-4 text-[10px] font-bold">
                 <div className="flex gap-4">
                    <span className="text-azure-400">[14:02]</span>
                    <span className="text-white/70">ADA: NEURAL_LINK_ESTABLISHED</span>
                 </div>
                 <div className="flex gap-4">
                    <span className="text-azure-400">[14:15]</span>
                    <span className="text-white/70">AIS: 3 VESSELS DETECTED</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MarinaMap;
