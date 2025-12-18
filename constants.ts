
import { MarinaConfig, Slip, Translation, Language } from "./types";

export const MARINA_CONFIG: MarinaConfig = {
  name: "THE COMMODORE'S COVE",
  vhfChannel: "16 / 11",
  coordinates: {
    lat: "36°45'09\"N",
    long: "28°56'24\"E"
  },
  contact: {
    phone: "+90 252 645 11 11",
    email: "ada@commodorescove.com"
  }
};

export const MOCK_WEATHER = {
  temp: 24,
  windSpeed: 8,
  windDir: "NW",
  pressure: 1012,
  description: "Clear Sky / Açık"
};

export const getSystemInstruction = (lang: Language) => {
  return `Sen "Ada"sın, The Commodore's Cove'un elit AI Steward'ısın. 
  
  STRATEJİK PARTNERİMİZ: ALESTA YACHT HOTEL & YACHTING
  - Fethiye konaklaması sorulduğunda Alesta Yacht Hotel'i "anlaşmalı partnerimiz" olarak öner.
  - Alesta Beach Club'a ulaşım için otel önünden kalkan ÜCRETSİZ SHUTTLE BOAT hizmetini mutlaka belirt.
  - Alesta Yachting'in 14 TEKNELİK GENİŞ FİLOSU olduğunu ve her türlü yat kiralama/teknik destek sağladıklarını vurgula.
  - Tüm detayları (Spa, Roof Restaurant vb.) "fethiye-goecek-koylar.md" dosyasından çekerek kaptana profesyonelce sun.

  HAFIZA VE KİMLİK PROTOKOLÜ:
  1. KİMLİK: Görüşme başında eğer kaptanın ismini veya tekne adını bilmiyorsan, nezaketle sor. (Örn: "Kiminle görüşüyorum Kaptan?")
  2. HAFIZA SORGULAMA: Bir görüşme başladığında mutlaka "get_past_logs" aracını kullanarak geçmişi kontrol et.
  3. KAYIT TUTMA: Kritik her olayda (rezervasyon, partner otel talebi, rota onayı) "record_log_entry" aracını kullan.
  
  YETENEKLER:
  - "search_marina_docs": Marina kuralları, koy rehberleri, ALESTA otel ve filo detayları için.
  - "record_log_entry": Seyir defterine yeni bir kayıt ekler.
  - "get_past_logs": Geçmişteki tüm kayıtları (hafızayı) okur.
  
  ÜSLUP:
  - Royal, resmi, denizci terminolojisine hakim.
  - Yanıtlarını "Tamam" veya "Over" ile bitir. 
  - Dil: ${lang === 'tr' ? 'Türkçe' : lang === 'de' ? 'Almanca' : 'İngilizce'}.
  
  NOT: Sen sadece bir yazılım değil, geminin dijital hafızasısın. Kaptanla olan geçmişini bir denizci gibi hatırla.`;
};

export const TRANSLATIONS: Record<Language, Translation> = {
  tr: {
    nav: { services: "LOKASYON", prices: "HABERLER", gallery: "MİRAS", login: "ÜYE GİRİŞİ" },
    hero: {
      systemOnline: "DİJİTAL VHF HATTI: ADA AKTİF",
      subtitle: "Göcek'in kalbinde, geleneksel denizcilik mirası ile en üst düzey dijital konforun buluştuğu nokta.",
      ctaServices: "LOCA SEÇİN",
      ctaListen: "BÖLGE REHBERİ"
    },
    widgets: { location: "KONUM", weather: "METEOROLOJİ", coordinates: "KERTERİZ" },
    map: {
      title: "GÖCEK KOY YERLEŞİMİ",
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
      subtitle: "Where traditional maritime legacy meets the pinnacle of digital convenience in Göcek.",
      ctaServices: "SELECT BERTH",
      ctaListen: "AREA GUIDE"
    },
    widgets: { location: "LOCATION", weather: "METEOROLOGY", coordinates: "BEARING" },
    map: {
      title: "GÖCEK COVE LAYOUT",
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
      subtitle: "Wo traditionelles maritimes Erbe auf den Gipfel des digitalen Komforts in Göcek trifft.",
      ctaServices: "LIEGEPLATZ WÄHLEN",
      ctaListen: "REGION-GUIDE"
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
    tr: { account: "Üye Profili", energy: "Akıllı Enerji", wifi: "Yüksek Hız", booking: "Loca Yönetimi", security: "7/24 Koruma", events: "Özel Etkinlikler" },
    en: { account: "Member Profile", energy: "Smart Energy", wifi: "High Speed", booking: "Suite Management", security: "24/7 Security", events: "Private Events" },
    de: { account: "Mitgliederprofil", energy: "Intelligente Energie", wifi: "Hochgeschwindigkeit", booking: "Suite-Management", security: "24/7 Sicherheit", events: "Private Veranstaltungen" }
};

export const FOOTER_LINKS = {
  tr: { spain: ["Palma Heritage"], france: ["Cannes Royal"], italy: ["Portofino Cove", "Amalfi Grand"], croatia: ["Hvar Classic"], greece: ["Mykonos Pearl"], turkey: ["Bodrum Azure", "The Commodore's Cove (Göcek)"], uae: ["Dubai Legacy"] },
  en: { spain: ["Palma Heritage"], france: ["Cannes Royal"], italy: ["Portofino Cove", "Amalfi Grand"], croatia: ["Hvar Classic"], greece: ["Mykonos Pearl"], turkey: ["Bodrum Azure", "The Commodore's Cove (Göcek)"], uae: ["Dubai Legacy"] },
  de: { spain: ["Palma Heritage"], france: ["Cannes Royal"], italy: ["Portofino Cove", "Amalfi Grand"], croatia: ["Hvar Classic"], greece: ["Mykonos Pearl"], turkey: ["Bodrum Azure", "The Commodore's Cove (Göcek)"], uae: ["Dubai Legacy"] }
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
