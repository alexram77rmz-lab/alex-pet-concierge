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
  UserCheck,
} from 'lucide-react';
import { FOUNDER_BIO } from '../config/constants';

export const Hero: React.FC = () => {
  const [previewMode, setPreviewMode] = useState<'walk' | 'sitting'>('walk');

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-[#E5E0D8]/70 dark:border-white/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full bg-[#E5E0D8]/50 dark:bg-[#1E3A2F]/20 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Editorial Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 sm:space-y-7"
          >
            {/* Top Exclusive Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#E5E0D8]/70 dark:bg-white/10 border border-[#DCD6CC] dark:border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#1E3A2F] dark:bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#1E3A2F] dark:text-[#E5E0D8]">
                Horario 10:00 a.m. a 9:00 p.m. • Máximo 5 Servicios al Día
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.3rem] font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6] leading-[1.12]">
              Cuidado privado y paseos de autor para la{' '}
              <span className="font-serif italic font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">
                tranquilidad de tu hogar.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-[#57534E] dark:text-stone-300 leading-relaxed max-w-2xl">
              Cobertura en <strong>Puerta de Hierro, Av. Patria, Jardín Real y Valle Real</strong>. Paseos
              solo para las mascotas de tu casa ($200 por 1, $190 c/u por 2-3, $180 c/u por 4+) con horarios
              separados para un servicio rápido y puntual, GPS en vivo y limpieza de patitas con espuma.
            </p>

            {/* Primary & Secondary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <a
                href="#calculadora"
                className="min-h-[52px] px-7 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1E3A2F] hover:bg-[#2A5041] text-[#FAF9F6] text-base font-semibold tracking-wide shadow-luxury hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <span>Cotizar y Ver Horarios</span>
                <ArrowDownRight className="w-5 h-5" />
              </a>

              <a
                href="#sobre-mi"
                className="min-h-[52px] px-7 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#E5E0D8]/60 hover:bg-[#E5E0D8] dark:bg-white/10 dark:hover:bg-white/15 text-[#18181B] dark:text-[#FAF9F6] border border-[#DCD6CC] dark:border-white/15 text-base font-semibold hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <ShieldCheck className="w-5 h-5 text-[#1E3A2F] dark:text-[#E5E0D8]" />
                <span>Conocer el Servicio</span>
              </a>
            </div>

            {/* Quiet Luxury Trust Highlights */}
            <div className="pt-4 border-t border-[#E5E0D8] dark:border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#1E3A2F] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAF9F6]">10 a.m. a 9 p.m.</p>
                  <p className="text-xs text-[#57534E] dark:text-stone-400">Citas separadas sin prisas</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Navigation className="w-5 h-5 text-[#1E3A2F] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAF9F6]">GPS en Vivo</p>
                  <p className="text-xs text-[#57534E] dark:text-stone-400">Vía WhatsApp directo</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-[#1E3A2F] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAF9F6]">Patitas Limpias</p>
                  <p className="text-xs text-[#57534E] dark:text-stone-400">Con espuma al regresar</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Interactive Live Session Preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: 'easeOut' }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl bg-white dark:bg-[#151B18] border border-[#E5E0D8] dark:border-white/10 shadow-luxury p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E5E0D8]/70 dark:border-white/10">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E3A2F] dark:text-emerald-400">
                    Bitácora Digital en Vivo
                  </span>
                  <h2 className="text-base font-bold text-[#18181B] dark:text-[#FAF9F6]">
                    Monitoreo real en cada sesión
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1E3A2F]/10 dark:bg-emerald-500/20 text-[#1E3A2F] dark:text-emerald-300">
                  $200 a $180
                </span>
              </div>

              {/* Mode Selector Tabs */}
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
                  <span>Paseo Privado</span>
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
                  <span>Cuidado en Casa</span>
                </button>
              </div>

              {/* Editorial Image */}
              <div className="relative rounded-2xl overflow-hidden bg-[#E5E0D8] aspect-[4/3]">
                {previewMode === 'walk' ? (
                  <img
                    src="./meta-ad-pet-concierge.jpg"
                    alt="Paseo privado exclusivo Pet Concierge Service en Zapopan"
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={675}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80"
                    alt="Cuidado a domicilio Cat & Home Sitting con Pet Concierge Service"
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={675}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/80 via-[#18181B]/20 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-3 py-1.5 rounded-full backdrop-blur-md bg-[#FAF9F6]/90 text-[#18181B] text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    {previewMode === 'walk' ? 'GPS Activo • Puerta de Hierro' : 'En Domicilio • Jardín Real'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full backdrop-blur-md bg-[#18181B]/75 text-[#FAF9F6] text-xs font-medium">
                    Solo tu Hogar
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-[#FAF9F6] flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#E5E0D8]">
                      {previewMode === 'walk' ? 'Paseo de Autor' : 'Visita en Casa'}
                    </p>
                    <p className="text-base font-bold">
                      {previewMode === 'walk'
                        ? 'Bruno & Kira • Patitas Limpias'
                        : 'Oliva • Arenero Limpio + Juego'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#1E3A2F] text-[#FAF9F6] text-xs font-semibold">
                    60 min
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8]/80 dark:border-white/10">
                  <Clock className="w-4 h-4 mx-auto text-[#1E3A2F] dark:text-emerald-400 mb-1" />
                  <p className="text-[11px] text-[#57534E] dark:text-stone-400">Horario</p>
                  <p className="text-xs font-bold text-[#18181B] dark:text-[#FAF9F6]">10am - 9pm</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8]/80 dark:border-white/10">
                  <Droplets className="w-4 h-4 mx-auto text-[#1E3A2F] dark:text-emerald-400 mb-1" />
                  <p className="text-[11px] text-[#57534E] dark:text-stone-400">Hidratación</p>
                  <p className="text-xs font-bold text-[#18181B] dark:text-[#FAF9F6]">Incluida</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8]/80 dark:border-white/10">
                  <Camera className="w-4 h-4 mx-auto text-[#1E3A2F] dark:text-emerald-400 mb-1" />
                  <p className="text-[11px] text-[#57534E] dark:text-stone-400">Reporte</p>
                  <p className="text-xs font-bold text-[#18181B] dark:text-[#FAF9F6]">Fotos + GPS</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mini Descripción Personal ("Sobre Mí") */}
        <div
          id="sobre-mi"
          className="rounded-3xl bg-[#F2EFE9] dark:bg-[#141A17] border border-[#E5E0D8] dark:border-white/10 p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 scroll-mt-24"
        >
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1E3A2F] dark:text-emerald-400">
              <UserCheck className="w-4 h-4" />
              <span>{FOUNDER_BIO.badge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#FAF9F6]">
              {FOUNDER_BIO.title}
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
              {FOUNDER_BIO.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full lg:w-auto">
            {FOUNDER_BIO.highlights.map((item) => (
              <div
                key={item}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#0E1210] border border-[#DCD6CC] dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-[#18181B] dark:text-[#FAF9F6]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#1E3A2F] dark:text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
