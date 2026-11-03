import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BentoServices } from './components/BentoServices';
import { PcsClub } from './components/PcsClub';
import { PricingCalculator } from './components/PricingCalculator';
import { FaqAndTrust } from './components/FaqAndTrust';
import { Footer } from './components/Footer';
import { FloatingControls } from './components/FloatingControls';
import { LegalModal, LegalTab } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';

export function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<LegalTab>('privacidad');

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3200);
  };

  const handleOpenLegalTab = (tab: LegalTab) => {
    setActiveLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] transition-colors duration-300">
      <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />

      <main className="flex-grow">
        <Hero />
        <BentoServices />
        <PcsClub />
        <PricingCalculator onShowToast={triggerToast} />
        <FaqAndTrust />
      </main>

      <Footer onOpenLegalTab={handleOpenLegalTab} />
      <FloatingControls toastMessage={toastMessage} />
      <CookieBanner onOpenLegalTab={handleOpenLegalTab} />

      <LegalModal
        isOpen={legalModalOpen}
        activeTab={activeLegalTab}
        onClose={() => setLegalModalOpen(false)}
        onSelectTab={setActiveLegalTab}
      />
    </div>
  );
}

export default App;
