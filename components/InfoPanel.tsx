
import React from 'react';
import { Wind, MapPin, Navigation, Radio } from 'lucide-react';
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
    <div className="absolute top-24 left-4 z-20 flex flex-col gap-4 md:top-32 md:left-12 hidden lg:flex animate-fade-in">
      
      {/* Dynamic Marina Location Widget */}
      <div className="glass-panel p-5 rounded-lg w-72 transform transition hover:scale-105 duration-500 border-l-4 border-l-brass-500">
        <div className="flex items-center gap-3 mb-3 text-brass-500">
          <MapPin className="w-5 h-5" />
          <h3 className="font-heading text-[10px] tracking-widest uppercase text-ivory-100/60 font-bold">{t.widgets.location}</h3>
        </div>
        <div className="mb-4">
           <div className="text-ivory-50 font-heading text-lg tracking-wider mb-1 uppercase">{config.name}</div>
           <div className="font-mono text-xs text-brass-500/60 font-bold">{config.coordinates.lat} / {config.coordinates.long}</div>
        </div>
        <div className="h-[1px] w-full bg-brass-500/10 mb-4"></div>
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Radio className="w-4 h-4 text-brass-500/50" />
              <span className="text-[10px] font-bold text-ivory-100/40 uppercase tracking-widest">VHF CH</span>
           </div>
           <span className="text-xl font-heading font-bold text-ivory-50">{config.vhfChannel}</span>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="glass-panel p-5 rounded-lg w-72 transform transition hover:scale-105 duration-500 border-l-4 border-l-emerald-400">
        <div className="flex items-center gap-3 mb-3 text-emerald-400">
          <Wind className="w-5 h-5" />
          <h3 className="font-heading text-[10px] tracking-widest uppercase text-ivory-100/60 font-bold">{t.widgets.weather}</h3>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-4xl font-heading font-bold text-ivory-50">{weather.temp}°C</span>
          <span className="font-mono text-xs text-emerald-400 mb-1 font-bold">{weather.windSpeed} KTS {weather.windDir}</span>
        </div>
        <p className="text-[10px] text-ivory-100/30 mt-2 uppercase tracking-widest font-bold">{weather.description}</p>
        <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-400 w-[60%] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
