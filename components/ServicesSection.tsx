
import React from 'react';
import { Utensils, Waves, Sparkles, Plane, Ship, Wind, Compass, Map, Landmark, Hotel } from 'lucide-react';
import { Language } from '../types';

interface ServicesSectionProps {
  lang: Language;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ lang }) => {
  const content = {
    tr: {
      title: "ALESTA STRATEGIC HUB",
      subtitle: "Fethiye'nin kalbinde, denizden karaya tam entegre lüks hizmet ağı.",
      items: [
        { icon: Hotel, label: "Alesta Yacht Hotel", desc: "52 özel tasarım oda, Marina manzaralı Roof Restaurant ve tam donanımlı SPA." },
        { icon: Ship, label: "Alesta Yachting Filosu", desc: "14 profesyonel tekne ile kişiye özel Mavi Tur ve Gulet kiralama operasyonları." },
        { icon: Waves, label: "Alesta Beach Club", desc: "Aksazlar Koyu'nda kristal sular. Otelden özel Shuttle Boat ile ücretsiz erişim." },
        { icon: Map, label: "Likya Yolu Tracking", desc: "Fethiye'den başlayan antik patikalarda teknik rota rehberliği." },
        { icon: Wind, label: "Babadağ Paraşüt", desc: "1960 metre zirveden Ölüdeniz'e eşsiz süzülüş koordinasyonu." },
        { icon: Landmark, label: "Kültürel Miras", desc: "Kayaköy ve Tlos antik kentlerine rehberli tarih turları." }
      ]
    },
    en: {
      title: "ALESTA STRATEGIC HUB",
      subtitle: "Fully integrated luxury service network from sea to land in the heart of Fethiye.",
      items: [
        { icon: Hotel, label: "Alesta Yacht Hotel", desc: "52 boutique rooms, Marina view Roof Restaurant and full-service SPA." },
        { icon: Ship, label: "Alesta Yachting Fleet", desc: "14 professional vessels for bespoke Blue Cruise and Gulet charter ops." },
        { icon: Waves, label: "Alesta Beach Club", desc: "Crystal waters at Aksazlar Bay. Free access via private Shuttle Boat from the hotel." },
        { icon: Map, label: "Lycian Way Tracking", desc: "Technical route guidance on the ancient trails starting from Fethiye." },
        { icon: Wind, label: "Babadağ Flight", desc: "Flight coordination from 1960m peak to Ölüdeniz." },
        { icon: Landmark, label: "Heritage Tours", desc: "Guided historical tours to Kayaköy and Tlos ancient sites." }
      ]
    },
    de: {
      title: "ALESTA STRATEGIC HUB",
      subtitle: "Voll integriertes Luxus-Servicenetzwerk.",
      items: [
        { icon: Hotel, label: "Alesta Yacht Hotel", desc: "52 Boutique-Zimmer, Roof Restaurant und SPA." },
        { icon: Ship, label: "Alesta Yachting", desc: "14 professionelle Schiffe für Mavi Tur." },
        { icon: Waves, label: "Alesta Beach Club", desc: "Klares Wasser in der Aksazlar-Bucht. Shuttle Boat Zugang." },
        { icon: Map, label: "Lycian Way", desc: "Technische Routenführung." },
        { icon: Wind, label: "Babadağ Paragliding", desc: "Flugkoordination." },
        { icon: Landmark, label: "Kulturerbe", desc: "Geführte historische Touren." }
      ]
    }
  };

  const active = content[lang];

  return (
    <section className="py-24 md:py-32 px-6 bg-[#020a09] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brass-500/30 to-transparent"></div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-brass-500 text-[10px] md:text-xs tracking-[0.5em] uppercase mb-4 block font-bold">{active.title}</span>
          <h2 className="font-heading text-3xl md:text-6xl text-white mb-6 uppercase tracking-tight">Executive <span className="italic text-brass-500 lowercase">Services</span></h2>
          <p className="text-ivory-100/40 font-serif italic text-lg max-w-2xl mx-auto">{active.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {active.items.map((item, i) => (
            <div key={i} className="group p-8 md:p-10 border border-brass-500/5 bg-black/40 hover:bg-brass-500/5 transition-all duration-700 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                <item.icon className="w-32 h-32" />
              </div>
              <item.icon className="w-10 h-10 text-brass-500 mb-8 group-hover:scale-110 transition-transform duration-700" />
              <h3 className="text-ivory-50 font-heading text-2xl mb-4 tracking-wide uppercase">{item.label}</h3>
              <p className="text-ivory-100/40 text-sm leading-relaxed font-light">{item.desc}</p>
              <div className="mt-8 w-10 h-[1px] bg-brass-500/40 group-hover:w-full transition-all duration-1000"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
