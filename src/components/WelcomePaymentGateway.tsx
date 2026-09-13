import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRICING_PLANS, LEGAL_TERMS_SUMMARY, STRIPE_PAYMENT_LINKS, openStripeCheckout } from '../data/pricingData';
import { PricingPlan, PaymentMethodType } from '../types';
import { PhoneVerificationModal } from './PhoneVerificationModal';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';
import { LanguageSelector } from './LanguageSelector';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Phone, 
  CreditCard, 
  ChefHat, 
  Sun, 
  Moon, 
  Globe, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Smartphone,
  Download
} from 'lucide-react';

interface WelcomePaymentGatewayProps {
  onBackToLanding?: () => void;
  initialSelectedPlanId?: string;
}

export const WelcomePaymentGateway: React.FC<WelcomePaymentGatewayProps> = ({ 
  onBackToLanding, 
  initialSelectedPlanId 
}) => {
  const { 
    theme, 
    toggleTheme, 
    setTheme,
    language, 
    setLanguage, 
    activateSubscription, 
    setCurrentView,
    isAppInstalled,
    triggerPwaInstall,
    t 
  } = useApp();

  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PricingPlan | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [mobileActivePlanId, setMobileActivePlanId] = useState<string>(initialSelectedPlanId || 'annual');
  const [mobileViewMode, setMobileViewMode] = useState<'tab' | 'all'>('tab');

  // If initialSelectedPlanId is passed, handle immediately
  React.useEffect(() => {
    if (initialSelectedPlanId) {
      setMobileActivePlanId(initialSelectedPlanId);
      const foundPlan = PRICING_PLANS.find(p => p.id === initialSelectedPlanId);
      if (foundPlan) {
        if (foundPlan.id === 'free_trial_48h') {
          setShowPhoneModal(true);
        } else {
          setSelectedPlanForCheckout(foundPlan);
        }
      }
    }
  }, [initialSelectedPlanId]);

  // Handle plan click: opens connected checkout modal with Stripe, PayPal, and Cards
  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.id === 'free_trial_48h') {
      setShowPhoneModal(true);
    } else {
      setSelectedPlanForCheckout(plan);
    }
  };

  // Phone verification success callback
  const handlePhoneSuccess = async (phoneNumber: string) => {
    setShowPhoneModal(false);
    await activateSubscription('free_trial_48h', 'phone_sms', { phoneNumber });
  };

  // Checkout success callback (Stripe / PayPal / Card)
  const handlePaymentSuccess = async (
    method: PaymentMethodType, 
    details: { cardLast4?: string; transactionId: string }
  ) => {
    if (!selectedPlanForCheckout) return;
    const planId = selectedPlanForCheckout.id;
    setSelectedPlanForCheckout(null);
    await activateSubscription(planId, method, details);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-[#07110C] text-stone-100' : 'light bg-[#FAF7F2] text-stone-900'} transition-colors duration-300 font-sans selection:bg-amber-500/30 selection:text-amber-900 w-full max-w-full overflow-x-hidden`}>
      
      {/* ========================================================================= */}
      {/* TOP HEADER: BRAND IDENTITY + LANGUAGE / THEME UTILITIES                   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 w-full border-b border-[#E8DCCB] dark:border-[#D4AF37]/20 bg-[#FAF7F2]/95 dark:bg-[#07130E]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-13 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Brand Logo & Name / Click to go to App */}
          <button
            onClick={() => setCurrentView('app')}
            className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink text-left cursor-pointer group transition-all"
            title={language === 'es' ? 'Ir a la App' : 'Go to App'}
            id="gateway-logo-btn-app"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl overflow-hidden shadow-xs shrink-0 border border-[#D4AF37]/40 bg-[#07130E] flex items-center justify-center group-hover:scale-105 transition-transform">
              <img 
                src="/pawlove_logo.jpg" 
                alt="PAWLOVE Mascotas" 
                className="w-full h-full object-cover aspect-square"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 shrink">
              <div className="font-editorial text-xs sm:text-xl lg:text-2xl font-black tracking-tight sm:tracking-wider text-[#B8860B] dark:text-[#E8B84A] leading-tight truncate group-hover:text-amber-500 transition-colors">
                PAWLOVE
              </div>
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider sm:tracking-widest text-stone-500 dark:text-[#D4AF37]/80 leading-none truncate hidden xs:block">
                {language === 'es' ? 'Recetas Caseras & Nutrición para Mascotas' : 'Homemade Nutrition & Pet Care'}
              </div>
            </div>
          </button>

          {/* Minimal Controls: Language & Theme & App & Landing */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Direct Install App Button - Only if NOT installed */}
            {!isAppInstalled && (
              <button
                onClick={triggerPwaInstall}
                id="gateway-btn-install-app"
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] sm:text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                title={language === 'es' ? 'Instalar App en tu móvil' : 'Install App on mobile'}
              >
                <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-200" />
                <span className="inline">{language === 'es' ? 'Instalar App' : 'Install App'}</span>
              </button>
            )}

            {/* Ir a la App button */}
            <button
              onClick={() => setCurrentView('app')}
              id="gateway-btn-go-to-app"
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/40 text-[10px] sm:text-xs font-bold text-stone-800 dark:text-[#F3E5AB] hover:border-[#B8860B] dark:hover:border-[#D4AF37] transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
              title={language === 'es' ? 'Entrar a la App' : 'Go to App'}
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
              <span className="hidden sm:inline">{language === 'es' ? 'Abrir App' : 'App'}</span>
            </button>

            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/35 text-[10px] sm:text-xs font-bold text-stone-800 dark:text-[#F3E5AB] hover:border-[#B8860B] dark:hover:border-[#D4AF37] transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                <span className="hidden sm:inline">{language === 'es' ? 'Presentación' : 'Landing'}</span>
              </button>
            )}
            
            {/* Language Selector */}
            <LanguageSelector idPrefix="gateway-lang" align="right" />

            {/* Theme Toggle Segmented */}
            <div 
              className="flex items-center p-0.5 rounded-full border border-[#E8DCCB] dark:border-[#D4AF37]/30 bg-stone-100/90 dark:bg-[#112019] shadow-xs shrink-0"
              role="group"
              aria-label={language === 'es' ? 'Modo de visualización' : 'Visual theme mode'}
            >
              <button
                type="button"
                onClick={() => setTheme('light')}
                id="gateway-btn-theme-light"
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-stone-900 shadow-xs border border-amber-300/80 font-extrabold'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
                }`}
                title={language === 'es' ? 'Activar Modo Claro' : 'Activate Light Mode'}
              >
                <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-[#B8860B]' : 'text-stone-400'}`} />
                <span className="hidden sm:inline">{language === 'es' ? 'Claro' : 'Light'}</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                id="gateway-btn-theme-dark"
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#1C2C24] text-[#F3E5AB] shadow-xs border border-[#D4AF37]/50 font-extrabold'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
                }`}
                title={language === 'es' ? 'Activar Modo Oscuro' : 'Activate Dark Mode'}
              >
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-[#E8B84A]' : 'text-stone-400'}`} />
                <span className="hidden sm:inline">{language === 'es' ? 'Oscuro' : 'Dark'}</span>
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT                                                              */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
        
        {/* ========================================================================= */}
        {/* 1. RESUMEN CLARO Y ESTRUCTURADO DE LA APP                                 */}
        {/* (Personalización única, recetario por etapas, enfermedades y hábitos)     */}
        {/* ========================================================================= */}
        <section className="space-y-6 max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-300/60 dark:border-[#D4AF37]/30 text-amber-900 dark:text-[#F3E5AB] text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
            <span>
              {language === 'es' 
                ? 'Nutrición Veterinaria Personalizada para Perros y Gatos' 
                : 'Custom Veterinary Nutrition for Dogs & Cats'}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="font-editorial text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-[#F3E5AB] leading-tight">
              {language === 'es' 
                ? 'Nutrición natural, salud y cuidado a medida para tu mascota' 
                : 'Natural precision nutrition, health & custom care for your pet'}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto">
              {language === 'es'
                ? 'Plataforma basada en la personalización única de cada mascota: cálculo metabólico individual, recetario completo por etapas de vida, apoyo nutricional en enfermedades y planificación de alimentación y hábitos semanales.'
                : 'A personalized platform built around your pet\'s unique biology: individual metabolic calculations, complete recipes by life stage, clinical disease nutrition, and weekly meal & wellness habit tracking.'}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. LAS 4 OPCIONES DE PAGO REDUCIDAS DE INFORMACIÓN                        */}
        {/* (Solo modalidad de cuota, importe y botón que redirige al pago)            */}
        {/* ========================================================================= */}
        <section className="space-y-3 sm:space-y-4">
          
          <div className="text-center space-y-1">
            <h2 className="font-editorial text-xl sm:text-3xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              {language === 'es' ? 'Selecciona tu Modalidad de Pago' : 'Choose Your Payment Plan'}
            </h2>
            <p className="text-[11px] sm:text-sm text-stone-500 dark:text-stone-400">
              {language === 'es'
                ? 'Acceso completo e ilimitado en todas las tarifas. Elige la modalidad de cuota que prefieras.'
                : 'Full unlimited access across all plans. Select the quota mode that works best for you.'}
            </p>
          </div>

          {/* Direct Install App Banner for Mobile/Purchase screen */}
          {!isAppInstalled && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0d2818] via-[#133c24] to-[#0d2818] border border-emerald-500/40 text-stone-100 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto text-left">
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#D4AF37] p-0.5 bg-[#07130E] shrink-0 shadow-sm">
                  <img src="/pwa-192x192.png" alt="PawLove" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-[#F3E5AB]">
                      {language === 'es' ? '¿Estás en tu móvil? Instala la App' : 'On your phone? Install the App'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#D4AF37] text-stone-950">
                      Directo
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300 mt-0.5">
                    {language === 'es'
                      ? 'Instalación directa con 1 toque sin tener que buscar los 3 puntos del navegador.'
                      : 'Direct 1-tap installation without searching for browser 3 dots.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={triggerPwaInstall}
                id="gateway-banner-btn-install"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-stone-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Instalar App Ahora' : 'Install App Now'}</span>
              </button>
            </div>
          )}

          {/* PESTAÑAS DE TARIFAS COMPACTAS PARA MÓVIL (< sm) */}
          <div className="sm:hidden space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {language === 'es' ? 'Pestañas de Tarifas:' : 'Tariff Tabs:'}
              </span>
              <button
                type="button"
                onClick={() => setMobileViewMode(prev => prev === 'tab' ? 'all' : 'tab')}
                className="text-[10px] font-bold text-[#B8860B] dark:text-[#D4AF37] hover:underline cursor-pointer"
              >
                {mobileViewMode === 'tab' 
                  ? (language === 'es' ? 'Ver las 4 tarifas' : 'View all 4') 
                  : (language === 'es' ? 'Ver en pestañas' : 'View as tabs')}
              </button>
            </div>

            {/* Pestañas horizontales reducidas y optimizadas para teléfono */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-stone-100 dark:bg-[#122019] border border-stone-200 dark:border-stone-800 text-[11px]">
              {PRICING_PLANS.map((plan) => {
                const isActive = mobileActivePlanId === plan.id;
                const isPopular = plan.popular;
                return (
                  <button
                    key={`tab-${plan.id}`}
                    type="button"
                    onClick={() => {
                      setMobileActivePlanId(plan.id);
                      setMobileViewMode('tab');
                    }}
                    className={`py-1.5 px-1 rounded-xl font-bold text-center transition-all flex flex-col items-center justify-center leading-tight cursor-pointer ${
                      isActive
                        ? isPopular
                          ? 'bg-[#D4AF37] text-stone-950 shadow-xs font-black'
                          : 'bg-white dark:bg-[#1A2E24] text-stone-900 dark:text-[#F3E5AB] shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="truncate text-[11px]">
                      {plan.id === 'free_trial_48h' 
                        ? '48h' 
                        : plan.id === 'monthly' 
                        ? 'Mes' 
                        : plan.id === 'annual' 
                        ? 'Año ⭐' 
                        : 'Vitalicio'}
                    </span>
                    <span className="text-[9px] font-medium opacity-85">
                      {plan.id === 'free_trial_48h' ? 'Gratis' : plan.priceFormatted}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CUADRÍCULA DE TARIFAS (COMPACTAS PARA MÓVIL Y EXPANDIDAS PARA TABLET/DESKTOP) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-full">
            {PRICING_PLANS.map((plan) => {
              const isTrial = plan.id === 'free_trial_48h';
              const isPopular = plan.popular;
              const isLifetime = plan.id === 'lifetime';
              const isHiddenOnMobile = mobileViewMode === 'tab' && mobileActivePlanId !== plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl w-full max-w-full box-border ${
                    isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
                  } ${
                    isPopular
                      ? 'bg-white dark:bg-[#13231B] border-2 border-[#B8860B] dark:border-[#D4AF37] shadow-lg ring-1 sm:ring-2 ring-[#D4AF37]/20 sm:scale-102 lg:-translate-y-1.5'
                      : 'bg-white/95 dark:bg-[#0F1B15] border border-[#E8DCCB] dark:border-[#D4AF37]/25 hover:border-[#D4AF37]/50 shadow-xs'
                  }`}
                >
                  {/* Badge de la modalidad más pequeño y discreto */}
                  {plan.badge && (
                    <div className={`absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap ${
                      isPopular
                        ? 'bg-[#D4AF37] text-stone-950'
                        : isLifetime
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                    }`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="space-y-2 sm:space-y-3 pt-0.5 sm:pt-1">
                    {/* Título de la tarifa */}
                    <div className="space-y-0.5">
                      <h3 className="font-editorial text-lg sm:text-2xl font-bold text-stone-900 dark:text-[#F3E5AB] leading-snug">
                        {plan.title}
                      </h3>
                      <div className="text-[10px] sm:text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                        {plan.billingModeSummary}
                      </div>
                    </div>

                    {/* Precio y cuota reducido */}
                    <div className="py-1.5 sm:py-2.5 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl bg-stone-50 dark:bg-[#16271F] border border-stone-100 dark:border-stone-800/80">
                      <div className="flex items-baseline gap-1">
                        <span className="font-editorial text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-[#D4AF37]">
                          {plan.priceFormatted}
                        </span>
                        <span className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium">
                          / {plan.periodLabel}
                        </span>
                      </div>
                    </div>

                    {/* Información concisa de la cuota */}
                    <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 leading-snug sm:leading-relaxed min-h-0 sm:min-h-[52px]">
                      {plan.quotaDescription}
                    </p>
                  </div>

                  {/* Botón directo de redirección al pago / activación */}
                  <div className="pt-3 sm:pt-4 mt-2 border-t border-stone-100 dark:border-stone-800/80">
                    {isTrial ? (
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        id="btn-select-trial-48h"
                        className="w-full py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Activar 48h Gratis' : 'Activate 48h Free'}</span>
                      </button>
                    ) : (
                      <div className="space-y-1.5 sm:space-y-2">
                        <button
                          onClick={() => handleSelectPlan(plan)}
                          id={`btn-select-plan-${plan.id}`}
                          className={`w-full py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                            isPopular
                              ? 'bg-[#D4AF37] hover:bg-[#C49F2E] text-stone-950 font-black'
                              : 'bg-stone-900 dark:bg-[#1E3328] text-white hover:bg-stone-800 dark:hover:bg-[#254032]'
                          }`}
                        >
                          <CreditCard className={`w-3.5 h-3.5 ${isPopular ? 'text-stone-950' : ''}`} />
                          <span className={isPopular ? 'text-stone-950 font-black' : ''}>
                            {language === 'es'
                              ? `Pagar ${plan.priceFormatted} (Pasarela)`
                              : `Pay ${plan.priceFormatted} (Gateway)`}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openStripeCheckout(plan.id)}
                          className="w-full text-center text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-[#D4AF37] underline cursor-pointer"
                        >
                          {language === 'es' ? 'O pagar en Stripe oficial ↗' : 'Or pay on official Stripe ↗'}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* COMPACT LEGAL & SECURITY NOTICE AT BOTTOM                                 */}
        {/* ========================================================================= */}
        <section className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 dark:bg-[#112019]/80 border border-amber-200/80 dark:border-[#D4AF37]/25 shadow-xs text-xs space-y-2 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-[#B8860B] dark:bg-[#D4AF37] text-stone-950 font-bold shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-xs text-stone-900 dark:text-[#F3E5AB]">
                {LEGAL_TERMS_SUMMARY.featuresNotice}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 dark:text-stone-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Stripe • PayPal • Tarjetas</span>
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-stone-600 dark:text-stone-400 pt-1.5 border-t border-amber-200/60 dark:border-stone-800">
            <AlertCircle className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>{language === 'es' ? 'Condición de desistimiento y prueba: ' : 'Trial & Refund Notice: '}</strong>
              {LEGAL_TERMS_SUMMARY.noRefundPolicy}
            </p>
          </div>
        </section>

        {/* Security & Guarantee Footer */}
        <section className="text-center space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'es' ? 'Pasarelas verificadas SSL 256-bit' : 'Verified 256-bit SSL Gateways'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
              <span>{language === 'es' ? 'Stripe, PayPal, Visa, Mastercard, AMEX' : 'Stripe, PayPal, Visa, Mastercard, AMEX'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
              <span>{language === 'es' ? 'Activación instantánea tras confirmar' : 'Instant activation upon confirmation'}</span>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 dark:text-stone-500 max-w-xl mx-auto">
            {language === 'es'
              ? 'Una vez confirmada tu tarifa, tendrás acceso permanente según la modalidad seleccionada. Podrás consultar y gestionar tu cuota en cualquier momento desde Ajustes > Modalidad de pagos.'
              : 'Once confirmed, you will enjoy ongoing access according to your selected plan. You can view or change your subscription at any time under Settings > Payment Mode.'}
          </p>
        </section>

      </main>

      {/* 48h Free Trial Modal with Phone + SMS verification */}
      {showPhoneModal && (
        <PhoneVerificationModal
          isOpen={showPhoneModal}
          onClose={() => setShowPhoneModal(false)}
          onSuccess={handlePhoneSuccess}
        />
      )}

      {/* Stripe / PayPal / Card Checkout Modal */}
      {selectedPlanForCheckout && (
        <PaymentCheckoutModal
          isOpen={Boolean(selectedPlanForCheckout)}
          plan={selectedPlanForCheckout}
          onClose={() => setSelectedPlanForCheckout(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
};
