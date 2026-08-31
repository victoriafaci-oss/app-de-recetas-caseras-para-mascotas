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

  const quickPrompts = language === 'es' ? [
    '¿Cómo balancear el ratio calcio:fósforo con cáscara de huevo en comida casera?',
    'Beneficios del caldo de huesos con colágeno y cómo suministrarlo diariamente',
    'Adaptar raciones para perro o gato esterilizado con tendencia al sobrepeso',
    'Protocolo de transición gradual de pienso comercial a dieta casera cocinada',
  ] : [
    'How to balance the calcium:phosphorus ratio with eggshell powder in homemade pet food?',
    'Benefits of collagen-rich bone broth and daily dosage guidelines',
    'How to adjust portions for a neutered dog or cat prone to weight gain',
    'Step-by-step transition protocol from dry kibble to fresh cooked food',
  ];

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
      console.error('Chat error', err);
      addChatMessage({
        role: 'assistant',
        content: language === 'es'
          ? 'No se pudo establecer conexión con el servidor. Verifique su conexión y vuelva a intentarlo.'
          : 'Could not connect to the server. Please check your connection and retry.',
      });
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
        showToast(language === 'es' ? 'Error al generar la receta personalizada.' : 'Error generating custom recipe.', 'warning');
      }
    } catch (err) {
      console.error('Recipe AI error', err);
      showToast(language === 'es' ? 'Error de comunicación con el motor de recetas IA.' : 'Communication error with AI recipe engine.', 'warning');
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
              NutriIA Concierge &bull; Gemini 2.5
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              Consultoría Culinaria & Nutricional
            </h1>
            <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 max-w-xl font-medium">
              Asesoría gastronómica canina y felina, cálculos energéticos y formulación de dietas terapéuticas seguras.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRecipeAiModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-[#D4AF37] text-stone-950 hover:brightness-110 transition-all shadow-md"
            >
              <ChefHat className="w-4 h-4" />
              <span>Generar Receta con IA</span>
            </button>

            <button
              onClick={clearChat}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 border border-stone-200 dark:border-stone-800 transition-colors"
              title="Reiniciar chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Pet Context Pill */}
        {selectedPet && (
          <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
            <div className="flex items-center gap-2">
              <span className="text-base">{selectedPet.avatarIcon || '🐾'}</span>
              <span>
                Contexto activo: <strong>{selectedPet.name}</strong> ({selectedPet.breed}, {selectedPet.weightKg}kg, {selectedPet.clinicalCondition})
              </span>
            </div>
            <span className="hidden md:inline text-[11px] text-emerald-800 dark:text-[#D4AF37] font-semibold">
              RER {selectedPet.weightKg ? Math.round(70 * Math.pow(selectedPet.weightKg, 0.75)) : 0} kcal &bull; MER activo
            </span>
          </div>
        )}
      </div>

      {/* Quick Prompts Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Sugerencias:
        </span>
        {quickPrompts.map((prompt, idx) => (
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
                    <span className="font-bold">{isUser ? 'Tú (Propietario)' : 'NutriIA Concierge'}</span>
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
                <span>NutriIA está analizando el perfil veterinario y formulando la respuesta...</span>
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
              placeholder={`Consulte sobre la alimentación de ${selectedPet?.name || 'su mascota'}, caldos o restricciones...`}
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
