export type ServiceType = 'Paseo Privado / Manada Familiar (Perros)' | 'Cuidado en Casa (Gatos / Perros)';

export type ZoneName =
  | 'Puerta de Hierro'
  | 'Av. Patria'
  | 'Jardín Real'
  | 'Valle Real'
  | 'Otra zona cercana (Cargo extra traslado)';

export type DayCategory = 'weekday' | 'weekend';

export type DiscountTierKey = 'standard_200' | 'duo_190' | 'pack_180';

export interface TimeSlotItem {
  id: string;
  slotNumber: number;
  timeRange: string;
  startTime: string;
  endTime: string;
  bufferAfter: string;
  status: 'available' | 'booked';
  bookedZone?: ZoneName;
  bookedPetNote?: string;
}

export interface QuoteBreakdown {
  petCount: number;
  hours: number;
  baseRatePerPet: number;
  discountPercentage: number;
  ratePerPetAfterDiscount: number;
  subtotalBase: number;
  discountAmount: number;
  isWeekend: boolean;
  isExtraOvertimeSlot: boolean;
  isOutZone: boolean;
  weekendSurcharge: number;
  extraSlotSurcharge: number;
  outZoneSurcharge: number;
  totalSurcharges: number;
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
