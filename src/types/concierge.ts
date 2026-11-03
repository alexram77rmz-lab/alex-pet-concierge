export type ServiceType = 'Paseo Privado (Perros)' | 'Cuidado en Casa (Gatos / Perros)';

export type ZoneName =
  | 'Puerta de Hierro'
  | 'Av. Patria'
  | 'Jardín Real'
  | 'Valle Real'
  | 'Otra zona (Confirmar por WhatsApp)';

export type DiscountTierKey = 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4' | 'tier_5';

export interface CalendarSlot {
  id: string;
  startHour24: number;
  timeRange: string;
  status: 'available' | 'booked';
  bookedZone?: ZoneName;
}

export interface CalendarDay {
  id: string;
  dayShort: string;
  dayName: string;
  isWeekend: boolean;
  slots: CalendarSlot[];
}

export interface PricingTableRow {
  dogsLabel: string;
  petCount: number;
  discountLabel?: string;
  pricePerDog: number;
  totalPrice: number;
}

export interface QuoteBreakdown {
  petCount: number;
  hours: number;
  baseRatePerPet: number;
  discountPercentage: number;
  ratePerPetAfterDiscount: number;
  subtotalBase: number;
  discountAmount: number;
  total: number;
  isSpecialRequest: boolean;
  specialNotes: string[];
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
