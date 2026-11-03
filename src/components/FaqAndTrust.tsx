import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, HelpCircle, Quote, ShieldCheck, Star } from 'lucide-react';
import { FAQ_ITEMS, TESTIMONIALS } from '../config/constants';

export const FaqAndTrust: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0].id);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? '' : id));
  };

  return (
    <section
      id="faq"
      className="py-16 sm:py-24 bg-[#F2EFE9]/60 dark:bg-[#121714] border-t border-[#E5E0D8] dark:border-white/10 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Testimonials / Social Proof Block */}
        <div className="space-y-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#1E3A2F] dark:text-emerald-400">
              Confianza Verificada en CDMX
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6]">
              Hogares que ya confían el cuidado de sus mascotas a{' '}
              <span className="font-serif italic font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">
                Alex Pet Concierge
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item, idx) => (
              <motion.blockquote
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-3xl bg-[#FAF9F6] dark:bg-[#161D19] border border-[#E5E0D8] dark:border-white/10 p-6 sm:p-7 flex flex-col justify-between shadow-card"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#1E3A2F] dark:text-[#E5E0D8]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-[#E5E0D8] dark:text-white/20" />
                  </div>
                  <p className="text-sm sm:text-base text-[#18181B] dark:text-stone-200 leading-relaxed">
                    “{item.quote}”
                  </p>
                </div>

                <footer className="mt-6 pt-4 border-t border-[#E5E0D8]/70 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#18181B] dark:text-[#FAF9F6]">
                      {item.ownerName} &amp; {item.petName}
                    </p>
                    <p className="text-xs text-[#57534E] dark:text-stone-400">
                      {item.petBreed} • {item.zone}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E5E0D8]/60 dark:bg-white/10 text-[11px] font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">
                    {item.serviceUsed}
                  </span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>

        {/* FAQ & Trust Guarantee Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Guarantee Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A2F]/10 dark:bg-white/10 text-[#1E3A2F] dark:text-[#E5E0D8] text-xs font-bold uppercase tracking-[0.18em]">
              <HelpCircle className="w-4 h-4" />
              <span>Preguntas Frecuentes y Garantía</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6] leading-tight">
              Claridad total antes del primer paseo.
            </h2>

            <p className="text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
              Sabemos que tu perro o gato es familia y que abrir las puertas de tu hogar requiere confianza
              absoluta. Aquí respondemos las dudas más importantes de nuestros clientes.
            </p>

            {/* Trust Seal Card */}
            <div className="rounded-3xl bg-[#1E3A2F] text-[#FAF9F6] p-6 sm:p-7 space-y-4 shadow-luxury">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#E5E0D8]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E5E0D8]">
                    Garantía de Confianza Alex Pet Concierge
                  </p>
                  <h3 className="text-lg font-bold">Entrevista de Presentación Sin Costo</h3>
                </div>
              </div>

              <p className="text-sm text-[#FAF9F6]/85 leading-relaxed">
                Antes de cobrar el primer peso, agendamos una visita de 15 minutos en tu domicilio para
                conocernos en persona, presentar a tu mascota sin prisas y validar su rutina.
              </p>

              <a
                href="#calculadora"
                className="min-h-[46px] w-full px-5 py-3 rounded-xl bg-[#FAF9F6] hover:bg-[#E5E0D8] text-[#18181B] text-sm font-bold inline-flex items-center justify-center transition-all active:scale-95"
              >
                Cotizar y Solicitar Entrevista Inicial
              </a>
            </div>
          </div>

          {/* Right Column: Accordion Items (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-[#FAF9F6] dark:bg-[#161D19] border border-[#E5E0D8] dark:border-white/10 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="min-h-[60px] w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#E5E0D8]/30 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#1E3A2F] dark:text-emerald-400">
                        {faq.highlightTag}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#18181B] dark:text-[#FAF9F6]">
                        {faq.question}
                      </h3>
                    </div>
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-[#1E3A2F] text-[#FAF9F6] rotate-180'
                          : 'bg-[#E5E0D8]/70 dark:bg-white/10 text-[#18181B] dark:text-[#FAF9F6]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed border-t border-[#E5E0D8]/50 dark:border-white/5">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
