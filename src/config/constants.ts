import {
  BentoServiceItem,
  CalendarDay,
  FaqItem,
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
export const ADMIN_PIN = '2772';

export const INSTAGRAM_URL = 'https://instagram.com/petconciergeservice';

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

export const BASE_HOURLY_RATE = 200; // $200 MXN base por mascota / hora
export const MAX_DAILY_HOURS = 5; // Máximo 5 horas trabajadas por día

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
  'Av. Patria',
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

/**
 * Calendario semanal limpio (sin fechas ocupadas falsas de ejemplo).
 * Tú puedes marcar qué horas se van ocupando desde tu Panel Admin oculto (PIN: 2772).
 */
export const WEEKLY_CALENDAR: CalendarDay[] = [
  { id: 'lun', dayShort: 'Lun', dayName: 'Lunes', isWeekend: false, slots: createCleanDaySlots('lun') },
  { id: 'mar', dayShort: 'Mar', dayName: 'Martes', isWeekend: false, slots: createCleanDaySlots('mar') },
  { id: 'mie', dayShort: 'Mié', dayName: 'Miércoles', isWeekend: false, slots: createCleanDaySlots('mie') },
  { id: 'jue', dayShort: 'Jue', dayName: 'Jueves', isWeekend: false, slots: createCleanDaySlots('jue') },
  { id: 'vie', dayShort: 'Vie', dayName: 'Viernes', isWeekend: false, slots: createCleanDaySlots('vie') },
  { id: 'sab', dayShort: 'Sáb', dayName: 'Sábado', isWeekend: true, slots: [] },
  { id: 'dom', dayShort: 'Dom', dayName: 'Domingo', isWeekend: true, slots: [] },
];

/**
 * Automatiza la separación de horarios y el límite de 5 horas al día:
 * 1) Si ya hay 5 bloques ocupados en el día, el resto se marca como "Cupo de 5 hrs lleno".
 * 2) Si un bloque está ocupado en otra zona distinta y el siguiente bloque está pegado (diferencia <= 1 hr),
 *    se separa automáticamente como "Tiempo de traslado".
 */
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

export function calculateQuote(params: {
  petCount: number;
  hours: number;
  isWeekend: boolean;
  isExtraSlot: boolean;
  zone: ZoneName;
}): QuoteBreakdown {
  const petCount = Math.min(6, Math.max(1, Math.round(params.petCount)));
  const hours = Math.min(10, Math.max(1, Math.round(params.hours)));
  const baseRatePerPet = BASE_HOURLY_RATE;

  let discountPercentage = 0;
  let tierKey: QuoteBreakdown['tierKey'] = 'standard_200';
  let tierBadge = 'Tarifa estándar: $200 MXN por mascota / hora';
  let tierHelperText =
    'A partir de 2 mascotas (o 2 horas) baja a $190 c/u (-5%). De 4 mascotas en adelante baja a $180 c/u (-10%).';

  if (petCount >= 4 || hours >= 5) {
    discountPercentage = 10;
    tierKey = 'pack_180';
    tierBadge = 'Máximo Ahorro • $180 MXN por mascota (-10%)';
    tierHelperText = 'Tarifa preferencial de $180 MXN cada mascota por hora.';
  } else if (petCount >= 2 || hours >= 2) {
    discountPercentage = 5;
    tierKey = 'duo_190';
    tierBadge = 'Descuento Aplicado • $190 MXN por mascota (-5%)';
    tierHelperText = 'Pagas $190 MXN por mascota. Con 4+ mascotas (o 5 hrs) baja a $180 MXN c/u.';
  }

  const ratePerPetAfterDiscount = Math.round(baseRatePerPet * (1 - discountPercentage / 100));
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
    petCount === 1 ? 'mascota' : 'mascotas'
  } a $${ratePerPetAfterDiscount} MXN c/u) por ${finalZone}. Me interesa el ${datePart} en el horario de ${
    params.slotLabel
  } (${hours} ${
    hours === 1 ? 'hora' : 'horas'
  }, ${discountPercentage}% desc. — Total base: $${total.toLocaleString(
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
    tag: 'SOLO TU CASA • DESCUENTO POR GRUPO',
    title: 'Paseos Privados (Solo tus Mascotas)',
    description:
      'Sin estrés ni peleas con perros desconocidos. Si tienes varias mascotas en casa, pasean juntas con descuento: 1 mascota $200, 2 a 3 mascotas $190 c/u y 4+ mascotas $180 c/u.',
    highlights: [
      'Atención 100% enfocada en el ritmo y energía de tus perros',
      'Hidratación con agua fresca y plato portátil limpio',
      'Cobertura normal en Puerta de Hierro, Av. Patria, Jardín Real y Valle Real',
    ],
    metricLabel: 'Tarifa por Mascota',
    metricValue: '1: $200 • 2-3: $190 • 4+: $180',
    spanClass: 'md:col-span-7',
    accentVariant: 'forest',
  },
  {
    id: 'cat-home-sitting',
    tag: 'CUIDADO EN CASA',
    title: 'Cat & Home Sitting',
    description:
      'Visitas a domicilio para gatos o perros que prefieren su propio espacio. Limpieza de areneros, alimentación precisa, agua fresca, juego e interacción.',
    highlights: [
      'Cero estrés de jaulas o traslados',
      'Cuidado de 60 minutos en la tranquilidad de tu hogar',
      'Horario de 10:00 a.m. a 9:00 p.m. (máximo 5 servicios al día)',
    ],
    metricLabel: 'Modalidad',
    metricValue: 'Sesión de 60 min en Casa',
    spanClass: 'md:col-span-5',
    accentVariant: 'stone',
  },
  {
    id: 'transparencia-gps',
    tag: 'MONITOREO EN VIVO',
    title: 'Transparencia Total en Tiempo Real',
    description:
      'Ubicación en vivo por WhatsApp durante todo el servicio y bitácora al finalizar con hora de inicio, ruta, hidratación y reporte fotográfico.',
    highlights: [
      'Ubicación en tiempo real directo a tu WhatsApp',
      'Horarios separados automáticamente para llegar siempre puntual',
      'Fotos y resumen al terminar cada sesión',
    ],
    metricLabel: 'Trazabilidad',
    metricValue: 'GPS en Vivo + Fotos',
    spanClass: 'md:col-span-5',
    accentVariant: 'alabaster',
  },
  {
    id: 'limpieza-patitas',
    tag: 'CUIDADO DE TU HOGAR',
    title: 'Limpieza al Regresar',
    description:
      'Limpiamos las patitas con espuma y toalla antes de entrar a tu casa para cuidar tus pisos y muebles, dejándolos frescos, hidratados y tranquilos.',
    highlights: [
      'Limpieza práctica de patitas con espuma antes de entrar',
      'Cuidamos tus pisos, alfombras y sillones del polvo de la calle',
      'Regresan relajados y con agua fresca servida',
    ],
    metricLabel: 'Higiene al Entrar',
    metricValue: 'Patitas Limpias con Espuma',
    spanClass: 'md:col-span-7',
    accentVariant: 'charcoal',
  },
];

export const SECURITY_PROTOCOL_STEPS: ProtocolStep[] = [
  {
    stepNumber: '01',
    title: 'Presentación Previa (15 min sin costo)',
    subtitle: 'Nos conocemos en tu domicilio',
    description:
      'Antes del primer servicio hacemos una visita breve sin costo para conocer a tus mascotas, su carácter y sus rutinas.',
    durationBadge: 'Sin Costo',
  },
  {
    stepNumber: '02',
    title: 'Horarios Separados Automáticamente',
    subtitle: 'De 10:00 a.m. a 9:00 p.m.',
    description:
      'El sistema separa automáticamente las citas cuando hay cambio de zona (ej. de Av. Patria a las 4:00 p.m. hacia Jardín Real hasta las 5:00 p.m.) para un servicio rápido y puntual.',
    durationBadge: 'Puntualidad',
  },
  {
    stepNumber: '03',
    title: 'GPS en Vivo e Hidratación',
    subtitle: 'Monitoreo por WhatsApp',
    description:
      'Te comparto ubicación en vivo al iniciar, cuidamos la temperatura del piso y damos pausas de agua fresca.',
    durationBadge: '60 Minutos',
  },
  {
    stepNumber: '04',
    title: 'Patitas Limpias con Espuma y Reporte',
    subtitle: 'Cierre impecable',
    description:
      'Limpiamos sus patitas con espuma antes de entrar a tu casa y te mando fotos del paseo o visita a tu WhatsApp.',
    durationBadge: 'Reporte Final',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'primera-visita',
    question: '¿Cómo funciona la primera visita?',
    answer:
      'Incluye una breve entrevista de presentación de 15 minutos sin costo en tu domicilio para conocer a tu mascota, platicar de su rutina y que me tome confianza antes de su primer paseo o visita.',
    highlightTag: 'Entrevista de 15 min sin costo',
  },
  {
    id: 'descuento-mascotas',
    question: '¿Cómo aplican los descuentos por varias mascotas o por horas?',
    answer:
      'Si es 1 mascota la tarifa es de $200 MXN por hora. Si tienes 2 o 3 mascotas (o reservas de 2 a 4 horas) baja a $190 MXN cada una (5% de descuento). Si son 4 o más mascotas (o paquete de 5+ horas) queda en $180 MXN cada una (10% de descuento).',
    highlightTag: '$200 (1) • $190 c/u (2-3) • $180 c/u (4+)',
  },
  {
    id: 'zonas-y-fines-de-semana',
    question: '¿Cuál es el horario y por qué el calendario separa las horas entre zonas?',
    answer:
      'Atiendo de 10:00 a.m. a 9:00 p.m. (máximo 5 servicios al día de Lunes a Viernes) en Puerta de Hierro, Av. Patria, Jardín Real y Valle Real. El calendario bloquea automáticamente las horas pegadas cuando el servicio anterior es en otra zona para trasladarme sin prisas y darte un servicio puntual y profesional.',
    highlightTag: '10:00 a.m. a 9:00 p.m. • Citas separadas',
  },
  {
    id: 'lluvia-o-calor',
    question: '¿Qué pasa si llueve o hace mucho calor?',
    answer:
      'Como trabajamos hasta las 9:00 p.m., en días calurosos podemos elegir bloques de mañana o tarde-noche para proteger las almohadillas de las patas. Si llueve fuerte, podemos reprogramar o cambiar la hora por cuidado y juego dentro de casa.',
    highlightTag: 'Cuidado de almohadillas',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    petName: 'Thor, Maya, Rocco y Nala',
    petBreed: '4 perros • Manada familiar',
    ownerName: 'Alejandro G.',
    zone: 'Jardín Real',
    quote:
      'Tengo 4 perros y salen los 4 juntos sin juntarlos con perros ajenos. Me sale en $180 cada uno, siempre llega puntual y les limpia las patitas con espuma antes de entrar.',
    serviceUsed: '4 Mascotas • $180 c/u',
  },
  {
    id: 't2',
    petName: 'Bruno & Kira',
    petBreed: '2 Golden Retrievers',
    ownerName: 'Mariana V.',
    zone: 'Puerta de Hierro',
    quote:
      'Se nota que solo toma 5 servicios al día y con horas separadas. Llega con calma, cumple la hora completa, me manda ubicación en vivo y regresan impecables.',
    serviceUsed: '2 Mascotas • $190 c/u',
  },
  {
    id: 't3',
    petName: 'Milo & Nube',
    petBreed: 'Gato y Perro',
    ownerName: 'Rodrigo S.',
    zone: 'Av. Patria',
    quote:
      'El horario hasta las 9:00 p.m. me queda perfecto cuando salgo tarde. Súper fácil ver en su calendario qué horas tiene libres y mandarle WhatsApp directo.',
    serviceUsed: 'Paseo & Cuidado en Casa',
  },
];
