import { Pet, HealthEvent, Recipe, ToxicFood } from '../types';
import { MASTER_RECIPES, MASTER_SNACKS_DESSERTS } from './recipesDatabase';
import { EXTENDED_RECIPES } from './extendedRecipes';
import { REMAINING_RECIPES } from './allRemainingRecipes';
import { DOG_PUPPY_RECIPES } from './recipesDogsPuppies';
import { DOG_ADULT_RECIPES } from './recipesDogsAdults';
import { DOG_SENIOR_RECIPES } from './recipesDogsSeniors';
import { CAT_KITTEN_RECIPES } from './recipesCatsKittens';
import { CAT_ADULT_RECIPES } from './recipesCatsAdults';
import { CAT_SENIOR_RECIPES } from './recipesCatsSeniors';
import { HIGH_PERFORMANCE_DOG_RECIPES } from './recipesHighPerformanceDogs';

export const EVENT_CATEGORIES = [
  { id: 'medication', label: 'Medicación / Pastillas', icon: '💊' },
  { id: 'water_broth', label: 'Agua / Caldos', icon: '💧' },
  { id: 'walk', label: 'Pasear / Ejercicio', icon: '🐕' },
  { id: 'cognitive_enrichment', label: 'Estimulación Mental & Olfato', icon: '🧠' },
  { id: 'veterinary', label: 'Veterinario / Cita', icon: '🏥' },
  { id: 'vaccine_deworm', label: 'Vacunas / Desparasitación', icon: '💉' },
  { id: 'treatment', label: 'Tratamiento / Curas', icon: '🩹' },
  { id: 'grooming_bath', label: 'Baño / Peluquería', icon: '🛁' },
];

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Sir Leopold de Bordeaux',
    species: 'dog',
    breed: 'Golden Retriever',
    ageYears: 5,
    ageMonths: 6,
    gender: 'male',
    isNeutered: true,
    weightKg: 28.5,
    targetWeightKg: 27.0,
    bodyConditionScore: 6,
    activityLevel: 'moderate',
    clinicalCondition: 'joint_support',
    allergies: 'Sensibilidad a cereales con gluten y pollo industrial',
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    avatarIcon: '🐕',
    avatarColor: 'from-amber-600 to-yellow-800',
    bathFrequencyDays: 21,
    lastBathDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    todayWaterMl: 950,
    todayBrothMl: 300,
    todayWaterTargetMl: 1550,
    weightHistory: [
      { date: '2026-06-01', weightKg: 29.8, note: 'Inicio de plan nutricional casero' },
      { date: '2026-07-01', weightKg: 29.2, note: 'Mayor agilidad en paseos largos' },
      { date: '2026-08-01', weightKg: 28.7, note: 'Excelente tono muscular y brillo en manto' },
      { date: '2026-08-28', weightKg: 28.5, note: 'Peso actual en control regular' },
    ],
    walksHistory: [
      { id: 'walk-1', date: new Date().toISOString().split('T')[0], time: '08:30', durationMin: 45, distanceKm: 3.2, notes: 'Paseo matutino por el parque, trote suave' },
      { id: 'walk-2', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '19:15', durationMin: 35, distanceKm: 2.6, notes: 'Paseo vespertino relajado con ejercicios olfativos' },
      { id: 'walk-3', date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], time: '09:00', durationMin: 50, distanceKm: 3.8, notes: 'Senderismo suave en bosque' },
    ],
    cookedRecipesHistory: [
      {
        id: 'cook-1',
        recipeId: 'rec-joint-dog',
        recipeTitle: 'Estofado Royale de Salmón Salvaje & Patas con Colágeno',
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        daysPrepared: 4,
        totalGrams: 3400,
        totalKcal: 4400,
      }
    ],
  },
  {
    id: 'pet-2',
    name: 'Madame Minette de Lyon',
    species: 'cat',
    breed: 'Gata Persa Chinchilla',
    ageYears: 4,
    ageMonths: 2,
    gender: 'female',
    isNeutered: true,
    weightKg: 4.2,
    targetWeightKg: 4.0,
    bodyConditionScore: 5,
    activityLevel: 'sedentary',
    clinicalCondition: 'renal',
    allergies: 'Ninguna detectada',
    avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    avatarIcon: '🐈',
    avatarColor: 'from-emerald-700 to-teal-900',
    bathFrequencyDays: 45,
    lastBathDate: new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0],
    todayWaterMl: 90,
    todayBrothMl: 120,
    todayWaterTargetMl: 210,
    weightHistory: [
      { date: '2026-06-15', weightKg: 4.4, note: 'Revisión renal preventiva' },
      { date: '2026-07-20', weightKg: 4.3, note: 'Buena respuesta a caldos sin sal' },
      { date: '2026-08-25', weightKg: 4.2, note: 'Parámetros renales estables' },
    ],
    walksHistory: [
      { id: 'walk-cat-1', date: new Date().toISOString().split('T')[0], time: '11:00', durationMin: 20, distanceKm: 0.2, notes: 'Sesión de juego interactivo con caña de plumas' },
    ],
    cookedRecipesHistory: [
      {
        id: 'cook-2',
        recipeId: 'rec-renal-cat',
        recipeTitle: 'Mousse Imperial de Conejo y Caldo Dorado Renal',
        date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        daysPrepared: 3,
        totalGrams: 540,
        totalKcal: 780,
      }
    ],
  },
  {
    id: 'pet-3',
    name: 'Thor von Valkyrie',
    species: 'dog',
    breed: 'Border Collie (Línea de Trabajo)',
    ageYears: 2,
    ageMonths: 4,
    gender: 'male',
    isNeutered: false,
    weightKg: 20.0,
    targetWeightKg: 20.0,
    bodyConditionScore: 5,
    activityLevel: 'high_performance',
    clinicalCondition: 'high_performance_hyperactivity',
    allergies: 'Ninguna detectada. Tolerancia digestiva óptima a carne fresca.',
    avatarUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
    avatarIcon: '🐕',
    avatarColor: 'from-blue-600 to-indigo-900',
    bathFrequencyDays: 30,
    lastBathDate: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    todayWaterMl: 1400,
    todayBrothMl: 400,
    todayWaterTargetMl: 1600,
    weightHistory: [
      { date: '2026-06-01', weightKg: 19.5, note: 'Inicio de pauta de alta energía (3.5% peso corporal)' },
      { date: '2026-07-01', weightKg: 19.8, note: 'Tono muscular excelente, gran resistencia' },
      { date: '2026-08-01', weightKg: 20.0, note: 'Masa magra definida y energía equilibrada' },
      { date: '2026-08-28', weightKg: 20.0, note: 'Peso óptimo mantenido' },
    ],
    walksHistory: [
      { id: 'walk-thor-1', date: new Date().toISOString().split('T')[0], time: '07:30', durationMin: 60, distanceKm: 6.5, notes: 'Canicross y series de carrera con recuperación' },
      { id: 'walk-thor-2', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '18:00', durationMin: 50, distanceKm: 4.8, notes: 'Circuito de agility y obediencia' },
    ],
    cookedRecipesHistory: [
      {
        id: 'cook-thor-1',
        recipeId: 'hp-dog-31',
        recipeTitle: 'Súper Guiso Energético de Res con Arroz Integral',
        date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        daysPrepared: 3,
        totalGrams: 2100,
        totalKcal: 3255,
      }
    ],
  }
];

export const INITIAL_EVENTS: HealthEvent[] = [
  {
    id: 'evt-thor-1',
    petId: 'pet-3',
    petName: 'Thor von Valkyrie',
    title: '🧠 Sesión de Olfato: Juego de Cajas Autónomo',
    category: 'cognitive_enrichment',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    recurrence: 'daily',
    dosage: '15-20 minutos',
    notes: '5 cajas de cartón con premios de alto valor ocultos. Disminuye cortisol y canaliza la hiperactividad mediante búsqueda olfativa.',
    completed: true,
    completedAt: '11:20',
    alarmSound: true,
  },
  {
    id: 'evt-thor-2',
    petId: 'pet-3',
    petName: 'Thor von Valkyrie',
    title: '🧊 Kong Congelado Terapéutico (Mousse Luna)',
    category: 'cognitive_enrichment',
    date: new Date().toISOString().split('T')[0],
    time: '16:00',
    recurrence: 'daily',
    dosage: '1 Kong relleno de Mousse Receta 41 congelado 4h',
    notes: 'El lamido prolongado libera endorfinas, relajando el sistema nervioso simpático hacia el descanso reparador.',
    completed: false,
    alarmSound: true,
  },
  {
    id: 'evt-1',
    petId: 'pet-1',
    petName: 'Sir Leopold de Bordeaux',
    title: 'Condroprotector & Omega-3 (EPA/DHA)',
    category: 'medication',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    recurrence: 'daily',
    dosage: '1 comprimido articular + 2.5ml aceite de salmón',
    notes: 'Mezclar con el desayuno casero.',
    completed: true,
    completedAt: '09:05',
    alarmSound: true,
  },
  {
    id: 'evt-2',
    petId: 'pet-1',
    petName: 'Sir Leopold de Bordeaux',
    title: 'Tazón de Caldo de Huesos con Colágeno',
    category: 'water_broth',
    date: new Date().toISOString().split('T')[0],
    time: '15:30',
    recurrence: 'daily',
    dosage: '150ml tibio',
    notes: 'Refuerzo de hidratación vespertina para riñones y articulaciones.',
    completed: false,
    alarmSound: true,
  },
  {
    id: 'evt-3',
    petId: 'pet-1',
    petName: 'Sir Leopold de Bordeaux',
    title: 'Paseo Vespertino & Ejercicio de Olfato',
    category: 'walk',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    recurrence: 'daily',
    dosage: '40 minutos',
    notes: 'Ruta con césped para amortiguación articular.',
    completed: false,
    alarmSound: true,
  },
  {
    id: 'evt-4',
    petId: 'pet-2',
    petName: 'Madame Minette de Lyon',
    title: 'Quelante Renal con Mousse de Conejo',
    category: 'medication',
    date: new Date().toISOString().split('T')[0],
    time: '08:30',
    recurrence: 'daily',
    dosage: '1/2 cacito de carbonato cálcico microtriturado',
    notes: 'Homogeneizar perfectamente con la ración matinal.',
    completed: true,
    completedAt: '08:40',
    alarmSound: true,
  },
  {
    id: 'evt-5',
    petId: 'pet-2',
    petName: 'Madame Minette de Lyon',
    title: 'Fuente de Agua Fresca & Caldo de Codorniz',
    category: 'water_broth',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    recurrence: 'daily',
    dosage: '60ml',
    notes: 'Estimular el consumo hídrico para prevención de cristales.',
    completed: false,
    alarmSound: false,
  },
  {
    id: 'evt-6',
    petId: 'pet-1',
    petName: 'Sir Leopold de Bordeaux',
    title: 'Revisión Veterinaria & Ecografía Articular',
    category: 'veterinary',
    date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    time: '11:00',
    recurrence: 'none',
    dosage: 'Clínica Veterinaria San Francisco',
    notes: 'Control semestral de displasia y perfil hematológico completo.',
    completed: false,
    alarmSound: true,
  },
  {
    id: 'evt-7',
    petId: 'pet-1',
    petName: 'Sir Leopold de Bordeaux',
    title: 'Sesión Spa & Baño Dermoprotector con Avena',
    category: 'grooming_bath',
    date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    time: '16:00',
    recurrence: 'monthly',
    dosage: 'Champú pH neutro canino + limpieza auricular',
    notes: 'Cumple el ciclo de 21 días desde el último baño.',
    completed: false,
    alarmSound: true,
  }
];

const INITIAL_BASE_RECIPES: Recipe[] = [
  {
    id: 'rec-joint-dog',
    title: 'Estofado Royale de Salmón Salvaje & Patas con Colágeno',
    frenchTitle: 'Mijoté Royal au Saumon Sauvage & Collagène',
    species: 'dog',
    growthStage: 'adult',
    category: 'joint_omega3',
    categoryLabel: 'Articulaciones & Longevidad',
    description: 'Receta casera equilibrada para perros, formulada para regenerar cartílago, reducir inflamación y aportar brillo al manto mediante ácidos grasos EPA/DHA y colágeno natural cocinado a fuego lento.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 138,
    prepTimeMin: 20,
    cookTimeMin: 45,
    difficulty: 'Media',
    suitability: 'Perros adultos, seniors y razas propensas a displasia o desgaste articular.',
    clinicalBenefits: [
      'Colágeno Tipo II soluble de patas de pollo cocinadas a baja temperatura',
      'Ratio óptimo Omega-3 / Omega-6 (EPA 650mg, DHA 480mg por porción)',
      'Aporte de glucosamina y condroitina natural',
      'Antioxidantes de arándanos silvestres y microdosis de cúrcuma con piperina'
    ],
    ingredients: [
      { name: 'Lomo de Salmón fresco o Trucha desespinada', category: 'protein', baseGramsFor10kgPetPerDay: 180, notes: 'Rico en ácidos grasos bioactivos y astaxantina' },
      { name: 'Pechuga o Muslo de Pavo magro picado', category: 'protein', baseGramsFor10kgPetPerDay: 100, notes: 'Proteína digestible hipoalergénica' },
      { name: 'Caldo de Gelatina de Patas de Ave (sin huesos)', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 90, notes: 'Colágeno bioasimilable al 100%' },
      { name: 'Calabacín fresco rallado al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 50, notes: 'Hidratación y fibra suave' },
      { name: 'Boniato / Batata dulce asada al horno', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 40, notes: 'Carbohidratos complejos de bajo índice glucémico' },
      { name: 'Arándanos frescos o moras silvestres', category: 'vegetable', baseGramsFor10kgPetPerDay: 15, notes: 'Polifenoles protectores de endotelio' },
      { name: 'Cáscara de huevo molida (polvo ultrafino)', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 4.5, notes: 'Aporte de carbonato de calcio puro' },
      { name: 'Pasta Dorada (Cúrcuma + Aceite de Coco Virgen)', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: 'Poderoso modulador inflamatorio articular' }
    ],
    instructions: [
      'Paso 1: Cocinar al vapor el lomo de salmón y el pavo magro a 80°C durante 12 minutos para preservar los aminoácidos y no oxidar las grasas nobles.',
      'Paso 2: Cocer el boniato hasta que esté tierno y machacarlo suavemente con tenedor.',
      'Paso 3: Rallar el calabacín en crudo o escaldarlo durante 2 minutos en agua hirviendo.',
      'Paso 4: Templar el caldo de gelatina de colágeno e integrar el polvo de cáscara de huevo y la pasta dorada de cúrcuma.',
      'Paso 5: Emplatar en el tazón uniendo las proteínas en lascas nobles, el puré de boniato, las verduras y verter el caldo dorado. Coronar con arándanos frescos.'
    ],
    chefTips: 'Para un aroma irresistible, calienta ligeramente la porción a 37°C (temperatura corporal de presa) antes de servir.',
    storageInfo: 'Conservar en recipientes de cristal herméticos en refrigeración hasta 4 días o congelar en raciones diarias individuales hasta 3 meses.',
    macronutrients: {
      proteinPct: 48,
      fatPct: 32,
      fiberCarbPct: 20,
      moisturePct: 74
    }
  },
  {
    id: 'rec-puppy-power',
    title: 'Festín de Crecimiento Puppy: Ternera, Huevo & Calostro',
    frenchTitle: 'Festin Croissance Chiot: Bœuf, Œuf & Colostrum',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'vitality_gourmet',
    categoryLabel: 'Cachorros & Desarrollo Óseo',
    description: 'Fórmula casera formulada para el desarrollo esquelético y muscular de cachorros en fase de crecimiento activo con ratios de calcio/fósforo clínicos.',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 165,
    prepTimeMin: 20,
    cookTimeMin: 30,
    difficulty: 'Media',
    suitability: 'Cachorros de perro desde el destete hasta 12-18 meses de edad.',
    clinicalBenefits: [
      'Balance óptimo Calcio:Fósforo (1.3:1) para mineralización de cartílago de crecimiento',
      'Proteína de alto valor biológico para síntesis miofibrilar',
      'Ácidos grasos DHA para desarrollo cognitivo y agudeza visual'
    ],
    ingredients: [
      { name: 'Carne picada de Ternera tierna (15% grasa)', category: 'protein', baseGramsFor10kgPetPerDay: 210, notes: 'Hierro hemínico y aminoácidos esenciales' },
      { name: 'Huevo entero de campo cocido suave', category: 'protein', baseGramsFor10kgPetPerDay: 40, notes: 'Colina y luteína' },
      { name: 'Calabaza y zanahoria al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 60, notes: 'Fibra suave para tracto digestivo inmaduro' },
      { name: 'Arroz blanco cocido muy blando', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 40, notes: 'Energía rápida de fácil absorción' },
      { name: 'Polvo de cáscara de huevo microtriturada', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 6, notes: 'Requisito elevado de calcio para cachorros' },
      { name: 'Aceite de Hígado de Bacalao (gotas)', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 2, notes: 'Vitaminas A y D3 naturales' }
    ],
    instructions: [
      'Paso 1: Cocer ligeramente la carne de ternera en su propio jugo sin añadir sal.',
      'Paso 2: Hervir el arroz y las verduras hasta obtener una textura suave y tierna.',
      'Paso 3: Picar el huevo cocido e integrarlo con el polvo de cáscara de huevo y las gotas de aceite.',
      'Paso 4: Servir tibio repartido en 3 o 4 tomas diarias según la edad del cachorro.'
    ],
    chefTips: 'Los cachorros toleran mejor las comidas fraccionadas en 3 o 4 raciones diarias.',
    storageInfo: 'Conservar 3 días en refrigeración o congelar en porciones.',
    macronutrients: {
      proteinPct: 50,
      fatPct: 30,
      fiberCarbPct: 20,
      moisturePct: 72
    }
  },
  {
    id: 'rec-kitten-growth',
    title: 'Crema Gatito Gourmet: Pavo, Yema & Caldo Nutritivo',
    frenchTitle: 'Crème Chaton Gourmand: Dinde, Jaune d\'Œuf & Bouillon',
    species: 'cat',
    growthStage: 'puppy_kitten',
    category: 'vitality_gourmet',
    categoryLabel: 'Gatitos & Crecimiento',
    description: 'Mousse hipernutritiva con taurina natural, colágeno y proteínas de altísima digestibilidad para gatitos en pleno desarrollo.',
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 158,
    prepTimeMin: 15,
    cookTimeMin: 25,
    difficulty: 'Fácil',
    suitability: 'Gatitos desde las 6 semanas hasta los 12 meses.',
    clinicalBenefits: [
      'Concentración de taurina para desarrollo miocárdico y retina',
      'Textura en puré aterciopelado ideal para dientes de leche',
      'Hidratación celular óptima (>78%)'
    ],
    ingredients: [
      { name: 'Pechuga y muslo de Pavo picado fino', category: 'protein', baseGramsFor10kgPetPerDay: 220, notes: 'Proteína tierna libre de colágeno duro' },
      { name: 'Yema de huevo pasteurizada', category: 'protein', baseGramsFor10kgPetPerDay: 25, notes: 'Lecitina y ácidos grasos esenciales' },
      { name: 'Caldo de ave clarificado sin sal', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 80, notes: 'Base líquida nutritiva' },
      { name: 'Cáscara de huevo en polvo', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 5, notes: 'Calcio bioasimilable' },
      { name: 'Taurina pura', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 0.6, notes: 'Requisito crítico en gatitos' }
    ],
    instructions: [
      'Paso 1: Pochar el pavo en el caldo de ave a 80°C durante 10 minutos.',
      'Paso 2: Triturar hasta obtener una textura mousse ultra fina.',
      'Paso 3: Incorporar la yema, el calcio y la taurina fuera del fuego.',
      'Paso 4: Servir templado a 38°C.'
    ],
    chefTips: 'Ofrecer en un plato plano para que los bigotes del gatito no rocen los bordes.',
    storageInfo: 'Guardar 48h en nevera o congelar en cubitos.',
    macronutrients: {
      proteinPct: 56,
      fatPct: 36,
      fiberCarbPct: 8,
      moisturePct: 79
    }
  },
  {
    id: 'rec-renal-cat',
    title: 'Mousse Imperial de Conejo y Caldo Dorado Renal',
    frenchTitle: 'Mousse Impériale de Lapin & Bouillon Rénal',
    species: 'cat',
    growthStage: 'senior',
    category: 'renal',
    categoryLabel: 'Soporte Renal & Fósforo Bajo',
    description: 'Receta casera felina con carne de conejo (altamente digestible y baja en fósforo natural), hidratación reforzada y quelación natural para proteger los riñones.',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 142,
    prepTimeMin: 15,
    cookTimeMin: 35,
    difficulty: 'Fácil',
    suitability: 'Gatos con estadio I/II renal, gatos seniors o felinos que requieren máxima humedad y bajo fósforo.',
    clinicalBenefits: [
      'Fósforo ultra-reducido (<0.35% en materia seca)',
      'Proteína de conejo y clara de huevo con 98% de valor biológico',
      'Humedad superior al 78% para dilución urinaria óptima',
      'Aporte natural de taurina y complejo B'
    ],
    ingredients: [
      { name: 'Carne magra de Conejo deshuesada', category: 'protein', baseGramsFor10kgPetPerDay: 200, notes: 'Proteína noble excepcionalmente baja en fósforo' },
      { name: 'Clara de huevo cocida al vapor', category: 'protein', baseGramsFor10kgPetPerDay: 45, notes: 'Proteína pura sin fósforo' },
      { name: 'Caldo de Médula Ósea sin sal clarificado', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 90, notes: 'Sabor irresistible para felinos inapetentes' },
      { name: 'Puré de Calabaza suave al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 20, notes: 'Fibra soluble que atrapa toxinas urémicas' },
      { name: 'Aceite de Salmón salvaje o Krill puro', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 4, notes: 'Omega-3 antiinflamatorio para el tejido renal' },
      { name: 'Carbonato Cálcico (cáscara de huevo en polvo)', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 4, notes: 'Quelante natural de fósforo entérico' },
      { name: 'Taurina pura de grado farmacéutico', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 0.5, notes: 'Vital e insustituible para el miocardio y retina felina' }
    ],
    instructions: [
      'Paso 1: Pochar la carne de conejo en el caldo sin sal a fuego lento (75°C) hasta que esté tierna y jugosa.',
      'Paso 2: Cocer la clara de huevo y el puré de calabaza.',
      'Paso 3: Triturar en procesador culinario con textura mousse sedosa, agregando el caldo poco a poco.',
      'Paso 4: Añadir fuera del fuego el aceite de salmón, el carbonato cálcico y la taurina.',
      'Paso 5: Servir templado. Si el gato tiene el apetito selectivo, la textura aterciopelada y el aroma del caldo activan los receptores nasales.'
    ],
    chefTips: 'Nunca calentar en microondas a alta potencia para no degradar la taurina ni oxidar el aceite de salmón.',
    storageInfo: 'Guardar en botes de cristal al vacío por 3 días o congelar en cubiteras de silicona para descongelar porciones exactas.',
    macronutrients: {
      proteinPct: 40,
      fatPct: 42,
      fiberCarbPct: 18,
      moisturePct: 80
    }
  },
  {
    id: 'rec-weight-dog',
    title: 'Supreme de Pavo con Jardín Verde Saciante & Boniato',
    frenchTitle: 'Suprême de Dinde & Jardin Vert Satiétant',
    species: 'dog',
    growthStage: 'adult',
    category: 'weight_control',
    categoryLabel: 'Control de Peso / Saciante',
    description: 'Plato ligero pero abundante en volumen, rico en fibra prebiótica de judías verdes y calabacín, diseñado para que el perro se sienta satisfecho sin sobrepasar su presupuesto calórico diario.',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 112,
    prepTimeMin: 15,
    cookTimeMin: 30,
    difficulty: 'Facile',
    suitability: 'Perros con sobrepeso, tendencia al sedentarismo o esterilizados.',
    clinicalBenefits: [
      'Volumen gástrico incrementado sin densidad calórica',
      'Alto contenido de L-Carnitina natural del pavo para quema de lípidos',
      'Fibra que ralentiza la absorción de glucosa y previene picos de insulina',
      'Mantiene la masa muscular magra activa'
    ],
    ingredients: [
      { name: 'Pechuga de Pavo magra limpia de piel', category: 'protein', baseGramsFor10kgPetPerDay: 220, notes: '99% libre de grasa' },
      { name: 'Judías Verdes tiernas al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 80, notes: 'Fibra insoluble saciante' },
      { name: 'Calabaza asada y triturada', category: 'vegetable', baseGramsFor10kgPetPerDay: 60, notes: 'Prebióticos y betacarotenos' },
      { name: 'Calabacín en dados finos', category: 'vegetable', baseGramsFor10kgPetPerDay: 50, notes: 'Alto contenido de agua estructural' },
      { name: 'Arroz integral inflado o cocido muy blando', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 25, notes: 'Energía sostenida' },
      { name: 'Cáscara de huevo molida', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 4.5, notes: 'Calcio bioasimilable' },
      { name: 'Semillas de chía molidas hidratadas', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 4, notes: 'Mucílagos gástricos saciantes y omega-3 vegetal' }
    ],
    instructions: [
      'Paso 1: Cocer la pechuga de pavo cortada en dados medianos al vapor durante 15 minutos.',
      'Paso 2: En la misma vaporera, cocinar las judías verdes y el calabacín durante 8 minutos para dejarlos crujientes.',
      'Paso 3: Hidratar las semillas de chía en 30ml de agua tibia durante 10 minutos hasta formar un gel sedoso.',
      'Paso 4: Mezclar todos los ingredientes con el polvo de cáscara de huevo y el puré de calabaza.',
      'Paso 5: Servir en dos tomas generosas. El volumen saciará la ansiedad por comida del animal.'
    ],
    chefTips: 'El gel de chía aporta una textura melosa que a los perros les fascina y duplica el tiempo de digestión gástrica.',
    storageInfo: 'Aguanta perfecto 5 días en nevera bien cerrado.',
    macronutrients: {
      proteinPct: 52,
      fatPct: 16,
      fiberCarbPct: 32,
      moisturePct: 78
    }
  },
  {
    id: 'rec-sensitive-both',
    title: 'Velouté Calmante de Merluza Austral & Calabaza Asada',
    frenchTitle: 'Velouté Apaisant de Merluche & Potimarron',
    species: 'both',
    growthStage: 'all',
    category: 'sensitive_digestion',
    categoryLabel: 'Digestión Sensible & Gastroprotector',
    description: 'Dieta de fácil asimilación biológica para recuperar estómagos reactivos, episodios de heces blandas o transición tras problemas gástricos.',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 120,
    prepTimeMin: 15,
    cookTimeMin: 25,
    difficulty: 'Intermédiaire',
    suitability: 'Perros y gatos con intolerancias digestivas, gastritis o convalecientes.',
    clinicalBenefits: [
      'Proteína de pescado blanco ultra-digerible (índice de digestibilidad >96%)',
      'Mucílagos de calabaza y almidón resistente que regeneran la mucosa intestinal',
      'Sin alérgenos comunes ni grasas pesadas',
      'Sabor delicado y apetecible'
    ],
    ingredients: [
      { name: 'Lomos de Merluza o Bacalao fresco sin espinas', category: 'protein', baseGramsFor10kgPetPerDay: 230, notes: 'Pescado blanco bajo en histaminas' },
      { name: 'Puré de Calabaza dulce asada', category: 'vegetable', baseGramsFor10kgPetPerDay: 70, notes: 'Calmante de la pared gástrica' },
      { name: 'Caldo suave de ave o manzanilla pet-safe', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 60, notes: 'Espasmolítico y rehidratante' },
      { name: 'Zanahoria baby cocida al dente y triturada', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: 'Pectinas astringentes' },
      { name: 'Cáscara de huevo en polvo', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 4, notes: 'Calcio neutro' },
      { name: 'Kéfir de leche de cabra (opcional)', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 10, notes: 'Bacterias probióticas vivas para el microbioma' }
    ],
    instructions: [
      'Paso 1: Cocer la merluza al vapor durante 8 minutos. Desmenuzar revisando con los dedos la ausencia total de espinas.',
      'Paso 2: Asar la calabaza y hervir las zanahorias hasta que queden como mantequilla.',
      'Paso 3: Pasar las verduras con el caldo suave por la batidora hasta lograr una crema sedosa tipo velouté.',
      'Paso 4: Mezclar con las lascas de merluza, el calcio y agregar el kéfir de cabra justo antes de servir a temperatura ambiente.'
    ],
    chefTips: 'La calabaza asada tiene mucha más concentración de prebióticos que la hervida en agua.',
    storageInfo: 'Consumir en 3 días refrigerado o congelar en raciones.',
    macronutrients: {
      proteinPct: 54,
      fatPct: 18,
      fiberCarbPct: 28,
      moisturePct: 82
    }
  },
  {
    id: 'rec-bone-broth',
    title: 'Elixir de Oro: Caldo de Huesos con Colágeno & Hierbas Nobles',
    frenchTitle: 'Bouillon d\'Or: Émir de Moelle & Collagène Pur',
    species: 'both',
    growthStage: 'all',
    category: 'collagen_broth',
    categoryLabel: 'Caldos con Colágeno & Hidratación',
    description: 'El pilar fundamental de la salud articular e hidratación. Cocinado a fuego lento con vinagre de manzana bio para extraer el colágeno, prolina, glicina y minerales.',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 45,
    prepTimeMin: 15,
    cookTimeMin: 720,
    difficulty: 'Fácil',
    suitability: 'Todos los perros y gatos. Esencial para salud renal, articular e hidratación diaria.',
    clinicalBenefits: [
      'Concentración extraordinaria de Colágeno soluble y Glicina',
      'Sella las uniones estrechas intestinales contra el síndrome del intestino permeable',
      'Hidrata intensamente gatos que rechazan el agua sola',
      'Estimula el apetito en mascotas convalecientes o ancianas'
    ],
    ingredients: [
      { name: 'Huesos de ternera con médula + patas de pollo bio', category: 'protein', baseGramsFor10kgPetPerDay: 300, notes: 'Para la olla de extracción lenta (los huesos se desechan al final)' },
      { name: 'Agua pura filtrada', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 800, notes: 'Base líquida' },
      { name: 'Vinagre de manzana orgánico con la "madre"', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 15, notes: 'Ácido acético que disuelve los minerales óseos en el caldo' },
      { name: 'Apio en rama y zanahoria entera', category: 'vegetable', baseGramsFor10kgPetPerDay: 50, notes: 'Aroma y electrolitos naturales (sin cebolla ni ajo jamás)' },
      { name: 'Ramita de romero o perejil fresco', category: 'vegetable', baseGramsFor10kgPetPerDay: 5, notes: 'Antioxidantes aromáticos' }
    ],
    instructions: [
      'Paso 1: Colocar los huesos en una olla grande o Crockpot, cubrir con agua filtrada y añadir 2 cucharadas soperas de vinagre de manzana.',
      'Paso 2: Dejar reposar en frío 30 minutos para que el vinagre empiece a actuar.',
      'Paso 3: Llevar a ebullición suave, retirar la espuma superficial, añadir el apio, zanahoria y romero.',
      'Paso 4: Bajar al fuego mínimo posible y dejar cocer tapado de 16 a 24 horas.',
      'Paso 5: Colar con malla muy fina descartando TODOS los huesos cocidos (NUNCA dar huesos cocidos).',
      'Paso 6: Enfriar en nevera durante la noche. Retirar la capa sólida de grasa de la superficie. El caldo inferior debe haber gelificado como gelatina pura.'
    ],
    chefTips: 'Guárdalo en moldes de cubitos de hielo para añadir un cubito de colágeno derretido sobre cada comida.',
    storageInfo: '7 días en nevera o 6 meses congelado en porciones.',
    macronutrients: {
      proteinPct: 75,
      fatPct: 15,
      fiberCarbPct: 10,
      moisturePct: 92
    }
  },
  {
    id: 'rec-cat-tartare',
    title: 'Tartare Delicado de Ternera Pasto & Hígado con Taurina',
    frenchTitle: 'Tartare Délicat de Bœuf & Foie Riche en Taurine',
    species: 'cat',
    growthStage: 'adult',
    category: 'vitality_gourmet',
    categoryLabel: 'Vitalidad & Carnívoro Estricto',
    description: 'Receta para la fisiología carnívora del gato. Carne fresca de pasto con un 10% de hígado bio para garantizar vitamina A, zinc y taurina natural biodisponible.',
    imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 155,
    prepTimeMin: 15,
    cookTimeMin: 10,
    difficulty: 'Fácil',
    suitability: 'Gatos adultos activos, razas grandes como Maine Coon o gatos de manto largo.',
    clinicalBenefits: [
      'Taurina natural abundante para salud cardiovascular',
      'Aminoácidos esenciales metionina y cisteína para brillo del pelaje',
      'Cero azúcares y digestión sin fermentaciones bacterianas indeseadas'
    ],
    ingredients: [
      { name: 'Carne magra de Ternera de pasto en daditos', category: 'protein', baseGramsFor10kgPetPerDay: 210, notes: 'Hierro hemo y carnitina' },
      { name: 'Hígado fresco de pollo o ternera', category: 'protein', baseGramsFor10kgPetPerDay: 25, notes: 'Vitamina A, D y complejo B' },
      { name: 'Corazón de ave limpio en taquitos', category: 'protein', baseGramsFor10kgPetPerDay: 30, notes: 'Fuente suprema de taurina' },
      { name: 'Caldo clarificado de ave', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 50, notes: 'Hidratación' },
      { name: 'Cáscara de huevo en polvo', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 4.5, notes: 'Balance calcio:fósforo 1.2:1' },
      { name: 'Aceite de Krill salvaje en gotas', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: 'Fosfolípidos omega-3' }
    ],
    instructions: [
      'Paso 1: Sellar la carne en sartén durante 30 segundos por lado (marcado exterior higiénico manteniendo el interior jugoso y crudo/rosado si es de máxima calidad y previamente congelada 3 días).',
      'Paso 2: Picar a cuchillo en bocados adaptados a la mandíbula felina.',
      'Paso 3: Integrar el hígado, corazón, polvo de cáscara y aceite de krill.',
      'Paso 4: Añadir las cucharadas de caldo templado para crear un jugo aromático irresistible.'
    ],
    chefTips: 'Los gatos detectan la frescura por el olfato: sirve siempre a temperatura ambiente.',
    storageInfo: 'Consumir en 48 horas refrigerado.',
    macronutrients: {
      proteinPct: 62,
      fatPct: 30,
      fiberCarbPct: 8,
      moisturePct: 75
    }
  },
  {
    id: 'rec-snacks-gourmet',
    title: 'Bocados Crocantes de Pato & Manzana Deshidratada',
    frenchTitle: 'Croquants Délicats de Canard & Pomme Séchée',
    species: 'both',
    growthStage: 'all',
    category: 'healthy_snacks',
    categoryLabel: 'Snacks & Premios Saludables',
    description: 'Premios gourmet crujientes 100% naturales horneados a 75°C, sin aditivos, sales ni conservantes químicos.',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 220,
    prepTimeMin: 15,
    cookTimeMin: 180,
    difficulty: 'Facile',
    suitability: 'Perros y gatos para adiestramiento positivo o recompensa saludable.',
    clinicalBenefits: [
      'Mono-proteína hipoalergénica de pato',
      'Pectina natural de manzana para salud dental y microbiota',
      'Libre de gluten, azúcares y harinas de subproductos'
    ],
    ingredients: [
      { name: 'Pechuga de Pato o Pavo magra', category: 'protein', baseGramsFor10kgPetPerDay: 200, notes: 'Cortada en tiras finas de 3mm' },
      { name: 'Manzana golden sin pepitas ni corazón', category: 'vegetable', baseGramsFor10kgPetPerDay: 80, notes: 'En rodajas ultrafinas' },
      { name: 'Pizca de canela de ceilán', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 1, notes: 'Reguladora de la glucosa' }
    ],
    instructions: [
      'Paso 1: Cortar la pechuga de pato en láminas muy finas con un cuchillo bien afilado.',
      'Paso 2: Cortar la manzana en láminas circulares descartando rigurosamente semillas y corazón.',
      'Paso 3: Disponer sobre papel de horno en rejilla y espolvorear una micro-pizca de canela.',
      'Paso 4: Hornear a 75°C con la puerta del horno apenas entreabierta (o en deshidratador) durante 3 a 4 horas hasta que queden crujientes.',
      'Paso 5: Dejar enfriar por completo antes de guardar.'
    ],
    chefTips: 'Crujen con un sonido fascinante que capta la atención inmediata durante el entrenamiento.',
    storageInfo: 'Guardar en tarro de cristal hermético en lugar seco hasta 3 semanas.',
    macronutrients: {
      proteinPct: 68,
      fatPct: 20,
      fiberCarbPct: 12,
      moisturePct: 12
    }
  }
];

// Convert snacks, treats and desserts into standard Recipe models
const CONVERTED_SNACKS_DESSERTS: Recipe[] = MASTER_SNACKS_DESSERTS.map((snk) => {
  const isDessert = snk.type === 'dessert';
  const isBroth = snk.type === 'broth';
  
  return {
    id: snk.id,
    title: snk.title,
    frenchTitle: isDessert 
      ? `Dessert: ${snk.title}` 
      : (isBroth ? `Bouillon: ${snk.title}` : `Friandise: ${snk.title}`),
    species: snk.species,
    growthStage: 'all',
    category: isBroth ? 'collagen_broth' : 'healthy_snacks',
    categoryLabel: isDessert 
      ? 'Postre Casero Saludable' 
      : (isBroth ? 'Caldo & Gelatina Funcional' : 'Snack & Premio Saludable'),
    description: `${snk.description} ${snk.benefits}`,
    imageUrl: isDessert 
      ? 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80'
      : (isBroth 
          ? 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80'),
    kcalPer100g: snk.isFrozenOrGelatin ? 35 : (isDessert ? 85 : (isBroth ? 40 : 160)),
    prepTimeMin: 10,
    cookTimeMin: snk.isFrozenOrGelatin ? 0 : 20,
    difficulty: 'Fácil',
    suitability: snk.species === 'dog' 
      ? 'Perros de todas las edades y tamaños' 
      : (snk.species === 'cat' ? 'Gatos de todas las edades' : 'Perros y gatos de todas las edades'),
    clinicalBenefits: [
      snk.benefits,
      'Ingredientes 100% frescos y naturales sin conservantes ni aditivos industriales',
      'Excelente digestibilidad y palatabilidad probiótica / prebiótica'
    ],
    ingredients: snk.ingredients.map((ingStr, idx) => ({
      name: ingStr,
      category: ingStr.toLowerCase().includes('pollo') || ingStr.toLowerCase().includes('pavo') || ingStr.toLowerCase().includes('carne') 
        ? 'protein' 
        : (ingStr.toLowerCase().includes('caldo') ? 'broth_liquid' : (ingStr.toLowerCase().includes('yogur') ? 'healthy_fat' : 'vegetable')),
      baseGramsFor10kgPetPerDay: 20 + idx * 10,
      notes: 'Premio o complemento saludable'
    })),
    instructions: [
      snk.preparation,
      'Servir en raciones moderadas como premio positivo, enriquecimiento olfativo o postre equilibrado tras la comida.'
    ],
    chefTips: 'Los snacks y postres deben suponer como máximo un 10% de la energía diaria total de tu mascota.',
    storageInfo: snk.isFrozenOrGelatin 
      ? 'Conservar en congelador hasta 3 meses' 
      : 'Conservar en recipiente hermético de cristal en nevera hasta 5 días',
    macronutrients: {
      proteinPct: isDessert ? 25 : (isBroth ? 70 : 45),
      fatPct: 15,
      fiberCarbPct: 20,
      moisturePct: snk.isFrozenOrGelatin || isBroth ? 88 : 55
    }
  };
});

// Build consolidated master catalog with deduplication guarantee (304 total recipes including the complete 180 guide recipes, desserts & snacks)
const consolidatedRecipesMap = new Map<string, Recipe>();

INITIAL_BASE_RECIPES.forEach(r => consolidatedRecipesMap.set(r.id, r));
MASTER_RECIPES.forEach(r => consolidatedRecipesMap.set(r.id, r));
EXTENDED_RECIPES.forEach(r => consolidatedRecipesMap.set(r.id, r));
REMAINING_RECIPES.forEach(r => consolidatedRecipesMap.set(r.id, r));
CONVERTED_SNACKS_DESSERTS.forEach(r => consolidatedRecipesMap.set(r.id, r));
DOG_PUPPY_RECIPES.forEach(r => consolidatedRecipesMap.set(r.id, r));
DOG_ADULT_RECIPES.forEach(r => consolidatedRecipesMap.set(r.id, r));
DOG_SENIOR_RECIPES.forEach(r => consolidatedRecipesMap.set(r.id, r));
CAT_KITTEN_RECIPES.forEach(r => consolidatedRecipesMap.set(r.id, r));
CAT_ADULT_RECIPES.forEach(r => consolidatedRecipesMap.set(r.id, r));
CAT_SENIOR_RECIPES.forEach(r => consolidatedRecipesMap.set(r.id, r));
HIGH_PERFORMANCE_DOG_RECIPES.forEach(r => consolidatedRecipesMap.set(r.id, r));

export const RECIPES_CATALOG: Recipe[] = Array.from(consolidatedRecipesMap.values());

export const TOXIC_FOODS_CATALOG: ToxicFood[] = [
  {
    id: 'tox-1',
    name: 'Cebolla, Puerro, Chalota y Cebollino',
    scientificOrCommon: 'Familia Allium (cruda, cocida, en polvo o caldos comerciales)',
    speciesAffected: 'all',
    severity: 'lethal',
    severityLabel: 'Extremadamente Peligroso',
    toxicCompound: 'Tiosulfatos y disulfuros de alilo',
    symptoms: ['Anemia hemolítica por cuerpos de Heinz', 'Letargo y debilidad extrema', 'Orina de color marrón/rojizo', 'Mucosas pálidas o amarillentas', 'Dificultad respiratoria'],
    emergencyAction: 'Si se ha ingerido en las últimas 2 horas, acudir de urgencia a la clínica veterinaria para inducción de vómito controlado y soporte con fluidoterapia.',
    safeAlternatives: 'Calabacín al vapor, zanahoria cocida o judías verdes tiernas.'
  },
  {
    id: 'tox-2',
    name: 'Ajo (Concentrado / Dosis altas)',
    scientificOrCommon: 'Allium sativum (especialmente concentrados y polvos)',
    speciesAffected: 'all',
    severity: 'high',
    severityLabel: 'Alta Toxicidad',
    toxicCompound: 'Alicina y compuestos organosulfurados',
    symptoms: ['Destrucción oxidativa de glóbulos rojos', 'Vómitos y diarrea con dolor abdominal', 'Taquicardia y colapso circulatorio'],
    emergencyAction: 'Evitar suplementos humanos de extracto de ajo y acudir a evaluación clínica si se detecta ingestión involuntaria.',
    safeAlternatives: 'Hierbas nobles seguras: Romero fresco, perejil en micro-dosis, orégano en infusión suave.'
  },
  {
    id: 'tox-3',
    name: 'Chocolate y Derivados del Cacao',
    scientificOrCommon: 'Theobroma cacao (cuanto más negro y puro, más letal)',
    speciesAffected: 'all',
    severity: 'lethal',
    severityLabel: 'Lethal / Letal',
    toxicCompound: 'Teobromina y cafeína (metilxantinas)',
    symptoms: ['Hiperactividad y temblores musculares', 'Arritmias cardíacas severas', 'Convulsiones y espasmos', 'Hipertermia y paro cardiorrespiratorio'],
    emergencyAction: 'Emergencia veterinaria inmediata. No esperar a que aparezcan los síntomas; el tiempo es crítico para administrar carbón activado.',
    safeAlternatives: 'Harina de Algarroba tostada 100% natural (sin azúcar ni cafeína).'
  },
  {
    id: 'tox-4',
    name: 'Xilitol (Edulcorante E967)',
    scientificOrCommon: 'Chicles sin azúcar, pastas de dientes, cremas de cacahuete fitness, bollería sin azúcar',
    speciesAffected: 'dog',
    severity: 'lethal',
    severityLabel: 'Lethal / Letal Fulminante',
    toxicCompound: 'Alcohol poliol de xilitol',
    symptoms: ['Liberación masiva de insulina con hipoglucemia fulminante (<30 min)', 'Pérdida de coordinación y ataxia', 'Convulsiones inmediatas', 'Fallo hepático agudo fulminante'],
    emergencyAction: 'Urgencia de máxima prioridad: administración intravenosa de glucosa y protectores hepáticos inmediatos.',
    safeAlternatives: 'Mantequilla de cacahuete 100% cacahuete puro sin ningún tipo de aditivo ni edulcorante.'
  },
  {
    id: 'tox-5',
    name: 'Uvas y Pasas',
    scientificOrCommon: 'Vitis vinifera (frescas, secas o en zumos)',
    speciesAffected: 'dog',
    severity: 'lethal',
    severityLabel: 'Extremadamente Peligroso',
    toxicCompound: 'Ácido tartárico y sales de potasio (idiosincrásico)',
    symptoms: ['Fallo renal agudo repentino (anuria u oliguria)', 'Vómitos repetidos en las primeras 12h', 'Deshidratación severa y uremia'],
    emergencyAction: 'Hospitalización inmediata con fluidoterapia agresiva durante 48-72h para proteger la perfusión renal.',
    safeAlternatives: 'Arándanos silvestres frescos, frambuesas o manzana sin semillas.'
  },
  {
    id: 'tox-6',
    name: 'Nueces de Macadamia',
    scientificOrCommon: 'Macadamia integrifolia',
    speciesAffected: 'dog',
    severity: 'high',
    severityLabel: 'Alta Toxicidad',
    toxicCompound: 'Toxina desconocida termorresistente',
    symptoms: ['Debilidad marcada del tercio posterior (paresia)', 'Hipertermia (>39.5°C)', 'Dolor articular y temblores musculares', 'Vómitos'],
    emergencyAction: 'Atención veterinaria para monitorización térmica y control del dolor neuropático.',
    safeAlternatives: 'Semillas de chía o lino dorado molidas en pequeñas cantidades.'
  },
  {
    id: 'tox-7',
    name: 'Huesos Cocidos o Fritos',
    scientificOrCommon: 'Cualquier hueso sometido a calor térmico (pollo, chuletas, costillas)',
    speciesAffected: 'all',
    severity: 'high',
    severityLabel: 'Riesgo Quirúrgico Severo',
    toxicCompound: 'Estructura mineral deshidratada y astillable',
    symptoms: ['Perforación esofágica, gástrica o intestinal', 'Obstrucción mecánica completa', 'Peritonitis séptica con shock séptico', 'Vómitos biliosos y abdomen en tabla'],
    emergencyAction: 'NUNCA inducir el vómito si se sospechan huesos astillados. Realizar radiografía urgente para evaluar necesidad de endoscopia o cirugía.',
    safeAlternatives: 'Caldo de huesos colado o huesos recreativos crudos carnosos bajo estricta supervisión experta.'
  },
  {
    id: 'tox-8',
    name: 'Masa de Pan Cruda con Levadura',
    scientificOrCommon: 'Masas fermentables de panadería o pizza',
    speciesAffected: 'all',
    severity: 'high',
    severityLabel: 'Peligro Crítico',
    toxicCompound: 'Expansión por dióxido de carbono y producción de etanol endógeno',
    symptoms: ['Dilatación y torsión gástrica aguda por gas caliente', 'Intoxicación etílica severa con hipotermia y acidosis metabólica'],
    emergencyAction: 'Sondaje gástrico urgente o descompresión para evitar rotura gástrica.',
    safeAlternatives: 'Boniato asado bien cocinado o puré de calabaza.'
  },
  {
    id: 'tox-9',
    name: 'Aguacate (Hueso, Cáscara y Hojas)',
    scientificOrCommon: 'Persea americana (especialmente piel y semilla)',
    speciesAffected: 'all',
    severity: 'moderate',
    severityLabel: 'Moderada / Riesgo Mecánico',
    toxicCompound: 'Persina (toxina fungicida natural) + peligro de atragantamiento por el hueso',
    symptoms: ['Gastroenteritis con vómitos y diarrea', 'Obstrucción intestinal letal por deglución de la semilla'],
    emergencyAction: 'Consulta veterinaria inmediata si se ingiere la cáscara o el hueso entero.',
    safeAlternatives: 'Aceite de oliva virgen extra en gotas o aceite de salmón salvaje.'
  }
];
