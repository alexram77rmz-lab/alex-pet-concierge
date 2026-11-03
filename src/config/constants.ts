import {
  BentoServiceItem,
  FaqItem,
  ProtocolStep,
  QuoteBreakdown,
  ServiceType,
  TestimonialItem,
  TimeSlotItem,
  ZoneName,
} from '../types/concierge';

/**
 * Número de WhatsApp de Alex Pet Concierge (formato internacional sin '+' ni espacios).
 */
export const WHATSAPP_PHONE = '523300000000';

export const INSTAGRAM_URL = 'https://instagram.com/alexpetconcierge';

export const BASE_HOURLY_RATE = 200; // $200 MXN base por mascota / hora
export const MAX_DAILY_HOURS = 5; // Límite operativo: solo 5 horas al día (Lunes a Viernes)
export const WEEKEND_EXTRA_PER_HOUR = 60; // Cargo extra por abrir agenda en Sábado o Domingo
export const OVERTIME_EXTRA_PER_HOUR = 50; // Cargo extra si los 5 espacios del día ya se ocuparon
export const OUT_OF_ZONE_EXTRA = 60; // Cargo de traslado fuera de las 4 zonas base

export const SERVICE_OPTIONS: {
  id: ServiceType;
  shortTitle: string;
  subtitle: string;
  unitLabel: string;
  idealFor: string;
}[] = [
  {
    id: 'Paseo Privado / Manada Familiar (Perros)',
    shortTitle: 'Paseo de Perros (1 a 5 mascotas)',
    subtitle: 'Solo perros de tu hogar • Ruta GPS en vivo • $200 a $180 c/u',
    unitLabel: 'horas de paseo',
    idealFor: '1 perro individual ($200) o tu propia manada de 2-3 ($190 c/u) o 4+ perros ($180 c/u).',
  },
  {
    id: 'Cuidado en Casa (Gatos / Perros)',
    shortTitle: 'Cuidado en Casa (Gatos / Perros)',
    subtitle: 'Visitas de 60 min a domicilio • Areneros, alimento y compañía',
    unitLabel: 'sesiones en casa',
    idealFor: 'Gatos o perros que prefieren su propio espacio con atención y reporte fotográfico.',
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
  'Otra zona cercana (Cargo extra traslado)',
];

/**
 * Tiempo estimado de traslado real en auto/moto entre las 4 zonas de cobertura (en minutos).
 * Justifica por qué jamás se agenda a las 4:10 si terminas a las 4:00 en Av. Patria.
 */
export const ZONE_TRAVEL_MINUTES: Record<string, Record<string, number>> = {
  'Puerta de Hierro': {
    'Puerta de Hierro': 5,
    'Av. Patria': 12,
    'Valle Real': 16,
    'Jardín Real': 20,
    'Otra zona cercana (Cargo extra traslado)': 28,
  },
  'Av. Patria': {
    'Puerta de Hierro': 12,
    'Av. Patria': 8,
    'Valle Real': 22,
    'Jardín Real': 25,
    'Otra zona cercana (Cargo extra traslado)': 30,
  },
  'Jardín Real': {
    'Puerta de Hierro': 20,
    'Av. Patria': 25,
    'Valle Real': 10,
    'Jardín Real': 5,
    'Otra zona cercana (Cargo extra traslado)': 25,
  },
  'Valle Real': {
    'Puerta de Hierro': 16,
    'Av. Patria': 22,
    'Valle Real': 5,
    'Jardín Real': 10,
    'Otra zona cercana (Cargo extra traslado)': 25,
  },
  'Otra zona cercana (Cargo extra traslado)': {
    'Puerta de Hierro': 25,
    'Av. Patria': 28,
    'Valle Real': 25,
    'Jardín Real': 25,
    'Otra zona cercana (Cargo extra traslado)': 20,
  },
};

/**
 * Los 5 bloques diarios oficiales (Lunes a Viernes).
 * Cada bloque dura 60 min y tiene 30 minutos obligatorios de colchón de traslado
 * para evitar empalmes imposibles (ej. terminar 4:00 PM en Av. Patria y empezar 4:30 PM en Jardín Real).
 */
export const INITIAL_DAILY_SLOTS: TimeSlotItem[] = [
  {
    id: 'slot-1',
    slotNumber: 1,
    timeRange: '09:00 – 10:00 hrs',
    startTime: '09:00',
    endTime: '10:00',
    bufferAfter: '10:00 a 10:30 (30 min traslado entre zonas)',
    status: 'booked',
    bookedZone: 'Puerta de Hierro',
    bookedPetNote: '2 perros reservados',
  },
  {
    id: 'slot-2',
    slotNumber: 2,
    timeRange: '10:30 – 11:30 hrs',
    startTime: '10:30',
    endTime: '11:30',
    bufferAfter: '11:30 a 12:00 (30 min traslado entre zonas)',
    status: 'available',
  },
  {
    id: 'slot-3',
    slotNumber: 3,
    timeRange: '12:00 – 13:00 hrs',
    startTime: '12:00',
    endTime: '13:00',
    bufferAfter: '13:00 a 15:00 (Pausa térmica / comida)',
    status: 'available',
  },
  {
    id: 'slot-4',
    slotNumber: 4,
    timeRange: '15:00 – 16:00 hrs',
    startTime: '15:00',
    endTime: '16:00',
    bufferAfter: '16:00 a 16:30 (30 min traslado Av. Patria → Jardín Real / Valle Real)',
    status: 'booked',
    bookedZone: 'Av. Patria',
    bookedPetNote: 'Termina 4:00 PM en Av. Patria',
  },
  {
    id: 'slot-5',
    slotNumber: 5,
    timeRange: '16:30 – 17:30 hrs',
    startTime: '16:30',
    endTime: '17:30',
    bufferAfter: 'Fin de las 5 horas diarias',
    status: 'available',
  },
];

/**
 * Regla de Negocio de Alex Pet Concierge:
 * 1) Descuento por cantidad de mascotas (o por cantidad de horas):
 *    - 1 mascota (y 1 hora): 0% desc -> $200 MXN c/u
 *    - 2 a 3 mascotas (o 2 a 3 horas): 5% desc -> $190 MXN cada mascota por hora
 *    - 4 o más mascotas (o 4 a 5+ horas): 10% desc -> $180 MXN cada mascota por hora
 * 2) Control de Agenda:
 *    - Solo 5 horas al día (Lun-Vie). Si piden espacio #6 extra -> +$50 MXN/hr
 *    - Fines de semana (Sáb/Dom no se labora normalmente): Solicitud especial -> +$60 MXN/hr
 *    - Fuera de las 4 zonas base -> +$60 MXN traslado
 */
export function calculateQuote(params: {
  petCount: number;
  hours: number;
  isWeekend: boolean;
  isExtraOvertimeSlot: boolean;
  zone: ZoneName;
}): QuoteBreakdown {
  const petCount = Math.min(6, Math.max(1, Math.round(params.petCount)));
  const hours = Math.min(10, Math.max(1, Math.round(params.hours)));
  const baseRatePerPet = BASE_HOURLY_RATE;

  // Determinamos el nivel por número de mascotas o por volumen de horas
  let discountPercentage = 0;
  let tierKey: QuoteBreakdown['tierKey'] = 'standard_200';
  let tierBadge = 'Tarifa Estándar Individual ($200 MXN por mascota/hr)';
  let tierHelperText =
    'Si tienes 2 o 3 mascotas baja a $190 c/u (-5%). Con 4 o más mascotas baja a $180 c/u (-10%).';

  if (petCount >= 4 || hours >= 5) {
    discountPercentage = 10;
    tierKey = 'pack_180';
    tierBadge =
      petCount >= 4
        ? `Descuento Manada (${petCount} mascotas) • $180 MXN c/u (-10%)`
        : `Descuento Paquete ${hours} hrs • $180 MXN c/u (-10%)`;
    tierHelperText = `Tarifa preferencial máxima activa: pagas $180 MXN por mascota cada hora en lugar de $200.`;
  } else if (petCount >= 2 || hours >= 2) {
    discountPercentage = 5;
    tierKey = 'duo_190';
    tierBadge =
      petCount >= 2
        ? `Descuento Grupo (${petCount} mascotas) • $190 MXN c/u (-5%)`
        : `Descuento ${hours} horas • $190 MXN c/u (-5%)`;
    tierHelperText = `Ahorras 5% ($190 MXN c/u). A partir de 4 mascotas (o 5 horas) baja a $180 MXN c/u (-10%).`;
  }

  const ratePerPetAfterDiscount = Math.round(baseRatePerPet * (1 - discountPercentage / 100));
  const subtotalBase = petCount * hours * baseRatePerPet;
  const discountedBase = petCount * hours * ratePerPetAfterDiscount;
  const discountAmount = subtotalBase - discountedBase;

  const isOutZone = params.zone === 'Otra zona cercana (Cargo extra traslado)';

  const weekendSurcharge = params.isWeekend ? WEEKEND_EXTRA_PER_HOUR * hours : 0;
  const extraSlotSurcharge = params.isExtraOvertimeSlot ? OVERTIME_EXTRA_PER_HOUR * hours : 0;
  const outZoneSurcharge = isOutZone ? OUT_OF_ZONE_EXTRA : 0;

  const totalSurcharges = weekendSurcharge + extraSlotSurcharge + outZoneSurcharge;
  const total = discountedBase + totalSurcharges;

  return {
    petCount,
    hours,
    baseRatePerPet,
    discountPercentage,
    ratePerPetAfterDiscount,
    subtotalBase,
    discountAmount,
    isWeekend: params.isWeekend,
    isExtraOvertimeSlot: params.isExtraOvertimeSlot,
    isOutZone,
    weekendSurcharge,
    extraSlotSurcharge,
    outZoneSurcharge,
    totalSurcharges,
    total,
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
  selectedSlotLabel: string;
  dayLabel: string;
  quote: QuoteBreakdown;
}): string {
  const cleanPetName =
    params.petName.trim() ||
    (params.quote.petCount === 1 ? 'mi mascota' : `mis ${params.quote.petCount} mascotas`);
  const {
    petCount,
    hours,
    ratePerPetAfterDiscount,
    discountPercentage,
    total,
    isWeekend,
    isExtraOvertimeSlot,
  } = params.quote;

  const extraTag =
    isWeekend || isExtraOvertimeSlot
      ? ` [Solicitud Especial: ${isWeekend ? 'Fin de Semana' : ''}${
          isWeekend && isExtraOvertimeSlot ? ' + ' : ''
        }${isExtraOvertimeSlot ? 'Hora Extra fuera de los 5 bloques' : ''}]`
      : '';

  return `Hola Alex, quiero agendar ${params.service} para ${cleanPetName} (${petCount} ${
    petCount === 1 ? 'mascota' : 'mascotas'
  } a $${ratePerPetAfterDiscount} MXN c/u) en la zona de ${params.zone}. Día: ${
    params.dayLabel
  } en el bloque ${params.selectedSlotLabel} (${hours} ${
    hours === 1 ? 'hora' : 'horas'
  }, ${discountPercentage}% desc.${extraTag} — Total: $${total.toLocaleString(
    'es-MX'
  )} MXN). ¿Tienes disponibilidad para ese traslado y horario?`;
}

export function buildWhatsAppBookingUrl(params: {
  service: ServiceType;
  petName: string;
  zone: ZoneName;
  selectedSlotLabel: string;
  dayLabel: string;
  quote: QuoteBreakdown;
}): string {
  const message = buildWhatsAppMessage(params);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export const BENTO_SERVICES: BentoServiceItem[] = [
  {
    id: 'paseos-privados',
    tag: 'SOLO TU HOGAR • 1 A 5 MASCOTAS',
    title: 'Paseos Exclusivos y Manada Familiar',
    description:
      'Jamás mezclamos perros de desconocidos. Paseamos únicamente a tu mascota ($200) o a los perros de tu propia casa juntos con descuento por grupo: 2 a 3 mascotas a $190 c/u y 4+ mascotas a $180 c/u.',
    highlights: [
      'Cero peleas con perros ajenos: solo mascotas de tu mismo hogar',
      'Descuento directo por manada familiar ($190 o $180 por mascota)',
      'Hidratación con agua purificada y ritmo adaptado a tus perros',
    ],
    metricLabel: 'Tarifa por Mascota',
    metricValue: '1: $200 • 2-3: $190 • 4+: $180',
    spanClass: 'md:col-span-7',
    accentVariant: 'forest',
  },
  {
    id: 'cat-home-sitting',
    tag: 'AGENDA CONTROLADA • 5 HRS/DÍA',
    title: 'Cupo Limitado a 5 Bloques Diarios',
    description:
      'Trabajamos únicamente 5 horas al día de Lunes a Viernes con 30 minutos de colchón entre cada servicio para trasladarnos con calma entre Puerta de Hierro, Av. Patria, Jardín Real y Valle Real.',
    highlights: [
      'Si terminamos 4:00 PM en Av. Patria, el siguiente bloque inicia 4:30 PM en Jardín Real',
      'Nunca acortamos tu hora completa de 60 minutos por prisas de tráfico',
      'Fines de semana o 6° bloque disponibles bajo Solicitud Especial (cargo extra)',
    ],
    metricLabel: 'Capacidad Máxima',
    metricValue: 'Solo 5 Sesiones por Día',
    spanClass: 'md:col-span-5',
    accentVariant: 'stone',
  },
  {
    id: 'transparencia-gps',
    tag: 'MONITOREO EN VIVO',
    title: 'Transparencia Total en Tiempo Real',
    description:
      'Ubicación en vivo por WhatsApp desde el minuto en que salimos de tu domicilio y bitácora al finalizar con hora exacta de inicio, ruta, hidratación y reporte fotográfico.',
    highlights: [
      'Link de ubicación GPS en tiempo real por WhatsApp',
      'Ideal para supervisar a distancia mientras trabajas o viajas',
      'Cuidado en casa para gatos y perros (areneros, alimento y juego)',
    ],
    metricLabel: 'Trazabilidad',
    metricValue: 'GPS Activo + Bitácora Final',
    spanClass: 'md:col-span-5',
    accentVariant: 'alabaster',
  },
  {
    id: 'limpieza-patitas',
    tag: 'PROTOCOLO HOGAR IMPECABLE',
    title: 'Limpieza de Patitas al Regresar',
    description:
      'Limpiamos las patitas de cada una de tus mascotas antes de entrar a tu casa en Puerta de Hierro, Patria, Jardín Real o Valle Real para cuidar tus pisos y muebles.',
    highlights: [
      'Inspección de almohadillas al terminar cada paseo',
      'Limpieza con espuma hipoalergénica y toalla individual',
      'Regresan relajados, hidratados y listos para descansar',
    ],
    metricLabel: 'Higiene Post-Paseo',
    metricValue: 'Patitas 100% Limpias',
    spanClass: 'md:col-span-7',
    accentVariant: 'charcoal',
  },
];

export const SECURITY_PROTOCOL_STEPS: ProtocolStep[] = [
  {
    stepNumber: '01',
    title: 'Entrevista Previa (15 min sin costo)',
    subtitle: 'Presentación en tu domicilio',
    description:
      'Nos conocemos antes del primer paseo en Puerta de Hierro, Av. Patria, Jardín Real o Valle Real para evaluar a tus mascotas y acordar tus bloques fijos.',
    durationBadge: 'Cortesía Inicial',
  },
  {
    stepNumber: '02',
    title: 'Colchón Logístico de 30 Minutos',
    subtitle: 'Puntualidad real entre zonas',
    description:
      'Dejamos 30 minutos libres entre cada cliente. Si terminamos a las 4:00 PM en Av. Patria, el siguiente bloque hacia Jardín Real o Valle Real se agenda a las 4:30 PM, jamás a las 4:10 PM.',
    durationBadge: 'Buffer 30 min',
  },
  {
    stepNumber: '03',
    title: 'Sesión Completa de 60 Minutos + GPS',
    subtitle: 'Ubicación en vivo e hidratación',
    description:
      'Tus 60 minutos son íntegros de paseo o cuidado en casa. Recibes link GPS en vivo por WhatsApp, pausas de agua fresca y ruta segura por zonas arboladas.',
    durationBadge: '60 Min Íntegros',
  },
  {
    stepNumber: '04',
    title: 'Patitas Limpias y Reporte Fotográfico',
    subtitle: 'Entrega impecable en casa',
    description:
      'Limpiamos patitas antes de entrar, dejamos agua fresca servida y te enviamos fotos y resumen de la sesión por WhatsApp.',
    durationBadge: 'Cierre de Sesión',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'manada-descuento',
    question: '¿Cómo funciona el descuento si tengo 2, 3 o 4 perros?',
    answer:
      'Paseamos exclusivamente perros de tu misma casa (jamás juntamos perros de desconocidos). Si tienes 1 mascota la tarifa es de $200 MXN/hr. Si tienes 2 o 3 mascotas aplica 5% de descuento ($190 MXN cada una). Si tienes 4 o más mascotas aplica 10% de descuento ($180 MXN cada una).',
    highlightTag: '1: $200 • 2-3: $190 c/u • 4+: $180 c/u',
  },
  {
    id: 'agenda-5-horas-traslado',
    question: '¿Por qué solo hay 5 bloques al día y 30 minutos entre cada uno?',
    answer:
      'Para garantizar calidad real y puntualidad en Puerta de Hierro, Av. Patria, Jardín Real y Valle Real, operamos máximo 5 horas al día de Lunes a Viernes. Entre cada sesión dejamos 30 minutos obligatorios de traslado (por ejemplo, si terminamos a las 4:00 PM en Av. Patria, el siguiente bloque disponible en Jardín Real es a las 4:30 PM). Así tu mascota recibe sus 60 minutos completos sin prisas.',
    highlightTag: 'Máximo 5 hrs/día + 30 min traslado',
  },
  {
    id: 'fines-de-semana-y-extras',
    question: '¿Trabajan los fines de semana o cuando ya se llenaron las 5 horas?',
    answer:
      'Nuestra agenda regular es de Lunes a Viernes (5 bloques diarios). Los Sábados y Domingos son días de descanso; sin embargo, puedes enviar una Solicitud Especial de Fin de Semana o de Hora Extra (#6) desde la calculadora con un cargo adicional por apertura de agenda, sujeta a confirmación directa.',
    highlightTag: 'Solicitud Especial con Cargo Extra',
  },
  {
    id: 'primera-visita',
    question: '¿Cómo funciona la primera visita y qué pasa si llueve o hace mucho calor?',
    answer:
      'Iniciamos con una entrevista de presentación de 15 minutos sin costo en tu casa. En días muy calurosos o de lluvia ajustamos el horario para proteger las almohadillas de las patas del asfalto caliente o cambiamos la sesión a enriquecimiento y cuidado dentro de casa.',
    highlightTag: 'Entrevista 15 min gratis + Protección climática',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    petName: 'Thor, Maya, Rocco y Nala',
    petBreed: 'Manada de 4 perros',
    ownerName: 'Alejandro G.',
    zone: 'Jardín Real',
    quote:
      'Tengo 4 perros y era un caos sacarlos. Con Alex salen los 4 juntos sin mezclarse con perros ajenos, me queda en $180 cada uno y llega puntualísimo con su bloque de las 4:30 PM.',
    serviceUsed: '4 Mascotas • $180 c/u (-10%)',
  },
  {
    id: 't2',
    petName: 'Bruno & Kira',
    petBreed: '2 Golden Retrievers',
    ownerName: 'Mariana V.',
    zone: 'Puerta de Hierro',
    quote:
      'Me encanta que solo toma 5 clientes al día y deja media hora para trasladarse. Siempre cumple la hora completa, veo el GPS en vivo y regresan con las patitas limpias.',
    serviceUsed: '2 Mascotas • $190 c/u (-5%)',
  },
  {
    id: 't3',
    petName: 'Milo',
    petBreed: 'Pastor Australiano',
    ownerName: 'Rodrigo S.',
    zone: 'Av. Patria',
    quote:
      'Mi bloque de 3:00 a 4:00 PM por Av. Patria es sagrado. Y cuando he necesitado un sábado de emergencia, lo pido como Solicitud Especial en la calculadora y me salva el fin de semana.',
    serviceUsed: 'Agenda Fija • Av. Patria',
  },
];
