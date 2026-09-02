export type ThemeMode = 'dark' | 'light';

export type Language = 'es' | 'en';

export type Species = 'dog' | 'cat';

export type ClinicalCondition = 
  | 'healthy'
  | 'renal'
  | 'weight_loss'
  | 'joint_support'
  | 'sensitive_digestive'
  | 'allergies'
  | 'cardiac'
  | 'senior_vitality';

export type ActivityLevel = 'sedentary' | 'moderate' | 'active' | 'working';

export interface WeightRecord {
  date: string;
  weightKg: number;
  note?: string;
}

export interface WalkRecord {
  id: string;
  date: string;
  time: string;
  durationMin: number;
  distanceKm: number;
  notes: string;
}

export interface CookedRecipeRecord {
  id: string;
  recipeId: string;
  recipeTitle: string;
  date: string;
  daysPrepared: number;
  totalGrams: number;
  totalKcal: number;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  ageYears: number;
  ageMonths: number;
  gender: 'male' | 'female';
  isNeutered: boolean;
  weightKg: number;
  targetWeightKg: number;
  bodyConditionScore: number; // 1-9 (1-3: Underweight, 4-5: Ideal, 6-7: Overweight, 8-9: Obese)
  activityLevel: ActivityLevel;
  clinicalCondition: ClinicalCondition;
  allergies: string;
  avatarUrl: string;
  avatarIcon: string;
  avatarColor: string;
  bathFrequencyDays: number;
  lastBathDate: string;
  todayWaterMl: number;
  todayBrothMl: number;
  todayWaterTargetMl?: number;
  weightHistory: WeightRecord[];
  walksHistory: WalkRecord[];
  cookedRecipesHistory: CookedRecipeRecord[];
}

export type EventCategory = 
  | 'medication' 
  | 'water_broth' 
  | 'walk' 
  | 'veterinary' 
  | 'vaccine_deworm' 
  | 'treatment' 
  | 'grooming_bath';

export interface HealthEvent {
  id: string;
  petId: string;
  petName: string;
  title: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'every_12h' | 'every_8h';
  dosage?: string;
  notes?: string;
  completed: boolean;
  completedAt?: string;
  alarmSound: boolean;
}

export interface RecipeIngredient {
  name: string;
  category: 'protein' | 'vegetable' | 'fiber_carb' | 'healthy_fat' | 'supplement_calcium' | 'broth_liquid';
  baseGramsFor10kgPetPerDay: number;
  notes?: string;
}

export type GrowthStage = 'puppy_kitten' | 'adult' | 'senior' | 'all';

export type PetSection = 'overview' | 'recipes' | 'hydration' | 'walks' | 'agenda' | 'weight' | 'hygiene' | 'edit';

export interface Recipe {
  id: string;
  title: string;
  frenchTitle?: string;
  species: 'dog' | 'cat' | 'both';
  growthStage?: GrowthStage;
  category: 'renal' | 'weight_control' | 'sensitive_digestion' | 'collagen_broth' | 'healthy_snacks' | 'joint_omega3' | 'vitality_gourmet';
  categoryLabel: string;
  description: string;
  imageUrl?: string;
  kcalPer100g: number;
  prepTimeMin: number;
  cookTimeMin: number;
  difficulty: 'Fácil' | 'Media' | 'Avanzada' | 'Facile' | 'Intermédiaire' | 'Haute Cuisine';
  suitability: string;
  clinicalBenefits: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  chefTips: string;
  storageInfo: string;
  macronutrients: {
    proteinPct: number;
    fatPct: number;
    fiberCarbPct: number;
    moisturePct: number;
  };
}

export interface ToxicFood {
  id: string;
  name: string;
  scientificOrCommon: string;
  speciesAffected: 'all' | 'dog' | 'cat';
  severity: 'lethal' | 'high' | 'moderate' | 'caution';
  severityLabel: string;
  toxicCompound: string;
  symptoms: string[];
  emergencyAction: string;
  safeAlternatives: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  petName?: string;
}

export type NavigationTab = 
  | 'home' 
  | 'pet_profile' 
  | 'weekly_plan' 
  | 'recipes' 
  | 'agenda' 
  | 'concierge' 
  | 'toxic_foods';

export interface DailyMealItem {
  id: string;
  title: string;
  category: 'dish1' | 'dish2';
  mealSlot: 'morning' | 'night';
  description: string;
  portionGrams: number;
  kcal: number;
  ingredients: { name: string; grams: number; category: string }[];
  instructions: string[];
  clinicalBenefits: string[];
  chefTip?: string;
}

export interface DailySnackItem {
  id: string;
  title: string;
  portion: string;
  description: string;
  benefits: string;
  ingredients: string[];
  instructions?: string[];
  chefTip?: string;
  kcal?: number;
}

export interface DailyDessertItem {
  id: string;
  title: string;
  portion: string;
  description: string;
  benefits: string;
  ingredients: string[];
  instructions?: string[];
  chefTip?: string;
  kcal?: number;
  isFrozenOrGelatin?: boolean;
}

export interface DayDietPlan {
  dayIndex: number; // 0 = Lunes, 6 = Domingo
  dayNameEs: string;
  dayNameEn: string;
  dish1: DailyMealItem;
  dish2: DailyMealItem;
  snack1: DailySnackItem;
  snack2: DailySnackItem;
  dessert1: DailyDessertItem;
  dessert2: DailyDessertItem;
  exerciseTarget: {
    durationMin: number;
    activityTypeEs: string;
    activityTypeEn: string;
    notesEs: string;
    notesEn: string;
  };
}

export interface DailyTrackingRecord {
  dish1Given: boolean | null; // true: Verde (Sí), false: Rojo (No), null: Pendiente
  dish2Given: boolean | null;
  snack1Given: boolean | null;
  snack2Given: boolean | null;
  dessert1Given: boolean | null;
  dessert2Given: boolean | null;
  exerciseCompleted: boolean;
  exerciseDurationMin: number;
  exerciseType?: string;
  exerciseNotes?: string;
}

export type WeeklyTrackingMap = {
  [petId: string]: {
    [dateKey: string]: DailyTrackingRecord; // Key: YYYY-MM-DD
  };
};
