import React from 'react';
import { motion } from 'framer-motion';
import { Check, Dog, Home, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { BENTO_SERVICES, SECURITY_PROTOCOL_STEPS } from '../config/constants';
import { TiltCard } from './TiltCard';

export const BentoServices: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'paseos-privados':
        return <Dog className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'cat-home-sitting':
        return <Home className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'transparencia-gps':
        return <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'limpieza-patitas':
      default:
        return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getCardStyle = (variant: string) => {
    switch (variant) {
      case 'forest':
        return 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]';
      case 'stone':
        return 'bg-[#E5E0D8]/75 dark:bg-[#19211D] text-[#18181B] dark:text-[#FAF9F6] border-[#DCD6CC] dark:border-white/10';
      case 'lime':
        return 'bg-[#E4F2D3] dark:bg-[#1D3528] text-[#1E3A2F] dark:text-[#FAF9F6] border-[#C5E1A5] dark:border-lime-400/25';
      case 'alabaster':
      default:
        return 'bg-white dark:bg-[#141A17] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10';
    }
  };

  return (
    <>
      {/* SECTION 3A: 4 Tarjetitas Compactas de Servicios (2x2 en celular para no abarcar mucho) */}
      <section
        id="servicios"
        className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
      >
        <div className="max-w-2xl mb-8 sm:mb-12 space-y-2.5">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E5E0D8]/70 dark:bg-white/10 text-[#1E3A2F] dark:text-[#E5E0D8] text-[11px] font-bold uppercase tracking-[0.18em]">
            Servicios Exclusivos
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6] leading-tight">
            La diferencia de un{' '}
            <span className="font-serif italic font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">
              cuidado privado y sin prisas.
            </span>
          </h2>
        </div>

        {/* Grid Compacto: 2 columnas en móvil, 4 en desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {BENTO_SERVICES.map((item, idx) => {
            const isDarkCard = item.accentVariant === 'forest';
            const isLimeCard = item.accentVariant === 'lime';

            return (
              <TiltCard key={item.id} className="h-full">
              <motion.article
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className={`h-full rounded-2xl p-4 sm:p-6 border shadow-card flex flex-col justify-between ${getCardStyle(
                  item.accentVariant
                )}`}
              >
                <div className="space-y-2.5 sm:space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full truncate ${
                        isDarkCard
                          ? 'bg-white/10 text-[#E5E0D8]'
                          : isLimeCard
                          ? 'bg-[#65A30D]/20 text-[#1E3A2F] dark:text-lime-200'
                          : 'bg-[#1E3A2F]/10 dark:bg-white/10 text-[#1E3A2F] dark:text-[#E5E0D8]'
                      }`}
                    >
                      {item.tag}
                    </span>
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isDarkCard
                          ? 'bg-white/10 text-[#FAF9F6]'
                          : isLimeCard
                          ? 'bg-[#4D7C0F] text-[#FAF9F6]'
                          : 'bg-[#1E3A2F] text-[#FAF9F6]'
                      }`}
                    >
                      {getIcon(item.id)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-lg font-serif italic font-bold leading-snug">
                      {item.title}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none ${
                        isDarkCard ? 'text-[#FAF9F6]/85' : 'text-[#57534E] dark:text-stone-300'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  <ul className="hidden sm:block space-y-1.5 pt-1">
                    {item.highlights.map((point) => (
                      <li key={point} className="flex items-center gap-1.5 text-xs">
                        <Check className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span className={isDarkCard ? 'text-[#FAF9F6]/90' : 'text-[#18181B] dark:text-stone-200'}>
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`mt-3.5 pt-2.5 border-t flex items-center justify-between ${
                    isDarkCard ? 'border-white/15' : 'border-[#E5E0D8] dark:border-white/10'
                  }`}
                >
                  <span
                    className={`text-[10px] uppercase tracking-wider ${
                      isDarkCard ? 'text-[#E5E0D8]/75' : 'text-[#57534E] dark:text-stone-400'
                    }`}
                  >
                    {item.metricLabel}
                  </span>
                  <span className="text-xs font-bold">{item.metricValue}</span>
                </div>
              </motion.article>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* SECTION 3B: Protocolo de Seguridad (4 Tarjetitas Compactas 2x2 en celular) */}
      <section
        id="protocolo"
        className="py-10 sm:py-16 bg-[#F2EFE9]/70 dark:bg-[#121714] border-y border-[#E5E0D8] dark:border-white/10 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-10 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E3A2F] dark:text-[#E5E0D8]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Protocolo de Confianza</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6]">
              Cuatro pasos en{' '}
              <span className="font-serif italic font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">
                cada paseo
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {SECURITY_PROTOCOL_STEPS.map((step, index) => (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-2xl bg-[#FAF9F6] dark:bg-[#161D19] border border-[#E5E0D8] dark:border-white/10 p-3.5 sm:p-5 flex flex-col justify-between shadow-card"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-xl font-serif italic font-bold text-[#1E3A2F] dark:text-[#E5E0D8]">
                      {step.stepNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E5E0D8]/70 dark:bg-white/10 text-[#18181B] dark:text-stone-200">
                      {step.durationBadge}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-base font-bold text-[#18181B] dark:text-[#FAF9F6] leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-[#57534E] dark:text-stone-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
