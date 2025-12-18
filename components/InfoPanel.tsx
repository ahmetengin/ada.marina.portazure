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
    <div className="absolute top-24 left-4 z-20 flex flex-col gap-4 md:top-32 md:left-12 hidden md:flex">
      {/* Hidden on very small screens to save space, visible on md+ */}
      
      {/* Location Widget */}
      <div className="glass-panel p-4 rounded-lg w-64 transform transition hover:scale-105 duration-300">
        <div className="flex items-center gap-3 mb-2 text-neon-blue">
          <Navigation className="w-5 h-5 text-blue-400" />
          <h3 className="font-display text-sm tracking-wider text-slate-200">{t.widgets.location}</h3>
        </div>
        <div className="font-mono text-xl text-white font-bold">{config.coordinates.lat}</div>
        <div className="font-mono text-xl text-white font-bold">{config.coordinates.long}</div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Bodrum, Türkiye
        </div>
      </div>

      {/* Weather Widget */}
      <div className="glass-panel p-4 rounded-lg w-64 transform transition hover:scale-105 duration-300">
        <div className="flex items-center gap-3 mb-2 text-neon-green">
          <Wind className="w-5 h-5 text-emerald-400" />
          <h3 className="font-display text-sm tracking-wider text-slate-200">{t.widgets.weather}</h3>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-3xl font-bold text-white">{weather.temp}°C</span>
          <span className="font-mono text-sm text-emerald-400 mb-1">{weather.windSpeed} kts {weather.windDir}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1 uppercase">{weather.description}</p>
        <div className="mt-2 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-400 w-[60%] animate-pulse"></div>
        </div>
      </div>

      {/* VHF Radio Info Widget */}
      <div className="glass-panel p-4 rounded-lg w-64 transform transition hover:scale-105 duration-300">
        <div className="flex items-center gap-3 mb-2 text-gold-500">
          <Radio className="w-5 h-5" />
          <h3 className="font-display text-sm tracking-wider text-slate-200">VHF CHANNEL</h3>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-3xl font-bold text-white">{config.vhfChannel}</span>
          <span className="font-mono text-xs text-gold-500 mb-1 animate-pulse border border-gold-500/50 px-2 py-0.5 rounded-full">● LIVE</span>
        </div>
        <p className="text-xs text-slate-400 mt-1 uppercase">Digital Watch Active</p>
        <div className="mt-2 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
             <div className="h-full bg-gold-500 w-[90%]"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;