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

  return (
    <footer className="bg-[#18181B] text-[#FAF9F6] pt-16 pb-28 md:pb-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#1E3A2F] text-[#FAF9F6] flex items-center justify-center text-xs font-bold tracking-widest">
                {BRAND_SHORT}
              </span>
              <span className="text-base font-bold tracking-[0.2em] uppercase">
                {BRAND_NAME}
              </span>
            </div>

            <p className="text-sm text-[#E5E0D8]/80 leading-relaxed max-w-sm">
              Servicio privado de paseos para perros y cuidado a domicilio para gatos y perros. Monitoreo GPS
              en tiempo real, hidratación, patitas limpias con espuma y reporte fotográfico.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#E5E0D8]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Solo mascotas de tu hogar • Atención personal</span>
            </div>
          </div>

          {/* Operating Hours Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E5E0D8]">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Horarios de Atención</span>
            </div>
            <ul className="space-y-2 text-sm text-[#FAF9F6]/85">
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/75">Lunes a Viernes</span>
                <span className="font-semibold">10:00 a.m. – 9:00 p.m.</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/75">Cupo Diario</span>
                <span className="font-semibold text-emerald-300">Máx. 5 servicios / día</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-[#E5E0D8]/75">Sábados y Domingos</span>
                <span className="font-semibold text-amber-300">Solo bajo solicitud</span>
              </li>
            </ul>
          </div>

          {/* Priority Coverage Zones (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E5E0D8]">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Zonas de Cobertura</span>
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
              ¿Te encuentras en otra colonia? Escríbeme por WhatsApp para revisar distancia.
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
                <span>@petconciergeservice</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E5E0D8]/60">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <a href="#sobre-mi" className="hover:text-[#FAF9F6] transition-colors">
              Sobre Mí
            </a>
            <a href="#servicios" className="hover:text-[#FAF9F6] transition-colors">
              Servicios
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
