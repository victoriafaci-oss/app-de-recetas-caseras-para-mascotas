import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMER, getConditionClinicalAlerts } from '../utils/nutrition';
import { RECIPES_CATALOG } from '../data/mockData';
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
  AlertTriangle
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
    showToast
  } = useApp();

  const [showEditModal, setShowEditModal] = useState(false);
  
  // Walk logger state
  const [showWalkForm, setShowWalkForm] = useState(false);
  const [walkDuration, setWalkDuration] = useState(35);
  const [walkDistance, setWalkDistance] = useState(2.5);
  const [walkNotes, setWalkNotes] = useState('');
  const [walkTime, setWalkTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Weight logger state
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [newWeight, setNewWeight] = useState(selectedPet.weightKg);
  const [weightNote, setWeightNote] = useState('');

  if (!selectedPet) return null;

  const merData = calculateMER(selectedPet);
  const clinicalData = getConditionClinicalAlerts(selectedPet.clinicalCondition, selectedPet.species);

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
      notes: walkNotes || 'Paseo regular registrado en el atelier.',
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
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 shrink-0">Ficha de:</span>
          {pets.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPet(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                p.id === selectedPet.id
                  ? 'bg-emerald-800 dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>{p.avatarIcon || (p.species === 'dog' ? '🐕' : '🐈')}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Ficha</span>
          </button>
          {pets.length > 1 && (
            <button
              onClick={() => deletePet(selectedPet.id)}
              className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Eliminar este perfil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
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

      {/* SECTION 2: MONITOR DE HÁBITOS DIARIOS */}
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

      {/* SECTION 4: RECETAS SUGERIDAS ADAPTADAS */}
      <section className="space-y-4" id="section-suggested-recipes">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-500" />
            <h2 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              Recetas de Haute Cuisine Adaptadas
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('recipes')}
            className="text-xs text-emerald-800 dark:text-[#D4AF37] font-semibold hover:underline"
          >
            Ver Recetario Completo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="rounded-2xl p-5 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4AF37]">
                  {recipe.categoryLabel}
                </span>
                <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB] leading-snug mt-1">
                  {recipe.title}
                </h3>
                <p className="text-xs text-stone-700 dark:text-stone-300 line-clamp-2 mt-1">
                  {recipe.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-400">
                  ~{merData.dailyFoodGrams}g ración/día
                </span>
                <button
                  onClick={() => handleCookRecipe(recipe)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-700 hover:bg-amber-800 dark:bg-[#D4AF37] dark:hover:bg-[#E5C358] text-white dark:text-stone-950 transition-colors shadow-xs flex items-center gap-1"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Cocinar</span>
                </button>
              </div>
            </div>
          ))}
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
    </div>
  );
};
