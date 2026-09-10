import React, { useState } from 'react';
import { Pet, Language } from '../types';
import { isHighPerformancePet } from '../utils/dietPlanner';
import { AlertTriangle, Clock, Droplets, UtensilsCrossed, ChevronDown, ChevronUp } from 'lucide-react';

interface HighPerformanceExerciseAlertProps {
  pet: Pet;
  language?: Language;
  variant?: 'compact' | 'full';
  className?: string;
}

export const HighPerformanceExerciseAlert: React.FC<HighPerformanceExerciseAlertProps> = ({
  pet,
  language = 'es',
  variant = 'compact',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isHighPerf = isHighPerformancePet(pet);

  if (!isHighPerf) return null;

  return (
    <div 
      className={`rounded-2xl p-3 sm:p-3.5 bg-rose-500/10 dark:bg-rose-950/25 border border-rose-500/30 text-rose-950 dark:text-rose-200 transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2">
          {/* Warning Icon & Emoji */}
          <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-sm select-none" role="img" aria-label="warning">⚠️</span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-extrabold text-xs text-rose-900 dark:text-rose-300 uppercase tracking-wider">
                {language === 'es' ? 'Aviso Crítico Digestivo & Actividad' : 'Critical Digestive & Activity Warning'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-900 dark:text-rose-300 border border-rose-500/30">
                {language === 'es' ? 'Prevención Torsión Gástrica' : 'Gastric Torsion Prevention'}
              </span>
            </div>

            <p className="text-xs text-rose-900/90 dark:text-rose-200/90 leading-snug font-medium">
              {language === 'es' ? (
                <>
                  <strong className="font-bold text-rose-950 dark:text-white">Esperar al menos 1 hora DESPUÉS</strong> de finalizar la actividad física antes de darle de comer, y <strong className="font-bold text-rose-950 dark:text-white">al menos 1 hora ANTES</strong> de iniciarla para evitar que el estómago se retuerza o sufra indigestiones.
                </>
              ) : (
                <>
                  <strong className="font-bold text-rose-950 dark:text-white">Wait at least 1 hour AFTER</strong> ending physical activity before feeding, and <strong className="font-bold text-rose-950 dark:text-white">at least 1 hour BEFORE</strong> starting to prevent gastric torsion and severe indigestion.
                </>
              )}
            </p>
          </div>
        </div>

        {variant === 'compact' && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-800 dark:text-rose-300 transition-colors shrink-0"
            title={isExpanded ? 'Ocultar pautas' : 'Ver pautas digestivas'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* DETAILED GUIDELINES (Always shown if variant='full' or when expanded) */}
      {(variant === 'full' || isExpanded) && (
        <div className="mt-3 pt-2.5 border-t border-rose-500/20 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] leading-relaxed">
          <div className="p-2 rounded-xl bg-white/70 dark:bg-black/20 border border-rose-500/15 flex items-start gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-rose-950 dark:text-rose-200">
                {language === 'es' ? 'Regla 60 min de Reposo' : '60-Min Rest Rule'}
              </strong>
              <span>
                {language === 'es' 
                  ? 'Estómago en calma: nunca ofrecer comida con jadeo acelerado o pulsaciones altas.' 
                  : 'Calm stomach: never feed with heavy panting or elevated heart rate.'}
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/70 dark:bg-black/20 border border-rose-500/15 flex items-start gap-1.5">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-rose-950 dark:text-rose-200">
                {language === 'es' ? 'Menos cantidad, más tomas' : 'Smaller, frequent meals'}
              </strong>
              <span>
                {language === 'es' 
                  ? 'Fraccionar la ración diaria en 3 o 4 tomas pequeñas para no sobrecargar el estómago.' 
                  : 'Split daily intake into 3-4 small servings to avoid stomach overload.'}
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/70 dark:bg-black/20 border border-rose-500/15 flex items-start gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-rose-950 dark:text-rose-200">
                {language === 'es' ? 'Agua y Caldos Nutritivos' : 'Water & Bone Broths'}
              </strong>
              <span>
                {language === 'es' 
                  ? 'Mucha agua fresca y caldos de huesos/colágeno para hidratar y nutrir sin saturar con sólidos.' 
                  : 'Plenty of fresh water and nutrient broths to hydrate without heavy solid burden.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
