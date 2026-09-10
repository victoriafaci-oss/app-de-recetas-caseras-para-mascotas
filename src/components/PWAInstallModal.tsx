import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, Smartphone, CheckCircle2, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Detect if already installed / standalone
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Catch beforeinstallprompt (Android, Chrome, Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallSuccess(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#0F1E17] text-stone-100 rounded-3xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3.5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] p-0.5 bg-[#0D2818]">
              <img 
                src="/pwa-192x192.png" 
                alt="PawLove App Icon" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#D4AF37] text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
              App Oficial
            </div>
          </div>

          <h3 className="text-xl font-serif font-bold text-white tracking-wide">
            Instalar PawLove en tu Móvil
          </h3>
          <p className="text-xs text-[#D4AF37] font-medium mt-0.5">
            Acceso directo como app nativa con tu icono oficial
          </p>
        </div>

        {/* State 1: Already installed */}
        {isStandalone || installSuccess ? (
          <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 text-center mb-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-emerald-200">
              ¡PawLove ya está instalada!
            </p>
            <p className="text-xs text-stone-300 mt-1">
              Busca el icono dorado de la huella en la pantalla de inicio de tu teléfono para acceder cuando quieras.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {/* If Chrome / Android has native prompt */}
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-stone-950 font-bold text-sm shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-stone-950" />
                <span>Instalar Aplicación Ahora</span>
              </button>
            )}

            {/* iOS Safari Instructions */}
            {isIOS ? (
              <div className="bg-stone-900/80 border border-stone-700/60 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                  <Smartphone className="w-4 h-4" />
                  <span>Pasos para iPhone y iPad (Safari):</span>
                </div>

                <div className="space-y-2.5 text-xs text-stone-200">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-stone-950 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <p>
                      Pulsa el botón <strong>Compartir</strong> en la barra inferior de Safari (<Share className="w-3.5 h-3.5 inline text-sky-400 mx-1" /> cuadrado con flecha hacia arriba).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-stone-950 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <p>
                      Baja en el menú y selecciona <strong className="text-white">"Añadir a la pantalla de inicio"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-[#D4AF37] mx-1" />).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-stone-950 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <p>
                      Pulsa <strong className="text-white">"Añadir"</strong> arriba a la derecha. ¡Listo! Tendrás el icono de PawLove en tu móvil.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Android or Desktop Instructions */
              <div className="bg-stone-900/80 border border-stone-700/60 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                  <Smartphone className="w-4 h-4" />
                  <span>Pasos para Android (Chrome o navegador móvil):</span>
                </div>

                <div className="space-y-2 text-xs text-stone-200">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-stone-950 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <p>
                      Pulsa el botón de menú de <strong>3 puntos (⋮)</strong> en la esquina superior derecha del navegador.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-stone-950 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <p>
                      Selecciona <strong className="text-white">"Instalar aplicación"</strong> o <strong className="text-white">"Añadir a pantalla principal"</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-stone-950 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <p>
                      Confirma la instalación y se agregará inmediatamente con el icono verde y dorado.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Benefits reminder */}
        <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PWA Oficial Segura</span>
          </div>
          <span className="text-stone-500">•</span>
          <span>Sin consumo de tienda</span>
          <span className="text-stone-500">•</span>
          <span className="text-amber-300">Pantalla completa</span>
        </div>
      </div>
    </div>
  );
};
