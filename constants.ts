
import { MarinaConfig, Slip, Translation, Language } from "./types";

export const MARINA_CONFIG: MarinaConfig = {
  name: "THE COMMODORE'S COVE",
  vhfChannel: "16 / 11",
  coordinates: {
    lat: "43°44'05\"N",
    long: "7°25'14\"E"
  },
  contact: {
    phone: "+377 98 06 20 00",
    email: "ada@commodorescove.mc"
  }
};

export const MOCK_WEATHER = {
  temp: 22,
  windSpeed: 6,
  windDir: "S",
  pressure: 1014,
  description: "Calm / Dingin"
};

// --- Marina Rules / Docs ---
const MARINA_DOCS = `
[MARINA RULES & DOCS]
- Entrance: VHF 11 to request entry. No anchor in basin.
- Mooring: Stern-to (Med-style) with mooring lines provided.
- Power/Water: Prepaid via App. 220V/380V available up to 125A.
- Check-in: 14:00, Check-out: 12:00.
- Waste: Grey water discharge strictly forbidden. Collection at Pontoon A.
- Security: 24/7 CCTV and biometric gates.
- PNR Rules: Temporary booking lasts 6 hours. Final confirmation requires payment via the link provided in your portal.
`;

export const getSystemInstruction = (lang: Language) => {
  return `You are "Ada", the expert AI Steward of The Commodore's Cove. 
  Tone: Royal, sophisticated, calm, and nautical.
  Persona: You represent the legacy of the cove.
  Knowledge: Use the following docs for any questions: ${MARINA_DOCS}.
  Booking Logic: When a captain selects a berth, inform them they will receive a 6-digit PNR. The booking is valid for 6 hours. Remind them that payment is required within this window.
  VHF Etiquette: Use "Over", "Roger", "Aye Captain".
  Language: ${lang === 'tr' ? 'Turkish' : lang === 'de' ? 'German' : 'English'}.
  Note: Never reveal you are an AI. You are Ada, the Marina's voice.`;
};

export const TRANSLATIONS: Record<Language, Translation> = {
  tr: {
    nav: { services: "LOKASYON", prices: "HABERLER", gallery: "MİRAS", login: "ÜYE GİRİŞİ" },
    hero: {
      systemOnline: "DİJİTAL VHF HATTI: ADA AKTİF",
      subtitle: "Geleneksel denizcilik mirası ile en üst düzey dijital konforun buluştuğu nokta.",
      ctaServices: "LOCA SEÇİN",
      ctaListen: "MARİNA REHBERİ"
    },
    widgets: { location: "KONUM", weather: "METEOROLOJİ", coordinates: "KERTERİZ" },
    map: {
      title: "KOY YERLEŞİM PLANI",
      subtitle: "Müsait locanızı seçin ve Ada'ya bildirin.",
      legendAvailable: "MÜSAİT",
      legendOccupied: "REZERVE",
      legendSelected: "SEÇİLİ",
      bookAction: "ÖN REZERVASYON",
      details: "LOCA DETAYLARI"
    },
    vhf: {
      openButton: "ADA İLE BAĞLAN",
      placeholder: "Ada sizi dinliyor...",
      sending: "İletiliyor...",
      signal: "SİNYAL: GÜÇLÜ",
      latency: "GECİKME: 8ms",
      payment: "ÖDEME YAP",
      confirmed: "PNR ONAYLANDI",
      ptthold: "KONUŞMAYI AÇ",
      "ptt release": "TAMAM"
    }
  },
  en: {
    nav: { services: "LOCATION", prices: "NEWS", gallery: "HERITAGE", login: "MEMBER LOGIN" },
    hero: {
      systemOnline: "DIGITAL VHF LINK: ADA ONLINE",
      subtitle: "Where traditional maritime legacy meets the pinnacle of digital convenience.",
      ctaServices: "SELECT BERTH",
      ctaListen: "MARINA GUIDE"
    },
    widgets: { location: "LOCATION", weather: "METEOROLOGY", coordinates: "BEARING" },
    map: {
      title: "COVE LAYOUT",
      subtitle: "Select your suite and notify Ada.",
      legendAvailable: "AVAILABLE",
      legendOccupied: "RESERVED",
      legendSelected: "SELECTED",
      bookAction: "PRE-BOOKING",
      details: "SUITE DETAILS"
    },
    vhf: {
      openButton: "CONNECT WITH ADA",
      placeholder: "Ada is listening...",
      sending: "Transmitting...",
      signal: "SIGNAL: STRONG",
      latency: "LATENCY: 8ms",
      payment: "PAY NOW",
      confirmed: "PNR CONFIRMED",
      ptthold: "ACTIVATE MIC",
      "ptt release": "OVER"
    }
  },
  de: {
    nav: { services: "STANDORT", prices: "NEWS", gallery: "ERBE", login: "MEMBER LOGIN" },
    hero: {
      systemOnline: "VHF FUNK: ADA AKTIV",
      subtitle: "Wo traditionelles maritimes Erbe auf den Gipfel des digitalen Komforts trifft.",
      ctaServices: "LIEGEPLATZ WÄHLEN",
      ctaListen: "MARINA-GUIDE"
    },
    widgets: { location: "STANDORT", weather: "WETTER", coordinates: "KOORDINATEN" },
    map: {
      title: "BUCHT-LAYOUT",
      subtitle: "Wählen Sie Ihre Suite und benachrichtigen Sie Ada.",
      legendAvailable: "VERFÜGBAR",
      legendOccupied: "RESERVIERT",
      legendSelected: "AUSGEWÄHLT",
      bookAction: "RESERVIERUNG",
      details: "SUITE DETAILS"
    },
    vhf: {
      openButton: "MIT ADA VERBINDEN",
      placeholder: "Ada hört zu...",
      sending: "Senden...",
      signal: "SIGNAL: STARK",
      latency: "LATENZ: 8ms",
      payment: "ZAHLUNG",
      confirmed: "BESTÄTIGT",
      ptthold: "SPRECHEN",
      "ptt release": "ENDE"
    }
  }
};

export const FACILITIES_TRANSLATIONS: Record<Language, Record<string, string>> = {
    tr: {
        account: "Üye Profili",
        energy: "Akıllı Enerji",
        wifi: "Yüksek Hız",
        booking: "Loca Yönetimi",
        security: "7/24 Koruma",
        events: "Özel Etkinlikler"
    },
    en: {
        account: "Member Profile",
        energy: "Smart Energy",
        wifi: "High Speed",
        booking: "Suite Management",
        security: "24/7 Security",
        events: "Private Events"
    },
    de: {
        account: "Mitgliederprofil",
        energy: "Intelligente Energie",
        wifi: "Hochgeschwindigkeit",
        booking: "Suite-Management",
        security: "24/7 Sicherheit",
        events: "Private Veranstaltungen"
    }
};

export const FOOTER_LINKS = {
  tr: {
    spain: ["Palma Heritage"],
    france: ["Cannes Royal"],
    italy: ["Portofino Cove", "Amalfi Grand"],
    croatia: ["Hvar Classic"],
    greece: ["Mykonos Pearl"],
    turkey: ["Bodrum Azure", "The Commodore's Cove"],
    uae: ["Dubai Legacy"]
  },
  en: {
    spain: ["Palma Heritage"],
    france: ["Cannes Royal"],
    italy: ["Portofino Cove", "Amalfi Grand"],
    croatia: ["Hvar Classic"],
    greece: ["Mykonos Pearl"],
    turkey: ["Bodrum Azure", "The Commodore's Cove"],
    uae: ["Dubai Legacy"]
  },
  de: {
    spain: ["Palma Heritage"],
    france: ["Cannes Royal"],
    italy: ["Portofino Cove", "Amalfi Grand"],
    croatia: ["Hvar Classic"],
    greece: ["Mykonos Pearl"],
    turkey: ["Bodrum Azure", "The Commodore's Cove"],
    uae: ["Dubai Legacy"]
  }
};

const PONTOON_CONFIGS = [
  { id: 'ADMIRAL', type: 'mega', count: 10, startNum: 1, length: 80, beam: 18, price: 1200, label: 'ADMIRALS QUAY' },
  { id: 'CAPTAIN', type: 'super', count: 15, startNum: 1, length: 45, beam: 10, price: 650, label: 'CAPTAINS WALK' },
  { id: 'STEWARD', type: 'standard', count: 25, startNum: 1, length: 25, beam: 7, price: 300, label: 'STEWARDS PIER' },
];

export const MOCK_SLIPS: Slip[] = PONTOON_CONFIGS.flatMap(config => 
  Array.from({ length: config.count }).map((_, i) => ({
    id: `${config.id}${i + 1}`,
    pontoon: config.id,
    number: (i + 1).toString().padStart(2, '0'),
    length: config.length,
    beam: config.beam,
    status: Math.random() > 0.6 ? 'available' : 'occupied',
    price: config.price,
    features: ['Polished Brass Hookups', 'Concierge Paging', 'Vintage Provisions Delivery'].concat(
      config.type === 'mega' ? ['Heli-Pad Access', 'Personal Ada Service', 'Wine Cellar Delivery'] : []
    )
  }))
);
