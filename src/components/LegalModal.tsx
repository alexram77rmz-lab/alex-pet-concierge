import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Cookie, FileText, Shield, X } from 'lucide-react';
import { BRAND_NAME, WHATSAPP_DISPLAY } from '../config/constants';

export type LegalTab = 'privacidad' | 'terminos' | 'cookies';

interface LegalModalProps {
  isOpen: boolean;
  activeTab: LegalTab;
  onClose: () => void;
  onSelectTab: (tab: LegalTab) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  activeTab,
  onClose,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#1E3A2F]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-[#FAF9F6] dark:bg-[#141A17] border border-[#DCD6CC] dark:border-white/15 shadow-2xl flex flex-col overflow-hidden text-[#18181B] dark:text-[#FAF9F6]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#E5E0D8] dark:border-white/10 flex items-center justify-between gap-4 shrink-0 bg-white/70 dark:bg-white/5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4D7C0F] dark:text-lime-300 block">
                MARCO LEGAL & TRANSPARENCIA
              </span>
              <h2 className="text-xl sm:text-2xl font-serif italic font-bold">
                {activeTab === 'privacidad' && 'Aviso de Privacidad'}
                {activeTab === 'terminos' && 'Términos del Servicio'}
                {activeTab === 'cookies' && 'Política de Cookies'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal legal"
              className="w-9 h-9 rounded-full bg-[#E5E0D8]/60 dark:bg-white/10 flex items-center justify-center text-[#1E3A2F] dark:text-white hover:scale-105 active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-[#E5E0D8] dark:border-white/10 px-5 pt-3 gap-2 bg-[#F2EFE9] dark:bg-[#0E1210] shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => onSelectTab('privacidad')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'privacidad'
                  ? 'border-[#1E3A2F] text-[#1E3A2F] dark:border-white dark:text-white'
                  : 'border-transparent text-[#57534E] dark:text-stone-400 hover:text-[#18181B]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacidad</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('terminos')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'terminos'
                  ? 'border-[#1E3A2F] text-[#1E3A2F] dark:border-white dark:text-white'
                  : 'border-transparent text-[#57534E] dark:text-stone-400 hover:text-[#18181B]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Términos del Servicio</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('cookies')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'cookies'
                  ? 'border-[#1E3A2F] text-[#1E3A2F] dark:border-white dark:text-white'
                  : 'border-transparent text-[#57534E] dark:text-stone-400 hover:text-[#18181B]'
              }`}
            >
              <Cookie className="w-3.5 h-3.5" />
              <span>Cookies</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed text-[#57534E] dark:text-stone-300">
            {activeTab === 'privacidad' && (
              <div className="space-y-4">
                <p>
                  En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> de los Estados Unidos Mexicanos, <strong>{BRAND_NAME}</strong>, a cargo de Alex (responsable del tratamiento), con domicilio operativo en Zapopan, Jalisco, hace de su conocimiento este Aviso de Privacidad.
                </p>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#18181B] dark:text-[#FAF9F6]">1. Datos Personales Recabados</h4>
                  <p>
                    Para brindar los servicios de paseo y cuidado en casa, únicamente recabamos:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Nombre del tutor y nombre de la mascota.</li>
                    <li>Número de teléfono celular (WhatsApp) para envío de reportes y coordinación.</li>
                    <li>Ubicación o colonia de servicio (Puerta de Hierro, Colomos, Jardín Real, Valle Real u otra zona solicitada).</li>
                    <li>Detalles específicos de salud, alimentación o comportamiento de la mascota.</li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#18181B] dark:text-[#FAF9F6]">2. Finalidad del Tratamiento</h4>
                  <p>
                    Los datos se utilizan exclusivamente para la ejecución directa del servicio (paseos de autor, visitas de 60 minutos, envío de ubicación GPS en tiempo real y fotografías de bitácora), así como para la acreditación de sellos y promociones de la tarjeta <strong>PCS Club</strong>.
                  </p>
                  <p>
                    <strong>Cero spam y cero venta de datos:</strong> Sus datos jamás son compartidos, vendidos ni transferidos a terceros con fines comerciales ni publicitarios ajenos a {BRAND_NAME}.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#18181B] dark:text-[#FAF9F6]">3. Derechos ARCO</h4>
                  <p>
                    Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales. Para ejercer cualquiera de estos derechos, basta con enviar un mensaje de WhatsApp al <strong>{WHATSAPP_DISPLAY}</strong> solicitando la eliminación o actualización de su registro.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'terminos' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#18181B] dark:text-[#FAF9F6]">1. Naturaleza del Servicio</h4>
                  <p>
                    {BRAND_NAME} ofrece servicios privados y personalizados de paseo para perros y visitas a domicilio para gatos y perros en Zapopan. Se garantiza que los paseos son exclusivos para mascotas del mismo domicilio (sin mezclar con perros de otros hogares).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#18181B] dark:text-[#FAF9F6]">2. Tarifas y Descuentos por Domicilio</h4>
                  <p>
                    Las tarifas oficiales son: 1 perro: $200 MXN; 2 perros: $190 c/u ($380 total); 3 perros: $180 c/u ($540 total); 4 perros: $170 c/u ($680 total); 5 perros: $160 c/u ($800 total). El cupo máximo diario es de 6 servicios para garantizar puntualidad y dedicación plena.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#18181B] dark:text-[#FAF9F6]">3. Seguridad, Clima y Salud de la Mascota</h4>
                  <p>
                    El bienestar de la mascota es prioridad. En condiciones de calor extremo o asfalto caliente, se adaptarán las rutas a zonas de sombra o áreas verdes. En caso de lluvia torrencial, el cliente podrá optar por reprogramación o sustitución por sesión de estimulación y juego en domicilio.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#18181B] dark:text-[#FAF9F6]">4. Membresía y Tarjetas PCS Club (Códigos QR)</h4>
                  <p>
                    Cada paseo suma 1 sello en su tarjeta personal. En el 5º paseo aplica 25% de descuento y en el 10º paseo 50% de descuento. Al invitar a un vecino, este se hace acreedor a un paseo de cortesía de 30 min para conocer el servicio, sujeto a valoración previa y horarios disponibles en la zona de cobertura.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'cookies' && (
              <div className="space-y-4">
                <p>
                  Esta web está diseñada bajo estándares de privacidad estricta y respeto al usuario.
                </p>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#18181B] dark:text-[#FAF9F6]">¿Qué tipo de cookies y almacenamiento utilizamos?</h4>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>
                      <strong>Cookies Técnicas y de Sesión (Estrictamente necesarias):</strong> Se utilizan para recordar si prefiere el Modo Claro o Modo Oscuro, y mantener temporalmente su cotización en la calculadora.
                    </li>
                    <li>
                      <strong>Almacenamiento Local (Local Storage):</strong> Guarda de forma segura en su propio dispositivo el estado del calendario y su preferencia de aceptación de cookies para no volverle a mostrar el aviso.
                    </li>
                    <li>
                      <strong>Sin Rastreo de Terceros:</strong> No empleamos píxeles invasivos de seguimiento comportamental ni comercializamos perfiles de navegación con empresas externas.
                    </li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#18181B] dark:text-[#FAF9F6]">Control de Cookies</h4>
                  <p>
                    Usted puede borrar o bloquear las cookies en cualquier momento desde la configuración de su navegador web (Chrome, Safari, Edge, Firefox). Al deshabilitarlas, el sitio web seguirá funcionando con normalidad.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer of modal */}
          <div className="p-4 sm:p-5 border-t border-[#E5E0D8] dark:border-white/10 bg-[#F2EFE9] dark:bg-[#0E1210] flex justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2A5041] text-[#FAF9F6] text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Check className="w-4 h-4 text-white" />
              <span>Entendido y de Acuerdo</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
