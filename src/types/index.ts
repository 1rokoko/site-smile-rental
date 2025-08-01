export interface ScooterModel {
  id: string;
  name: string;
  image: string;
  year: number;
  power: number;
  comfort: number;
  safety: number;
  rating: number;
  reviewCount: number;
  pricing: {
    '1-3': number;
    '3-6': number;
    '7-12': number;
    '13-22': number;
    '30': number;
  };
  features: string[];
  photoLink: string;
  isBestSeller?: boolean;
  isPremium?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  count: number;
  platform: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: boolean;
}

export interface ContactInfo {
  telegram: string;
  whatsapp: string;
  phone?: string;
}
