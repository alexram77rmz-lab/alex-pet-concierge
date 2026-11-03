import React from 'react';
import { Clock, Instagram, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { INSTAGRAM_URL, PRIORITY_ZONES, WHATSAPP_DISPLAY, WHATSAPP_PHONE } from '../config/constants';

export const Footer: React.FC = () => {
  const directWhatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    'Hola Alex, me gustaría recibir información sobre tus servicios de Pet Concierge (Paseo Privado / Cuidado en Casa).'
  )}`;

  return (
    <footer className="bg-[#18181B] text-[#FAF9F6] pt-16 pb-28 md:pb-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#1E3A2F] text-[#FAF9F6] flex items-center justify-center text-xs font-bold tracking-widest">
                APC
              </span>
              <span className="text-base font-bold tracking-[0.22em] uppercase">
                ALEX PET CONCIERGE
              </span>
            </div>

            <p className="text-sm text-[#E5E0D8]/80 leading-relaxed max-w-sm">
              Servicio privado 1 a 1 de paseos de autor para perros y cuidado a domicilio para gatos y
              perros. Monitoreo GPS en tiempo real, hidratación, patitas limpias y reporte fotográfico.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#E5E0D8]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cero Manadas Masivas • Atención 100% Individual</span>
            </div>
          </div>

          {/* Operating Hours Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E5E0D8]">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Horarios y Cupo Diario</span>
            </div>
            <ul className="space-y-2 text-sm text-[#FAF9F6]/85">
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/75">Lunes a Viernes</span>
                <span className="font-semibold">Solo 5 bloques / día</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/75">Sábados y Domingos</span>
                <span className="font-semibold text-amber-300">Descanso (Solo Extra)</span>
              </li>
              <li className="text-xs text-emerald-300 pt-1">
                * 30 min de margen entre bloques para traslado seguro entre Av. Patria, Puerta de Hierro, Valle Real y Jardín Real.
              </li>
            </ul>
          </div>

          {/* Priority Coverage Zones (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E5E0D8]">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Zonas de Cobertura Prioritaria</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRIORITY_ZONES.map((zone) => (
                <span
                  key={zone}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-[#E5E0D8]"
                >
                  {zone}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#E5E0D8]/65">
              ¿Te encuentras en una colonia aledaña? Consulta disponibilidad directa por WhatsApp.
            </p>
          </div>

          {/* Direct Channels (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E5E0D8]">
              Contacto Directo
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2A5041] text-[#FAF9F6] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#FAF9F6] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Instagram className="w-4 h-4" />
                <span>@alexpetconcierge</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E5E0D8]/60">
          <p>© {new Date().getFullYear()} ALEX PET CONCIERGE. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <a href="#servicios" className="hover:text-[#FAF9F6] transition-colors">
              Servicios
            </a>
            <a href="#protocolo" className="hover:text-[#FAF9F6] transition-colors">
              Protocolo
            </a>
            <a href="#calculadora" className="hover:text-[#FAF9F6] transition-colors">
              Calculadora ($200/hr)
            </a>
            <a href="#faq" className="hover:text-[#FAF9F6] transition-colors">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
