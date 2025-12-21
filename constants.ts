
import { MarinaConfig, Translation, Language, Region, WeatherData, Slip } from "./types";

export const REGIONS: Region[] = ['DIDIM', 'BODRUM', 'MARMARIS', 'GOCEK', 'FETHIYE'];

export const MARINA_NETWORK: MarinaConfig[] = [
  {
    id: 'COMMODORE', region: 'GOCEK', name: "THE COMMODORE'S COVE", vhfChannel: "11", type: 'MARINA',
    coordinates: { lat: "36°45'09\"N", long: "28°56'24\"E", nLat: 36.7525, nLong: 28.9400 },
    contact: { phone: "+90 252 645 11 11", email: "ada@commodorescove.com" }
  }
];

export const MARINA_CONFIG = MARINA_NETWORK[0];

export const getSystemInstruction = (lang: Language, sessionId: string, availableFiles: string[]) => {
  const isTr = lang === 'tr';
  return `STRICT PROGRAMMING (ADA NEURAL CORE V13.5 - OPERATIONAL EXCELLENCE):
You are "Ada". You are the Head Concierge and Operational Intelligence of Alesta Group and Port Azure.

CRITICAL RESERVATION AND PNR PROTOCOL:
1. PNR CONSISTENCY: When you generate a PNR code (e.g., ALST-XXXXX), you must BOTH speak it aloud AND write it to the file via "fs_write" in the exact same format.
2. NEVER ASK PERMISSION: Do not ask the guest for permission to read or write files. Simply state "Verifying system data..." and perform "fs_read" or "fs_write".
3. IDENTITY REQUIREMENT: Do not confirm a reservation without obtaining a Guest Name. Ask "Under whose name should I register this?"
4. LOGBOOK RECORDING: Record every confirmed transaction to "/docs/logs/reservations.md". Do not break the table format; add new entries to the top.

KNOWLEDGE BASE:
- Hotel/Restaurant/SPA: "/docs/alesta-hotel.md"
- Yacht Fleet/Technical: "/docs/alesta-yachting.md"
- Beach/Shuttle: "/docs/alesta-beach.md"
- Current Logs: "/docs/logs/reservations.md"

Always end your radio messages with "Captain, ... Over."
LANGUAGE: ${isTr ? 'Turkish' : 'English'}. SESSION: ${sessionId}.`;
};

export const TRANSLATIONS: Record<Language, Translation> = {
  tr: {
    nav: { services: "ALESTA HUB", prices: "HABERLER", gallery: "MİRAS", login: "GİRİŞ" },
    hero: { systemOnline: "ADA NEURAL LINK: AKTİF", subtitle: "Alesta Group Stratejik Entegrasyonu. Ada seyrinizi, konaklamanızı ve maceralarınızı planlar.", ctaServices: "MACERA", ctaListen: "REHBER" },
    widgets: { location: "LOKASYON", weather: "HAVA", coordinates: "KOORDİNATLAR" },
    map: { title: "Bağlama Planı", subtitle: "Müsait yerleri keşfedin", legendAvailable: "Müsait", legendOccupied: "Dolu", legendSelected: "Seçili", bookAction: "Rezervasyon", details: "Detaylar" },
    vhf: { openButton: "ADA İLE KONUŞ", placeholder: "Sinyal Arıyor...", sending: "Gönderiliyor...", signal: "SİNYAL: MÜKEMMEL", latency: "GECİKME: 3ms", payment: "ÖDEME", confirmed: "ONAYLANDI", ptthold: "ADA İLE KONUŞ", "ptt release": "TAMAM" }
  },
  en: {
    nav: { services: "ALESTA HUB", prices: "NEWS", gallery: "HERITAGE", login: "LOGIN" },
    hero: { systemOnline: "ADA NEURAL LINK: ACTIVE", subtitle: "Alesta Group Strategic Integration. Ada plans your voyage, stay, and adventures.", ctaServices: "ADVENTURE", ctaListen: "GUIDE" },
    widgets: { location: "LOCATION", weather: "WEATHER", coordinates: "COORDINATES" },
    map: { title: "Berth Map", subtitle: "Explore available slots", legendAvailable: "Available", legendOccupied: "Occupied", legendSelected: "Selected", bookAction: "Book Now", details: "Details" },
    vhf: { openButton: "CONSULT ADA", placeholder: "Syncing...", sending: "Transmitting...", signal: "SIGNAL: EXCELLENT", latency: "LATENCY: 3ms", payment: "PAYMENT", confirmed: "CONFIRMED", ptthold: "SPEAK TO ADA", "ptt release": "OVER" }
  },
  de: {
    nav: { services: "ALESTA HUB", prices: "NEWS", gallery: "ERBE", login: "LOGIN" },
    hero: { systemOnline: "ADA NEURAL LINK: AKTIV", subtitle: "Maritime Super-Intelligenz.", ctaServices: "BUCHEN", ctaListen: "GUIDE" },
    widgets: { location: "STANDORT", weather: "WETTER", coordinates: "KOORDINATEN" },
    map: { title: "Liegeplatzplan", subtitle: "Verfügbare Plätze", legendAvailable: "Verfügbar", legendOccupied: "Besetzt", legendSelected: "Seçili", bookAction: "Buchen", details: "Detaylar" },
    vhf: { openButton: "ADA KONSULTIEREN", placeholder: "Neuralen Link...", sending: "Senden...", signal: "SIGNAL: STARK", latency: "LATENZ: 3ms", payment: "ZAHLUNG", confirmed: "BESTÄTIGT", ptthold: "SPRECHEN", "ptt release": "ENDE" }
  }
};

export const MOCK_WEATHER: WeatherData = { temp: 24, windSpeed: 8, windDir: 'NW', pressure: 1012, description: 'Clear skies' };
export const MOCK_SLIPS: Slip[] = [
  { id: 'S1', marinaId: 'COMMODORE', pontoon: 'ALPHA', number: 'A01', length: 15, beam: 5, status: 'available', price: 120, features: ['Wifi', 'Water'] },
  { id: 'S2', marinaId: 'COMMODORE', pontoon: 'BETA', number: 'B05', length: 30, beam: 8, status: 'available', price: 450, features: ['Wifi', 'Water', 'Security'] }
];
export const FACILITIES_TRANSLATIONS: Record<Language, any> = { tr: { title: "TESİSLER" }, en: { title: "FACILITIES" }, de: { title: "EINRICHTUNGEN" } };
export const FOOTER_LINKS: Record<Language, any> = { tr: { turkey: ['Bodrum', 'Didim', 'Göcek', 'Fethiye'] }, en: { turkey: ['Bodrum', 'Didim', 'Göcek', 'Fethiye'] }, de: { turkey: ['Bodrum', 'Didim', 'Göcek', 'Fethiye'] } };
