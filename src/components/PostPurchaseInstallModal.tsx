import React from 'react';
import { Download, Sparkles, CheckCircle2, X, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PostPurchaseInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostPurchaseInstallModal: React.FC<PostPurchaseInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, isAppInstalled, triggerPwaInstall, setCurrentView, subscription } = useApp();

  if (!isOpen) return null;

  const isPromo = subscription?.planId === 'promo';

  const handleContinueToApp = () => {
    onClose();
    setCurrentView('app');
  };

  const handleInstallClick = async () => {
    await triggerPwaInstall();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#0C1A14] text-stone-100 rounded-3xl border border-[#D4AF37]/50 shadow-2xl overflow-hidden p-5 sm:p-7 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleContinueToApp}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            {isPromo
              ? (language === 'es' ? '¡Promoción y Acceso Confirmados!' : 'Promotion & Access Confirmed!')
              : (language === 'es' ? '¡Pago y Acceso Confirmados!' : 'Payment & Access Confirmed!')}
          </span>
        </div>

        {/* App Icon */}
        <div className="relative mx-auto mb-4 w-20 h-20 sm:w-24 sm:h-24">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] p-0.5 bg-[#07130E]">
            <img 
              src="/pwa-192x192.png" 
              alt="PawLove App Icon" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#D4AF37] text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            App
          </div>
        </div>

        {/* Heading */}
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-wide">
          {language === 'es' ? 'Instala PawLove en tu Teléfono' : 'Install PawLove on Your Phone'}
        </h3>
        
        <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed max-w-sm mx-auto">
          {language === 'es'
            ? 'Para una experiencia completa y sin barras de navegador, añade la aplicación a la pantalla de tu móvil ahora mismo.'
            : 'For a full-screen experience without browser bars, add the app to your home screen right now.'}
        </p>

        {/* Note about 3 dots */}
        <div className="mt-3 py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-stone-200 text-[11px] text-left flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <span>
            {language === 'es'
              ? 'Instalación directa: no necesitas buscar los 3 puntos del navegador en tu teléfono.'
              : 'Direct installation: no need to search for the browser 3 dots menu.'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 mt-5">
          {!isAppInstalled ? (
            <button
              onClick={handleInstallClick}
              id="post-purchase-btn-install"
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] hover:brightness-105 text-stone-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Smartphone className="w-4 h-4 text-stone-950" />
              <span>{language === 'es' ? 'Instalar App Ahora' : 'Install App Now'}</span>
            </button>
          ) : (
            <div className="py-2.5 px-4 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-xs font-bold">
              ✓ {language === 'es' ? '¡PawLove ya está instalada en tu móvil!' : 'PawLove is already installed!'}
            </div>
          )}

          <button
            onClick={handleContinueToApp}
            id="post-purchase-btn-continue"
            className="w-full py-3 px-5 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 text-stone-200 hover:text-white font-bold text-xs border border-stone-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{language === 'es' ? 'Continuar a mi panel de mascotas' : 'Continue to pet dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-center gap-2 text-[10px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'es' ? 'Aplicación Oficial PawLove • PWA Segura' : 'Official PawLove App • Secure PWA'}</span>
        </div>

      </div>
    </div>
  );
};
