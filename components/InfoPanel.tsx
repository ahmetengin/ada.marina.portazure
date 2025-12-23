
import React from 'react';
import { Wind, MapPin, Radio, Droplets, Compass } from 'lucide-react';
import { MarinaConfig, WeatherData, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface InfoPanelProps {
  weather: WeatherData;
  config: MarinaConfig;
  lang: Language;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ weather, config, lang }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="fixed top-48 left-12 z-20 flex flex-col gap-8 hidden xl:flex animate-fade-in">
      
      <div className="bg-navy-900/80 backdrop-blur-xl p-10 rounded-[2.5rem] w-80 shadow-2xl border-l-[6px] border-azure-500 ring-1 ring-white/10">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-azure-600 p-2.5 rounded-xl text-white shadow-lg shadow-azure-900/50">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-[12px] tracking-[0.3em] uppercase text-azure-400 font-black">{t.widgets.location}</h3>
        </div>
        <div className="mb-10">
           <div className="text-ivory-50 font-heading text-2xl tracking-wide mb-2 uppercase leading-tight">{config.name}</div>
           <div className="font-mono text-xs text-azure-400 font-bold opacity-80">{config.coordinates.lat} / {config.coordinates.long}</div>
        </div>
        <div className="flex items-center justify-between bg-azure-950/50 p-6 rounded-2xl border border-azure-500/20">
           <div className="flex items-center gap-4">
              <Radio className="w-5 h-5 text-azure-400" />
              <span className="text-[11px] font-black text-ivory-100/40 uppercase tracking-widest">VHF CH</span>
           </div>
           <span className="text-3xl font-heading font-black text-ivory-50">{config.vhfChannel}</span>
        </div>
      </div>

      <div className="bg-navy-900/80 backdrop-blur-xl p-10 rounded-[2.5rem] w-80 shadow-2xl border-l-[6px] border-sunlight-500 ring-1 ring-white/10">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-sunlight-500 p-2.5 rounded-xl text-white shadow-lg shadow-sunlight-900/50">
            <Wind className="w-6 h-6" />
          </div>
          <h3 className="text-[12px] tracking-[0.3em] uppercase text-sunlight-400 font-black">{t.widgets.weather}</h3>
        </div>
        <div className="flex justify-between items-end mb-8">
          <span className="text-5xl font-heading font-black text-ivory-50 tracking-tighter">{weather.temp}°C</span>
          <div className="text-right">
            <span className="font-mono text-[12px] text-sunlight-400 font-black uppercase block tracking-widest">{weather.windSpeed} KTS {weather.windDir}</span>
            <span className="text-[11px] text-ivory-100/30 uppercase tracking-widest font-bold">Deniz Durumu: Stabil</span>
          </div>
        </div>
        <div className="h-2.5 w-full bg-navy-950 rounded-full overflow-hidden mb-4 border border-white/5">
             <div className="h-full bg-azure-500 w-[85%] shadow-[0_0_10px_#0ea5e9]"></div>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-ivory-100/40 uppercase tracking-widest font-black italic">
           <Droplets className="w-4 h-4 text-azure-400" />
           {weather.description}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
