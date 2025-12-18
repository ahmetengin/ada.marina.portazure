import React from 'react';
import { Utensils, Waves, Sparkles, Plane, Car, Wine } from 'lucide-react';
import { Language } from '../types';

interface ServicesSectionProps {
  lang: Language;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ lang }) => {
  const content = {
    tr: {
      title: "PREMIUM YAŞAM",
      subtitle: "Sadece bir bağlama yeri değil, bir yaşam tarzı.",
      items: [
        { icon: Utensils, label: "Fine Dining", desc: "Deniz manzaralı Michelin yıldızlı lezzetler." },
        { icon: Waves, label: "Beach Club", desc: "Kristal berraklığında özel plaj ve lounge." },
        { icon: Sparkles, label: "Wellness & Spa", desc: "Deniz tuzu terapileri ve masaj." },
        { icon: Plane, label: "Heliport", desc: "VIP transfer ve helikopter pisti." },
        { icon: Wine, label: "Yacht Provisions", desc: "Dünya mutfağından seçkin ikmaller." },
        { icon: Car, label: "VIP Chauffeur", desc: "7/24 lüks araç ve şoför hizmeti." }
      ]
    },
    en: {
      title: "PREMIUM LIFESTYLE",
      subtitle: "More than just a berth, it's a way of life.",
      items: [
        { icon: Utensils, label: "Fine Dining", desc: "Michelin-starred flavors with sea views." },
        { icon: Waves, label: "Beach Club", desc: "Crystal clear private beach and lounge." },
        { icon: Sparkles, label: "Wellness & Spa", desc: "Sea salt therapies and massage." },
        { icon: Plane, label: "Heliport", desc: "VIP transfer and helipad access." },
        { icon: Wine, label: "Yacht Provisions", desc: "Elite provisions from world cuisine." },
        { icon: Car, label: "VIP Chauffeur", desc: "24/7 luxury car and driver service." }
      ]
    },
    de: {
      title: "PREMIUM LEBENSSTIL",
      subtitle: "Mehr als nur ein Liegeplatz, es ist eine Lebensart.",
      items: [
        { icon: Utensils, label: "Fine Dining", desc: "Michelin-Sterne-Aromen mit Meerblick." },
        { icon: Waves, label: "Beach Club", desc: "Kristallklarer Privatstrand und Lounge." },
        { icon: Sparkles, label: "Wellness & Spa", desc: "Meersalztherapien und Massage." },
        { icon: Plane, label: "Heliport", desc: "VIP-Transfer und Hubschrauberlandeplatz." },
        { icon: Wine, label: "Yacht-Proviant", desc: "Elite-Proviant aus der Weltküche." },
        { icon: Car, label: "VIP-Chauffeur", desc: "24/7 Luxusauto- und Fahrerservice." }
      ]
    }
  };

  const active = content[lang];

  return (
    <section className="py-32 px-6 bg-navy-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-4 block font-bold">{active.title}</span>
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">Concierge <span className="italic text-gold-500">Excellence</span></h2>
          <p className="text-slate-400 font-light max-w-2xl mx-auto">{active.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {active.items.map((item, i) => (
            <div key={i} className="group p-8 border border-white/5 bg-navy-900/40 hover:bg-navy-900/80 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <item.icon className="w-24 h-24" />
              </div>
              <item.icon className="w-10 h-10 text-gold-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-white font-serif text-2xl mb-3 tracking-wide">{item.label}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              <div className="mt-6 w-8 h-px bg-gold-500 group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;