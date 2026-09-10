import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

interface PWAInstallBannerProps {
  onOpenModal: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onOpenModal }) => {
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // default true to avoid flash

  useEffect(() => {
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    
    setIsStandalone(isStandaloneMode);

    // Check if user dismissed recently
    const dismissedTimestamp = localStorage.getItem('pawlove_pwa_banner_dismissed');
    if (dismissedTimestamp) {
      const elapsed = Date.now() - parseInt(dismissedTimestamp, 10);
      if (elapsed < 24 * 60 * 60 * 1000) { // 24 hours
        setDismissed(true);
      }
    }
  }, []);

  if (isStandalone || dismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    localStorage.setItem('pawlove_pwa_banner_dismissed', Date.now().toString());
  };

  return (
    <div 
      onClick={onOpenModal}
      className="bg-gradient-to-r from-[#0d2818] via-[#133c24] to-[#0d2818] border-b border-[#D4AF37]/30 text-white px-3 py-2 text-xs flex items-center justify-between shadow-md cursor-pointer hover:bg-opacity-95 transition-all select-none"
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#D4AF37]/60 shrink-0 shadow-sm bg-[#0a1f13]">
          <img src="/pwa-192x192.png" alt="Icono PawLove" className="w-full h-full object-cover" />
        </div>
        <div className="truncate">
          <span className="font-bold text-[#D4AF37] block leading-tight">Instalar PawLove en tu móvil</span>
          <span className="text-[10px] text-stone-300 block leading-tight">Accede a pantalla completa con un toque</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
          className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-stone-950 font-bold text-[11px] shadow hover:bg-[#E5C158] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>Instalar</span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Cerrar aviso"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
