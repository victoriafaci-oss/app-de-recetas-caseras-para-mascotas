import { Pet, ClinicalCondition } from '../types';

/**
 * Calculates Resting Energy Requirement (RER) in kcal/day:
 * RER = 70 * (weight_in_kg ^ 0.75)
 */
export function calculateRER(weightKg: number): number {
  if (!weightKg || weightKg <= 0) return 0;
  return Math.round(70 * Math.pow(weightKg, 0.75));
}

/**
 * Calculates Maintenance Energy Requirement (MER) in kcal/day
 * based on species, age, sterilization, BCS, activity, and clinical condition.
 */
export function calculateMER(pet: Pet): {
  rer: number;
  mer: number;
  multiplier: number;
  multiplierReason: string;
  dailyFoodGrams: number;
  mealPortions: { breakfastGrams: number; dinnerGrams: number; optionalLunchGrams: number };
  waterTargetMl: number;
  macronutrientSplit: {
    proteinPct: number;
    fatPct: number;
    fiberCarbsPct: number;
    notes: string;
  };
} {
  const rer = calculateRER(pet.weightKg);
  let multiplier = 1.6;
  let reason = 'Mantenimiento adulto';

  const isSenior = pet.ageYears >= 7;
  const isPuppyKitten = pet.ageYears < 1;
  const isOverweight = pet.bodyConditionScore >= 6;
  const isUnderweight = pet.bodyConditionScore <= 3;

  if (pet.species === 'dog') {
    if (isPuppyKitten) {
      multiplier = pet.ageMonths <= 4 ? 3.0 : 2.0;
      reason = 'Crecimiento y desarrollo cachorro';
    } else if (pet.clinicalCondition === 'weight_loss' || isOverweight) {
      multiplier = 1.1;
      reason = 'Restricción calórica y saciedad controlada';
    } else if (isUnderweight) {
      multiplier = 1.8;
      reason = 'Recuperación de masa magra';
    } else if (isSenior) {
      multiplier = pet.isNeutered ? 1.3 : 1.4;
      reason = 'Senior con metabolismo adaptado';
    } else if (pet.isNeutered) {
      multiplier = pet.activityLevel === 'active' ? 1.6 : (pet.activityLevel === 'sedentary' ? 1.3 : 1.5);
      reason = 'Adulto esterilizado';
    } else {
      multiplier = pet.activityLevel === 'active' ? 1.9 : (pet.activityLevel === 'sedentary' ? 1.5 : 1.8);
      reason = 'Adulto entero';
    }
  } else {
    // Cat (Strict carnivore)
    if (isPuppyKitten) {
      multiplier = 2.4;
      reason = 'Crecimiento felino activo';
    } else if (pet.clinicalCondition === 'weight_loss' || isOverweight) {
      multiplier = 0.9;
      reason = 'Manejo de sobrepeso felino';
    } else if (isUnderweight) {
      multiplier = 1.5;
      reason = 'Aporte calórico denso';
    } else if (isSenior) {
      multiplier = 1.1;
      reason = 'Senior felino / soporte renal preventivo';
    } else if (pet.isNeutered) {
      multiplier = pet.activityLevel === 'sedentary' ? 1.05 : 1.2;
      reason = 'Felino esterilizado de interior';
    } else {
      multiplier = 1.4;
      reason = 'Felino adulto entero';
    }
  }

  // Adjust for clinical conditions
  if (pet.clinicalCondition === 'renal') {
    reason += ' (Ajuste Renal: proteína de alto valor biológico y fósforo controlado)';
  } else if (pet.clinicalCondition === 'joint_support') {
    reason += ' (Ajuste Articular: enriquecido en colágeno, condroprotectores y EPA/DHA)';
  } else if (pet.clinicalCondition === 'sensitive_digestive') {
    reason += ' (Ajuste Gastrointestinal: digestión suave y fibra prebiótica)';
  }

  const mer = Math.round(rer * multiplier);

  // Standard balanced moisture-rich homemade food density ~135 kcal / 100g (1.35 kcal/g)
  const caloricDensityPerGram = pet.clinicalCondition === 'renal' ? 1.45 : (pet.clinicalCondition === 'weight_loss' ? 1.15 : 1.35);
  const dailyFoodGrams = Math.round(mer / caloricDensityPerGram);

  // Meal breakdown: 2 primary meals (50/50) or 3 meals (35/35/30)
  const breakfastGrams = Math.round(dailyFoodGrams * 0.5);
  const dinnerGrams = dailyFoodGrams - breakfastGrams;
  const optionalLunchGrams = Math.round(dailyFoodGrams * 0.33);

  // Hydration target in ml/day: ~55ml/kg for dogs, ~50ml/kg for cats
  const waterRate = pet.species === 'dog' ? 55 : 50;
  const waterTargetMl = Math.round(pet.weightKg * waterRate);

  // Macronutrient split profiles
  let macronutrientSplit = {
    proteinPct: 45,
    fatPct: 30,
    fiberCarbsPct: 25,
    notes: 'Equilibrio estándar de alta cocina',
  };

  if (pet.species === 'cat') {
    macronutrientSplit = {
      proteinPct: 55,
      fatPct: 35,
      fiberCarbsPct: 10,
      notes: 'Carnívoro estricto: alta proteína y taurina, carbohidratos mínimos',
    };
  }

  if (pet.clinicalCondition === 'renal') {
    macronutrientSplit = {
      proteinPct: pet.species === 'cat' ? 38 : 30,
      fatPct: 40,
      fiberCarbsPct: pet.species === 'cat' ? 22 : 30,
      notes: 'Soporte Renal: Fósforo ultra-bajo, grasas nobles energéticas y proteína de fácil asimilación',
    };
  } else if (pet.clinicalCondition === 'weight_loss') {
    macronutrientSplit = {
      proteinPct: pet.species === 'cat' ? 60 : 50,
      fatPct: 15,
      fiberCarbsPct: pet.species === 'cat' ? 25 : 35,
      notes: 'Saciante: Alto contenido de fibra soluble e insoluble, grasa reducida',
    };
  } else if (pet.clinicalCondition === 'joint_support') {
    macronutrientSplit = {
      proteinPct: pet.species === 'cat' ? 52 : 45,
      fatPct: 33,
      fiberCarbsPct: pet.species === 'cat' ? 15 : 22,
      notes: 'Articular: Rico en ácidos grasos Omega-3 (EPA/DHA) y colágeno natural hidrolizado',
    };
  }

  return {
    rer,
    mer,
    multiplier: Math.round(multiplier * 100) / 100,
    multiplierReason: reason,
    dailyFoodGrams,
    mealPortions: {
      breakfastGrams,
      dinnerGrams,
      optionalLunchGrams,
    },
    waterTargetMl,
    macronutrientSplit,
  };
}

/**
 * Returns condition descriptions and key clinical warnings
 */
export function getConditionClinicalAlerts(condition: ClinicalCondition, species: 'dog' | 'cat'): {
  badgeLabel: string;
  badgeColor: string;
  title: string;
  alerts: string[];
  keyNutrients: string[];
  forbiddenAlert: string;
} {
  switch (condition) {
    case 'renal':
      return {
        badgeLabel: 'Soporte Renal & Fósforo Bajo',
        badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
        title: 'Pautas Clínicas de Protección Renal',
        alerts: [
          'Mantener niveles de fósforo estrictamente controlados (<0.4% en materia seca).',
          'Utilizar carnes magras con cáscara de huevo molida (carbonato de calcio) como quelante natural de fósforo.',
          'Aporte hídrico abundante: incluir 100-200ml diarios de caldo de médula ósea sin sal para proteger la filtración glomerular.',
          'Evitar carnes rojas oscuras, vísceras en exceso o huesos carnosos con alto contenido de fósforo.',
        ],
        keyNutrients: ['Caldo sin sal', 'Carbonato cálcico', 'Omega-3 EPA/DHA', 'Clara de huevo cocida'],
        forbiddenAlert: 'Prohibido: Espinacas crudas, vísceras en exceso, sal añadida, lácteos altos en fósforo.',
      };

    case 'weight_loss':
      return {
        badgeLabel: 'Control de Peso & Saciante',
        badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
        title: 'Pautas Clínicas para Pérdida de Peso Saludable',
        alerts: [
          'Calorías reducidas manteniendo el volumen gástrico con calabacín, judías verdes cocidas y calabaza al vapor.',
          'Garantizar proteína de alta pureza (pavo magro, merluza) para evitar la pérdida de masa muscular.',
          'Evitar grasas densas, pieles de ave y aceites en exceso.',
          'Ritmo de pérdida ideal: 1-2% del peso corporal por semana.',
        ],
        keyNutrients: ['Calabacín al vapor', 'Pechuga de pavo', 'Fibra de calabaza', 'L-Carnitina'],
        forbiddenAlert: 'Prohibido: Golosinas comerciales ultraprocesadas, mantecas, embutidos, piel de pollo.',
      };

    case 'joint_support':
      return {
        badgeLabel: 'Articulaciones & Longevidad',
        badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/30',
        title: 'Pautas Clínicas Articulares & Antiinflamatorias',
        alerts: [
          'Suplementación natural con Caldo de Patas de Pollo / Huesos cocinado a fuego lento (+12h) rico en colágeno y glucosamina.',
          'Ácidos grasos Omega-3 marinos (aceite de salmón salvaje o sardinas en agua) con alto ratio EPA/DHA.',
          'Pizca de cúrcuma combinada con micro-dosis de pimienta y aceite de coco virgen (Golden Paste).',
          'Mantener peso estricto para evitar sobrecarga en caderas y rodillas.',
        ],
        keyNutrients: ['Colágeno natural', 'Omega-3 (EPA/DHA)', 'Cúrcuma paste', 'Mejillón de labio verde'],
        forbiddenAlert: 'Prohibido: Azúcares refinados, harinas ultra-procesadas y harinas de cereales inflamatorias.',
      };

    case 'sensitive_digestive':
      return {
        badgeLabel: 'Digestión Sensible & Gastroprotector',
        badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/30',
        title: 'Pautas Clínicas Gastrointestinales',
        alerts: [
          'Dieta de mono-proteína hervida suave (conejo o pescado blanco) de absorción rápida.',
          'Puré de calabaza asada y fécula de boniato cocido como fuente de mucílagos calmantes.',
          'Kéfir de cabra no pasteurizado o prebióticos (inulina/FOS) en dosis milimétricas.',
          'Temperar siempre la comida a temperatura ambiente (nunca directa del refrigerador).',
        ],
        keyNutrients: ['Bonito o Merluza al vapor', 'Calabaza asada', 'Kéfir de cabra', 'Manzanilla suave'],
        forbiddenAlert: 'Prohibido: Lácteos de vaca con lactosa, grasas fritas, legumbres crudas, especias fuertes.',
      };

    case 'allergies':
      return {
        badgeLabel: 'Hipoalergénico & Mono-Proteína',
        badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/30',
        title: 'Pautas Clínicas para Alergias & Dermatología',
        alerts: [
          'Protocolo estricto de proteína nobel no consumida previamente (ej: pato, caballo, conejo, venado).',
          'Eliminación de pollo y ternera comercial estándar si hay sospecha de prurito.',
          'Aceite de borraja o salmón para restaurar la barrera lipídica epidérmica.',
          'Mantener un cuaderno culinario estricto sin introducir más de 1 ingrediente nuevo cada 14 días.',
        ],
        keyNutrients: ['Proteína Nobel (Conejo/Pato)', 'Aceite de Onagra/Borraja', 'Vitamina E natural', 'Zanahoria cocida'],
        forbiddenAlert: 'Prohibido: Trazas de cereales con gluten, premios mixtos con harinas de carne genéricas.',
      };

    default:
      return {
        badgeLabel: 'Vitalidad & Mantenimiento Gourmet',
        badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
        title: 'Pautas de Alta Gastronomía Equilibrada',
        alerts: [
          'Rotación de 2-3 fuentes de proteína magra de calidad humana a lo largo de la semana.',
          'Inclusión de 10% de órganos nobles (hígado y corazón) para aporte de taurina y vitaminas del grupo B.',
          'Suplemento de calcio biodisponible (cáscara de huevo triturada ultra-fina: 1 cucharadita = 5g = ~1800mg Ca).',
          'Fibra vegetal fresca (verduras al vapor trituradas) para microbiota óptima.',
        ],
        keyNutrients: ['Proteína fresca (pavo/ternera magra)', 'Hígado fresco', 'Cáscara de huevo', 'Arándanos antioxidantes'],
        forbiddenAlert: 'Prohibido: Cebolla, ajo, chocolate, uvas, frutos secos de macadamia, aguacate (piel/hueso).',
      };
  }
}
