import React from 'react';
import { Clock, Instagram, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import {
  BRAND_NAME,
  BRAND_SHORT,
  INSTAGRAM_URL,
  PRIORITY_ZONES,
  WHATSAPP_DISPLAY,
  WHATSAPP_PHONE,
} from '../config/constants';

export const Footer: React.FC = () => {
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
              <span className="w-10 h-10 aspect-square shrink-0 rounded-full bg-[#2A5041] border-2 border-[#BEF264]/70 text-[#FAF9F6] flex items-center justify-center text-xs font-extrabold tracking-wider shadow-sm">
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

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A5041] border border-[#BEF264]/30 text-xs text-[#FAF9F6]">
              <ShieldCheck className="w-4 h-4 text-[#BEF264]" />
              <span>Solo mascotas de tu hogar • Atención personal</span>
            </div>
          </div>

          {/* Operating Hours Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#BEF264]">
              <Clock className="w-4 h-4 text-[#BEF264]" />
              <span>Horarios de Atención</span>
            </div>
            <ul className="space-y-2 text-sm text-[#FAF9F6]/90">
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/80">Lunes a Viernes</span>
                <span className="font-semibold">10:00 a.m. – 9:00 p.m.</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/80">Cupo Diario</span>
                <span className="font-semibold text-[#BEF264]">Máx. 5 servicios / día</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/80">Sábados y Domingos</span>
                <span className="font-semibold text-[#E5E0D8]">Solo bajo solicitud</span>
              </li>
            </ul>
          </div>

          {/* Priority Coverage Zones (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#BEF264]">
              <MapPin className="w-4 h-4 text-[#BEF264]" />
              <span>Zonas de Cobertura</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRIORITY_ZONES.map((zone) => (
                <span
                  key={zone}
                  className="px-2.5 py-1 rounded-lg bg-[#2A5041] border border-[#BEF264]/25 text-xs text-[#FAF9F6]"
                >
                  {zone}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#E5E0D8]/75">
              ¿Te encuentras en otra colonia? Escríbeme por WhatsApp para revisar distancia.
            </p>
          </div>

          {/* Direct Channels (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#BEF264]">
              Contacto Directo
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#BEF264] hover:bg-[#D9F99D] text-[#1E3A2F] text-xs font-extrabold inline-flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
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
                <Instagram className="w-4 h-4 text-[#BEF264]" />
                <span>@petconciergeservice</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar + Acceso oculto justo debajo de Sobre Mí / Servicios */}
        <div className="pt-8 border-t border-white/15 flex flex-col items-center justify-between gap-4 text-xs text-[#E5E0D8]/70">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} {BRAND_NAME}. Todos los derechos reservados.</p>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <a href="#sobre-mi" className="hover:text-[#BEF264] transition-colors">
                Sobre Mí
              </a>
              <a href="#servicios" className="hover:text-[#BEF264] transition-colors">
                Servicios
              </a>
              <a href="#calculadora" className="hover:text-[#BEF264] transition-colors">
                Calculadora ($200/hr)
              </a>
              <a href="#faq" className="hover:text-[#BEF264] transition-colors">
                FAQ
              </a>
            </div>
          </div>

          {/* Botón camuflado hasta abajo del todo, debajo de Sobre Mí y Servicios */}
          <div className="w-full flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={handleTriggerHiddenAdmin}
              aria-label="PCS Zapopan"
              className="text-[10px] tracking-[0.25em] uppercase text-[#E5E0D8]/25 hover:text-[#BEF264]/70 transition-colors py-1 px-2 select-none"
            >
              PCS • ZPN
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
