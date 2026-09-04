import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRICING_PLANS, LEGAL_TERMS_SUMMARY } from '../data/pricingData';
import { PricingPlan, PaymentMethodType } from '../types';
import { PhoneVerificationModal } from './PhoneVerificationModal';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';
import { 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  Check, 
  Sparkles, 
  X, 
  Calendar, 
  RotateCcw, 
  AlertCircle,
  Zap,
  Phone,
  ArrowRight
} from 'lucide-react';

interface PaymentPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentPlansModal: React.FC<PaymentPlansModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    subscription, 
    activateSubscription, 
    cancelOrResetSubscription, 
    language,
    showToast 
  } = useApp();

  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PricingPlan | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  if (!isOpen) return null;

  const currentPlan = PRICING_PLANS.find(p => p.id === subscription?.planId);

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.id === subscription?.planId) {
      showToast(
        language === 'es' ? 'Ya tienes activa esta tarifa.' : 'You already have this plan active.',
        'info'
      );
      return;
    }

    if (plan.id === 'free_trial_48h') {
      setShowPhoneModal(true);
    } else {
      setSelectedPlanForCheckout(plan);
    }
  };

  const handlePhoneSuccess = async (phone: string) => {
    setShowPhoneModal(false);
    await activateSubscription('free_trial_48h', 'phone_sms', { phoneNumber: phone });
    onClose();
  };

  const handlePaymentSuccess = async (method: PaymentMethodType, details: { cardLast4?: string; transactionId: string }) => {
    if (!selectedPlanForCheckout) return;
    const planId = selectedPlanForCheckout.id;
    setSelectedPlanForCheckout(null);
    await activateSubscription(planId, method, details);
    onClose();
  };

  // Formatted dates
  const activatedDate = subscription?.activatedAt 
    ? new Date(subscription.activatedAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const expiryDate = subscription?.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0D1813] border border-[#E8DCCB] dark:border-[#D4AF37]/35 rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-[#F3E5AB] bg-stone-100 dark:bg-stone-800/60 transition-colors"
          title={language === 'es' ? 'Cerrar' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-[#F3E5AB] text-xs font-bold border border-amber-300 dark:border-[#D4AF37]/30">
            <CreditCard className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
            <span>{language === 'es' ? 'Modalidad de Pagos & Suscripción' : 'Payment Mode & Subscription'}</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-[#F3E5AB]">
            {language === 'es' ? 'Gestión de tu Tarifa' : 'Manage Your Plan'}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {language === 'es' 
              ? 'Consulta los detalles de tu suscripción actual y cambia de tarifa en cualquier momento.'
              : 'Review your current active subscription details and change your plan at any time.'}
          </p>
        </div>

        {/* Current Active Plan Status Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/80 dark:border-[#D4AF37]/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-amber-200/60 dark:border-[#D4AF37]/20">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400">
                {language === 'es' ? 'Tarifa actual activa' : 'Current active plan'}
              </div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                {currentPlan?.title || subscription?.planTitle || (language === 'es' ? 'Sin suscripción' : 'No subscription')}
              </h3>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700/60 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{language === 'es' ? 'Activo' : 'Active'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-stone-400 dark:text-stone-500 text-[11px] block">
                {language === 'es' ? 'Importe' : 'Amount'}
              </span>
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {subscription ? `${subscription.amountEur.toFixed(2)} €` : '0,00 €'}
              </span>
            </div>

            <div>
              <span className="text-stone-400 dark:text-stone-500 text-[11px] block">
                {language === 'es' ? 'Método' : 'Method'}
              </span>
              <span className="font-bold text-stone-800 dark:text-stone-200 uppercase">
                {subscription?.paymentMethod || 'Stripe'}
              </span>
            </div>

            <div>
              <span className="text-stone-400 dark:text-stone-500 text-[11px] block">
                {language === 'es' ? 'Validez / Expiración' : 'Validity / Expiry'}
              </span>
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {subscription?.isLifetime 
                  ? (language === 'es' ? 'Vitalicio (Sin límite)' : 'Lifetime (No limit)')
                  : expiryDate || '48h'}
              </span>
            </div>
          </div>

          {subscription?.transactionId && (
            <div className="text-[10px] font-mono text-stone-400 dark:text-stone-500 pt-1">
              ID Ref: {subscription.transactionId}
            </div>
          )}
        </div>

        {/* Change Plan Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              {language === 'es' ? 'Cambiar a otra modalidad de pago' : 'Switch to another payment plan'}
            </h4>
            <span className="text-[11px] text-stone-500">
              {language === 'es' ? 'Mismas características completas' : 'Identical full features'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRICING_PLANS.map((plan) => {
              const isCurrent = plan.id === subscription?.planId;

              return (
                <div
                  key={plan.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isCurrent
                      ? 'border-[#B8860B] dark:border-[#D4AF37] bg-amber-50/60 dark:bg-[#1A2D23] ring-1 ring-[#D4AF37]/50'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-[#122019] hover:border-[#D4AF37]/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900 dark:text-[#F3E5AB]">
                        {plan.title}
                      </span>
                      <span className="font-extrabold text-sm text-[#B8860B] dark:text-[#D4AF37]">
                        {plan.priceFormatted}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {plan.subtitle}
                    </p>
                  </div>

                  <div>
                    {isCurrent ? (
                      <div className="py-2 px-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Tarifa actual' : 'Current plan'}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className="w-full py-2 px-3 rounded-xl bg-stone-900 dark:bg-[#1E3328] hover:bg-[#B8860B] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>{language === 'es' ? 'Cambiar a esta tarifa' : 'Switch to this plan'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Refund Policy Reminder as required */}
        <div className="p-3 rounded-2xl bg-stone-100 dark:bg-[#14221B] border border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400 space-y-1">
          <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
            <span>{language === 'es' ? 'Aviso legal sobre devoluciones:' : 'Legal notice on refunds:'}</span>
          </div>
          <p>
            {LEGAL_TERMS_SUMMARY.noRefundPolicy}
          </p>
        </div>

        {/* Reset / Demo Action for testing */}
        <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              cancelOrResetSubscription();
              onClose();
            }}
            className="text-xs text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5 transition-colors"
            title={language === 'es' ? 'Simular usuario nuevo y volver a pasarela' : 'Reset to initial gateway view'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Probar pasarela de bienvenida (Simular nuevo usuario)' : 'Test welcome gateway (Simulate new visitor)'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-stone-200 dark:bg-stone-800 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
          >
            {language === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>

      </div>

      {/* Sub-modals for phone or card payment if switching */}
      {showPhoneModal && (
        <PhoneVerificationModal
          isOpen={showPhoneModal}
          onClose={() => setShowPhoneModal(false)}
          onSuccess={handlePhoneSuccess}
        />
      )}

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
