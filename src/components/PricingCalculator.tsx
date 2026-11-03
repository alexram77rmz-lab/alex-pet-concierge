import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Award,
  CalendarClock,
  Car,
  CheckCircle2,
  Clock,
  Copy,
  Dog,
  Home,
  Info,
  Lock,
  MapPin,
  MessageCircle,
  Minus,
  PawPrint,
  Plus,
  Settings2,
  Sparkles,
  Tag,
  Unlock,
} from 'lucide-react';
import {
  ALL_ZONES,
  BASE_HOURLY_RATE,
  INITIAL_DAILY_SLOTS,
  MAX_DAILY_HOURS,
  OVERTIME_EXTRA_PER_HOUR,
  PRIORITY_ZONES,
  SERVICE_OPTIONS,
  WEEKEND_EXTRA_PER_HOUR,
  ZONE_TRAVEL_MINUTES,
  buildWhatsAppBookingUrl,
  buildWhatsAppMessage,
  calculateQuote,
  formatMXN,
} from '../config/constants';
import { DayCategory, ServiceType, TimeSlotItem, ZoneName } from '../types/concierge';

interface PricingCalculatorProps {
  onShowToast: (message: string) => void;
}

const STORAGE_KEY_SLOTS = 'alex_pet_concierge_daily_slots_v1';

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ onShowToast }) => {
  const [selectedService, setSelectedService] = useState<ServiceType>(
    'Paseo Privado / Manada Familiar (Perros)'
  );
  const [petCount, setPetCount] = useState<number>(2);
  const [hours, setHours] = useState<number>(1);
  const [zone, setZone] = useState<ZoneName>('Jardín Real');
  const [petName, setPetName] = useState<string>('');
  const [dayCategory, setDayCategory] = useState<DayCategory>('weekday');
  const [selectedDayName, setSelectedDayName] = useState<string>('Lunes a Viernes');

  // Estado de los 5 bloques diarios (con persistencia local para que Alex controle su agenda)
  const [dailySlots, setDailySlots] = useState<TimeSlotItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLOTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_DAILY_SLOTS;
  });

  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-5');
  const [requestExtraSlot, setRequestExtraSlot] = useState<boolean>(false);
  const [adminMode, setAdminMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(dailySlots));
    } catch {
      // ignore storage errors
    }
  }, [dailySlots]);

  const availableSlotsCount = useMemo(
    () => dailySlots.filter((s) => s.status === 'available').length,
    [dailySlots]
  );

  const bookedSlotsCount = MAX_DAILY_HOURS - availableSlotsCount;

  const isWeekend = dayCategory === 'weekend';
  const isExtraOvertimeSlot = requestExtraSlot || availableSlotsCount === 0;

  const quote = useMemo(
    () =>
      calculateQuote({
        petCount,
        hours,
        isWeekend,
        isExtraOvertimeSlot,
        zone,
      }),
    [petCount, hours, isWeekend, isExtraOvertimeSlot, zone]
  );

  // Calcula la logística de traslado con respecto al bloque anterior ocupado
  const travelLogisticsInfo = useMemo(() => {
    if (requestExtraSlot) {
      return {
        feasible: true,
        title: 'Solicitud de 6° Bloque Extra (18:00 – 19:00 hrs)',
        detail:
          'Fuera de las 5 horas regulares del día. Incluye +$50 MXN/hr por apertura de horario extra y 30 min de traslado desde el bloque de las 16:30.',
      };
    }

    const currentIndex = dailySlots.findIndex((s) => s.id === selectedSlotId);
    if (currentIndex === -1) return null;

    const currentSlot = dailySlots[currentIndex];
    const prevSlot = currentIndex > 0 ? dailySlots[currentIndex - 1] : null;

    if (prevSlot && prevSlot.status === 'booked' && prevSlot.bookedZone) {
      const travelMins =
        ZONE_TRAVEL_MINUTES[prevSlot.bookedZone]?.[zone] ?? 22;

      return {
        feasible: travelMins <= 30,
        prevZone: prevSlot.bookedZone,
        prevEndTime: prevSlot.endTime,
        nextStartTime: currentSlot.startTime,
        travelMins,
        title: `Logística verificada: ${prevSlot.bookedZone} (${prevSlot.endTime}) → ${zone} (${currentSlot.startTime})`,
        detail: `Termino a las ${prevSlot.endTime} en ${prevSlot.bookedZone}. El traslado a ${zone} toma ~${travelMins} min, por eso jamás agendamos a las ${
          prevSlot.endTime.split(':')[0]
        }:10, sino a las ${currentSlot.startTime} con 30 min de colchón seguro.`,
      };
    }

    return {
      feasible: true,
      title: `Bloque disponible en ${zone} (${currentSlot.timeRange})`,
      detail: `Cuenta con 30 minutos de colchón de traslado para llegar con puntualidad total a ${zone}.`,
    };
  }, [dailySlots, selectedSlotId, zone, requestExtraSlot]);

  const selectedSlotLabel = useMemo(() => {
    if (requestExtraSlot) return '18:00 – 19:00 hrs (6° Bloque Extra)';
    const found = dailySlots.find((s) => s.id === selectedSlotId);
    return found ? found.timeRange : 'Por definir';
  }, [dailySlots, selectedSlotId, requestExtraSlot]);

  const whatsappMessage = useMemo(
    () =>
      buildWhatsAppMessage({
        service: selectedService,
        petName,
        zone,
        selectedSlotLabel,
        dayLabel: isWeekend ? `Fin de Semana (${selectedDayName})` : selectedDayName,
        quote,
      }),
    [selectedService, petName, zone, selectedSlotLabel, isWeekend, selectedDayName, quote]
  );

  const whatsappUrl = useMemo(
    () =>
      buildWhatsAppBookingUrl({
        service: selectedService,
        petName,
        zone,
        selectedSlotLabel,
        dayLabel: isWeekend ? `Fin de Semana (${selectedDayName})` : selectedDayName,
        quote,
      }),
    [selectedService, petName, zone, selectedSlotLabel, isWeekend, selectedDayName, quote]
  );

  const toggleSlotStatusAdmin = (slotId: string) => {
    setDailySlots((prev) =>
      prev.map((slot) => {
        if (slot.id !== slotId) return slot;
        const nextStatus = slot.status === 'available' ? 'booked' : 'available';
        return {
          ...slot,
          status: nextStatus,
          bookedZone: nextStatus === 'booked' ? zone : undefined,
          bookedPetNote: nextStatus === 'booked' ? `Ocupado en ${zone}` : undefined,
        };
      })
    );
    onShowToast('Agenda de 5 horas actualizada.');
  };

  const changeBookedSlotZoneAdmin = (slotId: string, newZone: ZoneName) => {
    setDailySlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? { ...slot, bookedZone: newZone, bookedPetNote: `Ocupado en ${newZone}` }
          : slot
      )
    );
  };

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      onShowToast('Cotización y ruta copiada al portapapeles.');
    } catch {
      onShowToast('Listo para enviar por WhatsApp.');
    }
  };

  return (
    <section
      id="calculadora"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E3A2F]/10 dark:bg-white/10 text-[#1E3A2F] dark:text-[#E5E0D8] text-xs font-bold uppercase tracking-[0.18em]">
          <Sparkles className="w-4 h-4" />
          <span>Agenda Limitada a 5 Horas Diarias • Lunes a Viernes</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6]">
          Calculadora por Mascotas y{' '}
          <span className="font-serif italic font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">
            Control de Agenda
          </span>
        </h2>

        <p className="text-base sm:text-lg text-[#57534E] dark:text-stone-300">
          Tarifa base de <strong className="text-[#18181B] dark:text-white">$200 MXN</strong> (1 mascota),{' '}
          <strong className="text-[#1E3A2F] dark:text-emerald-400">$190 MXN c/u</strong> (2 a 3 mascotas) y{' '}
          <strong className="text-[#1E3A2F] dark:text-emerald-400">$180 MXN c/u</strong> (4+ mascotas).
          Cobertura en <strong>Puerta de Hierro, Av. Patria, Jardín Real y Valle Real</strong>.
        </p>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* LEFT COLUMN: Controls (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#141A17] border border-[#E5E0D8] dark:border-white/10 shadow-luxury p-6 sm:p-8 lg:p-10 space-y-8">
          {/* STEP 1: Service Selector */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#57534E] dark:text-stone-400">
                1. Tipo de Servicio
              </label>
              <span className="text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400">
                Solo mascotas de tu hogar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SERVICE_OPTIONS.map((option) => {
                const isSelected = selectedService === option.id;
                const IconComponent = option.id.includes('Paseo') ? Dog : Home;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedService(option.id)}
                    aria-pressed={isSelected}
                    className={`min-h-[64px] p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F] shadow-md'
                        : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10 hover:border-[#1E3A2F]/50'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-white/15 text-[#FAF9F6]'
                          : 'bg-[#E5E0D8]/70 dark:bg-white/10 text-[#1E3A2F] dark:text-[#E5E0D8]'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-bold leading-snug">{option.shortTitle}</p>
                      <p
                        className={`text-xs leading-relaxed ${
                          isSelected ? 'text-[#E5E0D8]' : 'text-[#57534E] dark:text-stone-400'
                        }`}
                      >
                        {option.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Número de Mascotas (Descuento directo por manada familiar) */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#57534E] dark:text-stone-400">
                2. ¿Cuántas mascotas son? (Descuento por grupo)
              </label>

              <AnimatePresence mode="wait">
                {quote.tierKey === 'pack_180' && (
                  <motion.span
                    key="pack-180"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1E3A2F] text-[#FAF9F6] text-xs font-bold"
                  >
                    <Award className="w-3.5 h-3.5 text-[#E5E0D8]" />
                    <span>$180 MXN c/u • 10% Descuento Manada</span>
                  </motion.span>
                )}
                {quote.tierKey === 'duo_190' && (
                  <motion.span
                    key="duo-190"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E5E0D8] dark:bg-emerald-950/80 text-[#1E3A2F] dark:text-emerald-300 text-xs font-bold"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>$190 MXN c/u • 5% Descuento</span>
                  </motion.span>
                )}
                {quote.tierKey === 'standard_200' && (
                  <motion.span
                    key="std-200"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] dark:bg-white/5 border border-[#DCD6CC] dark:border-white/15 text-[#57534E] dark:text-stone-300 text-xs font-semibold"
                  >
                    <span>1 Mascota • $200 MXN</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Pet Count Selector Cards (1 to 5 pets) */}
            <div className="grid grid-cols-5 gap-2.5">
              {[1, 2, 3, 4, 5].map((count) => {
                const isSelected = petCount === count;
                const priceEach = count === 1 ? 200 : count <= 3 ? 190 : 180;

                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setPetCount(count)}
                    className={`min-h-[68px] p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F] shadow-md ring-2 ring-[#1E3A2F]/25'
                        : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10 hover:border-[#1E3A2F]/50'
                    }`}
                  >
                    <span className="text-lg sm:text-xl font-extrabold">
                      {count} {count === 5 ? '+' : ''}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        isSelected ? 'text-[#E5E0D8]' : 'text-[#57534E] dark:text-stone-400'
                      }`}
                    >
                      {count === 1 ? 'mascota' : 'mascotas'}
                    </span>
                    <span
                      className={`text-[11px] font-bold mt-0.5 ${
                        isSelected
                          ? 'text-emerald-300'
                          : count >= 2
                          ? 'text-[#1E3A2F] dark:text-emerald-400'
                          : 'text-[#57534E]'
                      }`}
                    >
                      ${priceEach} c/u
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Hours / Sessions Selector */}
            <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8] dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 block">
                    Cantidad de Horas / Sesiones a reservar
                  </span>
                  <span className="text-xs text-[#57534E] dark:text-stone-400">
                    Jornada máxima de Alex: <strong>5 horas por día</strong> (puedes cotizar 1 hora o paquete semanal)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHours((h) => Math.max(1, h - 1))}
                    disabled={hours <= 1}
                    aria-label="Restar hora"
                    className="min-h-[44px] min-w-[44px] rounded-xl bg-white dark:bg-[#161D19] border border-[#DCD6CC] dark:border-white/15 flex items-center justify-center disabled:opacity-40 active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="min-w-[64px] text-center text-lg font-extrabold text-[#18181B] dark:text-[#FAF9F6]">
                    {hours} {hours === 1 ? 'hr' : 'hrs'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHours((h) => Math.min(10, h + 1))}
                    disabled={hours >= 10}
                    aria-label="Sumar hora"
                    className="min-h-[44px] min-w-[44px] rounded-xl bg-white dark:bg-[#161D19] border border-[#DCD6CC] dark:border-white/15 flex items-center justify-center disabled:opacity-40 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHours(h)}
                    className={`min-h-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      hours === h
                        ? 'bg-[#1E3A2F] text-[#FAF9F6]'
                        : 'bg-white dark:bg-[#161D19] text-[#18181B] dark:text-stone-200 border border-[#E5E0D8] dark:border-white/10'
                    }`}
                  >
                    {h} {h === 1 ? 'hora' : 'horas'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 3: Zona de Cobertura (Puerta de Hierro, Av. Patria, Jardín Real, Valle Real) */}
          <div className="space-y-3.5 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#57534E] dark:text-stone-400">
                3. Selecciona tu Zona (Para calcular tiempo de traslado)
              </label>
              <span className="text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400">
                Zapopan Poniente / Real
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRIORITY_ZONES.map((z) => {
                const active = zone === z;
                return (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setZone(z)}
                    className={`min-h-[52px] px-3 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 text-center transition-all active:scale-95 ${
                      active
                        ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F] shadow-sm'
                        : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-stone-200 border-[#E5E0D8] dark:border-white/10 hover:border-[#1E3A2F]/50'
                    }`}
                  >
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{z}</span>
                  </button>
                );
              })}
            </div>

            {/* Opción de zona extra */}
            <button
              type="button"
              onClick={() => setZone('Otra zona cercana (Cargo extra traslado)')}
              className={`min-h-[44px] w-full px-4 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                zone === 'Otra zona cercana (Cargo extra traslado)'
                  ? 'bg-amber-950/10 dark:bg-amber-950/40 border-amber-600 text-amber-900 dark:text-amber-200'
                  : 'bg-[#FAF9F6] dark:bg-[#0E1210] border-[#E5E0D8] dark:border-white/10 text-[#57534E] dark:text-stone-400'
              }`}
            >
              <span>¿Estás fuera de Puerta de Hierro, Av. Patria, Jardín Real o Valle Real?</span>
              <span className="font-bold">Solicitar Zona Extra (+$60 MXN traslado)</span>
            </button>
          </div>

          {/* STEP 4: Control de Agenda (5 Bloques Lunes a Viernes vs Fines de Semana Extra) */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#57534E] dark:text-stone-400 block">
                  4. Agenda del Día (Solo 5 Horas al Día • 30 min entre bloques)
                </label>
                <p className="text-xs text-[#57534E] dark:text-stone-400 mt-0.5">
                  Ocupación actual hoy:{' '}
                  <strong className="text-[#1E3A2F] dark:text-emerald-400">
                    {bookedSlotsCount} de {MAX_DAILY_HOURS} horas ocupadas
                  </strong>{' '}
                  ({availableSlotsCount} {availableSlotsCount === 1 ? 'bloque libre' : 'bloques libres'})
                </p>
              </div>

              {/* Botón Modo Control para Alex */}
              <button
                type="button"
                onClick={() => setAdminMode((prev) => !prev)}
                className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                  adminMode
                    ? 'bg-[#18181B] text-[#FAF9F6] border-[#18181B]'
                    : 'bg-[#FAF9F6] dark:bg-white/5 text-[#57534E] dark:text-stone-300 border-[#DCD6CC] dark:border-white/15'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{adminMode ? 'Cerrar Control de Alex' : 'Modo Control Alex'}</span>
              </button>
            </div>

            {/* Selector Lunes-Viernes vs Fin de Semana (Extra) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDayCategory('weekday');
                  setSelectedDayName('Lunes a Viernes');
                }}
                className={`min-h-[54px] p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  dayCategory === 'weekday'
                    ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]'
                    : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10'
                }`}
              >
                <div>
                  <p className="text-xs sm:text-sm font-bold">Lunes a Viernes (Agenda Normal)</p>
                  <p
                    className={`text-[11px] ${
                      dayCategory === 'weekday' ? 'text-[#E5E0D8]' : 'text-[#57534E] dark:text-stone-400'
                    }`}
                  >
                    5 bloques diarios • Sin cargo extra
                  </p>
                </div>
                <CalendarClock className="w-5 h-5 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setDayCategory('weekend');
                  setSelectedDayName('Sábado / Domingo');
                }}
                className={`min-h-[54px] p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  dayCategory === 'weekend'
                    ? 'bg-amber-900 text-[#FAF9F6] border-amber-800'
                    : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10'
                }`}
              >
                <div>
                  <p className="text-xs sm:text-sm font-bold">Sábado o Domingo (Descanso)</p>
                  <p
                    className={`text-[11px] ${
                      dayCategory === 'weekend'
                        ? 'text-amber-200'
                        : 'text-amber-700 dark:text-amber-400 font-semibold'
                    }`}
                  >
                    Solicitud Especial (+${WEEKEND_EXTRA_PER_HOUR} MXN/hr extra)
                  </p>
                </div>
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
              </button>
            </div>

            {/* Panel de Admin de Alex para ocupar/liberar cualquiera de sus 5 bloques */}
            {adminMode && (
              <div className="p-4 rounded-2xl bg-[#18181B] text-[#FAF9F6] space-y-3 border border-white/15">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Panel de Control de Alex — Marca qué bloques ya tienes ocupados hoy
                  </span>
                </div>
                <p className="text-xs text-[#E5E0D8]/80">
                  Toca cualquier bloque abajo para cambiarlo entre <strong>Libre</strong> y{' '}
                  <strong>Ocupado</strong> y asignarle en qué zona estás (ej. si terminas a las 16:00 en
                  Av. Patria, el bloque siguiente es hasta las 16:30 para alcanzar a llegar a Jardín Real).
                </p>
              </div>
            )}

            {/* Lista de los 5 Bloques Diarios con Buffer de 30 Minutos */}
            <div className="space-y-2.5">
              {dailySlots.map((slot) => {
                const isBooked = slot.status === 'booked';
                const isSelected = !requestExtraSlot && selectedSlotId === slot.id;

                return (
                  <div
                    key={slot.id}
                    className={`rounded-2xl border p-3.5 transition-all ${
                      isBooked
                        ? 'bg-[#E5E0D8]/45 dark:bg-white/5 border-[#DCD6CC] dark:border-white/10'
                        : isSelected
                        ? 'bg-[#1E3A2F]/10 dark:bg-emerald-950/40 border-[#1E3A2F] ring-1 ring-[#1E3A2F]'
                        : 'bg-[#FAF9F6] dark:bg-[#0E1210] border-[#E5E0D8] dark:border-white/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-start sm:items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-xl text-xs font-extrabold flex items-center justify-center shrink-0 ${
                            isBooked
                              ? 'bg-[#57534E]/20 text-[#57534E] dark:text-stone-400'
                              : isSelected
                              ? 'bg-[#1E3A2F] text-[#FAF9F6]'
                              : 'bg-[#E5E0D8] dark:bg-white/10 text-[#18181B] dark:text-[#FAF9F6]'
                          }`}
                        >
                          #{slot.slotNumber}
                        </span>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-[#18181B] dark:text-[#FAF9F6]">
                              {slot.timeRange}
                            </span>
                            {isBooked ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-red-900/15 dark:bg-red-500/20 text-red-800 dark:text-red-300 text-[11px] font-bold">
                                Ocupado en {slot.bookedZone}
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/15 dark:bg-emerald-500/20 text-[#1E3A2F] dark:text-emerald-300 text-[11px] font-bold">
                                Disponible
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#57534E] dark:text-stone-400 flex items-center gap-1 mt-0.5">
                            <Car className="w-3.5 h-3.5 text-[#1E3A2F] dark:text-emerald-400 shrink-0" />
                            <span>Colchón post-servicio: {slot.bufferAfter}</span>
                          </p>
                        </div>
                      </div>

                      {/* Botón de selección de bloque o control Admin */}
                      <div className="flex items-center gap-2">
                        {adminMode ? (
                          <div className="flex items-center gap-2">
                            {isBooked && (
                              <select
                                value={slot.bookedZone || 'Av. Patria'}
                                onChange={(e) =>
                                  changeBookedSlotZoneAdmin(slot.id, e.target.value as ZoneName)
                                }
                                className="min-h-[38px] px-2 rounded-lg bg-white dark:bg-[#18181B] border border-[#DCD6CC] text-xs font-semibold"
                              >
                                {ALL_ZONES.map((z) => (
                                  <option key={z} value={z}>
                                    {z}
                                  </option>
                                ))}
                              </select>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleSlotStatusAdmin(slot.id)}
                              className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 ${
                                isBooked
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-red-700 text-white'
                              }`}
                            >
                              {isBooked ? (
                                <>
                                  <Unlock className="w-3.5 h-3.5" /> Liberar
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5" /> Ocupar
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={isBooked}
                            onClick={() => {
                              setRequestExtraSlot(false);
                              setSelectedSlotId(slot.id);
                            }}
                            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              isBooked
                                ? 'bg-stone-200 dark:bg-white/5 text-stone-400 cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#1E3A2F] text-[#FAF9F6] shadow-sm'
                                : 'bg-white dark:bg-[#161D19] text-[#18181B] dark:text-[#FAF9F6] border border-[#DCD6CC] dark:border-white/15 hover:bg-[#E5E0D8]/50'
                            }`}
                          >
                            {isBooked ? 'Hora Ocupada' : isSelected ? 'Bloque Elegido ✓' : 'Elegir Bloque'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Opción de Solicitar 6° Hora Extra cuando la agenda se ocupa o requieren horario especial */}
              <div
                className={`rounded-2xl border p-4 transition-all ${
                  requestExtraSlot
                    ? 'bg-amber-950/15 dark:bg-amber-950/40 border-amber-600'
                    : 'bg-[#FAF9F6] dark:bg-[#0E1210] border-dashed border-[#DCD6CC] dark:border-white/15'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                      ¿Agenda llena o necesitas un 6° espacio especial (18:00 – 19:00)?
                    </span>
                    <p className="text-xs text-[#57534E] dark:text-stone-300">
                      Solo trabajo 5 horas al día, pero puedes solicitar una <strong>Hora Extra</strong> sujeta a
                      confirmación (+${OVERTIME_EXTRA_PER_HOUR} MXN/hr).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRequestExtraSlot((prev) => !prev)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      requestExtraSlot
                        ? 'bg-amber-800 text-white'
                        : 'bg-[#E5E0D8]/80 dark:bg-white/10 text-[#18181B] dark:text-[#FAF9F6]'
                    }`}
                  >
                    {requestExtraSlot ? 'Solicitud Hora Extra Activa ✓' : 'Solicitar Hora Extra (+$' + OVERTIME_EXTRA_PER_HOUR + ')'}
                  </button>
                </div>
              </div>
            </div>

            {/* Banner inteligente de validación de traslado (Ej. Av. Patria 4:00 PM -> Jardín Real 4:30 PM) */}
            {travelLogisticsInfo && (
              <div className="p-4 rounded-2xl bg-[#1E3A2F]/10 dark:bg-emerald-950/40 border border-[#1E3A2F]/25 dark:border-emerald-700/40 flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#1E3A2F] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="font-bold text-[#18181B] dark:text-[#FAF9F6]">
                    {travelLogisticsInfo.title}
                  </p>
                  <p className="text-[#57534E] dark:text-stone-300 leading-relaxed">
                    {travelLogisticsInfo.detail}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* STEP 5: Nombre de las Mascotas */}
          <div className="space-y-2 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <label
              htmlFor="pet-name-input"
              className="text-xs font-bold uppercase tracking-[0.16em] text-[#57534E] dark:text-stone-400 flex items-center gap-1.5"
            >
              <PawPrint className="w-3.5 h-3.5 text-[#1E3A2F] dark:text-emerald-400" />
              <span>5. Nombre de tu(s) mascota(s) y raza (Opcional)</span>
            </label>
            <input
              id="pet-name-input"
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Ej. Bruno y Kira (Golden), o mis 4 perritos..."
              className="min-h-[48px] w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#DCD6CC] dark:border-white/15 text-sm text-[#18181B] dark:text-[#FAF9F6] placeholder:text-[#57534E]/60 focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Resumen Financiero y de Agenda en Vivo (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 rounded-3xl bg-[#1E3A2F] text-[#FAF9F6] p-6 sm:p-8 shadow-luxury space-y-6 border border-[#2A5041]">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/15">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#E5E0D8]/80 font-semibold">
                Resumen de Reserva y Ruta
              </p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">{selectedService}</h3>
              <p className="text-xs text-[#E5E0D8] mt-1">
                Zona: <strong>{zone}</strong> • Bloque: <strong>{selectedSlotLabel}</strong>
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E5E0D8] text-[#18181B] text-[11px] font-extrabold uppercase tracking-wider shrink-0">
              ${quote.ratePerPetAfterDiscount} c/u
            </span>
          </div>

          {/* Desglose Financiero en Vivo */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-[#FAF9F6]/85">
              <span>
                Tarifa base ({quote.petCount} {quote.petCount === 1 ? 'mascota' : 'mascotas'} × $
                {BASE_HOURLY_RATE} × {quote.hours} {quote.hours === 1 ? 'hr' : 'hrs'})
              </span>
              <span className="font-semibold">{formatMXN(quote.subtotalBase)} MXN</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#E5E0D8]">
                Descuento aplicado ({quote.discountPercentage}% → ${quote.ratePerPetAfterDiscount} c/u)
              </span>
              <span
                className={`font-bold ${
                  quote.discountAmount > 0 ? 'text-emerald-300' : 'text-[#FAF9F6]/60'
                }`}
              >
                {quote.discountAmount > 0 ? `-${formatMXN(quote.discountAmount)} MXN` : '$0 MXN (0%)'}
              </span>
            </div>

            {quote.isWeekend && (
              <div className="flex items-center justify-between text-amber-300">
                <span>Cargo Solicitud Fin de Semana (Sáb/Dom)</span>
                <span className="font-bold">+{formatMXN(quote.weekendSurcharge)} MXN</span>
              </div>
            )}

            {quote.isExtraOvertimeSlot && (
              <div className="flex items-center justify-between text-amber-300">
                <span>Cargo Hora Extra (Fuera de las 5 hrs diarias)</span>
                <span className="font-bold">+{formatMXN(quote.extraSlotSurcharge)} MXN</span>
              </div>
            )}

            {quote.isOutZone && (
              <div className="flex items-center justify-between text-amber-300">
                <span>Cargo Traslado Zona Extra</span>
                <span className="font-bold">+{formatMXN(quote.outZoneSurcharge)} MXN</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[#FAF9F6]/90 pt-2 border-t border-white/10">
              <span>Costo por mascota / hora</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/10 font-bold text-[#E5E0D8]">
                {formatMXN(quote.ratePerPetAfterDiscount)} MXN c/u
              </span>
            </div>

            <div className="pt-4 border-t border-white/20 flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E5E0D8]/80 block">
                  Total Estimado
                </span>
                <span className="text-[11px] text-[#E5E0D8]/70">
                  {quote.petCount} {quote.petCount === 1 ? 'mascota' : 'mascotas'} • {quote.hours}{' '}
                  {quote.hours === 1 ? 'hora' : 'horas'}
                </span>
              </div>
              <motion.span
                key={quote.total}
                initial={{ opacity: 0.6, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FAF9F6]"
              >
                {formatMXN(quote.total)} <span className="text-base font-semibold text-[#E5E0D8]">MXN</span>
              </motion.span>
            </div>
          </div>

          {/* Nota de Control de Agenda */}
          <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-2 text-xs text-[#E5E0D8]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>
                30 min de margen entre bloques (Av. Patria ↔ Jardín Real / Valle Real / Puerta de Hierro)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>
                Solo 5 horas de trabajo al día para garantizar 100% de energía y puntualidad
              </span>
            </div>
          </div>

          {/* Vista previa del mensaje de WhatsApp */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#E5E0D8]/80">
              <span>Mensaje listo para enviar a Alex:</span>
              <button
                type="button"
                onClick={handleCopyQuote}
                className="min-h-[36px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[#FAF9F6] inline-flex items-center gap-1 text-[11px] font-medium transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </button>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#142820] border border-white/10 text-xs text-[#FAF9F6]/90 leading-relaxed italic">
              “{whatsappMessage}”
            </div>
          </div>

          {/* Botón CTA Principal */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onShowToast('Abriendo WhatsApp con tu bloque, zona y cotización...')}
            className="min-h-[54px] w-full px-6 py-4 rounded-2xl bg-[#FAF9F6] hover:bg-[#E5E0D8] text-[#18181B] font-bold text-base tracking-wide shadow-lg flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5 text-[#1E3A2F] fill-[#1E3A2F]/15" />
            <span>
              {quote.isWeekend || quote.isExtraOvertimeSlot
                ? 'Enviar Solicitud Especial por WhatsApp'
                : 'Reservar Bloque por WhatsApp'}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
