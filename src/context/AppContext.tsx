import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pet, HealthEvent, Recipe, ChatMessage, ThemeMode, Language } from '../types';
import { INITIAL_PETS, INITIAL_EVENTS, RECIPES_CATALOG } from '../data/mockData';
import { playLuxuryChime } from '../utils/alertsAndAudio';
import { getTranslation, TranslationKey, TRANSLATIONS } from '../utils/translations';
import confetti from 'canvas-confetti';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  pets: Pet[];
  selectedPetId: string;
  selectedPet: Pet;
  selectPet: (id: string) => void;
  addPet: (petData: Omit<Pet, 'id' | 'weightHistory' | 'walksHistory' | 'cookedRecipesHistory' | 'todayWaterMl' | 'todayBrothMl'>) => boolean;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  events: HealthEvent[];
  addEvent: (eventData: Omit<HealthEvent, 'id' | 'completed' | 'completedAt'>) => void;
  toggleEventCompleted: (id: string) => void;
  deleteEvent: (id: string) => void;
  activeAlarm: HealthEvent | null;
  triggerAlarmTest: (event: HealthEvent) => void;
  dismissAlarm: () => void;
  addWaterMl: (petId: string, amountMl: number) => void;
  addBrothMl: (petId: string, amountMl: number) => void;
  resetHydration: (petId: string) => void;
  addWalkRecord: (petId: string, walk: { durationMin: number; distanceKm: number; notes: string; time: string }) => void;
  addWeightRecord: (petId: string, weightKg: number, note?: string) => void;
  recordBathToday: (petId: string) => void;
  recordCookedMeal: (petId: string, record: { recipeId: string; recipeTitle: string; daysPrepared: number; totalGrams: number; totalKcal: number }) => void;
  activeTab: 'home' | 'pet_profile' | 'agenda' | 'recipes' | 'concierge' | 'toxic_foods';
  setActiveTab: (tab: 'home' | 'pet_profile' | 'agenda' | 'recipes' | 'concierge' | 'toxic_foods') => void;
  goBack: () => void;
  goToHome: () => void;
  tabHistory: ('home' | 'pet_profile' | 'agenda' | 'recipes' | 'concierge' | 'toxic_foods')[];
  customRecipes: Recipe[];
  addCustomRecipe: (recipe: Recipe) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  exportAllData: () => void;
  importAllData: (jsonData: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const THEME_KEY = 'nutripet_theme_v1';
const LANG_KEY = 'nutripet_language_v1';
const PETS_KEY = 'nutripet_pets_v1';
const EVENTS_KEY = 'nutripet_events_v1';
const RECIPES_KEY = 'nutripet_custom_recipes_v1';
const CHAT_KEY = 'nutripet_chat_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark'; // Default: Atelier Royal Dark & Gold
    }
    return 'dark';
  });

  // Language state (default: 'es' with translator to 'en' in settings menu next to dark/light mode)
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'es' || saved === 'en') return saved;
      return 'es';
    }
    return 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_KEY, lang);
    }
  };

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  // Pets state (max 4)
  const [pets, setPets] = useState<Pet[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(PETS_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error('Error parsing stored pets', e);
        }
      }
    }
    return INITIAL_PETS;
  });

  const [selectedPetId, setSelectedPetId] = useState<string>(() => pets[0]?.id || 'pet-1');

  // Events state
  const [events, setEvents] = useState<HealthEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(EVENTS_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.error('Error parsing stored events', e);
        }
      }
    }
    return INITIAL_EVENTS;
  });

  // Navigation tab state with history tracking
  const [activeTab, setActiveTabState] = useState<'home' | 'pet_profile' | 'agenda' | 'recipes' | 'concierge' | 'toxic_foods'>('home');
  const [tabHistory, setTabHistory] = useState<('home' | 'pet_profile' | 'agenda' | 'recipes' | 'concierge' | 'toxic_foods')[]>(['home']);

  const setActiveTab = (tab: 'home' | 'pet_profile' | 'agenda' | 'recipes' | 'concierge' | 'toxic_foods') => {
    setActiveTabState(prev => {
      if (prev !== tab) {
        setTabHistory(h => [...h, tab]);
      }
      return tab;
    });
  };

  const goBack = () => {
    setTabHistory(prevHistory => {
      if (prevHistory.length > 1) {
        const newHistory = [...prevHistory];
        newHistory.pop(); // remove current
        const previousTab = newHistory[newHistory.length - 1] || 'home';
        setActiveTabState(previousTab);
        return newHistory;
      }
      setActiveTabState('home');
      return ['home'];
    });
  };

  const goToHome = () => {
    setActiveTabState('home');
    setTabHistory(prev => [...prev, 'home']);
  };

  // Custom AI recipes
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(RECIPES_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.error('Error parsing stored recipes', e);
        }
      }
    }
    return [];
  });

  // Chat conversation
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CHAT_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error('Error parsing stored chat', e);
        }
      }
    }
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: 'Bienvenido al **Atelier NutriPet Haute Cuisine & Health**.\n\nSoy **NutriIA Concierge**, su asistente especializado en nutrición de precisión, cálculo energético veterinario (RER / MER) y formulación culinaria casera para perros y gatos.\n\n¿En qué puedo asistir la salud y el menú gastronómico de sus compañeros hoy?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });

  // Active alarm modal for live testing & reminders
  const [activeAlarm, setActiveAlarm] = useState<HealthEvent | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(PETS_KEY, JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(customRecipes));
  }, [customRecipes]);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(chatMessages));
  }, [chatMessages]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    playLuxuryChime('gentle');
  };

  const selectedPet = pets.find(p => p.id === selectedPetId) || pets[0] || INITIAL_PETS[0];

  const selectPet = (id: string) => {
    setSelectedPetId(id);
    playLuxuryChime('gentle');
  };

  const addPet = (petData: Omit<Pet, 'id' | 'weightHistory' | 'walksHistory' | 'cookedRecipesHistory' | 'todayWaterMl' | 'todayBrothMl'>): boolean => {
    if (pets.length >= 4) {
      showToast('Ha alcanzado el límite máximo de 4 perfiles en el Atelier.', 'warning');
      return false;
    }

    const newPet: Pet = {
      ...petData,
      id: `pet-${Date.now()}`,
      todayWaterMl: 0,
      todayBrothMl: 0,
      weightHistory: [
        { date: new Date().toISOString().split('T')[0], weightKg: petData.weightKg, note: 'Perfil inicial creado' }
      ],
      walksHistory: [],
      cookedRecipesHistory: [],
    };

    setPets(prev => [...prev, newPet]);
    setSelectedPetId(newPet.id);
    showToast(`¡Perfil de ${newPet.name} creado con éxito!`, 'success');
    playLuxuryChime('success');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    return true;
  };

  const updatePet = (id: string, updates: Partial<Pet>) => {
    setPets(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Ficha de la mascota actualizada.', 'success');
  };

  const deletePet = (id: string) => {
    if (pets.length <= 1) {
      showToast('Debe conservar al menos un perfil de mascota en el atelier.', 'warning');
      return;
    }
    const petToDelete = pets.find(p => p.id === id);
    setPets(prev => prev.filter(p => p.id !== id));
    if (selectedPetId === id) {
      const remaining = pets.filter(p => p.id !== id);
      if (remaining[0]) setSelectedPetId(remaining[0].id);
    }
    showToast(`Perfil de ${petToDelete?.name || 'Mascota'} eliminado.`, 'info');
  };

  const addEvent = (eventData: Omit<HealthEvent, 'id' | 'completed' | 'completedAt'>) => {
    const newEvent: HealthEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      completed: false,
    };
    setEvents(prev => [newEvent, ...prev]);
    showToast('Evento añadido a la agenda médica.', 'success');
    playLuxuryChime('success');
  };

  const toggleEventCompleted = (id: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === id) {
        const nextState = !evt.completed;
        if (nextState) {
          playLuxuryChime('success');
          confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
        }
        return {
          ...evt,
          completed: nextState,
          completedAt: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        };
      }
      return evt;
    }));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('Aviso eliminado de la agenda.', 'info');
  };

  const triggerAlarmTest = (event: HealthEvent) => {
    setActiveAlarm(event);
    playLuxuryChime('reminder');
  };

  const dismissAlarm = () => {
    setActiveAlarm(null);
  };

  const addWaterMl = (petId: string, amountMl: number) => {
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        const newTotal = (p.todayWaterMl || 0) + amountMl;
        return { ...p, todayWaterMl: newTotal };
      }
      return p;
    }));
    playLuxuryChime('gentle');
    showToast(`+${amountMl}ml de agua fresca registrados.`, 'success');
  };

  const addBrothMl = (petId: string, amountMl: number) => {
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        const newTotal = (p.todayBrothMl || 0) + amountMl;
        return { ...p, todayBrothMl: newTotal };
      }
      return p;
    }));
    playLuxuryChime('gentle');
    showToast(`+${amountMl}ml de caldo con colágeno registrados.`, 'success');
  };

  const resetHydration = (petId: string) => {
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        return { ...p, todayWaterMl: 0, todayBrothMl: 0 };
      }
      return p;
    }));
    showToast('Contador de hidratación reiniciado para hoy.', 'info');
  };

  const addWalkRecord = (petId: string, walk: { durationMin: number; distanceKm: number; notes: string; time: string }) => {
    const record = {
      id: `walk-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...walk,
    };
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        return { ...p, walksHistory: [record, ...p.walksHistory] };
      }
      return p;
    }));
    showToast(`Paseo de ${walk.durationMin} min registrado.`, 'success');
    playLuxuryChime('success');
  };

  const addWeightRecord = (petId: string, weightKg: number, note?: string) => {
    const record = {
      date: new Date().toISOString().split('T')[0],
      weightKg,
      note: note || 'Control rutinario',
    };
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        return {
          ...p,
          weightKg,
          weightHistory: [...p.weightHistory, record],
        };
      }
      return p;
    }));
    showToast(`Peso actualizado a ${weightKg} kg.`, 'success');
    playLuxuryChime('success');
  };

  const recordBathToday = (petId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        return { ...p, lastBathDate: todayStr };
      }
      return p;
    }));
    showToast('¡Baño e higiene registrados hoy!', 'success');
    playLuxuryChime('success');
    confetti({ particleCount: 35, spread: 55, origin: { y: 0.8 } });
  };

  const recordCookedMeal = (petId: string, record: { recipeId: string; recipeTitle: string; daysPrepared: number; totalGrams: number; totalKcal: number }) => {
    const cookedEntry = {
      id: `cook-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...record,
    };
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        return {
          ...p,
          cookedRecipesHistory: [cookedEntry, ...p.cookedRecipesHistory],
        };
      }
      return p;
    }));
    showToast(`¡Receta "${record.recipeTitle}" cocinada y registrada en la memoria!`, 'success');
    playLuxuryChime('success');
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const addCustomRecipe = (recipe: Recipe) => {
    setCustomRecipes(prev => [recipe, ...prev]);
    showToast('Receta personalizada guardada en el recetario.', 'success');
    playLuxuryChime('success');
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Conversación reiniciada. ¿En qué puedo orientar la nutrición de su mascota?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    showToast('Historial de chat reiniciado.', 'info');
  };

  const exportAllData = () => {
    const backup = {
      pets,
      events,
      customRecipes,
      theme,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NutriPet_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Copia de seguridad del Atelier descargada.', 'success');
  };

  const importAllData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.pets && Array.isArray(data.pets)) setPets(data.pets);
      if (data.events && Array.isArray(data.events)) setEvents(data.events);
      if (data.customRecipes && Array.isArray(data.customRecipes)) setCustomRecipes(data.customRecipes);
      if (data.theme && (data.theme === 'dark' || data.theme === 'light')) setTheme(data.theme);
      showToast('Datos del Atelier restaurados con éxito.', 'success');
      playLuxuryChime('success');
      return true;
    } catch (err) {
      showToast('Error al importar el archivo JSON.', 'warning');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        t,
        pets,
        selectedPetId,
        selectedPet,
        selectPet,
        addPet,
        updatePet,
        deletePet,
        events,
        addEvent,
        toggleEventCompleted,
        deleteEvent,
        activeAlarm,
        triggerAlarmTest,
        dismissAlarm,
        addWaterMl,
        addBrothMl,
        resetHydration,
        addWalkRecord,
        addWeightRecord,
        recordBathToday,
        recordCookedMeal,
        activeTab,
        setActiveTab,
        goBack,
        goToHome,
        tabHistory,
        customRecipes,
        addCustomRecipe,
        chatMessages,
        addChatMessage,
        clearChat,
        toast,
        showToast,
        exportAllData,
        importAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
