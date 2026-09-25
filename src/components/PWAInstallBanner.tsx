import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { safeStorage } from '../utils/safeStorage';

interface PWAInstallBannerProps {
  onOpenModal?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onOpenModal }) => {
  const { isAppInstalled, triggerPwaInstall, theme } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // default true to avoid flash

  useEffect(() => {
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true ||
      safeStorage.getItem('pawlove_pwa_installed') === 'true';
    
    setIsStandalone(isStandaloneMode);

    // Check if user dismissed recently
    const dismissedTimestamp = safeStorage.getItem('pawlove_pwa_banner_dismissed');
    if (dismissedTimestamp) {
      const elapsed = Date.now() - parseInt(dismissedTimestamp, 10);
      if (elapsed < 24 * 60 * 60 * 1000) { // 24 hours
        setDismissed(true);
      }
    }
  }, []);

  if (isStandalone || isAppInstalled || dismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    safeStorage.setItem('pawlove_pwa_banner_dismissed', Date.now().toString());
  };

  const handleInstallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerPwaInstall();
  };

  return (
    <div 
      onClick={handleInstallClick}
      className={`border-b text-xs flex items-center justify-between shadow-md cursor-pointer transition-colors duration-200 select-none px-3 py-2 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-[#0d2818] via-[#133c24] to-[#0d2818] border-[#D4AF37]/30 text-white'
          : 'bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/90 border-[#E8DCCB] text-stone-900 shadow-xs'
      }`}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#D4AF37]/60 shrink-0 shadow-sm bg-[#FAF7F2] dark:bg-[#0a1f13]">
          <img src="/pwa-192x192.png" alt="Icono PawLove" className="w-full h-full object-cover" />
        </div>
        <div className="truncate">
          <span className="font-extrabold text-[#B8860B] dark:text-[#D4AF37] block leading-tight">Instalar PawLove en tu móvil</span>
          <span className="text-[10px] text-stone-600 dark:text-stone-300 block leading-tight">Accede a pantalla completa con un toque</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-2.5 py-1 rounded-lg bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold text-[11px] shadow hover:scale-102 transition-all flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>Instalar</span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-full text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Cerrar aviso"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
