export type ServiceType = 'Paseo Privado (Perros)' | 'Cuidado en Casa (Gatos / Perros)';

export type DiscountTierKey = 'single' | 'package_5' | 'package_10';

export interface QuoteBreakdown {
  hours: number;
  baseRate: number;
  discountPercentage: number;
  finalHourlyRate: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  tierKey: DiscountTierKey;
  tierBadge: string;
  tierHelperText: string;
}

export interface BentoServiceItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  highlights: string[];
  metricLabel: string;
  metricValue: string;
  spanClass: string;
  accentVariant: 'forest' | 'stone' | 'alabaster' | 'charcoal';
}

export interface ProtocolStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  durationBadge: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  highlightTag: string;
}

export interface TestimonialItem {
  id: string;
  petName: string;
  petBreed: string;
  ownerName: string;
  zone: string;
  quote: string;
  serviceUsed: string;
}
