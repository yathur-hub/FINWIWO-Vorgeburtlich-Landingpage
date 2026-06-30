export type GenderType = 'Mädchen' | 'Junge' | 'Beides';
export type StyleType = 'Klassisch' | 'Kurz' | 'Selten' | 'Modern';

export interface BabyName {
  name: string;
  gender: GenderType;
  style: StyleType;
  meaning: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location: string;
  isHebamme?: boolean;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface ZodiacInfo {
  name: string;
  icon: string;
  dateRange: string;
  pregnancyQuote: string;
  personality: string;
}

export interface FruitSize {
  weekMin: number;
  weekMax: number;
  fruit: string;
  size: string;
  weight: string;
  emoji: string;
}
