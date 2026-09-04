import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RECIPES_CATALOG } from '../data/mockData';
import { FloatingPawsBackground } from './FloatingPawsBackground';
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
  Info
} from 'lucide-react';

interface LandingPageProps {
  onGoToPricing: (planId?: string) => void;
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

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToPricing }) => {
  const { theme, toggleTheme, language, setLanguage } = useApp();

  // Miniatura de muestra de recetas
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});

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
    <div className="relative min-h-screen bg-[#FBF9F5] text-stone-900 dark:bg-[#0A0F0D] dark:text-[#EDE8DF] font-sans transition-colors duration-300 overflow-x-hidden selection:bg-amber-500/25 selection:text-amber-900 dark:selection:bg-[#E8B84A]/30 dark:selection:text-[#FFF8E7]">
      
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
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-[#E8B84A]/20 bg-[#FBF9F5]/90 dark:bg-[#0A0F0D]/90 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-700 p-0.5 shadow-sm dark:shadow-md">
              <div className="w-full h-full rounded-[10px] bg-[#FBF9F5] dark:bg-[#0A0F0D] flex items-center justify-center text-amber-700 dark:text-[#E8B84A]">
                <ChefHat className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="font-editorial text-lg sm:text-xl font-black tracking-wider text-stone-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#FFF8E7] dark:via-[#E8B84A] dark:to-[#F3C35B]">
                PAWLOVE • CUIDARTE360
              </div>
              <div className="text-[9px] uppercase font-bold tracking-[0.18em] text-amber-700 dark:text-[#E8B84A]/80">
                Alimentación Real & Salud Animal
              </div>
            </div>
          </div>

          {/* Controles: Día/Noche, Idioma y Botón de Acción */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Toggle Día / Noche */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Cambiar a modo Día' : 'Cambiar a modo Noche'}
              className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-[#121B16] text-stone-600 dark:text-amber-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#E8B84A]" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* Toggle Idioma */}
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              title="Cambiar idioma"
              className="px-2 py-1 rounded-md border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-[#121B16] text-[11px] font-bold text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-[#E8B84A] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3 h-3" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Botón 48h Gratis */}
            <button
              onClick={() => onGoToPricing('free_trial_48h')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-500/40 dark:border-[#E8B84A]/40 bg-amber-50 dark:bg-[#121B16] text-xs font-semibold text-amber-900 dark:text-[#F3E5AB] hover:border-amber-500 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-[#E8B84A]" />
              <span>48h Gratis</span>
            </button>

            {/* Botón Acceso */}
            <button
              onClick={() => onGoToPricing()}
              className="px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-[#B8860B] dark:via-[#E8B84A] dark:to-[#F3C35B] text-white dark:text-[#07130E] font-bold text-xs tracking-wide shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Acceder a la App</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
          <span>Nutrición clínica personalizada para perros y gatos</span>
        </div>

        {/* Título principal enfocado en el concepto único */}
        <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white leading-tight max-w-4xl mx-auto">
          Cada mascota es única. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 dark:from-[#FFF8E7] dark:via-[#E8B84A] dark:to-[#F3C35B]">
            Su alimentación y cuidados también deben serlo.
          </span>
        </h1>

        {/* Descripción clara del funcionamiento */}
        <p className="mt-5 text-base sm:text-xl text-stone-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
          No existen dietas estándar para todos. En la aplicación <strong className="text-stone-900 dark:text-white font-semibold">introduces los datos de tu perro o gato</strong> (peso, edad, raza, actividad y sensibilidades) y la app te dice exactamente <strong className="text-amber-800 dark:text-[#E8B84A] font-semibold">qué alimentos, recetas al gramo, nivel de hidratación y cuidados</strong> le corresponden por sus características únicas.
        </p>

        {/* Botones de acción principales */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={() => onGoToPricing('free_trial_48h')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-[#B8860B] dark:via-[#E8B84A] dark:to-[#F3C35B] text-white dark:text-[#0A0F0D] font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 dark:shadow-[0_0_25px_rgba(232,184,74,0.25)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Personalizar y Probar 48h Gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onGoToPricing()}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white dark:bg-[#131F18] border border-stone-200 dark:border-[#E8B84A]/40 text-stone-800 dark:text-[#EDE8DF] font-semibold text-sm hover:border-amber-500 dark:hover:border-[#E8B84A] shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-[#E8B84A]" />
            <span>Ver Tarifas Oficiales</span>
          </button>
        </div>

        <p className="mt-3 text-xs text-stone-500 dark:text-gray-400 flex items-center justify-center gap-2">
          <span>⚡ Configuración en 1 minuto</span>
          <span>•</span>
          <span>Acceso web & móvil</span>
          <span>•</span>
          <span>Sin permanencia</span>
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
                      ? 'bg-amber-600 text-white dark:bg-[#E8B84A] dark:text-[#0A0F0D] shadow-sm'
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
      {/* 9. LLAMADA A LA ACCIÓN FINAL: COMPRA / PRUEBA DIRECTA                     */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-14 px-4 sm:px-6 max-w-3xl mx-auto text-center border-t border-stone-200 dark:border-[#E8B84A]/20">
        <h2 className="font-editorial text-3xl sm:text-5xl font-black text-stone-900 dark:text-white leading-tight">
          Si te importa de verdad la salud de tu mascota...
        </h2>

        <p className="mt-4 text-xl sm:text-2xl text-stone-600 dark:text-gray-300 font-editorial italic">
          "No puedes seguir delegando su alimentación en productos que no controlas."
        </p>

        {/* Bloque de planes oficiales de la app */}
        <div className="mt-6 mb-8 inline-flex flex-wrap items-center justify-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-[#121B16] border border-amber-300 dark:border-[#E8B84A]/30 text-xs font-medium text-stone-700 dark:text-stone-300">
            ✨ <strong className="text-stone-900 dark:text-white">48h de prueba gratuita</strong>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#121B16] border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300">
            💳 <strong className="text-stone-900 dark:text-white">Planes mensuales, anuales o vitalicios</strong>
          </div>
        </div>

        {/* Botones finales */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onGoToPricing('free_trial_48h')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-[#B8860B] dark:via-[#E8B84A] dark:to-[#F3C35B] text-white dark:text-[#0A0F0D] font-black text-base shadow-lg shadow-amber-500/25 dark:shadow-[0_0_30px_rgba(232,184,74,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Obtener Acceso — 48h Gratis</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onGoToPricing()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-[#142019] border border-stone-200 dark:border-[#E8B84A]/40 text-stone-800 dark:text-[#EDE8DF] font-bold text-sm hover:border-amber-500 dark:hover:border-[#E8B84A] shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Ver Tarifas Oficiales</span>
            <ArrowRight className="w-4 h-4 text-amber-600 dark:text-[#E8B84A]" />
          </button>
        </div>

        <p className="mt-5 text-xs text-stone-500 dark:text-gray-400">
          Acceso instantáneo • Aplicación Web Progresiva (PWA) • Pago seguro con Stripe, Bizum y PayPal
        </p>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-stone-200 dark:border-[#E8B84A]/15 bg-stone-100/90 dark:bg-[#060A08]/90 backdrop-blur-md py-8 px-4 text-center text-xs text-stone-500 dark:text-gray-500 transition-colors duration-300">
        <p className="mb-2">© {new Date().getFullYear()} PawLove • Cuidarte360. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-5 text-xs text-stone-500 dark:text-gray-400">
          <a href="#terminos" onClick={(e) => { e.preventDefault(); onGoToPricing(); }} className="hover:text-amber-700 dark:hover:text-[#E8B84A] transition-colors">Términos y Condiciones</a>
          <span>•</span>
          <a href="#privacidad" onClick={(e) => { e.preventDefault(); onGoToPricing(); }} className="hover:text-amber-700 dark:hover:text-[#E8B84A] transition-colors">Política de Privacidad</a>
          <span>•</span>
          <a href="#contacto" onClick={(e) => { e.preventDefault(); onGoToPricing(); }} className="hover:text-amber-700 dark:hover:text-[#E8B84A] transition-colors">Contacto</a>
        </div>
      </footer>

      {/* STICKY BOTTOM BAR FOR MOBILES */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A0F0D]/95 backdrop-blur-md border-t border-stone-200 dark:border-[#E8B84A]/30 p-2.5 px-4 flex items-center justify-between shadow-2xl transition-colors duration-300">
        <div>
          <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-[#E8B84A]">Acceso Completo</div>
          <div className="text-xs font-bold text-stone-900 dark:text-white">Prueba 48h Gratis</div>
        </div>
        <button
          onClick={() => onGoToPricing('free_trial_48h')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 dark:from-[#B8860B] dark:to-[#E8B84A] text-white dark:text-[#0A0F0D] text-xs font-black shadow-md flex items-center gap-1 cursor-pointer"
        >
          <span>Empezar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
