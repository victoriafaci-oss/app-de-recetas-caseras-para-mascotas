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

export interface Recipe {
  id: string;
  title: string;
  frenchTitle?: string;
  species: 'dog' | 'cat' | 'both';
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
