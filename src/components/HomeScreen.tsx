import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMER, calculateRER } from '../utils/nutrition';
import { generateWeeklyDietPlan, getCurrentWeekDates } from '../utils/dietPlanner';
import { playLuxuryChime } from '../utils/alertsAndAudio';
import { AddPetModal } from './AddPetModal';
import { RECIPES_CATALOG } from '../data/mockData';
import { 
  HeartPulse, 
  CalendarDays, 
  CalendarRange,
  BookOpen, 
  Bot, 
  Sparkles, 
  ChevronRight, 
  Bell,
  Edit3,
  ShieldAlert, 
  Plus, 
  Trash2, 
  Scale, 
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Volume2,
  Utensils,
  Cookie,
  IceCream,
  Activity,
  Check,
  X,
  Calendar,
  ChefHat,
  Flame,
  Eye
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    pets, 
    selectedPetId, 
    selectPet, 
    setActiveTab, 
    events, 
    toggleEventCompleted,
    triggerAlarmTest,
    weeklyTracking,
    setMealStatus,
    setExerciseStatus,
    getTrackingForDay,
    theme, 
    language, 
    t, 
    showToast, 
    addChatMessage
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);

  // Detailed Recipe modal state for daily suggestions
  const [inspectingRecipe, setInspectingRecipe] = useState<{
    type: 'dish1' | 'dish2' | 'snack1' | 'dessert1';
    typeLabel: string;
    typeIcon: string;
    badgeColor: string;
    title: string;
    description: string;
    portion: string;
    kcal?: number;
    ingredients: { name: string; grams?: number; category?: string }[] | string[];
    instructions: string[];
    clinicalBenefits?: string[];
    chefTip?: string;
  } | null>(null);

  // Active selected pet
  const selectedPet = pets.find(p => p.id === selectedPetId) || pets[0];

  // Calculated nutritional values
  const merData = selectedPet ? calculateMER(selectedPet) : { rer: 500, mer: 800, dailyFoodGrams: 400, waterTargetMl: 1500 };
  const rerVal = selectedPet ? calculateRER(selectedPet.weightKg) : 500;

  const weekDates = useMemo(() => getCurrentWeekDates(), []);

  // 7-day personalized diet plan for selected pet
  const weeklyPlan = useMemo(() => {
    return generateWeeklyDietPlan(selectedPet, language);
  }, [selectedPet, language]);

  // Today's specific plan and date
  const todayDateObj = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const found = weekDates.find(d => d.dateStr === today);
    return found || weekDates[0];
  }, [weekDates]);

  const todayIndex = todayDateObj.dayIndex;
  const todayPlan = weeklyPlan[todayIndex] || weeklyPlan[0];
  const todayTracking = getTrackingForDay(selectedPet?.id || 'pet-1', todayDateObj.dateStr);

  // Pending events for today
  const pendingEvents = events.filter(e => !e.completed).slice(0, 2);

  // Quick launch into NutriIA with prompt
  const handleAskNutriIA = (prompt: string) => {
    addChatMessage({
      role: 'user',
      content: prompt,
      petName: selectedPet?.name
    });
    setActiveTab('concierge');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* ========================================================================= */}
      {/* 1. PET SHOWCASE & DIRECT OPTIONS FROM PET IMAGE (HERO PANEL)              */}
      {/* ========================================================================= */}
      {selectedPet ? (
        <section 
          id="pet-hero-card"
          className="rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-white via-[#FAF7F2] to-amber-50/40 dark:from-[#112019] dark:via-[#0E1A14] dark:to-[#16271F] border border-[#E8DCCB] dark:border-[#D4AF37]/35 shadow-lg relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            
            {/* Upper Pet Profile Identity Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-[#E8DCCB] dark:border-[#D4AF37]/20">
              
              {/* Pet Image (Avatar) with click cue to open Ficha Mascota */}
              <div className="flex items-center gap-4 sm:gap-5">
                
                <div 
                  onClick={() => setActiveTab('pet_profile')}
                  id="pet-avatar-click"
                  className="relative group cursor-pointer shrink-0"
                  title={language === 'es' ? `Haz clic en la imagen para abrir la Ficha de ${selectedPet.name}` : `Click image to open ${selectedPet.name}'s profile`}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-[#B8860B] via-[#D4AF37] to-emerald-600 shadow-md group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 ring-2 ring-[#D4AF37]/30">
                    <div className="w-full h-full rounded-[20px] overflow-hidden bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
                      {selectedPet.avatarUrl ? (
                        <img 
                          src={selectedPet.avatarUrl} 
                          alt={selectedPet.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-4xl sm:text-5xl select-none group-hover:scale-110 transition-transform">
                          {selectedPet.avatarIcon || (selectedPet.species === 'cat' ? '🐈' : '🐕')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Species & Click badge */}
                  <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-extrabold text-[10px] shadow-md flex items-center gap-0.5 group-hover:scale-110 transition-transform">
                    <span>{selectedPet.species === 'cat' ? '🐈 Gato' : '🐕 Perro'}</span>
                  </span>
                </div>

                {/* Pet Bio Details */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 
                      onClick={() => setActiveTab('pet_profile')}
                      className="font-editorial text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-[#F3E5AB] cursor-pointer hover:text-[#B8860B] dark:hover:text-[#D4AF37] transition-colors truncate"
                    >
                      {selectedPet.name}
                    </h2>
                    
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-900 dark:bg-[#D4AF37]/20 dark:text-[#F3E5AB] border border-amber-500/30">
                      {selectedPet.gender === 'male' ? (language === 'es' ? 'Macho' : 'Male') : (language === 'es' ? 'Hembra' : 'Female')} • {selectedPet.isNeutered ? (language === 'es' ? 'Esterilizado' : 'Neutered') : (language === 'es' ? 'Entero' : 'Intact')}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{selectedPet.breed}</span> • {selectedPet.ageYears} {t('ageYears')} ({selectedPet.ageMonths || 0} m)
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-700 dark:text-stone-300 pt-0.5">
                    <div className="flex items-center gap-1 font-mono font-bold text-[#B8860B] dark:text-[#D4AF37]">
                      <Scale className="w-3.5 h-3.5" />
                      <span>{selectedPet.weightKg} kg</span>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500">(Meta: {selectedPet.targetWeightKg} kg)</span>
                    </div>

                    <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700"></span>

                    <div className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
                      <span>RER: {rerVal} kcal</span>
                      <span className="text-stone-400">|</span>
                      <span>MER: {merData.mer} kcal/día</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Direct Open Profile CTA Button */}
              <div className="flex items-center gap-2 self-start md:self-center">
                <button
                  onClick={() => setActiveTab('pet_profile')}
                  id="btn-open-pet-profile-hero"
                  className="w-full md:w-auto px-4 py-2.5 rounded-2xl bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold text-xs sm:text-sm shadow-md hover:scale-102 transition-transform flex items-center justify-center gap-2 group"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{language === 'es' ? `Ver Ficha de ${selectedPet.name}` : `View ${selectedPet.name}'s Profile`}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* 3. FOUR CORE MODULE OPTIONS (ACCESIBLES DESDE LA IMAGEN / MASCOTA)        */}
            {/* ========================================================================= */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B8860B] dark:bg-[#D4AF37]"></span>
                  <h3 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {language === 'es' ? `Apartados Disponibles para ${selectedPet.name}:` : `Available Sections for ${selectedPet.name}:`}
                  </h3>
                </div>
                <span className="text-[11px] text-[#B8860B] dark:text-[#D4AF37] font-semibold">
                  {language === 'es' ? 'Toque una opción para abrir' : 'Tap an option to open'}
                </span>
              </div>

              {/* 5 Clean Options Grid including Plan Semanal situated between Ficha Mascota and Recetario General */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                
                {/* 1. FICHA MASCOTA */}
                <button
                  onClick={() => setActiveTab('pet_profile')}
                  id="home-option-pet-profile"
                  className="p-4 rounded-2xl bg-white dark:bg-[#16271F] border border-[#E8DCCB] dark:border-[#D4AF37]/30 shadow-xs hover:shadow-md hover:border-[#B8860B] dark:hover:border-[#D4AF37] transition-all text-left group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#D4AF37] flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform">
                        <HeartPulse className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-[#112019] text-amber-900 dark:text-[#F3E5AB]">
                        BCS {selectedPet.bodyConditionScore}/9
                      </span>
                    </div>

                    <div>
                      <h4 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-[#F3E5AB] group-hover:text-[#B8860B] dark:group-hover:text-[#D4AF37] transition-colors">
                        {t('modulePetProfileTitle')}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                        {t('modulePetProfileDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-[#B8860B] dark:text-[#D4AF37]">
                    <span>{language === 'es' ? 'Abrir Ficha' : 'Open Profile'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 2. PLAN SEMANAL (Situada entre Ficha Mascota y Recetario General) */}
                <button
                  onClick={() => setActiveTab('weekly_plan')}
                  id="home-option-weekly-plan"
                  className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/70 to-white dark:from-[#1b3327] dark:to-[#16271F] border-2 border-[#D4AF37]/50 shadow-xs hover:shadow-md hover:border-[#B8860B] dark:hover:border-[#D4AF37] transition-all text-left group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 dark:bg-[#D4AF37]/25 text-[#B8860B] dark:text-[#D4AF37] flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform">
                        <CalendarRange className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#B8860B] text-white dark:bg-[#D4AF37] dark:text-stone-950">
                        7 {language === 'es' ? 'Días' : 'Days'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-[#F3E5AB] group-hover:text-[#B8860B] dark:group-hover:text-[#D4AF37] transition-colors">
                        {language === 'es' ? 'Plan Semanal' : 'Weekly Plan'}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                        {language === 'es' ? 'Dieta equilibrada y registro de platos dados con stiks de control' : 'Balanced diet and meal check stiks'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs font-bold text-[#B8860B] dark:text-[#D4AF37]">
                    <span>{language === 'es' ? 'Ver Semana' : 'View Plan'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 3. RECETARIO GENERAL */}
                <button
                  onClick={() => setActiveTab('recipes')}
                  id="home-option-recipes"
                  className="p-4 rounded-2xl bg-white dark:bg-[#16271F] border border-[#E8DCCB] dark:border-[#D4AF37]/30 shadow-xs hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-400 transition-all text-left group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200">
                        {RECIPES_CATALOG.length} {language === 'es' ? 'Recetas' : 'Recipes'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-[#F3E5AB] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {t('moduleRecipesTitle')}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                        {t('moduleRecipesDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <span>{language === 'es' ? 'Ver Recetas' : 'View Recipes'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 4. AGENDA & AVISOS */}
                <button
                  onClick={() => setActiveTab('agenda')}
                  id="home-option-agenda"
                  className="p-4 rounded-2xl bg-white dark:bg-[#16271F] border border-[#E8DCCB] dark:border-[#D4AF37]/30 shadow-xs hover:shadow-md hover:border-[#B8860B] dark:hover:border-[#D4AF37] transition-all text-left group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#D4AF37] flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      {events.length > 0 ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-[#112019] text-amber-900 dark:text-[#F3E5AB]">
                          {events.length} {language === 'es' ? 'Avisos' : 'Events'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500">
                          {language === 'es' ? 'Al día' : 'Up to date'}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-[#F3E5AB] group-hover:text-[#B8860B] dark:group-hover:text-[#D4AF37] transition-colors">
                        {t('moduleAgendaTitle')}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                        {t('moduleAgendaDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-[#B8860B] dark:text-[#D4AF37]">
                    <span>{language === 'es' ? 'Ver Agenda' : 'View Agenda'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 5. ALIMENTOS TÓXICOS */}
                <button
                  onClick={() => setActiveTab('toxic_foods')}
                  id="home-option-toxic-foods"
                  className="p-4 rounded-2xl bg-white dark:bg-[#16271F] border border-[#E8DCCB] dark:border-[#D4AF37]/30 shadow-xs hover:shadow-md hover:border-rose-400 dark:hover:border-rose-600 transition-all text-left group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200">
                        {language === 'es' ? 'Semáforo' : 'Guide'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-[#F3E5AB] group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                        {t('moduleToxicFoodsTitle')}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                        {t('moduleToxicFoodsDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
                    <span>{language === 'es' ? 'Consultar Guía' : 'Check Guide'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

              </div>
            </div>

          </div>
        </section>
      ) : (
        /* Empty Pets Canvas with Modules Access */
        <section className="space-y-6">
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-[#112019] border-2 border-dashed border-[#E8DCCB] dark:border-[#D4AF37]/30 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-[#16271F] text-[#B8860B] dark:text-[#D4AF37] flex items-center justify-center mx-auto shadow-inner">
              <HeartPulse className="w-8 h-8" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              {t('emptyPetsTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
              {t('emptyPetsDesc')}
            </p>
            <div className="pt-3 flex justify-center">
              <button
                onClick={() => setShowAddModal(true)}
                className="py-3 px-6 rounded-2xl bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold text-xs sm:text-sm shadow-md hover:scale-102 transition-transform flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t('createPetBtn')}</span>
              </button>
            </div>
          </div>

          {/* Core Modules exploration even before creating pet */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/25 shadow-xs space-y-4">
            <h4 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
              {language === 'es' ? 'Apartados Principales de PAWLOVE:' : 'PAWLOVE Core Sections:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-[#16271F] border border-amber-200 dark:border-[#D4AF37]/30 text-left space-y-2 hover:border-[#B8860B] transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#B8860B] dark:text-[#D4AF37]">
                  <HeartPulse className="w-4 h-4" />
                  <span>{t('modulePetProfileTitle')}</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {language === 'es' ? 'Crear perfil con peso, edad y cálculos RER/MER.' : 'Create profile with weight, age and energy equations.'}
                </p>
              </button>

              <button
                onClick={() => setActiveTab('weekly_plan')}
                className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-[#16271F] border border-amber-200 dark:border-[#D4AF37]/30 text-left space-y-2 hover:border-[#B8860B] transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#B8860B] dark:text-[#D4AF37]">
                  <CalendarRange className="w-4 h-4" />
                  <span>{language === 'es' ? 'Plan Semanal' : 'Weekly Plan'}</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {language === 'es' ? 'Visión 7 días con platos, snacks y stiks de control.' : '7-Day balanced diet and meal tracking stiks.'}
                </p>
              </button>

              <button
                onClick={() => setActiveTab('recipes')}
                className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-[#16271F] border border-emerald-200 dark:border-emerald-800/40 text-left space-y-2 hover:border-emerald-500 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <BookOpen className="w-4 h-4" />
                  <span>{t('moduleRecipesTitle')}</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {RECIPES_CATALOG.length} {language === 'es' ? 'recetas caseras completas.' : 'complete homemade recipes.'}
                </p>
              </button>

              <button
                onClick={() => setActiveTab('agenda')}
                className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-[#16271F] border border-amber-200 dark:border-[#D4AF37]/30 text-left space-y-2 hover:border-[#B8860B] transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#B8860B] dark:text-[#D4AF37]">
                  <CalendarDays className="w-4 h-4" />
                  <span>{t('moduleAgendaTitle')}</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {language === 'es' ? 'Avisos de medicación, vacunas y comidas con alarma.' : 'Medication, vaccination & meal alarms.'}
                </p>
              </button>

              <button
                onClick={() => setActiveTab('toxic_foods')}
                className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-[#16271F] border border-rose-200 dark:border-rose-800/40 text-left space-y-2 hover:border-rose-500 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{t('moduleToxicFoodsTitle')}</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {language === 'es' ? 'Semáforo de alimentos seguros y peligrosos.' : 'Traffic-light toxic and safe food guide.'}
                </p>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 3. RECETAS CASERAS ADAPTADAS (2 COMPLETAS + 1 POSTRE + 1 SNACK)           */}
      {/* ========================================================================= */}
      {selectedPet && (
        <section 
          id="home-daily-diet-section"
          className="rounded-3xl p-5 sm:p-7 bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 shadow-md space-y-6"
        >
          {/* Section Header with updated real date & Quick CTA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#D4AF37] flex items-center justify-center font-bold">
                  <ChefHat className="w-4 h-4" />
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                  {language === 'es' ? 'Recetas Caseras Adaptadas' : 'Adapted Homemade Recipes'}
                </h3>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-100">
                  <Calendar className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                  {language === 'es' ? 'Sugerencias de hoy:' : 'Today:'} {todayDateObj.dayNameEs}, {todayDateObj.dateFormatted}
                </span>
                <span className="text-stone-400">•</span>
                <span>
                  {language === 'es' 
                    ? `Menú adaptado a ${selectedPet.name} (${selectedPet.weightKg} kg): 2 recetas completas, 1 postre y 1 snack`
                    : `Adapted menu for ${selectedPet.name} (${selectedPet.weightKg} kg): 2 meals, 1 dessert, 1 snack`}
                </span>
              </p>
            </div>

            <button
              onClick={() => setActiveTab('weekly_plan')}
              id="home-btn-view-full-weekly-plan"
              className="self-start md:self-center px-4 py-2 rounded-xl bg-amber-50 dark:bg-[#16271F] border border-[#D4AF37]/40 text-[#B8860B] dark:text-[#D4AF37] hover:bg-[#B8860B] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-stone-950 font-bold text-xs shadow-xs transition-all flex items-center gap-2"
            >
              <CalendarRange className="w-4 h-4" />
              <span>{language === 'es' ? 'Abrir Visión Semanal Completa (7 Días)' : 'Open Full 7-Day Plan'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Today's 4 Suggested Recipe Cards (2 Complete Meals, 1 Dessert, 1 Snack) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                {language === 'es' ? `Sugerencias del día (${todayDateObj.dayNameEs}): haz clic para ver la preparación y dar OK` : `Today's suggestions: click to view recipe and give OK`}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                🟢 {language === 'es' ? 'OK / Hecha' : 'Done'} • 🔴 {language === 'es' ? 'No hecha' : 'Not done'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 1. RECETA COMPLETA 1 (ALMUERZO) */}
              <div 
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  todayTracking.dish1Given === true
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 dark:border-emerald-500/30'
                    : todayTracking.dish1Given === false
                    ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30'
                    : 'bg-amber-50/40 dark:bg-[#16271F]/80 border-[#E8DCCB] dark:border-[#D4AF37]/25 hover:border-[#D4AF37]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#B8860B]/15 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#F3E5AB]">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Receta Completa 1: Almuerzo' : 'Complete Meal 1: Lunch'}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                      {todayPlan.dish1.portionGrams}g • {todayPlan.dish1.kcal} kcal
                    </span>
                  </div>

                  <h5 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {todayPlan.dish1.title}
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2">
                    {todayPlan.dish1.description}
                  </p>

                  {/* Ingredients Preview */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {todayPlan.dish1.ingredients.slice(0, 3).map((ing, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {ing.name} ({ing.grams}g)
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectingRecipe({
                      type: 'dish1',
                      typeLabel: language === 'es' ? 'Receta Completa 1 (Almuerzo)' : 'Complete Meal 1 (Lunch)',
                      typeIcon: '🍽️',
                      badgeColor: 'bg-amber-500/20 text-[#B8860B] dark:text-[#F3E5AB]',
                      title: todayPlan.dish1.title,
                      description: todayPlan.dish1.description,
                      portion: `${todayPlan.dish1.portionGrams}g`,
                      kcal: todayPlan.dish1.kcal,
                      ingredients: todayPlan.dish1.ingredients,
                      instructions: todayPlan.dish1.instructions,
                      clinicalBenefits: todayPlan.dish1.clinicalBenefits,
                      chefTip: todayPlan.dish1.chefTip
                    })}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-[#D4AF37] text-stone-800 dark:text-[#F3E5AB] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-101"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                    <span>{language === 'es' ? 'Ver Receta & Preparación 📖' : 'View Recipe & Method'}</span>
                  </button>

                  {/* Stik OK Controls */}
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-[10px] font-semibold text-stone-500 mr-1 hidden sm:inline">
                      {language === 'es' ? '¿Hecha hoy?' : 'Made today?'}
                    </span>
                    <button
                      onClick={() => {
                        setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dish1', true);
                        playLuxuryChime();
                        showToast(language === 'es' ? '✅ ¡Plato 1 marcado como hecho hoy (OK)!' : '✅ Meal 1 marked as done today!');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        todayTracking.dish1Given === true
                          ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-500/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                      title={language === 'es' ? 'Dar OK: marcar como hecha hoy' : 'Give OK: mark as made today'}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'OK / Hecha' : 'OK / Done'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dish1', false);
                        showToast(language === 'es' ? '🔴 Marcada como no hecha' : '🔴 Marked as not done');
                      }}
                      className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        todayTracking.dish1Given === false
                          ? 'bg-rose-600 text-white shadow-xs scale-102 ring-2 ring-rose-500/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-rose-100 hover:text-rose-900'
                      }`}
                      title={language === 'es' ? 'Marcar como No hecha' : 'Mark as not done'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. RECETA COMPLETA 2 (CENA) */}
              <div 
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  todayTracking.dish2Given === true
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 dark:border-emerald-500/30'
                    : todayTracking.dish2Given === false
                    ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30'
                    : 'bg-amber-50/40 dark:bg-[#16271F]/80 border-[#E8DCCB] dark:border-[#D4AF37]/25 hover:border-[#D4AF37]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#B8860B]/15 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#F3E5AB]">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Receta Completa 2: Cena' : 'Complete Meal 2: Dinner'}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                      {todayPlan.dish2.portionGrams}g • {todayPlan.dish2.kcal} kcal
                    </span>
                  </div>

                  <h5 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {todayPlan.dish2.title}
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2">
                    {todayPlan.dish2.description}
                  </p>

                  {/* Ingredients Preview */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {todayPlan.dish2.ingredients.slice(0, 3).map((ing, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {ing.name} ({ing.grams}g)
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectingRecipe({
                      type: 'dish2',
                      typeLabel: language === 'es' ? 'Receta Completa 2 (Cena)' : 'Complete Meal 2 (Dinner)',
                      typeIcon: '🍲',
                      badgeColor: 'bg-amber-500/20 text-[#B8860B] dark:text-[#F3E5AB]',
                      title: todayPlan.dish2.title,
                      description: todayPlan.dish2.description,
                      portion: `${todayPlan.dish2.portionGrams}g`,
                      kcal: todayPlan.dish2.kcal,
                      ingredients: todayPlan.dish2.ingredients,
                      instructions: todayPlan.dish2.instructions,
                      clinicalBenefits: todayPlan.dish2.clinicalBenefits,
                      chefTip: todayPlan.dish2.chefTip
                    })}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-[#D4AF37] text-stone-800 dark:text-[#F3E5AB] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-101"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                    <span>{language === 'es' ? 'Ver Receta & Preparación 📖' : 'View Recipe & Method'}</span>
                  </button>

                  {/* Stik OK Controls */}
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-[10px] font-semibold text-stone-500 mr-1 hidden sm:inline">
                      {language === 'es' ? '¿Hecha hoy?' : 'Made today?'}
                    </span>
                    <button
                      onClick={() => {
                        setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dish2', true);
                        playLuxuryChime();
                        showToast(language === 'es' ? '✅ ¡Plato 2 marcado como hecho hoy (OK)!' : '✅ Meal 2 marked as done today!');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        todayTracking.dish2Given === true
                          ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-500/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                      title={language === 'es' ? 'Dar OK: marcar como hecha hoy' : 'Give OK: mark as made today'}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'OK / Hecha' : 'OK / Done'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dish2', false);
                        showToast(language === 'es' ? '🔴 Marcada como no hecha' : '🔴 Marked as not done');
                      }}
                      className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        todayTracking.dish2Given === false
                          ? 'bg-rose-600 text-white shadow-xs scale-102 ring-2 ring-rose-500/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-rose-100 hover:text-rose-900'
                      }`}
                      title={language === 'es' ? 'Marcar como No hecha' : 'Mark as not done'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. POSTRE DIGESTIVO DEL DÍA */}
              <div 
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  todayTracking.dessert1Given === true
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 dark:border-emerald-500/30'
                    : todayTracking.dessert1Given === false
                    ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30'
                    : 'bg-amber-50/20 dark:bg-[#16271F]/60 border-[#E8DCCB] dark:border-[#D4AF37]/20 hover:border-[#D4AF37]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 dark:bg-purple-400/20 text-purple-800 dark:text-purple-300">
                      <IceCream className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>{language === 'es' ? 'Postre Digestivo del Día' : 'Daily Digestive Dessert'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                      {todayPlan.dessert1.portion}
                    </span>
                  </div>

                  <h5 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {todayPlan.dessert1.title}
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2">
                    {todayPlan.dessert1.description}
                  </p>

                  <div className="mt-2 text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                    ✨ {todayPlan.dessert1.benefits}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectingRecipe({
                      type: 'dessert1',
                      typeLabel: language === 'es' ? 'Postre Digestivo del Día' : 'Daily Digestive Dessert',
                      typeIcon: '🍨',
                      badgeColor: 'bg-purple-500/20 text-purple-800 dark:text-purple-300',
                      title: todayPlan.dessert1.title,
                      description: todayPlan.dessert1.description,
                      portion: todayPlan.dessert1.portion,
                      kcal: todayPlan.dessert1.kcal,
                      ingredients: todayPlan.dessert1.ingredients,
                      instructions: todayPlan.dessert1.instructions || [
                        language === 'es' ? 'Paso 1: Mezclar los ingredientes a temperatura ambiente.' : 'Step 1: Combine ingredients at room temperature.',
                        language === 'es' ? 'Paso 2: Refrigerar hasta adquirir consistencia suave.' : 'Step 2: Chill until soft consistency.',
                        language === 'es' ? 'Paso 3: Servir fresco como postre digestivo.' : 'Step 3: Serve fresh as a soothing treat.'
                      ],
                      clinicalBenefits: [todayPlan.dessert1.benefits],
                      chefTip: todayPlan.dessert1.chefTip || (language === 'es' ? 'Rico en prebióticos y colágeno para mimar su digestión.' : 'Rich in prebiotics and collagen for smooth digestion.')
                    })}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-purple-400 text-stone-800 dark:text-[#F3E5AB] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-101"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{language === 'es' ? 'Ver Receta & Preparación 📖' : 'View Recipe & Method'}</span>
                  </button>

                  {/* Stik OK Controls */}
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-[10px] font-semibold text-stone-500 mr-1 hidden sm:inline">
                      {language === 'es' ? '¿Hecho hoy?' : 'Given?'}
                    </span>
                    <button
                      onClick={() => {
                        setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dessert1', true);
                        playLuxuryChime();
                        showToast(language === 'es' ? '✅ ¡Postre marcado como hecho hoy (OK)!' : '✅ Dessert marked as done today!');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        todayTracking.dessert1Given === true
                          ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-500/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                      title={language === 'es' ? 'Dar OK: marcar como hecho hoy' : 'Give OK: mark as done today'}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'OK / Hecho' : 'OK / Done'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dessert1', false);
                        showToast(language === 'es' ? '🔴 Marcado como no hecho' : '🔴 Marked as not given');
                      }}
                      className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        todayTracking.dessert1Given === false
                          ? 'bg-rose-600 text-white shadow-xs scale-102 ring-2 ring-rose-500/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-rose-100 hover:text-rose-900'
                      }`}
                      title={language === 'es' ? 'Marcar como No hecho' : 'Mark as not done'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. SNACK SALUDABLE DEL DÍA */}
              <div 
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  todayTracking.snack1Given === true
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 dark:border-emerald-500/30'
                    : todayTracking.snack1Given === false
                    ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30'
                    : 'bg-amber-50/20 dark:bg-[#16271F]/60 border-[#E8DCCB] dark:border-[#D4AF37]/20 hover:border-[#D4AF37]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300">
                      <Cookie className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{language === 'es' ? 'Snack Saludable del Día' : 'Daily Healthy Snack'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      {todayPlan.snack1.portion}
                    </span>
                  </div>

                  <h5 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {todayPlan.snack1.title}
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2">
                    {todayPlan.snack1.description}
                  </p>

                  <div className="mt-2 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                    🛡️ {todayPlan.snack1.benefits}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectingRecipe({
                      type: 'snack1',
                      typeLabel: language === 'es' ? 'Snack Saludable del Día' : 'Daily Healthy Snack',
                      typeIcon: '🍪',
                      badgeColor: 'bg-amber-500/20 text-amber-800 dark:text-amber-300',
                      title: todayPlan.snack1.title,
                      description: todayPlan.snack1.description,
                      portion: todayPlan.snack1.portion,
                      kcal: todayPlan.snack1.kcal,
                      ingredients: todayPlan.snack1.ingredients,
                      instructions: todayPlan.snack1.instructions || [
                        language === 'es' ? 'Paso 1: Trocear en bocaditos pequeños adaptados al tamaño de la mascota.' : 'Step 1: Slice into small bite-sized portions.',
                        language === 'es' ? 'Paso 2: Hornear o deshidratar a 75°C sin sal ni aditivos.' : 'Step 2: Slow-bake at 75°C with no salt or oil.',
                        language === 'es' ? 'Paso 3: Servir a temperatura ambiente como premio saludable.' : 'Step 3: Serve at room temperature as a healthy treat.'
                      ],
                      clinicalBenefits: [todayPlan.snack1.benefits],
                      chefTip: todayPlan.snack1.chefTip || (language === 'es' ? 'Conservar en bote hermético hasta 4 días.' : 'Store in an airtight jar up to 4 days.')
                    })}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-amber-400 text-stone-800 dark:text-[#F3E5AB] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-101"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{language === 'es' ? 'Ver Receta & Preparación 📖' : 'View Recipe & Method'}</span>
                  </button>

                  {/* Stik OK Controls */}
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-[10px] font-semibold text-stone-500 mr-1 hidden sm:inline">
                      {language === 'es' ? '¿Hecho hoy?' : 'Given?'}
                    </span>
                    <button
                      onClick={() => {
                        setMealStatus(selectedPet.id, todayDateObj.dateStr, 'snack1', true);
                        playLuxuryChime();
                        showToast(language === 'es' ? '✅ ¡Snack marcado como hecho hoy (OK)!' : '✅ Snack marked as done today!');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        todayTracking.snack1Given === true
                          ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-500/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                      title={language === 'es' ? 'Dar OK: marcar como hecho hoy' : 'Give OK: mark as done today'}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'OK / Hecho' : 'OK / Done'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setMealStatus(selectedPet.id, todayDateObj.dateStr, 'snack1', false);
                        showToast(language === 'es' ? '🔴 Marcado como no hecho' : '🔴 Marked as not given');
                      }}
                      className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        todayTracking.snack1Given === false
                          ? 'bg-rose-600 text-white shadow-xs scale-102 ring-2 ring-rose-500/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-rose-100 hover:text-rose-900'
                      }`}
                      title={language === 'es' ? 'Marcar como No hecho' : 'Mark as not done'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* 5. ACTIVIDAD FÍSICA & EJERCICIO RECOMENDADO DE HOY */}
            <div className="p-4 rounded-2xl bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <Activity className="w-4 h-4" />
                    <span>{language === 'es' ? 'Ejercicio y Actividad Física de Hoy' : "Today's Physical Activity"}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold">
                    {todayPlan.exerciseTarget.durationMin} min • {language === 'es' ? todayPlan.exerciseTarget.activityTypeEs : todayPlan.exerciseTarget.activityTypeEn}
                  </span>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300">
                  {language === 'es' ? todayPlan.exerciseTarget.notesEs : todayPlan.exerciseTarget.notesEn}
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-200/50 dark:border-emerald-800/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">
                    {language === 'es' ? 'Estado del ejercicio hoy:' : "Today's exercise status:"}
                  </span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {todayTracking.exerciseCompleted === true
                      ? (language === 'es' ? '¡Completado! 🎉' : 'Completed! 🎉')
                      : todayTracking.exerciseCompleted === false
                      ? (language === 'es' ? 'No realizado' : 'Not done')
                      : (language === 'es' ? 'Pendiente' : 'Pending')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setExerciseStatus(selectedPet.id, todayDateObj.dateStr, true, todayPlan.exerciseTarget.durationMin, todayPlan.exerciseTarget.activityTypeEs);
                      playLuxuryChime();
                      showToast(language === 'es' ? '🎉 ¡Ejercicio registrado como realizado!' : '🎉 Exercise marked as completed!');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      todayTracking.exerciseCompleted === true
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 hover:text-emerald-900'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Realizado' : 'Completed'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setExerciseStatus(selectedPet.id, todayDateObj.dateStr, false, 0, '');
                      showToast(language === 'es' ? '🔴 Ejercicio marcado como no realizado' : '🔴 Marked as not done');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      todayTracking.exerciseCompleted === false
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-100 hover:text-rose-900'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'No realizado' : 'Not done'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 7-DAY MINI WEEKLY OVERVIEW MATRIX (VISIÓN SEMANAL CON STIKS VERDE/ROJO)   */}
          {/* ========================================================================= */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                <span>{language === 'es' ? 'Control de la Dieta Semanal de un Vistazo (7 Días):' : 'Weekly Diet Control at a Glance:'}</span>
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                🟢 = {language === 'es' ? 'Dado' : 'Given'} | 🔴 = {language === 'es' ? 'No dado' : 'Not given'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {weeklyPlan.map((day) => {
                const dateMeta = weekDates[day.dayIndex] || weekDates[0];
                const dayTrack = getTrackingForDay(selectedPet.id, dateMeta.dateStr);
                const isCurrentToday = dateMeta.isToday;

                return (
                  <div
                    key={day.dayIndex}
                    onClick={() => setActiveTab('weekly_plan')}
                    className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all hover:scale-102 ${
                      isCurrentToday
                        ? 'bg-amber-50 dark:bg-[#1f382c] border-[#B8860B] dark:border-[#D4AF37] ring-1 ring-[#D4AF37]/40 shadow-xs'
                        : 'bg-stone-50/80 dark:bg-[#16271F]/50 border-stone-200/80 dark:border-stone-800 hover:border-[#D4AF37]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 dark:text-stone-400">
                      <span>{language === 'es' ? day.dayNameEs.slice(0, 3) : day.dayNameEn.slice(0, 3)}</span>
                      {isCurrentToday && (
                        <span className="px-1 py-0.2 rounded text-[8px] bg-[#B8860B] text-white dark:bg-[#D4AF37] dark:text-stone-950 font-extrabold">
                          {language === 'es' ? 'HOY' : 'TODAY'}
                        </span>
                      )}
                    </div>
                    
                    <div className="font-editorial font-bold text-xs text-stone-900 dark:text-[#F3E5AB] my-1">
                      {dateMeta.dateFormatted}
                    </div>

                    {/* Stiks for dish 1 and dish 2 */}
                    <div className="flex items-center justify-center gap-1.5 pt-1">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          dayTrack.dish1Given === true
                            ? 'bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-900'
                            : dayTrack.dish1Given === false
                            ? 'bg-rose-500 ring-2 ring-rose-300 dark:ring-rose-900'
                            : 'bg-stone-300 dark:bg-stone-700'
                        }`}
                        title={`Plato 1: ${dayTrack.dish1Given === true ? 'Sí' : dayTrack.dish1Given === false ? 'No' : 'Pendiente'}`}
                      />
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          dayTrack.dish2Given === true
                            ? 'bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-900'
                            : dayTrack.dish2Given === false
                            ? 'bg-rose-500 ring-2 ring-rose-300 dark:ring-rose-900'
                            : 'bg-stone-300 dark:bg-stone-700'
                        }`}
                        title={`Plato 2: ${dayTrack.dish2Given === true ? 'Sí' : dayTrack.dish2Given === false ? 'No' : 'Pendiente'}`}
                      />
                    </div>

                    {/* Exercise status icon */}
                    <div className="mt-1.5 flex items-center justify-center">
                      {dayTrack.exerciseCompleted === true ? (
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          🏃 ✓
                        </span>
                      ) : (
                        <span className="text-[9px] text-stone-400 dark:text-stone-600">
                          🏃 -
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. NUTRI IA & PENDING REMINDERS SECTION (COMPACT HUB)                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Nutri IA Card (2 Cols on large screens) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-amber-50/20 to-emerald-50/30 dark:from-[#112019] dark:via-[#16271F] dark:to-[#0B1510] border border-[#E8DCCB] dark:border-[#D4AF37]/25 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#B8860B] to-emerald-700 text-white flex items-center justify-center font-bold shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                    Nutri IA • Asistente Veterinario
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-emerald-500 text-white shadow-2xs">
                    AI
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {language === 'es' ? 'Consulta dudas sobre ingredientes, raciones y nutrición clínica personalizada.' : 'Ask questions about ingredients, portions, and personalized clinical nutrition.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('concierge')}
              id="home-btn-open-nutria"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs hover:scale-102 transition-transform"
            >
              <span>{language === 'es' ? 'Abrir Chat' : 'Open Chat'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              {language === 'es' ? 'Preguntas Frecuentes:' : 'Quick Questions:'}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAskNutriIA(language === 'es' ? `¿Qué verduras puede comer mi ${selectedPet?.species === 'cat' ? 'gato' : 'perro'} de forma segura?` : `Which vegetables are safe for my ${selectedPet?.species === 'cat' ? 'cat' : 'dog'}?`)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#16271F] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 hover:border-[#B8860B] dark:hover:border-[#D4AF37] text-xs font-medium transition-colors text-left"
              >
                🥦 {language === 'es' ? '¿Qué verduras son seguras?' : 'Safe vegetables?'}
              </button>

              <button
                onClick={() => handleAskNutriIA(language === 'es' ? `¿Cómo calcular la ración diaria exacta para ${selectedPet?.name || 'mi mascota'} con peso de ${selectedPet?.weightKg || 15} kg?` : `How to calculate exact portion for ${selectedPet?.name || 'my pet'} at ${selectedPet?.weightKg || 15} kg?`)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#16271F] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 hover:border-[#B8860B] dark:hover:border-[#D4AF37] text-xs font-medium transition-colors text-left"
              >
                ⚖️ {language === 'es' ? 'Calcular ración diaria' : 'Calculate daily portion'}
              </button>

              <button
                onClick={() => handleAskNutriIA(language === 'es' ? `¿Cómo preparar caldo de huesos con colágeno para perros y gatos?` : `How to make bone broth for dogs and cats?`)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#16271F] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 hover:border-[#B8860B] dark:hover:border-[#D4AF37] text-xs font-medium transition-colors text-left"
              >
                🍲 {language === 'es' ? 'Caldo con colágeno' : 'Bone broth guide'}
              </button>
            </div>
          </div>
        </div>

        {/* Pending Reminders Card (1 Col) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/25 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
                <h4 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                  {language === 'es' ? 'Próximos Avisos' : 'Upcoming Reminders'}
                </h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-[#16271F] text-amber-900 dark:text-[#F3E5AB]">
                {pendingEvents.length} {language === 'es' ? 'pendientes' : 'pending'}
              </span>
            </div>

            {pendingEvents.length > 0 ? (
              <div className="space-y-2">
                {pendingEvents.map((evt) => (
                  <div 
                    key={evt.id}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-[#16271F] border border-stone-200 dark:border-stone-800/80 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="text-xs font-bold text-stone-900 dark:text-[#F3E5AB] truncate">
                        {evt.title}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#B8860B] dark:text-[#D4AF37]" />
                        <span>{evt.time || '10:00'} • {evt.petName}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleEventCompleted(evt.id)}
                      className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:scale-105 transition-transform shrink-0"
                      title={language === 'es' ? 'Marcar como completado' : 'Mark completed'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200">
                  {language === 'es' ? '¡Todo al día! Sin tomas pendientes.' : 'All up to date! No pending reminders.'}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('agenda')}
              className="text-xs font-bold text-[#B8860B] dark:text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              <span>{language === 'es' ? 'Ver agenda médica completa' : 'View complete medical agenda'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Add Pet Modal */}
      {showAddModal && (
        <AddPetModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      )}

      {/* Recipe Detail & Preparation Method Modal */}
      {inspectingRecipe && selectedPet && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setInspectingRecipe(null)}
        >
          <div 
            className="bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/35 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 bg-gradient-to-r from-amber-500/10 via-transparent to-emerald-500/5 dark:from-[#D4AF37]/10 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${inspectingRecipe.badgeColor}`}>
                    <span>{inspectingRecipe.typeIcon}</span>
                    <span>{inspectingRecipe.typeLabel}</span>
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {todayDateObj.dayNameEs}, {todayDateObj.dateFormatted}
                  </span>
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                  {inspectingRecipe.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {inspectingRecipe.description}
                </p>
              </div>

              <button
                onClick={() => setInspectingRecipe(null)}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200 transition-colors"
                title={language === 'es' ? 'Cerrar' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              
              {/* Pet Adaptation & Portion Meta Strip */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-[#16271F] border border-[#E8DCCB] dark:border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {language === 'es' ? `Porción adaptada a ${selectedPet.name} (${selectedPet.weightKg} kg):` : `Portion for ${selectedPet.name}:`}
                  </span>
                  <span className="font-mono font-bold text-[#B8860B] dark:text-[#D4AF37]">
                    {inspectingRecipe.portion}
                  </span>
                </div>
                {inspectingRecipe.kcal && (
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 font-mono">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>~{inspectingRecipe.kcal} kcal</span>
                  </div>
                )}
              </div>

              {/* 1. Ingredientes Adaptados */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-[#F3E5AB] flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                  <span>{language === 'es' ? 'Ingredientes exactos y pesados' : 'Exact Weighted Ingredients'}</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Array.isArray(inspectingRecipe.ingredients) && inspectingRecipe.ingredients.map((ing, idx) => {
                    if (typeof ing === 'string') {
                      return (
                        <div key={idx} className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 text-xs font-medium text-stone-800 dark:text-stone-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37]"></span>
                          <span>{ing}</span>
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-medium text-stone-800 dark:text-stone-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37]"></span>
                          <span>{ing.name}</span>
                        </div>
                        {ing.grams !== undefined && ing.grams > 0 && (
                          <span className="font-mono font-bold text-[#B8860B] dark:text-[#D4AF37] px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 text-[11px]">
                            {ing.grams}g
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Modo de Preparación Paso a Paso */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-[#F3E5AB] flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                  <span>{language === 'es' ? 'Modo de Preparación Paso a Paso' : 'Step-by-Step Preparation Method'}</span>
                </h4>

                <div className="space-y-2.5">
                  {inspectingRecipe.instructions.map((step, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-2xl bg-amber-50/30 dark:bg-[#16271F]/50 border border-[#E8DCCB] dark:border-[#D4AF37]/15 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#B8860B] text-white dark:bg-[#D4AF37] dark:text-stone-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Beneficios Clínicos y Nutricionales */}
              {inspectingRecipe.clinicalBenefits && inspectingRecipe.clinicalBenefits.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'es' ? 'Beneficios Nutricionales & Clínicos' : 'Nutritional & Clinical Benefits'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {inspectingRecipe.clinicalBenefits.map((ben, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ben}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Consejo del Chef Nutricionista */}
              {inspectingRecipe.chefTip && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-[#D4AF37]/10 border border-[#B8860B]/20 dark:border-[#D4AF37]/30 text-xs text-stone-700 dark:text-stone-300 space-y-1">
                  <span className="font-bold text-[#B8860B] dark:text-[#D4AF37] flex items-center gap-1.5">
                    💡 {language === 'es' ? 'Consejo del Chef Nutricionista:' : 'Chef & Storage Tip:'}
                  </span>
                  <p>{inspectingRecipe.chefTip}</p>
                </div>
              )}

            </div>

            {/* Modal Footer with OK / Done Action Bar */}
            <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#0E1A14] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 dark:text-stone-400">
                  {language === 'es' ? 'Estado de hoy:' : "Today's status:"}
                </span>
                <span className="font-bold">
                  {todayTracking[`${inspectingRecipe.type}Given` as keyof typeof todayTracking] === true ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> {language === 'es' ? 'Hecha y dada hoy (OK) ✅' : 'Made & given today (OK) ✅'}
                    </span>
                  ) : todayTracking[`${inspectingRecipe.type}Given` as keyof typeof todayTracking] === false ? (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> {language === 'es' ? 'Marcada como No hecha 🔴' : 'Marked as not done 🔴'}
                    </span>
                  ) : (
                    <span className="text-stone-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {language === 'es' ? 'Pendiente' : 'Pending'}
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, inspectingRecipe.type, false);
                    showToast(language === 'es' ? '🔴 Marcada como no hecha' : '🔴 Marked as not done');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    todayTracking[`${inspectingRecipe.type}Given` as keyof typeof todayTracking] === false
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-100 hover:text-rose-900'
                  }`}
                >
                  <X className="w-3.5 h-3.5 inline mr-1" />
                  <span>{language === 'es' ? 'No hecha' : 'Not done'}</span>
                </button>

                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, inspectingRecipe.type, true);
                    playLuxuryChime();
                    showToast(language === 'es' ? '✅ ¡Receta marcada como hecha hoy (OK)!' : '✅ Recipe marked as done today (OK)!');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    todayTracking[`${inspectingRecipe.type}Given` as keyof typeof todayTracking] === true
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/40'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'es' ? 'Dar OK / Hecha Hoy ✅' : 'Give OK / Made Today ✅'}</span>
                </button>

                <button
                  onClick={() => setInspectingRecipe(null)}
                  className="px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-300"
                >
                  {language === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
