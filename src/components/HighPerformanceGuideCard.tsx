import React, { useState } from 'react';
import { Pet, DayDietPlan } from '../types';
import { HIGH_PERFORMANCE_COGNITIVE_HABITS, isHighPerformancePet } from '../utils/dietPlanner';
import { 
  Zap, 
  Brain, 
  ShieldAlert, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Utensils, 
  Activity,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HighPerformanceGuideCardProps {
  pet: Pet;
  todayPlan: DayDietPlan;
  language: 'es' | 'en';
  onNavigateToRecipes?: () => void;
}

export const HighPerformanceGuideCard: React.FC<HighPerformanceGuideCardProps> = ({
  pet,
  todayPlan,
  language,
  onNavigateToRecipes
}) => {
  const { setActiveTab } = useApp();
  const [showFull7DayGuide, setShowFull7DayGuide] = useState(false);
  const [activeDayModal, setActiveDayModal] = useState<number | null>(null);

  const isHighPerf = isHighPerformancePet(pet) || todayPlan.isHighPerformancePlan;

  if (!isHighPerf) return null;

  const todayCognitive = todayPlan.cognitiveHabitTarget || HIGH_PERFORMANCE_COGNITIVE_HABITS[0];

  return (
    <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121B15] border border-amber-500/35 dark:border-[#D4AF37]/40 shadow-md space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#D4AF37] flex items-center justify-center font-bold text-xl shadow-xs">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                {language === 'es' 
                  ? 'Guía Especial: Alto Rendimiento & Hiperactividad' 
                  : 'Special Guide: High Performance & Hyperactivity'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-[#B8860B] dark:text-[#D4AF37] border border-amber-500/30">
                Activa
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
              {language === 'es'
                ? `Protocolo nutricional y neuro-conductual adaptado para ${pet.name} (${pet.breed})`
                : `Nutritional & neuro-behavioral protocol adapted for ${pet.name}`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFull7DayGuide(!showFull7DayGuide)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-all cursor-pointer"
        >
          <Brain className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
          <span>{showFull7DayGuide ? (language === 'es' ? 'Ocultar Plan 7 Días' : 'Hide 7-Day Plan') : (language === 'es' ? 'Ver Guía Completa 7 Días' : 'View Full 7-Day Plan')}</span>
          {showFull7DayGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* TODAY PROTOCOL FOCUS CARD */}
      <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-[#1A261F] border border-amber-500/30 dark:border-[#D4AF37]/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{todayCognitive.icon}</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-[#D4AF37]">
                {language === 'es' ? 'Objetivo Cognitivo y Anti-Estrés de Hoy' : "Today's Cognitive & De-stress Focus"}
              </span>
              <h4 className="font-bold text-base text-stone-900 dark:text-[#F3E5AB]">
                {language === 'es' ? todayCognitive.titleEs : todayCognitive.titleEn}
              </h4>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
            <Clock className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
            <span>{todayCognitive.recommendedTime}</span>
          </div>
        </div>

        <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-amber-500/15">
          <span className="font-bold text-stone-900 dark:text-stone-100">{language === 'es' ? 'Protocolo: ' : 'Protocol: '}</span>
          {language === 'es' ? todayCognitive.protocolEs : todayCognitive.protocolEn}
        </p>

        <div className="flex items-start gap-2 pt-1 text-xs text-amber-900 dark:text-amber-300">
          <Sparkles className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37] shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">
            <strong className="font-bold">{language === 'es' ? 'Beneficio Neuroquímico: ' : 'Neurochemical Benefit: '}</strong>
            {todayCognitive.benefitsEs}
          </span>
        </div>
      </div>

      {/* 3 CORE RULES OF HIGH PERFORMANCE & HYPERACTIVITY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        {/* Rule 1: Anti-Torsion & Digestion Rest */}
        <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-950/20 border border-rose-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold">
            <span className="text-sm">⚠️</span>
            <span>{language === 'es' ? 'Regla de Oro Anti-Torsión (1h)' : 'Anti-Torsion Golden Rule (1h)'}</span>
          </div>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            {language === 'es'
              ? 'Esperar al menos 1h DESPUÉS de la actividad física para dar de comer (y 1h ANTES) para evitar que el estómago se retuerza o sufra indigestiones graves.'
              : 'Wait at least 1h AFTER physical activity before feeding (and 1h BEFORE) to prevent gastric torsion and severe indigestion.'}
          </p>
        </div>

        {/* Rule 2: Low-Glycemic Energy & Frequent Portions */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#16211B] border border-stone-200 dark:border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-[#D4AF37] font-bold">
            <Utensils className="w-4 h-4" />
            <span>{language === 'es' ? 'Poca Cantidad, Más Frecuencia' : 'Smaller, More Frequent Meals'}</span>
          </div>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            {language === 'es'
              ? 'Servir menor cantidad por toma para facilitar un vaciado gástrico liviano; compensar repartiendo la comida en 3-4 tomas diarias sin picos de glucosa.'
              : 'Serve smaller portions per meal for light gastric emptying; compensate by splitting into 3-4 daily servings with low glycemic index.'}
          </p>
        </div>

        {/* Rule 3: Isotonic Broth & Water Hydration */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#16211B] border border-stone-200 dark:border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold">
            <Activity className="w-4 h-4" />
            <span>{language === 'es' ? 'Mucha Agua y Caldos Nutritivos' : 'Plenty of Water & Broths'}</span>
          </div>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            {language === 'es'
              ? 'Ofrecer abundante agua fresca y caldos de huesos o colágeno para hidratar y nutrir sin sobrecargar el estómago con sólidos pesados.'
              : 'Offer plenty of fresh water and bone/collagen broths to hydrate and nourish without overloading the stomach with heavy solids.'}
          </p>
        </div>

      </div>

      {/* FULL 7-DAY ACCORDION IF EXPANDED */}
      {showFull7DayGuide && (
        <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-3 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
            <span>{language === 'es' ? 'Plan Semanal Completo de Autorregulación (7 Días)' : '7-Day Full Regulation Plan'}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HIGH_PERFORMANCE_COGNITIVE_HABITS.map((habit, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#16211B] border border-stone-200 dark:border-stone-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-1.5">
                    <span>{habit.icon}</span>
                    <span>Día {idx + 1}: {language === 'es' ? habit.titleEs : habit.titleEn}</span>
                  </span>
                  <span className="text-[10px] text-stone-500 font-semibold">{habit.recommendedTime}</span>
                </div>
                <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                  {language === 'es' ? habit.protocolEs : habit.protocolEn}
                </p>
                <div className="text-[10px] text-amber-700 dark:text-[#D4AF37] font-semibold pt-1 border-t border-stone-200/60 dark:border-stone-800">
                  {habit.benefitsEs}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER: CTA TO 50 HIGH PERFORMANCE RECIPES */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-stone-600 dark:text-stone-400">
          {language === 'es'
            ? '⚡ 50 recetas formuladas exclusivamente para perros de alto rendimiento e hiperactivos disponibles en el recetario.'
            : '⚡ 50 recipes specially formulated for high-performance and hyperactive dogs in the catalog.'}
        </span>
        <button
          type="button"
          onClick={() => {
            if (onNavigateToRecipes) {
              onNavigateToRecipes();
            } else {
              setActiveTab('recipes');
            }
          }}
          className="px-4 py-2 rounded-xl bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'Ver las 50 Recetas de Rendimiento' : 'View 50 Performance Recipes'}</span>
        </button>
      </div>

    </div>
  );
};
