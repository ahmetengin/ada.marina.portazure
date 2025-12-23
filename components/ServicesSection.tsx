
import React from 'react';
import { Waves, Ship, Compass, Map, Landmark, Hotel, Star, Anchor } from 'lucide-react';
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
        { icon: Hotel, label: "Alesta Yacht Hotel", desc: "52 butik oda, Marina manzaralı Roof Restaurant ve lüks SPA deneyimi." },
        { icon: Ship, label: "Yachting Filosu", desc: "M/S Kayhan serisi ile profesyonel Mavi Tur ve Gulet kiralama operasyonları." },
        { icon: Waves, label: "Beach Club", desc: "Aksazlar Koyu'nda kristal sular. Hotel misafirlerine özel ücretsiz Shuttle Boat." },
        { icon: Map, label: "Lycian Tracking", desc: "Fethiye'den başlayan antik patikalarda profesyonel rota rehberliği." },
        { icon: Anchor, label: "Port Azure Marina", desc: "Digital Concierge destekli akıllı bağlama ve teknik liman servisleri." },
        { icon: Star, label: "Gourmet Dining", desc: "Alarga Restaurant'ta gün batımı eşliğinde modern Akdeniz mutfağı." }
      ]
    },
    en: {
      title: "ALESTA STRATEGIC HUB",
      subtitle: "Fully integrated luxury service network from sea to land in the heart of Fethiye.",
      items: [
        { icon: Hotel, label: "Alesta Yacht Hotel", desc: "52 boutique rooms, Marina view Roof Restaurant and full-service SPA." },
        { icon: Ship, label: "Yachting Fleet", desc: "Professional Blue Cruise ops with the luxury M/S Kayhan vessel series." },
        { icon: Waves, label: "Beach Club", desc: "Crystal waters at Aksazlar Bay. Free access via private Shuttle Boat from the hotel." },
        { icon: Map, label: "Lycian Way", desc: "Professional route guidance on the ancient trails starting from Fethiye." },
        { icon: Anchor, label: "Port Azure Marina", desc: "Next-gen berthing with AI concierge support and technical harbor help." },
        { icon: Star, label: "Gourmet Dining", desc: "Modern Mediterranean cuisine at Alarga Rooftop with panoramic views." }
      ]
    }
  };

  const active = content[lang === 'tr' ? 'tr' : 'en'];

  return (
    <section className="py-40 md:py-56 px-6 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-azure-500/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 md:mb-32">
          <span className="text-azure-600 text-[11px] tracking-[0.5em] uppercase mb-6 block font-bold">{active.title}</span>
          <h2 className="font-heading text-4xl md:text-7xl text-navy-900 mb-8 uppercase tracking-tighter">Unified <span className="italic text-azure-600 lowercase font-serif">hospitality</span></h2>
          <p className="text-navy-900/40 font-serif italic text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">{active.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {active.items.map((item, i) => (
            <div key={i} className="group p-12 md:p-16 border-2 border-azure-50 bg-azure-50/10 rounded-[3.5rem] hover:bg-white hover:border-azure-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-700 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 p-8 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none">
                <item.icon className="w-48 h-48" />
              </div>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-azure-600 shadow-xl mb-10 group-hover:bg-azure-600 group-hover:text-white transition-all">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-navy-900 font-heading text-2xl mb-6 tracking-wide uppercase">{item.label}</h3>
              <p className="text-navy-900/40 text-[15px] leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
