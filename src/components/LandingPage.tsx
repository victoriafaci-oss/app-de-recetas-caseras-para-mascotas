import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getLandingTranslation } from '../data/landingTranslations';
import { RECIPES_CATALOG } from '../data/mockData';
import { PRICING_PLANS, STRIPE_PAYMENT_LINKS, openStripeCheckout, redirectToStripeCheckout } from '../data/pricingData';
import { FloatingPawsBackground } from './FloatingPawsBackground';
import { LanguageSelector } from './LanguageSelector';
import { 
  ChefHat, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  Scale, 
  Calendar, 
  Bell, 
  Sun, 
  Moon, 
  Star, 
  Award, 
  Utensils, 
  AlertTriangle, 
  HeartCrack, 
  CircleDollarSign, 
  BookOpen,
  CreditCard,
  Lock,
  ShieldCheck,
  Zap,
  Phone,
  Apple,
  Droplets,
  Heart,
  Clock,
  CheckCircle2,
  Globe,
  Sliders,
  Activity,
  Flame,
  CheckCircle,
  Info,
  Smartphone,
  Download,
  X,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

interface LandingPageProps {
  onGoToPricing: (planId?: string) => void;
  onGoToApp?: () => void;
}

interface DemoPetProfile {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  age: string;
  weightKg: number;
  condition: string;
  allergies: string;
  dailyGrams: number;
  dailyKcal: number;
  dailyWaterTarget: number;
  dailyBrothTarget: number;
  recommendedRecipe: string;
  keyNutrient: string;
  avoidFood: string;
  imageUrl: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToPricing, onGoToApp }) => {
  const { 
    theme, 
    toggleTheme, 
    setTheme, 
    language, 
    setLanguage, 
    setShowPwaInstallModal, 
    setCurrentView,
    activateSubscription,
    setShowPostPurchaseInstallModal,
    triggerPwaInstall,
    showToast
  } = useApp();
  const lt = getLandingTranslation(language);

  // Miniatura de muestra de recetas
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});

  // Modal de textos legales (Términos y Condiciones / Política de Privacidad)
  const [legalModalType, setLegalModalType] = useState<'terminos' | 'privacidad' | null>(null);

  // Pestaña de tarifas activa en móvil y modo de visualización
  const [landingActiveTab, setLandingActiveTab] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
  const [landingViewMode, setLandingViewMode] = useState<'tab' | 'all'>('tab');

  // 3 platos de muestra discretos
  const sampleDishes = RECIPES_CATALOG.slice(0, 3);

  // Perfiles de demostración interactiva de personalización
  const demoProfiles: DemoPetProfile[] = [
    {
      id: 'dog-senior',
      name: 'Rocky',
      species: 'dog',
      breed: 'Golden Retriever',
      age: '5 años y medio (Adulto)',
      weightKg: 28.5,
      condition: 'Soporte Articular & Displasia leve',
      allergies: 'Sensibilidad a pollo industrial y cereales con gluten',
      dailyGrams: 620,
      dailyKcal: 1250,
      dailyWaterTarget: 1450,
      dailyBrothTarget: 300,
      recommendedRecipe: 'Estofado Royale de Salmón Salvaje & Patas de Pollo con Colágeno',
      keyNutrient: 'EPA/DHA de salmón salvaje + condroitina natural',
      avoidFood: 'Piensos con harinas de subproductos y cereales procesados',
      imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'cat-renal',
      name: 'Luna',
      species: 'cat',
      breed: 'Gata Persa',
      age: '4 años (Adulto)',
      weightKg: 4.2,
      condition: 'Prevención Renal & Baja ingesta de agua',
      allergies: 'Ninguna detectada',
      dailyGrams: 145,
      dailyKcal: 230,
      dailyWaterTarget: 120,
      dailyBrothTarget: 100,
      recommendedRecipe: 'Mousse Imperial de Conejo, Yema & Quelante de Fósforo',
      keyNutrient: 'Taurina biodisponible + Caldo filtrado sin sal',
      avoidFood: 'Comida seca extruida (piensos deshidratantes) y atún en lata humana',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'puppy-growth',
      name: 'Toby',
      species: 'dog',
      breed: 'Border Collie Puppy',
      age: '6 meses (Cachorro)',
      weightKg: 9.5,
      condition: 'Crecimiento Óseo & Alta Actividad',
      allergies: 'Ninguna (período de introducción)',
      dailyGrams: 390,
      dailyKcal: 680,
      dailyWaterTarget: 600,
      dailyBrothTarget: 150,
      recommendedRecipe: 'Festín Puppy de Ternera, Huevo de Corral & Calostro',
      keyNutrient: 'Calcio bioasimilable (cáscara de huevo) + Fosfolípidos',
      avoidFood: 'Huesos cocinados y uvas/pasas',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const [selectedDemoId, setSelectedDemoId] = useState<string>('dog-senior');
  const activeProfile = demoProfiles.find(p => p.id === selectedDemoId) || demoProfiles[0];

  // Testimonios de tutores reales
  const testimonials = [
    {
      name: "Laura M.",
      pet: "Rocky, Labrador de 4 años",
      type: "dog",
      text: "Llevaba años dándole pienso premium y pensaba que era suficiente. Desde que uso la app para calcular los gramos exactos y preparar las recetas, Rocky tiene más energía, pelo brillante y se le acabaron las diarreas. Ojalá lo hubiera hecho antes.",
      stars: 5
    },
    {
      name: "Carlos R.",
      pet: "Luna, Gata persa de 6 años",
      type: "cat",
      text: "Mi gata siempre fue delicada y selectiva. La app me calcula los caldos de colágeno y recetas renales con el nivel justo de taurina. El monitor de hidratación diario ha sido clave para proteger sus riñones.",
      stars: 5
    },
    {
      name: "Marta G.",
      pet: "Thor, Pastor alemán senior de 10 años",
      type: "dog",
      text: "Thor tiene artrosis. La transición progresiva desde el pienso que indica la app fue impecable, sin un solo problema digestivo. Las recetas con omega-3 y las alarmas de condroprotectores le han devuelto las ganas de pasear.",
      stars: 5
    },
    {
      name: "Javier P.",
      pet: "Miso, Gato común de 2 años",
      type: "cat",
      text: "Me daba pánico cocinarle y dejarlo desnutrido. La app te da la ración exacta por peso y planifica la semana. Ahora cocino por lotes los domingos y gasto menos dinero que con el pienso de gama alta.",
      stars: 5
    }
  ];

  return (
    <div className={`relative min-h-screen ${theme === 'dark' ? 'dark bg-[#0A0F0D] text-[#EDE8DF]' : 'light bg-[#FAF7F2] text-stone-900'} font-sans transition-colors duration-300 overflow-x-hidden selection:bg-amber-500/25 selection:text-amber-900 dark:selection:bg-[#E8B84A]/30 dark:selection:text-[#FFF8E7]`}>
      
      {/* ========================================================================= */}
      {/* FONDO DINÁMICO AMBIENTAL TRANSLÚCIDO (ORBS + PATRÓN ORGÁNICO)               */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Glow Ámbar / Dorado Cálido */}
        <div className="absolute -top-24 left-1/4 w-[28rem] h-[28rem] bg-amber-400/10 dark:bg-[#E8B84A]/10 rounded-full blur-3xl animate-float-slow" />
        {/* Glow Verde Bosque / Esmeralda */}
        <div className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl animate-float-reverse" />
        {/* Glow Inferior Ámbar Profundo */}
        <div className="absolute bottom-1/4 -left-20 w-[26rem] h-[26rem] bg-amber-600/10 dark:bg-yellow-600/8 rounded-full blur-3xl animate-float-slow" />
        
        {/* Patrón de líneas arquitectónicas sutiles y translúcidas */}
        <div 
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.045] bg-[radial-gradient(#C49A45_1px,transparent_1px)] [background-size:24px_24px]" 
        />
      </div>

      {/* Partículas brillantes flotantes en forma de patitas de mascota (oro y champán) */}
      <FloatingPawsBackground />

      {/* ========================================================================= */}
      {/* HEADER: LOGO, SELECTOR DÍA/NOCHE, IDIOMA Y ACCESO                          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E8DCCB] dark:border-[#E8B84A]/20 bg-[#FAF7F2]/95 dark:bg-[#0A0F0D]/90 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo Brand / Icono e Identidad Visual (Sin acceso directo a la App) */}
          <div
            className="flex items-center gap-2 sm:gap-3 min-w-0 shrink select-none text-left"
            id="landing-logo-brand"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-2xs shrink-0 border border-[#D4AF37]/60 bg-[#07130E] flex items-center justify-center">
              <img 
                src="/apple-touch-icon.png" 
                alt="PAWLOVE Mascotas" 
                className="w-full h-full object-cover aspect-square pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center leading-none shrink-0 select-none">
              <span className="font-editorial text-[11px] sm:text-xs md:text-sm font-black tracking-wider text-[#B8860B] dark:text-[#E8B84A] leading-none">
                paw
              </span>
              <span className="font-editorial text-[11px] sm:text-xs md:text-sm font-black tracking-wider text-[#B8860B] dark:text-[#E8B84A] leading-none mt-0.5">
                love
              </span>
            </div>
          </div>

          {/* Controles: Modo Día/Noche, Idioma y Botón Tarifas */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Segmented Theme Switcher */}
            <div 
              role="group"
              aria-label={language === 'es' ? 'Selector de Modo Claro y Oscuro' : 'Light and Dark mode selector'}
              className="flex items-center p-0.5 rounded-full bg-white dark:bg-[#121B16] border border-[#E8DCCB] dark:border-[#D4AF37]/30 shadow-2xs shrink-0"
            >
              <button
                type="button"
                onClick={() => setTheme('light')}
                id="landing-btn-theme-light"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[#B8860B] text-white shadow-xs scale-102 ring-1 ring-amber-600/40'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-[#F3E5AB]'
                }`}
                title={language === 'es' ? 'Activar Modo Claro champán' : 'Switch to Light Mode'}
              >
                <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-200' : 'text-amber-500'}`} />
                <span className="hidden sm:inline">{language === 'es' ? 'Claro' : 'Light'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                id="landing-btn-theme-dark"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#16271F] text-[#F3E5AB] shadow-xs scale-102 ring-1 ring-[#D4AF37]/50'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-[#F3E5AB]'
                }`}
                title={language === 'es' ? 'Activar Modo Oscuro royal' : 'Switch to Dark Mode'}
              >
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-stone-500'}`} />
                <span className="hidden sm:inline">{language === 'es' ? 'Oscuro' : 'Dark'}</span>
              </button>
            </div>

            {/* Selector de Idioma (Mundial / Europa) */}
            <LanguageSelector idPrefix="landing-lang" align="right" />

            {/* Botón Volver a la App (Permite regresar inmediatamente a la aplicación) */}
            <button
              onClick={() => {
                if (onGoToApp) {
                  onGoToApp();
                } else {
                  setCurrentView('app');
                }
              }}
              id="btn-header-return-app"
              className="h-8 sm:h-9 px-3 sm:px-4 rounded-full bg-[#B8860B] hover:bg-[#996515] dark:bg-[#D4AF37] dark:hover:bg-[#C49F2E] text-white dark:text-stone-950 font-black text-[11px] sm:text-xs tracking-wide shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              title={language === 'es' ? 'Volver a mi panel de la App' : 'Return to App Dashboard'}
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{language === 'es' ? 'Volver a la App' : 'Back to App'}</span>
            </button>

            {/* Botón Tarifas */}
            <button
              onClick={() => {
                const el = document.getElementById('tarifas');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onGoToPricing();
                }
              }}
              id="btn-header-tarifas-small"
              className="h-8 sm:h-9 px-3 sm:px-4 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-[#F3E5AB] font-bold text-[11px] sm:text-xs tracking-wide shadow-2xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 border border-stone-200 dark:border-stone-700"
            >
              <span>{lt.pricing}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-700 dark:text-[#F3E5AB]" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO PRINCIPAL: EL CONCEPTO CLAVE - PERSONALIZACIÓN POR SUS DATOS ÚNICOS */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-8 sm:pt-12 pb-12 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        
        {/* Badge Principal */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-5 shadow-xs">
          <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{lt.heroBadge}</span>
        </div>

        {/* Título principal enfocado en el concepto único */}
        <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white leading-tight max-w-4xl mx-auto">
          {language === 'es' ? (
            <>
              Cada mascota es única. <br />
              <span className="text-amber-700 dark:text-[#E8B84A]">
                Su alimentación y cuidados también deben serlo.
              </span>
            </>
          ) : (
            <>
              {lt.heroTitle1} {lt.heroDogs} {lt.heroAnd} {lt.heroCats}
            </>
          )}
        </h1>

        {/* Descripción clara del funcionamiento */}
        <p className="mt-5 text-base sm:text-xl text-stone-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
          {lt.heroSubtitle}
        </p>

        {/* Botones de acción principales */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={() => onGoToPricing('free_trial_48h')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#D4AF37] hover:bg-[#C49F2E] text-stone-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/20 dark:shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span className="text-stone-950 font-black">{lt.heroStartTrial}</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('tarifas');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                onGoToPricing();
              }
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white dark:bg-[#131F18] border border-stone-200 dark:border-[#E8B84A]/40 text-stone-800 dark:text-[#EDE8DF] font-semibold text-sm hover:border-amber-500 dark:hover:border-[#E8B84A] shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-amber-600 dark:text-[#E8B84A]" />
            <span>{lt.heroViewPlans}</span>
          </button>
        </div>

        <p className="mt-3 text-xs text-stone-500 dark:text-gray-400 flex items-center justify-center gap-2">
          <span>{lt.heroNoCard}</span>
        </p>

        {/* SIMULADOR INTERACTIVO DESTACADO EN EL HERO */}
        <div className="mt-10 text-left rounded-3xl border border-amber-300/80 dark:border-[#E8B84A]/40 bg-white/95 dark:bg-[#111A15]/95 backdrop-blur-md p-5 sm:p-8 shadow-2xl relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
            <div>
              <div className="text-[10px] uppercase font-extrabold tracking-wider text-amber-700 dark:text-[#E8B84A] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Simulador en vivo de la App</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                Selecciona un perfil y mira cómo la App adapta todo al instante:
              </h2>
            </div>

            {/* Selector de perfiles interactivo */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-[#0A0F0D] border border-stone-200 dark:border-stone-800 self-start sm:self-auto">
              {demoProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedDemoId(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedDemoId === p.id
                      ? 'bg-[#D4AF37] text-stone-950 shadow-sm font-black'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <span>{p.species === 'dog' ? '🐕' : '🐈'}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ficha interactiva de resultados adaptados */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Foto e identidad del animal seleccionado */}
            <div className="lg:col-span-4 flex flex-col items-center text-center p-4 rounded-2xl bg-stone-50 dark:bg-[#0A0F0D]/70 border border-stone-200/80 dark:border-stone-800">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-500 dark:border-[#E8B84A] mb-3 shadow-md">
                <img 
                  src={activeProfile.imageUrl} 
                  alt={activeProfile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-extrabold text-lg text-stone-900 dark:text-white flex items-center gap-1.5">
                <span>{activeProfile.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                  {activeProfile.species === 'dog' ? 'Perro' : 'Gata'}
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">{activeProfile.breed} • {activeProfile.weightKg} kg</p>
              
              <div className="mt-3 w-full text-left space-y-2 text-[11px] pt-3 border-t border-stone-200 dark:border-stone-800">
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-gray-400">Etapa:</span>
                  <span className="font-semibold text-stone-800 dark:text-gray-200">{activeProfile.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-gray-400">Condición:</span>
                  <span className="font-semibold text-amber-700 dark:text-amber-400 truncate max-w-[140px]" title={activeProfile.condition}>
                    {activeProfile.condition}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-gray-400">Sensibilidad:</span>
                  <span className="font-semibold text-red-600 dark:text-red-400 truncate max-w-[140px]" title={activeProfile.allergies}>
                    {activeProfile.allergies}
                  </span>
                </div>
              </div>
            </div>

            {/* Prescripción personalizada generada por la App */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Ración al gramo */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-[#15231B] border border-amber-200 dark:border-[#E8B84A]/30">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-[#E8B84A] mb-1">
                  <Scale className="w-4 h-4" />
                  <span>RACIÓN AL GRAMO PRESCRITA</span>
                </div>
                <div className="text-2xl font-black text-stone-900 dark:text-white">
                  {activeProfile.dailyGrams} g <span className="text-xs font-normal text-stone-500 dark:text-gray-400">al día ({Math.round(activeProfile.dailyGrams / 2)}g / toma)</span>
                </div>
                <div className="text-[11px] text-stone-600 dark:text-gray-300 mt-1">
                  Cálculo Kleiber: <strong className="text-stone-900 dark:text-white">{activeProfile.dailyKcal} kcal/día</strong> adaptadas a su peso y actividad.
                </div>
              </div>

              {/* Hidratación adaptada */}
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-[#0D1F2D] border border-blue-200 dark:border-blue-500/30">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-400 mb-1">
                  <Droplets className="w-4 h-4" />
                  <span>HIDRATACIÓN & CALDOS</span>
                </div>
                <div className="text-2xl font-black text-stone-900 dark:text-white">
                  {activeProfile.dailyWaterTarget + activeProfile.dailyBrothTarget} ml <span className="text-xs font-normal text-stone-500 dark:text-gray-400">líquido total diario</span>
                </div>
                <div className="text-[11px] text-stone-600 dark:text-gray-300 mt-1">
                  Incluye <strong className="text-blue-700 dark:text-blue-300">{activeProfile.dailyBrothTarget} ml en caldos con colágeno</strong> para proteger sus riñones.
                </div>
              </div>

              {/* Receta recomendada para su condición */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-[#10241A] border border-emerald-200 dark:border-emerald-500/30">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-1">
                  <Utensils className="w-4 h-4" />
                  <span>RECETA ADECUADA</span>
                </div>
                <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                  {activeProfile.recommendedRecipe}
                </div>
                <div className="text-[11px] text-stone-600 dark:text-gray-300 mt-1">
                  Nutriente clave: <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{activeProfile.keyNutrient}</span>.
                </div>
              </div>

              {/* Semáforo y Alimentos prohibidos para él */}
              <div className="p-4 rounded-xl bg-red-50/70 dark:bg-[#201114] border border-red-200 dark:border-red-500/30">
                <div className="flex items-center gap-2 text-xs font-bold text-red-800 dark:text-red-400 mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>ALIMENTOS A EVITAR</span>
                </div>
                <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                  Filtro de seguridad clínica
                </div>
                <div className="text-[11px] text-red-700 dark:text-red-300 mt-1">
                  {activeProfile.avoidFood}
                </div>
              </div>

            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Puedes registrar varios perros o gatos y actualizar su peso conforme evolucionan.</span>
            </span>
            <button
              onClick={() => onGoToPricing('free_trial_48h')}
              className="text-amber-700 dark:text-[#E8B84A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Personalizar a mi mascota gratis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CÓMO FUNCIONA EL FLUJO EN 3 PASOS INTELIGENTES */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#111A15]/80 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-[#1C2820] text-amber-800 dark:text-[#E8B84A] font-black text-xs flex items-center justify-center mb-3">
              01
            </div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white mb-1">
              1. Introduces su ficha biológica
            </h3>
            <p className="text-xs text-stone-600 dark:text-gray-400 leading-relaxed">
              Especie (perro o gato), edad exacta, peso actual y peso objetivo, si está esterilizado, nivel de ejercicio diario y sensibilidades o patologías previas.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#111A15]/80 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-[#142A1E] text-emerald-800 dark:text-emerald-400 font-black text-xs flex items-center justify-center mb-3">
              02
            </div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white mb-1">
              2. Cálculo metabólico Kleiber
            </h3>
            <p className="text-xs text-stone-600 dark:text-gray-400 leading-relaxed">
              El motor clínico calcula las calorías basales y de mantenimiento (RER/MER) sin aproximaciones 'a ojo', evitando tanto el sobrepeso articular como la desnutrición.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#111A15]/80 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-[#251A2C] text-purple-800 dark:text-purple-400 font-black text-xs flex items-center justify-center mb-3">
              03
            </div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white mb-1">
              3. Prescripción y seguimiento diario
            </h3>
            <p className="text-xs text-stone-600 dark:text-gray-400 leading-relaxed">
              Recibes los gramos exactos por toma, recetas filtradas para su caso, meta diaria de hidratación con caldos, lista de alimentos prohibidos y agenda médica.
            </p>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. EL GRAN DOLOR: LA COMIDA INDUSTRIAL                                    */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-10 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/90 dark:bg-[#111A15]/90 backdrop-blur-md border border-red-200 dark:border-red-900/30 shadow-xl relative overflow-hidden text-center transition-colors duration-300">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span>La realidad sobre la comida ultraprocesada</span>
          </div>

          <h2 className="font-editorial text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white leading-tight">
            Si estás alimentando a tu perro o gato con comida industrial, hay algo que debes saber:
          </h2>

          <p className="mt-4 text-2xl sm:text-3xl text-amber-700 dark:text-[#E8B84A] font-editorial italic">
            "No sabes realmente qué está comiendo."
          </p>

          <div className="mt-6 space-y-4 text-base sm:text-lg text-stone-600 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            <p>
              Piensos ultraprocesados extrusionados a más de 200°C, harinas cárnicas de baja digestibilidad, conservantes químicos artificiales… y lo peor de todo: una dieta seca, monótona y repetitiva que no se adapta a su edad, a su peso ni a sus necesidades biológicas reales.
            </p>
            <p className="text-amber-800 dark:text-[#F3E5AB] font-medium">
              Y mientras tanto, compras sacos caros creyendo que lo estás haciendo bien.
            </p>
          </div>

          {/* Tarjetas de dolor específico */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
            <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-[#0B130E] border border-red-200 dark:border-red-900/40">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-2.5">
                <HeartCrack className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">Picores, diarreas y dermatitis</h3>
              <p className="text-xs text-stone-600 dark:text-gray-400 mt-1">Rechazo al pienso, vómitos biliares matutinos o alergias causadas por cereales inflamatorios y aditivos sintéticos.</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-[#0B130E] border border-amber-200 dark:border-amber-900/40">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-[#E8B84A] flex items-center justify-center mb-2.5">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">Miedo al cálculo en gramos</h3>
              <p className="text-xs text-stone-600 dark:text-gray-400 mt-1">¿Cuánto debe comer? Echar a ojo causa obesidad articular en perros o desnutrición por falta de minerales esenciales.</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-[#0B130E] border border-emerald-200 dark:border-emerald-900/40">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                <CircleDollarSign className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">Facturas veterinarias continuas</h3>
              <p className="text-xs text-stone-600 dark:text-gray-400 mt-1">Sacos 'veterinarios' a 80 € que tu animal ni quiere probar y visitas constantes por problemas renales o gástricos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ESTA APLICACIÓN CAMBIA ESO                                             */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-10 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-stone-900 dark:text-white">
          Esta aplicación <span className="text-emerald-600 dark:text-emerald-400">cambia eso.</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
          Aquí no vas a encontrar teoría abstracta ni recetas complicadas con ingredientes imposibles. Tienes un <strong className="text-stone-900 dark:text-white font-medium">software clínico interactivo</strong> para alimentar a tu mascota con comida casera, real y equilibrada para cada etapa: <strong className="text-stone-900 dark:text-white">cachorro, adulto y senior</strong>.
        </p>

        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-[#121B16]/90 backdrop-blur-md border border-amber-200 dark:border-[#E8B84A]/30 shadow-md max-w-2xl mx-auto transition-colors duration-300">
          <p className="text-xl sm:text-2xl text-stone-900 dark:text-white font-editorial italic">
            "Recetas sencillas, completas y calculadas al milímetro para que sepas exactamente qué le estás dando en cada plato."
          </p>
          <div className="mt-3 text-xs sm:text-sm uppercase tracking-widest text-amber-700 dark:text-[#E8B84A] font-bold">
            Pero esto no es solo un recetario: es un asistente veterinario diario.
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. LOS 4 PILARES FUNDAMENTALES DE LA APLICACIÓN                            */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-8 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#111A15]/90 backdrop-blur-md border-t-4 border-amber-500 dark:border-[#E8B84A] border-x border-b border-stone-200 dark:border-stone-800 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-[#0A0F0D] border border-amber-200 dark:border-[#E8B84A]/30 flex items-center justify-center text-amber-700 dark:text-[#E8B84A] mb-4">
              <Utensils className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900 dark:text-white tracking-wide uppercase">RECETAS REALES</h3>
            <p className="text-xs text-stone-500 dark:text-gray-400 mt-1">Formuladas para cachorros, adultos y seniors sin ingredientes ultraprocesados.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#111A15]/90 backdrop-blur-md border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-stone-200 dark:border-stone-800 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-[#0A0F0D] border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-4">
              <Scale className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900 dark:text-white tracking-wide uppercase">GRAMOS POR PESO</h3>
            <p className="text-xs text-stone-500 dark:text-gray-400 mt-1">Cálculo metabólico Kleiber automático según peso, esterilización y nivel de actividad.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#111A15]/90 backdrop-blur-md border-t-4 border-purple-600 dark:border-purple-500 border-x border-b border-stone-200 dark:border-stone-800 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-[#0A0F0D] border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-700 dark:text-purple-400 mb-4">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900 dark:text-white tracking-wide uppercase">AGENDA & ALARMAS</h3>
            <p className="text-xs text-stone-500 dark:text-gray-400 mt-1">Recordatorios con sonido para medicación, antiparasitarios, vacunas y baños periódicos.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#111A15]/90 backdrop-blur-md border-t-4 border-red-600 dark:border-red-500 border-x border-b border-stone-200 dark:border-stone-800 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-[#0A0F0D] border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900 dark:text-white tracking-wide uppercase">SEMÁFORO CLÍNICO</h3>
            <p className="text-xs text-stone-500 dark:text-gray-400 mt-1">Guía completa de alimentos seguros, precauciones y tóxicos mortales para perros y gatos.</p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. MUESTRA DISCRETA DE PLATOS (PEQUEÑO FORMATO)                           */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-10 px-4 sm:px-6 max-w-5xl mx-auto border-t border-stone-200 dark:border-[#E8B84A]/20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-[#E8B84A] uppercase tracking-wider mb-1">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Ejemplos del Recetario Integrado</span>
            </div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
              Platos caseros balanceados y escalables
            </h3>
          </div>
          <button
            onClick={() => onGoToPricing()}
            className="text-xs font-bold text-amber-700 dark:text-[#E8B84A] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Ver acceso a todas las recetas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 tarjetas pequeñas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleDishes.map((dish) => (
            <div
              key={dish.id}
              className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#111A15]/90 backdrop-blur-md border border-stone-200 dark:border-[#E8B84A]/25 flex items-center gap-3.5 shadow-sm hover:border-amber-400 dark:hover:border-[#E8B84A]/50 transition-colors"
            >
              <div className="w-13 h-13 rounded-xl overflow-hidden bg-stone-100 dark:bg-[#0A0F0D] shrink-0 border border-stone-200 dark:border-[#E8B84A]/20 flex items-center justify-center">
                {!failedImageIds[dish.id] && dish.imageUrl ? (
                  <img
                    src={dish.imageUrl}
                    alt={dish.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={() => setFailedImageIds(prev => ({ ...prev, [dish.id]: true }))}
                  />
                ) : (
                  <Utensils className="w-5 h-5 text-amber-600 dark:text-[#E8B84A]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 dark:text-[#E8B84A]">
                  <span>{dish.species === 'dog' ? '🐕 Perro' : dish.species === 'cat' ? '🐈 Gato' : '🐾 Perro/Gato'}</span>
                  <span>•</span>
                  <span>{dish.kcalPer100g} kcal</span>
                </div>
                <div className="text-xs font-bold text-stone-900 dark:text-white truncate mt-0.5">
                  {dish.title}
                </div>
                <div className="text-[10px] text-stone-500 dark:text-gray-400 mt-0.5">
                  Escalable al gramo por peso
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. ES EL PUNTO DE CONTROL QUE TE FALTABA (CARACTERÍSTICAS NUMERADAS)       */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-12 px-4 sm:px-6 max-w-5xl mx-auto border-t border-stone-200 dark:border-[#E8B84A]/20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white leading-tight mb-4">
              Es el punto de control que te faltaba.
            </h2>
            <p className="text-base text-stone-600 dark:text-gray-300 leading-relaxed mb-6 font-light">
              Lo que realmente diferencia a PawLove es su <strong className="text-stone-900 dark:text-white font-medium">enfoque integral y responsable</strong>. No te dejamos solo con un PDF pasivo: tienes una aplicación que calcula las raciones en gramos, te ayuda a planificar la semana (batch cooking), supervisa la hidratación y programa los cuidados médicos.
            </p>
            <p className="text-lg text-amber-700 dark:text-[#E8B84A] font-editorial italic">
              Sin improvisar. Sin copiar lo que hace otro. Sin poner en riesgo su salud.
            </p>
          </div>

          {/* Características numeradas */}
          <div className="bg-white/90 dark:bg-[#111A15]/90 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-stone-200 dark:border-[#E8B84A]/25 shadow-md">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4 border-b border-stone-200 dark:border-gray-700/60 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-[#E8B84A]" />
              <span>Todo lo que tienes en tus manos con la App:</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-[#1A261F] text-amber-800 dark:text-[#E8B84A] text-xs font-black shrink-0 mt-0.5">01</span>
                <span className="text-xs sm:text-sm text-stone-700 dark:text-gray-300">Guía de transición gradual desde el pienso paso a paso sin diarreas</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-[#1A261F] text-amber-800 dark:text-[#E8B84A] text-xs font-black shrink-0 mt-0.5">02</span>
                <span className="text-xs sm:text-sm text-stone-700 dark:text-gray-300">Semáforo clínico interactivo: alimentos seguros, precauciones y tóxicos</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-[#1A261F] text-amber-800 dark:text-[#E8B84A] text-xs font-black shrink-0 mt-0.5">03</span>
                <span className="text-xs sm:text-sm text-stone-700 dark:text-gray-300">Calculadora automática de necesidades energéticas (Kleiber) y gramos diarios</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-[#1A261F] text-amber-800 dark:text-[#E8B84A] text-xs font-black shrink-0 mt-0.5">04</span>
                <span className="text-xs sm:text-sm text-stone-700 dark:text-gray-300">Planificador semanal de comidas (plato 1, plato 2, snacks y caldos)</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-[#1A261F] text-amber-800 dark:text-[#E8B84A] text-xs font-black shrink-0 mt-0.5">05</span>
                <span className="text-xs sm:text-sm text-stone-700 dark:text-gray-300">Organización Batch Cooking: cocina 1 vez por semana y ahorra dinero</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-[#1A261F] text-amber-800 dark:text-[#E8B84A] text-xs font-black shrink-0 mt-0.5">06</span>
                <span className="text-xs sm:text-sm text-stone-700 dark:text-gray-300">Agenda con alarmas acústicas para medicación, vacunas y desparasitación</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-[#1A261F] text-amber-800 dark:text-[#E8B84A] text-xs font-black shrink-0 mt-0.5">07</span>
                <span className="text-xs sm:text-sm text-stone-700 dark:text-gray-300">Monitor de hidratación y recetas de caldos con colágeno para cuidar sus riñones</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. TESTIMONIOS REALES                                                     */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-12 px-4 sm:px-6 max-w-5xl mx-auto border-t border-stone-200 dark:border-[#E8B84A]/20">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-[#E8B84A] uppercase tracking-wider mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-[#E8B84A] dark:text-[#E8B84A]" />
            <span>Experiencias Reales</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            Lo que dicen quienes ya usan la App
          </h2>
          <p className="text-xs text-stone-500 dark:text-gray-400 mt-1">Tutores reales, resultados reales.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-[#111A15]/90 backdrop-blur-md border border-stone-200 dark:border-gray-800 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500 dark:fill-[#E8B84A] dark:text-[#E8B84A]" />
                  ))}
                </div>
                <p className="text-stone-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed italic mb-4">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-stone-100 dark:border-gray-800">
                <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-[#16241C] flex items-center justify-center text-sm border border-amber-200/60 dark:border-transparent">
                  {t.type === 'dog' ? '🐕' : '🐈'}
                </div>
                <div>
                  <p className="text-stone-900 dark:text-white font-bold text-xs">{t.name}</p>
                  <p className="text-stone-500 dark:text-gray-400 text-[11px]">{t.pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. TARIFAS Y PLANES DE SUSCRIPCIÓN OFICIALES (CHECKOUT DIRECTO STRIPE)    */}
      {/* ========================================================================= */}
      <section id="tarifas" className="relative z-10 py-12 sm:py-16 px-3.5 sm:px-6 max-w-6xl mx-auto border-t border-stone-200 dark:border-[#E8B84A]/20 w-full max-w-full box-border overflow-hidden sm:overflow-visible">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-[#E8B84A]/35 text-xs font-bold text-amber-900 dark:text-[#F3E5AB] mb-3 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-[#E8B84A]" />
            <span>Suscripción Oficial • Checkout Seguro con Stripe</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white leading-tight">
            Tarifas Transparentes para el Cuidado de tu Mascota
          </h2>
          <p className="mt-3 text-xs sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-light">
            Todas las tarifas incluyen acceso completo a las recetas al gramo, NutriIA, agenda médica y cálculo metabólico. Al hacer clic accederás directamente a la pasarela oficial y encriptada de <strong>Stripe</strong>.
          </p>
        </div>

        {/* PESTAÑAS DE TARIFAS COMPACTAS PARA MÓVIL (< md) */}
        <div className="md:hidden max-w-md mx-auto mb-4 space-y-2 w-full max-w-full box-border">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Pestañas de Tarifas:
            </span>
            <button
              type="button"
              onClick={() => setLandingViewMode(prev => prev === 'tab' ? 'all' : 'tab')}
              className="text-[10px] font-bold text-amber-700 dark:text-[#E8B84A] hover:underline cursor-pointer"
            >
              {landingViewMode === 'tab' ? 'Ver las 3 tarifas' : 'Ver en pestañas'}
            </button>
          </div>

          {/* Pestañas reducidas para teléfono */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-stone-100 dark:bg-[#122019] border border-stone-200 dark:border-stone-800 text-[11px] w-full max-w-full box-border">
            <button
              type="button"
              onClick={() => {
                setLandingActiveTab('monthly');
                setLandingViewMode('tab');
              }}
              className={`py-1.5 px-1 rounded-xl font-bold text-center transition-all flex flex-col items-center justify-center leading-tight cursor-pointer ${
                landingActiveTab === 'monthly'
                  ? 'bg-white dark:bg-[#1A2E24] text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <span className="text-[11px]">Mensual</span>
              <span className="text-[9px] font-medium opacity-85">3,99 €</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLandingActiveTab('annual');
                setLandingViewMode('tab');
              }}
              className={`py-1.5 px-1 rounded-xl font-bold text-center transition-all flex flex-col items-center justify-center leading-tight cursor-pointer ${
                landingActiveTab === 'annual'
                  ? 'bg-[#D4AF37] text-stone-950 shadow-xs font-black'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <span className={`text-[11px] ${landingActiveTab === 'annual' ? 'text-stone-950 font-black' : ''}`}>Anual ⭐</span>
              <span className={`text-[9px] font-medium ${landingActiveTab === 'annual' ? 'text-stone-950 font-bold opacity-90' : 'opacity-85'}`}>19,99 €</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLandingActiveTab('lifetime');
                setLandingViewMode('tab');
              }}
              className={`py-1.5 px-1 rounded-xl font-bold text-center transition-all flex flex-col items-center justify-center leading-tight cursor-pointer ${
                landingActiveTab === 'lifetime'
                  ? 'bg-white dark:bg-[#1A2E24] text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <span className="text-[11px]">Vitalicio</span>
              <span className="text-[9px] font-medium opacity-85">39,99 €</span>
            </button>
          </div>
        </div>

        {/* Las 3 tarjetas de pago oficiales de Stripe (Compactas en móvil, 3 columnas en desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 max-w-5xl mx-auto items-stretch w-full max-w-full box-border">
          
          {/* 1. PLAN MENSUAL */}
          <div className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-7 bg-white/95 dark:bg-[#0F1B15] border border-stone-200 dark:border-[#E8B84A]/25 flex-col justify-between shadow-xs hover:shadow-xl transition-all w-full max-w-full box-border ${
            landingViewMode === 'tab' && landingActiveTab !== 'monthly' ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="space-y-2.5 sm:space-y-4">
              <div className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                Cuota mensual flexible
              </div>
              <div>
                <h3 className="font-editorial text-lg sm:text-2xl font-bold text-stone-900 dark:text-white leading-snug">
                  Tarifa Mensual
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5 sm:mt-1">
                  Suscripción mes a mes sin ataduras
                </p>
              </div>

              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-stone-50 dark:bg-[#16271F] border border-stone-100 dark:border-stone-800/80">
                <div className="flex items-baseline gap-1">
                  <span className="font-editorial text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-[#E8B84A]">
                    3,99 €
                  </span>
                  <span className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium">
                    / al mes
                  </span>
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 leading-snug sm:leading-relaxed min-h-0 sm:min-h-[50px]">
                Cuota mensual de 3,99 € facturada mes a mes. Renovación automática cancelable en cualquier momento sin permanencia.
              </p>

              <ul className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2 text-[11px] sm:text-xs text-stone-700 dark:text-stone-300">
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Acceso total e ilimitado a todas las recetas</span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Cálculo metabólico exacto RER / MER</span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Cancelación libre con un solo clic</span>
                </li>
              </ul>
            </div>

            {/* BOTÓN PLAN MENSUAL -> PASARELA / STRIPE */}
            <div className="pt-3 sm:pt-6 mt-2 sm:mt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => onGoToPricing('monthly')}
                id="btn-stripe-monthly"
                className="w-full py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-stone-900 dark:bg-[#1C2C23] hover:bg-stone-800 dark:hover:bg-[#253A2F] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Contratar Plan Mensual (3,99 €)</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto" />
              </button>
              <button
                type="button"
                onClick={() => openStripeCheckout('monthly')}
                className="w-full mt-1.5 sm:mt-2 text-center text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-[#E8B84A] underline cursor-pointer"
              >
                O pagar directamente en Stripe oficial ↗
              </button>
            </div>
          </div>

          {/* 2. PLAN ANUAL (MÁS POPULAR) */}
          <div className={`relative rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-7 bg-white dark:bg-[#13231B] border-2 border-[#B8860B] dark:border-[#D4AF37] shadow-md ring-1 sm:ring-2 ring-amber-500/20 dark:ring-[#D4AF37]/20 flex-col justify-between md:-translate-y-1.5 transition-all w-full max-w-full box-border ${
            landingViewMode === 'tab' && landingActiveTab !== 'annual' ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="absolute -top-2.5 sm:-top-3.5 left-1/2 -translate-x-1/2 px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-wider bg-[#D4AF37] text-stone-950 shadow-xs whitespace-nowrap">
              ⭐ Más Popular • Ahorra 58%
            </div>

            <div className="space-y-2.5 sm:space-y-4 pt-1">
              <div className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-[#F3E5AB]">
                Un solo pago al año
              </div>
              <div>
                <h3 className="font-editorial text-lg sm:text-2xl font-bold text-stone-900 dark:text-white leading-snug">
                  Tarifa Anual
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5 sm:mt-1">
                  Máximo ahorro continuo todo el año
                </p>
              </div>

              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/70 dark:bg-[#192C23] border border-amber-200/80 dark:border-[#E8B84A]/30">
                <div className="flex items-baseline gap-1">
                  <span className="font-editorial text-2xl sm:text-4xl font-extrabold text-amber-700 dark:text-[#E8B84A]">
                    19,99 €
                  </span>
                  <span className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium">
                    / al año (~1,66 €/mes)
                  </span>
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 leading-snug sm:leading-relaxed min-h-0 sm:min-h-[50px]">
                Cuota anual de 19,99 € cobrada una sola vez al año. Equivale a solo ~1,66 €/mes, ahorrando un 58%.
              </p>

              <ul className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2 text-[11px] sm:text-xs text-stone-700 dark:text-stone-300">
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Mismas funciones completas que todos los planes</span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Consultas ilimitadas con Nutri IA veterinaria</span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Planificación semanal y avisos acústicos</span>
                </li>
              </ul>
            </div>

            {/* BOTÓN PLAN ANUAL -> PASARELA / STRIPE */}
            <div className="pt-3 sm:pt-6 mt-2 sm:mt-4 border-t border-amber-100 dark:border-stone-800">
              <button
                onClick={() => onGoToPricing('annual')}
                id="btn-stripe-annual"
                className="w-full py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-[#D4AF37] hover:bg-[#C49F2E] text-stone-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <CreditCard className="w-3.5 h-3.5 text-stone-950" />
                <span className="text-stone-950 font-black">Contratar Plan Anual (19,99 €)</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-stone-950" />
              </button>
              <button
                type="button"
                onClick={() => openStripeCheckout('annual')}
                className="w-full mt-1.5 sm:mt-2 text-center text-[10px] sm:text-[11px] text-amber-800 dark:text-[#E8B84A] hover:underline font-semibold cursor-pointer"
              >
                O pagar directamente en Stripe oficial ↗
              </button>
            </div>
          </div>

          {/* 3. PLAN VITALICIO */}
          <div className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-7 bg-white/95 dark:bg-[#0F1B15] border border-stone-200 dark:border-[#E8B84A]/25 flex-col justify-between shadow-xs hover:shadow-xl transition-all w-full max-w-full box-border ${
            landingViewMode === 'tab' && landingActiveTab !== 'lifetime' ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="space-y-2.5 sm:space-y-4">
              <div className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                Pago único de por vida
              </div>
              <div>
                <h3 className="font-editorial text-lg sm:text-2xl font-bold text-stone-900 dark:text-white leading-snug">
                  Tarifa Vitalicia
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5 sm:mt-1">
                  Acceso definitivo sin renovaciones
                </p>
              </div>

              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-stone-50 dark:bg-[#16271F] border border-stone-100 dark:border-stone-800/80">
                <div className="flex items-baseline gap-1">
                  <span className="font-editorial text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-[#E8B84A]">
                    39,99 €
                  </span>
                  <span className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium">
                    / pago único para siempre
                  </span>
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 leading-snug sm:leading-relaxed min-h-0 sm:min-h-[50px]">
                Cuota vitalicia de 39,99 € en un solo pago. Disfruta de acceso permanente e ilimitado para siempre, sin cuotas futuras.
              </p>

              <ul className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2 text-[11px] sm:text-xs text-stone-700 dark:text-stone-300">
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Acceso permanente de por vida a la plataforma</span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Sin cuotas futuras ni renovaciones jamás</span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Gestión de hasta 4 mascotas con perfiles</span>
                </li>
              </ul>
            </div>

            {/* BOTÓN PLAN VITALICIO -> PASARELA / STRIPE */}
            <div className="pt-3 sm:pt-6 mt-2 sm:mt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => onGoToPricing('lifetime')}
                id="btn-stripe-lifetime"
                className="w-full py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-stone-900 dark:bg-[#1C2C23] hover:bg-stone-800 dark:hover:bg-[#253A2F] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contratar Plan Vitalicio (39,99 €)</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto" />
              </button>
              <button
                type="button"
                onClick={() => openStripeCheckout('lifetime')}
                className="w-full mt-1.5 sm:mt-2 text-center text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 underline cursor-pointer"
              >
                O pagar directamente en Stripe oficial ↗
              </button>
            </div>
          </div>

        </div>

        {/* Banner de alternativa: 48h gratis con verificación SMS */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/60 dark:from-[#111C16] dark:to-[#16271F] border border-amber-300/80 dark:border-[#E8B84A]/30 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 dark:bg-[#E8B84A]/20 flex items-center justify-center text-amber-700 dark:text-[#E8B84A] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-stone-900 dark:text-white">
                ¿Prefieres probar la aplicación antes de contratar?
              </div>
              <div className="text-xs text-stone-600 dark:text-stone-300">
                Dispones de 48 horas de prueba gratuita sin tarjeta de crédito, con confirmación rápida por SMS a tu móvil.
              </div>
            </div>
          </div>

          <button
            onClick={() => onGoToPricing('free_trial_48h')}
            id="btn-stripe-section-trial"
            className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#1C2C23] border border-amber-400 dark:border-[#E8B84A]/40 text-amber-900 dark:text-[#F3E5AB] font-bold text-xs hover:border-amber-600 shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            Activar 48h Gratis
          </button>
        </div>

        {/* Garantías de seguridad oficiales de Stripe */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Pago 100% Seguro con Stripe Checkout (256-bit SSL)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-600 dark:text-[#E8B84A]" />
            <span>Acceso Inmediato tras la confirmación del pago</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            <span>Sin permanencia en cuotas mensuales</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. LLAMADA A LA ACCIÓN FINAL: COMPRA / PRUEBA DIRECTA                    */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-14 px-4 sm:px-6 max-w-3xl mx-auto text-center border-t border-stone-200 dark:border-[#E8B84A]/20">
        <h2 className="font-editorial text-3xl sm:text-5xl font-black text-stone-900 dark:text-white leading-tight">
          Si te importa de verdad la salud de tu mascota...
        </h2>

        <p className="mt-4 text-xl sm:text-2xl text-stone-600 dark:text-gray-300 font-editorial italic">
          "No puedes seguir delegando su alimentación en productos que no controlas."
        </p>

        {/* Enlaces de pago directos en la sección final */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onGoToPricing('annual')}
            id="btn-final-stripe-annual"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#D4AF37] hover:bg-[#C49F2E] text-stone-950 font-black text-base shadow-lg shadow-amber-500/25 dark:shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-5 h-5 text-stone-950" />
            <span className="text-stone-950 font-black">Contratar Plan Anual (19,99 €)</span>
            <ArrowRight className="w-5 h-5 text-stone-950" />
          </button>
          
          <button
            onClick={() => onGoToPricing('free_trial_48h')}
            id="btn-final-trial"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white dark:bg-[#142019] border border-stone-200 dark:border-[#E8B84A]/40 text-stone-800 dark:text-[#EDE8DF] font-bold text-sm hover:border-amber-500 dark:hover:border-[#E8B84A] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-[#E8B84A]" />
            <span>Probar 48h Gratis</span>
          </button>
        </div>

        {/* Enlaces secundarios a los otros 2 planes y Stripe */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
          <button
            onClick={() => onGoToPricing('monthly')}
            className="text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-[#E8B84A] underline font-medium cursor-pointer"
          >
            Plan Mensual (3,99 €/mes)
          </button>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <button
            onClick={() => onGoToPricing('lifetime')}
            className="text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-[#E8B84A] underline font-medium cursor-pointer"
          >
            Plan Vitalicio (39,99 € pago único)
          </button>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <button
            onClick={() => openStripeCheckout('annual')}
            className="text-amber-800 dark:text-[#E8B84A] hover:underline font-semibold cursor-pointer"
          >
            Stripe Oficial ↗
          </button>
        </div>

        <p className="mt-5 text-xs text-stone-500 dark:text-gray-400">
          Acceso instantáneo • Aplicación Web Progresiva (PWA) • Checkout oficial cifrado con Stripe
        </p>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-stone-200 dark:border-[#E8B84A]/15 bg-stone-100/90 dark:bg-[#060A08]/90 backdrop-blur-md pt-8 pb-20 sm:pb-8 px-4 text-center text-xs text-stone-500 dark:text-gray-500 transition-colors duration-300">
        <p className="mb-2">© {new Date().getFullYear()} PawLove • Cuidarte360. Todos los derechos reservados.</p>
        <div className="flex flex-col items-center justify-center gap-2.5 text-xs text-stone-500 dark:text-gray-400 max-w-xl mx-auto px-2">
          <p className="text-xs text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
            Al realizar el pago, aceptas nuestros{' '}
            <a
              href="/terminos.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                setLegalModalType('terminos');
              }}
              className="font-semibold text-amber-700 dark:text-[#E8B84A] underline hover:text-amber-800 dark:hover:text-amber-300 transition-colors cursor-pointer"
            >
              Términos y Condiciones
            </a>{' '}
            y la{' '}
            <a
              href="/privacidad.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                setLegalModalType('privacidad');
              }}
              className="font-semibold text-amber-700 dark:text-[#E8B84A] underline hover:text-amber-800 dark:hover:text-amber-300 transition-colors cursor-pointer"
            >
              Política de Privacidad
            </a>
            .
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-500 dark:text-gray-400 pt-0.5">
            <a
              href="/terminos.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                setLegalModalType('terminos');
              }}
              className="hover:text-amber-700 dark:hover:text-[#E8B84A] transition-colors cursor-pointer"
            >
              Términos y Condiciones
            </a>
            <span>•</span>
            <a
              href="/privacidad.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                setLegalModalType('privacidad');
              }}
              className="hover:text-amber-700 dark:hover:text-[#E8B84A] transition-colors cursor-pointer"
            >
              Política de Privacidad
            </a>
            <span>•</span>
            <a
              href="mailto:soporte@pawlove.app"
              className="hover:text-amber-700 dark:hover:text-[#E8B84A] transition-colors cursor-pointer"
            >
              Contacto
            </a>
          </div>
        </div>

        {/* Botón de Promoción conectado directamente a Stripe */}
        <div className="mt-4 flex justify-center">
          <a
            href="https://buy.stripe.com/eVqcN77VBdrlaNd60x1ZS03"
            target="_blank"
            rel="noopener noreferrer"
            id="btn-promocion-footer"
            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] text-stone-400 dark:text-stone-600 hover:text-stone-600 dark:hover:text-stone-300 transition-opacity opacity-50 hover:opacity-100 cursor-pointer select-none"
          >
            promoción
          </a>
        </div>
      </footer>

      {/* STICKY BOTTOM BAR FOR MOBILES (CLARO/OSCURO + IDIOMA + ACCESO APP + PRUEBA) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#0A0F0D]/95 backdrop-blur-md border-t border-[#E8DCCB] dark:border-[#E8B84A]/30 p-2 px-3 flex items-center justify-between shadow-2xl transition-colors duration-300 gap-1.5 overflow-visible">
        {/* Segmented Light / Dark Toggle Mobile */}
        <div 
          role="group"
          aria-label={language === 'es' ? 'Modo de apariencia' : 'Theme mode'}
          className="flex items-center p-0.5 rounded-xl bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/40 shadow-2xs shrink-0"
        >
          <button
            type="button"
            onClick={() => setTheme('light')}
            id="landing-mobile-btn-theme-light"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-[#B8860B] text-white shadow-xs scale-102 ring-1 ring-amber-600/50'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-[#F3E5AB]'
            }`}
            title={language === 'es' ? 'Activar Modo Claro' : 'Activate Light Mode'}
          >
            <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-200' : 'text-amber-500'}`} />
            <span>{language === 'es' ? 'Claro' : 'Light'}</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            id="landing-mobile-btn-theme-dark"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#16271F] text-[#F3E5AB] shadow-xs scale-102 ring-1 ring-[#D4AF37]/50'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-[#F3E5AB]'
            }`}
            title={language === 'es' ? 'Activar Modo Oscuro' : 'Activate Dark Mode'}
          >
            <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-stone-500'}`} />
            <span>{language === 'es' ? 'Oscuro' : 'Dark'}</span>
          </button>
        </div>

        {/* Selector de Idiomas con despliegue hacia arriba */}
        <LanguageSelector idPrefix="landing-mobile-lang" compact={true} align="left" dropDirection="up" />

        {/* Botón Volver a la App (Mobile) */}
        <button
          onClick={() => {
            if (onGoToApp) {
              onGoToApp();
            } else {
              setCurrentView('app');
            }
          }}
          id="landing-btn-mobile-return-app"
          className="px-2.5 py-1.5 rounded-xl bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 text-xs font-black shadow-md flex items-center justify-center gap-1 cursor-pointer shrink-0"
          title={language === 'es' ? 'Volver a la App' : 'Back to App'}
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{language === 'es' ? 'Volver a la App' : 'Back to App'}</span>
        </button>

        {/* Botón Tarifas / Prueba 48h */}
        <button
          onClick={() => onGoToPricing('free_trial_48h')}
          id="landing-btn-mobile-pricing"
          className="px-2.5 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-[#F3E5AB] text-xs font-bold shadow-xs hover:opacity-95 flex items-center justify-center gap-1 cursor-pointer shrink-0"
        >
          <span>{language === 'es' ? 'Tarifas' : 'Plans'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* MODAL DE TEXTOS LEGALES (ESPAÑA & UE) */}
      {legalModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#111C16] border border-[#E8DCCB] dark:border-[#D4AF37]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-800 dark:text-stone-200">
            {/* Header modal */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E8DCCB] dark:border-[#D4AF37]/20 bg-stone-50 dark:bg-[#15231C]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-[#E8B84A]">
                  Aviso Legal • España & UE
                </span>
                <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                  {legalModalType === 'terminos' ? 'Términos y Condiciones' : 'Política de Privacidad'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={legalModalType === 'terminos' ? '/terminos.html' : '/privacidad.html'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Abrir página completa en pestaña nueva"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setLegalModalType(null)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body scroll */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
              {legalModalType === 'terminos' ? (
                <>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-[#E8B84A]/30 text-stone-800 dark:text-[#F3E5AB]">
                    <strong>Aviso importante:</strong> PawLove es una herramienta interactiva de apoyo nutricional doméstico y cálculo dietético. En ningún caso constituye ni sustituye un diagnóstico, prescripción o tratamiento veterinario clínico.
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">1. Titular del Servicio</h4>
                    <p>PawLove • Cuidarte360. Correo de contacto oficial: soporte@pawlove.app.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">2. Modalidades de Contratación</h4>
                    <p>Acceso mediante Plan Anual (19,99 €/año), Plan Mensual (3,99 €/mes), Plan Vitalicio (39,99 € pago único) o Prueba Gratuita de 48 horas verificada por SMS.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">3. Pasarela de Pago y Seguridad</h4>
                    <p>Los pagos se procesan de manera cifrada a través de Stripe Payments Europe, Ltd. con certificación PCI-DSS Nivel 1 y cifrado SSL de 256 bits.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">4. Derecho de Desistimiento (Contenido Digital)</h4>
                    <p>Conforme al art. 103.m del Real Decreto Legislativo 1/2007 (Consumidores y Usuarios de España), el derecho de desistimiento no es aplicable al suministro de contenido digital inmediato no prestado en soporte material una vez iniciada la ejecución con consentimiento previo del usuario.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">5. Ley Aplicable</h4>
                    <p>Legislación española y fueros correspondientes al domicilio del consumidor.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/30 text-stone-800 dark:text-emerald-100">
                    <strong>Cumplimiento RGPD & LOPDGDD:</strong> Tratamos sus datos con máxima seguridad y confidencialidad. No vendemos ni cedemos sus datos personales a terceros comerciales.
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">1. Responsable del Tratamiento</h4>
                    <p>PawLove (Cuidarte360). Contacto: soporte@pawlove.app.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">2. Finalidad y Legitimación</h4>
                    <p>Gestión del servicio, cálculo y ajuste personalizado de raciones de mascotas (edad, raza, peso, alergias), gestión del cobro seguro con Stripe y soporte técnico (art. 6.1.b y 6.1.a del RGPD).</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">3. Conservación de Datos</h4>
                    <p>Durante la vigencia de la suscripción o hasta que el usuario solicite la supresión de sus datos.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">4. Ejercicio de Derechos</h4>
                    <p>Puede ejercitar sus derechos de acceso, rectificación, supresión, limitación y portabilidad enviando un email a soporte@pawlove.app, o reclamar ante la AEPD (www.aepd.es).</p>
                  </div>
                </>
              )}
            </div>

            {/* Footer modal */}
            <div className="p-3.5 sm:p-4 border-t border-[#E8DCCB] dark:border-[#D4AF37]/20 bg-stone-50 dark:bg-[#15231C] flex items-center justify-between gap-3">
              <a
                href={legalModalType === 'terminos' ? '/terminos.html' : '/privacidad.html'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-[#E8B84A] hover:underline font-semibold"
              >
                <span>Abrir página completa independiente</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setLegalModalType(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
