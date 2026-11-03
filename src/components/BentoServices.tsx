import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Dog,
  Home,
  MapPin,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HeartHandshake,
} from 'lucide-react';
import { BENTO_SERVICES, SECURITY_PROTOCOL_STEPS } from '../config/constants';

export const BentoServices: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'paseos-privados':
        return <Dog className="w-6 h-6" />;
      case 'cat-home-sitting':
        return <Home className="w-6 h-6" />;
      case 'transparencia-gps':
        return <MapPin className="w-6 h-6" />;
      case 'limpieza-patitas':
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getCardStyle = (variant: string) => {
    switch (variant) {
      case 'forest':
        return 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]';
      case 'stone':
        return 'bg-[#E5E0D8]/70 dark:bg-[#19211D] text-[#18181B] dark:text-[#FAF9F6] border-[#DCD6CC] dark:border-white/10';
      case 'charcoal':
        return 'bg-[#18181B] text-[#FAF9F6] border-[#18181B] dark:border-white/15';
      case 'alabaster':
      default:
        return 'bg-white dark:bg-[#141A17] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10';
    }
  };

  return (
    <>
      {/* SECTION 3A: Bento Grid de Servicios y Diferenciadores */}
      <section
        id="servicios"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
      >
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5E0D8]/70 dark:bg-white/10 text-[#1E3A2F] dark:text-[#E5E0D8] text-xs font-bold uppercase tracking-[0.18em]">
            <span>Estándar Quiet Luxury • Por qué valemos $200/hr</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6] leading-tight">
            La diferencia entre un paseador masivo y un{' '}
            <span className="font-serif italic font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">
              Concierge Privado.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#57534E] dark:text-stone-300 leading-relaxed">
            No caminamos con grupos de 8 o 10 perros atados a la prisa. Cada hora reservada pertenece
            exclusivamente a tu mascota, respetando su carácter, salud articular y la pulcritud de tu hogar.
          </p>
        </div>

        {/* 12-Column Editorial Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {BENTO_SERVICES.map((item, idx) => {
            const isDarkCard = item.accentVariant === 'forest' || item.accentVariant === 'charcoal';

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className={`${item.spanClass} rounded-3xl p-6 sm:p-8 lg:p-9 border shadow-card hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${getCardStyle(
                  item.accentVariant
                )}`}
              >
                <div className="space-y-5">
                  {/* Top Row: Tag + Icon */}
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`text-xs font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full ${
                        isDarkCard
                          ? 'bg-white/10 text-[#E5E0D8]'
                          : 'bg-[#1E3A2F]/10 dark:bg-white/10 text-[#1E3A2F] dark:text-[#E5E0D8]'
                      }`}
                    >
                      {item.tag}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isDarkCard
                          ? 'bg-white/10 text-[#FAF9F6]'
                          : 'bg-[#1E3A2F] text-[#FAF9F6]'
                      }`}
                    >
                      {getIcon(item.id)}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm sm:text-base leading-relaxed ${
                        isDarkCard ? 'text-[#FAF9F6]/85' : 'text-[#57534E] dark:text-stone-300'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="space-y-2.5 pt-2">
                    {item.highlights.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm">
                        <span
                          className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            isDarkCard
                              ? 'bg-[#E5E0D8]/20 text-[#E5E0D8]'
                              : 'bg-[#1E3A2F]/15 dark:bg-emerald-500/20 text-[#1E3A2F] dark:text-emerald-300'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <span className={isDarkCard ? 'text-[#FAF9F6]/90' : 'text-[#18181B] dark:text-stone-200'}>
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Metric Bar */}
                <div
                  className={`mt-8 pt-5 border-t flex items-center justify-between gap-4 ${
                    isDarkCard ? 'border-white/15' : 'border-[#E5E0D8] dark:border-white/10'
                  }`}
                >
                  <div>
                    <p
                      className={`text-[11px] uppercase tracking-widest ${
                        isDarkCard ? 'text-[#E5E0D8]/75' : 'text-[#57534E] dark:text-stone-400'
                      }`}
                    >
                      {item.metricLabel}
                    </p>
                    <p className="text-sm sm:text-base font-bold">{item.metricValue}</p>
                  </div>

                  <a
                    href="#calculadora"
                    className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all active:scale-95 ${
                      isDarkCard
                        ? 'bg-[#FAF9F6] text-[#18181B] hover:bg-[#E5E0D8]'
                        : 'bg-[#1E3A2F] text-[#FAF9F6] hover:bg-[#2A5041]'
                    }`}
                  >
                    <span>Elegir en Calculadora</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* SECTION 3B: Protocolo de Seguridad Step-by-Step */}
      <section
        id="protocolo"
        className="py-16 sm:py-20 bg-[#F2EFE9]/70 dark:bg-[#121714] border-y border-[#E5E0D8] dark:border-white/10 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A2F]/10 dark:bg-white/10 text-[#1E3A2F] dark:text-[#E5E0D8] text-xs font-bold uppercase tracking-[0.18em]">
                <ShieldCheck className="w-4 h-4" />
                <span>Protocolo de Seguridad y Rigor Operativo</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6]">
                Cuatro etapas diseñadas para tu absoluta paz mental
              </h2>
            </div>

            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[#18201C] border border-[#E5E0D8] dark:border-white/10">
              <HeartHandshake className="w-5 h-5 text-[#1E3A2F] dark:text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#18181B] dark:text-stone-200">
                Arnés de seguridad + Correa fija (jamás retráctil) + Kit de primeros auxilios
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SECURITY_PROTOCOL_STEPS.map((step, index) => (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-3xl bg-[#FAF9F6] dark:bg-[#161D19] border border-[#E5E0D8] dark:border-white/10 p-6 flex flex-col justify-between shadow-card hover:shadow-luxury transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif italic font-bold text-[#1E3A2F] dark:text-[#E5E0D8]">
                      Paso {step.stepNumber}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E5E0D8]/70 dark:bg-white/10 text-[#18181B] dark:text-stone-200">
                      {step.durationBadge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#18181B] dark:text-[#FAF9F6]">
                      {step.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#E5E0D8]/60 dark:border-white/10 flex items-center justify-between text-xs text-[#57534E] dark:text-stone-400">
                  <span>Verificado en bitácora</span>
                  <span className="font-bold text-[#1E3A2F] dark:text-[#E5E0D8]">100%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
