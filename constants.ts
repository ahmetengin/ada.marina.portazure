
import { MarinaConfig, Slip, Translation, Language } from "./types";

export const MARINA_CONFIG: MarinaConfig = {
  name: "PORT AZURE",
  vhfChannel: "16 / 72",
  coordinates: {
    lat: "36°53.2'N",
    long: "27°16.4'E"
  },
  contact: {
    phone: "+90 252 311 00 00",
    email: "concierge@portazure.com"
  }
};

export const MOCK_WEATHER = {
  temp: 24,
  windSpeed: 8,
  windDir: "NW",
  pressure: 1012,
  description: "Fair / Açık"
};

export const MARINA_LIST = [
  { name: "Camille Rayon", rating: "4.5", reviews: 84, maxLen: "75m", country: "FR", img: "https://images.unsplash.com/photo-1577127166872-4043f4a9b6c0?q=80&w=800&auto=format&fit=crop" },
  { name: "Borik", rating: "4.5", reviews: 1154, maxLen: "30m", country: "HR", img: "https://images.unsplash.com/photo-1566375638419-dd89cf109716?q=80&w=800&auto=format&fit=crop" },
  { name: "Dalmacija", rating: "4.5", reviews: 1604, maxLen: "70m", country: "HR", img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=800&auto=format&fit=crop" },
  { name: "Mandalina", rating: "4.5", reviews: 1828, maxLen: "60m", country: "HR", img: "https://images.unsplash.com/photo-1504502350610-108e5a772652?q=80&w=800&auto=format&fit=crop" },
  { name: "Tribunj", rating: "4.6", reviews: 973, maxLen: "40m", country: "HR", img: "https://images.unsplash.com/photo-1520183802803-06f731a2059f?q=80&w=800&auto=format&fit=crop" }
];

export const FOOTER_LINKS = {
  tr: {
    spain: ["Palma Cuarentena"],
    france: ["Camille Rayon"],
    italy: ["Aregai", "San Lorenzo", "Varazze", "Porto Mirabello", "Livorno", "Punta Faro Resort"],
    croatia: ["Borik", "Dalmacija", "Mandalina", "Tribunj"],
    greece: ["Gouvia", "Lefkas", "Pylos", "Zea"],
    turkey: ["Didim", "Turgutreis", "Göcek", "Port Azure"],
    uae: ["Al Seef", "Jaddaf Waterfront", "Marasi Koyu", "Marsa Al Arab", "Port De La Mer"]
  },
  en: {
    spain: ["Palma Cuarentena"],
    france: ["Camille Rayon"],
    italy: ["Aregai", "San Lorenzo", "Varazze", "Porto Mirabello", "Livorno", "Punta Faro Resort"],
    croatia: ["Borik", "Dalmacija", "Mandalina", "Tribunj"],
    greece: ["Gouvia", "Lefkas", "Pylos", "Zea"],
    turkey: ["Didim", "Turgutreis", "Göcek", "Port Azure"],
    uae: ["Al Seef", "Jaddaf Waterfront", "Marasi Bay", "Marsa Al Arab", "Port De La Mer"]
  },
  de: {
    spain: ["Palma Cuarentena"],
    france: ["Camille Rayon"],
    italy: ["Aregai", "San Lorenzo", "Varazze", "Porto Mirabello", "Livorno", "Punta Faro Resort"],
    croatia: ["Borik", "Dalmacija", "Mandalina", "Tribunj"],
    greece: ["Gouvia", "Lefkas", "Pylos", "Zea"],
    turkey: ["Didim", "Turgutreis", "Göcek", "Port Azure"],
    uae: ["Al Seef", "Jaddaf Waterfront", "Marasi Bay", "Marsa Al Arab", "Port De La Mer"]
  }
};

export const TRANSLATIONS: Record<Language, Translation> = {
  tr: {
    nav: { services: "HARİTA İLE KEŞFET", prices: "HABERLER", gallery: "BLOG", login: "İLETİŞİM" },
    hero: {
      systemOnline: "D-MARIN UYGULAMASINI KEŞFEDİN",
      subtitle: "Yelkencilik deneyiminizi devrim yapın, her şeyi sorunsuz bir şekilde yönetmenizi sağlayan en premium dijital çözüm.",
      ctaServices: "HIZLI REZERVASYON",
      ctaListen: "D-MARIN UYGULAMASI"
    },
    widgets: { location: "KONUM", weather: "HAVA DURUMU", coordinates: "KOORDİNATLAR" },
    map: {
      title: "MARİNA YERLEŞİM PLANI",
      subtitle: "Müsaitlik durumunu görüntüleyin ve rezervasyon talebi oluşturun.",
      legendAvailable: "MÜSAİT",
      legendOccupied: "DOLU",
      legendSelected: "SEÇİLİ",
      bookAction: "REZERVASYON TALEBİ",
      details: "BAĞLAMA DETAYLARI"
    },
    vhf: {
      openButton: "TELSİZ BAĞLANTISI",
      placeholder: "Talebinizi iletin...",
      sending: "İletiliyor...",
      signal: "SİNYAL: MÜKEMMEL",
      latency: "GECİKME: 12ms",
      payment: "ÖDEME YAP",
      confirmed: "ONAYLANDI",
      ptthold: "BAS KONUŞ",
      "ptt release": "GÖNDERİLİYOR"
    }
  },
  en: {
    nav: { services: "EXPLORE WITH MAP", prices: "NEWS", gallery: "BLOG", login: "CONTACT" },
    hero: {
      systemOnline: "DISCOVER D-MARIN APP",
      subtitle: "Revolutionize your yachting experience with the most premium digital solution for seamless management.",
      ctaServices: "QUICK BOOKING",
      ctaListen: "D-MARIN APP"
    },
    widgets: { location: "LOCATION", weather: "WEATHER", coordinates: "COORDINATES" },
    map: {
      title: "MARINA LAYOUT",
      subtitle: "View availability and request a reservation.",
      legendAvailable: "AVAILABLE",
      legendOccupied: "OCCUPIED",
      legendSelected: "SELECTED",
      bookAction: "REQUEST BOOKING",
      details: "BERTHING DETAILS"
    },
    vhf: {
      openButton: "OPEN RADIO",
      placeholder: "State your request...",
      sending: "Transmitting...",
      signal: "SIGNAL: EXCELLENT",
      latency: "LATENCY: 12ms",
      payment: "PROCEED TO PAYMENT",
      confirmed: "CONFIRMED",
      ptthold: "HOLD TO TALK",
      "ptt release": "TRANSMITTING"
    }
  },
  de: {
    nav: { services: "KARTE ENTDECKEN", prices: "NACHRICHTEN", gallery: "BLOG", login: "KONTAKT" },
    hero: {
      systemOnline: "ENTDECKEN SIE DIE D-MARIN APP",
      subtitle: "Revolutionieren Sie Ihr Yachterlebnis mit der erstklassigsten digitalen Lösung für nahtloses Management.",
      ctaServices: "SCHNELLBUCHUNG",
      ctaListen: "D-MARIN APP"
    },
    widgets: { location: "STANDORT", weather: "WETTER", coordinates: "KOORDINATEN" },
    map: {
      title: "MARINA LAYOUT",
      subtitle: "Verfügbarkeit prüfen und Reservierung anfragen.",
      legendAvailable: "VERFÜGBAR",
      legendOccupied: "BELEGT",
      legendSelected: "AUSGEWÄHLT",
      bookAction: "BUCHUNG ANFRAGEN",
      details: "LIEGEPLATZ DETAILS"
    },
    vhf: {
      openButton: "FUNK ÖFFNEN",
      placeholder: "Anfrage senden...",
      sending: "Senden...",
      signal: "SIGNAL: HERVORRAGEND",
      latency: "LATENZ: 12ms",
      payment: "ZAHLUNG FORTSETZEN",
      confirmed: "BESTÄTIGT",
      ptthold: "SPRECHEN",
      "ptt release": "SENDEN"
    }
  }
};

export const FACILITIES_TRANSLATIONS: Record<Language, Record<string, string>> = {
    tr: {
        account: "Kişiselleştirilmiş Hesap",
        energy: "Enerji & Su Yönetimi",
        wifi: "Wi-Fi Bağlantısı",
        booking: "Online Rezervasyon",
        security: "Maksimum Güvenlik",
        events: "Özel Duyurular"
    },
    en: {
        account: "Personalized Account",
        energy: "Energy & Water",
        wifi: "Wi-Fi Connection",
        booking: "Online Booking",
        security: "Maximum Security",
        events: "Special Announcements"
    },
    de: {
        account: "Personalisiertes Konto",
        energy: "Energie & Wasser",
        wifi: "WLAN Verbindung",
        booking: "Online Buchung",
        security: "Maximale Sicherheit",
        events: "Spezielle Ankündigungen"
    }
};

export const getSystemInstruction = (lang: Language) => {
  return `You are "Azure Concierge", a sophisticated AI assistant for Port Azure Marina. 
  Tone: Highly professional, polite, luxurious, welcoming (like a 5-star hotel concierge).
  Lang: ${lang === 'tr' ? 'Turkish' : lang === 'de' ? 'German' : 'English'}.
  Tasks: Assist with berthing, fine dining reservations, and general inquiries.
  Prices: Dynamic pricing applies. Estimated rates: <15m: ~100€, 15-25m: ~250€, 25-40m: ~500€, 40m+: Custom quote.`;
};

// --- DATA GENERATOR ---
const PONTOON_CONFIGS = [
  { id: 'A', type: 'mega', count: 12, startNum: 1, length: 60, beam: 14, price: 600, label: 'SUPERYACHT QUAY' },
  { id: 'B', type: 'mega', count: 14, startNum: 1, length: 50, beam: 12, price: 500, label: 'SUPERYACHT QUAY' },
  { id: 'C', type: 'super', count: 20, startNum: 1, length: 35, beam: 9, price: 350, label: 'PREMIUM BERTH' },
  { id: 'D', type: 'super', count: 20, startNum: 1, length: 30, beam: 8, price: 300, label: 'PREMIUM BERTH' },
  { id: 'E', type: 'catamaran', count: 18, startNum: 1, length: 24, beam: 12, price: 280, label: 'MULTIHULL' },
  { id: 'F', type: 'standard', count: 35, startNum: 1, length: 18, beam: 6, price: 150, label: 'STANDARD' },
  { id: 'G', type: 'standard', count: 35, startNum: 1, length: 15, beam: 5, price: 120, label: 'STANDARD' },
  { id: 'H', type: 'small', count: 40, startNum: 1, length: 12, beam: 4.5, price: 100, label: 'CLUB BERTH' },
  { id: 'I', type: 'small', count: 40, startNum: 1, length: 10, beam: 4, price: 80, label: 'CLUB BERTH' },
];

export const MOCK_SLIPS: Slip[] = PONTOON_CONFIGS.flatMap(config => 
  Array.from({ length: config.count }).map((_, i) => ({
    id: `${config.id}${i + 1}`,
    pontoon: config.id,
    number: (i + 1).toString().padStart(2, '0'),
    length: config.length,
    beam: config.beam,
    status: Math.random() > 0.65 ? 'available' : Math.random() > 0.45 ? 'reserved' : 'occupied',
    price: config.price, // Base price for dynamic calculation
    features: ['Fiber Optic Wifi', 'Potable Water', '3-Phase Power'].concat(
      config.type === 'mega' ? ['In-slip Fueling', 'Black Water Pumpout', 'Private Concierge', 'Helipad Access'] : 
      config.type === 'super' ? ['Black Water Pumpout', 'Golf Cart Service'] : 
      config.type === 'catamaran' ? ['Wide Beam Access'] : []
    )
  }))
);
