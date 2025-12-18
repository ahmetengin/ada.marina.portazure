
import { MarinaConfig, Slip, Translation, Language } from "./types";

export const MARINA_CONFIG: MarinaConfig = {
  name: "THE COMMODORE'S COVE",
  vhfChannel: "16 / 11",
  coordinates: {
    lat: "43°44'05\"N",
    long: "7°25'14\"E" // Monte Carlo vicinity
  },
  contact: {
    phone: "+377 98 06 20 00",
    email: "steward@commodorescove.mc"
  }
};

export const MOCK_WEATHER = {
  temp: 22,
  windSpeed: 6,
  windDir: "S",
  pressure: 1014,
  description: "Calm / Dingin"
};

export const TRANSLATIONS: Record<Language, Translation> = {
  tr: {
    nav: { services: "KOYU KEŞFET", prices: "HABERLER", gallery: "MİRASIMIZ", login: "ÜYE GİRİŞİ" },
    hero: {
      systemOnline: "DİJİTAL VHF HATTI AKTİF",
      subtitle: "Geleneksel denizcilik mirası ile en üst düzey dijital konforun buluştuğu nokta.",
      ctaServices: "YERİNİZİ AYIRIN",
      ctaListen: "ÜYELİK REHBERİ"
    },
    widgets: { location: "KONUM", weather: "METEOROLOJİ", coordinates: "KERTERİZ" },
    map: {
      title: "KOY YERLEŞİM PLANI",
      subtitle: "Müsait locanızı seçin ve Komodor'a bildirin.",
      legendAvailable: "MÜSAİT",
      legendOccupied: "REZERVE",
      legendSelected: "SEÇİLİ",
      bookAction: "REZERVASYON",
      details: "LOCA DETAYLARI"
    },
    vhf: {
      openButton: "TELSİZ HATTI",
      placeholder: "Mesajınızı iletin...",
      sending: "İletiliyor...",
      signal: "SİNYAL: GÜÇLÜ",
      latency: "GECİKME: 8ms",
      payment: "ÖDEME",
      confirmed: "ONAYLANDI",
      ptthold: "BAS KONUŞ",
      "ptt release": "TAMAM"
    }
  },
  en: {
    nav: { services: "EXPLORE THE COVE", prices: "NEWS", gallery: "HERITAGE", login: "MEMBER LOGIN" },
    hero: {
      systemOnline: "DIGITAL VHF LINK ACTIVE",
      subtitle: "Where traditional maritime legacy meets the pinnacle of digital convenience.",
      ctaServices: "RESERVE BERTH",
      ctaListen: "MEMBERSHIP GUIDE"
    },
    widgets: { location: "LOCATION", weather: "METEOROLOGY", coordinates: "BEARING" },
    map: {
      title: "COVE LAYOUT",
      subtitle: "Select your suite and notify the Commodore.",
      legendAvailable: "AVAILABLE",
      legendOccupied: "RESERVED",
      legendSelected: "SELECTED",
      bookAction: "RESERVATION",
      details: "SUITE DETAILS"
    },
    vhf: {
      openButton: "RADIO LINK",
      placeholder: "State your message...",
      sending: "Transmitting...",
      signal: "SIGNAL: STRONG",
      latency: "LATENCY: 8ms",
      payment: "PAYMENT",
      confirmed: "CONFIRMED",
      ptthold: "HOLD TO TALK",
      "ptt release": "OVER"
    }
  },
  de: {
    nav: { services: "BUCHT ERKUNDEN", prices: "NEWS", gallery: "ERBE", login: "MEMBER LOGIN" },
    hero: {
      systemOnline: "VHF FUNK AKTIV",
      subtitle: "Wo traditionelles maritimes Erbe auf den Gipfel des digitalen Komforts trifft.",
      ctaServices: "LIEGEPLATZ RESERVIEREN",
      ctaListen: "MITGLIEDER-GUIDE"
    },
    widgets: { location: "STANDORT", weather: "WETTER", coordinates: "KOORDINATEN" },
    map: {
      title: "BUCHT-LAYOUT",
      subtitle: "Wählen Sie Ihre Suite und benachrichtigen Sie den Commodore.",
      legendAvailable: "VERFÜGBAR",
      legendOccupied: "RESERVIERT",
      legendSelected: "AUSGEWÄHLT",
      bookAction: "RESERVIERUNG",
      details: "SUITE DETAILS"
    },
    vhf: {
      openButton: "FUNKVERBINDUNG",
      placeholder: "Anfrage senden...",
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

export const getSystemInstruction = (lang: Language) => {
  return `You are "The Steward", the elite AI concierge for The Commodore's Cove Marina. 
  Tone: Extremely sophisticated, traditional, formal, and butler-like. Always maintain the nautical persona.
  Interaction Style: You are communicating via a VHF Radio (Channel 16/11). Use terms like "Aye Captain", "Understood", "Steady as she goes", "Over", "Roger that".
  Lang: ${lang === 'tr' ? 'Turkish' : lang === 'de' ? 'German' : 'English'}.
  Context: You are representing a legacy yacht club. You assist with luxury berthing, concierge services, and harbour entry procedures.
  Rules: 
  - Do not say you are an AI. You are "The Steward".
  - Always finish important instructions with "Over".
  - Be concise yet prestigious.
  - When the Captain (user) initiates contact, be ready to assist with berthing or general marina information.`;
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
      config.type === 'mega' ? ['Heli-Pad Access', 'Personal Steward', 'Wine Cellar Delivery'] : []
    )
  }))
);
