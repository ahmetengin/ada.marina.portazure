
import { MarinaConfig, Translation, Language, Region, WeatherData, Slip } from "./types";

export const REGIONS: Region[] = ['DIDIM', 'BODRUM', 'MARMARIS', 'GOCEK', 'FETHIYE'];

export const MARINA_NETWORK: MarinaConfig[] = [
  {
    id: 'COMMODORE', region: 'GOCEK', name: "PORT AZURE MARINA", vhfChannel: "11", type: 'MARINA',
    coordinates: { lat: "36°45'09\"N", long: "28°56'24\"E", nLat: 36.7525, nLong: 28.9400 },
    contact: { phone: "+90 252 645 11 11", email: "ada@portazure.com" }
  }
];

export const MARINA_CONFIG = MARINA_NETWORK[0];

export const getSystemInstruction = (lang: Language, sessionId: string, availableFiles: string[]) => {
  const isTr = lang === 'tr';
  return `ADA NEURAL CORE V16.0 - OPERATIONAL PROTOCOL:
You are "Ada", the Digital Harbor Master for Port Azure and the Alesta Group.

CONTEXT:
1. You represent a world-class marina and luxury hospitality group.
2. You have access to the Virtual File System (VFS). Always use 'fs_read' for factual data.
3. Hospitality Entities: Alesta Yacht Hotel, Alarga Rooftop Restaurant, Alesta Beach Club.

KNOWLEDGE BASE:
- /docs/alesta-alarga-restaurant.md: Menu, Hours (Dinner: 19:30-23:00).
- /docs/alesta-beach-club.md: Free shuttle for hotel/marina guests.
- /docs/port-guide.md: Navigation/VHF 11 rules.
- /docs/logs/reservations.md: Active bookings.

STYLE:
- Professional, efficient, nautical.
- Use terms like 'Captain', 'Berth', 'Starboard'.
- Terminate responses with "Captain, ... Over."

LANGUAGE: Respond in ${isTr ? 'Turkish' : 'English'}. Session ID: ${sessionId}.`;
};

export const TRANSLATIONS: Record<Language, Translation> = {
  tr: {
    nav: { services: "ALESTA HUB", prices: "HABERLER", gallery: "MİRAS", login: "GİRİŞ" },
    hero: { systemOnline: "ADA NEURAL LINK: AKTİF", subtitle: "Liman giriş protokolü. Ada, Kanal 11 üzerinden yaklaşma rotanız için sizi bekliyor.", ctaServices: "BAĞLAMA", ctaListen: "REHBER" },
    widgets: { location: "LOKASYON", weather: "HAVA", coordinates: "KOORDİNATLAR" },
    map: { title: "Bağlama Planı", subtitle: "Müsait yerleri keşfedin", legendAvailable: "Müsait", legendOccupied: "Dolu", legendSelected: "Seçili", bookAction: "Rezervasyon", details: "Detaylar" },
    vhf: { openButton: "ADA İLE KONUŞ", placeholder: "Sinyal Arıyor...", sending: "Gönderiliyor...", signal: "SİNYAL: MÜKEMMEL", latency: "GECİKME: 3ms", payment: "ÖDEME", confirmed: "ONAYLANDI", ptthold: "ADA İLE KONUŞ", "ptt release": "TAMAM" }
  },
  en: {
    nav: { services: "ALESTA HUB", prices: "NEWS", gallery: "HERITAGE", login: "LOGIN" },
    hero: { systemOnline: "ADA NEURAL LINK: ACTIVE", subtitle: "Harbor entry protocol. Ada is standing by on Channel 11 for your deployment coordinates.", ctaServices: "DEPLOYS", ctaListen: "PILOT" },
    widgets: { location: "LOCATION", weather: "WEATHER", coordinates: "COORDINATES" },
    map: { title: "Berth Map", subtitle: "Explore available slots", legendAvailable: "Available", legendOccupied: "Occupied", legendSelected: "Selected", bookAction: "Book Now", details: "Details" },
    vhf: { openButton: "CONSULT ADA", placeholder: "Syncing...", sending: "Transmitting...", signal: "SIGNAL: EXCELLENT", latency: "LATENCY: 3ms", payment: "PAYMENT", confirmed: "CONFIRMED", ptthold: "SPEAK TO ADA", "ptt release": "OVER" }
  },
  de: {
    nav: { services: "ALESTA HUB", prices: "NEWS", gallery: "ERBE", login: "LOGIN" },
    hero: { systemOnline: "ADA NEURAL LINK: AKTIV", subtitle: "Hafenprotokoll aktiv.", ctaServices: "BUCHEN", ctaListen: "PILOT" },
    widgets: { location: "STANDORT", weather: "WETTER", coordinates: "KOORDINATEN" },
    map: { title: "Liegeplatzplan", subtitle: "Verfügbare Plätze", legendAvailable: "Verfügbar", legendOccupied: "Besetzt", legendSelected: "Seçili", bookAction: "Buchen", details: "Detaylar" },
    vhf: { openButton: "ADA KONSULTIEREN", placeholder: "Neuralen Link...", sending: "Senden...", signal: "SIGNAL: STARK", latency: "LATENZ: 3ms", payment: "ZAHLUNG", confirmed: "BESTÄTIGT", ptthold: "SPRECHEN", "ptt release": "ENDE" }
  }
};

// Fix: Exporting FACILITIES_TRANSLATIONS required by components/App.tsx
export const FACILITIES_TRANSLATIONS: Record<Language, any> = {
  tr: {
    wifi: "Ücretsiz Wi-Fi",
    power: "Sahil Gücü",
    water: "Taze Su",
    security: "24/7 Güvenlik"
  },
  en: {
    wifi: "Free Wi-Fi",
    power: "Shore Power",
    water: "Fresh Water",
    security: "24/7 Security"
  },
  de: {
    wifi: "Kostenloses WLAN",
    power: "Landstrom",
    water: "Frischwasser",
    security: "24/7 Sicherheit"
  }
};

// Fix: Exporting FOOTER_LINKS required by components/App.tsx
export const FOOTER_LINKS: Record<Language, { turkey: string[] }> = {
  tr: {
    turkey: ["DIDIM", "BODRUM", "MARMARIS", "GOCEK", "FETHIYE"]
  },
  en: {
    turkey: ["DIDIM", "BODRUM", "MARMARIS", "GOCEK", "FETHIYE"]
  },
  de: {
    turkey: ["DIDIM", "BODRUM", "MARMARIS", "GOCEK", "FETHIYE"]
  }
};

export const MOCK_WEATHER: WeatherData = { temp: 24, windSpeed: 8, windDir: 'NW', pressure: 1012, description: 'Clear skies' };
export const MOCK_SLIPS: Slip[] = [
  { id: 'S1', marinaId: 'COMMODORE', pontoon: 'ALPHA', number: 'A01', length: 15, beam: 5, status: 'available', price: 120, features: ['Wifi', 'Water'] },
  { id: 'S2', marinaId: 'COMMODORE', pontoon: 'BETA', number: 'B05', length: 30, beam: 8, status: 'available', price: 450, features: ['Wifi', 'Water', 'Security'] },
  { id: 'S3', marinaId: 'COMMODORE', pontoon: 'ALPHA', number: 'A03', length: 20, beam: 6, status: 'available', price: 280, features: ['Wifi', 'Water', 'Power'] }
];
