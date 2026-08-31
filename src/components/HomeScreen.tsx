import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMER, calculateRER, getConditionClinicalAlerts } from '../utils/nutrition';
import { playLuxuryChime } from '../utils/alertsAndAudio';
import { AddPetModal } from './AddPetModal';
import { RECIPES_CATALOG } from '../data/mockData';
import { 
  HeartPulse, 
  CalendarDays, 
  BookOpen, 
  Bot, 
  Sparkles, 
  Droplet, 
  Footprints, 
  Volume2, 
  Sun, 
  Moon, 
  Activity, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Bell,
  Edit3,
  CheckCircle2,
  Clock,
  Award,
  ShieldAlert,
  Smartphone,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HomeScreen: React.FC = () => {
  const { 
    pets, 
    selectedPetId, 
    selectPet, 
    setActiveTab, 
    events, 
    toggleEventCompleted,
    addWaterMl,
    addBrothMl,
    addWalkRecord,
    recordCookedMeal,
    theme,
    toggleTheme,
    language,
    t,
    showToast
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [isPlayingSoundwave, setIsPlayingSoundwave] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'diet' | 'habits'>('overview');
  const [isPhoneFrameView, setIsPhoneFrameView] = useState(false);
  
  // Interactive habit toggles (matching Image 2 dark mode checklist)
  const [morningWalkCompleted, setMorningWalkCompleted] = useState(true);
  const [morningMealCompleted, setMorningMealCompleted] = useState(true);
  const [morningWaterCompleted, setMorningWaterCompleted] = useState(true);
  const [morningTreatCompleted, setMorningTreatCompleted] = useState(true);
  const [afternoonMealCompleted, setAfternoonMealCompleted] = useState(false);
  const [afternoonWaterCompleted, setAfternoonWaterCompleted] = useState(false);

  // Selected date in calendar widget
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(14);

  // Active pet (defaults to Charlie)
  const selectedPet = pets.find(p => p.id === selectedPetId) || pets[0];

  // Calculated nutritional values (Kleiber law formula)
  const merData = selectedPet ? calculateMER(selectedPet) : { rer: 500, mer: 800, dailyFoodGrams: 400 };
  const rerVal = selectedPet ? calculateRER(selectedPet.weightKg) : 500;

  // Hydration calculations (in Liters and Milliliters - Image 1: 1.6 L / 2.5 L - 65%)
  const waterMl = selectedPet?.todayWaterMl || 1250;
  const brothMl = selectedPet?.todayBrothMl || 350;
  const totalHydrationMl = waterMl + brothMl;
  const targetHydrationMl = selectedPet?.todayWaterTargetMl || (selectedPet ? Math.round(selectedPet.weightKg * 55) : 2500);
  const hydrationLiters = (totalHydrationMl / 1000).toFixed(1);
  const targetHydrationLiters = (targetHydrationMl / 1000).toFixed(1);
  const hydrationPct = Math.min(100, Math.round((totalHydrationMl / targetHydrationMl) * 100)) || 65;

  // Walk calculations (Image 1: 54 min / 60 min - 90%)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayWalks = selectedPet?.walksHistory?.filter(w => w.date === todayDateStr) || [];
  const totalWalkMin = todayWalks.reduce((acc, curr) => acc + (curr.durationMin || 0), 0) || 54;
  const totalWalkKm = todayWalks.reduce((acc, curr) => acc + (curr.distanceKm || 0), 0) || 3.8;
  const targetWalkMin = selectedPet?.species === 'dog' ? 60 : 30;
  const walkPct = Math.min(100, Math.round((totalWalkMin / targetWalkMin) * 100)) || 90;

  // Matched recipe of the day for active pet (Salmon & Quinoa Medley)
  const dailyRecipe = RECIPES_CATALOG.find(r => r.id === 'rec-joint-dog') || RECIPES_CATALOG[0];

  // Filter events
  const pendingEvents = events.filter(e => !e.completed);

  // Trigger test soundwave audio with Web Audio API chime
  const handleTestSoundwave = () => {
    setIsPlayingSoundwave(true);
    playLuxuryChime('reminder');
    showToast(language === 'es' ? 'Reproduciendo aviso acústico de Charlie...' : "Playing Charlie's acoustic chime...", 'info');
    setTimeout(() => {
      setIsPlayingSoundwave(false);
    }, 2800);
  };

  const handleQuickAddWater = (amountL: number) => {
    if (!selectedPet) return;
    addWaterMl(selectedPet.id, Math.round(amountL * 1000));
    playLuxuryChime('success');
    showToast(language === 'es' ? `+${amountL} L de agua fresca registrada` : `+${amountL} L of fresh water logged`, 'success');
  };

  const handleQuickAddBroth = (amountL: number) => {
    if (!selectedPet) return;
    addBrothMl(selectedPet.id, Math.round(amountL * 1000));
    playLuxuryChime('success');
    showToast(language === 'es' ? `+${amountL} L de caldo con colágeno registrado` : `+${amountL} L of collagen broth logged`, 'success');
  };

  const handleQuickAddWalk = (mins: number) => {
    if (!selectedPet) return;
    const estKm = Math.round((mins * 0.07) * 10) / 10;
    addWalkRecord(selectedPet.id, {
      durationMin: mins,
      distanceKm: estKm,
      notes: language === 'es' ? 'Paseo registrado' : 'Walk logged',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    playLuxuryChime('success');
    showToast(language === 'es' ? `+${mins} min de paseo registrado` : `+${mins} min of walk logged`, 'success');
  };

  const handleMarkMealCooked = () => {
    if (!selectedPet || !dailyRecipe) return;
    recordCookedMeal(selectedPet.id, {
      recipeId: dailyRecipe.id,
      recipeTitle: dailyRecipe.title,
      daysPrepared: 2,
      totalGrams: merData.dailyFoodGrams * 2,
      totalKcal: merData.mer * 2
    });
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    showToast(language === 'es' ? '¡Ración de Salmon & Quinoa marcada como cocinada!' : 'Salmon & Quinoa meal marked as cooked!', 'success');
  };

  // Sub-tabs navigation array
  const subTabs = [
    { id: 'overview' as const, label: language === 'es' ? 'HEALTH OVERVIEW' : 'HEALTH OVERVIEW' },
    { id: 'diet' as const, label: language === 'es' ? 'DIET PLAN' : 'DIET PLAN' },
    { id: 'habits' as const, label: language === 'es' ? 'HABIT TRACKER' : 'HABIT TRACKER' },
  ];

  return (
    <div className={`mx-auto transition-all duration-300 ${isPhoneFrameView ? 'max-w-[420px] rounded-[40px] border-8 border-stone-800 dark:border-stone-900 shadow-2xl p-4 sm:p-5 bg-[#FBF9F5] dark:bg-[#07130E]' : 'max-w-5xl'}`}>
      
      {/* Top Controls: Phone View Switcher & Theme Info */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#B8860B] dark:text-[#D4AF37]">
            {theme === 'dark' ? 'PETWELL ATELIER' : 'PETPINNACLE LUXURY'}
          </span>
        </div>

        {/* View Mode Toggle (Phone Bezel vs Wide View) */}
        <button
          onClick={() => setIsPhoneFrameView(!isPhoneFrameView)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-stone-700 dark:text-[#F3E5AB] hover:border-[#D4AF37] transition-all shadow-xs"
        >
          {isPhoneFrameView ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
              <span>{language === 'es' ? 'Vista Ampliada' : 'Wide View'}</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
              <span>{language === 'es' ? 'Vista Móvil' : 'Mobile Frame'}</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        
        {/* ========================================================================= */}
        {/* 1. TOP PET PROFILE CARD (MATCHING IMAGE 1 & IMAGE 2)                      */}
        {/* ========================================================================= */}
        {selectedPet && (
          <section 
            className="relative rounded-[26px] overflow-hidden p-6 sm:p-7 backdrop-blur-xl border transition-all duration-300 shadow-[0_10px_30px_rgba(200,160,100,0.1)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.5)] bg-white/95 dark:bg-[#112019]/95 border-[#E8DCCB] dark:border-[#D4AF37]/30"
            id="personalized-pet-header"
          >
            {/* Top Label & Edit Action matching Image 1 ("My Pet") & Image 2 ("PETWELL") */}
            <div className="flex items-center justify-between mb-5 relative z-10">
              <span className="font-editorial text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-[#B8860B] dark:text-[#D4AF37]">
                {theme === 'dark' ? 'PETWELL' : (language === 'es' ? 'Mi Mascota' : 'My Pet')}
              </span>

              <div className="flex items-center gap-2">
                {/* Notification Bell Badge */}
                <button
                  onClick={() => setActiveTab('agenda')}
                  className="relative p-2 rounded-full bg-stone-50 dark:bg-[#16271F] border border-stone-200 dark:border-[#D4AF37]/30 text-stone-700 dark:text-[#F3E5AB] hover:scale-105 transition-transform"
                  title={language === 'es' ? 'Avisos pendientes' : 'Pending notifications'}
                >
                  <Bell className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold text-[9px] flex items-center justify-center">
                    8
                  </span>
                </button>

                {/* Edit Profile Button */}
                <button
                  onClick={() => setActiveTab('pet_profile')}
                  className="p-2 rounded-full bg-amber-500/15 dark:bg-[#D4AF37]/20 border border-amber-500/30 dark:border-[#D4AF37]/40 text-amber-900 dark:text-[#F3E5AB] hover:scale-105 transition-transform"
                  title={language === 'es' ? 'Editar perfil de mascota' : 'Edit pet profile'}
                >
                  <Edit3 className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                </button>
              </div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
              
              {/* Luxury Circular Avatar with 1px Metallic Ring & Soft Halo */}
              <div className="relative shrink-0 group cursor-pointer" onClick={() => setActiveTab('pet_profile')}>
                <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-full p-1 bg-gradient-to-tr from-[#B8860B]/60 via-[#D4AF37] to-[#F3E5AB] dark:from-[#D4AF37]/80 dark:via-[#F3E5AB]/40 dark:to-emerald-500/50 shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden bg-stone-100 dark:bg-stone-900 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80" 
                      alt={selectedPet.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </div>
              </div>

              {/* Pet Name, Breed, Age & Badges */}
              <div className="space-y-1.5 text-center sm:text-left min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-[#F3E5AB]">
                    {selectedPet.name === 'Sir Leopold de Bordeaux' ? 'Charlie' : selectedPet.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-900 dark:bg-[#D4AF37]/20 dark:text-[#F3E5AB] border border-amber-500/25 dark:border-[#D4AF37]/40 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-[#B8860B] dark:text-[#D4AF37]" />
                    {theme === 'dark' ? (language === 'es' ? 'Miembro Premium' : 'Premium Member') : (
                      language === 'es' ? 'Vitalidad & Nutrición Óptima' : 'Optimal Vitality'
                    )}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
                  <span className="font-semibold">{selectedPet.breed || 'Golden Retriever'}</span>
                  <span className="text-stone-400">|</span>
                  <span>{selectedPet.ageYears || 3} {t('ageYears')}</span>
                  <span className="text-stone-400">|</span>
                  <span>{selectedPet.weightKg} kg</span>
                  <span className="text-stone-400">|</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    BCS {selectedPet.bodyConditionScore || 5}/9
                  </span>
                </p>

                {/* Energy RER / MER quick indicator */}
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-[#16271F] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 text-[11px] font-mono">
                    <strong>RER:</strong> {rerVal} kcal
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 dark:bg-[#D4AF37]/15 text-amber-900 dark:text-[#F3E5AB] border border-amber-500/25 dark:border-[#D4AF37]/35 text-[11px] font-mono font-bold">
                    <strong>MER:</strong> {merData.mer} kcal/{language === 'es' ? 'día' : 'day'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-500/25 dark:border-emerald-500/35 text-[11px] font-mono font-bold">
                    <strong>Ración:</strong> {merData.dailyFoodGrams} g/{language === 'es' ? 'día' : 'day'}
                  </span>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 2. SUB-TABS NAVIGATION BAR (MATCHING REFERENCE IMAGE 1)                     */}
        {/* < [ HEALTH OVERVIEW ]  [ DIET PLAN ]  [ HABIT TRACKER ] >                   */}
        {/* ========================================================================= */}
        <section className="flex items-center justify-center gap-2 py-1" id="sub-tabs-bar">
          <button 
            onClick={() => {
              const nextTab = activeSubTab === 'overview' ? 'habits' : activeSubTab === 'diet' ? 'overview' : 'diet';
              setActiveSubTab(nextTab);
            }}
            className="p-2 rounded-full border border-stone-200 dark:border-[#D4AF37]/30 text-stone-600 dark:text-[#F3E5AB] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={language === 'es' ? 'Pestaña anterior' : 'Previous tab'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-stone-100/90 dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/25 shadow-xs overflow-x-auto max-w-full">
            {subTabs.map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-[#1C2F25] text-stone-900 dark:text-[#F3E5AB] shadow-sm border border-stone-200 dark:border-[#D4AF37]/50 scale-102'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => {
              const nextTab = activeSubTab === 'overview' ? 'diet' : activeSubTab === 'diet' ? 'habits' : 'overview';
              setActiveSubTab(nextTab);
            }}
            className="p-2 rounded-full border border-stone-200 dark:border-[#D4AF37]/30 text-stone-600 dark:text-[#F3E5AB] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={language === 'es' ? 'Siguiente pestaña' : 'Next tab'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>

        {/* ========================================================================= */}
        {/* 3. TODAY'S HABITS: BENTO GRID WITH CIRCULAR GAUGES (IMAGE 1 & IMAGE 2)     */}
        {/* ========================================================================= */}
        <section className="space-y-4" id="section-todays-habits">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
                {theme === 'dark' 
                  ? (language === 'es' ? "Today's Habits • Monitor de Hábitos" : "Today's Habits")
                  : (language === 'es' ? "TODAY'S HABITS • Hábitos de Hoy" : "TODAY'S HABITS")}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {theme === 'dark' 
                  ? (language === 'es' ? 'Nov 14, 2026 • Registro en tiempo real de hidratación y paseos.' : 'Nov 14, 2026 • Real-time habit and diet tracking.')
                  : (language === 'es' ? 'Monitoreo de agua fresca, caldos bioactivos con colágeno y actividad física.' : 'Real-time monitoring of hydration and physical activity.')}
              </p>
            </div>
          </div>

          {/* Bento Grid: 2 Large Circular Ring Cards Matching Image 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* HABIT RING 1: WATER INTAKE (1.6 L / 2.5 L - 65%) */}
            <div className="rounded-[26px] p-6 backdrop-blur-xl border transition-all duration-300 shadow-[0_10px_30px_rgba(200,160,100,0.1)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.5)] bg-white/95 dark:bg-[#112019]/95 border-[#E8DCCB] dark:border-[#D4AF37]/25 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <Droplet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                        {language === 'es' ? 'Consumo de Agua' : 'Water Intake'}
                      </h3>
                      <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                        {language === 'es' ? 'Agua fresca + Caldo de huesos' : 'Fresh water + Collagen broth'}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/30 font-mono">
                    {hydrationPct}%
                  </span>
                </div>

                {/* Circular Ring Graphic Matching Image 1 */}
                <div className="flex flex-col items-center justify-center py-4">
                  
                  {/* SVG Circular Progress Dial */}
                  <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      {/* Background Track */}
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        strokeWidth="10"
                        className="text-stone-200 dark:text-stone-800/80 fill-none"
                        stroke="currentColor"
                      />
                      {/* Gradient Active Stroke */}
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - hydrationPct / 100)}
                        strokeLinecap="round"
                        className="text-[#B8860B] dark:text-[#D4AF37] fill-none transition-all duration-700 ease-out"
                        stroke="currentColor"
                      />
                    </svg>
                    
                    {/* Center Value */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                      <Droplet className="w-4 h-4 text-blue-500 dark:text-[#D4AF37] mb-1" />
                      <span className="font-editorial text-3xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                        {hydrationLiters} L
                      </span>
                      <span className="text-[11px] font-bold text-stone-400 dark:text-stone-400">
                        / {targetHydrationLiters} L
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#D4AF37] mt-1">
                        {hydrationPct}%
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300 mt-2">
                    WATER INTAKE
                  </span>
                </div>
              </div>

              {/* Quick Log Action Pills */}
              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold text-stone-400">
                  {language === 'es' ? 'Añadir toma:' : 'Quick log:'}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleQuickAddWater(0.25)}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors"
                  >
                    +0.25 L {language === 'es' ? 'Agua' : 'Water'}
                  </button>
                  <button
                    onClick={() => handleQuickAddBroth(0.25)}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 dark:bg-[#D4AF37]/20 dark:hover:bg-[#D4AF37]/30 text-amber-900 dark:text-[#F3E5AB] border border-amber-500/30 dark:border-[#D4AF37]/40 transition-colors"
                  >
                    +0.25 L {language === 'es' ? 'Caldo' : 'Broth'}
                  </button>
                </div>
              </div>

            </div>

            {/* HABIT RING 2: WALK TIME (54 min / 60 min - 90%) */}
            <div className="rounded-[26px] p-6 backdrop-blur-xl border transition-all duration-300 shadow-[0_10px_30px_rgba(200,160,100,0.1)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.5)] bg-white/95 dark:bg-[#112019]/95 border-[#E8DCCB] dark:border-[#D4AF37]/25 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <Footprints className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                        {language === 'es' ? 'Tiempo de Paseo' : 'Walk Time'}
                      </h3>
                      <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                        {language === 'es' ? 'Meta diaria de actividad física' : 'Daily exercise target'}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30 font-mono">
                    {walkPct}%
                  </span>
                </div>

                {/* Circular Ring Graphic Matching Image 1 */}
                <div className="flex flex-col items-center justify-center py-4">
                  
                  {/* SVG Circular Progress Dial */}
                  <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      {/* Background Track */}
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        strokeWidth="10"
                        className="text-stone-200 dark:text-stone-800/80 fill-none"
                        stroke="currentColor"
                      />
                      {/* Gradient Active Stroke */}
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - walkPct / 100)}
                        strokeLinecap="round"
                        className="text-emerald-600 dark:text-[#D4AF37] fill-none transition-all duration-700 ease-out"
                        stroke="currentColor"
                      />
                    </svg>
                    
                    {/* Center Value */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                      <Footprints className="w-4 h-4 text-emerald-600 dark:text-[#D4AF37] mb-1" />
                      <span className="font-editorial text-3xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                        {totalWalkMin} min
                      </span>
                      <span className="text-[11px] font-bold text-stone-400 dark:text-stone-400">
                        / {targetWalkMin} min
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#D4AF37] mt-1">
                        {walkPct}%
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300 mt-2">
                    WALK TIME
                  </span>
                </div>
              </div>

              {/* Quick Log Action Pills */}
              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold text-stone-400">
                  {language === 'es' ? 'Registrar paseo:' : 'Log walk:'}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleQuickAddWalk(15)}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors"
                  >
                    +15 min
                  </button>
                  <button
                    onClick={() => handleQuickAddWalk(30)}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors"
                  >
                    +30 min
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Dark Mode Specific Modules (Image 2): Morning Walk Toggle & Diet Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            
            {/* Morning Walk Card with Golden iOS-style toggle */}
            <div className="rounded-[26px] p-5 backdrop-blur-xl border transition-all duration-300 shadow-sm bg-white/90 dark:bg-[#112019]/90 border-[#E8DCCB] dark:border-[#D4AF37]/25 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Footprints className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-[#F3E5AB]">
                    {language === 'es' ? 'Paseo Matutino' : 'Morning Walk'}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    7:30 AM • 3/3 {language === 'es' ? 'Semanal' : 'Weekly'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold ${morningWalkCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400'}`}>
                  {morningWalkCompleted ? (language === 'es' ? 'Completado' : 'Completed') : (language === 'es' ? 'Pendiente' : 'Pending')}
                </span>
                <button
                  onClick={() => setMorningWalkCompleted(!morningWalkCompleted)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 flex items-center ${
                    morningWalkCompleted ? 'bg-[#B8860B] dark:bg-[#D4AF37] justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
                  }`}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md"></div>
                </button>
              </div>
            </div>

            {/* Diet & Hydration Checklist Card */}
            <div className="rounded-[26px] p-5 backdrop-blur-xl border transition-all duration-300 shadow-sm bg-white/90 dark:bg-[#112019]/90 border-[#E8DCCB] dark:border-[#D4AF37]/25 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-[#B8860B] dark:text-[#D4AF37]">
                  {language === 'es' ? 'Dieta & Tomas del Día' : 'Diet & Daily Servings'}
                </span>
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                  {language === 'es' ? 'Control diario' : 'Daily track'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button 
                  onClick={() => setMorningMealCompleted(!morningMealCompleted)}
                  className={`p-2 rounded-xl border flex items-center justify-between text-left transition-all ${
                    morningMealCompleted 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200' 
                      : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-600'
                  }`}
                >
                  <span className="truncate">{language === 'es' ? 'Desayuno (220g)' : 'Morning Meal (220g)'}</span>
                  {morningMealCompleted ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#D4AF37]" /> : <span className="w-3.5 h-3.5 rounded-full border border-stone-400"></span>}
                </button>

                <button 
                  onClick={() => setMorningWaterCompleted(!morningWaterCompleted)}
                  className={`p-2 rounded-xl border flex items-center justify-between text-left transition-all ${
                    morningWaterCompleted 
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-950 dark:text-blue-200' 
                      : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-600'
                  }`}
                >
                  <span className="truncate">{language === 'es' ? 'Agua (350ml)' : 'Water (350ml)'}</span>
                  {morningWaterCompleted ? <Check className="w-3.5 h-3.5 text-blue-600 dark:text-[#D4AF37]" /> : <span className="w-3.5 h-3.5 rounded-full border border-stone-400"></span>}
                </button>

                <button 
                  onClick={() => setMorningTreatCompleted(!morningTreatCompleted)}
                  className={`p-2 rounded-xl border flex items-center justify-between text-left transition-all ${
                    morningTreatCompleted 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-[#F3E5AB]' 
                      : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-600'
                  }`}
                >
                  <span className="truncate">{language === 'es' ? 'Snack Dental (1x)' : 'Dental Treat (1x)'}</span>
                  {morningTreatCompleted ? <Check className="w-3.5 h-3.5 text-amber-600 dark:text-[#D4AF37]" /> : <span className="w-3.5 h-3.5 rounded-full border border-stone-400"></span>}
                </button>

                <button 
                  onClick={() => setAfternoonMealCompleted(!afternoonMealCompleted)}
                  className={`p-2 rounded-xl border flex items-center justify-between text-left transition-all ${
                    afternoonMealCompleted 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200' 
                      : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-600'
                  }`}
                >
                  <span className="truncate">{language === 'es' ? 'Cena (200g)' : 'Afternoon Meal (200g)'}</span>
                  {afternoonMealCompleted ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#D4AF37]" /> : <span className="w-3.5 h-3.5 rounded-full border border-stone-400"></span>}
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. RECOMMENDED RECIPES: PHOTO BANNER CARD (MATCHING IMAGE 1)              */}
        {/* ========================================================================= */}
        <section className="space-y-4" id="section-recommended-recipes">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              {language === 'es' ? 'RECOMMENDED RECIPES • Recetas Recomendadas' : 'RECOMMENDED RECIPES'}
            </h2>
            <button
              onClick={() => setActiveTab('recipes')}
              className="text-xs font-bold text-[#B8860B] dark:text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              <span>{language === 'es' ? 'Ver catálogo' : 'View catalog'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hero Recipe Card matching Salmon & Quinoa Medley */}
          <div className="rounded-[26px] overflow-hidden backdrop-blur-xl border transition-all duration-300 shadow-[0_10px_30px_rgba(200,160,100,0.1)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.5)] bg-white/95 dark:bg-[#112019]/95 border-[#E8DCCB] dark:border-[#D4AF37]/25 group">
            
            {/* Top Culinary Food Image */}
            <div className="h-56 sm:h-64 w-full overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80" 
                alt="Salmon and Quinoa Medley"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Badge on Photo */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-stone-950/90 text-stone-900 dark:text-[#F3E5AB] backdrop-blur-md shadow-md border border-white/20">
                  ⭐ {language === 'es' ? 'Receta Estrella del Día' : 'Daily Star Recipe'}
                </span>
              </div>
            </div>

            {/* Recipe Content matching Image 1 typography */}
            <div className="p-6 sm:p-7 space-y-4">
              
              <div className="space-y-1.5">
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#B8860B] dark:text-[#F3E5AB]">
                  Salmon & Quinoa Medley
                </h3>
                
                {/* Pill Badges matching Image 1 */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-[#16271F] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                    Protein-Rich • Digestion Support
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-[#D4AF37]/15 text-amber-900 dark:text-[#F3E5AB] border border-amber-200 dark:border-[#D4AF37]/30">
                    ⏱ Preparation: 15 mins | Difficulty: Easy
                  </span>
                </div>
              </div>

              {/* Recipe Description Text */}
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {language === 'es' 
                  ? 'Una mezcla culinaria de salmón fresco noruego, quinoa real, espinacas orgánicas y arándanos silvestres rica en ácidos grasos omega-3, proteínas digestibles y antioxidantes naturales.'
                  : 'A premium blend of fresh salmon, whole quinoa, organic spinach, and blueberries packed with essential fatty acids, digestible proteins, and antioxidants.'}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200 dark:border-stone-800">
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  <strong>Ración diaria:</strong> {merData.dailyFoodGrams} g ({merData.mer} kcal)
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('recipes')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-[#B8860B] hover:bg-[#996515] dark:bg-[#D4AF37] dark:hover:bg-[#C59B27] text-white dark:text-stone-950 transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>{language === 'es' ? 'Ver Receta & Escalador' : 'View Recipe & Scaler'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleMarkMealCooked}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 transition-all flex items-center gap-1"
                    title={language === 'es' ? 'Marcar como cocinado' : 'Mark as cooked'}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{language === 'es' ? 'Cocinado' : 'Cooked'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CUSTOM REMINDER SOUND: AUDIO WAVEFORM & CHIME (MATCHING IMAGE 2)        */}
        {/* ========================================================================= */}
        <section className="space-y-4" id="section-audio-reminder">
          <div className="rounded-[26px] p-6 sm:p-7 backdrop-blur-xl border transition-all duration-300 shadow-[0_10px_30px_rgba(200,160,100,0.1)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.5)] bg-white/95 dark:bg-[#112019]/95 border-[#E8DCCB] dark:border-[#D4AF37]/25 space-y-4">
            
            {/* Header with Bell Icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-800 dark:text-[#D4AF37] border border-amber-500/20">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B8860B] dark:text-[#D4AF37] block">
                    CUSTOM REMINDER SOUND
                  </span>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                    It's Charlie's mealtime! 🥣 (7:00 PM)
                  </h3>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                {language === 'es' ? '7:00 PM • Diario' : '7:00 PM • Daily'}
              </span>
            </div>

            {/* Real Graphic Soundwave Equalizer */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1610] border border-stone-200 dark:border-stone-800/80 flex items-center justify-center gap-1.5 h-16">
              <div className={`w-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] transition-all ${isPlayingSoundwave ? 'animate-soundwave-1' : 'h-3 opacity-50'}`}></div>
              <div className={`w-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] transition-all ${isPlayingSoundwave ? 'animate-soundwave-2' : 'h-6 opacity-60'}`}></div>
              <div className={`w-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] transition-all ${isPlayingSoundwave ? 'animate-soundwave-3' : 'h-10 opacity-80'}`}></div>
              <div className={`w-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] transition-all ${isPlayingSoundwave ? 'animate-soundwave-4' : 'h-12 opacity-100'}`}></div>
              <div className={`w-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] transition-all ${isPlayingSoundwave ? 'animate-soundwave-5' : 'h-8 opacity-70'}`}></div>
              <div className={`w-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] transition-all ${isPlayingSoundwave ? 'animate-soundwave-6' : 'h-5 opacity-50'}`}></div>
              <div className={`w-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] transition-all ${isPlayingSoundwave ? 'animate-soundwave-7' : 'h-9 opacity-80'}`}></div>
              <div className={`w-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] transition-all ${isPlayingSoundwave ? 'animate-soundwave-8' : 'h-4 opacity-40'}`}></div>
            </div>

            {/* Action Button: Listen & Track */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {language === 'es' ? 'Tono acústico armónico sintetizado con Web Audio API.' : 'Harmonic chime alarm tuned for pet auditory comfort.'}
              </p>

              <button
                onClick={handleTestSoundwave}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4AF37] hover:from-[#996515] hover:to-[#C59B27] text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-102"
              >
                <Volume2 className="w-4 h-4" />
                <span>{language === 'es' ? 'Escuchar Tono (Listen & Track)' : 'Listen & Track'}</span>
              </button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. MINI CALENDAR WIDGET (MATCHING IMAGE 2)                                 */}
        {/* ========================================================================= */}
        <section className="space-y-4" id="section-calendar-widget">
          <div className="rounded-[26px] p-6 backdrop-blur-xl border transition-all duration-300 shadow-[0_10px_30px_rgba(200,160,100,0.1)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.5)] bg-white/95 dark:bg-[#112019]/95 border-[#E8DCCB] dark:border-[#D4AF37]/25 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
                <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                  November 2026 • {language === 'es' ? 'Registro de Hábitos' : 'Habits Calendar'}
                </h3>
              </div>

              <button 
                onClick={() => setActiveTab('agenda')}
                className="text-xs font-bold text-[#B8860B] dark:text-[#D4AF37] hover:underline"
              >
                {language === 'es' ? 'Abrir Agenda Completa' : 'Open Full Agenda'} →
              </button>
            </div>

            {/* Calendar Days Row */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase">
                  {d}
                </div>
              ))}
              
              {[10, 11, 12, 13, 14, 15, 16].map((day, idx) => {
                const isSelected = day === selectedCalendarDay;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedCalendarDay(day)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold shadow-md scale-105'
                        : 'bg-stone-50 dark:bg-[#0E1A14] text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#16271F]'
                    }`}
                  >
                    <span className="text-xs">{day}</span>
                    <div className="flex items-center gap-0.5 mt-1">
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white dark:bg-stone-950' : 'bg-emerald-500'}`}></span>
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white dark:bg-stone-950' : 'bg-[#D4AF37]'}`}></span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#0A1610] border border-stone-200 dark:border-stone-800 text-xs flex items-center justify-between text-stone-600 dark:text-stone-300">
              <span className="font-semibold">
                {selectedCalendarDay} Nov • {language === 'es' ? 'Paseo 7:30 AM • Cena 7:00 PM • Hidratación 1.6L' : 'Walk 7:30 AM • Meal 7:00 PM • Hydration 1.6L'}
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                ✓ {language === 'es' ? 'Al Día' : 'Completed'}
              </span>
            </div>

          </div>
        </section>

      </div>

      {/* Add Pet Modal */}
      {showAddModal && <AddPetModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
