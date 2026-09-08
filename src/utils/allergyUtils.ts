import { Pet, Recipe } from '../types';

export interface AllergenDef {
  id: string;
  nameEs: string;
  nameEn: string;
  icon: string;
  keywords: string[];
  safeSubstitutesEs: string[];
  safeSubstitutesEn: string[];
}

export const COMMON_FOOD_ALLERGENS: AllergenDef[] = [
  {
    id: 'chicken',
    nameEs: 'Pollo / Aves',
    nameEn: 'Chicken / Poultry',
    icon: '🍗',
    keywords: ['pollo', 'gallina', 'ave', 'chicken', 'poultry'],
    safeSubstitutesEs: ['Pavo', 'Conejo', 'Pescado blanco', 'Cordero'],
    safeSubstitutesEn: ['Turkey', 'Rabbit', 'White fish', 'Lamb'],
  },
  {
    id: 'beef',
    nameEs: 'Ternera / Res',
    nameEn: 'Beef',
    icon: '🥩',
    keywords: ['ternera', 'res', 'buey', 'vaca', 'bovino', 'beef'],
    safeSubstitutesEs: ['Pavo', 'Pescado blanco', 'Cordero', 'Conejo'],
    safeSubstitutesEn: ['Turkey', 'White fish', 'Lamb', 'Rabbit'],
  },
  {
    id: 'pork',
    nameEs: 'Cerdo / Jamón',
    nameEn: 'Pork',
    icon: '🥓',
    keywords: ['cerdo', 'puerco', 'jamon', 'jamón', 'pork', 'bacon'],
    safeSubstitutesEs: ['Pavo', 'Ternera magra', 'Pescado blanco'],
    safeSubstitutesEn: ['Turkey', 'Lean beef', 'White fish'],
  },
  {
    id: 'lamb',
    nameEs: 'Cordero',
    nameEn: 'Lamb',
    icon: '🐑',
    keywords: ['cordero', 'lamb', 'borrego', 'oveja'],
    safeSubstitutesEs: ['Pavo', 'Pescado blanco', 'Conejo'],
    safeSubstitutesEn: ['Turkey', 'White fish', 'Rabbit'],
  },
  {
    id: 'fish',
    nameEs: 'Pescado / Salmón',
    nameEn: 'Fish / Salmon',
    icon: '🐟',
    keywords: ['pescado', 'salmon', 'salmón', 'atun', 'atún', 'merluza', 'sardina', 'fish', 'trout', 'trucha'],
    safeSubstitutesEs: ['Pavo', 'Conejo', 'Ternera'],
    safeSubstitutesEn: ['Turkey', 'Rabbit', 'Beef'],
  },
  {
    id: 'egg',
    nameEs: 'Huevo / Clara / Yema',
    nameEn: 'Egg',
    icon: '🥚',
    keywords: ['huevo', 'clara', 'yema', 'egg', 'eggs'],
    safeSubstitutesEs: ['Caldo de colágeno', 'Semillas de chía hidratadas', 'Puré de calabaza'],
    safeSubstitutesEn: ['Bone broth', 'Hydrated chia seeds', 'Pumpkin puree'],
  },
  {
    id: 'dairy',
    nameEs: 'Lácteos / Leche / Kéfir',
    nameEn: 'Dairy / Milk / Kefir',
    icon: '🧀',
    keywords: ['lacteo', 'lácteo', 'leche', 'queso', 'yogur', 'yogurt', 'kefir', 'kéfir', 'dairy', 'milk', 'cheese'],
    safeSubstitutesEs: ['Caldo de huesos puro', 'Puré de manzana asada', 'Puré de calabaza'],
    safeSubstitutesEn: ['Pure bone broth', 'Baked apple puree', 'Pumpkin puree'],
  },
  {
    id: 'wheat_gluten',
    nameEs: 'Trigo / Gluten / Cereales',
    nameEn: 'Wheat / Gluten / Grains',
    icon: '🌾',
    keywords: ['trigo', 'gluten', 'cereal', 'harina', 'pasta', 'pan', 'wheat', 'grain', 'flour'],
    safeSubstitutesEs: ['Boniato / Batata', 'Calabaza', 'Quinoa', 'Chía'],
    safeSubstitutesEn: ['Sweet potato', 'Pumpkin', 'Quinoa', 'Chia'],
  },
  {
    id: 'corn',
    nameEs: 'Maíz',
    nameEn: 'Corn',
    icon: '🌽',
    keywords: ['maiz', 'maíz', 'corn', 'choclo'],
    safeSubstitutesEs: ['Calabacín', 'Zanahoria', 'Boniato'],
    safeSubstitutesEn: ['Zucchini', 'Carrot', 'Sweet potato'],
  },
  {
    id: 'soy',
    nameEs: 'Soja / Soya',
    nameEn: 'Soy',
    icon: '🫘',
    keywords: ['soja', 'soya', 'soy', 'tofu'],
    safeSubstitutesEs: ['Carne magra fresca', 'Pescado fresco'],
    safeSubstitutesEn: ['Fresh lean meat', 'Fresh fish'],
  },
  {
    id: 'rice',
    nameEs: 'Arroz',
    nameEn: 'Rice',
    icon: '🍚',
    keywords: ['arroz', 'rice'],
    safeSubstitutesEs: ['Boniato', 'Calabaza', 'Quinoa'],
    safeSubstitutesEn: ['Sweet potato', 'Pumpkin', 'Quinoa'],
  },
  {
    id: 'turkey',
    nameEs: 'Pavo',
    nameEn: 'Turkey',
    icon: '🦃',
    keywords: ['pavo', 'turkey'],
    safeSubstitutesEs: ['Conejo', 'Pescado blanco', 'Cordero'],
    safeSubstitutesEn: ['Rabbit', 'White fish', 'Lamb'],
  }
];

/**
 * Parses freeform allergies string into clean normalized lowercase array of tokens.
 */
export function parseAllergens(allergiesStr?: string): string[] {
  if (!allergiesStr || !allergiesStr.trim()) return [];
  const lower = allergiesStr.toLowerCase();
  
  // If explicitly states "ninguna" or "no tiene"
  if (lower.includes('ningun') || lower.includes('no detectada') || lower.includes('sin alergia') || lower.includes('none')) {
    return [];
  }

  // Split by commas, semicolons, dashes, slashes, or ' y ' / ' and '
  const rawParts = lower.split(/[,;\n/]+| y | e | and /g);
  const result: string[] = [];

  for (const part of rawParts) {
    const clean = part.replace(/[.*+?^${}()|[\]\\]/g, '').trim();
    if (clean.length >= 2 && !result.includes(clean)) {
      result.push(clean);
    }
  }

  return result;
}

/**
 * Checks if a specific ingredient text or dish title conflicts with any of the pet's allergens.
 */
export function hasAllergenConflict(textToCheck: string, allergens: string[]): { hasConflict: boolean; matchedAllergen?: string } {
  if (!allergens || allergens.length === 0 || !textToCheck) {
    return { hasConflict: false };
  }

  const normalizedText = textToCheck.toLowerCase();

  for (const allergen of allergens) {
    const cleanAllergen = allergen.trim().toLowerCase();
    if (!cleanAllergen) continue;

    // Check if the allergen is a recognized common allergen with expanded keywords
    const def = COMMON_FOOD_ALLERGENS.find(a => 
      a.id === cleanAllergen || 
      a.keywords.some(k => cleanAllergen.includes(k) || k.includes(cleanAllergen))
    );

    if (def) {
      for (const kw of def.keywords) {
        // Regex word boundary or direct match
        const regex = new RegExp(`\\b${kw}`, 'i');
        if (regex.test(normalizedText) || normalizedText.includes(kw)) {
          return { hasConflict: true, matchedAllergen: def.nameEs };
        }
      }
    } else {
      // Freeform allergen keyword check
      if (normalizedText.includes(cleanAllergen)) {
        return { hasConflict: true, matchedAllergen: allergen };
      }
    }
  }

  return { hasConflict: false };
}

/**
 * Checks whether a recipe is safe for a given pet.
 */
export function isRecipeSafeForPet(recipe: Recipe, pet?: Pet | null): { isSafe: boolean; conflictReason?: string } {
  if (!pet || !pet.allergies) return { isSafe: true };
  const allergens = parseAllergens(pet.allergies);
  if (allergens.length === 0) return { isSafe: true };

  // Check title
  const titleCheck = hasAllergenConflict(recipe.title, allergens);
  if (titleCheck.hasConflict) {
    return { isSafe: false, conflictReason: titleCheck.matchedAllergen };
  }

  // Check ingredients
  for (const ing of recipe.ingredients) {
    const ingCheck = hasAllergenConflict(ing.name, allergens);
    if (ingCheck.hasConflict) {
      return { isSafe: false, conflictReason: `${ingCheck.matchedAllergen} (${ing.name})` };
    }
  }

  return { isSafe: true };
}

/**
 * Replaces conflicting proteins or ingredients in a meal with a safe alternative.
 */
export function getSafeSubstituteProtein(originalProtein: string, allergens: string[], isCat: boolean): {
  proteinName: string;
  substituteTitleWord: string;
  isSubstituted: boolean;
} {
  const check = hasAllergenConflict(originalProtein, allergens);
  if (!check.hasConflict) {
    return {
      proteinName: originalProtein,
      substituteTitleWord: originalProtein,
      isSubstituted: false,
    };
  }

  // Determine a safe protein that doesn't conflict with any of the allergens
  const candidateProteins = isCat 
    ? [
        { name: 'Pavo magro desgrasado', word: 'Pavo', keywords: ['pavo', 'turkey'] },
        { name: 'Conejo tierno', word: 'Conejo', keywords: ['conejo', 'rabbit'] },
        { name: 'Merluza y pescado blanco', word: 'Pescado Blanco', keywords: ['pescado', 'merluza', 'fish'] },
        { name: 'Ternera magra', word: 'Ternera', keywords: ['ternera', 'res', 'beef'] },
        { name: 'Cordero hipoalergénico', word: 'Cordero', keywords: ['cordero', 'lamb'] },
      ]
    : [
        { name: 'Pavo magro cocido', word: 'Pavo', keywords: ['pavo', 'turkey'] },
        { name: 'Conejo hipoalergénico', word: 'Conejo', keywords: ['conejo', 'rabbit'] },
        { name: 'Pescado blanco (Merluza / Bacalao fresco)', word: 'Pescado Blanco', keywords: ['pescado', 'merluza', 'fish', 'bacalao'] },
        { name: 'Cordero noble al vapor', word: 'Cordero', keywords: ['cordero', 'lamb'] },
        { name: 'Carne magra de Ternera', word: 'Ternera', keywords: ['ternera', 'res', 'beef'] },
      ];

  for (const candidate of candidateProteins) {
    const candCheck = hasAllergenConflict(candidate.name, allergens);
    if (!candCheck.hasConflict) {
      return {
        proteinName: candidate.name,
        substituteTitleWord: candidate.word,
        isSubstituted: true,
      };
    }
  }

  // Default fallback if multiple meats are excluded
  return {
    proteinName: 'Carne selecta de Pavo y caldo clarificado',
    substituteTitleWord: 'Pavo Hipoalergénico',
    isSubstituted: true,
  };
}
