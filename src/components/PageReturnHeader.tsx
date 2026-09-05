import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Home, ChevronRight, Sparkles } from 'lucide-react';

export const PageReturnHeader: React.FC = () => {
  const { activeTab, setActiveTab, goBack, goToHome, t, language } = useApp();

  if (activeTab === 'home') {
    return null;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'pet_profile':
        return t('navPetProfile');
      case 'weekly_plan':
        return language === 'es' ? 'Visión Semanal de Dieta' : 'Weekly Diet Plan';
      case 'agenda':
        return t('navAgenda');
      case 'recipes':
        return t('navRecipes');
      case 'concierge':
        return t('navConcierge');
      case 'toxic_foods':
        return t('navToxicFoods');
      default:
        return '';
    }
  };

  const getPageIcon = () => {
    switch (activeTab) {
      case 'pet_profile':
        return '📋';
      case 'weekly_plan':
        return '📅';
      case 'agenda':
        return '⏰';
      case 'recipes':
        return '🍲';
      case 'concierge':
        return '✨';
      case 'toxic_foods':
        return '⚠️';
      default:
        return '🐾';
    }
  };

  return (
    <div className="mb-4 sm:mb-6 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/30 shadow-xs transition-colors duration-300 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
      {/* Navigation Buttons (Back + Home) */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Back Button / Flecha de retorno a la página anterior */}
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500/15 hover:bg-amber-500/25 dark:bg-[#D4AF37]/15 dark:hover:bg-[#D4AF37]/25 text-amber-900 dark:text-[#F3E5AB] border border-amber-500/30 dark:border-[#D4AF37]/40 transition-all shadow-2xs group"
          title={language === 'es' ? 'Volver a la página anterior' : 'Return to previous page'}
          id="btn-nav-back"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
          <span>{t('back')}</span>
        </button>

        {/* Go to Home Button / Opción de ir a Inicio */}
        <button
          onClick={goToHome}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-all shadow-2xs group"
          title={language === 'es' ? 'Ir al Inicio de la aplicación' : 'Go to Home'}
          id="btn-nav-home"
        >
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110" />
          <span>{t('goToHome')}</span>
        </button>
      </div>

      {/* Breadcrumb path / Indicador de ruta */}
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-600 dark:text-stone-400 font-medium">
        <button
          onClick={goToHome}
          className="hover:text-amber-600 dark:hover:text-[#D4AF37] transition-colors"
        >
          {t('home')}
        </button>
        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-400 dark:text-stone-600" />
        <div className="flex items-center gap-1 font-bold text-stone-900 dark:text-[#F3E5AB] truncate max-w-[150px] sm:max-w-none">
          <span>{getPageIcon()}</span>
          <span className="truncate">{getPageTitle()}</span>
        </div>
      </div>
    </div>
  );
};
