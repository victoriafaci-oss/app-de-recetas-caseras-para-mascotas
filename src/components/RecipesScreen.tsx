import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Recipe, GrowthStage } from '../types';
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
  Award,
  Heart,
  Droplet
} from 'lucide-react';

export const RecipesScreen: React.FC = () => {
  const { 
    customRecipes, 
    selectedPet, 
    recordCookedMeal, 
    setActiveTab, 
    addChatMessage,
    showToast,
    language,
    t
  } = useApp();

  // User requirement: First choose species, then growth stage
  const [selectedSpecies, setSelectedSpecies] = useState<'dog' | 'cat' | 'both'>('dog');
  const [selectedGrowthStage, setSelectedGrowthStage] = useState<GrowthStage | 'all'>('adult');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  // Scaler state inside modal
  const [scalerPetWeight, setScalerPetWeight] = useState(selectedPet ? selectedPet.weightKg : 12);
  const [scalerDays, setScalerDays] = useState(3);
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});

  const allRecipes = [...customRecipes, ...RECIPES_CATALOG];

  const categoriesList = [
    { id: 'all', label: language === 'es' ? 'Todas las Dietas' : 'All Diets' },
    { id: 'joint_omega3', label: language === 'es' ? 'Articular & Longevidad' : 'Joints & Longevity' },
    { id: 'renal', label: language === 'es' ? 'Soporte Renal & Fósforo Bajo' : 'Renal Support & Low Phosphorus' },
    { id: 'sensitive_digestion', label: language === 'es' ? 'Digestión Sensible & IBD' : 'Sensitive Digestion & IBD' },
    { id: 'weight_control', label: language === 'es' ? 'Control de Peso & Saciante' : 'Weight Control & Satiety' },
    { id: 'collagen_broth', label: language === 'es' ? 'Caldos de Colágeno Puro' : 'Pure Collagen Broths' },
    { id: 'healthy_snacks', label: language === 'es' ? 'Snacks & Premios Caseros' : 'Healthy Homemade Snacks' },
  ];

  const growthStagesList: { id: GrowthStage | 'all'; label: string; icon: string }[] = [
    { id: 'puppy_kitten', label: language === 'es' ? 'Cachorro / Gatito (Crecimiento)' : 'Puppy / Kitten (Growth)', icon: '🍼' },
    { id: 'adult', label: language === 'es' ? 'Adulto (Mantenimiento Óptimo)' : 'Adult (Optimal Maintenance)', icon: '🐕' },
    { id: 'senior', label: language === 'es' ? 'Senior (Vitalidad & Articulaciones)' : 'Senior (Vitality & Joints)', icon: '👑' },
    { id: 'all', label: language === 'es' ? 'Todas las Etapas' : 'All Life Stages', icon: '🌟' },
  ];

  const filteredRecipes = allRecipes.filter((r) => {
    // 1. Species filter
    const matchesSpecies = selectedSpecies === 'both' || r.species === 'both' || r.species === selectedSpecies;
    
    // 2. Growth stage filter
    const matchesGrowth = 
      selectedGrowthStage === 'all' || 
      !r.growthStage || 
      r.growthStage === 'all' || 
      r.growthStage === selectedGrowthStage;

    // 3. Category filter
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;

    // 4. Search query
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.frenchTitle && r.frenchTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSpecies && matchesGrowth && matchesCategory && matchesSearch;
  });

  const handleOpenRecipeModal = (recipe: Recipe) => {
    setActiveRecipe(recipe);
    if (selectedPet) {
      setScalerPetWeight(selectedPet.weightKg);
    }
  };

  const handleLogCookingBatch = () => {
    if (!activeRecipe) return;
    
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

    showToast(language === 'es' ? `¡Batch cooking de "${activeRecipe.title}" registrado con éxito!` : `Batch cooking for "${activeRecipe.title}" recorded!`, 'success');
  };

  const handleConsultAiWithRecipe = (recipe: Recipe) => {
    addChatMessage({
      role: 'user',
      content: language === 'es' 
        ? `Deseo consultar sobre la receta "${recipe.title}" (${recipe.frenchTitle || ''}) para ${selectedPet?.name || 'mi mascota'}. ¿Qué adaptaciones específicas me sugieres según su peso y etapa?`
        : `I would like to consult regarding "${recipe.title}" for ${selectedPet?.name || 'my pet'}. What adaptations do you recommend based on weight and life stage?`,
    });
    setActiveTab('concierge');
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white to-stone-50 dark:from-[#112019] dark:to-[#07130E] border border-[#E8DCCB] dark:border-[#D4AF37]/30 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-900 dark:text-[#D4AF37] border border-amber-500/30 mb-2">
            <ChefHat className="w-3.5 h-3.5" />
            {language === 'es' ? 'Cocina Natural Veterinaria de Precisión' : 'Precision Veterinary Natural Cooking'}
          </div>
          <h1 className="font-editorial text-2xl sm:text-4xl font-bold text-stone-900 dark:text-[#F3E5AB]">
            {t('recipesTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-1 leading-relaxed font-medium">
            {t('recipesSubtitle')}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MANDATORY USER FLOW: STEP 1 (SPECIES) -> STEP 2 (GROWTH STAGE)           */}
      {/* ========================================================================= */}
      <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/25 shadow-md">
        
        {/* Step 1: Select Species */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 text-xs font-bold flex items-center justify-center">1</span>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-[#F3E5AB]">
              {language === 'es' ? 'Paso 1: Seleccione Especie' : 'Step 1: Select Species'}
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedSpecies('dog')}
              className={`p-3 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                selectedSpecies === 'dog'
                  ? 'bg-amber-50 dark:bg-[#1B2F25] border-[#B8860B] dark:border-[#D4AF37] shadow-sm text-amber-950 dark:text-[#F3E5AB] scale-101'
                  : 'bg-stone-50 dark:bg-[#16271F] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400'
              }`}
            >
              <span className="text-2xl sm:text-3xl">🐕</span>
              <span className="text-xs sm:text-sm font-bold">{language === 'es' ? 'Perro' : 'Dog'}</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 hidden sm:inline">{language === 'es' ? 'Canino / Omnívoro' : 'Canine diets'}</span>
            </button>

            <button
              onClick={() => setSelectedSpecies('cat')}
              className={`p-3 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                selectedSpecies === 'cat'
                  ? 'bg-amber-50 dark:bg-[#1B2F25] border-[#B8860B] dark:border-[#D4AF37] shadow-sm text-amber-950 dark:text-[#F3E5AB] scale-101'
                  : 'bg-stone-50 dark:bg-[#16271F] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400'
              }`}
            >
              <span className="text-2xl sm:text-3xl">🐈</span>
              <span className="text-xs sm:text-sm font-bold">{language === 'es' ? 'Gato' : 'Cat'}</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 hidden sm:inline">{language === 'es' ? 'Felino / Carnívoro estricto' : 'Strict feline carnivore'}</span>
            </button>

            <button
              onClick={() => setSelectedSpecies('both')}
              className={`p-3 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                selectedSpecies === 'both'
                  ? 'bg-amber-50 dark:bg-[#1B2F25] border-[#B8860B] dark:border-[#D4AF37] shadow-sm text-amber-950 dark:text-[#F3E5AB] scale-101'
                  : 'bg-stone-50 dark:bg-[#16271F] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400'
              }`}
            >
              <span className="text-2xl sm:text-3xl">🐾</span>
              <span className="text-xs sm:text-sm font-bold">{language === 'es' ? 'Perros & Gatos' : 'Both Species'}</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 hidden sm:inline">{language === 'es' ? 'Catálogo completo' : 'Full catalog'}</span>
            </button>
          </div>
        </div>

        {/* Step 2: Select Growth Stage */}
        <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 text-xs font-bold flex items-center justify-center">2</span>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-[#F3E5AB]">
              {language === 'es' ? 'Paso 2: Seleccione Etapa de Crecimiento' : 'Step 2: Select Growth Stage'}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {growthStagesList.map((stage) => {
              const isSelected = selectedGrowthStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedGrowthStage(stage.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/15 to-emerald-500/15 dark:from-[#1B2F25] dark:to-[#16271F] border-[#B8860B] dark:border-[#D4AF37] shadow-xs text-stone-900 dark:text-[#F3E5AB]'
                      : 'bg-stone-50 dark:bg-[#16271F] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                  }`}
                >
                  <span className="text-xl shrink-0">{stage.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{stage.label}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Category Sub-Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder={language === 'es' ? 'Buscar ingrediente (salmón, pavo, cúrcuma...)' : 'Search ingredient (salmon, turkey, pumpkin...)'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {categoriesList.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                  selectedCategory === c.id
                    ? 'bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RECIPES DISPLAY GRID                                                      */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {language === 'es' 
              ? `Recetas encontradas (${filteredRecipes.length})` 
              : `Formulations found (${filteredRecipes.length})`}
          </div>
          {selectedPet && (
            <div className="text-xs text-[#B8860B] dark:text-[#D4AF37] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'es' ? `Escalador activo para ${selectedPet.name} (${selectedPet.weightKg} kg)` : `Active for ${selectedPet.name} (${selectedPet.weightKg} kg)`}</span>
            </div>
          )}
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#112019] border border-stone-200 dark:border-stone-800 space-y-3">
            <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-editorial text-lg font-bold text-stone-800 dark:text-stone-200">
              {language === 'es' ? 'No se encontraron recetas con los filtros seleccionados' : 'No recipes match current filters'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {language === 'es' ? 'Pruebe a seleccionar "Todas las Etapas" o "Todas las Especialidades".' : 'Try selecting "All Life Stages" or resetting the search filters.'}
            </p>
            <button
              onClick={() => {
                setSelectedSpecies('both');
                setSelectedGrowthStage('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full bg-[#B8860B] text-white font-bold text-xs shadow-xs"
            >
              {language === 'es' ? 'Restablecer Filtros' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="rounded-3xl overflow-hidden bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/25 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Recipe Image or Header */}
                <div className="h-44 relative overflow-hidden bg-gradient-to-br from-[#12241C] to-[#0A1610] flex items-center justify-center">
                  {!failedImageIds[recipe.id] && recipe.imageUrl ? (
                    <img 
                      src={recipe.imageUrl} 
                      alt={recipe.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() => {
                        setFailedImageIds(prev => ({ ...prev, [recipe.id]: true }));
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-amber-100 to-amber-200 dark:from-[#16271F] dark:to-[#112019]">
                      <Utensils className="w-10 h-10 text-[#B8860B] dark:text-[#D4AF37] opacity-60 mb-1" />
                      <span className="text-[11px] font-bold text-stone-700 dark:text-[#F3E5AB]">Plato Gourmet</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
                  
                  {/* Species & Stage Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 border border-white/20">
                      <span>{recipe.species === 'dog' ? '🐕 Perro' : recipe.species === 'cat' ? '🐈 Gato' : '🐾 Ambos'}</span>
                    </span>
                    {recipe.growthStage && (
                      <span className="px-2.5 py-1 rounded-full bg-[#B8860B]/80 backdrop-blur-md text-white text-[10px] font-bold border border-amber-300/40">
                        {recipe.growthStage === 'puppy_kitten' ? '🍼 Cachorro' : recipe.growthStage === 'senior' ? '👑 Senior' : 'Adulto'}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    {recipe.frenchTitle && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200 font-semibold block">{recipe.frenchTitle}</span>
                    )}
                    <h3 className="font-editorial text-lg font-bold leading-tight drop-shadow-sm">{recipe.title}</h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                      {recipe.description}
                    </p>

                    {/* Stats Pill Row */}
                    <div className="grid grid-cols-3 gap-1.5 py-2 px-3 rounded-2xl bg-stone-50 dark:bg-[#16271F] border border-stone-200 dark:border-stone-800 text-center">
                      <div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">{t('kcalPer100')}</div>
                        <div className="text-xs font-bold text-[#B8860B] dark:text-[#F3E5AB]">{recipe.kcalPer100g} kcal</div>
                      </div>
                      <div className="border-x border-stone-200 dark:border-stone-800">
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">{t('cookingTime')}</div>
                        <div className="text-xs font-bold text-stone-800 dark:text-stone-200">{recipe.prepTimeMin + (recipe.cookTimeMin || 0)} min</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">{t('difficulty')}</div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{recipe.difficulty}</div>
                      </div>
                    </div>

                    {/* Clinical Benefits snippet */}
                    {recipe.clinicalBenefits && recipe.clinicalBenefits.length > 0 && (
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{recipe.clinicalBenefits.join(' • ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => handleOpenRecipeModal(recipe)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold text-xs shadow-xs hover:scale-102 transition-transform flex items-center justify-center gap-1.5"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Ver & Escalar' : 'View & Scale'}</span>
                    </button>

                    <button
                      onClick={() => handleConsultAiWithRecipe(recipe)}
                      className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-[#16271F] border border-amber-500/30 dark:border-[#D4AF37]/30 text-[#B8860B] dark:text-[#D4AF37] hover:scale-105 transition-transform"
                      title={t('askNutriAiToAdapt')}
                    >
                      <Bot className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* RECIPE DETAIL & BATCH COOKING SCALER MODAL                                 */}
      {/* ========================================================================= */}
      {activeRecipe && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                {activeRecipe.frenchTitle && (
                  <span className="text-xs font-mono font-bold text-[#B8860B] dark:text-[#D4AF37] uppercase">{activeRecipe.frenchTitle}</span>
                )}
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                  {activeRecipe.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                    {activeRecipe.species === 'dog' ? '🐕 Dieta Canina' : activeRecipe.species === 'cat' ? '🐈 Dieta Felina' : '🐾 Perros & Gatos'}
                  </span>
                  <span>•</span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{activeRecipe.kcalPer100g} kcal / 100g</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveRecipe(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Batch Cooking Scaler Control */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-[#16271F] border border-[#E8DCCB] dark:border-[#D4AF37]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {t('scaleBatchCooking')}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                  {scalerDays} {language === 'es' ? 'días' : 'days'} ({scalerPetWeight} kg)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Weight Slider */}
                <div>
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t('petWeightScaler')}: <span className="text-[#B8860B] dark:text-[#D4AF37] font-bold">{scalerPetWeight} kg</span>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={60}
                    step={0.5}
                    value={scalerPetWeight}
                    onChange={(e) => setScalerPetWeight(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>

                {/* Days Selector */}
                <div>
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t('batchDays')}
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 3, 7, 14].map((d) => (
                      <button
                        key={d}
                        onClick={() => setScalerDays(d)}
                        className={`py-1 rounded-xl text-xs font-bold transition-all ${
                          scalerDays === d
                            ? 'bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs'
                            : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Portions & Ingredients Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-[#F3E5AB]">
                {t('ingredientsTitle')} ({scalerDays} {language === 'es' ? 'días de ración' : 'days prep'})
              </h4>
              <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden text-xs">
                {activeRecipe.ingredients.map((ing, idx) => {
                  const scaledGrams = Math.round((ing.baseGramsFor10kgPetPerDay * (scalerPetWeight / 10)) * scalerDays);
                  return (
                    <div key={idx} className="p-3 flex items-center justify-between bg-stone-50/50 dark:bg-[#16271F]/50">
                      <div>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{ing.name}</span>
                        {ing.notes && <span className="text-[10px] text-stone-500 dark:text-stone-400 block">{ing.notes}</span>}
                      </div>
                      <span className="font-mono font-bold text-[#B8860B] dark:text-[#D4AF37] text-sm">
                        {scaledGrams} g
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cooking Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-[#F3E5AB]">
                {t('instructionsTitle')}
              </h4>
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#16271F] border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 space-y-2 leading-relaxed">
                {activeRecipe.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#B8860B] dark:text-[#D4AF37]">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage & Chef Touch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40">
                <div className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5 mb-1">
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  <span>{t('storageTitle')}</span>
                </div>
                <p className="text-sky-800 dark:text-sky-200 text-[11px] leading-relaxed">
                  {activeRecipe.storageInfo}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('chefTouch')}</span>
                </div>
                <p className="text-amber-800 dark:text-amber-200 text-[11px] leading-relaxed">
                  {activeRecipe.chefTips}
                </p>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleLogCookingBatch}
                className="flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{t('cookedBatchBtn')} ({scalerDays} {language === 'es' ? 'días' : 'days'})</span>
              </button>

              <button
                onClick={() => handleConsultAiWithRecipe(activeRecipe)}
                className="py-3 px-4 rounded-2xl bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <Bot className="w-4 h-4" />
                <span>{t('askNutriAiToAdapt')}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
