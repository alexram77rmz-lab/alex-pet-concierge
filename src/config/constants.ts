import {
  BentoServiceItem,
  CalendarDay,
  FaqItem,
  PricingTableRow,
  ProtocolStep,
  QuoteBreakdown,
  ServiceType,
  TestimonialItem,
  ZoneName,
} from '../types/concierge';

/**
 * WhatsApp directo: 33 2122 2772
 */
export const WHATSAPP_PHONE = '523321222772';
export const WHATSAPP_DISPLAY = '33 2122 2772';

export const INSTAGRAM_URL = 'https://www.instagram.com/pet_concierge_service?mdxt=NTZzdWx3aGdseXQw';
export const INSTAGRAM_HANDLE = '@pet_concierge_service';

export const BRAND_NAME = 'PET CONCIERGE SERVICE';
export const BRAND_SHORT = 'PCS';

export const FOUNDER_BIO = {
  badge: 'ATENCIÓN PERSONAL Y DIRECTA',
  title: 'Hola, soy Alex — Tu encargado directo en cada paseo y visita',
  description:
    'No somos una app masiva ni envío desconocidos a tu casa. Yo personalmente paso por tus mascotas, cuido su paseo o visita de principio a fin, te comparto mi ubicación en vivo por WhatsApp y te las regreso tranquilas, hidratadas y con sus patitas limpias con espuma.',
  highlights: [
    'Trato directo conmigo por WhatsApp (33 2122 2772)',
    'Horario de 10:00 a.m. a 9:00 p.m. (máximo 5 servicios al día)',
    'Citas separadas automáticamente para llegar siempre puntual a tu zona',
  ],
};

export const BASE_HOURLY_RATE = 200; // $200 MXN base por 1 perro
export const MAX_DAILY_HOURS = 5; // Máximo 5 servicios por día

/**
 * Tabla oficial de precios por perros del mismo domicilio:
 * 1 -> $200 ($200)
 * 2 (5% menos) -> $190 ($380)
 * 3 (10% menos) -> $180 ($540)
 * 4 (15% menos) -> $170 ($680)
 * 5 (20% menos) -> $160 ($800)
 */
export const PRICING_TABLE_ROWS: PricingTableRow[] = [
  { dogsLabel: '1', petCount: 1, pricePerDog: 200, totalPrice: 200 },
  { dogsLabel: '2 (5% menos)', petCount: 2, discountLabel: '5% menos', pricePerDog: 190, totalPrice: 380 },
  { dogsLabel: '3 (10% menos)', petCount: 3, discountLabel: '10% menos', pricePerDog: 180, totalPrice: 540 },
  { dogsLabel: '4 (15% menos)', petCount: 4, discountLabel: '15% menos', pricePerDog: 170, totalPrice: 680 },
  { dogsLabel: '5 (20% menos)', petCount: 5, discountLabel: '20% menos', pricePerDog: 160, totalPrice: 800 },
];

export const PCS_CLUB_CONTENT = {
  title: 'PCS Club · Tu tarjeta de cliente consentido',
  unlockBadge: 'Activa desde tu 1er servicio • Entrega de QR personal',
  subtitle:
    'Desde tu primer servicio te entrego personalmente tu acceso con código QR de PCS Club. Cada paseo suma un sello: en el 5º paseo tienes 25% de descuento y en el 10º paseo tienes 50% de descuento.',
  benefitsTitle: 'Beneficios de miembro (desde tu primer paseo)',
  benefits: [
    'Premios naturales gourmet durante el paseo (autorizados por ti)',
    'Toque de bruma botánica relajante + limpieza de patitas con espuma',
    'Prioridad para apartar tu horario fijo semanal',
    'Reporte con fotos tipo retrato y mapa GPS en cada sesión',
    'Hidratación individual con agua purificada fresca',
    'Detalle especial en el cumpleaños de tu mascota',
  ],
  referralText:
    'Invita a un vecino de tu zona y, cuando complete su primer servicio, ambos reciben un paseo de cortesía. Con tu tercer referido eres Anfitrión PCS y conservas prioridad de horarios.',
  finePrint:
    'Tu QR personal de PCS Club se entrega en tu primer servicio. Descuentos del 25% (paseo 5) y 50% (paseo 10) válidos en horarios disponibles. Cortesías de vecino: máx. 1 por mes en la misma zona.',
};

export const SERVICE_OPTIONS: {
  id: ServiceType;
  shortTitle: string;
  subtitle: string;
}[] = [
  {
    id: 'Paseo Privado (Perros)',
    shortTitle: 'Paseo Privado (Perros)',
    subtitle: 'Solo mascotas de tu casa • GPS en vivo e hidratación',
  },
  {
    id: 'Cuidado en Casa (Gatos / Perros)',
    shortTitle: 'Cuidado en Casa (Gatos / Perros)',
    subtitle: 'Visita a domicilio de 60 min • Areneros, comida y juego',
  },
];

export const PRIORITY_ZONES: ZoneName[] = [
  'Puerta de Hierro',
  'Colomos',
  'Jardín Real',
  'Valle Real',
];

export const ALL_ZONES: ZoneName[] = [
  ...PRIORITY_ZONES,
  'Otra zona (Confirmar por WhatsApp)',
];

const createCleanDaySlots = (prefix: string) => [
  { id: `${prefix}-10`, startHour24: 10, timeRange: '10:00 a.m. – 11:00 a.m.', status: 'available' as const },
  { id: `${prefix}-12`, startHour24: 12, timeRange: '12:00 p.m. – 1:00 p.m.', status: 'available' as const },
  { id: `${prefix}-14`, startHour24: 14, timeRange: '2:00 p.m. – 3:00 p.m.', status: 'available' as const },
  { id: `${prefix}-16`, startHour24: 16, timeRange: '4:00 p.m. – 5:00 p.m.', status: 'available' as const },
  { id: `${prefix}-17`, startHour24: 17, timeRange: '5:00 p.m. – 6:00 p.m.', status: 'available' as const },
  { id: `${prefix}-18`, startHour24: 18, timeRange: '6:00 p.m. – 7:00 p.m.', status: 'available' as const },
  { id: `${prefix}-20`, startHour24: 20, timeRange: '8:00 p.m. – 9:00 p.m.', status: 'available' as const },
];

export const WEEKLY_CALENDAR: CalendarDay[] = [
  { id: 'lun', dayShort: 'Lun', dayName: 'Lunes', isWeekend: false, slots: createCleanDaySlots('lun') },
  { id: 'mar', dayShort: 'Mar', dayName: 'Martes', isWeekend: false, slots: createCleanDaySlots('mar') },
  { id: 'mie', dayShort: 'Mié', dayName: 'Miércoles', isWeekend: false, slots: createCleanDaySlots('mie') },
  { id: 'jue', dayShort: 'Jue', dayName: 'Jueves', isWeekend: false, slots: createCleanDaySlots('jue') },
  { id: 'vie', dayShort: 'Vie', dayName: 'Viernes', isWeekend: false, slots: createCleanDaySlots('vie') },
  { id: 'sab', dayShort: 'Sáb', dayName: 'Sábado', isWeekend: true, slots: [] },
  { id: 'dom', dayShort: 'Dom', dayName: 'Domingo', isWeekend: true, slots: [] },
];

export function evaluateDaySlotsWithAutoBuffer(day: CalendarDay, clientZone: ZoneName) {
  const bookedCount = day.slots.filter((s) => s.status === 'booked').length;

  return day.slots.map((slot, idx, arr) => {
    if (slot.status === 'booked') {
      return {
        ...slot,
        effectiveStatus: 'booked' as const,
        reasonLabel: `Ocupado (${slot.bookedZone || 'Reservado'})`,
      };
    }

    if (bookedCount >= MAX_DAILY_HOURS) {
      return {
        ...slot,
        effectiveStatus: 'auto_buffer' as const,
        reasonLabel: 'Cupo diario de 5 hrs completo',
      };
    }

    const prevSlot = idx > 0 ? arr[idx - 1] : null;
    if (
      prevSlot &&
      prevSlot.status === 'booked' &&
      slot.startHour24 - prevSlot.startHour24 <= 1 &&
      prevSlot.bookedZone &&
      prevSlot.bookedZone !== clientZone
    ) {
      return {
        ...slot,
        effectiveStatus: 'auto_buffer' as const,
        reasonLabel: `Separado por traslado desde ${prevSlot.bookedZone}`,
      };
    }

    const nextSlot = idx < arr.length - 1 ? arr[idx + 1] : null;
    if (
      nextSlot &&
      nextSlot.status === 'booked' &&
      nextSlot.startHour24 - slot.startHour24 <= 1 &&
      nextSlot.bookedZone &&
      nextSlot.bookedZone !== clientZone
    ) {
      return {
        ...slot,
        effectiveStatus: 'auto_buffer' as const,
        reasonLabel: `Separado por traslado hacia ${nextSlot.bookedZone}`,
      };
    }

    return {
      ...slot,
      effectiveStatus: 'available' as const,
      reasonLabel: 'Disponible',
    };
  });
}

/**
 * Regla exacta de precios por perros del mismo domicilio:
 * 1 perro: $200 c/u (0% menos) -> $200
 * 2 perros: $190 c/u (5% menos) -> $380
 * 3 perros: $180 c/u (10% menos) -> $540
 * 4 perros: $170 c/u (15% menos) -> $680
 * 5 perros: $160 c/u (20% menos) -> $800
 */
export function calculateQuote(params: {
  petCount: number;
  hours: number;
  isWeekend: boolean;
  isExtraSlot: boolean;
  zone: ZoneName;
}): QuoteBreakdown {
  const petCount = Math.min(5, Math.max(1, Math.round(params.petCount)));
  const hours = Math.min(10, Math.max(1, Math.round(params.hours)));
  const baseRatePerPet = BASE_HOURLY_RATE;

  const discountByCount: Record<number, { pct: number; rate: number; key: QuoteBreakdown['tierKey'] }> = {
    1: { pct: 0, rate: 200, key: 'tier_1' },
    2: { pct: 5, rate: 190, key: 'tier_2' },
    3: { pct: 10, rate: 180, key: 'tier_3' },
    4: { pct: 15, rate: 170, key: 'tier_4' },
    5: { pct: 20, rate: 160, key: 'tier_5' },
  };

  const selectedTier = discountByCount[petCount] || discountByCount[1];
  const discountPercentage = selectedTier.pct;
  const ratePerPetAfterDiscount = selectedTier.rate;
  const tierKey = selectedTier.key;

  const tierBadge =
    petCount === 1
      ? '1 mascota: $200 MXN por hora'
      : `${petCount} mascotas (${discountPercentage}% menos): $${ratePerPetAfterDiscount} MXN c/u`;

  const tierHelperText = 'Descuento válido solo para mascotas del mismo domicilio.';

  const subtotalBase = petCount * hours * baseRatePerPet;
  const total = petCount * hours * ratePerPetAfterDiscount;
  const discountAmount = subtotalBase - total;

  const specialNotes: string[] = [];
  if (params.isWeekend) {
    specialNotes.push('Fin de semana (sujeto a disponibilidad y ajuste con Alex)');
  }
  if (params.isExtraSlot) {
    specialNotes.push('Fecha u horario especial (sujeto a confirmación)');
  }
  if (params.zone === 'Otra zona (Confirmar por WhatsApp)') {
    specialNotes.push('Zona fuera del polígono base (confirmar si aplica traslado)');
  }

  return {
    petCount,
    hours,
    baseRatePerPet,
    discountPercentage,
    ratePerPetAfterDiscount,
    subtotalBase,
    discountAmount,
    total,
    isSpecialRequest: specialNotes.length > 0,
    specialNotes,
    tierKey,
    tierBadge,
    tierHelperText,
  };
}

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppMessage(params: {
  service: ServiceType;
  petName: string;
  zone: ZoneName;
  customZoneText?: string;
  dayName: string;
  specificDate?: string;
  slotLabel: string;
  quote: QuoteBreakdown;
}): string {
  const cleanPetName =
    params.petName.trim() ||
    (params.quote.petCount === 1 ? 'mi mascota' : `mis ${params.quote.petCount} mascotas`);

  const finalZone =
    params.zone === 'Otra zona (Confirmar por WhatsApp)' && params.customZoneText?.trim()
      ? `${params.customZoneText.trim()} (fuera de zona base)`
      : params.zone;

  const datePart = params.specificDate?.trim()
    ? `${params.dayName} (${params.specificDate.trim()})`
    : params.dayName;

  const { petCount, hours, ratePerPetAfterDiscount, discountPercentage, total, isSpecialRequest } =
    params.quote;

  const extraNotice = isSpecialRequest
    ? ' (Me confirmas disponibilidad o si aplica algún ajuste por horario/zona)'
    : '';

  return `Hola Alex, vi Pet Concierge Service y quiero agendar ${params.service} para ${cleanPetName} (${petCount} ${
    petCount === 1 ? 'perro/mascota' : 'mascotas del mismo domicilio'
  } a $${ratePerPetAfterDiscount} MXN c/u) por ${finalZone}. Me interesa el ${datePart} en el horario de ${
    params.slotLabel
  } (${hours} ${
    hours === 1 ? 'hora' : 'horas'
  }${discountPercentage > 0 ? `, ${discountPercentage}% menos` : ''} — Total: $${total.toLocaleString(
    'es-MX'
  )} MXN)${extraNotice}. ¿Tienes espacio?`;
}

export function buildWhatsAppBookingUrl(params: {
  service: ServiceType;
  petName: string;
  zone: ZoneName;
  customZoneText?: string;
  dayName: string;
  specificDate?: string;
  slotLabel: string;
  quote: QuoteBreakdown;
}): string {
  const message = buildWhatsAppMessage(params);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export const BENTO_SERVICES: BentoServiceItem[] = [
  {
    id: 'paseos-privados',
    tag: 'SOLO TU DOMICILIO',
    title: 'Paseos Privados',
    description:
      'Sin estrés ni peleas con perros ajenos. $200 por 1 perro, $190 c/u por 2, $180 c/u por 3, $170 c/u por 4 y $160 c/u por 5.',
    highlights: [
      'Solo mascotas del mismo domicilio',
      'Hidratación con agua fresca',
    ],
    metricLabel: 'Tarifa por Perro',
    metricValue: '$200 a $160 c/u',
    spanClass: 'col-span-1',
    accentVariant: 'forest',
  },
  {
    id: 'cat-home-sitting',
    tag: 'EN TU HOGAR',
    title: 'Cat & Home Sitting',
    description:
      'Visitas a domicilio para gatos o perros que prefieren su espacio. Areneros, comida, agua fresca y compañía.',
    highlights: [
      'Cero estrés de traslado',
      'Sesión de 60 min en casa',
    ],
    metricLabel: 'Modalidad',
    metricValue: '60 min en Casa',
    spanClass: 'col-span-1',
    accentVariant: 'stone',
  },
  {
    id: 'transparencia-gps',
    tag: 'TIEMPO REAL',
    title: 'GPS en Vivo y Fotos',
    description:
      'Ubicación en vivo por WhatsApp durante todo el servicio y reporte con fotos de cada paseo al finalizar.',
    highlights: [
      'GPS directo en WhatsApp',
      'Horarios separados y puntuales',
    ],
    metricLabel: 'Monitoreo',
    metricValue: 'GPS + Reporte Fotos',
    spanClass: 'col-span-1',
    accentVariant: 'alabaster',
  },
  {
    id: 'limpieza-patitas',
    tag: 'CORTESÍA PCS',
    title: 'Limpieza al Regresar',
    description:
      'Limpiamos las patitas con espuma y toalla antes de entrar a tu casa para cuidar tus pisos y muebles.',
    highlights: [
      'Patitas limpias con espuma',
      'Regresan hidratados y tranquilos',
    ],
    metricLabel: 'Higiene',
    metricValue: 'Espuma + Toalla',
    spanClass: 'col-span-1',
    accentVariant: 'lime',
  },
];

export const SECURITY_PROTOCOL_STEPS: ProtocolStep[] = [
  {
    stepNumber: '01',
    title: 'Presentación 15 min',
    subtitle: 'Sin costo en casa',
    description: 'Nos conocemos antes del primer paseo para revisar rutinas.',
    durationBadge: 'Gratis',
  },
  {
    stepNumber: '02',
    title: 'Citas Separadas',
    subtitle: '10:00 a.m. a 9:00 p.m.',
    description: 'Horarios con margen entre zonas para llegar siempre puntual.',
    durationBadge: 'Puntual',
  },
  {
    stepNumber: '03',
    title: 'GPS e Hidratación',
    subtitle: 'Vía WhatsApp',
    description: 'Ubicación en tiempo real y pausas de agua fresca en ruta.',
    durationBadge: '60 Min',
  },
  {
    stepNumber: '04',
    title: 'Patitas Limpias',
    subtitle: 'Con espuma al volver',
    description: 'Limpieza de patitas al entrar y reporte con fotos del paseo.',
    durationBadge: 'Cierre',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'primera-visita',
    question: '¿Cómo funciona la primera visita?',
    answer:
      'Incluye una breve entrevista de presentación de 15 minutos sin costo en tu domicilio para conocer a tu mascota, platicar de su rutina y entregarte tu acceso QR personal de PCS Club.',
    highlightTag: 'Entrevista de 15 min sin costo',
  },
  {
    id: 'descuento-mascotas',
    question: '¿Cómo aplican los precios de $200 a $160 por perro?',
    answer:
      'El descuento aplica para perros del mismo domicilio: 1 perro $200, 2 perros $190 c/u ($380 total), 3 perros $180 c/u ($540 total), 4 perros $170 c/u ($680 total) y 5 perros $160 c/u ($800 total).',
    highlightTag: '1: $200 • 2: $190 • 3: $180 • 4: $170 • 5: $160',
  },
  {
    id: 'pcs-club-faq',
    question: '¿Cómo funciona la tarjeta y el código QR de PCS Club?',
    answer:
      'Desde tu primer servicio te entrego personalmente tu tarjeta con QR de miembro PCS Club. Cada paseo suma un sello: en tu 5º paseo obtienes 25% de descuento y en tu 10º paseo obtienes 50% de descuento. Además, al invitar a un vecino que complete su primer servicio, ambos reciben un paseo de cortesía.',
    highlightTag: 'Paseo 5 (-25%) • Paseo 10 (-50%)',
  },
  {
    id: 'lluvia-o-calor',
    question: '¿Qué pasa si llueve o hace mucho calor?',
    answer:
      'Trabajamos de 10:00 a.m. a 9:00 p.m., por lo que en días calurosos elegimos horarios frescos para proteger las almohadillas de las patas. Si llueve fuerte, podemos reprogramar o cambiar la sesión por cuidado y juego en casa.',
    highlightTag: 'Cuidado de almohadillas',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    petName: 'Thor, Maya, Rocco y Nala',
    petBreed: '4 perros • Mismo domicilio',
    ownerName: 'Alejandro G.',
    zone: 'Jardín Real',
    quote:
      'Tengo 4 perros y salen los 4 juntos sin juntarlos con perros ajenos. Me queda en $170 cada uno ($680 en total), llega puntual y les limpia las patitas con espuma.',
    serviceUsed: '4 Perros • $170 c/u',
  },
  {
    id: 't2',
    petName: 'Bruno & Kira',
    petBreed: '2 Golden Retrievers',
    ownerName: 'Mariana V.',
    zone: 'Puerta de Hierro',
    quote:
      'Desde el primer servicio nos entregó nuestra tarjeta PCS Club. Cumple la hora completa, manda ubicación en vivo y regresan impecables.',
    serviceUsed: '2 Perros • $190 c/u',
  },
  {
    id: 't3',
    petName: 'Milo, Nube y Coco',
    petBreed: '3 perros • Mismo domicilio',
    ownerName: 'Rodrigo S.',
    zone: 'Colomos',
    quote:
      'Por mis 3 perros pago $180 cada uno. El horario hasta las 9:00 p.m. y las citas separadas hacen que siempre llegue a tiempo.',
    serviceUsed: '3 Perros • $180 c/u',
  },
];
