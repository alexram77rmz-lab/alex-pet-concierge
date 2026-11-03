import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Cookie, ShieldCheck } from 'lucide-react';
import { LegalTab } from './LegalModal';

const STORAGE_KEY_COOKIE_CONSENT = 'pcs_cookie_consent_v1';

interface CookieBannerProps {
  onOpenLegalTab: (tab: LegalTab) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenLegalTab }) => {
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY_COOKIE_CONSENT);
      if (!consent) {
        // Muestra el banner con un suave delay para no interrumpir la carga inicial
        const timer = window.setTimeout(() => setShowBanner(true), 900);
        return () => window.clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY_COOKIE_CONSENT, 'accepted');
    } catch {
      // ignore
    }
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-40"
          role="region"
          aria-label="Aviso de Cookies y Privacidad"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1E3A2F] text-[#FAF9F6] border border-[#BEF264]/40 shadow-luxury space-y-3 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#BEF264]/20 border border-[#BEF264]/40 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-4 h-4 text-[#BEF264]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#BEF264]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Privacidad &amp; Cookies</span>
                </div>
                <p className="text-xs text-[#E5E0D8]/90 leading-relaxed">
                  Utilizamos cookies técnicas y almacenamiento local para recordar tu cotización, horarios y preferencias sin rastreo invasivo de terceros.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={() => onOpenLegalTab('cookies')}
                className="text-[11px] font-medium text-[#BEF264] hover:underline"
              >
                Ver Política y Términos
              </button>

              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-1.5 rounded-xl bg-[#BEF264] hover:bg-[#D9F99D] text-[#1E3A2F] text-xs font-extrabold inline-flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Aceptar</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
