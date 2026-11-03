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
 * Número directo de WhatsApp de Alex Pet Concierge: 33 2122 2772
 */
export const WHATSAPP_PHONE = '523321222772';
export const WHATSAPP_DISPLAY = '33 2122 2772';

export const INSTAGRAM_URL = 'https://instagram.com/alexpetconcierge';

export const BASE_HOURLY_RATE = 200; // $200 MXN por mascota / hora
export const MAX_DAILY_HOURS = 5; // 5 bloques al día (Lunes a Viernes)

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

/**
 * Calendario semanal informativo (5 horas por día de Lunes a Viernes, con 30 min entre bloques
 * para traslados tranquilos entre Puerta de Hierro, Av. Patria, Jardín Real y Valle Real).
 */
export const WEEKLY_CALENDAR: CalendarDay[] = [
  {
    id: 'lun',
    dayShort: 'Lun',
    dayName: 'Lunes',
    isWeekend: false,
    slots: [
      { id: 'lun-1', timeRange: '09:00 – 10:00', status: 'booked', zoneNote: 'Ocupado (Puerta de Hierro)' },
      { id: 'lun-2', timeRange: '10:30 – 11:30', status: 'available' },
      { id: 'lun-3', timeRange: '12:00 – 13:00', status: 'available' },
      { id: 'lun-4', timeRange: '15:00 – 16:00', status: 'booked', zoneNote: 'Ocupado (Av. Patria)' },
      { id: 'lun-5', timeRange: '16:30 – 17:30', status: 'available' },
    ],
  },
  {
    id: 'mar',
    dayShort: 'Mar',
    dayName: 'Martes',
    isWeekend: false,
    slots: [
      { id: 'mar-1', timeRange: '09:00 – 10:00', status: 'available' },
      { id: 'mar-2', timeRange: '10:30 – 11:30', status: 'booked', zoneNote: 'Ocupado (Valle Real)' },
      { id: 'mar-3', timeRange: '12:00 – 13:00', status: 'available' },
      { id: 'mar-4', timeRange: '15:00 – 16:00', status: 'available' },
      { id: 'mar-5', timeRange: '16:30 – 17:30', status: 'booked', zoneNote: 'Ocupado (Jardín Real)' },
    ],
  },
  {
    id: 'mie',
    dayShort: 'Mié',
    dayName: 'Miércoles',
    isWeekend: false,
    slots: [
      { id: 'mie-1', timeRange: '09:00 – 10:00', status: 'booked', zoneNote: 'Ocupado (Puerta de Hierro)' },
      { id: 'mie-2', timeRange: '10:30 – 11:30', status: 'available' },
      { id: 'mie-3', timeRange: '12:00 – 13:00', status: 'available' },
      { id: 'mie-4', timeRange: '15:00 – 16:00', status: 'booked', zoneNote: 'Ocupado (Av. Patria)' },
      { id: 'mie-5', timeRange: '16:30 – 17:30', status: 'available' },
    ],
  },
  {
    id: 'jue',
    dayShort: 'Jue',
    dayName: 'Jueves',
    isWeekend: false,
    slots: [
      { id: 'jue-1', timeRange: '09:00 – 10:00', status: 'available' },
      { id: 'jue-2', timeRange: '10:30 – 11:30', status: 'available' },
      { id: 'jue-3', timeRange: '12:00 – 13:00', status: 'booked', zoneNote: 'Ocupado (Jardín Real)' },
      { id: 'jue-4', timeRange: '15:00 – 16:00', status: 'available' },
      { id: 'jue-5', timeRange: '16:30 – 17:30', status: 'available' },
    ],
  },
  {
    id: 'vie',
    dayShort: 'Vie',
    dayName: 'Viernes',
    isWeekend: false,
    slots: [
      { id: 'vie-1', timeRange: '09:00 – 10:00', status: 'booked', zoneNote: 'Ocupado (Valle Real)' },
      { id: 'vie-2', timeRange: '10:30 – 11:30', status: 'booked', zoneNote: 'Ocupado (Jardín Real)' },
      { id: 'vie-3', timeRange: '12:00 – 13:00', status: 'available' },
      { id: 'vie-4', timeRange: '15:00 – 16:00', status: 'booked', zoneNote: 'Ocupado (Av. Patria)' },
      { id: 'vie-5', timeRange: '16:30 – 17:30', status: 'available' },
    ],
  },
  {
    id: 'sab',
    dayShort: 'Sáb',
    dayName: 'Sábado',
    isWeekend: true,
    slots: [],
  },
  {
    id: 'dom',
    dayShort: 'Dom',
    dayName: 'Domingo',
    isWeekend: true,
    slots: [],
  },
];

/**
 * Regla de Precios Simple y Transparente:
 * - 1 mascota (1 hr): $200 MXN c/u (0% desc)
 * - 2 a 3 mascotas (o 2 a 3 hrs): $190 MXN c/u (5% desc)
 * - 4 o más mascotas (o 4 a 5+ hrs): $180 MXN c/u (10% desc)
 * Si es otra zona lejana, fin de semana o espacio extra, Alex confirma directamente por WhatsApp si aplica algún ajuste.
 */
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
    specialNotes.push('Horario especial fuera de los 5 bloques (sujeto a confirmación)');
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

  const { petCount, hours, ratePerPetAfterDiscount, discountPercentage, total, isSpecialRequest } =
    params.quote;

  const extraNotice = isSpecialRequest
    ? ' (Sé que es horario/zona especial, me confirmas disponibilidad o si aplica algún extra)'
    : '';

  return `Hola Alex, quiero agendar ${params.service} para ${cleanPetName} (${petCount} ${
    petCount === 1 ? 'mascota' : 'mascotas'
  } a $${ratePerPetAfterDiscount} MXN c/u) por ${finalZone}. Me interesa el ${
    params.dayName
  } en el horario de ${params.slotLabel} (${hours} ${
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
      'Cobertura base en Puerta de Hierro, Av. Patria, Jardín Real y Valle Real',
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
      'Agenda exclusiva de solo 5 horas al día (Lunes a Viernes)',
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
      '30 minutos de margen entre bloques para llegar siempre puntual',
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
      'Limpiamos las patitas antes de entrar a tu casa para cuidar tus pisos y muebles, dejándolos frescos, hidratados y tranquilos.',
    highlights: [
      'Revisión de almohadillas al volver del paseo',
      'Limpieza suave de patitas antes de cruzar tu puerta',
      'Regresan relajados y con agua fresca servida',
    ],
    metricLabel: 'Higiene al Entrar',
    metricValue: 'Patitas 100% Limpias',
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
    title: 'Margen de Traslado entre Zonas',
    subtitle: '30 min entre bloque y bloque',
    description:
      'Solo agendamos 5 horas al día con media hora libre entre cada cita (ej. de Av. Patria a las 4:00 PM hacia Jardín Real a las 4:30 PM) para nunca correr ni llegar tarde.',
    durationBadge: 'Puntualidad',
  },
  {
    stepNumber: '03',
    title: 'GPS en Vivo e Hidratación',
    subtitle: 'Monitoreo por WhatsApp',
    description:
      'Me compartes o te comparto ubicación en vivo al iniciar, cuidamos la temperatura del piso y damos pausas de agua fresca.',
    durationBadge: '60 Minutos',
  },
  {
    stepNumber: '04',
    title: 'Patitas Limpias y Reporte',
    subtitle: 'Cierre impecable',
    description:
      'Limpiamos patitas antes de entrar a tu casa y te mando fotos del paseo o visita a tu WhatsApp.',
    durationBadge: 'Reporte Final',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'primera-visita',
    question: '¿Cómo funciona la primera visita?',
    answer:
      'Incluye una breve entrevista de presentación de 15 minutos sin costo en tu domicilio para conocer a tu mascota, platicar de su rutina y que nos agarre confianza antes de su primer paseo o visita.',
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
    question: '¿Qué zonas cubren y qué pasa si necesito fin de semana o estoy más lejos?',
    answer:
      'Mis zonas base sin cargo extra son Puerta de Hierro, Av. Patria, Jardín Real y Valle Real, trabajando 5 bloques diarios de Lunes a Viernes. Si estás en una zona más retirada, si el día ya tiene las 5 horas llenas o si necesitas Sábado o Domingo, mándame mensaje desde la calculadora y te confirmo directo por WhatsApp si tengo espacio y si aplica algún extra.',
    highlightTag: 'Trato directo por WhatsApp',
  },
  {
    id: 'lluvia-o-calor',
    question: '¿Qué pasa si llueve o hace mucho calor?',
    answer:
      'Ajustamos los horarios hacia horas frescas para proteger las almohadillas de las patas del asfalto caliente y buscamos rutas con sombra. Si llueve fuerte, podemos reprogramar o cambiar la hora por cuidado y juego dentro de casa.',
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
      'Tengo 4 perros y con Alex salen los 4 juntos sin juntarlos con perros ajenos. Me sale en $180 cada uno y siempre llega a tiempo.',
    serviceUsed: '4 Mascotas • $180 c/u',
  },
  {
    id: 't2',
    petName: 'Bruno & Kira',
    petBreed: '2 Golden Retrievers',
    ownerName: 'Mariana V.',
    zone: 'Puerta de Hierro',
    quote:
      'Se nota que solo toma 5 horas al día. Llega con calma, cumple la hora completa, me manda ubicación en vivo y les limpia las patitas al entrar.',
    serviceUsed: '2 Mascotas • $190 c/u',
  },
  {
    id: 't3',
    petName: 'Milo & Nube',
    petBreed: 'Gato y Perro',
    ownerName: 'Rodrigo S.',
    zone: 'Av. Patria',
    quote:
      'Súper fácil ver en su calendario qué horas tiene libres y mandarle WhatsApp directo. Total confianza para dejarle las llaves de casa.',
    serviceUsed: 'Paseo & Cuidado en Casa',
  },
];
