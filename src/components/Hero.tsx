import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDownRight,
  Camera,
  CheckCircle2,
  Clock,
  Droplets,
  Home,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const [previewMode, setPreviewMode] = useState<'walk' | 'sitting'>('walk');

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-28 border-b border-[#E5E0D8]/70 dark:border-white/10">
      {/* Subtle Ambient Background Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full bg-[#E5E0D8]/50 dark:bg-[#1E3A2F]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-[#1E3A2F]/5 dark:bg-[#E5E0D8]/5 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Editorial Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            {/* Top Exclusive Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#E5E0D8]/70 dark:bg-white/10 border border-[#DCD6CC] dark:border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#1E3A2F] dark:bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#1E3A2F] dark:text-[#E5E0D8]">
                Cupo Exclusivo: Solo 5 Horas al Día • Cero Manadas Ajenas
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6] leading-[1.12]">
              Cuidado privado y paseos de autor para la{' '}
              <span className="font-serif italic font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">
                tranquilidad de tu hogar.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-[#57534E] dark:text-stone-300 leading-relaxed max-w-2xl">
              Cobertura exclusiva en <strong>Puerta de Hierro, Av. Patria, Jardín Real y Valle Real</strong>.
              Paseos solo para tus mascotas ($200 individual, $190 c/u por 2-3, $180 c/u por 4+) con 30 min de margen entre bloques, GPS en vivo y reporte fotográfico.
            </p>

            {/* Primary & Secondary CTA Buttons (Mobile-First >= 48px height) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <a
                href="#calculadora"
                className="min-h-[52px] px-7 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1E3A2F] hover:bg-[#2A5041] text-[#FAF9F6] text-base font-semibold tracking-wide shadow-luxury hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <span>Cotizar Paquete</span>
                <ArrowDownRight className="w-5 h-5" />
              </a>

              <a
                href="#protocolo"
                className="min-h-[52px] px-7 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#E5E0D8]/60 hover:bg-[#E5E0D8] dark:bg-white/10 dark:hover:bg-white/15 text-[#18181B] dark:text-[#FAF9F6] border border-[#DCD6CC] dark:border-white/15 text-base font-semibold hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <ShieldCheck className="w-5 h-5 text-[#1E3A2F] dark:text-[#E5E0D8]" />
                <span>Conocer el Protocolo</span>
              </a>
            </div>

            {/* Quiet Luxury Trust Highlights */}
            <div className="pt-4 border-t border-[#E5E0D8] dark:border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#1E3A2F] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAF9F6]">Entrevista Gratis</p>
                  <p className="text-xs text-[#57534E] dark:text-stone-400">15 min previos en casa</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Navigation className="w-5 h-5 text-[#1E3A2F] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAF9F6]">GPS en Tiempo Real</p>
                  <p className="text-xs text-[#57534E] dark:text-stone-400">Vía WhatsApp directo</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-[#1E3A2F] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAF9F6]">Patitas Limpias</p>
                  <p className="text-xs text-[#57534E] dark:text-stone-400">Cuidamos tus pisos y muebles</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Interactive Live Session Bitácora Preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: 'easeOut' }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl bg-white dark:bg-[#151B18] border border-[#E5E0D8] dark:border-white/10 shadow-luxury p-5 sm:p-6 space-y-5">
              {/* Interactive Switcher Header */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E5E0D8]/70 dark:border-white/10">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E3A2F] dark:text-emerald-400">
                    Bitácora Digital en Vivo
                  </span>
                  <h2 className="text-base font-bold text-[#18181B] dark:text-[#FAF9F6]">
                    Así vives cada sesión desde tu celular
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1E3A2F]/10 dark:bg-emerald-500/20 text-[#1E3A2F] dark:text-emerald-300">
                  $200/hr base
                </span>
              </div>

              {/* Mode Selector Tabs (>=44px height) */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8] dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewMode('walk')}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-all ${
                    previewMode === 'walk'
                      ? 'bg-[#1E3A2F] text-[#FAF9F6] shadow-sm'
                      : 'text-[#57534E] dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Paseo 1 a 1</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('sitting')}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-all ${
                    previewMode === 'sitting'
                      ? 'bg-[#1E3A2F] text-[#FAF9F6] shadow-sm'
                      : 'text-[#57534E] dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Cat &amp; Home Sitting</span>
                </button>
              </div>

              {/* Editorial Visual + Live Telemetry Overlay */}
              <div className="relative rounded-2xl overflow-hidden bg-[#E5E0D8] aspect-[4/3]">
                {previewMode === 'walk' ? (
                  <img
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80"
                    alt="Paseo privado exclusivo 1 a 1 para perro con Alex Pet Concierge"
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={675}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80"
                    alt="Cuidado a domicilio Cat & Home Sitting con Alex Pet Concierge"
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={675}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/80 via-[#18181B]/20 to-transparent" />

                {/* Top Live Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-3 py-1.5 rounded-full backdrop-blur-md bg-[#FAF9F6]/90 text-[#18181B] text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    {previewMode === 'walk' ? 'GPS Activo • Puerta de Hierro' : 'En Domicilio • Jardín Real'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full backdrop-blur-md bg-[#18181B]/75 text-[#FAF9F6] text-xs font-medium">
                    Solo tu Hogar
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 text-[#FAF9F6] flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#E5E0D8]">
                      {previewMode === 'walk' ? 'Sesión de Paseo de Autor' : 'Visita Home Sitting'}
                    </p>
                    <p className="text-base font-bold">
                      {previewMode === 'walk'
                        ? 'Bruno • Ritmo Olfativo Tranquilo'
                        : 'Oliva • Arenero Limpio + Juego'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#1E3A2F] text-[#FAF9F6] text-xs font-semibold">
                    60 min
                  </span>
                </div>
              </div>

              {/* Checklist Telemetry Pill Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8]/80 dark:border-white/10">
                  <Clock className="w-4 h-4 mx-auto text-[#1E3A2F] dark:text-emerald-400 mb-1" />
                  <p className="text-[11px] text-[#57534E] dark:text-stone-400">Inicio / Fin</p>
                  <p className="text-xs font-bold text-[#18181B] dark:text-[#FAF9F6]">08:30 - 09:30</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8]/80 dark:border-white/10">
                  <Droplets className="w-4 h-4 mx-auto text-[#1E3A2F] dark:text-emerald-400 mb-1" />
                  <p className="text-[11px] text-[#57534E] dark:text-stone-400">Hidratación</p>
                  <p className="text-xs font-bold text-[#18181B] dark:text-[#FAF9F6]">2 Pausas OK</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8]/80 dark:border-white/10">
                  <Camera className="w-4 h-4 mx-auto text-[#1E3A2F] dark:text-emerald-400 mb-1" />
                  <p className="text-[11px] text-[#57534E] dark:text-stone-400">Bitácora</p>
                  <p className="text-xs font-bold text-[#18181B] dark:text-[#FAF9F6]">5 Fotos HD</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
