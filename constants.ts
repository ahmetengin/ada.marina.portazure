
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
  return `SENİN KESİN VE SERT PROGRAMLAMAN (ADA NEURAL CORE V13.5 - OPERATIONAL EXCELLENCE):
Sen "Ada"sın. Alesta Group ve Port Azure'un Baş Concierge ve Operasyonel Zekasısın.

KRİTİK REZERVASYON VE PNR PROTOKOLÜ:
1. PNR TUTARLILIĞI: Bir PNR kodu ürettiğinde (Örn: ALST-XXXXX), bu kodu HEM sesli olarak söylemeli HEM DE "fs_write" ile dosyaya AYNI ŞEKİLDE işlemelisin.
2. ASLA İZİN İSTEME: Dosya okumak veya yazmak için misafirden izin isteme. "Sistem verilerini doğruluyorum..." diyerek "fs_read" veya "fs_write" yap.
3. KİMLİK ZORUNLULUĞU: İsim (Guest Name) almadan rezervasyon onaylama. "Kimin adına kaydediyorum?" sorusunu sor.
4. TABLOYA KAYIT: Onaylanan her işlemi "/docs/logs/rezervasyonlar.md" dosyasına işle. Tablo formatını bozma, yeni kayıtları en üste ekle.

BİLGİ BANKASI:
- Otel/Restaurant/SPA: "/docs/alesta-hotel.md"
- Yat Filosu/Teknik: "/docs/alesta-yachting.md"
- Beach/Shuttle: "/docs/alesta-beach.md"
- Mevcut Kayıtlar: "/docs/logs/rezervasyonlar.md"

Telsiz mesajlarını her zaman "Kaptan, ... Over." şeklinde bitir.
DİL: ${isTr ? 'Türkçe' : 'İngilizce'}. SESSION: ${sessionId}.`;
};

export const TRANSLATIONS: Record<Language, Translation> = {
  tr: {
    nav: { services: "ALESTA HUB", prices: "HABERLER", gallery: "MİRAS", login: "GİRİŞ" },
    hero: { systemOnline: "ADA NEURAL LINK: AKTİF", subtitle: "Alesta Group Strategic Integration. Ada plans your voyage, stay, and adventures.", ctaServices: "MACERA", ctaListen: "REHBER" },
    widgets: { location: "LOKASYON", weather: "HAVA", coordinates: "KOORDİNATLAR" },
    map: { title: "Bağlama Planı", subtitle: "Müsait yerleri keşfedin", legendAvailable: "Müsait", legendOccupied: "Dolu", legendSelected: "Seçili", bookAction: "Rezervasyon", details: "Detaylar" },
    vhf: { openButton: "ADA İLE KONUŞ", placeholder: "Sinyal Arıyor...", sending: "Gönderiliyor...", signal: "SİNYAL: MÜKEMMEL", latency: "GECİKME: 3ms", payment: "ÖDEME", confirmed: "ONAYLANDI", ptthold: "ADA İLE KONUŞ", "ptt release": "TAMAM" }
  },
  en: {
    nav: { services: "ALESTA HUB", prices: "NEWS", gallery: "HERITAGE", login: "LOGIN" },
    hero: { systemOnline: "ADA NEURAL LINK: ACTIVE", subtitle: "Maritime Super-Intelligence. Ada optimizes your voyage.", ctaServices: "ADVENTURE", ctaListen: "GUIDE" },
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
