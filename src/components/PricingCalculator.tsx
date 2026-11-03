import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  Copy,
  Dog,
  Home,
  Info,
  MapPin,
  MessageCircle,
  Minus,
  PawPrint,
  Plus,
  Sparkles,
  Tag,
} from 'lucide-react';
import {
  BASE_HOURLY_RATE,
  PRIORITY_ZONES,
  SERVICE_OPTIONS,
  buildWhatsAppBookingUrl,
  buildWhatsAppMessage,
  calculateQuote,
  formatMXN,
} from '../config/constants';
import { ServiceType } from '../types/concierge';

interface PricingCalculatorProps {
  onShowToast: (message: string) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ onShowToast }) => {
  const [selectedService, setSelectedService] = useState<ServiceType>('Paseo Privado (Perros)');
  const [hours, setHours] = useState<number>(5);
  const [petName, setPetName] = useState<string>('');
  const [zone, setZone] = useState<string>('');

  const quote = useMemo(() => calculateQuote(hours), [hours]);

  const whatsappMessage = useMemo(
    () =>
      buildWhatsAppMessage({
        service: selectedService,
        petName,
        zone,
        quote,
      }),
    [selectedService, petName, zone, quote]
  );

  const whatsappUrl = useMemo(
    () =>
      buildWhatsAppBookingUrl({
        service: selectedService,
        petName,
        zone,
        quote,
      }),
    [selectedService, petName, zone, quote]
  );

  const handleDecrement = () => {
    setHours((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setHours((prev) => Math.min(10, prev + 1));
  };

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      onShowToast('Resumen de cotización copiado al portapapeles.');
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
          <span>Cotizador Transparente en Tiempo Real</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6]">
          Calculadora de Tarifas y{' '}
          <span className="font-serif italic font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">
            Paquetes a Medida
          </span>
        </h2>

        <p className="text-base sm:text-lg text-[#57534E] dark:text-stone-300">
          Tarifa base de <strong className="text-[#18181B] dark:text-white">${BASE_HOURLY_RATE} MXN por hora / sesión</strong>.
          Personaliza tu paquete de 1 a 10 sesiones y obtén descuentos automáticos de cliente frecuente.
        </p>
      </div>

      {/* Main Calculator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* LEFT COLUMN: Controls (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#141A17] border border-[#E5E0D8] dark:border-white/10 shadow-luxury p-6 sm:p-8 lg:p-10 space-y-8">
          {/* STEP 1: Service Selector */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#57534E] dark:text-stone-400">
                1. Selecciona el Servicio
              </label>
              <span className="text-xs font-medium text-[#1E3A2F] dark:text-emerald-400">
                100% Privado • 60 min por sesión
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

          {/* STEP 2: Quantity of Hours / Sessions (Slider + Quick Buttons) */}
          <div className="space-y-5 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="hours-slider"
                className="text-xs font-bold uppercase tracking-[0.16em] text-[#57534E] dark:text-stone-400"
              >
                2. Cantidad de Horas / Sesiones (1 a 10)
              </label>

              {/* Dynamic Tier Status Pill */}
              <AnimatePresence mode="wait">
                {quote.tierKey === 'package_10' && (
                  <motion.span
                    key="badge-10"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E3A2F] text-[#FAF9F6] text-xs font-bold tracking-wide shadow-sm"
                  >
                    <Award className="w-4 h-4 text-[#E5E0D8]" />
                    <span>Máximo Ahorro • Cliente Frecuente</span>
                  </motion.span>
                )}
                {quote.tierKey === 'package_5' && (
                  <motion.span
                    key="badge-5"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E5E0D8] dark:bg-emerald-950/80 text-[#1E3A2F] dark:text-emerald-300 text-xs font-bold"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>5% de Descuento Automático ($190/hr)</span>
                  </motion.span>
                )}
                {quote.tierKey === 'single' && (
                  <motion.span
                    key="badge-0"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] dark:bg-white/5 border border-[#DCD6CC] dark:border-white/15 text-[#57534E] dark:text-stone-300 text-xs font-medium"
                  >
                    <span>Sesión individual • $200/hr</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Counter + Range Slider */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8] dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={hours <= 1}
                  aria-label="Disminuir horas"
                  className="min-h-[48px] min-w-[48px] rounded-xl bg-white dark:bg-[#161D19] border border-[#DCD6CC] dark:border-white/15 flex items-center justify-center text-[#18181B] dark:text-[#FAF9F6] disabled:opacity-40 hover:bg-[#E5E0D8]/50 active:scale-95 transition-all"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#18181B] dark:text-[#FAF9F6]">
                      {hours}
                    </span>
                    <span className="text-base sm:text-lg font-semibold text-[#57534E] dark:text-stone-300">
                      {hours === 1 ? 'hora / sesión' : 'horas / sesiones'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 mt-0.5">
                    {formatMXN(quote.finalHourlyRate)} MXN por hora ({quote.discountPercentage}% desc.)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={hours >= 10}
                  aria-label="Aumentar horas"
                  className="min-h-[48px] min-w-[48px] rounded-xl bg-white dark:bg-[#161D19] border border-[#DCD6CC] dark:border-white/15 flex items-center justify-center text-[#18181B] dark:text-[#FAF9F6] disabled:opacity-40 hover:bg-[#E5E0D8]/50 active:scale-95 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Range Slider Input */}
              <div className="px-1">
                <input
                  id="hours-slider"
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  aria-label="Seleccionar cantidad de horas del 1 al 10"
                  className="w-full luxury-slider"
                  style={{
                    background: `linear-gradient(to right, #1E3A2F 0%, #1E3A2F ${
                      ((hours - 1) / 9) * 100
                    }%, #E5E0D8 ${((hours - 1) / 9) * 100}%, #E5E0D8 100%)`,
                    borderRadius: '9999px',
                    height: '8px',
                  }}
                />
                <div className="flex justify-between text-[11px] font-medium text-[#57534E] dark:text-stone-400 mt-2">
                  <span>1 hr ($200/hr)</span>
                  <span>2-4 hrs ($190/hr • -5%)</span>
                  <span>5-10 hrs ($180/hr • -10%)</span>
                </div>
              </div>

              {/* Quick Tap Buttons 1 to 10 (Mobile-first >= 44px height) */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isActive = hours === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setHours(num)}
                      className={`min-h-[44px] rounded-xl text-sm font-bold transition-all active:scale-95 ${
                        isActive
                          ? 'bg-[#1E3A2F] text-[#FAF9F6] shadow-sm ring-2 ring-[#1E3A2F]/30'
                          : 'bg-white dark:bg-[#161D19] text-[#18181B] dark:text-stone-200 border border-[#E5E0D8] dark:border-white/10 hover:bg-[#E5E0D8]/50'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Business Rule Callout Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors ${
                quote.tierKey === 'single'
                  ? 'bg-[#FAF9F6] dark:bg-white/5 border-[#DCD6CC] dark:border-white/10 text-[#57534E] dark:text-stone-300'
                  : quote.tierKey === 'package_5'
                  ? 'bg-[#E5E0D8]/55 dark:bg-emerald-950/30 border-[#DCD6CC] dark:border-emerald-800/40 text-[#18181B] dark:text-stone-200'
                  : 'bg-[#1E3A2F]/10 dark:bg-emerald-950/50 border-[#1E3A2F]/30 dark:border-emerald-700/50 text-[#1E3A2F] dark:text-emerald-200'
              }`}
            >
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#1E3A2F] dark:text-emerald-400" />
              <div className="space-y-0.5 text-xs sm:text-sm">
                <p className="font-bold text-[#18181B] dark:text-[#FAF9F6]">{quote.tierBadge}</p>
                <p className="text-[#57534E] dark:text-stone-300">{quote.tierHelperText}</p>
              </div>
            </div>

            {/* Tier Comparison Mini Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setHours(1)}
                className={`min-h-[44px] p-3 rounded-2xl border text-left transition-all ${
                  quote.tierKey === 'single'
                    ? 'border-[#1E3A2F] bg-[#1E3A2F]/5 dark:bg-white/10'
                    : 'border-[#E5E0D8] dark:border-white/10 opacity-75 hover:opacity-100'
                }`}
              >
                <p className="text-[11px] font-bold uppercase text-[#57534E] dark:text-stone-400">1 Hora</p>
                <p className="text-sm sm:text-base font-extrabold text-[#18181B] dark:text-[#FAF9F6]">$200/hr</p>
                <p className="text-[11px] text-[#57534E] dark:text-stone-400">0% desc.</p>
              </button>

              <button
                type="button"
                onClick={() => setHours(hours >= 2 && hours <= 4 ? hours : 3)}
                className={`min-h-[44px] p-3 rounded-2xl border text-left transition-all ${
                  quote.tierKey === 'package_5'
                    ? 'border-[#1E3A2F] bg-[#1E3A2F]/5 dark:bg-white/10'
                    : 'border-[#E5E0D8] dark:border-white/10 opacity-75 hover:opacity-100'
                }`}
              >
                <p className="text-[11px] font-bold uppercase text-[#1E3A2F] dark:text-emerald-400">2 a 4 Horas</p>
                <p className="text-sm sm:text-base font-extrabold text-[#18181B] dark:text-[#FAF9F6]">$190/hr</p>
                <p className="text-[11px] font-semibold text-[#1E3A2F] dark:text-emerald-400">5% desc.</p>
              </button>

              <button
                type="button"
                onClick={() => setHours(hours >= 5 ? hours : 5)}
                className={`min-h-[44px] p-3 rounded-2xl border text-left transition-all ${
                  quote.tierKey === 'package_10'
                    ? 'border-[#1E3A2F] bg-[#1E3A2F]/10 dark:bg-emerald-950/40'
                    : 'border-[#E5E0D8] dark:border-white/10 opacity-75 hover:opacity-100'
                }`}
              >
                <p className="text-[11px] font-bold uppercase text-[#1E3A2F] dark:text-emerald-400">5 a 10 Horas</p>
                <p className="text-sm sm:text-base font-extrabold text-[#18181B] dark:text-[#FAF9F6]">$180/hr</p>
                <p className="text-[11px] font-semibold text-[#1E3A2F] dark:text-emerald-400">10% desc. Máx</p>
              </button>
            </div>
          </div>

          {/* STEP 3: Optional Pet Name & Zone Inputs */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <label className="block text-xs font-bold uppercase tracking-[0.16em] text-[#57534E] dark:text-stone-400">
              3. Datos de tu Mascota y Ubicación (Opcional)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pet Name Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="pet-name-input"
                  className="text-xs font-semibold text-[#18181B] dark:text-stone-200 flex items-center gap-1.5"
                >
                  <PawPrint className="w-3.5 h-3.5 text-[#1E3A2F] dark:text-emerald-400" />
                  <span>Nombre de tu mascota</span>
                </label>
                <input
                  id="pet-name-input"
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Ej. Bruno, Oliva, Milo..."
                  className="min-h-[48px] w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#DCD6CC] dark:border-white/15 text-sm text-[#18181B] dark:text-[#FAF9F6] placeholder:text-[#57534E]/60 focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>

              {/* Zone Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="zone-input"
                  className="text-xs font-semibold text-[#18181B] dark:text-stone-200 flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#1E3A2F] dark:text-emerald-400" />
                  <span>Colonia o Zona</span>
                </label>
                <input
                  id="zone-input"
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="Ej. Polanco, Condesa, Roma..."
                  className="min-h-[48px] w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#DCD6CC] dark:border-white/15 text-sm text-[#18181B] dark:text-[#FAF9F6] placeholder:text-[#57534E]/60 focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
            </div>

            {/* Quick Zone Selector Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-[#57534E] dark:text-stone-400 mr-1">
                Zonas frecuentes:
              </span>
              {PRIORITY_ZONES.slice(0, 6).map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZone(z)}
                  className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    zone === z
                      ? 'bg-[#1E3A2F] text-[#FAF9F6]'
                      : 'bg-[#E5E0D8]/60 dark:bg-white/10 text-[#18181B] dark:text-stone-300 hover:bg-[#E5E0D8]'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Summary & WhatsApp Conversion Card (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 rounded-3xl bg-[#1E3A2F] text-[#FAF9F6] p-6 sm:p-8 shadow-luxury space-y-6 border border-[#2A5041]">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/15">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#E5E0D8]/80 font-semibold">
                Resumen de Cotización
              </p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">{selectedService}</h3>
            </div>
            {quote.tierKey === 'package_10' && (
              <span className="px-3 py-1 rounded-full bg-[#E5E0D8] text-[#18181B] text-[11px] font-extrabold uppercase tracking-wider shrink-0">
                -10% VIP
              </span>
            )}
          </div>

          {/* Live Financial Breakdown */}
          <div className="space-y-3.5 text-sm">
            <div className="flex items-center justify-between text-[#FAF9F6]/85">
              <span>
                Subtotal ({quote.hours} {quote.hours === 1 ? 'hora' : 'horas'} × ${quote.baseRate} MXN)
              </span>
              <span className="font-semibold">{formatMXN(quote.subtotal)} MXN</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#E5E0D8]">Descuento aplicado ({quote.discountPercentage}%)</span>
              <span
                className={`font-bold ${
                  quote.discountAmount > 0 ? 'text-emerald-300' : 'text-[#FAF9F6]/60'
                }`}
              >
                {quote.discountAmount > 0 ? `-${formatMXN(quote.discountAmount)} MXN` : '$0 MXN (0%)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#FAF9F6]/90 pt-2 border-t border-white/10">
              <span>Precio por hora final</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/10 font-bold text-[#E5E0D8]">
                {formatMXN(quote.finalHourlyRate)} MXN / hr
              </span>
            </div>

            <div className="pt-4 border-t border-white/20 flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E5E0D8]/80 block">
                  Total a Pagar
                </span>
                <span className="text-[11px] text-[#E5E0D8]/70">
                  Sin cargos ocultos • Entrevista inicial gratis
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

          {/* Included Guarantees */}
          <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-2 text-xs text-[#E5E0D8]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Monitoreo GPS en vivo por WhatsApp durante toda la sesión</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Hidratación, limpieza de patitas al regresar y reporte fotográfico</span>
            </div>
          </div>

          {/* Live WhatsApp Message Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#E5E0D8]/80">
              <span>Vista previa de tu mensaje de WhatsApp:</span>
              <button
                type="button"
                onClick={handleCopyQuote}
                className="min-h-[36px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[#FAF9F6] inline-flex items-center gap-1 text-[11px] font-medium transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar texto</span>
              </button>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#142820] border border-white/10 text-xs text-[#FAF9F6]/90 leading-relaxed italic">
              “{whatsappMessage}”
            </div>
          </div>

          {/* Primary WhatsApp CTA Button (Mobile-First >= 52px height) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onShowToast('Abriendo WhatsApp con tu cotización personalizada...')}
            className="min-h-[54px] w-full px-6 py-4 rounded-2xl bg-[#FAF9F6] hover:bg-[#E5E0D8] text-[#18181B] font-bold text-base tracking-wide shadow-lg flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5 text-[#1E3A2F] fill-[#1E3A2F]/15" />
            <span>Reservar por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
