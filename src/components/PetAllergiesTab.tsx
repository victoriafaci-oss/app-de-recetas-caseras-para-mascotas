import React, { useState, useEffect } from 'react';
import { Pet, DayDietPlan } from '../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  X, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Utensils, 
  Save, 
  RotateCcw,
  Heart
} from 'lucide-react';
import { COMMON_FOOD_ALLERGENS, parseAllergens } from '../utils/allergyUtils';

interface PetAllergiesTabProps {
  pet: Pet;
  language: 'es' | 'en';
  todayPlan: DayDietPlan;
  onUpdateAllergies: (newAllergies: string) => void;
  onOpenEditPetModal: () => void;
}

export const PetAllergiesTab: React.FC<PetAllergiesTabProps> = ({
  pet,
  language,
  todayPlan,
  onUpdateAllergies,
  onOpenEditPetModal,
}) => {
  const isEn = language === 'en';
  const initialAllergens = parseAllergens(pet.allergies);
  
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(initialAllergens);
  const [customInput, setCustomInput] = useState('');
  const [hasSavedChanges, setHasSavedChanges] = useState(false);

  useEffect(() => {
    setSelectedAllergens(parseAllergens(pet.allergies));
  }, [pet.id, pet.allergies]);

  const hasAllergies = selectedAllergens.length > 0;

  const handleToggleCommonAllergen = (name: string) => {
    setSelectedAllergens(prev => {
      const exists = prev.some(item => item.toLowerCase() === name.toLowerCase());
      if (exists) {
        return prev.filter(item => item.toLowerCase() !== name.toLowerCase());
      } else {
        return [...prev, name];
      }
    });
    setHasSavedChanges(false);
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!selectedAllergens.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedAllergens(prev => [...prev, trimmed]);
    }
    setCustomInput('');
    setHasSavedChanges(false);
  };

  const handleRemove = (nameToRemove: string) => {
    setSelectedAllergens(prev => prev.filter(item => item.toLowerCase() !== nameToRemove.toLowerCase()));
    setHasSavedChanges(false);
  };

  const handleClearAll = () => {
    setSelectedAllergens([]);
    onUpdateAllergies('Ninguna');
    setHasSavedChanges(true);
  };

  const handleSave = () => {
    const newStr = selectedAllergens.length > 0 ? selectedAllergens.join(', ') : 'Ninguna';
    onUpdateAllergies(newStr);
    setHasSavedChanges(true);
  };

  // Find recommended substitutes based on selected allergens
  const substituteCards = selectedAllergens.map(allergenStr => {
    const clean = allergenStr.toLowerCase().trim();
    const matchedDef = COMMON_FOOD_ALLERGENS.find(a => 
      a.keywords.some(k => clean.includes(k) || k.includes(clean))
    );

    if (matchedDef) {
      return {
        allergenName: matchedDef.nameEs,
        icon: matchedDef.icon,
        substitutes: isEn ? matchedDef.safeSubstitutesEn : matchedDef.safeSubstitutesEs,
      };
    }

    return {
      allergenName: allergenStr,
      icon: '🚫',
      substitutes: isEn 
        ? ['Lean turkey', 'Hypoallergenic rabbit', 'Steamed white fish', 'Sweet potato (Grain-Free)']
        : ['Pavo magro', 'Conejo hipoalergénico', 'Pescado blanco al vapor', 'Boniato / Calabaza (Grain-Free)'],
    };
  });

  return (
    <div className="space-y-6" id="pet-allergies-tab-content">
      
      {/* 1. Main Status Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm ${
        hasAllergies
          ? 'bg-white dark:bg-[#121B15] border-rose-500/40'
          : 'bg-white dark:bg-[#121B15] border-[#D4AF37]/30'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
              hasAllergies
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
            }`}>
              {hasAllergies ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  hasAllergies
                    ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                }`}>
                  {hasAllergies 
                    ? (isEn ? `${selectedAllergens.length} active restriction(s)` : `${selectedAllergens.length} restricción(es) activa(s)`)
                    : (isEn ? 'No food allergies' : 'Sin alergias alimentarias')}
                </span>
                <span className="text-xs text-stone-700 dark:text-stone-300">
                  {isEn ? 'Filter active on all menus' : 'Filtro activo en todos los menús'}
                </span>
              </div>

              <h3 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                {hasAllergies
                  ? (isEn ? `Active Allergy Protection for ${pet.name}` : `Protección Activa de Alergias para ${pet.name}`)
                  : (isEn ? `${pet.name} has no known food allergies` : `${pet.name} no tiene alergias alimentarias conocidas`)}
              </h3>

              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-2xl">
                {hasAllergies
                  ? (isEn
                      ? `All daily menus, weekly rotating recipes, and suggested dishes automatically exclude: ${pet.allergies}. Safe hypoallergenic alternatives are substituted.`
                      : `Todos los menús diarios, recetas rotativas y sugerencias excluyen automáticamente cualquier preparación con: ${pet.allergies}. En su lugar se emplean proteínas y carbohidratos seguros.`)
                  : (isEn
                      ? `${pet.name} enjoys complete food tolerance. Menus rotate through fresh poultry, beef, fish, lamb, and grains freely.`
                      : `${pet.name} disfruta de tolerancia completa. Sus menús rotan libremente entre todas las proteínas frescas sin restricciones.`)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
            {hasAllergies && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isEn ? 'Clear all allergies' : 'Marcar sin alergias'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenEditPetModal}
              className="px-4 py-2.5 rounded-xl bg-[#B8860B] hover:bg-[#996515] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{isEn ? 'Edit Full Pet Form' : 'Editar Ficha Completa'}</span>
            </button>
          </div>
        </div>

        {/* Excluded Pills */}
        {hasAllergies && (
          <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-2.5">
              🚫 {isEn ? 'Ingredients strictly prohibited in meals:' : 'Ingredientes estrictamente prohibidos en sus platos:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedAllergens.map((allergen) => (
                <span
                  key={allergen}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30 shadow-xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{allergen}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(allergen)}
                    className="ml-1 text-stone-700 hover:text-rose-800 dark:text-stone-300 dark:hover:text-white"
                    title={isEn ? `Remove ${allergen}` : `Quitar ${allergen}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Fast Inline Allergy Management Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/25 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
              <span>{isEn ? 'Manage Allergies & Forbidden Foods' : 'Gestionar Alergias y Alimentos Prohibidos'}</span>
            </h3>
            <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
              {isEn 
                ? 'Select the foods your pet cannot eat. The nutrition plan updates instantly upon saving.'
                : 'Marca los alimentos que le sientan mal a tu mascota. El plan nutricional se actualizará de inmediato.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#B8860B] hover:bg-[#996515] text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEn ? 'Save & Update Menus' : 'Guardar y Actualizar Menús'}</span>
          </button>
        </div>

        {hasSavedChanges && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400 shrink-0" />
            <span>
              {isEn
                ? `Changes saved! Menus for ${pet.name} have been recalculated without these ingredients.`
                : `¡Cambios guardados! Los menús de ${pet.name} se han recalculado automáticamente sin estos ingredientes.`}
            </span>
          </div>
        )}

        {/* Common allergens chips selector */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            {isEn ? 'Common Pet Allergens (Tap to add/remove):' : 'Alérgenos Frecuentes (Toca para añadir o retirar de su lista):'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {COMMON_FOOD_ALLERGENS.map((allergen) => {
              const isSelected = selectedAllergens.some(
                a => a.toLowerCase() === allergen.nameEs.toLowerCase() ||
                     allergen.keywords.some(k => a.toLowerCase() === k.toLowerCase())
              );

              return (
                <button
                  key={allergen.id}
                  type="button"
                  onClick={() => handleToggleCommonAllergen(allergen.nameEs)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-300 shadow-xs ring-1 ring-rose-500/30'
                      : 'bg-stone-50 dark:bg-[#0E1511] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{allergen.icon}</span>
                    <span className="truncate">{allergen.nameEs.split('/')[0].trim()}</span>
                  </div>
                  {isSelected ? (
                    <Check className="w-4 h-4 text-rose-800 dark:text-rose-300 shrink-0" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300 shrink-0 opacity-40" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom food entry */}
        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            {isEn ? 'Add Custom Allergen or Ingredient:' : 'Añadir Otro Alimento Alérgeno Específico:'}
          </label>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder={isEn ? 'e.g. Duck, Carrot, Rabbit...' : 'Ej. Pato, Zanahoria, Salmón salvaje...'}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustom();
                }
              }}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#B8860B] hover:bg-[#996515] text-white flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isEn ? 'Add' : 'Añadir'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Safe Substitutes Guide Panel */}
      {hasAllergies && (
        <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/25 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              {isEn ? 'Safe Hypoallergenic Substitutions Applied' : 'Sustitutos Seguros Aplicados en sus Menús'}
            </h3>
          </div>
          <p className="text-xs text-stone-700 dark:text-stone-300">
            {isEn
              ? 'Our veterinary formulation replaces restricted ingredients with high-digestibility proteins and grain-free alternatives:'
              : 'Nuestra formulación clínica sustituye los ingredientes conflictivos por proteínas de alta asimilación y alternativas grain-free:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {substituteCards.map((sub, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <span>{sub.icon}</span>
                    <span className="line-through">{sub.allergenName}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-500/25">
                    {isEn ? 'Substituted' : 'Sustituido'}
                  </span>
                </div>

                <div className="text-xs text-stone-700 dark:text-stone-300">
                  <span className="block font-semibold text-stone-900 dark:text-stone-200 mb-1">
                    🛡️ {isEn ? 'Safe alternatives used:' : 'Alternativas seguras empleadas:'}
                  </span>
                  <ul className="space-y-1 pl-1">
                    {sub.substitutes.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 text-[11px]">
                        <Check className="w-3 h-3 text-emerald-800 dark:text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Live Proof: Today's Menu Adapted for this Pet */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/25 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
            <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              {isEn ? `Today's Menu Adapted for ${pet.name}` : `Menú de Hoy Adaptado para ${pet.name}`}
            </h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
            {hasAllergies 
              ? (isEn ? `🛡️ 100% Free of ${pet.allergies}` : `🛡️ 100% Libre de ${pet.allergies}`)
              : (isEn ? '🌟 Balanced Complete Formula' : '🌟 Fórmula Completa y Equilibrada')}
          </span>
        </div>

        <p className="text-xs text-stone-700 dark:text-stone-300">
          {isEn 
            ? 'Below are the 2 main dishes calculated for today, verifying that no allergens are included in the formulation:'
            : 'A continuación se muestran los 2 platos principales calculados para hoy, verificando que no se incluye ningún alérgeno:'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Dish 1 */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-[#D4AF37]">
                {isEn ? 'Morning Meal (Dish 1)' : 'Desayuno / Plato 1'}
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-[#F3E5AB]">
                {todayPlan.dish1.portionGrams}g &bull; {todayPlan.dish1.kcal} kcal
              </span>
            </div>

            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {todayPlan.dish1.title}
            </h4>

            <p className="text-xs text-stone-700 dark:text-stone-300">
              {todayPlan.dish1.description}
            </p>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <span className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                {isEn ? 'Ingredients:' : 'Ingredientes formulados:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {todayPlan.dish1.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-white dark:bg-[#121B15] border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
                  >
                    {ing.name} ({ing.grams}g)
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dish 2 */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-[#D4AF37]">
                {isEn ? 'Evening Meal (Dish 2)' : 'Cena / Plato 2'}
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-[#F3E5AB]">
                {todayPlan.dish2.portionGrams}g &bull; {todayPlan.dish2.kcal} kcal
              </span>
            </div>

            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {todayPlan.dish2.title}
            </h4>

            <p className="text-xs text-stone-700 dark:text-stone-300">
              {todayPlan.dish2.description}
            </p>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <span className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                {isEn ? 'Ingredients:' : 'Ingredientes formulados:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {todayPlan.dish2.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-white dark:bg-[#121B15] border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
                  >
                    {ing.name} ({ing.grams}g)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
