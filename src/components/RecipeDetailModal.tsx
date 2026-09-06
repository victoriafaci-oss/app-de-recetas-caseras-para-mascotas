import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChefHat, 
  Flame, 
  Scale, 
  Check, 
  Sparkles, 
  Camera, 
  RefreshCw, 
  CheckCircle2, 
  Info, 
  Clock, 
  Printer, 
  ShieldCheck,
  Utensils
} from 'lucide-react';
import { getDishImage, generateNutriIADishVisual, saveDishCustomImage, DishImageResult } from '../utils/recipeImages';
import { compressImageFile } from '../utils/imageUpload';

export interface RecipeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  categoryLabel?: string;
  timingLabel?: string;
  portionLabel?: string;
  portionGrams?: number;
  kcal?: number;
  description: string;
  ingredients: { name: string; grams?: number; category?: string }[] | string[];
  instructions: string[];
  clinicalBenefits?: string[];
  chefTip?: string;
  species?: 'dog' | 'cat' | 'both';
  petName?: string;
  status?: boolean | null;
  onSetStatus?: (status: boolean | null) => void;
  language?: 'es' | 'en';
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  categoryLabel,
  timingLabel,
  portionLabel,
  portionGrams,
  kcal,
  description,
  ingredients,
  instructions,
  clinicalBenefits,
  chefTip,
  species = 'dog',
  petName = 'tu mascota',
  status = null,
  onSetStatus,
  language = 'es',
}) => {
  const isEn = language === 'en';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse ingredients array into normalized objects
  const normalizedIngredients = React.useMemo(() => {
    return ingredients.map((ing, idx) => {
      if (typeof ing === 'string') {
        const match = ing.match(/(.*?)(?:\s*\(([0-9]+)\s*g\))?$/);
        const name = match ? match[1].trim() : ing;
        const grams = match && match[2] ? parseInt(match[2], 10) : undefined;
        return { id: `ing-${idx}`, name, grams };
      }
      return { id: `ing-${idx}`, name: ing.name, grams: ing.grams, category: ing.category };
    });
  }, [ingredients]);

  // Image state
  const [dishImageInfo, setDishImageInfo] = useState<DishImageResult>(() => {
    const ingredientsString = normalizedIngredients.map(i => i.name).join(' ');
    return getDishImage(title, ingredientsString, species === 'cat');
  });

  const [isGeneratingIA, setIsGeneratingIA] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Update image when modal opens or title changes
  useEffect(() => {
    if (isOpen) {
      const ingredientsString = normalizedIngredients.map(i => i.name).join(' ');
      setDishImageInfo(getDishImage(title, ingredientsString, species === 'cat'));
      setCheckedIngredients({});
    }
  }, [isOpen, title, species, normalizedIngredients]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Nutri IA Generation
  const handleGenerateNutriIA = async () => {
    setIsGeneratingIA(true);
    try {
      const ingredientsString = normalizedIngredients.map(i => i.name).join(' ');
      const newVisual = await generateNutriIADishVisual(title, ingredientsString);
      setDishImageInfo(newVisual);
      showToast(isEn ? '✨ Nutri IA generated a new gourmet visual!' : '✨ ¡Nutri IA ha generado una nueva visualización gourmet para este plato!');
    } catch {
      showToast(isEn ? 'Error generating visual' : 'Error al generar la imagen');
    } finally {
      setIsGeneratingIA(false);
    }
  };

  // Upload real photo cooked by user
  const handleUserPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast(isEn ? 'Optimizing photo...' : 'Optimizando foto de tu plato...');
      const base64 = await compressImageFile(file, 1200, 0.85);
      saveDishCustomImage(title, base64, 'user_upload');
      setDishImageInfo({
        imageUrl: base64,
        source: 'user_upload',
        platingDescriptionEs: '📸 Fotografía real cocinada por ti en casa.',
        platingDescriptionEn: '📸 Real home-cooked photo by owner.',
      });
      showToast(isEn ? '📸 Great job! Real dish photo saved.' : '📸 ¡Genial! Tu foto cocinada ha quedado guardada en la receta.');
    } catch {
      showToast(isEn ? 'Could not load photo' : 'No se pudo procesar la foto');
    }
  };

  const toggleIngredientChecked = (id: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#0E1A14] border border-[#E8DCCB] dark:border-[#D4AF37]/35 rounded-[32px] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Top Bar with Dismiss and Quick Title */}
          <div className="relative">
            {/* Dish Hero Image Banner */}
            <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-stone-900">
              <img
                src={dishImageInfo.imageUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isGeneratingIA ? 'scale-105 filter blur-xs' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A14] via-black/40 to-black/30 pointer-events-none" />

              {/* Close Button Floating Top-Right */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-transform hover:scale-105 shadow-lg z-20"
                title={isEn ? 'Close recipe' : 'Cerrar receta'}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top Tags Left */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                {timingLabel && (
                  <span className="px-3 py-1 rounded-full bg-[#B8860B]/90 text-white text-xs font-bold backdrop-blur-md shadow-md border border-amber-300/40">
                    {timingLabel}
                  </span>
                )}
                {categoryLabel && (
                  <span className="px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-md border border-white/20">
                    {categoryLabel}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold backdrop-blur-md shadow-md">
                  {species === 'cat' ? '🐈 Receta Felina' : '🐕 Receta Canina'}
                </span>
              </div>

              {/* Nutri IA and User Photo Action Buttons inside image */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleUserPhotoUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-black/65 hover:bg-black/85 text-white text-xs font-bold backdrop-blur-md border border-white/25 flex items-center gap-1.5 transition-all hover:scale-105 shadow-md"
                  title={isEn ? 'Upload a photo of your cooked dish' : 'Sube la foto de cómo te quedó el plato al cocinarlo'}
                >
                  <Camera className="w-3.5 h-3.5 text-[#F3E5AB]" />
                  <span className="hidden sm:inline">{isEn ? 'My Real Photo' : 'Subir mi Foto'}</span>
                </button>

                <button
                  onClick={handleGenerateNutriIA}
                  disabled={isGeneratingIA}
                  className="px-3.5 py-1.5 rounded-xl bg-[#B8860B]/90 hover:bg-[#B8860B] text-white text-xs font-bold backdrop-blur-md border border-amber-300/40 flex items-center gap-1.5 transition-all hover:scale-105 shadow-md disabled:opacity-50"
                  title={isEn ? 'Generate new plating with Nutri IA' : 'Generar emplatado gourmet con Nutri IA'}
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-200 ${isGeneratingIA ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingIA ? (isEn ? 'Plating...' : 'Emplatando...') : (isEn ? 'Nutri IA Visual' : 'Visual Nutri IA')}</span>
                </button>
              </div>

              {/* Title & Portion Over Hero */}
              <div className="absolute bottom-4 left-4 right-44 z-10 text-white pr-2">
                <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold leading-tight text-white drop-shadow-md">
                  {title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-stone-200 mt-1 drop-shadow-sm font-medium">
                  {portionLabel && (
                    <span className="font-bold text-[#F3E5AB] flex items-center gap-1">
                      <Scale className="w-4 h-4 text-[#D4AF37]" />
                      <span>{portionLabel}</span>
                    </span>
                  )}
                  {portionGrams && !portionLabel && (
                    <span className="font-bold text-[#F3E5AB] flex items-center gap-1">
                      <Scale className="w-4 h-4 text-[#D4AF37]" />
                      <span>{portionGrams} g {isEn ? 'serving' : 'por ración'}</span>
                    </span>
                  )}
                  {kcal && (
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span>{kcal} kcal</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Nutri IA Clarification & Source Banner */}
            <div className="px-5 py-2.5 bg-gradient-to-r from-amber-500/15 via-[#D4AF37]/10 to-amber-500/15 border-b border-[#E8DCCB] dark:border-[#D4AF37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                <Sparkles className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37] shrink-0" />
                <span>
                  <strong>{dishImageInfo.source === 'user_upload' ? (isEn ? 'Custom Photo:' : 'Foto Real:') : (isEn ? 'Nutri IA Visual:' : 'Visualización Nutri IA:')}</strong>{' '}
                  {isEn ? dishImageInfo.platingDescriptionEn : dishImageInfo.platingDescriptionEs}
                </span>
              </div>
              <div className="text-[11px] text-[#B8860B] dark:text-[#D4AF37] font-semibold shrink-0">
                {isEn ? '✨ Auto-generated plating & photo upload ready' : '✨ Imagen creada por Nutri IA (o sube tu foto al cocinar)'}
              </div>
            </div>
          </div>

          {/* Toast Notification if active */}
          {toastMessage && (
            <div className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold text-center animate-fadeIn">
              {toastMessage}
            </div>
          )}

          {/* Scrollable Content Body with Spacious Typography */}
          <div className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1 text-stone-800 dark:text-stone-200">
            
            {/* Description Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 text-sm sm:text-base leading-relaxed">
              <span className="font-bold text-[#B8860B] dark:text-[#D4AF37] mr-1.5">
                {isEn ? 'Nutritional Overview:' : 'Descripción Nutricional:'}
              </span>
              {description}
            </div>

            {/* Clinical Benefits Pills */}
            {clinicalBenefits && clinicalBenefits.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isEn ? `Clinical Benefits for ${petName}` : `Beneficios Clínicos para ${petName}`}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {clinicalBenefits.map((benefit, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{benefit}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Main 2-Column or Stacked Section: Ingredients (with Weights) + Preparation Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Ingredients with Exact Weights (Checklist Mode) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
                    <span>{isEn ? 'Ingredients & Weights' : 'Ingredientes & Pesajes'}</span>
                  </h3>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {isEn ? 'Tap to check' : 'Toca para tachar'}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {isEn 
                    ? 'Check off each ingredient as you weigh it on your kitchen scale:' 
                    : 'Pesajes exactos calculados para el peso y condición corporal de tu mascota:'}
                </p>

                <div className="space-y-2">
                  {normalizedIngredients.map((ing) => {
                    const isChecked = !!checkedIngredients[ing.id];
                    return (
                      <div
                        key={ing.id}
                        onClick={() => toggleIngredientChecked(ing.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-stone-400 dark:text-stone-500 line-through'
                            : 'bg-stone-50 hover:bg-amber-50/50 dark:bg-stone-900/80 dark:hover:bg-[#16271F] border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-sm font-semibold truncate">
                            {ing.name}
                          </span>
                        </div>

                        {ing.grams !== undefined && ing.grams > 0 && (
                          <span className="font-mono text-xs sm:text-sm font-bold bg-[#B8860B]/10 dark:bg-[#D4AF37]/15 text-[#B8860B] dark:text-[#F3E5AB] px-2.5 py-1 rounded-xl shrink-0 border border-[#B8860B]/20">
                            {ing.grams} g
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{isEn ? 'Weigh proteins in raw state or gently poached without salt, onion, or toxic spices.' : 'Pesar las carnes y pescados limpios de huesos cocidos o espinas. Cocinar sin sal, ajo, cebolla ni condimentos.'}</span>
                </div>
              </div>

              {/* Right Column: Step-by-Step Preparation with Large Readable Steps */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
                    <span>{isEn ? 'Step-by-Step Preparation' : 'Modo de Preparación Paso a Paso'}</span>
                  </h3>
                  <span className="text-xs text-[#B8860B] dark:text-[#D4AF37] font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>15-20 min</span>
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {isEn 
                    ? 'Follow these culinary steps to preserve 100% of vitamins, amino acids, and taurine:' 
                    : 'Instrucciones amplias y detalladas para conservar todos los nutrientes y palatabilidad:'}
                </p>

                <div className="space-y-3">
                  {instructions.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 flex items-start gap-3.5 shadow-2xs hover:border-[#D4AF37]/40 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-2xl bg-[#B8860B] text-white dark:bg-[#D4AF37] dark:text-stone-950 font-bold text-sm flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-1 text-stone-800 dark:text-stone-200">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#D4AF37]">
                          {isEn ? `Step ${idx + 1}` : `Paso ${idx + 1}`}
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chef Tip Card */}
                {chefTip && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/25 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 flex items-start gap-3">
                    <ChefHat className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-0.5">
                        👨‍🍳 {isEn ? 'Nutritionist Chef Advice:' : 'Consejo del Chef Nutricionista:'}
                      </span>
                      <span>{chefTip}</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Modal Footer with Meal Tracking & Print Controls */}
          <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#0E1A14] flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Status if tracking is provided */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 dark:text-stone-400">
                {isEn ? 'Day Status:' : 'Registro de Hoy:'}
              </span>
              {status === true ? (
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold inline-flex items-center gap-1 shadow-xs">
                  <Check className="w-3.5 h-3.5" />
                  {isEn ? 'Served Today ✅' : 'Comida Dada Hoy ✅'}
                </span>
              ) : status === false ? (
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold inline-flex items-center gap-1 shadow-xs">
                  <X className="w-3.5 h-3.5" />
                  {isEn ? 'Not Served 🔴' : 'No se dio 🔴'}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                  {isEn ? 'Pending' : 'Pendiente'}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => window.print()}
                className="px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                title={isEn ? 'Print recipe' : 'Imprimir o guardar en PDF'}
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">{isEn ? 'Print' : 'Imprimir Receta'}</span>
              </button>

              {onSetStatus && (
                <>
                  <button
                    onClick={() => onSetStatus(status === false ? null : false)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      status === false
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-100 hover:text-rose-900'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Not Served' : 'No dada'}</span>
                  </button>

                  <button
                    onClick={() => onSetStatus(status === true ? null : true)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      status === true
                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{isEn ? 'Mark as Served ✅' : 'Marcar como Dada (OK) ✅'}</span>
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                {isEn ? 'Close' : 'Cerrar'}
              </button>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
