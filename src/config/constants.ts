import {
  BentoServiceItem,
  FaqItem,
  ProtocolStep,
  QuoteBreakdown,
  ServiceType,
  TestimonialItem,
} from '../types/concierge';

/**
 * Número de WhatsApp de Alex Pet Concierge (formato internacional sin '+' ni espacios).
 * Reemplaza los dígitos finales con tu línea directa de atención.
 */
export const WHATSAPP_PHONE = '525500000000';

export const INSTAGRAM_URL = 'https://instagram.com/alexpetconcierge';

export const BASE_HOURLY_RATE = 200; // $200 MXN por hora / sesión

export const SERVICE_OPTIONS: {
  id: ServiceType;
  shortTitle: string;
  subtitle: string;
  unitLabel: string;
  idealFor: string;
}[] = [
  {
    id: 'Paseo Privado (Perros)',
    shortTitle: 'Paseo Privado (Perros)',
    subtitle: 'Exclusivo 1 a 1 • Cero manadas • Ruta GPS e hidratación',
    unitLabel: 'horas de paseo',
    idealFor: 'Perros que merecen atención indivisa, ritmo propio y cero estrés con desconocidos.',
  },
  {
    id: 'Cuidado en Casa (Gatos / Perros)',
    shortTitle: 'Cuidado en Casa (Gatos / Perros)',
    subtitle: 'Visitas de 60 min a domicilio • Areneros, alimento y compañía',
    unitLabel: 'sesiones en casa',
    idealFor: 'Gatos o perros hogareños que prefieren la calma y seguridad de su propio territorio.',
  },
];

export const PRIORITY_ZONES = [
  'Polanco',
  'Condesa',
  'Roma Norte',
  'Lomas de Chapultepec',
  'Del Valle',
  'Nápoles',
  'Coyoacán',
  'Santa Fe',
];

/**
 * Regla de Negocio Estricta:
 * - 1 hora / sesión: 0% descuento -> $200/hr -> Total $200 MXN
 * - 2 a 4 horas / sesiones: 5% descuento automático -> $190/hr
 * - 5 a 10 horas / sesiones: 10% descuento automático -> $180/hr
 */
export function calculateQuote(rawHours: number): QuoteBreakdown {
  const hours = Math.min(10, Math.max(1, Math.round(rawHours)));
  const baseRate = BASE_HOURLY_RATE;
  const subtotal = hours * baseRate;

  let discountPercentage = 0;
  let tierKey: QuoteBreakdown['tierKey'] = 'single';
  let tierBadge = 'Tarifa estándar por sesión única (descuentos aplican a partir de paquetes)';
  let tierHelperText = 'Agrega 1 hora más para desbloquear el 5% de descuento automático ($190/hr).';

  if (hours >= 2 && hours <= 4) {
    discountPercentage = 5;
    tierKey = 'package_5';
    tierBadge = 'Paquete Esencial • 5% de Descuento Automático Aplicado';
    tierHelperText = `Estás ahorrando $${subtotal * 0.05} MXN. A partir de 5 horas obtienes el 10% ($180/hr).`;
  } else if (hours >= 5) {
    discountPercentage = 10;
    tierKey = 'package_10';
    tierBadge = 'Máximo Ahorro • Cliente Frecuente';
    tierHelperText = `Tarifa preferencial activa de $180 MXN/hr. Ahorras $${subtotal * 0.1} MXN en tu paquete.`;
  }

  const finalHourlyRate = Math.round(baseRate * (1 - discountPercentage / 100));
  const total = hours * finalHourlyRate;
  const discountAmount = subtotal - total;

  return {
    hours,
    baseRate,
    discountPercentage,
    finalHourlyRate,
    subtotal,
    discountAmount,
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
  zone: string;
  quote: QuoteBreakdown;
}): string {
  const cleanPetName = params.petName.trim() || 'mi mascota';
  const cleanZone = params.zone.trim() || 'mi zona';
  const { hours, discountPercentage, total } = params.quote;

  return `Hola Alex, quiero agendar el servicio de ${params.service} para ${cleanPetName} en ${cleanZone}. Seleccioné el paquete de ${hours} ${
    hours === 1 ? 'hora' : 'horas'
  } con el ${discountPercentage}% de descuento (Total: $${total.toLocaleString(
    'es-MX'
  )} MXN). ¿Tienes disponibilidad?`;
}

export function buildWhatsAppBookingUrl(params: {
  service: ServiceType;
  petName: string;
  zone: string;
  quote: QuoteBreakdown;
}): string {
  const message = buildWhatsAppMessage(params);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export const BENTO_SERVICES: BentoServiceItem[] = [
  {
    id: 'paseos-privados',
    tag: 'EXCLUSIVIDAD 1 A 1',
    title: 'Paseos Privados (Solo tu mascota)',
    description:
      'Sin estrés ni peleas. Atención 100% enfocada en el ritmo, olfato y energía de tu perro. Jamás mezclamos perros de distintas casas ni realizamos paseos masivos.',
    highlights: [
      'Rutas seleccionadas por zonas arboladas y seguras',
      'Adaptado a cachorros, adultos activos o perros senior',
      'Hidratación con agua purificada y plato portátil higienizado',
    ],
    metricLabel: 'Proporción de Cuidado',
    metricValue: '1 Concierge : 1 Mascota',
    spanClass: 'md:col-span-7',
    accentVariant: 'forest',
  },
  {
    id: 'cat-home-sitting',
    tag: 'CUIDADO EN SU TERRITORIO',
    title: 'Cat & Home Sitting',
    description:
      'Visitas a domicilio de 60 minutos para gatos o perros que prefieren la paz de su propio espacio. Limpieza profunda de areneros, alimentación precisa, renovación de fuentes de agua, juego e interacción afectiva.',
    highlights: [
      'Cero estrés de traslado o jaulas de pensión',
      'Respeto absoluto a rutinas dietéticas y medicación oral',
      'Revisión de seguridad del hogar, plantas y ventilación',
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
      'Ubicación en vivo por WhatsApp durante todo el servicio y bitácora digital al finalizar con hora exacta de inicio, mapa de ruta recorrida, registro de hidratación y fotografías editoriales.',
    highlights: [
      'Link de ubicación GPS en tiempo real desde que salimos',
      'Reporte de ánimo, necesidades fisiológicas e hidratación',
      'Álbum de fotos y video corto en alta resolución',
    ],
    metricLabel: 'Trazabilidad',
    metricValue: 'GPS Activo + Bitácora Final',
    spanClass: 'md:col-span-5',
    accentVariant: 'alabaster',
  },
  {
    id: 'limpieza-patitas',
    tag: 'PROTOCOLO HOGAR IMPECABLE',
    title: 'Limpieza al Regresar',
    description:
      'Limpiamos delicadamente las patitas con espuma hipoalergénica y toalla suave antes de entrar a tu casa para cuidar tus pisos, alfombras y muebles tanto como a tu mascota.',
    highlights: [
      'Inspección de almohadillas al terminar cada paseo',
      'Bálsamo humectante natural en días secos o templados',
      'Dejamos a tu mascota relajada, hidratada y lista para descansar',
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
    title: 'Entrevista de Presentación (Meet & Greet)',
    subtitle: 'Sin costo • 15 minutos en tu domicilio',
    description:
      'Antes del primer servicio nos conocemos en persona. Evaluamos el temperamento de tu mascota, revisamos su arnés, rutinas de salud y firmamos la entrega segura de acceso si lo requieres.',
    durationBadge: 'Cortesía Inicial',
  },
  {
    stepNumber: '02',
    title: 'Check-In y Ubicación GPS en Vivo',
    subtitle: 'Notificación instantánea al iniciar',
    description:
      'En el minuto uno recibes por WhatsApp la ubicación en tiempo real y confirmación de inicio. Sabes exactamente por dónde caminamos o el estado de tu mascota en casa en todo momento.',
    durationBadge: 'Minuto 01',
  },
  {
    stepNumber: '03',
    title: 'Paseo Consciente o Cuidado en Casa',
    subtitle: 'Protocolo térmico, hidratación y enriquecimiento',
    description:
      'Aplicamos la regla de los 5 segundos en asfalto, evitamos cruces conflictivos, respetamos tiempos de olfateo descompresivo e hidratamos con agua fresca a mitad y final de la sesión.',
    durationBadge: '60 Minutos',
  },
  {
    stepNumber: '04',
    title: 'Ritual de Regreso, Patitas Limpias y Bitácora',
    subtitle: 'Hogar impecable y reporte completo',
    description:
      'Limpiamos patitas antes de cruzar tu puerta, renovamos su plato de agua y te enviamos la bitácora de cierre con fotografías, distancia recorrida y observaciones de bienestar.',
    durationBadge: 'Cierre de Sesión',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'primera-visita',
    question: '¿Cómo funciona la primera visita?',
    answer:
      'Todo servicio comienza con una breve entrevista de presentación ("Meet & Greet") de 15 minutos sin costo en tu domicilio. Este encuentro nos permite conocer a tu perro o gato en su entorno seguro, observar su lenguaje corporal, revisar su equipo de paseo (collar/arnés), anotar instrucciones de alimentación o limpieza de arenero y resolver cualquier duda antes de su primera sesión.',
    highlightTag: 'Entrevista de 15 min sin costo',
  },
  {
    id: 'lluvia-o-calor',
    question: '¿Qué pasa si llueve o hace mucho calor?',
    answer:
      'La integridad física de tu mascota es innegociable. En días calurosos aplicamos estrictamente la prueba térmica del asfalto y ajustamos los horarios hacia las horas más frescas de la mañana o tarde-noche para proteger las almohadillas de sus patas, priorizando camellones arbolados e hidratación continua. Si se presenta lluvia intensa o tormenta eléctrica, reprogramamos sin penalización o sustituimos el paseo por una sesión en casa de juego interactivo, enriquecimiento olfativo y compañía.',
    highlightTag: 'Protección de almohadillas y clima',
  },
  {
    id: 'paquetes-vigencia',
    question: '¿Cómo funcionan los paquetes con descuento y qué vigencia tienen?',
    answer:
      'Puedes reservar desde 1 sesión individual ($200 MXN) o adquirir paquetes de 2 a 4 horas con 5% de descuento ($190 MXN/hr) y de 5 a 10 horas con 10% de descuento ($180 MXN/hr). Tus horas adquiridas tienen una vigencia flexible de 60 días naturales y puedes distribuirlas en los días y horarios que mejor se adapten a tu agenda semanal.',
    highlightTag: 'Vigencia flexible de 60 días',
  },
  {
    id: 'mascotas-reactivas-senior',
    question: '¿Atienden perros tímidos, reactivos o mascotas senior con cuidados especiales?',
    answer:
      'Sí. Precisamente porque nuestro servicio es 100% individual (cero manadas), somos la opción ideal para perros que se estresan con otros animales, cachorros en etapa de habituación o perros y gatos senior que requieren un ritmo pausado, paciencia absoluta o administración puntual de medicamentos.',
    highlightTag: 'Especialistas en trato individual',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    petName: 'Bruno',
    petBreed: 'Golden Retriever • 4 años',
    ownerName: 'Mariana V.',
    zone: 'Polanco',
    quote:
      'Antes contrataba paseadores grupales y Bruno regresaba ansioso y sucio. Con Alex sale él solo, veo su ruta en vivo por WhatsApp y regresa relajado con las patitas impecables.',
    serviceUsed: 'Paquete 10 hrs • Paseo Privado',
  },
  {
    id: 't2',
    petName: 'Oliva & Miso',
    petBreed: 'Gatos Europeos • 2 y 5 años',
    ownerName: 'Santiago R.',
    zone: 'Condesa',
    quote:
      'Viajo por trabajo tres días al mes y dejar a mis gatos en casa con el servicio de Cat Sitting de Alex me da paz total. Areneros limpios, fuentes frescas y videos en cada visita.',
    serviceUsed: 'Paquete 6 sesiones • Cat Sitting',
  },
  {
    id: 't3',
    petName: 'Kala',
    petBreed: 'Border Collie • 7 años',
    ownerName: 'Fernanda L.',
    zone: 'Roma Norte',
    quote:
      'La puntualidad, el cuidado con el calor de la tarde y el reporte fotográfico al terminar justifican cada peso. Es realmente un servicio de concierge privado.',
    serviceUsed: 'Cliente Frecuente • Paseo 1 a 1',
  },
];
