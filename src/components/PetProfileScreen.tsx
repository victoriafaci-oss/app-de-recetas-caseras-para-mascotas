import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMER, getConditionClinicalAlerts } from '../utils/nutrition';
import { RECIPES_CATALOG } from '../data/mockData';
import { getCurrentWeekDates, generateDailyDietPlan } from '../utils/dietPlanner';
import { playLuxuryChime } from '../utils/alertsAndAudio';
import { AddPetModal } from './AddPetModal';
import { 
  HeartPulse, 
  Droplet, 
  Flame, 
  Utensils, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Scale, 
  Footprints, 
  Bath, 
  ShieldAlert, 
  ChefHat, 
  CheckCircle, 
  Info,
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  XCircle,
  X,
  Check,
  CalendarRange,
  ChevronRight
} from 'lucide-react';

export const PetProfileScreen: React.FC = () => {
  const { 
    selectedPet, 
    pets, 
    selectPet, 
    deletePet, 
    addWaterMl, 
    addBrothMl, 
    resetHydration, 
    addWalkRecord, 
    addWeightRecord, 
    recordBathToday, 
    recordCookedMeal, 
    customRecipes,
    setActiveTab,
    showToast,
    language,
    getTrackingForDay,
    setMealStatus
  } = useApp();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  
  // Walk logger state
  const [showWalkForm, setShowWalkForm] = useState(false);
  const [walkDuration, setWalkDuration] = useState(35);
  const [walkDistance, setWalkDistance] = useState(2.5);
  const [walkNotes, setWalkNotes] = useState('');
  const [walkTime, setWalkTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Weight logger state
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [newWeight, setNewWeight] = useState(selectedPet?.weightKg || 10);
  const [weightNote, setWeightNote] = useState('');

  // Inspect Recipe modal state for daily suggested dishes
  const [inspectingRecipe, setInspectingRecipe] = useState<{
    type: 'dish1' | 'dish2' | 'dessert1' | 'snack1';
    typeLabel: string;
    typeIcon: string;
    badgeColor: string;
    title: string;
    description: string;
    portion: string;
    kcal: number;
    ingredients: any[];
    instructions: string[];
    clinicalBenefits?: string[];
    chefTip?: string;
  } | null>(null);

  if (!selectedPet) return null;

  const merData = calculateMER(selectedPet);
  const clinicalData = getConditionClinicalAlerts(selectedPet.clinicalCondition, selectedPet.species);

  // Today's dates and daily diet recommendations adapted strictly to this pet's profile
  const weekDates = getCurrentWeekDates();
  const todayDateObj = weekDates.find(d => d.isToday) || weekDates[0];
  const todayPlan = generateDailyDietPlan(selectedPet, todayDateObj.dateStr, todayDateObj.dayIndex, language);
  const todayTracking = getTrackingForDay(selectedPet.id, todayDateObj.dateStr);

  // Bath calculation
  const lastBath = new Date(selectedPet.lastBathDate || Date.now());
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastBath.getTime()) / (1000 * 3600 * 24));
  const bathDueIn = Math.max(0, (selectedPet.bathFrequencyDays || 21) - diffDays);
  const isBathOverdue = diffDays > (selectedPet.bathFrequencyDays || 21);

  // Hydration math
  const totalHydration = (selectedPet.todayWaterMl || 0) + (selectedPet.todayBrothMl || 0);
  const hydrationPct = Math.min(100, Math.round((totalHydration / merData.waterTargetMl) * 100));

  // Combined recipes matching species & condition
  const allRecipes = [...RECIPES_CATALOG, ...customRecipes];
  const suggestedRecipes = allRecipes.filter(r => 
    (r.species === 'both' || r.species === selectedPet.species)
  ).slice(0, 3);

  const handleWalkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWalkRecord(selectedPet.id, {
      durationMin: Number(walkDuration),
      distanceKm: Number(walkDistance),
      notes: walkNotes || (language === 'es' ? 'Paseo regular registrado.' : 'Regular walk recorded.'),
      time: walkTime || '10:00',
    });
    setWalkNotes('');
    setShowWalkForm(false);
  };

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWeightRecord(selectedPet.id, Number(newWeight), weightNote || 'Control de peso');
    setWeightNote('');
    setShowWeightForm(false);
  };

  const handleCookRecipe = (recipe: typeof RECIPES_CATALOG[0]) => {
    recordCookedMeal(selectedPet.id, {
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      daysPrepared: 1,
      totalGrams: merData.dailyFoodGrams,
      totalKcal: merData.mer,
    });
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Top Pet Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 shrink-0">
            {language === 'es' ? 'Ficha de:' : 'Profile of:'}
          </span>
          {pets.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPet(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                p.id === selectedPet.id
                  ? 'bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs ring-1 ring-[#D4AF37]'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>{p.avatarIcon || (p.species === 'dog' ? '🐕' : '🐈')}</span>
              <span>{p.name}</span>
            </button>
          ))}

          {pets.length < 4 && (
            <button
              onClick={() => setShowAddPetModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-[#B8860B] dark:text-[#F3E5AB] border border-dashed border-[#B8860B]/40 hover:bg-amber-500/20 transition-all shrink-0"
              title={language === 'es' ? 'Crear perfil' : 'Create profile'}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'es' ? '+ Crear perfil' : '+ Create'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
            <span>{language === 'es' ? 'Editar Ficha' : 'Edit'}</span>
          </button>
          
          <button
            onClick={() => setShowDeleteConfirmModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title={language === 'es' ? `Borrar perfil de ${selectedPet.name}` : `Delete ${selectedPet.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'es' ? 'Borrar perfil' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {/* Main Pet Banner with Avatar & Identity */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white to-stone-50 dark:from-[#121B15] dark:to-[#0A0F0D] border border-stone-200 dark:border-[#D4AF37]/30 shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* Avatar Picture */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden p-1 bg-gradient-to-br from-amber-500 via-[#D4AF37] to-emerald-600 shadow-xl">
              {selectedPet.avatarUrl ? (
                <img
                  src={selectedPet.avatarUrl}
                  alt={selectedPet.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[20px]"
                />
              ) : (
                <div className="w-full h-full bg-stone-900 rounded-[20px] flex items-center justify-center text-4xl">
                  {selectedPet.avatarIcon || (selectedPet.species === 'dog' ? '🐕' : '🐈')}
                </div>
              )}
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-900 text-[#D4AF37] border border-[#D4AF37]/40 shadow-md">
              {selectedPet.avatarIcon} {selectedPet.species === 'dog' ? 'Canino' : 'Felino'}
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${clinicalData.badgeColor}`}>
                {clinicalData.badgeLabel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {selectedPet.isNeutered ? 'Esterilizado/a' : 'Entero/a'}
              </span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-4xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              {selectedPet.name}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
              {selectedPet.breed} &bull; {selectedPet.ageYears} años {selectedPet.ageMonths > 0 ? `y ${selectedPet.ageMonths} meses` : ''} &bull; Sexo: {selectedPet.gender === 'male' ? 'Macho' : 'Hembra'}
            </p>

            {selectedPet.allergies && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20 text-xs font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Restricciones: {selectedPet.allergies}</span>
              </div>
            )}
          </div>

          {/* Summary Key Targets Card */}
          <div className="w-full md:w-auto shrink-0 p-4 rounded-2xl bg-stone-100/80 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800 text-xs space-y-2.5 min-w-[220px]">
            <div className="flex justify-between items-center">
              <span className="text-stone-700 dark:text-stone-300">Peso actual:</span>
              <span className="font-bold text-stone-900 dark:text-[#F3E5AB] text-sm">{selectedPet.weightKg} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-700 dark:text-stone-300">Peso meta:</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-400">{selectedPet.targetWeightKg} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-700 dark:text-stone-300">Condición Corporal:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">BCS {selectedPet.bodyConditionScore}/9</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-stone-200 dark:border-stone-800">
              <span className="text-stone-700 dark:text-stone-300">Gasto RER:</span>
              <span className="font-bold text-amber-700 dark:text-[#D4AF37]">{merData.rer} kcal/día</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 1: RECOMENDACIÓN NUTRICIONAL DIARIA (RER & MER FORMULAS) */}
      <section className="space-y-4" id="section-nutritional-recommendation">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-amber-500" />
          <h2 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
            Recomendación Nutricional Diaria de Precisión
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: RER & MER Energetics */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/25 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4AF37]">
                Energía & Metabolismo
              </span>
              <Flame className="w-5 h-5 text-amber-500" />
            </div>

            <div>
              <div className="text-3xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                {merData.mer} <span className="text-base font-normal text-stone-700 dark:text-stone-300">kcal/día</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                Gasto Energético de Mantenimiento (MER)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800 text-xs space-y-1.5 font-mono">
              <div className="text-[11px] text-stone-700 dark:text-stone-300">
                • RER = 70 × ({selectedPet.weightKg}^0.75) = <strong>{merData.rer} kcal</strong>
              </div>
              <div className="text-[11px] text-stone-700 dark:text-stone-300">
                • Factor MER = <strong>×{merData.multiplier}</strong> ({merData.multiplierReason})
              </div>
            </div>
          </div>

          {/* Card 2: Daily Homemade Food Grams & Portions */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-emerald-600/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Comida Casera al Día
              </span>
              <ChefHat className="w-5 h-5 text-emerald-500" />
            </div>

            <div>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-400">
                ~{merData.dailyFoodGrams} <span className="text-base font-normal text-stone-700 dark:text-stone-300">gramos/día</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                Alimento húmedo casero equilibrado (~1.35 kcal/g)
              </p>
            </div>

            {/* Meal portions */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-300">
                <span className="block font-bold">☀️ Desayuno:</span>
                <span className="text-sm font-extrabold">{merData.mealPortions.breakfastGrams} g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-300">
                <span className="block font-bold">🌙 Cena:</span>
                <span className="text-sm font-extrabold">{merData.mealPortions.dinnerGrams} g</span>
              </div>
            </div>
          </div>

          {/* Card 3: Macronutrient Split Ratio */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Distribución de Macronutrientes
              </span>
              <Scale className="w-5 h-5 text-blue-500" />
            </div>

            {/* Split Bar */}
            <div className="space-y-2 text-xs">
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-200 dark:bg-stone-800">
                <div style={{ width: `${merData.macronutrientSplit.proteinPct}%` }} className="bg-amber-500 h-full" title="Proteína"></div>
                <div style={{ width: `${merData.macronutrientSplit.fatPct}%` }} className="bg-emerald-500 h-full" title="Grasas Nobles"></div>
                <div style={{ width: `${merData.macronutrientSplit.fiberCarbsPct}%` }} className="bg-blue-500 h-full" title="Fibra/Carbs"></div>
              </div>

              <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-bold">
                <span className="text-amber-800 dark:text-amber-400">🥩 Prot: {merData.macronutrientSplit.proteinPct}%</span>
                <span className="text-emerald-800 dark:text-emerald-400">🥑 Grasas: {merData.macronutrientSplit.fatPct}%</span>
                <span className="text-blue-800 dark:text-blue-400">🥦 Fibra: {merData.macronutrientSplit.fiberCarbsPct}%</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-700 dark:text-stone-300 italic">
              {merData.macronutrientSplit.notes}
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 2: RECETAS CASERAS ADAPTADAS DEL DÍA (2 COMPLETAS + 1 POSTRE + 1 SNACK) */}
      <section className="space-y-4" id="section-suggested-recipes">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 dark:from-[#16271F] dark:to-[#121B15] border border-amber-500/20 dark:border-[#D4AF37]/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#D4AF37] flex items-center justify-center font-bold">
                <ChefHat className="w-4 h-4" />
              </div>
              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                {language === 'es' ? 'Recetas Caseras Adaptadas' : 'Adapted Homemade Recipes'}
              </h2>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 font-semibold text-stone-900 dark:text-stone-100">
                <Calendar className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                {todayDateObj.dayNameEs}, {todayDateObj.dateFormatted}
              </span>
              <span className="text-stone-400">•</span>
              <span>
                {language === 'es' 
                  ? `Adaptado al perfil de ${selectedPet.name} (${selectedPet.weightKg} kg, ${selectedPet.ageYears < 1 ? 'Cachorro/Gatito' : selectedPet.ageYears >= 7 ? 'Senior' : 'Adulto'}): 2 recetas completas, 1 postre y 1 snack`
                  : `Adapted to ${selectedPet.name}'s profile (${selectedPet.weightKg} kg): 2 meals, 1 dessert, 1 snack`}
              </span>
            </p>
          </div>

          <button
            onClick={() => setActiveTab('weekly_plan')}
            id="profile-btn-view-weekly-plan"
            className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-white dark:bg-[#16271F] border border-[#D4AF37]/40 text-[#B8860B] dark:text-[#D4AF37] hover:bg-[#B8860B] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-stone-950 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <CalendarRange className="w-4 h-4" />
            <span>{language === 'es' ? 'Ver Plan Semanal (7 Días)' : 'Full 7-Day Plan'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* The 4 Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. RECETA COMPLETA 1 (ALMUERZO) */}
          <div 
            className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3.5 ${
              todayTracking.dish1Given === true
                ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 dark:border-emerald-500/30 shadow-xs'
                : todayTracking.dish1Given === false
                ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30 shadow-xs'
                : 'bg-white dark:bg-[#121B15] border-stone-200 dark:border-[#D4AF37]/25 shadow-sm hover:border-[#D4AF37]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#B8860B]/15 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#F3E5AB]">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Receta Completa 1: Almuerzo' : 'Complete Meal 1: Lunch'}</span>
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                  {todayPlan.dish1.portionGrams}g • {todayPlan.dish1.kcal} kcal
                </span>
              </div>

              <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB] leading-snug">
                {todayPlan.dish1.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                {todayPlan.dish1.description}
              </p>

              {/* Ingredients preview */}
              <div className="mt-2.5 flex flex-wrap gap-1">
                {todayPlan.dish1.ingredients.slice(0, 3).map((ing, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {ing.name} ({ing.grams}g)
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
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
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-stone-900 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-stone-900 dark:text-[#F3E5AB] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-101"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                <span>{language === 'es' ? 'Ver Receta & Preparación 📖' : 'View Recipe & Method'}</span>
              </button>

              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dish1', true);
                    playLuxuryChime();
                    showToast(language === 'es' ? '✅ ¡Plato 1 marcado como hecho hoy (OK)!' : '✅ Meal 1 marked as done today!');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    todayTracking.dish1Given === true
                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 hover:text-emerald-900'
                  }`}
                  title={language === 'es' ? 'Dar OK si se ha cocinado/dado hoy' : 'Give OK if served today'}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{todayTracking.dish1Given === true ? (language === 'es' ? 'Hecha ✅' : 'Done ✅') : (language === 'es' ? 'Dar OK' : 'OK')}</span>
                </button>

                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dish1', false);
                    showToast(language === 'es' ? '🔴 Marcada como no hecha' : '🔴 Marked as not done');
                  }}
                  className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    todayTracking.dish1Given === false
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-rose-600'
                  }`}
                  title={language === 'es' ? 'Marcar como no hecha' : 'Mark as not done'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. RECETA COMPLETA 2 (CENA) */}
          <div 
            className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3.5 ${
              todayTracking.dish2Given === true
                ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 dark:border-emerald-500/30 shadow-xs'
                : todayTracking.dish2Given === false
                ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30 shadow-xs'
                : 'bg-white dark:bg-[#121B15] border-stone-200 dark:border-[#D4AF37]/25 shadow-sm hover:border-[#D4AF37]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/15 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Receta Completa 2: Cena' : 'Complete Meal 2: Dinner'}</span>
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                  {todayPlan.dish2.portionGrams}g • {todayPlan.dish2.kcal} kcal
                </span>
              </div>

              <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB] leading-snug">
                {todayPlan.dish2.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                {todayPlan.dish2.description}
              </p>

              {/* Ingredients preview */}
              <div className="mt-2.5 flex flex-wrap gap-1">
                {todayPlan.dish2.ingredients.slice(0, 3).map((ing, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {ing.name} ({ing.grams}g)
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <button
                onClick={() => setInspectingRecipe({
                  type: 'dish2',
                  typeLabel: language === 'es' ? 'Receta Completa 2 (Cena)' : 'Complete Meal 2 (Dinner)',
                  typeIcon: '🌙',
                  badgeColor: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
                  title: todayPlan.dish2.title,
                  description: todayPlan.dish2.description,
                  portion: `${todayPlan.dish2.portionGrams}g`,
                  kcal: todayPlan.dish2.kcal,
                  ingredients: todayPlan.dish2.ingredients,
                  instructions: todayPlan.dish2.instructions,
                  clinicalBenefits: todayPlan.dish2.clinicalBenefits,
                  chefTip: todayPlan.dish2.chefTip
                })}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-stone-900 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-stone-900 dark:text-[#F3E5AB] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-101"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                <span>{language === 'es' ? 'Ver Receta & Preparación 📖' : 'View Recipe & Method'}</span>
              </button>

              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dish2', true);
                    playLuxuryChime();
                    showToast(language === 'es' ? '✅ ¡Cena marcada como hecha hoy (OK)!' : '✅ Dinner marked as done today!');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    todayTracking.dish2Given === true
                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 hover:text-emerald-900'
                  }`}
                  title={language === 'es' ? 'Dar OK si se ha cocinado/dado hoy' : 'Give OK if served today'}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{todayTracking.dish2Given === true ? (language === 'es' ? 'Hecha ✅' : 'Done ✅') : (language === 'es' ? 'Dar OK' : 'OK')}</span>
                </button>

                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dish2', false);
                    showToast(language === 'es' ? '🔴 Marcada como no hecha' : '🔴 Marked as not done');
                  }}
                  className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    todayTracking.dish2Given === false
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-rose-600'
                  }`}
                  title={language === 'es' ? 'Marcar como no hecha' : 'Mark as not done'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. POSTRE DIGESTIVO DEL DÍA */}
          <div 
            className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3.5 ${
              todayTracking.dessert1Given === true
                ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 dark:border-emerald-500/30 shadow-xs'
                : todayTracking.dessert1Given === false
                ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30 shadow-xs'
                : 'bg-white dark:bg-[#121B15] border-stone-200 dark:border-[#D4AF37]/25 shadow-sm hover:border-[#D4AF37]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Postre Digestivo del Día' : 'Digestive Dessert of the Day'}</span>
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                  {todayPlan.dessert1.portion} • ~{todayPlan.dessert1.kcal || 35} kcal
                </span>
              </div>

              <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB] leading-snug">
                {todayPlan.dessert1.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                {todayPlan.dessert1.description}
              </p>

              {/* Ingredients preview */}
              <div className="mt-2.5 flex flex-wrap gap-1">
                {todayPlan.dessert1.ingredients.slice(0, 3).map((ing, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <button
                onClick={() => setInspectingRecipe({
                  type: 'dessert1',
                  typeLabel: language === 'es' ? 'Postre Digestivo Saludable' : 'Healthy Digestive Dessert',
                  typeIcon: '🍮',
                  badgeColor: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
                  title: todayPlan.dessert1.title,
                  description: todayPlan.dessert1.description,
                  portion: todayPlan.dessert1.portion,
                  kcal: todayPlan.dessert1.kcal || 35,
                  ingredients: todayPlan.dessert1.ingredients,
                  instructions: todayPlan.dessert1.instructions,
                  clinicalBenefits: [
                    todayPlan.dessert1.benefits,
                    language === 'es' ? 'Aporte de glicina y probióticos para barrera gástrica' : 'Glycine and probiotics for gut wall support'
                  ],
                  chefTip: todayPlan.dessert1.chefTip
                })}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-stone-900 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-stone-900 dark:text-[#F3E5AB] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-101"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                <span>{language === 'es' ? 'Ver Receta & Preparación 📖' : 'View Recipe & Method'}</span>
              </button>

              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dessert1', true);
                    playLuxuryChime();
                    showToast(language === 'es' ? '✅ ¡Postre digestivo marcado como dado hoy (OK)!' : '✅ Digestive dessert marked as given today!');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    todayTracking.dessert1Given === true
                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 hover:text-emerald-900'
                  }`}
                  title={language === 'es' ? 'Dar OK si se ha preparado/dado hoy' : 'Give OK if served today'}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{todayTracking.dessert1Given === true ? (language === 'es' ? 'Hecho ✅' : 'Done ✅') : (language === 'es' ? 'Dar OK' : 'OK')}</span>
                </button>

                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, 'dessert1', false);
                    showToast(language === 'es' ? '🔴 Marcado como no hecho' : '🔴 Marked as not done');
                  }}
                  className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    todayTracking.dessert1Given === false
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-rose-600'
                  }`}
                  title={language === 'es' ? 'Marcar como no hecho' : 'Mark as not done'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. SNACK SALUDABLE DEL DÍA */}
          <div 
            className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3.5 ${
              todayTracking.snack1Given === true
                ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 dark:border-emerald-500/30 shadow-xs'
                : todayTracking.snack1Given === false
                ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30 shadow-xs'
                : 'bg-white dark:bg-[#121B15] border-stone-200 dark:border-[#D4AF37]/25 shadow-sm hover:border-[#D4AF37]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Snack Saludable del Día' : 'Healthy Snack of the Day'}</span>
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                  {todayPlan.snack1.portion} • ~{todayPlan.snack1.kcal || 30} kcal
                </span>
              </div>

              <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB] leading-snug">
                {todayPlan.snack1.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                {todayPlan.snack1.description}
              </p>

              {/* Ingredients preview */}
              <div className="mt-2.5 flex flex-wrap gap-1">
                {todayPlan.snack1.ingredients.slice(0, 3).map((ing, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <button
                onClick={() => setInspectingRecipe({
                  type: 'snack1',
                  typeLabel: language === 'es' ? 'Snack Natural Saludable' : 'Natural Healthy Snack',
                  typeIcon: '🦴',
                  badgeColor: 'bg-amber-500/20 text-amber-800 dark:text-amber-300',
                  title: todayPlan.snack1.title,
                  description: todayPlan.snack1.description,
                  portion: todayPlan.snack1.portion,
                  kcal: todayPlan.snack1.kcal || 30,
                  ingredients: todayPlan.snack1.ingredients,
                  instructions: todayPlan.snack1.instructions,
                  clinicalBenefits: [
                    todayPlan.snack1.benefits,
                    language === 'es' ? 'Recompensa 100% libre de aditivos y ultraprocesados' : '100% natural, additive-free reward'
                  ],
                  chefTip: todayPlan.snack1.chefTip
                })}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-stone-900 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-stone-900 dark:text-[#F3E5AB] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-101"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                <span>{language === 'es' ? 'Ver Receta & Preparación 📖' : 'View Recipe & Method'}</span>
              </button>

              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, 'snack1', true);
                    playLuxuryChime();
                    showToast(language === 'es' ? '✅ ¡Snack saludable marcado como dado hoy (OK)!' : '✅ Healthy snack marked as given today!');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    todayTracking.snack1Given === true
                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 hover:text-emerald-900'
                  }`}
                  title={language === 'es' ? 'Dar OK si se ha preparado/dado hoy' : 'Give OK if served today'}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{todayTracking.snack1Given === true ? (language === 'es' ? 'Hecho ✅' : 'Done ✅') : (language === 'es' ? 'Dar OK' : 'OK')}</span>
                </button>

                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, 'snack1', false);
                    showToast(language === 'es' ? '🔴 Marcado como no hecho' : '🔴 Marked as not done');
                  }}
                  className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    todayTracking.snack1Given === false
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-rose-600'
                  }`}
                  title={language === 'es' ? 'Marcar como no hecho' : 'Mark as not done'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: MONITOR DE HÁBITOS DIARIOS */}
      <section className="space-y-5" id="section-daily-habits">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <h2 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              Monitor de Hábitos Diarios
            </h2>
          </div>
          <span className="text-xs text-stone-700 dark:text-stone-300 font-medium">
            Seguimiento en tiempo real
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* HABIT 1: HIDRATACIÓN & CALDOS */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                    Hidratación & Caldos con Colágeno
                  </h3>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300">
                    Objetivo clínico: {merData.waterTargetMl} ml/día (~55ml/kg)
                  </p>
                </div>
              </div>

              <button
                onClick={() => resetHydration(selectedPet.id)}
                className="text-[11px] text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              >
                Reiniciar
              </button>
            </div>

            {/* Progress Bar & Counter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-stone-700 dark:text-stone-300">Consumido hoy:</span>
                <span className="text-stone-900 dark:text-[#F3E5AB]">
                  {totalHydration} ml / {merData.waterTargetMl} ml ({hydrationPct}%)
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${hydrationPct}%` }}
                ></div>
              </div>
            </div>

            {/* Quick-Add Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button
                onClick={() => addBrothMl(selectedPet.id, 150)}
                className="p-2.5 rounded-xl font-bold text-xs bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-[#D4AF37] border border-amber-500/30 transition-all text-center"
              >
                +150ml Caldo
              </button>
              <button
                onClick={() => addWaterMl(selectedPet.id, 200)}
                className="p-2.5 rounded-xl font-bold text-xs bg-blue-500/15 hover:bg-blue-500/25 text-blue-900 dark:text-blue-300 border border-blue-500/30 transition-all text-center"
              >
                +200ml Agua
              </button>
              <button
                onClick={() => addWaterMl(selectedPet.id, 100)}
                className="p-2.5 rounded-xl font-bold text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-800 dark:text-blue-400 border border-blue-500/20 transition-all text-center"
              >
                +100ml Agua
              </button>
              <button
                onClick={() => addBrothMl(selectedPet.id, 60)}
                className="p-2.5 rounded-xl font-bold text-xs bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30 transition-all text-center"
              >
                +60ml Infusión
              </button>
            </div>
          </div>

          {/* HABIT 2: HIGIENE / BAÑO Y PELUQUERÍA */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
                  <Bath className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                    Higiene, Baño & Manto
                  </h3>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300">
                    Ciclo recomendado: cada {selectedPet.bathFrequencyDays || 21} días
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                isBathOverdue 
                  ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30' 
                  : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
              }`}>
                {isBathOverdue ? 'Toca Baño' : 'Al Día'}
              </span>
            </div>

            {/* Days Counter */}
            <div className="flex items-center justify-around p-4 rounded-xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800 text-center">
              <div>
                <span className="text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">{diffDays}</span>
                <span className="block text-[10px] text-stone-700 dark:text-stone-300 uppercase tracking-wider font-semibold">Días desde el último</span>
              </div>
              <div className="w-px h-8 bg-stone-200 dark:bg-stone-800"></div>
              <div>
                <span className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">{bathDueIn}</span>
                <span className="block text-[10px] text-stone-700 dark:text-stone-300 uppercase tracking-wider font-semibold">Días para el próximo</span>
              </div>
            </div>

            <button
              onClick={() => recordBathToday(selectedPet.id)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Bath className="w-4 h-4" />
              <span>Registrar Baño / Spa Hoy</span>
            </button>
          </div>

          {/* HABIT 3: PASEOS & EJERCICIO */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                    Paseos & Actividad Física
                  </h3>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300">
                    Estilo de vida: {selectedPet.activityLevel}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWalkForm(!showWalkForm)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-900 dark:text-emerald-300 border border-emerald-600/30 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Registrar Paseo</span>
              </button>
            </div>

            {/* Walk Logger Form */}
            {showWalkForm && (
              <form onSubmit={handleWalkSubmit} className="p-4 rounded-xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800 space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">Duración (min)</label>
                    <input
                      type="number"
                      min="5"
                      max="300"
                      value={walkDuration}
                      onChange={(e) => setWalkDuration(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">Distancia (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="50"
                      value={walkDistance}
                      onChange={(e) => setWalkDistance(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">Hora</label>
                    <input
                      type="time"
                      value={walkTime}
                      onChange={(e) => setWalkTime(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">Notas de la ruta / Comportamiento</label>
                  <input
                    type="text"
                    placeholder="Ej. Parque con hierba, juegos de olfato, trote suave..."
                    value={walkNotes}
                    onChange={(e) => setWalkNotes(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWalkForm(false)}
                    className="px-3 py-1 text-stone-600 dark:text-stone-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    Guardar Paseo
                  </button>
                </div>
              </form>
            )}

            {/* Historical Walks List */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {selectedPet.walksHistory && selectedPet.walksHistory.length > 0 ? (
                selectedPet.walksHistory.slice(0, 3).map((w) => (
                  <div key={w.id} className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-[#F3E5AB]">
                        {w.durationMin} min &bull; {w.distanceKm} km
                      </div>
                      <div className="text-[11px] text-stone-700 dark:text-stone-300">
                        {w.notes}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-stone-600 dark:text-stone-400">
                      {w.date} {w.time}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-600 dark:text-stone-400 text-center py-3">
                  Aún no hay paseos registrados hoy.
                </p>
              )}
            </div>
          </div>

          {/* HABIT 4: CONTROL DE PESO & HISTÓRICO */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                    Control & Evolución de Peso
                  </h3>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300">
                    Meta: {selectedPet.targetWeightKg} kg &bull; Actual: {selectedPet.weightKg} kg
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWeightForm(!showWeightForm)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600/15 hover:bg-amber-600/25 text-amber-900 dark:text-[#D4AF37] border border-amber-600/30 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Pesar</span>
              </button>
            </div>

            {/* Weight Logger Form */}
            {showWeightForm && (
              <form onSubmit={handleWeightSubmit} className="p-4 rounded-xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">Nuevo Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="100"
                      value={newWeight}
                      onChange={(e) => setNewWeight(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">Nota clínica</label>
                    <input
                      type="text"
                      placeholder="Ej. Control mensual..."
                      value={weightNote}
                      onChange={(e) => setWeightNote(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWeightForm(false)}
                    className="px-3 py-1 text-stone-600 dark:text-stone-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold"
                  >
                    Actualizar Peso
                  </button>
                </div>
              </form>
            )}

            {/* SVG Weight Progression Visual Chart */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between text-[11px] text-stone-700 dark:text-stone-300 font-semibold mb-2">
                <span>Histórico de Peso (kg)</span>
                <span className="text-emerald-800 dark:text-emerald-400 font-bold">Meta: {selectedPet.targetWeightKg}kg</span>
              </div>

              {/* Simple Responsive SVG Chart */}
              <div className="h-24 w-full flex items-end justify-between gap-2 pt-2 px-1">
                {selectedPet.weightHistory.slice(-5).map((rec, i) => {
                  const maxW = Math.max(...selectedPet.weightHistory.map(w => w.weightKg), selectedPet.targetWeightKg + 1);
                  const minW = Math.min(...selectedPet.weightHistory.map(w => w.weightKg), selectedPet.targetWeightKg - 1);
                  const range = maxW - minW || 1;
                  const barHeightPct = Math.max(20, Math.min(100, Math.round(((rec.weightKg - minW) / range) * 100)));

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[10px] font-bold text-stone-900 dark:text-[#F3E5AB]">
                        {rec.weightKg}k
                      </span>
                      <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-t-lg h-14 relative flex items-end justify-center overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-amber-600 to-[#D4AF37] rounded-t-lg transition-all duration-300"
                          style={{ height: `${barHeightPct}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] text-stone-600 dark:text-stone-400 truncate max-w-[48px]">
                        {rec.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: ALERTAS CLÍNICAS RESTRICTIVAS */}
      <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 via-stone-50 to-emerald-500/5 dark:from-[#1A241D] dark:via-[#121B15] dark:to-[#0E1511] border border-amber-500/30 dark:border-[#D4AF37]/30 shadow-md space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-6 h-6 text-amber-700 dark:text-[#D4AF37]" />
          <div>
            <h2 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              {clinicalData.title}
            </h2>
            <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
              Protocolo veterinario de seguridad alimentaria para {selectedPet.name}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {clinicalData.alerts.map((alert, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/80 dark:bg-black/30 border border-stone-200 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 flex items-start gap-2.5 shadow-xs"
            >
              <CheckCircle className="w-4 h-4 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{alert}</span>
            </div>
          ))}
        </div>

        {/* Forbidden warning box */}
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{clinicalData.forbiddenAlert}</span>
        </div>
      </section>

      {/* Edit Pet Modal */}
      {showEditModal && (
        <AddPetModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          petToEdit={selectedPet}
        />
      )}

      {/* Create New Pet Modal */}
      {showAddPetModal && (
        <AddPetModal
          isOpen={showAddPetModal}
          onClose={() => setShowAddPetModal(false)}
        />
      )}

      {/* Recipe Inspection & Preparation Modal */}
      {inspectingRecipe && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 dark:from-[#16271F] dark:to-[#121B15] flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${inspectingRecipe.badgeColor}`}>
                    {inspectingRecipe.typeIcon} {inspectingRecipe.typeLabel}
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-stone-900 text-[#F3E5AB]">
                    {inspectingRecipe.portion} • ~{inspectingRecipe.kcal} kcal
                  </span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#F3E5AB] leading-tight">
                  {inspectingRecipe.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {inspectingRecipe.description}
                </p>
              </div>

              <button
                onClick={() => setInspectingRecipe(null)}
                className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-sm">
              
              {/* Pet Customization Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-[#D4AF37]/10 border border-amber-500/20 dark:border-[#D4AF37]/30 flex items-center gap-3">
                <ChefHat className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {language === 'es' ? `Ración calculada para ${selectedPet.name}: ` : `Calculated portion for ${selectedPet.name}: `}
                  </span>
                  <span className="text-stone-700 dark:text-stone-300">
                    {language === 'es' 
                      ? `${selectedPet.weightKg} kg de peso • MER diario ${merData.mer} kcal • Sin conservantes ni sal.` 
                      : `${selectedPet.weightKg} kg weight • Daily MER ${merData.mer} kcal • 100% natural.`}
                  </span>
                </div>
              </div>

              {/* 1. Ingredientes Pesados */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2 text-sm">
                  <Utensils className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                  <span>{language === 'es' ? '1. Ingredientes Pesados en Gramos' : '1. Weighed Ingredients'}</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {inspectingRecipe.ingredients.map((ing: any, i: number) => {
                    const isObject = typeof ing === 'object' && ing !== null;
                    const name = isObject ? ing.name : ing;
                    const grams = isObject ? ing.grams : null;
                    return (
                      <div 
                        key={i} 
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex items-center justify-between"
                      >
                        <span className="text-xs font-medium text-stone-800 dark:text-stone-200">
                          {name}
                        </span>
                        {grams !== null && (
                          <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            {grams}g
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Modo de Preparación Paso a Paso */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                  <span>{language === 'es' ? '2. Modo de Preparación Paso a Paso' : '2. Step-by-Step Preparation'}</span>
                </h4>

                <div className="space-y-2.5">
                  {inspectingRecipe.instructions.map((step: string, i: number) => (
                    <div 
                      key={i} 
                      className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#B8860B]/20 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Beneficios Clínicos */}
              {inspectingRecipe.clinicalBenefits && inspectingRecipe.clinicalBenefits.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>{language === 'es' ? `3. Beneficios Clínicos para ${selectedPet.name}` : `3. Clinical Benefits for ${selectedPet.name}`}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {inspectingRecipe.clinicalBenefits.map((b: string, i: number) => (
                      <span key={i} className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{b}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Tip del Chef Nutricionista */}
              {inspectingRecipe.chefTip && (
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-500/20 text-indigo-900 dark:text-indigo-300 text-xs flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{language === 'es' ? 'Consejo del Chef: ' : 'Chef Tip: '}</span>
                    <span>{inspectingRecipe.chefTip}</span>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer / Action Buttons */}
            <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#16271F]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 dark:text-stone-400">
                  {language === 'es' ? 'Estado de hoy:' : 'Today status:'}
                </span>
                {todayTracking[`${inspectingRecipe.type}Given` as keyof typeof todayTracking] === true ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold inline-flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {language === 'es' ? 'Hecha Hoy ✅' : 'Done Today ✅'}
                  </span>
                ) : todayTracking[`${inspectingRecipe.type}Given` as keyof typeof todayTracking] === false ? (
                  <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold inline-flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {language === 'es' ? 'No hecha 🔴' : 'Not done 🔴'}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold">
                    {language === 'es' ? 'Pendiente' : 'Pending'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, inspectingRecipe.type, false);
                    showToast(language === 'es' ? '🔴 Marcada como no hecha' : '🔴 Marked as not done');
                  }}
                  className="px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'No hecha' : 'Not done'}</span>
                </button>

                <button
                  onClick={() => {
                    setMealStatus(selectedPet.id, todayDateObj.dateStr, inspectingRecipe.type, true);
                    playLuxuryChime();
                    showToast(language === 'es' ? `✅ ¡${inspectingRecipe.title} marcada como hecha hoy (OK)!` : `✅ Done today!`);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'es' ? 'Dar OK / Hecha Hoy ✅' : 'Mark OK / Done Today ✅'}</span>
                </button>

                <button
                  onClick={() => setInspectingRecipe(null)}
                  className="px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 text-xs font-bold transition-colors"
                >
                  {language === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Pet Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                {language === 'es' ? '¿Borrar perfil de mascota?' : 'Delete pet profile?'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                {language === 'es' 
                  ? `Se eliminará la ficha de "${selectedPet.name}", su historial y sus registros médicos.` 
                  : `Profile of "${selectedPet.name}" will be deleted.`}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  deletePet(selectedPet.id);
                  setShowDeleteConfirmModal(false);
                  setActiveTab('home');
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition-colors"
              >
                {language === 'es' ? 'Sí, borrar' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
