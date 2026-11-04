import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Calculator, CheckCircle2, MessageCircle } from 'lucide-react';
import { WHATSAPP_PHONE } from '../config/constants';

interface FloatingControlsProps {
  toastMessage: string | null;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({ toastMessage }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickWhatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    'Hola Alex, quiero agendar una sesión o entrevista de presentación para mi mascota. ¿Tienes disponibilidad?'
  )}`;

  return (
    <>
      {/* Non-blocking Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#1E3A2F] text-[#FAF9F6] text-xs sm:text-sm font-semibold shadow-luxury flex items-center gap-2 border border-white/15"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Back-to-Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            aria-label="Volver arriba"
            className="fixed bottom-24 md:bottom-8 right-4 sm:right-6 z-40 min-h-[48px] min-w-[48px] rounded-full bg-[#1E3A2F] text-white border border-white/30 shadow-luxury flex items-center justify-center hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile-First Ergonomic Sticky Bottom Bar (Thumb Zone) */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden backdrop-blur-lg bg-[#FAF9F6]/95 dark:bg-[#0E1210]/95 border-t border-[#E5E0D8] dark:border-white/10 px-4 py-2.5">
        <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
          <a
            href="#calculadora"
            className="min-h-[46px] px-4 rounded-xl bg-[#E5E0D8]/80 dark:bg-white/10 text-[#18181B] dark:text-[#FAF9F6] text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Calculator className="w-4 h-4 text-[#1E3A2F] dark:text-[#E5E0D8]" />
            <span>Cotizar Paquete</span>
          </a>

          <a
            href={quickWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[46px] px-4 rounded-xl bg-[#1E3A2F] text-[#FAF9F6] text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Reservar WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
};
