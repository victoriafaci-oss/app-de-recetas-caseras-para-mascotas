import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Pet, 
  HealthEvent, 
  Recipe, 
  ChatMessage, 
  ThemeMode, 
  Language, 
  NavigationTab, 
  WeeklyTrackingMap, 
  DailyTrackingRecord,
  UserSubscription,
  SubscriptionPlanId,
  PaymentMethodType,
  PricingPlan
} from '../types';
import { INITIAL_PETS, INITIAL_EVENTS, RECIPES_CATALOG } from '../data/mockData';
import { PRICING_PLANS } from '../data/pricingData';
import { playLuxuryChime } from '../utils/alertsAndAudio';
import { getTranslation, TranslationKey, TRANSLATIONS } from '../utils/translations';
import confetti from 'canvas-confetti';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
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
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  goBack: () => void;
  goToHome: () => void;
  tabHistory: NavigationTab[];
  weeklyTracking: WeeklyTrackingMap;
  setMealStatus: (petId: string, dateKey: string, mealType: 'dish1' | 'dish2' | 'snack1' | 'snack2' | 'dessert1' | 'dessert2', status: boolean | null) => void;
  setExerciseStatus: (petId: string, dateKey: string, completed: boolean, durationMin?: number, notes?: string) => void;
  getTrackingForDay: (petId: string, dateKey: string) => DailyTrackingRecord;
  customRecipes: Recipe[];
  addCustomRecipe: (recipe: Recipe) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  activePetSection: 'all' | 'recipes' | 'hydration' | 'walks' | 'agenda' | 'weight' | 'hygiene';
  setActivePetSection: (section: 'all' | 'recipes' | 'hydration' | 'walks' | 'agenda' | 'weight' | 'hygiene') => void;
  navigateToPetSection: (petId: string, section: 'all' | 'recipes' | 'hydration' | 'walks' | 'agenda' | 'weight' | 'hygiene') => void;
  clearAllDataToBlank: () => void;
  loadSampleReferenceData: () => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  exportAllData: () => void;
  importAllData: (jsonData: string) => boolean;
  // Subscription & Payment Gateway state
  subscription: UserSubscription | null;
  isSubscribed: boolean;
  showPaymentModal: boolean;
  setShowPaymentModal: (show: boolean) => void;
  activateSubscription: (
    planId: SubscriptionPlanId, 
    method: PaymentMethodType, 
    details?: { phoneNumber?: string; cardLast4?: string; transactionId?: string }
  ) => Promise<boolean>;
  cancelOrResetSubscription: () => void;
  currentPricingPlan: PricingPlan | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const THEME_KEY = 'nutripet_theme_v1';
const LANG_KEY = 'nutripet_language_v1';
const PETS_KEY = 'nutripet_pets_v1';
const EVENTS_KEY = 'nutripet_events_v1';
const RECIPES_KEY = 'nutripet_custom_recipes_v1';
const CHAT_KEY = 'nutripet_chat_v1';
const WEEKLY_TRACKING_KEY = 'nutripet_weekly_tracking_v1';
const SUBSCRIPTION_KEY = 'nutripet_subscription_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Subscription & Payment Gateway state
  const [subscription, setSubscription] = useState<UserSubscription | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SUBSCRIPTION_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object' && parsed.status === 'active') {
            return parsed;
          }
        } catch (e) {
          console.error('Error parsing stored subscription', e);
        }
      }
    }
    return null;
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isSubscribed = Boolean(
    subscription &&
    subscription.status === 'active' &&
    (subscription.isLifetime || !subscription.expiresAt || new Date(subscription.expiresAt).getTime() > Date.now())
  );

  const currentPricingPlan = PRICING_PLANS.find(p => p.id === subscription?.planId);

  useEffect(() => {
    if (subscription) {
      localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    } else {
      localStorage.removeItem(SUBSCRIPTION_KEY);
    }
  }, [subscription]);

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
  const [activeTab, setActiveTabState] = useState<NavigationTab>('home');
  const [tabHistory, setTabHistory] = useState<NavigationTab[]>(['home']);

  const setActiveTab = (tab: NavigationTab) => {
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

  // Weekly meal & exercise tracking (stored by petId and dateKey YYYY-MM-DD)
  const [weeklyTracking, setWeeklyTracking] = useState<WeeklyTrackingMap>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(WEEKLY_TRACKING_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') return parsed;
        } catch (e) {
          console.error('Error parsing stored weekly tracking', e);
        }
      }
    }
    // Seed initial realistic compliance state for demo pets
    const today = new Date().toISOString().split('T')[0];
    return {
      'pet-1': {
        [today]: {
          dish1Given: true,
          dish2Given: null, // Pending evening
          snack1Given: true,
          snack2Given: null,
          dessert1Given: true,
          dessert2Given: null,
          exerciseCompleted: true,
          exerciseDurationMin: 45,
          exerciseType: 'Paseo matutino de olfato',
          exerciseNotes: 'Muy buen ritmo y relajado.',
        }
      }
    };
  });

  const getTrackingForDay = (petId: string, dateKey: string): DailyTrackingRecord => {
    const petMap = weeklyTracking[petId] || {};
    return petMap[dateKey] || {
      dish1Given: null,
      dish2Given: null,
      snack1Given: null,
      snack2Given: null,
      dessert1Given: null,
      dessert2Given: null,
      exerciseCompleted: false,
      exerciseDurationMin: 0,
    };
  };

  const setMealStatus = (
    petId: string, 
    dateKey: string, 
    mealType: 'dish1' | 'dish2' | 'snack1' | 'snack2' | 'dessert1' | 'dessert2', 
    status: boolean | null
  ) => {
    setWeeklyTracking(prev => {
      const petRecords = prev[petId] || {};
      const dayRecord = petRecords[dateKey] || {
        dish1Given: null,
        dish2Given: null,
        snack1Given: null,
        snack2Given: null,
        dessert1Given: null,
        dessert2Given: null,
        exerciseCompleted: false,
        exerciseDurationMin: 0,
      };

      const updatedRecord: DailyTrackingRecord = {
        ...dayRecord,
        [`${mealType}Given`]: status,
      };

      return {
        ...prev,
        [petId]: {
          ...petRecords,
          [dateKey]: updatedRecord,
        },
      };
    });

    if (status === true) {
      playLuxuryChime('success');
      showToast(
        language === 'es' 
          ? 'Plato registrado como servido (Verde).' 
          : 'Meal recorded as served (Green).', 
        'success'
      );
    } else if (status === false) {
      playLuxuryChime('gentle');
      showToast(
        language === 'es' 
          ? 'Plato marcado como no dado (Rojo).' 
          : 'Meal marked as not served (Red).', 
        'warning'
      );
    }
  };

  const setExerciseStatus = (
    petId: string, 
    dateKey: string, 
    completed: boolean, 
    durationMin: number = 30, 
    notes: string = ''
  ) => {
    setWeeklyTracking(prev => {
      const petRecords = prev[petId] || {};
      const dayRecord = petRecords[dateKey] || {
        dish1Given: null,
        dish2Given: null,
        snack1Given: null,
        snack2Given: null,
        dessert1Given: null,
        dessert2Given: null,
        exerciseCompleted: false,
        exerciseDurationMin: 0,
      };

      const updatedRecord: DailyTrackingRecord = {
        ...dayRecord,
        exerciseCompleted: completed,
        exerciseDurationMin: durationMin,
        exerciseNotes: notes || dayRecord.exerciseNotes,
      };

      return {
        ...prev,
        [petId]: {
          ...petRecords,
          [dateKey]: updatedRecord,
        },
      };
    });

    if (completed) {
      playLuxuryChime('success');
      showToast(
        language === 'es' 
          ? `¡Ejercicio registrado! (${durationMin} min realizados)` 
          : `Exercise logged! (${durationMin} min completed)`, 
        'success'
      );
    }
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
        content: 'Bienvenido a **Recetas caseras para mascotas**.\n\nSoy **NutriIA**, su asistente especializado en nutrición casera, cálculo calórico veterinario (RER / MER) y recetas equilibradas para perros y gatos.\n\n¿En qué puedo ayudarle hoy con la alimentación o cuidados de sus mascotas?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });

  // Active alarm modal for live testing & reminders
  const [activeAlarm, setActiveAlarm] = useState<HealthEvent | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Sync to localStorage and document attributes
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
    document.documentElement.lang = language;
    document.title = language === 'en' 
      ? 'Homemade Pet Recipes - Homemade Nutrition & Daily Care'
      : 'Recetas caseras para mascotas - Nutrición casera y hábitos diarios';
  }, [language]);

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

  useEffect(() => {
    localStorage.setItem(WEEKLY_TRACKING_KEY, JSON.stringify(weeklyTracking));
  }, [weeklyTracking]);

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
      showToast('Ha alcanzado el límite máximo de 4 perfiles de mascotas.', 'warning');
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
    const petToDelete = pets.find(p => p.id === id);
    const remaining = pets.filter(p => p.id !== id);
    setPets(remaining);
    if (remaining.length > 0) {
      if (selectedPetId === id) {
        setSelectedPetId(remaining[0].id);
      }
    } else {
      setSelectedPetId('');
    }
    showToast(language === 'es' ? `Perfil de ${petToDelete?.name || 'Mascota'} eliminado.` : `Profile of ${petToDelete?.name || 'Pet'} deleted.`, 'info');
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
      weeklyTracking,
      theme,
      language,
      exportedAt: new Date().toISOString(),
      version: '1.1',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PetRecetas_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Copia de seguridad descargada.', 'success');
  };

  // Active Pet Sub-Section
  const [activePetSection, setActivePetSection] = useState<'all' | 'recipes' | 'hydration' | 'walks' | 'agenda' | 'weight' | 'hygiene'>('all');

  const navigateToPetSection = (petId: string, section: 'all' | 'recipes' | 'hydration' | 'walks' | 'agenda' | 'weight' | 'hygiene') => {
    setSelectedPetId(petId);
    setActivePetSection(section);
    setActiveTab('pet_profile');
    playLuxuryChime('gentle');
  };

  const clearAllDataToBlank = () => {
    setPets([]);
    setEvents([]);
    setCustomRecipes([]);
    setWeeklyTracking({});
    setSelectedPetId('');
    localStorage.removeItem(PETS_KEY);
    localStorage.removeItem(EVENTS_KEY);
    localStorage.removeItem(RECIPES_KEY);
    localStorage.removeItem(WEEKLY_TRACKING_KEY);
    setActiveTab('home');
    showToast(language === 'es' ? 'Modo datos reales activo. Perfiles listos para rellenar.' : 'Fresh slate ready for your real pet data.', 'info');
    playLuxuryChime('gentle');
  };

  const loadSampleReferenceData = () => {
    setPets(INITIAL_PETS);
    setEvents(INITIAL_EVENTS);
    setSelectedPetId(INITIAL_PETS[0]?.id || 'pet-1');
    localStorage.setItem(PETS_KEY, JSON.stringify(INITIAL_PETS));
    localStorage.setItem(EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
    setActiveTab('home');
    showToast(language === 'es' ? 'Ejemplo de referencia cargado.' : 'Reference sample loaded.', 'success');
    playLuxuryChime('success');
  };

  const importAllData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.pets && Array.isArray(data.pets)) setPets(data.pets);
      if (data.events && Array.isArray(data.events)) setEvents(data.events);
      if (data.customRecipes && Array.isArray(data.customRecipes)) setCustomRecipes(data.customRecipes);
      if (data.weeklyTracking && typeof data.weeklyTracking === 'object') setWeeklyTracking(data.weeklyTracking);
      if (data.theme && (data.theme === 'dark' || data.theme === 'light')) setTheme(data.theme);
      showToast('Datos restaurados con éxito.', 'success');
      playLuxuryChime('success');
      return true;
    } catch (err) {
      showToast('Error al importar el archivo JSON.', 'warning');
      return false;
    }
  };

  const activateSubscription = async (
    planId: SubscriptionPlanId, 
    method: PaymentMethodType, 
    details?: { phoneNumber?: string; cardLast4?: string; transactionId?: string }
  ): Promise<boolean> => {
    const planConfig = PRICING_PLANS.find(p => p.id === planId) || PRICING_PLANS[0];
    const now = Date.now();
    let expiresAt: string | null = null;
    let billingPeriod: '48h_trial' | 'monthly' | 'annual' | 'lifetime' = 'monthly';

    if (planId === 'free_trial_48h') {
      expiresAt = new Date(now + 48 * 3600 * 1000).toISOString();
      billingPeriod = '48h_trial';
    } else if (planId === 'monthly') {
      expiresAt = new Date(now + 30 * 24 * 3600 * 1000).toISOString();
      billingPeriod = 'monthly';
    } else if (planId === 'annual') {
      expiresAt = new Date(now + 365 * 24 * 3600 * 1000).toISOString();
      billingPeriod = 'annual';
    } else if (planId === 'lifetime') {
      expiresAt = null;
      billingPeriod = 'lifetime';
    }

    const newSub: UserSubscription = {
      status: 'active',
      planId,
      planTitle: `${planConfig.title} (${planConfig.priceFormatted})`,
      amountEur: planConfig.priceEur,
      billingPeriod,
      paymentMethod: method,
      activatedAt: new Date().toISOString(),
      expiresAt,
      phoneNumber: details?.phoneNumber,
      transactionId: details?.transactionId || `TX-${Date.now().toString(36).toUpperCase()}`,
      isLifetime: planId === 'lifetime',
    };

    setSubscription(newSub);
    setShowPaymentModal(false);
    playLuxuryChime('success');
    confetti({ particleCount: 65, spread: 85, origin: { y: 0.6 } });

    showToast(
      language === 'es'
        ? `¡Tarifa "${planConfig.title}" activada con éxito! Bienvenido a la app.`
        : `"${planConfig.title}" activated successfully! Welcome to the app.`,
      'success'
    );
    return true;
  };

  // Automatically activate subscription when returning from Stripe or PayPal checkout URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        const plan = (params.get('plan') as SubscriptionPlanId) || 'lifetime';
        const provider = (params.get('provider') as PaymentMethodType) || 'stripe';
        const sessionId = params.get('session_id') || `STRIPE_SES_${Date.now()}`;
        activateSubscription(plan, provider, { transactionId: sessionId });
        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch {
          // ignore in sandboxed environments
        }
      }
    }
  }, []);

  const cancelOrResetSubscription = () => {
    setSubscription(null);
    localStorage.removeItem(SUBSCRIPTION_KEY);
    showToast(
      language === 'es'
        ? 'Modalidad de pago restablecida. Redirigiendo a pasarela de bienvenida.'
        : 'Payment mode reset. Redirecting to welcome gateway.',
      'info'
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
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
        weeklyTracking,
        setMealStatus,
        setExerciseStatus,
        getTrackingForDay,
        customRecipes,
        addCustomRecipe,
        chatMessages,
        addChatMessage,
        clearChat,
        activePetSection,
        setActivePetSection,
        navigateToPetSection,
        clearAllDataToBlank,
        loadSampleReferenceData,
        toast,
        showToast,
        exportAllData,
        importAllData,
        subscription,
        isSubscribed,
        showPaymentModal,
        setShowPaymentModal,
        activateSubscription,
        cancelOrResetSubscription,
        currentPricingPlan,
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
