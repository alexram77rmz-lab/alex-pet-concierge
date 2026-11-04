import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, Instagram, Menu, Moon, ShieldCheck, Sparkles, Sun, X } from 'lucide-react';
import { BRAND_NAME, BRAND_SHORT, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../config/constants';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, onToggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Tabla de Precios', href: '#precios-y-club' },
    { label: 'PCS Club', href: '#pcs-club' },
    { label: 'Calculadora', href: '#calculadora' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#FAF9F6]/85 dark:bg-[#0E1210]/85 border-b border-[#E5E0D8]/80 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Typographic Brand Logo: PET CONCIERGE SERVICE */}
          <a
            href="#"
            className="min-h-[44px] inline-flex items-center gap-3 group focus:outline-none"
            aria-label={`${BRAND_NAME} - Inicio`}
          >
            <span className="w-10 h-10 aspect-square shrink-0 rounded-full bg-[#1E3A2F] border-2 border-white/40 text-[#FAF9F6] flex items-center justify-center text-xs font-extrabold tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              {BRAND_SHORT}
            </span>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-[0.2em] text-[#1E3A2F] dark:text-[#FAF9F6] uppercase">
                {BRAND_NAME}
              </span>
              <span className="text-[10px] tracking-[0.14em] text-[#57534E] dark:text-stone-400 uppercase">
                9:00 A.M. – 9:00 P.M. • Paseos &amp; Cuidado
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Navegación Principal">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="min-h-[44px] px-3.5 inline-flex items-center text-sm font-medium text-[#18181B]/80 dark:text-[#FAF9F6]/80 hover:text-[#1E3A2F] dark:hover:text-[#E5E0D8] rounded-full hover:bg-[#E5E0D8]/40 dark:hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
              title={`Síguenos en Instagram (${INSTAGRAM_HANDLE})`}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-[#E5E0D8] dark:border-white/15 text-[#1E3A2F] dark:text-white hover:bg-[#E4F2D3] dark:hover:bg-white/10 active:scale-95 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-[#E5E0D8] dark:border-white/15 text-[#18181B] dark:text-[#FAF9F6] hover:bg-[#E5E0D8]/50 dark:hover:bg-white/10 active:scale-95 transition-all"
              title={darkMode ? 'Modo Claro Editorial' : 'Modo Nocturno'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#E5E0D8]" /> : <Moon className="w-4 h-4 text-[#1E3A2F]" />}
            </button>

            <a
              href="#calculadora"
              className="min-h-[44px] px-5 py-2.5 inline-flex items-center gap-2 rounded-full bg-[#1E3A2F] hover:bg-[#2A5041] text-[#FAF9F6] text-sm font-semibold tracking-wide shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Agendar Ahora</span>
            </a>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-[#E5E0D8] dark:border-white/15 text-[#18181B] dark:text-[#FAF9F6] active:scale-95 transition-all"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#E5E0D8]" /> : <Moon className="w-4 h-4 text-[#1E3A2F]" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menú de navegación"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-[#E5E0D8]/60 dark:bg-white/10 text-[#18181B] dark:text-[#FAF9F6] active:scale-95 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden overflow-hidden border-t border-[#E5E0D8] dark:border-white/10 bg-[#FAF9F6]/95 dark:bg-[#121715]/95 backdrop-blur-lg"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              <div className="px-3 py-2 rounded-xl bg-[#E5E0D8]/40 dark:bg-white/5 flex items-center justify-between text-xs text-[#57534E] dark:text-stone-300">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#1E3A2F] dark:text-emerald-400" />
                  9:00 a.m. a 9:00 p.m. • Cero Manadas Ajenas
                </span>
                <span className="font-semibold text-[#1E3A2F] dark:text-[#E5E0D8]">$200 a $160 MXN</span>
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="min-h-[48px] px-4 flex items-center justify-between rounded-xl text-base font-medium text-[#18181B] dark:text-[#FAF9F6] hover:bg-[#E5E0D8]/50 dark:hover:bg-white/5 active:scale-[0.99] transition-all"
                >
                  <span>{link.label}</span>
                  <Sparkles className="w-4 h-4 text-[#1E3A2F]/60 dark:text-stone-400" />
                </a>
              ))}

              <div className="pt-2">
                <a
                  href="#calculadora"
                  onClick={handleNavClick}
                  className="min-h-[48px] w-full flex items-center justify-center gap-2 rounded-xl bg-[#1E3A2F] text-[#FAF9F6] text-base font-semibold shadow-sm active:scale-95 transition-all"
                >
                  <CalendarCheck className="w-5 h-5" />
                  <span>Agendar Ahora</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
