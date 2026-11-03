import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, Crown, Gift, PawPrint, Sparkles, Users } from 'lucide-react';
import { PCS_CLUB_CONTENT, PRICING_TABLE_ROWS } from '../config/constants';

export const PcsClub: React.FC = () => {
  const [stampedCount, setStampedCount] = useState<number>(4);

  return (
    <section
      id="precios-y-club"
      className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 sm:space-y-24 scroll-mt-20"
    >
      {/* BLOQUE 1: TABLA DE PRECIOS OFICIAL */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#E5E0D8]/70 dark:bg-white/10 text-[#1E3A2F] dark:text-[#E5E0D8] text-[11px] font-bold uppercase tracking-[0.18em]">
            Tarifas Claras por Hora
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6]">
            Tabla de{' '}
            <span className="font-serif italic font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">
              precios por domicilio
            </span>
          </h2>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#141A17] border border-[#E5E0D8] dark:border-white/10 shadow-luxury overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1E3A2F] text-[#FAF9F6] text-xs sm:text-sm uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6 font-semibold">Perros del mismo domicilio</th>
                  <th className="py-3.5 px-4 sm:px-6 font-semibold text-center">Por perro</th>
                  <th className="py-3.5 px-4 sm:px-6 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]/80 dark:divide-white/10 text-sm sm:text-base">
                {PRICING_TABLE_ROWS.map((row) => (
                  <tr
                    key={row.petCount}
                    className="hover:bg-[#FAF9F6] dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#18181B] dark:text-[#FAF9F6]">
                      <span>{row.dogsLabel}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-center font-bold text-[#1E3A2F] dark:text-emerald-400">
                      ${row.pricePerDog}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-extrabold text-[#18181B] dark:text-[#FAF9F6]">
                      ${row.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 py-3 bg-[#F2EFE9]/80 dark:bg-[#0E1210] border-t border-[#E5E0D8] dark:border-white/10 text-center">
            <p className="text-xs italic text-[#57534E] dark:text-stone-400">
              *Descuento válido solo para mascotas del mismo domicilio.
            </p>
          </div>
        </div>
      </div>

      {/* BLOQUE 2: SECCIÓN PCS CLUB + TARJETA DE SELLOS VISUAL */}
      <div
        id="pcs-club"
        className="rounded-3xl bg-[#F2EFE9] dark:bg-[#141A17] border border-[#E5E0D8] dark:border-white/10 p-6 sm:p-10 lg:p-12 shadow-luxury scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Columna Izquierda: Textos de PCS Club y Beneficios (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E3A2F] text-[#FAF9F6] text-[11px] font-bold uppercase tracking-[0.18em]">
                <Crown className="w-3.5 h-3.5 text-[#E5E0D8]" />
                <span>Lealtad Exclusiva</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif italic font-bold text-[#18181B] dark:text-[#FAF9F6] leading-tight">
                {PCS_CLUB_CONTENT.title}
              </h2>

              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                {PCS_CLUB_CONTENT.subtitle}
              </p>
            </div>

            {/* Beneficios de miembro */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E3A2F] dark:text-emerald-400">
                {PCS_CLUB_CONTENT.benefitsTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PCS_CLUB_CONTENT.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8] dark:border-white/10 flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#18181B] dark:text-[#FAF9F6]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#1E3A2F] dark:text-emerald-400 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloque Invita a un vecino / Anfitrión PCS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E1210] border border-[#DCD6CC] dark:border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3A2F] dark:text-emerald-400">
                <Users className="w-4 h-4" />
                <span>Programa Anfitrión PCS</span>
              </div>
              <p className="text-xs sm:text-sm text-[#18181B] dark:text-stone-200 leading-relaxed">
                <strong>Invita a un vecino</strong> y, cuando complete su primer servicio, ambos reciben un
                paseo de cortesía. Con tu tercer referido eres <strong>Anfitrión PCS</strong> y conservas
                prioridad de horarios.
              </p>
              <p className="text-[11px] italic text-[#57534E] dark:text-stone-400 pt-1">
                *{PCS_CLUB_CONTENT.finePrint}
              </p>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta Digital Visual de 10 Sellos (6 cols) */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-[#1E3A2F] text-[#FAF9F6] p-6 sm:p-8 shadow-luxury border border-[#2A5041] space-y-6 relative overflow-hidden"
            >
              {/* Encabezado de la Tarjeta de Sellos */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#E5E0D8]/80 block">
                    PET CONCIERGE SERVICE
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-[#FAF9F6]">
                    PCS Club · Tarjeta Digital
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#FAF9F6]/15 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#E5E0D8]" />
                </div>
              </div>

              {/* Grid de 10 Sellos (5x2) */}
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isTenth = num === 10;
                  const isStamped = num <= stampedCount;

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setStampedCount(num)}
                      title={`Simular ${num} sellos acumulados`}
                      className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-1.5 transition-all active:scale-95 ${
                        isTenth
                          ? isStamped
                            ? 'bg-[#E5E0D8] text-[#18181B] border-[#E5E0D8] shadow-md'
                            : 'bg-white/10 text-[#E5E0D8] border-dashed border-[#E5E0D8]/60'
                          : isStamped
                          ? 'bg-[#FAF9F6] text-[#1E3A2F] border-[#FAF9F6] shadow-sm'
                          : 'bg-black/20 text-[#E5E0D8]/50 border-white/15 hover:border-white/30'
                      }`}
                    >
                      {isTenth ? (
                        <>
                          <Gift className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
                          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-tighter leading-none">
                            GRATIS
                          </span>
                        </>
                      ) : isStamped ? (
                        <>
                          <PawPrint className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                          <span className="text-[9px] font-bold mt-0.5">#{num}</span>
                        </>
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold">{num}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pie de la Tarjeta Digital */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#E5E0D8]/90">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>
                    {stampedCount === 10
                      ? '¡10 sellos completados! Tu siguiente paseo va por la casa.'
                      : `Tienes ${stampedCount}/10 sellos de ejemplo (toca las casillas para probar).`}
                  </span>
                </span>
                <span className="font-bold text-[#FAF9F6] uppercase tracking-wider text-[11px]">
                  10º Paseo = Cortesía
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
