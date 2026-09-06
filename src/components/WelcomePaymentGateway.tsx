import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRICING_PLANS, LEGAL_TERMS_SUMMARY, STRIPE_PAYMENT_LINKS, redirectToStripeCheckout } from '../data/pricingData';
import { PricingPlan, PaymentMethodType } from '../types';
import { PhoneVerificationModal } from './PhoneVerificationModal';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';
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
  AlertCircle 
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
    language, 
    setLanguage, 
    activateSubscription, 
    t 
  } = useApp();

  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PricingPlan | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // If initialSelectedPlanId is passed, handle immediately
  React.useEffect(() => {
    if (initialSelectedPlanId) {
      const foundPlan = PRICING_PLANS.find(p => p.id === initialSelectedPlanId);
      if (foundPlan) {
        if (foundPlan.id === 'free_trial_48h') {
          setShowPhoneModal(true);
        } else {
          const directStripeUrl = foundPlan.stripePaymentLink || (STRIPE_PAYMENT_LINKS as Record<string, string>)[foundPlan.id];
          if (directStripeUrl) {
            redirectToStripeCheckout(directStripeUrl);
            return;
          }
          setSelectedPlanForCheckout(foundPlan);
        }
      }
    }
  }, [initialSelectedPlanId]);

  // Handle plan click: redirect directly to Stripe checkout for paid plans
  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.id === 'free_trial_48h') {
      setShowPhoneModal(true);
    } else {
      const directStripeUrl = plan.stripePaymentLink || (STRIPE_PAYMENT_LINKS as Record<string, string>)[plan.id];
      if (directStripeUrl) {
        redirectToStripeCheckout(directStripeUrl);
        return;
      }
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
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-[#07110C] text-stone-900 dark:text-stone-100 transition-colors duration-300 font-sans selection:bg-amber-500/30 selection:text-amber-900">
      
      {/* ========================================================================= */}
      {/* TOP HEADER: BRAND IDENTITY + LANGUAGE / THEME UTILITIES                   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 w-full border-b border-[#E8DCCB] dark:border-[#D4AF37]/20 bg-[#FAF7F2]/95 dark:bg-[#07130E]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] text-stone-950 shadow-md">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="font-editorial text-2xl sm:text-3xl font-extrabold tracking-wider text-[#B8860B] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#D4AF37] dark:via-[#F3E5AB] dark:to-[#D4AF37]">
                PAWLOVE
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-stone-500 dark:text-[#D4AF37]/80 leading-none">
                {language === 'es' ? 'Recetas Caseras & Nutrición para Mascotas' : 'Homemade Nutrition & Pet Care'}
              </div>
            </div>
          </div>

          {/* Minimal Controls: Language & Theme only */}
          <div className="flex items-center gap-2">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/35 text-xs font-bold text-stone-800 dark:text-[#F3E5AB] hover:border-[#B8860B] dark:hover:border-[#D4AF37] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                <span className="hidden sm:inline">{language === 'es' ? 'Presentación' : 'Landing'}</span>
              </button>
            )}
            
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-xs font-bold text-stone-800 dark:text-[#F3E5AB] hover:scale-105 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title={language === 'es' ? 'Cambiar a English' : 'Switch to Español'}
            >
              <Globe className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
              <span className="font-mono">{language.toUpperCase()}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-stone-700 dark:text-[#F3E5AB] hover:scale-105 transition-all shadow-xs cursor-pointer"
              title={theme === 'dark' ? t('themeLight') : t('themeDark')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#D4AF37]" />
              ) : (
                <Moon className="w-4 h-4 text-[#B8860B]" />
              )}
            </button>

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
        <section className="space-y-4">
          
          <div className="text-center space-y-1">
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              {language === 'es' ? 'Selecciona tu Modalidad de Pago' : 'Choose Your Payment Plan'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              {language === 'es'
                ? 'Acceso completo e ilimitado en todas las tarifas. Elige la modalidad de cuota que prefieras.'
                : 'Full unlimited access across all plans. Select the quota mode that works best for you.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PRICING_PLANS.map((plan) => {
              const isTrial = plan.id === 'free_trial_48h';
              const isPopular = plan.popular;
              const isLifetime = plan.id === 'lifetime';

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                    isPopular
                      ? 'bg-white dark:bg-[#13231B] border-2 border-[#B8860B] dark:border-[#D4AF37] shadow-lg ring-2 ring-[#D4AF37]/20 scale-102 lg:-translate-y-1.5'
                      : 'bg-white/95 dark:bg-[#0F1B15] border border-[#E8DCCB] dark:border-[#D4AF37]/25 hover:border-[#D4AF37]/50 shadow-sm'
                  }`}
                >
                  {/* Badge de la modalidad */}
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap ${
                      isPopular
                        ? 'bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-stone-950'
                        : isLifetime
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                    }`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="space-y-3 pt-1">
                    {/* Título de la tarifa */}
                    <div className="space-y-0.5">
                      <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                        {plan.title}
                      </h3>
                      <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                        {plan.billingModeSummary}
                      </div>
                    </div>

                    {/* Precio y cuota */}
                    <div className="py-2.5 px-3 rounded-2xl bg-stone-50 dark:bg-[#16271F] border border-stone-100 dark:border-stone-800/80">
                      <div className="flex items-baseline gap-1">
                        <span className="font-editorial text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-[#D4AF37]">
                          {plan.priceFormatted}
                        </span>
                        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                          / {plan.periodLabel}
                        </span>
                      </div>
                    </div>

                    {/* Información concisa de la cuota (sin lista de features repetidas) */}
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed min-h-[58px]">
                      {plan.quotaDescription}
                    </p>
                  </div>

                  {/* Botón directo de redirección al pago / activación */}
                  <div className="pt-4 mt-2 border-t border-stone-100 dark:border-stone-800/80">
                    {isTrial ? (
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        id="btn-select-trial-48h"
                        className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{language === 'es' ? 'Activar 48h Gratis' : 'Activate 48h Free'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        id={`btn-select-plan-${plan.id}`}
                        className={`w-full py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                          isPopular
                            ? 'bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-stone-950 font-extrabold'
                            : 'bg-stone-900 dark:bg-[#1E3328] text-white hover:bg-stone-800 dark:hover:bg-[#254032]'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>
                          {language === 'es'
                            ? `Pagar ${plan.priceFormatted} (Stripe)`
                            : `Pay ${plan.priceFormatted} (Stripe)`}
                        </span>
                      </button>
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
