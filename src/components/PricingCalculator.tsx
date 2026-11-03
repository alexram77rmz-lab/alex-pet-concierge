import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  CloudUpload,
  Copy,
  Dog,
  Home,
  Info,
  KeyRound,
  MapPin,
  MessageCircle,
  Minus,
  PawPrint,
  Phone,
  Plus,
  RotateCcw,
  ShieldAlert,
  Unlock,
} from 'lucide-react';
import {
  ALL_ZONES,
  BASE_HOURLY_RATE,
  PRIORITY_ZONES,
  SERVICE_OPTIONS,
  WEEKLY_CALENDAR,
  WHATSAPP_DISPLAY,
  buildWhatsAppBookingUrl,
  buildWhatsAppMessage,
  calculateQuote,
  evaluateDaySlotsWithAutoBuffer,
  formatMXN,
} from '../config/constants';
import { CalendarDay, ServiceType, ZoneName } from '../types/concierge';
import {
  clearAuthLockout,
  getSecurityLockoutStatus,
  registerFailedAuthAttempt,
  sanitizeUserText,
  verifyTwoStepAdminAuth,
} from '../utils/security';

interface PricingCalculatorProps {
  onShowToast: (message: string) => void;
}

const STORAGE_KEY_CALENDAR = 'pcs_calendar_v2';
const STORAGE_KEY_GH_TOKEN = 'pcs_gh_token_v1';
const GITHUB_REPO = 'alexram77rmz-lab/alex-pet-concierge';
const GITHUB_FILE_PATH = 'public/schedule.json';

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ onShowToast }) => {
  const [selectedService, setSelectedService] = useState<ServiceType>('Paseo Privado (Perros)');
  const [petCount, setPetCount] = useState<number>(1);
  const [hours, setHours] = useState<number>(1);
  const [zone, setZone] = useState<ZoneName>('Puerta de Hierro');
  const [customZoneText, setCustomZoneText] = useState<string>('');
  const [petName, setPetName] = useState<string>('');
  const [specificDate, setSpecificDate] = useState<string>('');

  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CALENDAR);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) return parsed;
      }
    } catch {
      // ignore
    }
    return WEEKLY_CALENDAR;
  });

  const [selectedDayId, setSelectedDayId] = useState<string>('lun');
  const [selectedSlotRange, setSelectedSlotRange] = useState<string>('10:00 a.m. – 11:00 a.m.');
  const [requestExtraSlot, setRequestExtraSlot] = useState<boolean>(false);

  // Seguridad en 2 pasos (Teléfono 10 dígitos + Código SHA-256 + Anti-Fuerza Bruta)
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<1 | 2>(1);
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');
  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(false);
  const [adminSelectedZone, setAdminSelectedZone] = useState<ZoneName>('Puerta de Hierro');
  const [ghToken, setGhToken] = useState<string>(() => localStorage.getItem(STORAGE_KEY_GH_TOKEN) || '');
  const [isPublishingCloud, setIsPublishingCloud] = useState<boolean>(false);
  const [lockoutInfo, setLockoutInfo] = useState(() => getSecurityLockoutStatus());

  // Contador de 3 toques secretos para abrir el candado
  const secretTapCountRef = useRef<number>(0);
  const secretTapTimerRef = useRef<number | null>(null);

  const handleSecretTriggerTap = () => {
    secretTapCountRef.current += 1;
    if (secretTapTimerRef.current) {
      window.clearTimeout(secretTapTimerRef.current);
    }
    if (secretTapCountRef.current >= 3) {
      secretTapCountRef.current = 0;
      setLockoutInfo(getSecurityLockoutStatus());
      setShowAuthModal((prev) => !prev);
      setAuthStep(1);
    } else {
      secretTapTimerRef.current = window.setTimeout(() => {
        secretTapCountRef.current = 0;
      }, 1200);
    }
  };

  // Auto-cierre de sesión Admin tras 10 minutos por seguridad
  useEffect(() => {
    if (!adminUnlocked) return;
    const timer = window.setTimeout(() => {
      setAdminUnlocked(false);
      onShowToast('Sesión de administrador cerrada por seguridad.');
    }, 10 * 60 * 1000);
    return () => window.clearTimeout(timer);
  }, [adminUnlocked, onShowToast]);

  // Permite abrir desde el botón oculto hasta abajo del pie de página o con #admin
  useEffect(() => {
    const openAdminFlow = () => {
      setLockoutInfo(getSecurityLockoutStatus());
      setShowAuthModal(true);
      setAuthStep(1);
      const el = document.getElementById('panel-horarios-alex');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const checkHash = () => {
      if (window.location.hash === '#admin') {
        openAdminFlow();
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('pcs-open-admin', openAdminFlow);
    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('pcs-open-admin', openAdminFlow);
    };
  }, []);

  // Carga en vivo el archivo schedule.json desde GitHub
  useEffect(() => {
    const fetchLiveSchedule = async () => {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${GITHUB_FILE_PATH}?t=${Date.now()}`;
        const res = await fetch(rawUrl, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.days)) {
            setCalendarDays(data.days);
            localStorage.setItem(STORAGE_KEY_CALENDAR, JSON.stringify(data.days));
          }
        }
      } catch {
        // Fallback silencioso
      }
    };
    fetchLiveSchedule();
  }, []);

  const activeDay = useMemo(
    () => calendarDays.find((d) => d.id === selectedDayId) || calendarDays[0],
    [calendarDays, selectedDayId]
  );

  const evaluatedSlots = useMemo(
    () => evaluateDaySlotsWithAutoBuffer(activeDay, zone),
    [activeDay, zone]
  );

  useEffect(() => {
    if (activeDay.isWeekend || requestExtraSlot) return;
    const current = evaluatedSlots.find((s) => s.timeRange === selectedSlotRange);
    if (!current || current.effectiveStatus !== 'available') {
      const nextAvailable = evaluatedSlots.find((s) => s.effectiveStatus === 'available');
      if (nextAvailable) {
        setSelectedSlotRange(nextAvailable.timeRange);
      }
    }
  }, [zone, activeDay, evaluatedSlots, selectedSlotRange, requestExtraSlot]);

  const handleSelectDay = (dayId: string) => {
    setSelectedDayId(dayId);
    const dayObj = calendarDays.find((d) => d.id === dayId);
    if (!dayObj) return;
    if (dayObj.isWeekend) {
      setRequestExtraSlot(true);
      setSelectedSlotRange('Horario de fin de semana a acordar');
    } else {
      setRequestExtraSlot(false);
      const smart = evaluateDaySlotsWithAutoBuffer(dayObj, zone);
      const firstAvailable = smart.find((s) => s.effectiveStatus === 'available');
      setSelectedSlotRange(firstAvailable ? firstAvailable.timeRange : 'Horario extra a acordar');
    }
  };

  // Paso 1: Validar formato de teléfono (10 dígitos)
  const handleStep1PhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const status = getSecurityLockoutStatus();
    setLockoutInfo(status);
    if (status.isLocked) {
      onShowToast(`Acceso bloqueado por seguridad (${status.remainingMinutes} min restantes).`);
      return;
    }
    const cleanPhone = phoneInput.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      onShowToast('Ingresa tu número celular de 10 dígitos.');
      return;
    }
    setAuthStep(2);
  };

  // Paso 2: Verificación SHA-256 de (Teléfono + Código)
  const handleStep2VerifyAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const status = getSecurityLockoutStatus();
    if (status.isLocked) {
      setLockoutInfo(status);
      return;
    }

    const isValid = await verifyTwoStepAdminAuth(phoneInput, pinInput);
    if (isValid) {
      clearAuthLockout();
      setLockoutInfo(getSecurityLockoutStatus());
      setAdminUnlocked(true);
      setShowAuthModal(false);
      setPhoneInput('');
      setPinInput('');
      setAuthStep(1);
      onShowToast('Identidad verificada en 2 pasos.');
    } else {
      const updatedLockout = registerFailedAuthAttempt();
      setLockoutInfo(updatedLockout);
      setPinInput('');
      if (updatedLockout.isLocked) {
        onShowToast('3 intentos fallidos. Panel bloqueado por 15 minutos.');
      } else {
        onShowToast(`Credenciales inválidas. Intentos restantes: ${updatedLockout.attemptsLeft}`);
      }
    }
  };

  const handleToggleSlotAdmin = (dayId: string, slotId: string) => {
    setCalendarDays((prev) => {
      const updated = prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          slots: day.slots.map((slot) => {
            if (slot.id !== slotId) return slot;
            const nextStatus = slot.status === 'available' ? ('booked' as const) : ('available' as const);
            return {
              ...slot,
              status: nextStatus,
              bookedZone: nextStatus === 'booked' ? adminSelectedZone : undefined,
            };
          }),
        };
      });
      localStorage.setItem(STORAGE_KEY_CALENDAR, JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetAllSlotsAdmin = () => {
    setCalendarDays(WEEKLY_CALENDAR);
    localStorage.setItem(STORAGE_KEY_CALENDAR, JSON.stringify(WEEKLY_CALENDAR));
    onShowToast('Todos los horarios de la semana quedaron 100% libres.');
  };

  const handlePublishToGitHub = async () => {
    const cleanToken = ghToken.trim();
    if (!cleanToken) {
      onShowToast('Ingresa tu llave de GitHub para publicar a todos los clientes.');
      return;
    }
    localStorage.setItem(STORAGE_KEY_GH_TOKEN, cleanToken);
    setIsPublishingCloud(true);

    try {
      const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
      const getRes = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github+json',
        },
      });

      let sha: string | undefined;
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      const payloadObj = {
        updatedAt: new Date().toISOString(),
        days: calendarDays,
      };
      const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(payloadObj, null, 2))));

      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'chore(schedule): update live availability from verified Admin Panel',
          content: contentBase64,
          sha,
          branch: 'main',
        }),
      });

      if (putRes.ok) {
        onShowToast('¡Horarios publicados en vivo para todos tus clientes!');
      } else {
        onShowToast('Guardado en este dispositivo. Verifica tu token para publicar en la nube.');
      }
    } catch {
      onShowToast('Guardado localmente en este dispositivo.');
    } finally {
      setIsPublishingCloud(false);
    }
  };

  const quote = useMemo(
    () =>
      calculateQuote({
        petCount,
        hours,
        isWeekend: activeDay.isWeekend,
        isExtraSlot: requestExtraSlot || Boolean(specificDate),
        zone,
      }),
    [petCount, hours, activeDay.isWeekend, requestExtraSlot, specificDate, zone]
  );

  const whatsappMessage = useMemo(
    () =>
      buildWhatsAppMessage({
        service: selectedService,
        petName: sanitizeUserText(petName, 50),
        zone,
        customZoneText: sanitizeUserText(customZoneText, 50),
        dayName: activeDay.dayName,
        specificDate: sanitizeUserText(specificDate, 20),
        slotLabel: requestExtraSlot ? 'Horario Especial / Extra' : selectedSlotRange,
        quote,
      }),
    [
      selectedService,
      petName,
      zone,
      customZoneText,
      activeDay.dayName,
      specificDate,
      requestExtraSlot,
      selectedSlotRange,
      quote,
    ]
  );

  const whatsappUrl = useMemo(
    () =>
      buildWhatsAppBookingUrl({
        service: selectedService,
        petName: sanitizeUserText(petName, 50),
        zone,
        customZoneText: sanitizeUserText(customZoneText, 50),
        dayName: activeDay.dayName,
        specificDate: sanitizeUserText(specificDate, 20),
        slotLabel: requestExtraSlot ? 'Horario Especial / Extra' : selectedSlotRange,
        quote,
      }),
    [
      selectedService,
      petName,
      zone,
      customZoneText,
      activeDay.dayName,
      specificDate,
      requestExtraSlot,
      selectedSlotRange,
      quote,
    ]
  );

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      onShowToast('Resumen copiado al portapapeles.');
    } catch {
      onShowToast('Listo para enviar por WhatsApp.');
    }
  };

  return (
    <section
      id="calculadora"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Encabezado limpio */}
      <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#E5E0D8]/70 dark:bg-white/10 text-[#1E3A2F] dark:text-[#E5E0D8] text-xs font-bold uppercase tracking-widest">
          Horario de 10:00 a.m. a 9:00 p.m. • Máximo 5 Horas al Día
        </span>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B] dark:text-[#FAF9F6]">
          Calcula tu tarifa y{' '}
          <span className="font-serif italic font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">
            elige tu horario
          </span>
        </h2>

        <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300">
          <strong>$200 por 1 perro, $190 c/u por 2, $180 c/u por 3, $170 c/u por 4 y $160 c/u por 5</strong>{' '}
          (del mismo domicilio). Cobertura en{' '}
          <strong>Puerta de Hierro, Colomos, Jardín Real y Valle Real</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Controles y Calendario (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#141A17] border border-[#E5E0D8] dark:border-white/10 shadow-card p-5 sm:p-8 space-y-7">
          {/* 1. Servicio */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400">
              1. Servicio
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map((option) => {
                const isSelected = selectedService === option.id;
                const IconComponent = option.id.includes('Paseo') ? Dog : Home;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedService(option.id)}
                    className={`min-h-[56px] p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]'
                        : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">{option.shortTitle}</p>
                      <p
                        className={`text-xs ${
                          isSelected ? 'text-[#E5E0D8]' : 'text-[#57534E] dark:text-stone-400'
                        }`}
                      >
                        {option.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Mascotas y Horas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 block">
                2. Perros del mismo domicilio
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = petCount === n;
                  const priceMap: Record<number, number> = { 1: 200, 2: 190, 3: 180, 4: 170, 5: 160 };
                  const price = priceMap[n];
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPetCount(n)}
                      className={`min-h-[54px] rounded-xl border flex flex-col items-center justify-center transition-all ${
                        active
                          ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]'
                          : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10'
                      }`}
                    >
                      <span className="text-sm font-bold">{n}</span>
                      <span className="text-[10px] opacity-85">${price} c/u</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 block">
                Horas / Sesiones (Máx 5/día)
              </label>
              <div className="min-h-[54px] px-3 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8] dark:border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setHours((h) => Math.max(1, h - 1))}
                  disabled={hours <= 1}
                  aria-label="Menos horas"
                  className="min-h-[40px] min-w-[40px] rounded-lg bg-white dark:bg-[#161D19] border border-[#DCD6CC] dark:border-white/15 flex items-center justify-center disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <span className="text-base font-bold text-[#18181B] dark:text-[#FAF9F6]">
                    {hours} {hours === 1 ? 'hora' : 'horas'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHours((h) => Math.min(10, h + 1))}
                  disabled={hours >= 10}
                  aria-label="Más horas"
                  className="min-h-[40px] min-w-[40px] rounded-lg bg-white dark:bg-[#161D19] border border-[#DCD6CC] dark:border-white/15 flex items-center justify-center disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Zona */}
          <div className="space-y-2.5 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <label className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 block">
              3. Selecciona tu Zona
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_ZONES.map((z) => {
                const active = zone === z;
                return (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setZone(z)}
                    className={`min-h-[46px] px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 text-left transition-all ${
                      active
                        ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]'
                        : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-stone-200 border-[#E5E0D8] dark:border-white/10'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{z}</span>
                  </button>
                );
              })}
            </div>

            {zone === 'Otra zona (Confirmar por WhatsApp)' && (
              <div className="pt-1">
                <input
                  type="text"
                  value={customZoneText}
                  onChange={(e) => setCustomZoneText(sanitizeUserText(e.target.value, 50))}
                  placeholder="Escribe tu colonia (te confirmo por WhatsApp si aplica algún extra)"
                  className="min-h-[44px] w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#DCD6CC] dark:border-white/15 text-xs sm:text-sm"
                />
              </div>
            )}
          </div>

          {/* 4. Calendario Semanal (10:00 a.m. a 9:00 p.m.) */}
          <div
            id="panel-horarios-alex"
            className="space-y-3.5 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSecretTriggerTap}
                className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 flex items-center gap-1.5 select-none"
              >
                <Calendar className="w-4 h-4 text-[#1E3A2F] dark:text-emerald-400" />
                <span>4. Horarios Disponibles (10:00 a.m. a 9:00 p.m.)</span>
              </button>

              {adminUnlocked && (
                <button
                  type="button"
                  onClick={() => setAdminUnlocked(false)}
                  className="px-3 py-1.5 rounded-xl bg-[#1E3A2F] text-[#FAF9F6] text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5 text-[#BEF264]" />
                  <span>Cerrar Sesión Segura</span>
                </button>
              )}
            </div>

            {/* Verificación en 2 Pasos (Teléfono + Código con Hash SHA-256 y Bloqueo Anti-Hackeo) */}
            {showAuthModal && !adminUnlocked && (
              <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#DCD6CC] dark:border-white/15 space-y-3">
                {lockoutInfo.isLocked ? (
                  <div className="flex items-center gap-2.5 text-xs text-red-700 dark:text-red-400 font-semibold">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>
                      Protección anti-hackeo activa: Acceso bloqueado por {lockoutInfo.remainingMinutes}{' '}
                      minutos tras múltiples intentos fallidos.
                    </span>
                  </div>
                ) : authStep === 1 ? (
                  <form onSubmit={handleStep1PhoneSubmit} className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#1E3A2F] dark:text-emerald-400">
                      Verificación Paso 1 de 2 — Confirma tu número celular (10 dígitos)
                    </p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#1E3A2F] shrink-0" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={12}
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="Ej. 33 2122 2772"
                        className="min-h-[38px] flex-1 px-3 rounded-lg bg-white dark:bg-[#161D19] border border-[#DCD6CC] dark:border-white/15 text-xs"
                      />
                      <button
                        type="submit"
                        className="min-h-[38px] px-4 rounded-lg bg-[#1E3A2F] text-[#FAF9F6] text-xs font-bold"
                      >
                        Siguiente →
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleStep2VerifyAuth} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#1E3A2F] dark:text-emerald-400">
                        Verificación Paso 2 de 2 — Código de Seguridad (Cifrado SHA-256)
                      </p>
                      <button
                        type="button"
                        onClick={() => setAuthStep(1)}
                        className="text-[11px] underline text-[#57534E]"
                      >
                        Cambiar número
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#1E3A2F] shrink-0" />
                      <input
                        type="password"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        placeholder="Código de 4 dígitos"
                        className="min-h-[38px] flex-1 px-3 rounded-lg bg-white dark:bg-[#161D19] border border-[#DCD6CC] dark:border-white/15 text-xs"
                      />
                      <button
                        type="submit"
                        className="min-h-[38px] px-4 rounded-lg bg-[#1E3A2F] text-[#FAF9F6] text-xs font-bold"
                      >
                        Desbloquear
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Barra de herramientas Admin (Solo visible tras pasar los 2 pasos SHA-256) */}
            {adminUnlocked && (
              <div className="p-4 rounded-2xl bg-[#1E3A2F] text-[#FAF9F6] space-y-3 border border-[#BEF264]/30">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#BEF264]">
                    Panel Protegido — Toca cualquier hora abajo para marcarla Ocupada / Libre
                  </span>
                  <button
                    type="button"
                    onClick={handleResetAllSlotsAdmin}
                    className="min-h-[34px] px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Liberar Toda la Semana</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#E5E0D8]/80">Zona cuando marques ocupado:</span>
                  {PRIORITY_ZONES.map((pz) => (
                    <button
                      key={pz}
                      type="button"
                      onClick={() => setAdminSelectedZone(pz)}
                      className={`px-2.5 py-1 rounded-lg font-semibold ${
                        adminSelectedZone === pz
                          ? 'bg-[#BEF264] text-[#1E3A2F]'
                          : 'bg-white/10 text-[#E5E0D8]'
                      }`}
                    >
                      {pz}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="password"
                    value={ghToken}
                    onChange={(e) => setGhToken(e.target.value)}
                    placeholder="Token de GitHub (requerido para publicar en la nube)"
                    className="min-h-[38px] flex-1 px-3 rounded-lg bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/40"
                  />
                  <button
                    type="button"
                    onClick={handlePublishToGitHub}
                    disabled={isPublishingCloud}
                    className="min-h-[38px] px-4 rounded-lg bg-[#BEF264] hover:bg-[#D9F99D] text-[#1E3A2F] text-xs font-extrabold inline-flex items-center justify-center gap-1.5"
                  >
                    <CloudUpload className="w-4 h-4" />
                    <span>{isPublishingCloud ? 'Publicando...' : 'Publicar Cambios en Vivo'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Pestañas de días Lun - Dom */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((day) => {
                const isSelected = selectedDayId === day.id;
                const smartSlots = evaluateDaySlotsWithAutoBuffer(day, zone);
                const freeCount = smartSlots.filter((s) => s.effectiveStatus === 'available').length;

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleSelectDay(day.id)}
                    className={`min-h-[58px] p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F]'
                        : day.isWeekend
                        ? 'bg-[#FAF9F6]/60 dark:bg-white/5 text-[#57534E] dark:text-stone-400 border-dashed border-[#DCD6CC] dark:border-white/10'
                        : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10'
                    }`}
                  >
                    <span className="text-xs font-bold">{day.dayShort}</span>
                    <span
                      className={`text-[10px] mt-0.5 ${
                        isSelected
                          ? 'text-[#E5E0D8]'
                          : day.isWeekend
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-[#1E3A2F] dark:text-emerald-400'
                      }`}
                    >
                      {day.isWeekend ? 'Extra' : `${freeCount} disp.`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Horas del día seleccionado */}
            {activeDay.isWeekend ? (
              <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#E5E0D8] dark:border-white/10 space-y-2 text-xs sm:text-sm">
                <p className="font-bold text-[#18181B] dark:text-[#FAF9F6]">
                  {activeDay.dayName}: Día de descanso regular
                </p>
                <p className="text-[#57534E] dark:text-stone-300">
                  Los fines de semana normalmente no laboro, pero puedes enviarme tu solicitud por WhatsApp y
                  acordamos disponibilidad.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {evaluatedSlots.map((slot) => {
                    const isUnavailable = slot.effectiveStatus !== 'available';
                    const isSelected = !requestExtraSlot && selectedSlotRange === slot.timeRange;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!adminUnlocked && isUnavailable}
                        onClick={() => {
                          if (adminUnlocked) {
                            handleToggleSlotAdmin(activeDay.id, slot.id);
                          } else {
                            setRequestExtraSlot(false);
                            setSelectedSlotRange(slot.timeRange);
                          }
                        }}
                        className={`min-h-[54px] px-3.5 py-2.5 rounded-xl border text-left flex flex-col justify-center transition-all ${
                          slot.effectiveStatus === 'booked'
                            ? 'bg-[#E5E0D8]/45 dark:bg-white/5 border-[#E5E0D8] dark:border-white/5 text-[#57534E]/65 dark:text-stone-500'
                            : slot.effectiveStatus === 'auto_buffer'
                            ? 'bg-amber-950/5 dark:bg-amber-950/20 border-dashed border-amber-600/30 text-[#57534E]/75 dark:text-stone-400'
                            : isSelected
                            ? 'bg-[#1E3A2F] text-[#FAF9F6] border-[#1E3A2F] shadow-sm'
                            : 'bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] border-[#E5E0D8] dark:border-white/10 hover:border-[#1E3A2F]/50'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {slot.effectiveStatus === 'auto_buffer' ? (
                              <Car className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 shrink-0 opacity-75" />
                            )}
                            <span className="text-xs sm:text-sm font-bold">{slot.timeRange}</span>
                          </div>

                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              slot.effectiveStatus === 'booked'
                                ? 'bg-stone-300/60 dark:bg-white/10 text-[#57534E] dark:text-stone-300'
                                : slot.effectiveStatus === 'auto_buffer'
                                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                                : isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-[#1E3A2F]/10 dark:bg-emerald-500/20 text-[#1E3A2F] dark:text-emerald-300'
                            }`}
                          >
                            {slot.effectiveStatus === 'booked'
                              ? `Ocupado (${slot.bookedZone})`
                              : slot.effectiveStatus === 'auto_buffer'
                              ? 'Tiempo de traslado'
                              : isSelected
                              ? 'Elegido ✓'
                              : 'Disponible'}
                          </span>
                        </div>

                        {slot.effectiveStatus === 'auto_buffer' && (
                          <span className="text-[10px] text-amber-800 dark:text-amber-300/90 mt-0.5">
                            {slot.reasonLabel}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 5. Nombre de la mascota y Fecha específica opcional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E0D8]/80 dark:border-white/10">
            <div className="space-y-1.5">
              <label
                htmlFor="pet-name-input"
                className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 flex items-center gap-1.5"
              >
                <PawPrint className="w-3.5 h-3.5 text-[#1E3A2F] dark:text-emerald-400" />
                <span>5. Nombre de tu(s) mascota(s)</span>
              </label>
              <input
                id="pet-name-input"
                type="text"
                value={petName}
                onChange={(e) => setPetName(sanitizeUserText(e.target.value, 50))}
                placeholder="Ej. Bruno, Kira..."
                className="min-h-[46px] w-full px-4 py-2 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#DCD6CC] dark:border-white/15 text-sm text-[#18181B] dark:text-[#FAF9F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="specific-date-input"
                className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-stone-400 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#1E3A2F] dark:text-emerald-400" />
                <span>¿Otra fecha en específico? (Opcional)</span>
              </label>
              <input
                id="specific-date-input"
                type="date"
                value={specificDate}
                onChange={(e) => setSpecificDate(sanitizeUserText(e.target.value, 20))}
                className="min-h-[46px] w-full px-4 py-2 rounded-xl bg-[#FAF9F6] dark:bg-[#0E1210] border border-[#DCD6CC] dark:border-white/15 text-sm text-[#18181B] dark:text-[#FAF9F6]"
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen y Botón a WhatsApp 33 2122 2772 (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 rounded-3xl bg-[#1E3A2F] text-[#FAF9F6] p-6 sm:p-8 shadow-luxury space-y-6">
          <div className="pb-4 border-b border-white/15 space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-[#E5E0D8]/80 font-semibold">
              Resumen de tu Solicitud
            </p>
            <h3 className="text-xl font-bold">{selectedService}</h3>
            <p className="text-xs text-[#E5E0D8]">
              {activeDay.dayName} {specificDate ? `(${specificDate})` : ''} •{' '}
              {requestExtraSlot ? 'Horario Especial a confirmar' : selectedSlotRange} • {zone}
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-[#FAF9F6]/85">
              <span>
                Subtotal ({quote.petCount} {quote.petCount === 1 ? 'perro' : 'perros'} × $
                {BASE_HOURLY_RATE} × {quote.hours} {quote.hours === 1 ? 'hr' : 'hrs'})
              </span>
              <span className="font-semibold">{formatMXN(quote.subtotalBase)} MXN</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#E5E0D8]">
                Descuento ({quote.discountPercentage}% menos → ${quote.ratePerPetAfterDiscount} c/u)
              </span>
              <span className="font-bold text-emerald-300">
                {quote.discountAmount > 0 ? `-${formatMXN(quote.discountAmount)} MXN` : '$0 MXN'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#FAF9F6]/90 pt-2 border-t border-white/10">
              <span>Tarifa por perro / hora</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/10 font-bold text-[#E5E0D8]">
                {formatMXN(quote.ratePerPetAfterDiscount)} MXN c/u
              </span>
            </div>

            <div className="pt-4 border-t border-white/20 flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E5E0D8]/80 block">
                  Total
                </span>
                <span className="text-[11px] text-[#E5E0D8]/75">{quote.tierBadge}</span>
              </div>
              <motion.span
                key={quote.total}
                initial={{ opacity: 0.6, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FAF9F6]"
              >
                {formatMXN(quote.total)} <span className="text-base font-semibold text-[#E5E0D8]">MXN</span>
              </motion.span>
            </div>
          </div>

          {quote.isSpecialRequest ? (
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-start gap-2.5 text-xs text-[#E5E0D8]">
              <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-white">Detalles a confirmar en WhatsApp:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {quote.specialNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#162C23] border border-[#BEF264]/25 flex items-center gap-2 text-xs text-[#E5E0D8]">
              <CheckCircle2 className="w-4 h-4 text-[#BEF264] shrink-0" />
              <span>Horario disponible y zona dentro de cobertura normal (sin cargos extra).</span>
            </div>
          )}

          {/* Vista previa del mensaje */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#E5E0D8]/80">
              <span>Se enviará al WhatsApp {WHATSAPP_DISPLAY}:</span>
              <button
                type="button"
                onClick={handleCopyQuote}
                className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[#FAF9F6] inline-flex items-center gap-1 text-[11px]"
              >
                <Copy className="w-3 h-3" />
                <span>Copiar</span>
              </button>
            </div>
            <div className="p-3 rounded-2xl bg-[#142820] border border-white/10 text-xs text-[#FAF9F6]/90 leading-relaxed italic">
              “{whatsappMessage}”
            </div>
          </div>

          {/* Botón CTA directo al 33 2122 2772 */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onShowToast(`Abriendo WhatsApp (${WHATSAPP_DISPLAY})...`)}
            className="min-h-[52px] w-full px-6 py-3.5 rounded-2xl bg-[#BEF264] hover:bg-[#D9F99D] text-[#1E3A2F] font-extrabold text-base shadow-lg flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5 text-[#1E3A2F]" />
            <span>Reservar por WhatsApp ({WHATSAPP_DISPLAY})</span>
          </a>
        </div>
      </div>
    </section>
  );
};
