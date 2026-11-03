import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BentoServices } from './components/BentoServices';
import { PricingCalculator } from './components/PricingCalculator';
import { FaqAndTrust } from './components/FaqAndTrust';
import { Footer } from './components/Footer';
import { FloatingControls } from './components/FloatingControls';

export function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] dark:bg-[#0E1210] text-[#18181B] dark:text-[#FAF9F6] transition-colors duration-300">
      <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />

      <main className="flex-grow">
        <Hero />
        <BentoServices />
        <PricingCalculator onShowToast={triggerToast} />
        <FaqAndTrust />
      </main>

      <Footer />
      <FloatingControls toastMessage={toastMessage} />
    </div>
  );
}

export default App;
