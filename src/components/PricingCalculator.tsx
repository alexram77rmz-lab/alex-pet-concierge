import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Copy,
  Dog,
  Home,
  Info,
  MapPin,
  MessageCircle,
  Minus,
  PawPrint,
  Plus,
} from 'lucide-react';
import {
  ALL_ZONES,
  BASE_HOURLY_RATE,
  SERVICE_OPTIONS,
  WEEKLY_CALENDAR,
  WHATSAPP_DISPLAY,
  buildWhatsAppBookingUrl,
  buildWhatsAppMessage,
  calculateQuote,
  evaluateDaySlotsWithAutoBuffer,
  formatMXN,
} from '../config/constants';
import { ServiceType, ZoneName } from '../types/concierge';

interface PricingCalculatorProps {
  onShowToast: (message: string) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ onShowToast }) => {
  const [selectedService, setSelectedService] = useState<ServiceType>('Paseo Privado (Perros)');
  const [petCount, setPetCount] = useState<number>(1);
  const [hours, setHours] = useState<number>(1);
  const [zone, setZone] = useState<ZoneName>('Jardín Real');
  const [customZoneText, setCustomZoneText] = useState<string>('');
  const [petName, setPetName] = useState<string>('');

  // Calendario (Lunes a Domingo, de 10:00 a.m. a 9:00 p.m.)
  const [selectedDayId, setSelectedDayId] = useState<string>('lun');
  const [selectedSlotRange, setSelectedSlotRange] = useState<string>('12:00 p.m. – 1:00 p.m.');
  const [requestExtraSlot, setRequestExtraSlot] = useState<boolean>(false);

  const activeDay = useMemo(
    () => WEEKLY_CALENDAR.find((d) => d.id === selectedDayId) || WEEKLY_CALENDAR[0],
    [selectedDayId]
  );

  // Evalúa automáticamente qué horas se separan por traslado según la zona elegida
  const evaluatedSlots = useMemo(
    () => evaluateDaySlotsWithAutoBuffer(activeDay, zone),
    [activeDay, zone]
  );

  // Si el usuario cambia de zona y la hora que tenía elegida ahora queda pegada a otra zona distinta,
  // el sistema la mueve automáticamente a la siguiente hora separada disponible.
  useEffect(() => {
    if (activeDay.isWeekend || requestExtraSlot) return;
    const current = evaluatedSlots.find((s) => s.timeRange === selectedSlotRange);
    if (!current || current.effectiveStatus !== 'available') {
      const nextAvailable = evaluatedSlots.find((s) => s.effectiveStatus === 'available');
      if (nextAvailable) {
        setSelectedSlotRange(nextAvailable.timeRange);
      }
    }
  }, [zone, activeDay, evaluatedSlots, selectedSlotRange, requestExtraSlot]);

  const handleSelectDay = (dayId: string) => {
    setSelectedDayId(dayId);
    const dayObj = WEEKLY_CALENDAR.find((d) => d.id === dayId);
    if (!dayObj) return;
    if (dayObj.isWeekend) {
      setRequestExtraSlot(true);
      setSelectedSlotRange('Horario de fin de semana a acordar');
    } else {
      setRequestExtraSlot(false);
      const smart = evaluateDaySlotsWithAutoBuffer(dayObj, zone);
      const firstAvailable = smart.find((s) => s.effectiveStatus === 'available');
      setSelectedSlotRange(firstAvailable ? firstAvailable.timeRange : 'Horario extra a acordar');
    }
  };

  const quote = useMemo(
    () =>
      calculateQuote({
        petCount,
        hours,
        isWeekend: activeDay.isWeekend,
        isExtraSlot: requestExtraSlot,
        zone,
      }),
    [petCount, hours, activeDay.isWeekend, requestExtraSlot, zone]
  );

  const whatsappMessage = useMemo(
    () =>
      buildWhatsAppMessage({
        service: selectedService,
        petName,
        zone,
        customZoneText,
        dayName: activeDay.dayName,
        slotLabel: requestExtraSlot ? 'Horario Especial / Extra' : selectedSlotRange,
        quote,
      }),
    [selectedService, petName, zone, customZoneText, activeDay.dayName, requestExtraSlot, selectedSlotRange, quote]
  );

  const whatsappUrl = useMemo(
    () =>
      buildWhatsAppBookingUrl({
        service: selectedService,
        petName,
        zone,
        customZoneText,
        dayName: activeDay.dayName,
        slotLabel: requestExtraSlot ? 'Horario Especial / Extra' : selectedSlotRange,
        quote,
      }),
    [selectedService, petName, zone, customZoneText, activeDay.dayName, requestExtraSlot, selectedSlotRange, quote]
  );

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      onShowToast('Resumen copiado al portapapeles.');
    } catch {
      onShowToast('Listo para enviar por WhatsApp.');
    }
  };

  return (
    <section
      id="calculadora"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Encabezado limpio */}
      <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#E5E0D8]/70 dark:bg-white/10 text-[#1E3A2F] dark:text-[#E5E0D8] text-xs font-bold uppercase tracking-widest">
          Horario de 10:00 a.m. a 9:00 p.m. • Máximo 5 Horas al Día
        </span>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6]">
          Calcula tu tarifa y elige tu horario
        </h2>

        <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300">
          1 mascota: <strong>$200 MXN</strong> • 2 a 3 mascotas: <strong>$190 c/u</strong> • 4 o más mascotas:{' '}
          <strong>$180 c/u</strong>. Cobertura normal en{' '}
          <strong>Puerta de Hierro, Av. Patria, Jardín Real y Valle Real</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Controles y Calendario Inteligente (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#141A17] border border-[#E5E0D8] dark:border-white/10 shadow-card p-5 sm:p-8 space-y-7">
          {/* 1. Servicio */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400">
              1. Servicio
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map((option) => {
                const isSelected = selectedService === option.id;
                const IconComponent = option.id.includes('Paseo') ? Dog : Home;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedService(option.id)}
                    className={`min-h-[56px] p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]'
                        : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">{option.shortTitle}</p>
                      <p
                        className={`text-xs ${
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

          {/* 2. Mascotas y Horas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 block">
                2. ¿Cuántas mascotas son?
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = petCount === n;
                  const price = n === 1 ? 200 : n <= 3 ? 190 : 180;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPetCount(n)}
                      className={`min-h-[54px] rounded-xl border flex flex-col items-center justify-center transition-all ${
                        active
                          ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]'
                          : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10'
                      }`}
                    >
                      <span className="text-sm font-bold">{n === 5 ? '5+' : n}</span>
                      <span className="text-[10px] opacity-80">${price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 block">
                Horas / Sesiones (Máx 5/día)
              </label>
              <div className="min-h-[54px] px-3 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8] dark:border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setHours((h) => Math.max(1, h - 1))}
                  disabled={hours <= 1}
                  aria-label="Menos horas"
                  className="min-h-[40px] min-w-[40px] rounded-lg bg-white dark:bg-[#161D19] border border-[#DCD6CC] dark:border-white/15 flex items-center justify-center disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <span className="text-base font-bold text-[#18181B] dark:text-[#FAF9F6]">
                    {hours} {hours === 1 ? 'hora' : 'horas'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHours((h) => Math.min(10, h + 1))}
                  disabled={hours >= 10}
                  aria-label="Más horas"
                  className="min-h-[40px] min-w-[40px] rounded-lg bg-white dark:bg-[#161D19] border border-[#DCD6CC] dark:border-white/15 flex items-center justify-center disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Zona (Activa la separación automática de horas según ubicación) */}
          <div className="space-y-2.5 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <label className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 block">
              3. Selecciona tu Zona (El calendario separa horas automáticamente según traslado)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_ZONES.map((z) => {
                const active = zone === z;
                return (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setZone(z)}
                    className={`min-h-[46px] px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 text-left transition-all ${
                      active
                        ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]'
                        : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-stone-200 border-[#E5E0D8] dark:border-white/10'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{z}</span>
                  </button>
                );
              })}
            </div>

            {zone === 'Otra zona (Confirmar por WhatsApp)' && (
              <div className="pt-1">
                <input
                  type="text"
                  value={customZoneText}
                  onChange={(e) => setCustomZoneText(e.target.value)}
                  placeholder="Escribe tu colonia (te confirmo por WhatsApp si aplica algún extra)"
                  className="min-h-[44px] w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#DCD6CC] dark:border-white/15 text-xs sm:text-sm"
                />
              </div>
            )}
          </div>

          {/* 4. Calendario Semanal con Separación Automática (10:00 a.m. a 9:00 p.m.) */}
          <div className="space-y-3.5 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#1E3A2F] dark:text-emerald-400" />
                <span>4. Horarios (10:00 a.m. a 9:00 p.m. • Separados para puntualidad)</span>
              </label>
            </div>

            {/* Pestañas de días Lun - Dom */}
            <div className="grid grid-cols-7 gap-1.5">
              {WEEKLY_CALENDAR.map((day) => {
                const isSelected = selectedDayId === day.id;
                const smartSlots = evaluateDaySlotsWithAutoBuffer(day, zone);
                const freeCount = smartSlots.filter((s) => s.effectiveStatus === 'available').length;

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleSelectDay(day.id)}
                    className={`min-h-[58px] p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]'
                        : day.isWeekend
                        ? 'bg-[#FAF9F6]/60 dark:bg-white/5 text-[#57534E] dark:text-stone-400 border-dashed border-[#DCD6CC] dark:border-white/10'
                        : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10'
                    }`}
                  >
                    <span className="text-xs font-bold">{day.dayShort}</span>
                    <span
                      className={`text-[10px] mt-0.5 ${
                        isSelected
                          ? 'text-[#E5E0D8]'
                          : day.isWeekend
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-[#1E3A2F] dark:text-emerald-400'
                      }`}
                    >
                      {day.isWeekend ? 'Extra' : `${freeCount} disp.`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Horas del día seleccionado con Separación Automática */}
            {activeDay.isWeekend ? (
              <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8] dark:border-white/10 space-y-2 text-xs sm:text-sm">
                <p className="font-bold text-[#18181B] dark:text-[#FAF9F6]">
                  {activeDay.dayName}: Día de descanso regular
                </p>
                <p className="text-[#57534E] dark:text-stone-300">
                  Los fines de semana normalmente no laboro, pero puedes enviarme tu solicitud por WhatsApp y
                  acordamos si tengo espacio.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {evaluatedSlots.map((slot) => {
                    const isUnavailable = slot.effectiveStatus !== 'available';
                    const isSelected = !requestExtraSlot && selectedSlotRange === slot.timeRange;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isUnavailable}
                        onClick={() => {
                          setRequestExtraSlot(false);
                          setSelectedSlotRange(slot.timeRange);
                        }}
                        className={`min-h-[54px] px-3.5 py-2.5 rounded-xl border text-left flex flex-col justify-center transition-all ${
                          slot.effectiveStatus === 'booked'
                            ? 'bg-[#E5E0D8]/40 dark:bg-white/5 border-[#E5E0D8] dark:border-white/5 text-[#57534E]/60 dark:text-stone-500 cursor-not-allowed'
                            : slot.effectiveStatus === 'auto_buffer'
                            ? 'bg-amber-950/5 dark:bg-amber-950/20 border-dashed border-amber-600/30 text-[#57534E]/75 dark:text-stone-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F] shadow-sm'
                            : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10 hover:border-[#1E3A2F]/50'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {slot.effectiveStatus === 'auto_buffer' ? (
                              <Car className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 shrink-0 opacity-75" />
                            )}
                            <span className="text-xs sm:text-sm font-bold">{slot.timeRange}</span>
                          </div>

                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              slot.effectiveStatus === 'booked'
                                ? 'bg-stone-300/50 dark:bg-white/5 text-[#57534E] dark:text-stone-400'
                                : slot.effectiveStatus === 'auto_buffer'
                                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                                : isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-[#1E3A2F]/10 dark:bg-emerald-500/20 text-[#1E3A2F] dark:text-emerald-300'
                            }`}
                          >
                            {slot.effectiveStatus === 'booked'
                              ? `Ocupado (${slot.bookedZone})`
                              : slot.effectiveStatus === 'auto_buffer'
                              ? 'Tiempo de traslado'
                              : isSelected
                              ? 'Elegido ✓'
                              : 'Disponible'}
                          </span>
                        </div>

                        {slot.effectiveStatus === 'auto_buffer' && (
                          <span className="text-[10px] text-amber-800 dark:text-amber-300/90 mt-0.5">
                            {slot.reasonLabel} — usa la siguiente hora libre
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Botón simple por si quieren pedir otro horario entre 10am y 9pm */}
                <button
                  type="button"
                  onClick={() => {
                    setRequestExtraSlot((prev) => !prev);
                    setSelectedSlotRange('Otro horario entre 10:00 a.m. y 9:00 p.m.');
                  }}
                  className={`min-h-[46px] w-full px-4 py-2 rounded-xl border border-dashed text-left flex items-center justify-between transition-all ${
                    requestExtraSlot
                      ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]'
                      : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#57534E] dark:text-stone-300 border-[#DCD6CC] dark:border-white/15'
                  }`}
                >
                  <span className="text-xs font-bold">
                    ¿Necesitas otro horario específico entre 10:00 a.m. y 9:00 p.m.?
                  </span>
                  <span className="text-[11px] font-semibold underline">
                    {requestExtraSlot ? 'Solicitado ✓' : 'Solicitar por WhatsApp'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 5. Nombre de la mascota */}
          <div className="space-y-1.5 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <label
              htmlFor="pet-name-input"
              className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 flex items-center gap-1.5"
            >
              <PawPrint className="w-3.5 h-3.5 text-[#1E3A2F] dark:text-emerald-400" />
              <span>5. Nombre de tu(s) mascota(s) (Opcional)</span>
            </label>
            <input
              id="pet-name-input"
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Ej. Bruno, Kira..."
              className="min-h-[46px] w-full px-4 py-2 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#DCD6CC] dark:border-white/15 text-sm text-[#18181B] dark:text-[#FAF9F6]"
            />
          </div>
        </div>

        {/* Columna Derecha: Resumen y Botón a WhatsApp 33 2122 2772 (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 rounded-3xl bg-[#1E3A2F] text-[#FAF9F6] p-6 sm:p-8 shadow-luxury space-y-6">
          <div className="pb-4 border-b border-white/15 space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-[#E5E0D8]/80 font-semibold">
              Resumen de tu Solicitud
            </p>
            <h3 className="text-xl font-bold">{selectedService}</h3>
            <p className="text-xs text-[#E5E0D8]">
              {activeDay.dayName} • {requestExtraSlot ? 'Horario Especial a confirmar' : selectedSlotRange} •{' '}
              {zone}
            </p>
          </div>

          {/* Desglose claro */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-[#FAF9F6]/85">
              <span>
                Subtotal ({quote.petCount} {quote.petCount === 1 ? 'mascota' : 'mascotas'} × $
                {BASE_HOURLY_RATE} × {quote.hours} {quote.hours === 1 ? 'hr' : 'hrs'})
              </span>
              <span className="font-semibold">{formatMXN(quote.subtotalBase)} MXN</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#E5E0D8]">
                Descuento ({quote.discountPercentage}% → ${quote.ratePerPetAfterDiscount} c/u)
              </span>
              <span className="font-bold text-emerald-300">
                {quote.discountAmount > 0 ? `-${formatMXN(quote.discountAmount)} MXN` : '$0 MXN'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#FAF9F6]/90 pt-2 border-t border-white/10">
              <span>Tarifa por mascota / hora</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/10 font-bold text-[#E5E0D8]">
                {formatMXN(quote.ratePerPetAfterDiscount)} MXN c/u
              </span>
            </div>

            <div className="pt-4 border-t border-white/20 flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E5E0D8]/80 block">
                  Total Base
                </span>
                <span className="text-[11px] text-[#E5E0D8]/75">{quote.tierBadge}</span>
              </div>
              <motion.span
                key={quote.total}
                initial={{ opacity: 0.6, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FAF9F6]"
              >
                {formatMXN(quote.total)} <span className="text-base font-semibold text-[#E5E0D8]">MXN</span>
              </motion.span>
            </div>
          </div>

          {quote.isSpecialRequest ? (
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-start gap-2.5 text-xs text-[#E5E0D8]">
              <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-white">Solicitud por confirmar en WhatsApp:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {quote.specialNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10 flex items-center gap-2 text-xs text-[#E5E0D8]">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Horario con margen de traslado verificado y zona sin cargos extra.</span>
            </div>
          )}

          {/* Vista previa del mensaje */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#E5E0D8]/80">
              <span>Se enviará al WhatsApp {WHATSAPP_DISPLAY}:</span>
              <button
                type="button"
                onClick={handleCopyQuote}
                className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[#FAF9F6] inline-flex items-center gap-1 text-[11px]"
              >
                <Copy className="w-3 h-3" />
                <span>Copiar</span>
              </button>
            </div>
            <div className="p-3 rounded-2xl bg-[#142820] border border-white/10 text-xs text-[#FAF9F6]/90 leading-relaxed italic">
              “{whatsappMessage}”
            </div>
          </div>

          {/* Botón CTA directo al 33 2122 2772 */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onShowToast(`Abriendo WhatsApp (${WHATSAPP_DISPLAY})...`)}
            className="min-h-[52px] w-full px-6 py-3.5 rounded-2xl bg-[#FAF9F6] hover:bg-[#E5E0D8] text-[#18181B] font-bold text-base shadow-lg flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5 text-[#1E3A2F]" />
            <span>Reservar por WhatsApp ({WHATSAPP_DISPLAY})</span>
          </a>
        </div>
      </div>
    </section>
  );
};
