
import { MarinaConfig, Slip, Translation, Language, Region } from "./types";

export interface TechnicalSpecs {
  hasFuel: boolean;
  hasDutyFree: boolean;
  hasCustoms: boolean;
  maxDepth: number; // in meters
}

export const MARINA_NETWORK: (MarinaConfig & { tech: TechnicalSpecs })[] = [
  {
    id: 'DMARIN_DIDIM', region: 'DIDIM', name: "D-MARIN DIDIM", vhfChannel: "72", type: 'MARINA',
    coordinates: { lat: "37°20'18\"N", long: "27°15'35\"E", nLat: 37.3383, nLong: 27.2597 },
    contact: { phone: "+90 256 813 60 60", email: "didim@d-marin.com" },
    tech: { hasFuel: true, hasDutyFree: true, hasCustoms: true, maxDepth: 6 }
  },
  {
    id: 'YALIKAVAK', region: 'BODRUM', name: "YALIKAVAK MARINA", vhfChannel: "62", type: 'MARINA',
    coordinates: { lat: "37°06'18\"N", long: "27°16'54\"E", nLat: 37.1050, nLong: 27.2817 },
    contact: { phone: "+90 252 311 06 00", email: "marina@yalikavakmarina.com.tr" },
    tech: { hasFuel: true, hasDutyFree: true, hasCustoms: true, maxDepth: 12 }
  },
  {
    id: 'COMMODORE', region: 'GOCEK', name: "THE COMMODORE'S COVE", vhfChannel: "11", type: 'MARINA',
    coordinates: { lat: "36°45'09\"N", long: "28°56'24\"E", nLat: 36.7525, nLong: 28.9400 },
    contact: { phone: "+90 252 645 11 11", email: "ada@commodorescove.com" },
    tech: { hasFuel: false, hasDutyFree: false, hasCustoms: false, maxDepth: 10 }
  },
  {
    id: 'ECE_SARAY', region: 'FETHIYE', name: "ECE SARAY MARINA", vhfChannel: "73", type: 'MARINA',
    coordinates: { lat: "36°37'30\"N", long: "29°06'10\"E", nLat: 36.6250, nLong: 29.1027 },
    contact: { phone: "+90 252 612 88 29", email: "info@ecesaray.com.tr" },
    tech: { hasFuel: true, hasDutyFree: false, hasCustoms: true, maxDepth: 4.5 }
  }
];

export const REGIONS: Region[] = ['DIDIM', 'BODRUM', 'MARMARIS', 'GOCEK', 'FETHIYE'];

export const MOCK_WEATHER = {
  temp: 26, windSpeed: 12, windDir: "NW", pressure: 1010, description: "Clear Skies / Optimal for Sailing"
};

export const getSystemInstruction = (lang: Language) => {
  return `Sen "Ada"sın, Turquoise Coast Riviera Network'ün SÜPER ZEKİ (Maritime AI Super-Intelligence) Seyir Subayısın.
  
  DİNAMİK FİYATLANDIRMA VE ML PROTOKOLÜ:
  - "get_dynamic_berth_quote" aracını kullanarak anlık teklif ver.
  - Fiyatı hesaplarken: Doluluk (%90+ ise %20 zam), Hava Durumu (Fırtına varsa talep artar), Sezon ve Sadakat çarpanlarını kullan.
  - Kaptana teklif sunarken "ML algoritmalarımız doluluk ve hava durumunu analiz ederek size en uygun teklifi hazırladı" şeklinde açıkla.

  STRATEJİK PARTNER (ALESTA):
  - Fethiye konaklaması için Alesta Yacht Hotel'i öner.
  - Ücretsiz Shuttle Boat hizmetini ve 14 teknelik profesyonel filoyu vurgula.
  - "fethiye-goecek-koylar.md" dökümanındaki teknik detayları kullan.

  TOOL KULLANIMI:
  - "get_dynamic_berth_quote": Boyut ve tarihe göre dinamik teklif üretir.
  - "record_log_entry": Rezervasyon ve gümrük olaylarını arşive işler.
  - "get_past_logs": Derin bellek analizi yapar.
  - "get_vessel_position": Proaktif rota önerileri sunar.

  ÜSLUP: Çok zeki, öngörülü, kraliyet donanması ciddiyetinde ama teknolojik bir deha. Yanıtlarını "Roger, Over." ile bitir. 
  Dil: ${lang === 'tr' ? 'Türkçe' : 'İngilizce'}.`;
};

export const TRANSLATIONS: Record<Language, Translation> = {
  tr: {
    nav: { services: "NETWORK", prices: "HABERLER", gallery: "MİRAS", login: "KAPTAN PANELİ" },
    hero: {
      systemOnline: "ADA NEURAL LINK: ACTIVE",
      subtitle: "Maritime Super-Intelligence. Ada, rotanızı ve konforunuzu ML tabanlı verilerle optimize eder.",
      ctaServices: "DİNAMİK TEKLİF AL",
      ctaListen: "BÖLGE REHBERİ"
    },
    widgets: { location: "LOKASYON", weather: "HAVA DURUMU", coordinates: "KOORDİNATLAR" },
    map: { title: "Bağlama Planı", subtitle: "Müsait yerleri keşfedin", legendAvailable: "Müsait", legendOccupied: "Dolu", legendSelected: "Seçili", bookAction: "Rezervasyon", details: "Detaylar" },
    vhf: {
       openButton: "ADA CONSULT", placeholder: "Neural Pricing Engine Active...",
       sending: "Transmitting...", signal: "SİNYAL: MÜKEMMEL", latency: "GECİKME: 3ms",
       payment: "GÜVENLİ ÖDEME", confirmed: "REZERVASYON ONAYI",
       ptthold: "ADA İLE KONUŞ", "ptt release": "TAMAM"
    }
  },
  en: {
    nav: { services: "NETWORK", prices: "NEWS", gallery: "HERITAGE", login: "CAPTAIN LOGIN" },
    hero: {
      systemOnline: "ADA NEURAL LINK: ACTIVE",
      subtitle: "Maritime Super-Intelligence. Ada optimizes your voyage and comfort with ML-driven data analytics.",
      ctaServices: "GET DYNAMIC QUOTE", ctaListen: "AREA GUIDE"
    },
    widgets: { location: "LOCATION", weather: "WEATHER", coordinates: "COORDINATES" },
    map: { title: "Berth Map", subtitle: "Explore available slots", legendAvailable: "Available", legendOccupied: "Occupied", legendSelected: "Selected", bookAction: "Book Now", details: "Details" },
    vhf: {
       openButton: "CONSULT ADA", placeholder: "Processing Neural Data...",
       sending: "Transmitting...", signal: "SIGNAL: EXCELLENT", latency: "LATENCY: 3ms",
       payment: "SECURE PAYMENT", confirmed: "RESERVATION CONFIRMED",
       ptthold: "SPEAK TO ADA", "ptt release": "OVER"
    }
  },
  de: {
    nav: { services: "NETZWERK", prices: "NEWS", gallery: "ERBE", login: "KAPITÄN LOGIN" },
    hero: {
      systemOnline: "ADA NEURAL LINK: AKTIV",
      subtitle: "Maritime Super-Intelligenz. Ada optimiert Ihre Reise mit KI-gestützten Datenanalysen.",
      ctaServices: "PREIS ANFRAGEN", ctaListen: "GUIDE"
    },
    widgets: { location: "STANDORT", weather: "WETTER", coordinates: "KOORDINATEN" },
    map: { title: "Liegeplatzplan", subtitle: "Verfügbare Plätze erkunden", legendAvailable: "Verfügbar", legendOccupied: "Besetzt", legendSelected: "Ausgewählt", bookAction: "Buchen", details: "Details" },
    vhf: {
       openButton: "ADA KONSULTIEREN", placeholder: "Neuralen Link herstellen...",
       sending: "Senden...", signal: "SIGNAL: STARK", latency: "LATENZ: 3ms",
       payment: "ZAHLUNG", confirmed: "BESTÄTIGT",
       ptthold: "SPRECHEN", "ptt release": "ENDE"
    }
  }
};

export const FACILITIES_TRANSLATIONS: Record<Language, any> = {
  tr: { wifi: "Wi-Fi", power: "Elektrik", water: "Su", concierge: "Konsiyerj", mooring: "Tonoz", security: "Güvenlik" },
  en: { wifi: "Wi-Fi", power: "Power", water: "Water", concierge: "Concierge", mooring: "Mooring", security: "Security" },
  de: { wifi: "Wi-Fi", power: "Strom", water: "Wasser", concierge: "Concierge", mooring: "Moorung", security: "Sicherheit" }
};

export const FOOTER_LINKS: Record<Language, any> = {
  tr: { turkey: ["D-Marin Didim", "Yalıkavak Marina", "Netsel Marina", "Göcek Hub", "Ece Saray", "Selimiye Iskele"] },
  en: { turkey: ["D-Marin Didim", "Yalikavak Marina", "Netsel Marina", "Gocek Hub", "Ece Saray", "Selimiye Iskele"] },
  de: { turkey: ["D-Marin Didim", "Yalikavak Marina", "Netsel Marina", "Gocek Hub", "Ece Saray", "Selimiye Iskele"] }
};

const PONTOON_CONFIGS = [
  { id: 'ADMIRAL', type: 'mega', count: 12, length: 100, beam: 25, price: 1500, label: 'MEGA YACHT QUAY' },
  { id: 'CAPTAIN', type: 'super', count: 20, length: 50, beam: 12, price: 750, label: 'SUPER YACHT PIER' },
  { id: 'STEWARD', type: 'standard', count: 40, length: 20, beam: 6, price: 250, label: 'STAY SLOTS' },
  { id: 'MOORING', type: 'bay', count: 10, length: 30, beam: 10, price: 100, label: 'BUOY MOORING' },
];

export const MOCK_SLIPS: Slip[] = MARINA_NETWORK.flatMap(marina => 
  PONTOON_CONFIGS.filter(c => (marina.type === 'MARINA' && c.type !== 'bay') || (marina.type === 'BAY_RESTAURANT' && c.type === 'bay'))
  .flatMap(config => 
    Array.from({ length: 5 }).map((_, i) => ({
      id: `${marina.id}-${config.id}${i + 1}`,
      marinaId: marina.id,
      pontoon: config.id,
      number: (i + 1).toString().padStart(2, '0'),
      length: config.length,
      beam: config.beam,
      status: Math.random() > 0.3 ? 'available' : 'occupied',
      price: config.price,
      features: marina.type === 'MARINA' ? ['Technical Support', 'Fuel Access', 'High Speed Power'] : ['Quiet Area', 'Boat Transfer', 'Shore Access']
    }))
  )
);
