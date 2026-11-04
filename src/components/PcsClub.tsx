import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Crown, Gift, MessageCircle, PawPrint, Phone, QrCode, Search, Sparkles, Users } from 'lucide-react';
import { PCS_CLUB_CONTENT, PRICING_TABLE_ROWS, WHATSAPP_PHONE } from '../config/constants';
import { sanitizeUserText } from '../utils/security';

export interface ClubMemberRecord {
  phone: string;
  petName: string;
  stamps: number;
}

export const STORAGE_KEY_CLUB_MEMBERS = 'pcs_club_members_v1';
const GITHUB_REPO = 'alexram77rmz-lab/alex-pet-concierge';
const GITHUB_FILE_PATH = 'public/schedule.json';

export const PcsClub: React.FC = () => {
  const [stampedCount, setStampedCount] = useState<number>(5);
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientPetName, setClientPetName] = useState<string>('');
  const [activeMemberLabel, setActiveMemberLabel] = useState<string | null>(null);
  const [lookupFeedback, setLookupFeedback] = useState<string | null>(null);
  const [members, setMembers] = useState<ClubMemberRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLUB_MEMBERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Lee parámetros ?cel=33...&mascota=Bruno&sellos=4 si entran desde link o QR personalizado
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCel = (params.get('cel') || '').replace(/\D/g, '');
    const urlSellos = Number(params.get('sellos'));
    const urlMascota = params.get('mascota');

    if (!Number.isNaN(urlSellos) && urlSellos >= 1 && urlSellos <= 10) {
      setStampedCount(urlSellos);
      if (urlMascota) {
        setActiveMemberLabel(`Tarjeta Oficial de ${sanitizeUserText(urlMascota, 30)}: ${urlSellos}/10 sellos`);
      }
    }

    const fetchMembers = async () => {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${GITHUB_FILE_PATH}?t=${Date.now()}`;
        const res = await fetch(rawUrl, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.members)) {
            setMembers(data.members);
            localStorage.setItem(STORAGE_KEY_CLUB_MEMBERS, JSON.stringify(data.members));
            if (urlCel.length === 10) {
              const found = data.members.find((m: ClubMemberRecord) => m.phone.replace(/\D/g, '') === urlCel);
              if (found) {
                setStampedCount(found.stamps);
                setActiveMemberLabel(`Tarjeta Oficial de ${found.petName}: ${found.stamps}/10 sellos`);
              }
            }
          }
        }
      } catch {
        // ignore
      }
    };
    fetchMembers();

    const syncLocalMembers = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CLUB_MEMBERS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setMembers(parsed);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('pcs-members-updated', syncLocalMembers);
    return () => window.removeEventListener('pcs-members-updated', syncLocalMembers);
  }, []);

  const handleCheckPhoneStamps = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = clientPhone.replace(/\D/g, '');
    if (clean.length !== 10) {
      setLookupFeedback('Ingresa tu número celular de 10 dígitos.');
      return;
    }
    const found = members.find((m) => m.phone.replace(/\D/g, '') === clean);
    if (found) {
      setStampedCount(found.stamps);
      setClientPetName(found.petName);
      setActiveMemberLabel(`Tarjeta de ${found.petName} (${clean}) • ${found.stamps}/10 sellos`);
      setLookupFeedback(
        found.stamps === 5
          ? `¡Felicidades! ${found.petName} lleva 5 sellos: tienes 25% de descuento en este paseo.`
          : found.stamps === 10
          ? `¡Felicidades! ${found.petName} llegó al sello 10: tienes 50% de descuento en este paseo.`
          : `¡Hola! ${found.petName} tiene ${found.stamps} de 10 sellos registrados.`
      );
    } else {
      setLookupFeedback(
        'Si es tu 1er servicio con tu tarjeta o código QR, toca el botón verde abajo para activar tu número en WhatsApp y recibir tus sellos y promociones.'
      );
    }
  };

  const registerClubWhatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    `Hola Alex, escaneé el código QR de mi tarjeta PCS Club. Mi celular es ${
      clientPhone.replace(/\D/g, '') || '(mi número)'
    }${
      clientPetName.trim() ? ` y mi mascota se llama ${sanitizeUserText(clientPetName, 30)}` : ''
    }. Quiero activar mis sellos desde mi 1er servicio y recibir promociones.`
  )}`;

  return (
    <section
      id="precios-y-club"
      className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 sm:space-y-24 scroll-mt-20"
    >
      {/* BLOQUE 1: TABLA DE PRECIOS OFICIAL */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#E4F2D3] dark:bg-white/10 text-[#1E3A2F] dark:text-emerald-300 text-[11px] font-bold uppercase tracking-[0.18em]">
            Tarifas Claras por Hora
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1E3A2F] dark:text-[#FAF9F6]">
            Tabla de{' '}
            <span className="font-serif italic font-semibold text-[#15803D] dark:text-[#22C55E]">
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
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#1E3A2F] dark:text-[#FAF9F6]">
                      <span>{row.dogsLabel}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-center font-bold text-[#15803D] dark:text-[#22C55E]">
                      ${row.pricePerDog}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-extrabold text-[#1E3A2F] dark:text-[#FAF9F6]">
                      ${row.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 py-3 bg-[#F2EFE9]/80 dark:bg-[#121D17] border-t border-[#E5E0D8] dark:border-white/10 text-center">
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
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E3A2F] text-[#FAF9F6] text-[11px] font-bold uppercase tracking-[0.18em]">
                  <Crown className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Desde tu 1er Servicio</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F2D3] dark:bg-[#1D3528] border border-[#C5E1A5] dark:border-[#15803D]/40 text-[#1E3A2F] dark:text-emerald-300 text-[11px] font-bold">
                  <QrCode className="w-3.5 h-3.5 text-[#15803D] dark:text-[#22C55E]" />
                  <span>QR Personal Entregado en Persona</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif italic font-bold text-[#1E3A2F] dark:text-[#FAF9F6] leading-tight">
                {PCS_CLUB_CONTENT.title}
              </h2>

              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Desde tu <strong>primer servicio</strong> te entrego personalmente tu tarjeta con{' '}
                <strong>código QR de PCS Club</strong>. Cada paseo suma un sello:{' '}
                <strong className="text-[#15803D] dark:text-[#22C55E]">
                  en el 5º paseo obtienes 25% de descuento
                </strong>{' '}
                y{' '}
                <strong className="text-[#1E3A2F] dark:text-emerald-400">
                  en el 10º paseo obtienes 50% de descuento
                </strong>
                .
              </p>
            </div>

            {/* Beneficios de miembro */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#15803D] dark:text-[#22C55E]">
                {PCS_CLUB_CONTENT.benefitsTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PCS_CLUB_CONTENT.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#16241D] border border-[#E5E0D8] dark:border-white/10 flex items-start gap-2.5 text-xs sm:text-sm font-medium text-[#1E3A2F] dark:text-[#FAF9F6]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] dark:text-[#22C55E] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloque Invita a un vecino / Anfitrión PCS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#E4F2D3]/65 dark:bg-[#16241D] border border-[#C5E1A5] dark:border-[#15803D]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3A2F] dark:text-[#22C55E]">
                <Users className="w-4 h-4 text-[#15803D] dark:text-[#22C55E]" />
                <span>Programa de Vecinos &amp; Anfitrión PCS</span>
              </div>
              <p className="text-xs sm:text-sm text-[#1E3A2F] dark:text-stone-200 leading-relaxed">
                <strong>Invita a un vecino de tu zona</strong> y él se gana un{' '}
                <strong>paseo de cortesía de 30 min</strong> para conocer el servicio. Con tu tercer referido eres{' '}
                <strong>Anfitrión PCS</strong> y conservas prioridad fija de horarios.
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
              className="rounded-3xl bg-white text-zinc-900 p-6 sm:p-8 shadow-xl border border-zinc-200 space-y-6 relative overflow-hidden"
            >
              {/* Encabezado de la Tarjeta de Sellos */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <div>
                  <span className="text-xs font-serif italic text-zinc-500 block mb-0.5">
                    Desde tu primer servicio · QR personal
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-zinc-900 tracking-tight">
                    Pet Club · Tarjeta Digital
                  </h3>
                </div>
                <div className="w-11 h-11 aspect-square shrink-0 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shadow-sm">
                  <QrCode className="w-5 h-5 text-zinc-700" />
                </div>
              </div>

              {/* Resumen de Recompensas de la Tarjeta */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                  <span className="text-xs text-zinc-600 font-serif italic">Paseo #5</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#15803D] text-white text-xs font-bold shadow-sm">
                    25% OFF
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                  <span className="text-xs text-zinc-600 font-serif italic">Paseo #10</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white text-xs font-bold shadow-sm">
                    50% OFF
                  </span>
                </div>
              </div>

              {/* Grid de 10 Sellos (5x2) - Solo lectura para que el cliente no pueda picarle solo */}
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3 select-none">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isFifth = num === 5;
                  const isTenth = num === 10;
                  const isStamped = num <= stampedCount;

                  return (
                    <div
                      key={num}
                      className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-1.5 transition-all ${
                        isTenth
                          ? isStamped
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                            : 'bg-zinc-50 text-zinc-800 border-dashed border-zinc-400'
                          : isFifth
                          ? isStamped
                            ? 'bg-[#15803D] text-white border-[#15803D] shadow-md'
                            : 'bg-zinc-50 text-[#15803D] border-dashed border-[#15803D]/60'
                          : isStamped
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                          : 'bg-zinc-50 text-zinc-400 border-zinc-200'
                      }`}
                    >
                      {isTenth ? (
                        <>
                          <Crown className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
                          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-tighter leading-none">
                            -50% OFF
                          </span>
                        </>
                      ) : isFifth ? (
                        <>
                          <Gift className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
                          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-tighter leading-none">
                            -25% OFF
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
                    </div>
                  );
                })}
              </div>

              {/* Pie de la Tarjeta Digital */}
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 font-serif italic">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                  <span>
                    {activeMemberLabel
                      ? activeMemberLabel
                      : 'Tarjeta de ejemplo (Muestra visual). Tu tarjeta personal se actualiza automáticamente con tu código QR.'}
                  </span>
                </span>
                <span className="font-sans font-semibold text-zinc-700 bg-zinc-100 border border-zinc-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px] shrink-0 not-italic">
                  {activeMemberLabel ? 'Verificada' : 'Muestra'}
                </span>
              </div>

              {/* Buscador y Registro de Tarjeta por Número del Cliente */}
              <div className="pt-4 border-t border-zinc-200 space-y-3">
                <p className="text-xs font-semibold text-zinc-700">
                  ¿Tienes tu Tarjeta PCS Club o Código QR? Consulta tus sellos o regístrate con tu celular:
                </p>

                <form onSubmit={handleCheckPhoneStamps} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-5 flex items-center gap-2 px-3 rounded-xl bg-zinc-50 border border-zinc-300 focus-within:border-zinc-800">
                    <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={12}
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Tu celular (10 dígitos)"
                      className="min-h-[40px] w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-4 flex items-center gap-2 px-3 rounded-xl bg-zinc-50 border border-zinc-300 focus-within:border-zinc-800">
                    <PawPrint className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <input
                      type="text"
                      value={clientPetName}
                      onChange={(e) => setClientPetName(sanitizeUserText(e.target.value, 30))}
                      placeholder="Nombre mascota"
                      className="min-h-[40px] w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="sm:col-span-3 min-h-[40px] px-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Search className="w-3.5 h-3.5 text-white" />
                    <span>Ver Sellos</span>
                  </button>
                </form>

                {lookupFeedback && (
                  <p className="text-xs text-zinc-800 bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2 font-serif italic">
                    {lookupFeedback}
                  </p>
                )}

                <a
                  href={registerClubWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[42px] w-full px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Activar mi Tarjeta PCS Club y Recibir Promos por WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
