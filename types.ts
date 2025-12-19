
export type Language = 'tr' | 'en' | 'de';

export type Region = 'DIDIM' | 'BODRUM' | 'MARMARIS' | 'GOCEK' | 'FETHIYE';

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'payment_request' | 'confirmation';
  metadata?: any;
}

export interface LogEntry {
  date: string; // ISO string format: YYYY-MM-DDTHH:mm:ss.sssZ
  timestamp: string; // Display time: HH:mm
  type: 'NAVIGATION' | 'BOOKING' | 'CUSTOMS' | 'CONCIERGE' | 'SYSTEM';
  author: string;
  vessel?: string;
  subject: string;
  text: string;
}

export interface MarinaConfig {
  id: string;
  region: Region;
  name: string;
  vhfChannel: string;
  type: 'MARINA' | 'BAY_RESTAURANT' | 'ANCHORAGE';
  coordinates: {
    lat: string;
    long: string;
    nLat: number; 
    nLong: number; 
  };
  contact: {
    phone: string;
    email: string;
  };
}

export interface WeatherData {
  temp: number;
  windSpeed: number;
  windDir: string;
  pressure: number;
  description: string;
}

export interface Slip {
  id: string;
  marinaId: string;
  pontoon: string;
  number: string;
  length: number;
  beam: number;
  status: 'available' | 'occupied' | 'reserved';
  price: number;
  features: string[];
}

export interface Translation {
  nav: {
    services: string;
    prices: string;
    gallery: string;
    login: string;
  };
  hero: {
    systemOnline: string;
    subtitle: string;
    ctaServices: string;
    ctaListen: string;
  };
  widgets: {
    location: string;
    weather: string;
    coordinates: string;
  };
  map: {
    title: string;
    subtitle: string;
    legendAvailable: string;
    legendOccupied: string;
    legendSelected: string;
    bookAction: string;
    details: string;
  };
  vhf: {
    openButton: string;
    placeholder: string;
    sending: string;
    signal: string;
    latency: string;
    payment: string;
    confirmed: string;
    ptthold: string;
    "ptt release": string;
  }
}
