import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, X, Smartphone, ArrowRight, ShieldCheck, Share, PlusSquare, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { safeStorage } from '../utils/safeStorage';

interface PostPurchaseInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostPurchaseInstallModal: React.FC<PostPurchaseInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, triggerPwaInstall, setCurrentView, subscription, deferredInstallPrompt } = useApp();
  const [isIOS, setIsIOS] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(ua));
    }
  }, []);

  if (!isOpen) return null;

  const isPromo = subscription?.planId === 'promo';

  const handleContinueToApp = () => {
    safeStorage.setItem('pawlove_customer_active', 'true');
    safeStorage.setItem('pawlove_stripe_paid', 'true');
    safeStorage.setItem('pawlove_direct_access', 'true');
    try {
      document.cookie = "pawlove_installed=1; path=/; max-age=31536000";
    } catch {}
    onClose();
    setCurrentView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInstallClick = async () => {
    safeStorage.setItem('pawlove_customer_active', 'true');
    safeStorage.setItem('pawlove_stripe_paid', 'true');
    safeStorage.setItem('pawlove_direct_access', 'true');
    try {
      document.cookie = "pawlove_installed=1; path=/; max-age=31536000";
    } catch {}

    if (isIOS) {
      // On iOS Safari, we display the steps inline
      return;
    }

    try {
      if (deferredInstallPrompt) {
        await (deferredInstallPrompt as any).prompt();
        const choice = await (deferredInstallPrompt as any).userChoice;
        if (choice.outcome === 'accepted') {
          setInstalledSuccessfully(true);
          safeStorage.setItem('pawlove_pwa_installed', 'true');
        }
      } else {
        await triggerPwaInstall();
      }
    } catch (err) {
      console.warn('Install flow notice:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      id="modal-post-purchase-install-wrapper"
    >
      <div 
        className="relative w-full max-w-md bg-[#0C1A14] text-stone-100 rounded-3xl border-2 border-[#D4AF37] shadow-2xl overflow-hidden p-5 sm:p-7 text-center"
        onClick={(e) => e.stopPropagation()}
        id="modal-post-purchase-install"
      >
        {/* Close Button */}
        <button
          onClick={handleContinueToApp}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors cursor-pointer"
          aria-label="Cerrar"
          id="post-purchase-btn-close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            {isPromo
              ? (language === 'es' ? '¡Promoción y Acceso Confirmados!' : 'Promotion & Access Confirmed!')
              : (language === 'es' ? '¡Pago en Stripe Confirmado!' : 'Stripe Payment Confirmed!')}
          </span>
        </div>

        {/* App Icon (Patita Dorada) */}
        <div className="relative mx-auto mb-3.5 w-20 h-20 sm:w-24 sm:h-24">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] p-0.5 bg-[#07130E] flex items-center justify-center">
            <img 
              src="/pwa-192x192.png" 
              alt="PawLove App Icon" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="absolute -bottom-2 -right-1 bg-[#D4AF37] text-stone-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
            Acceso Directo
          </div>
        </div>

        {/* Heading */}
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-wide">
          {language === 'es' 
            ? 'Instala el botón de la app en tu teléfono' 
            : 'Install the app button on your phone'}
        </h3>
        
        <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed max-w-sm mx-auto">
          {language === 'es'
            ? 'Añade el acceso directo a la pantalla de tu móvil. Cuando pulses el icono de la patita, entrarás directamente a tu app sin pasar por la web.'
            : 'Add the shortcut to your phone home screen. Tapping the paw icon will open your app directly.'}
        </p>

        {/* Steps / Instructions depending on device */}
        {isIOS ? (
          <div className="mt-4 p-3.5 rounded-2xl bg-stone-900/90 border border-[#D4AF37]/30 text-left space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
              <Smartphone className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'es' ? 'Cómo añadir el icono en iPhone / iPad (Safari):' : 'How to add icon on iPhone / iPad (Safari):'}</span>
            </div>
            <div className="space-y-2 text-xs text-stone-200">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-stone-950 font-black flex items-center justify-center shrink-0 text-[11px]">1</span>
                <p>
                  {language === 'es' ? (
                    <>Pulsa el botón <strong>Compartir</strong> (<Share className="w-3.5 h-3.5 inline text-sky-400 mx-1" /> cuadrado con flecha ↑) en la barra de Safari.</>
                  ) : (
                    <>Tap the <strong>Share</strong> button (<Share className="w-3.5 h-3.5 inline text-sky-400 mx-1" /> square with arrow ↑) in Safari.</>
                  )}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-stone-950 font-black flex items-center justify-center shrink-0 text-[11px]">2</span>
                <p>
                  {language === 'es' ? (
                    <>Baja y pulsa <strong>"Añadir a pantalla de inicio"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-[#D4AF37] mx-1" /> con el icono de PawLove).</>
                  ) : (
                    <>Scroll down and tap <strong>"Add to Home Screen"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-[#D4AF37] mx-1" />).</>
                  )}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-stone-950 font-black flex items-center justify-center shrink-0 text-[11px]">3</span>
                <p>
                  {language === 'es' ? (
                    <>Pulsa <strong>"Añadir"</strong> arriba a la derecha. ¡Aparecerá el botón en tu pantalla!</>
                  ) : (
                    <>Tap <strong>"Add"</strong> in the top right corner. The icon will appear on your phone!</>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {installedSuccessfully ? (
              <div className="py-2.5 px-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'es' ? '¡Botón instalado en tu pantalla con éxito!' : 'Shortcut added to your home screen!'}</span>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                id="post-purchase-btn-install"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] hover:brightness-105 text-stone-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Download className="w-4 h-4 text-stone-950" />
                <span>
                  {language === 'es' ? 'Instalar botón en la pantalla de mi teléfono' : 'Install button on my phone screen'}
                </span>
              </button>
            )}

            <div className="py-2 px-3 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-300 text-[11px] text-left flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                {language === 'es'
                  ? 'Si tu navegador no muestra el aviso automático, pulsa los 3 puntos del navegador y elige "Añadir a la pantalla de inicio".'
                  : 'If your browser does not show the prompt automatically, tap the 3 dots menu and select "Add to home screen".'}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 mt-5">
          <button
            onClick={handleContinueToApp}
            id="post-purchase-btn-continue"
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>{language === 'es' ? '🐾 Entrar a la app ahora' : '🐾 Enter the app now'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-center gap-2 text-[10px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'es' ? 'Acceso Vitalicio Seguro • PawLove PWA' : 'Secure Lifetime Access • PawLove PWA'}</span>
        </div>

      </div>
    </div>
  );
};
