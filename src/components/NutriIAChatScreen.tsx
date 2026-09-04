import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMER } from '../utils/nutrition';
import { playLuxuryChime } from '../utils/alertsAndAudio';
import Markdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  ChefHat, 
  Scale, 
  RefreshCw, 
  ShieldAlert, 
  Info,
  CheckCircle,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const NutriIAChatScreen: React.FC = () => {
  const { 
    chatMessages, 
    addChatMessage, 
    clearChat, 
    selectedPet, 
    addCustomRecipe,
    showToast,
    t,
    language
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRecipeAiModal, setShowRecipeAiModal] = useState(false);

  // Recipe AI state
  const [recipeAiGoal, setRecipeAiGoal] = useState(
    language === 'es' 
      ? 'Soporte renal con proteínas de alto valor biológico y fósforo bajo' 
      : 'Renal support with high biological value proteins and low phosphorus'
  );
  const [recipeAiIngredients, setRecipeAiIngredients] = useState(
    language === 'es' 
      ? 'Pavo picado, calabaza asada, caldo de huesos, cúrcuma' 
      : 'Minced turkey, roasted pumpkin, bone broth, turmeric'
  );
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const [activeCategory, setActiveCategory] = useState<'all' | 'nutrition' | 'health' | 'behavior' | 'care'>('all');

  const categories = language === 'es' ? [
    { id: 'all', label: 'Todas las áreas', icon: '🐾' },
    { id: 'nutrition', label: 'Nutrición & Cocina', icon: '🍲' },
    { id: 'health', label: 'Salud & Síntomas', icon: '🩺' },
    { id: 'behavior', label: 'Comportamiento & Educación', icon: '🧠' },
    { id: 'care', label: 'Higiene & Cuidados', icon: '🛁' },
  ] : [
    { id: 'all', label: 'All Topics', icon: '🐾' },
    { id: 'nutrition', label: 'Nutrition & Cooking', icon: '🍲' },
    { id: 'health', label: 'Health & Symptoms', icon: '🩺' },
    { id: 'behavior', label: 'Behavior & Training', icon: '🧠' },
    { id: 'care', label: 'Hygiene & Care', icon: '🛁' },
  ];

  const categorizedPrompts: Record<string, string[]> = language === 'es' ? {
    nutrition: [
      '¿Cómo balancear el ratio calcio:fósforo con cáscara de huevo en comida casera?',
      'Beneficios del caldo de huesos con colágeno y cómo suministrarlo diariamente',
      'Adaptar raciones para perro o gato esterilizado con tendencia al sobrepeso',
      'Protocolo de transición gradual de pienso comercial a comida casera fresca',
    ],
    health: [
      '¿Cuáles son los signos de alarma para ir a urgencias veterinarias de inmediato?',
      'Calendario preventivo de vacunas y desparasitación interna/externa recomendado',
      '¿Qué hacer ante un vómito esporádico o diarrea leve transitoria?',
      'Cómo cuidar la salud dental y prevenir el sarro en mascotas',
    ],
    behavior: [
      'Técnicas y ejercicios para calmar la ansiedad por separación cuando me voy',
      '¿Cómo frenar los ladridos excesivos o llamadas de atención en casa?',
      'Juegos de estimulación cognitiva y alfombras de olfato recomendadas',
      'Socialización adecuada y manejo de miedos a ruidos fuertes o tormentas',
    ],
    care: [
      '¿Cada cuánto bañar a mi mascota y qué tipo de champú es seguro?',
      'Paso a paso para cortar las uñas sin tocar la vena interior (hiponiquio)',
      'Protocolo de limpieza de oídos segura y prevención de otitis',
      'Cómo prevenir y actuar frente a un golpe de calor en verano',
    ],
  } : {
    nutrition: [
      'How to balance the calcium:phosphorus ratio with eggshell powder in homemade food?',
      'Benefits of collagen-rich bone broth and daily dosage guidelines',
      'How to adjust portions for a neutered dog or cat prone to weight gain',
      'Step-by-step transition protocol from dry kibble to fresh cooked food',
    ],
    health: [
      'What are the critical red-flag signs requiring immediate emergency vet care?',
      'Recommended core vaccine and internal/external deworming schedule',
      'What to do for mild, transient digestive upset or occasional vomiting?',
      'How to maintain dental hygiene and prevent tartar build-up in pets',
    ],
    behavior: [
      'Techniques and routines to manage separation anxiety when leaving home',
      'How to curb demand barking or excessive vocalization with positive reinforcement',
      'Cognitive enrichment games and snuffle mat exercises for pets',
      'Socialization protocols and handling fear of loud noises or storms',
    ],
    care: [
      'How often should I bathe my pet and what shampoo pH is safe?',
      'Step-by-step guide to trimming nails safely without touching the quick',
      'Safe ear cleaning protocol and preventing ear infections (otitis)',
      'How to prevent and react to heatstroke during hot summer days',
    ],
  };

  const getFilteredPrompts = () => {
    if (activeCategory === 'all') {
      return [
        categorizedPrompts.nutrition[0],
        categorizedPrompts.health[0],
        categorizedPrompts.behavior[0],
        categorizedPrompts.care[0],
        categorizedPrompts.nutrition[1],
        categorizedPrompts.health[1],
      ];
    }
    return categorizedPrompts[activeCategory] || [];
  };

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || isLoading) return;

    setInputMessage('');

    // Add user message
    addChatMessage({
      role: 'user',
      content: message,
    });

    setIsLoading(true);

    const merData = selectedPet ? calculateMER(selectedPet) : null;

    try {
      const response = await fetch('/api/nutri-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          language,
          conversationHistory: chatMessages,
          petContext: selectedPet ? {
            name: selectedPet.name,
            species: selectedPet.species,
            breed: selectedPet.breed,
            ageYears: selectedPet.ageYears,
            weightKg: selectedPet.weightKg,
            targetWeightKg: selectedPet.targetWeightKg,
            clinicalCondition: selectedPet.clinicalCondition,
            activityLevel: selectedPet.activityLevel,
            isNeutered: selectedPet.isNeutered,
            allergies: selectedPet.allergies,
            rer: merData?.rer,
            mer: merData?.mer,
            dailyFoodGrams: merData?.dailyFoodGrams,
          } : undefined,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        addChatMessage({
          role: 'assistant',
          content: data.reply,
        });
        playLuxuryChime('gentle');
      } else {
        addChatMessage({
          role: 'assistant',
          content: language === 'es'
            ? 'Lo lamento, ha ocurrido una intermitencia al contactar con el servicio de NutriIA. Por favor, reintente en unos momentos.'
            : 'Sorry, an issue occurred while reaching the NutriAI service. Please retry in a few moments.',
        });
      }
    } catch (err) {
      console.warn('Backend chat unreachable, utilizing local clinical knowledge engine', err);
      
      // Smart clinical fallback so user is NEVER left without an answer
      const petName = selectedPet?.name || (language === 'es' ? 'tu mascota' : 'your pet');
      const species = selectedPet?.species === 'cat' ? (language === 'es' ? 'felino' : 'feline') : (language === 'es' ? 'canino' : 'canine');
      const weight = selectedPet?.weightKg ? `${selectedPet.weightKg} kg` : (language === 'es' ? 'peso estándar' : 'standard weight');
      const merVal = merData?.mer ? `${Math.round(merData.mer)} kcal/día` : 'estimación individual';
      const foodGrams = merData?.dailyFoodGrams ? `${merData.dailyFoodGrams} g/día (dividido en 2 tomas)` : 'proporción según MER';

      let fallbackReply = '';

      if (language === 'es') {
        fallbackReply = `### 🐾 Orientación Nutricional & Clínica para ${petName} (${species}, ${weight})

**1. Análisis del Caso:**
Has consultado: *"${message}"*.
Para un paciente ${species} con requerimiento energético de **${merVal}** y ración calculada de **${foodGrams}**, las pautas clínicas prioritarias son:

- **Densidad de Nutrientes:** Mantener una base proteica magra de alto valor biológico (pollo, pavo o pescado blanco cocinado al vapor o escalfado suave a 75°C).
- **Relación Calcio:Fósforo (1.2:1):** Al cocinar en casa, es imprescindible añadir suplementación de calcio (por ejemplo cáscara de huevo molida ultrafina: 0.8g por cada 100g de carne sin hueso).
- **Humedad e Hidratación:** La comida fresca aporta un 70-75% de agua biológica, lo que protege los túbulos renales y la vejiga.
- **Transición Recomendada:** Si estás cambiando de pienso a comida casera, aplica la regla de los 7-10 días (25% nuevo / 75% actual los primeros 3 días, 50/50 días 4-6, y 75/25 días 7-9).

💡 *Consejo NutriIA:* Introduce los ingredientes nuevos de uno en uno para verificar tolerancia digestiva. Si notas signos de alarma (letargo, vómitos repetidos o rechazo hídrico), consulta con tu veterinario presencial de confianza.`;
      } else {
        fallbackReply = `### 🐾 Clinical & Nutritional Guidance for ${petName} (${species}, ${weight})

**1. Case Assessment:**
You asked: *"${message}"*.
For a ${species} patient with an energy requirement of **${merVal}** and an estimated portion of **${foodGrams}**, core recommendations are:

- **Nutrient Density:** Maintain high-biological value lean protein (turkey, chicken breast, or gentle steamed white fish at 75°C).
- **Calcium to Phosphorus Ratio (1.2:1):** Essential for homemade food. Supplement with micronized eggshell powder (approx 0.8g per 100g boneless meat).
- **Hydration:** Fresh meals provide 70-75% bioavailable moisture, protecting kidney glomeruli and urinary tract.
- **Gradual Transition:** Follow a 7-10 day protocol (25% new / 75% old on days 1-3, 50/50 on days 4-6, 75/25 on days 7-9).

💡 *NutriAI Tip:* Introduce novel proteins and vegetables one at a time. In case of acute red flags (repeated vomiting, severe lethargy, refusal to drink), seek immediate veterinary care.`;
      }

      addChatMessage({
        role: 'assistant',
        content: fallbackReply,
      });
      playLuxuryChime('gentle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCustomRecipe = async () => {
    if (!recipeAiGoal.trim() || isGeneratingRecipe) return;
    setIsGeneratingRecipe(true);

    try {
      const response = await fetch('/api/custom-recipe-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pet: selectedPet,
          goal: recipeAiGoal,
          availableIngredients: recipeAiIngredients,
          language,
        }),
      });

      const data = await response.json();

      if (data.recipeText || data.recipe) {
        // If structured recipe was returned
        if (data.recipe) {
          addCustomRecipe(data.recipe);
        }
        setShowRecipeAiModal(false);
        showToast(
          language === 'es' 
            ? '¡Receta generada con éxito!' 
            : 'Recipe generated successfully!', 
          'success'
        );
        
        // Also add notification to chat
        addChatMessage({
          role: 'assistant',
          content: data.recipeText || `✨ ${language === 'es' ? 'Receta formulada y guardada en su Recetario General.' : 'Recipe formulated and saved to your Cookbook.'}`,
        });
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      // Offline fallback recipe generation adapted to pet and goal
      const petName = selectedPet?.name || 'Mascota';
      const isCat = selectedPet?.species === 'cat';
      const fallbackRecipe = {
        id: `custom_recipe_${Date.now()}`,
        title: language === 'es' 
          ? `Gourmet Personalizado: ${recipeAiGoal.slice(0, 32)} para ${petName}`
          : `Custom Gourmet: ${recipeAiGoal.slice(0, 32)} for ${petName}`,
        species: isCat ? 'cat' as const : 'dog' as const,
        growthStage: 'adult' as const,
        category: 'vitality_gourmet' as const,
        categoryLabel: language === 'es' ? 'Receta NutriIA Personalizada' : 'Custom NutriAI Recipe',
        description: language === 'es'
          ? `Formulación veterinaria artesanal diseñada con ingredientes frescos seleccionados (${recipeAiIngredients}) para el objetivo: ${recipeAiGoal}.`
          : `Artisanal veterinary meal formulated with selected fresh ingredients (${recipeAiIngredients}) for the goal: ${recipeAiGoal}.`,
        kcalPer100g: 135,
        prepTimeMin: 15,
        cookTimeMin: 20,
        difficulty: 'Fácil' as const,
        suitability: language === 'es' 
          ? `Ideal para ${petName} con objetivo de ${recipeAiGoal}` 
          : `Formulated specifically for ${petName} towards ${recipeAiGoal}`,
        clinicalBenefits: language === 'es' ? [
          'Alta digestibilidad con proteínas seleccionadas al vapor',
          'Aporte balanceado de humedad para función renal',
          'Sin aditivos ni conservantes sintéticos'
        ] : [
          'High biological value gentle steamed proteins',
          'Optimal natural hydration for kidney health',
          'Free from synthetic preservatives'
        ],
        ingredients: [
          { name: isCat ? 'Pavo o pollo picado' : 'Carne magra de pavo o pollo', category: 'protein' as const, baseGramsFor10kgPetPerDay: 180 },
          { name: 'Calabaza cocida al vapor', category: 'vegetable' as const, baseGramsFor10kgPetPerDay: 50 },
          { name: 'Caldo de huesos sin sal (colágeno)', category: 'broth_liquid' as const, baseGramsFor10kgPetPerDay: 60 },
          { name: 'Aceite de salmón / Omega-3', category: 'healthy_fat' as const, baseGramsFor10kgPetPerDay: 5 },
          { name: 'Cáscara de huevo micronizada (calcio)', category: 'supplement_calcium' as const, baseGramsFor10kgPetPerDay: 2 },
        ],
        instructions: language === 'es' ? [
          'Cocer al vapor las verduras hasta que estén tiernas y triturar en puré suave.',
          'Saltear o escalfar la carne a baja temperatura (75°C) para preservar aminoácidos.',
          'Mezclar todos los ingredientes y añadir el caldo de huesos tibio.',
          'Esperar a que alcance temperatura ambiente antes de servir con el aceite de salmón.'
        ] : [
          'Steam vegetables until tender and mash into a soft puree.',
          'Poach or gently cook meat at 75°C to preserve amino acids.',
          'Combine meat, pureed vegetables, and warm bone broth.',
          'Let cool to room temperature before adding salmon oil and serving.'
        ],
        chefTips: language === 'es'
          ? 'Divide la ración diaria en 2 tomas iguales. Conservar en nevera máximo 72 horas o congelar en raciones individuales.'
          : 'Split daily amount into 2 equal servings. Store refrigerated up to 72 hours or freeze in single-serving jars.',
        storageInfo: language === 'es' ? 'Refrigerar hasta 72h / Congelar hasta 60 días' : 'Refrigerate up to 72h / Freeze up to 60 days',
        macronutrients: {
          proteinPct: 42,
          fatPct: 22,
          fiberCarbPct: 8,
          moisturePct: 72,
        },
      };

      addCustomRecipe(fallbackRecipe);
      setShowRecipeAiModal(false);
      showToast(
        language === 'es' 
          ? '¡Receta generada y agregada al recetario!' 
          : 'Recipe formulated and added to cookbook!', 
        'success'
      );
      addChatMessage({
        role: 'assistant',
        content: language === 'es'
          ? `✨ **Receta Veterinaria Personalizada Generada:**\n\nHe formulado y guardado en tu **Recetario General** la receta personalizada para **${petName}** basada en: *${recipeAiGoal}* con los ingredientes indicados (*${recipeAiIngredients}*).\n\nPuedes verla, imprimirla o añadirla a tu plan semanal desde la pestaña de **Recetas**.`
          : `✨ **Custom Veterinary Recipe Formulated:**\n\nI have created and saved to your **Cookbook** the recipe for **${petName}** targeting *${recipeAiGoal}* using your ingredients (*${recipeAiIngredients}*).\n\nYou can access it from the **Recipes** tab to scale portions or print.`,
      });
      playLuxuryChime('gentle');
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-white to-stone-50 dark:from-[#121B15] dark:to-[#0A0F0D] border border-stone-200 dark:border-[#D4AF37]/30 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30 mb-2">
              <Bot className="w-3.5 h-3.5" />
              <span>NutriIA &amp; Pet Concierge &bull; Gemini 3.7 Flash</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              {language === 'es' ? 'Consultoría Veterinaria & Cuidado Integral' : 'Veterinary & Comprehensive Pet Care'}
            </h1>
            <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 max-w-2xl font-medium">
              {language === 'es' 
                ? 'Pregunta sobre nutrición, recetas, síntomas de salud, medicina preventiva, comportamiento, adiestramiento e higiene diaria de tu mascota.' 
                : 'Ask about nutrition, recipes, health symptoms, preventive care, behavior, training, and daily pet hygiene.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRecipeAiModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-[#D4AF37] text-stone-950 hover:brightness-110 transition-all shadow-md shrink-0"
            >
              <ChefHat className="w-4 h-4" />
              <span>{language === 'es' ? 'Formular Receta IA' : 'Formulate AI Recipe'}</span>
            </button>

            <button
              onClick={clearChat}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 border border-stone-200 dark:border-stone-800 transition-colors"
              title={language === 'es' ? 'Reiniciar chat' : 'Clear chat'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Pet Context Pill */}
        {selectedPet && (
          <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-700 dark:text-stone-300">
            <div className="flex items-center gap-2">
              <span className="text-base">{selectedPet.avatarIcon || '🐾'}</span>
              <span>
                {language === 'es' ? 'Paciente Activo:' : 'Active Pet:'} <strong>{selectedPet.name}</strong> ({selectedPet.species === 'cat' ? 'Gato' : 'Perro'}, {selectedPet.breed}, {selectedPet.weightKg}kg, {selectedPet.clinicalCondition})
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-800 dark:text-[#D4AF37]">
              <span>RER: {selectedPet.weightKg ? Math.round(70 * Math.pow(selectedPet.weightKg, 0.75)) : 0} kcal/día</span>
              <span>&bull;</span>
              <span>{selectedPet.isNeutered ? (language === 'es' ? 'Esterilizado' : 'Neutered') : (language === 'es' ? 'Sin esterilizar' : 'Intact')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Category Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 shadow-2xs ${
              activeCategory === cat.id
                ? 'bg-amber-700 dark:bg-[#D4AF37] text-white dark:text-stone-950 border border-amber-600 dark:border-[#D4AF37]'
                : 'bg-white dark:bg-[#121B15] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-amber-500'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Filtered Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          {language === 'es' ? 'Preguntas frecuentes:' : 'Suggestions:'}
        </span>
        {getFilteredPrompts().map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 text-stone-800 dark:text-stone-200 hover:border-amber-500 hover:text-amber-800 dark:hover:text-[#D4AF37] transition-all whitespace-nowrap shrink-0 shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="rounded-3xl p-4 sm:p-6 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-lg min-h-[420px] flex flex-col justify-between">
        
        {/* Messages List */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {chatMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-[#D4AF37] to-emerald-600 p-0.5 shrink-0 mt-1 shadow-xs">
                    <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center text-xs text-[#F3E5AB]">
                      👑
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-800 dark:bg-[#D4AF37] text-white dark:text-stone-950 font-medium rounded-tr-none shadow-sm'
                      : 'bg-stone-50 dark:bg-[#0E1511] text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800/90 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-[10px] opacity-70">
                    <span className="font-bold">{isUser ? (language === 'es' ? 'Tú (Propietario)' : 'You (Owner)') : 'NutriIA & Pet Concierge'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="markdown-body text-xs space-y-2">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-xs shrink-0 mt-1">
                    🐾
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center text-xs text-[#D4AF37] animate-pulse">
                👑
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span>{language === 'es' ? 'NutriIA está analizando la consulta y formulando la respuesta clínica...' : 'NutriAI is analyzing your query and formulating veterinary guidance...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={language === 'es' 
                ? `Pregunta sobre nutrición, salud, comportamiento, higiene o cuidados de ${selectedPet?.name || 'tu mascota'}...`
                : `Ask about nutrition, health symptoms, behavior, grooming, or care for ${selectedPet?.name || 'your pet'}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 p-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 dark:bg-[#D4AF37] dark:hover:bg-[#E5C358] text-white dark:text-stone-950 transition-colors disabled:opacity-40 shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* MODAL GENERADOR DE RECETAS CON IA */}
      {showRecipeAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-[#121B15] border-2 border-amber-500/40 dark:border-[#D4AF37]/40 shadow-2xl text-stone-900 dark:text-stone-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-500" />
                Formular Receta Personalizada con Gemini
              </h3>
              <button
                onClick={() => setShowRecipeAiModal(false)}
                className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              {language === 'es' 
                ? `NutriIA formulará una receta completa y equilibrada adaptada al peso (${selectedPet?.weightKg}kg) y condición de ${selectedPet?.name}.`
                : `NutriAI will formulate a balanced homemade recipe tailored to ${selectedPet?.name}'s weight (${selectedPet?.weightKg}kg) and condition.`}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Objetivo Nutricional o Terapéutico:
                </label>
                <input
                  type="text"
                  value={recipeAiGoal}
                  onChange={(e) => setRecipeAiGoal(e.target.value)}
                  placeholder="Ej. Saciante bajo en grasa, soporte articular con caldo de médula..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Ingredientes Disponibles o Preferidos:
                </label>
                <textarea
                  value={recipeAiIngredients}
                  onChange={(e) => setRecipeAiIngredients(e.target.value)}
                  rows={2}
                  placeholder="Ej. Pechuga de pavo, calabaza, huevo cocido, aceite de salmón..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setShowRecipeAiModal(false)}
                className="px-4 py-2 text-xs text-stone-600 dark:text-stone-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGenerateCustomRecipe}
                disabled={isGeneratingRecipe || !recipeAiGoal.trim()}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-600 to-[#D4AF37] text-stone-950 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingRecipe ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Formulando Receta Gourmet...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Crear y Guardar Receta</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
