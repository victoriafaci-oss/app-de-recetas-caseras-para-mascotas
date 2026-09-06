import { PricingPlan } from '../types';

export const STRIPE_PAYMENT_LINKS = {
  monthly: 'https://buy.stripe.com/3cI8wRdfV1ID9J9gFb1ZS00',
  annual: 'https://buy.stripe.com/eVq8wR6Rxaf93kL1Kh1ZS01',
  lifetime: 'https://buy.stripe.com/3cI3cx6Rxaf97B1fB71ZS02',
} as const;

export const redirectToStripeCheckout = (planIdOrUrl: string): boolean => {
  const link = (STRIPE_PAYMENT_LINKS as Record<string, string>)[planIdOrUrl] || planIdOrUrl;
  if (link && link.startsWith('http')) {
    // Open in a new tab to prevent iframe blocking (Stripe Checkout cannot be loaded inside an iframe)
    const win = window.open(link, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = link;
    }
    return true;
  }
  return false;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'lifetime',
    title: 'Tarifa Vitalicia',
    subtitle: 'Pago único para siempre sin cuotas',
    priceEur: 39.99,
    priceFormatted: '39,99 €',
    periodLabel: 'pago único de por vida',
    badge: 'Para siempre • Sin renovaciones',
    billingModeSummary: 'Pago único vitalicio',
    quotaDescription: 'Cuota vitalicia de 39,99 € en un solo pago. Disfruta de acceso permanente e ilimitado para siempre, sin suscripciones ni cuotas futuras.',
    stripePaymentLink: 'https://buy.stripe.com/3cI3cx6Rxaf97B1fB71ZS02',
    features: [
      'Acceso permanente de por vida a toda la plataforma',
      'Único pago para siempre, sin cuotas ni renovaciones',
      'Todas las características y futuras actualizaciones incluidas',
      'Gestión de hasta 4 mascotas con perfiles ilimitados',
      'Soporte preferente y máxima tranquilidad'
    ]
  },
  {
    id: 'annual',
    title: 'Tarifa Anual',
    subtitle: 'Cuota anual de un solo cobro al año',
    priceEur: 19.99,
    priceFormatted: '19,99 €',
    periodLabel: 'al año (~1,66 €/mes)',
    badge: 'Opción más popular • Ahorra 58%',
    popular: true,
    billingModeSummary: 'Suscripción anual con 58% de ahorro',
    quotaDescription: 'Cuota anual de 19,99 € cobrada una sola vez al año. Equivale a solo ~1,66 €/mes, ahorrando un 58% respecto a la modalidad mensual.',
    stripePaymentLink: 'https://buy.stripe.com/eVq8wR6Rxaf93kL1Kh1ZS01',
    features: [
      'Mismas funciones completas que todos los planes',
      'Ahorro superior al 58% respecto al pago mensual',
      'Consultas ilimitadas con Nutri IA durante todo el año',
      'Planificación semanal continua de comidas 7 días',
      'Historial clínico y evolución de peso garantizados'
    ]
  },
  {
    id: 'monthly',
    title: 'Tarifa Mensual',
    subtitle: 'Cuota mensual flexible mes a mes',
    priceEur: 3.99,
    priceFormatted: '3,99 €',
    periodLabel: 'al mes',
    badge: 'Cuota mensual flexible',
    billingModeSummary: 'Suscripción mensual recurrente',
    quotaDescription: 'Cuota mensual de 3,99 € facturada mes a mes. Renovación automática que puedes cancelar en cualquier momento sin permanencia ni penalización.',
    stripePaymentLink: 'https://buy.stripe.com/3cI8wRdfV1ID9J9gFb1ZS00',
    features: [
      'Acceso total a todas las herramientas de la app',
      'Recetario completo con escalador de gramos por peso',
      'Agenda de medicamentos con avisos acústicos',
      'Seguimiento diario de hidratación, paseos y peso',
      'Renovación mensual cancelable en cualquier momento'
    ]
  },
  {
    id: 'free_trial_48h',
    title: 'Prueba Gratuita',
    subtitle: 'Acceso total durante 48 horas sin coste',
    priceEur: 0,
    priceFormatted: '0,00 €',
    periodLabel: '48 horas de prueba',
    badge: 'Sin tarjeta bancaria',
    requiresPhoneVerification: true,
    billingModeSummary: 'Prueba gratuita de 48 horas',
    quotaDescription: 'Acceso completo durante 48 horas sin coste. Confirmación rápida por SMS a tu teléfono móvil, sin introducir datos de tarjeta bancaria.',
    features: [
      'Acceso completo a todas las funciones sin restricciones',
      'Confirmación rápida mediante SMS a tu móvil',
      'Cálculo calórico RER / MER para tus mascotas',
      'Asistente veterinario Nutri IA con IA activa',
      'Sin cobros ocultos ni cargos automáticos'
    ]
  }
];

export const LEGAL_TERMS_SUMMARY = {
  featuresNotice: 'Las características de la app son idénticas y completas para todas las tarifas contratadas.',
  noRefundPolicy: 'Aviso sobre reembolsos: Debido a la activación digital inmediata del servicio y acceso a las recetas y herramientas clínicas, no existe período de prueba para la devolución o reembolso de los importes cobrados.',
  securityNotice: 'Transacciones cifradas de 256 bits mediante pasarelas seguras certificadas con Stripe y PayPal.'
};
