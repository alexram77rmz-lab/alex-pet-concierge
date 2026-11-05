import React from 'react';
import { Clock, Instagram, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import {
  BRAND_NAME,
  BRAND_SHORT,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PRIORITY_ZONES,
  WHATSAPP_DISPLAY,
  WHATSAPP_PHONE,
} from '../config/constants';
import { LegalTab } from './LegalModal';

interface FooterProps {
  onOpenLegalTab?: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalTab }) => {
  const directWhatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    'Hola Alex, vi Pet Concierge Service y me gustaría recibir información sobre tus servicios (Paseo Privado / Cuidado en Casa).'
  )}`;

  const handleTriggerHiddenAdmin = () => {
    window.dispatchEvent(new CustomEvent('pcs-open-admin'));
  };

  return (
    <footer className="bg-[#1E3A2F] text-[#FAF9F6] pt-16 pb-28 md:pb-16 border-t border-[#2A5041]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 aspect-square shrink-0 rounded-full bg-[#2A5041] border-2 border-white/70 text-[#FAF9F6] flex items-center justify-center text-xs font-extrabold tracking-wider shadow-sm">
                {BRAND_SHORT}
              </span>
              <span className="text-base font-bold tracking-[0.2em] uppercase">
                {BRAND_NAME}
              </span>
            </div>

            <p className="text-sm text-[#E5E0D8]/85 leading-relaxed max-w-sm">
              Servicio privado de paseos para perros y cuidado a domicilio para gatos y perros. Monitoreo GPS
              en tiempo real, hidratación, patitas limpias con espuma y reporte fotográfico.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A5041] border border-white/20 text-xs text-[#FAF9F6]">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Solo mascotas de tu hogar • Atención personal</span>
            </div>
          </div>

          {/* Operating Hours Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
              <Clock className="w-4 h-4 text-white" />
              <span>Horarios de Atención</span>
            </div>
            <ul className="space-y-2 text-sm text-[#FAF9F6]/90">
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/80">Lunes a Viernes</span>
                <span className="font-semibold">9:00 a.m. – 9:00 p.m.</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/80">Cupo Diario</span>
                <span className="font-semibold text-white">Máx. 6 servicios / día</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/80">Sábados</span>
                <span className="font-semibold text-white">9:00 a.m. – 3:00 p.m. ($250)</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/80">Domingos y Sáb tarde</span>
                <span className="font-semibold text-[#E5E0D8]">Solo bajo solicitud</span>
              </li>
            </ul>
          </div>

          {/* Priority Coverage Zones (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
              <MapPin className="w-4 h-4 text-white" />
              <span>Exclusivo para</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRIORITY_ZONES.map((zone) => (
                <span
                  key={zone}
                  className="px-2.5 py-1 rounded-lg bg-[#2A5041] border border-white/20 text-xs text-[#FAF9F6]"
                >
                  {zone}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#E5E0D8]/75">
              ¿Vives en otra colonia o coto? Escríbeme por WhatsApp y con gusto coordinamos tu servicio.
            </p>
          </div>

          {/* Direct Channels (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Contacto Directo
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-[#1E3A2F] text-xs font-extrabold inline-flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2A5041] hover:bg-[#346350] border border-white/15 text-[#FAF9F6] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Instagram className="w-4 h-4 text-white" />
                <span>{INSTAGRAM_HANDLE}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar + Acceso oculto al tocar "© 2026 PET CONCIERGE SERVICE. Todos los derechos reservados." */}
        <div className="pt-8 border-t border-white/15 flex flex-col gap-4 text-xs text-[#E5E0D8]/70">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleTriggerHiddenAdmin}
              className="text-left hover:text-white transition-colors cursor-pointer select-none"
            >
              © {new Date().getFullYear()} {BRAND_NAME}. Todos los derechos reservados.
            </button>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <a href="#sobre-mi" className="text-white hover:text-emerald-300 transition-colors">
                Sobre Mí
              </a>
              <a href="#servicios" className="text-white font-bold hover:text-emerald-300 transition-colors">
                Servicios
              </a>
              <a href="#calculadora" className="text-white hover:text-emerald-300 transition-colors">
                Calculadora ($200/hr)
              </a>
              <a href="#faq" className="text-white hover:text-emerald-300 transition-colors">
                FAQ
              </a>
            </div>
          </div>

          {/* Enlaces Legales Oficiales y Política de Cookies */}
          <div className="w-full pt-3 border-t border-white/5 flex flex-wrap items-center justify-center md:justify-end gap-4 text-[11px] text-[#E5E0D8]/60">
            <button
              type="button"
              onClick={() => onOpenLegalTab?.('privacidad')}
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              Aviso de Privacidad (LFPDPPP)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenLegalTab?.('terminos')}
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              Términos del Servicio
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenLegalTab?.('cookies')}
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              Política de Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
