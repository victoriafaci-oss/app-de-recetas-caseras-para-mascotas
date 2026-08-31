import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Recipe } from '../types';
import { RECIPES_CATALOG } from '../data/mockData';
import { 
  BookOpen, 
  ChefHat, 
  Clock, 
  Flame, 
  Scale, 
  Sparkles, 
  Search, 
  Filter, 
  X, 
  Check, 
  Utensils, 
  Bot, 
  ShieldCheck, 
  Layers,
  ThermometerSnowflake,
  Award
} from 'lucide-react';

export const RecipesScreen: React.FC = () => {
  const { 
    customRecipes, 
    selectedPet, 
    recordCookedMeal, 
    setActiveTab, 
    addChatMessage,
    showToast,
    language
  } = useApp();

  const [selectedSpecies, setSelectedSpecies] = useState<'all' | 'dog' | 'cat'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  // Scaler state inside modal
  const [scalerPetWeight, setScalerPetWeight] = useState(selectedPet ? selectedPet.weightKg : 12);
  const [scalerDays, setScalerDays] = useState(3);

  const allRecipes = [...customRecipes, ...RECIPES_CATALOG];

  const categoriesList = [
    { id: 'all', label: language === 'es' ? 'Todas las Especialidades' : 'All Specialties' },
    { id: 'joint_omega3', label: language === 'es' ? 'Articular & Longevidad' : 'Joints & Longevity' },
    { id: 'renal', label: language === 'es' ? 'Soporte Renal & Fósforo Bajo' : 'Renal Support & Low Phosphorus' },
    { id: 'sensitive_digestion', label: language === 'es' ? 'Digestión Sensible & IBD' : 'Sensitive Digestion & IBD' },
    { id: 'weight_control', label: language === 'es' ? 'Control de Peso & Saciante' : 'Weight Control & Satiety' },
    { id: 'collagen_broth', label: language === 'es' ? 'Caldos de Colágeno Puro' : 'Pure Collagen Broths' },
    { id: 'healthy_snacks', label: language === 'es' ? 'Snacks & Premios Caseros' : 'Healthy Homemade Snacks' },
  ];

  const filteredRecipes = allRecipes.filter((r) => {
    const matchesSpecies = selectedSpecies === 'all' || r.species === 'both' || r.species === selectedSpecies;
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.frenchTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSpecies && matchesCategory && matchesSearch;
  });

  const handleOpenRecipeModal = (recipe: Recipe) => {
    setActiveRecipe(recipe);
    if (selectedPet) {
      setScalerPetWeight(selectedPet.weightKg);
    }
  };

  const handleLogCookingBatch = () => {
    if (!activeRecipe) return;
    
    // Calculate total grams for the whole batch
    const totalGrams = activeRecipe.ingredients.reduce((acc, ing) => {
      const g = Math.round((ing.baseGramsFor10kgPetPerDay * (scalerPetWeight / 10)) * scalerDays);
      return acc + g;
    }, 0);

    const totalKcal = Math.round(totalGrams * (activeRecipe.kcalPer100g / 100));

    const targetPetId = selectedPet ? selectedPet.id : 'pet-1';

    recordCookedMeal(targetPetId, {
      recipeId: activeRecipe.id,
      recipeTitle: activeRecipe.title,
      daysPrepared: scalerDays,
      totalGrams,
      totalKcal,
    });

    showToast(`¡Batch cooking de "${activeRecipe.title}" registrado con éxito!`, 'success');
  };

  const handleConsultAiWithRecipe = (recipe: Recipe) => {
    addChatMessage({
      role: 'user',
      content: `Deseo consultar sobre la receta "${recipe.title}" (${recipe.frenchTitle}) para ${selectedPet?.name || 'mi mascota'}. ¿Qué recomendaciones o adaptaciones específicas de temperatura y suplementos me sugieres?`,
    });
    setActiveTab('concierge');
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white to-stone-50 dark:from-[#121B15] dark:to-[#0A0F0D] border border-stone-200 dark:border-[#D4AF37]/30 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-900 dark:text-[#D4AF37] border border-amber-500/30 mb-2">
            <ChefHat className="w-3.5 h-3.5" />
            {language === 'es' ? 'Cocina Natural Veterinaria de Precisión' : 'Precision Veterinary Natural Cooking'}
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 dark:text-[#F3E5AB]">
            Recetario General Casero & Escalador
          </h1>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-1 leading-relaxed font-medium">
            Formulaciones completas equilibradas con proteínas nobles, extracto de colágeno, ratios calcio/fósforo clínicos y calculador de porciones en tiempo real para batch cooking semanal.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 dark:text-stone-400" />
            <input
              type="text"
              placeholder="Buscar por ingrediente (pavo, calabaza, cúrcuma...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Species Selector */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedSpecies('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedSpecies === 'all'
                  ? 'bg-emerald-800 dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedSpecies('dog')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                selectedSpecies === 'dog'
                  ? 'bg-amber-600 dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>🐕</span> Perros
            </button>
            <button
              onClick={() => setSelectedSpecies('cat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                selectedSpecies === 'cat'
                  ? 'bg-emerald-600 dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>🐈</span> Gatos
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-stone-100 dark:border-stone-800">
          {categoriesList.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-amber-500/20 text-amber-900 dark:text-[#F3E5AB] border border-amber-500/40 font-bold'
                  : 'text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => handleOpenRecipeModal(recipe)}
            className="group rounded-2xl overflow-hidden bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 hover:border-amber-600/50 dark:hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header card visual */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-[#D4AF37] border border-amber-500/20">
                    {recipe.categoryLabel}
                  </span>
                  <span className="text-xs">
                    {recipe.species === 'both' ? '🐕 / 🐈' : recipe.species === 'dog' ? '🐕 Canino' : '🐈 Felino'}
                  </span>
                </div>

                <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB] group-hover:text-amber-800 dark:group-hover:text-[#D4AF37] transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 italic">
                  {recipe.frenchTitle}
                </p>

                <p className="text-xs text-stone-700 dark:text-stone-300 mt-2 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Macro & Time Pills */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-[#0A0F0D] border border-stone-200 dark:border-stone-800/80">
                    <span className="block text-[10px] text-stone-600 dark:text-stone-400">Calorías</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{recipe.kcalPer100g} kcal/100g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-[#0A0F0D] border border-stone-200 dark:border-stone-800/80">
                    <span className="block text-[10px] text-stone-600 dark:text-stone-400">Cocción</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{recipe.cookTimeMin} min</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-[#0A0F0D] border border-stone-200 dark:border-stone-800/80">
                    <span className="block text-[10px] text-stone-600 dark:text-stone-400">Dificultad</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-400">{recipe.difficulty}</span>
                  </div>
                </div>

                {/* Chef tip preview */}
                {recipe.chefTips && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-950 dark:text-amber-300">
                    <span className="font-bold">Toque del Chef:</span> {recipe.chefTips}
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-5 pt-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenRecipeModal(recipe);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-800 group-hover:bg-emerald-900 dark:bg-[#D4AF37] dark:group-hover:bg-[#E5C358] text-white dark:text-stone-950 transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Scale className="w-4 h-4" />
                <span>Abrir Calculadora & Ración</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED RECIPE MODAL & BATCH-COOKING SCALER */}
      {activeRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121B15] border-2 border-stone-300 dark:border-[#D4AF37]/40 shadow-2xl text-stone-900 dark:text-stone-100 max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Top Bar */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-200 dark:border-[#D4AF37]/20">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-900 dark:text-[#D4AF37] border border-amber-500/30 mb-1">
                  <ChefHat className="w-3.5 h-3.5" />
                  {activeRecipe.categoryLabel}
                </div>
                <h2 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                  {activeRecipe.title}
                </h2>
                <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                  {activeRecipe.frenchTitle} &bull; Adecuado para: {activeRecipe.suitability}
                </p>
              </div>
              <button
                onClick={() => setActiveRecipe(null)}
                className="p-1.5 rounded-xl text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clinical Benefits */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-950 dark:text-emerald-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Beneficios Clínicos & Bioactivos:
              </div>
              <ul className="list-disc pl-4 space-y-0.5 leading-relaxed">
                {activeRecipe.clinicalBenefits.map((benefit, bIdx) => (
                  <li key={bIdx}>{benefit}</li>
                ))}
              </ul>
            </div>

            {/* INTERACTIVE INGREDIENT SCALER CONTROLS */}
            <div className="p-5 rounded-2xl bg-stone-100/90 dark:bg-[#0E1511] border border-stone-200 dark:border-[#D4AF37]/30 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-500" />
                  Calculadora & Escalador de Raciones
                </h3>
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                  {activeRecipe.kcalPer100g} kcal por cada 100g
                </span>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Peso de la Mascota (kg):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="90"
                    value={scalerPetWeight}
                    onChange={(e) => setScalerPetWeight(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold text-stone-900 dark:text-[#F3E5AB]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Días a Preparar (Batch Cooking):
                  </label>
                  <select
                    value={scalerDays}
                    onChange={(e) => setScalerDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold text-stone-900 dark:text-[#F3E5AB]"
                  >
                    <option value={1}>1 Día (Ración Fresca Diaria)</option>
                    <option value={3}>3 Días (Frigorífico)</option>
                    <option value={7}>7 Días (Batch Cooking Semanal)</option>
                    <option value={14}>14 Días (Congelador en Porciones)</option>
                  </select>
                </div>
              </div>

              {/* Calculated Batch Metrics Banner */}
              {(() => {
                const totalGramsBatch = activeRecipe.ingredients.reduce((acc, ing) => {
                  const g = Math.round((ing.baseGramsFor10kgPetPerDay * (scalerPetWeight / 10)) * scalerDays);
                  return acc + g;
                }, 0);
                const dailyGrams = Math.round(totalGramsBatch / scalerDays);
                const totalCalories = Math.round(totalGramsBatch * (activeRecipe.kcalPer100g / 100));

                return (
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center text-xs">
                    <div>
                      <span className="block text-[10px] text-stone-700 dark:text-stone-300 uppercase">Ración por Día</span>
                      <span className="text-base font-bold text-emerald-800 dark:text-emerald-400">~{dailyGrams} g</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-700 dark:text-stone-300 uppercase">Total a Cocinar</span>
                      <span className="text-base font-bold text-amber-700 dark:text-[#D4AF37]">{totalGramsBatch} g</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-700 dark:text-stone-300 uppercase">Energía Total</span>
                      <span className="text-base font-bold text-stone-900 dark:text-stone-100">{totalCalories} kcal</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* DYNAMIC SCALED INGREDIENTS LIST */}
            <div className="space-y-3">
              <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                Ingredientes Proporcionados ({scalerDays} {scalerDays === 1 ? 'día' : 'días'} para {scalerPetWeight}kg):
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeRecipe.ingredients.map((ing, i) => {
                  const scaledGrams = Math.round((ing.baseGramsFor10kgPetPerDay * (scalerPetWeight / 10)) * scalerDays);

                  return (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800/80 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-stone-900 dark:text-stone-100">{ing.name}</span>
                        {ing.notes && (
                          <span className="block text-[10px] text-stone-700 dark:text-stone-300">{ing.notes}</span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-emerald-800 dark:text-[#D4AF37] text-sm shrink-0">
                        {scaledGrams} g
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                Método de Preparación & Cocción:
              </h3>
              <div className="space-y-2 text-xs">
                {activeRecipe.instructions.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-900 dark:text-[#D4AF37] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Guidelines */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-950 dark:text-blue-300 flex items-center gap-3">
              <ThermometerSnowflake className="w-5 h-5 shrink-0 text-blue-500" />
              <div>
                <span className="font-bold block">{language === 'es' ? 'Conservación & Refrigeración:' : 'Storage & Refrigeration:'}</span>
                <span>{activeRecipe.storageInfo}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200 dark:border-[#D4AF37]/20">
              <button
                onClick={() => handleConsultAiWithRecipe(activeRecipe)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-indigo-500/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/10 transition-colors flex items-center gap-1.5"
              >
                <Bot className="w-4 h-4" />
                <span>Pedir a NutriIA adaptar receta</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveRecipe(null)}
                  className="px-4 py-2.5 rounded-xl text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleLogCookingBatch}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 dark:bg-[#D4AF37] dark:hover:bg-[#E5C358] text-white dark:text-stone-950 transition-all shadow-md flex items-center gap-1.5"
                >
                  <Utensils className="w-4 h-4" />
                  <span>He Cocinado este Batch</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
