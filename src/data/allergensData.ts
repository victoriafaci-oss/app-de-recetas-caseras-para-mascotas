export interface AllergenDef {
  id: string;
  nameEs: string;
  nameEn: string;
  icon: string;
  keywords: string[];
  safeAlternativeEs: string;
  safeAlternativeEn: string;
}

export const COMMON_FOOD_ALLERGENS: AllergenDef[] = [
  {
    id: 'pollo',
    nameEs: 'Pollo / Ave',
    nameEn: 'Chicken / Poultry',
    icon: '🍗',
    keywords: ['pollo', 'chicken', 'ave', 'poultry', 'gallina'],
    safeAlternativeEs: 'Pavo magro o Conejo',
    safeAlternativeEn: 'Lean Turkey or Rabbit',
  },
  {
    id: 'ternera',
    nameEs: 'Ternera / Res',
    nameEn: 'Beef',
    icon: '🥩',
    keywords: ['ternera', 'beef', 'res', 'vaca'],
    safeAlternativeEs: 'Pavo campesino o Pescado blanco',
    safeAlternativeEn: 'Country Turkey or Whitefish',
  },
  {
    id: 'cerdo',
    nameEs: 'Cerdo',
    nameEn: 'Pork',
    icon: '🥓',
    keywords: ['cerdo', 'pork', 'puerco', 'jamon', 'jamón'],
    safeAlternativeEs: 'Pavo magro o Cordero',
    safeAlternativeEn: 'Lean Turkey or Lamb',
  },
  {
    id: 'cordero',
    nameEs: 'Cordero',
    nameEn: 'Lamb',
    icon: '🐑',
    keywords: ['cordero', 'lamb'],
    safeAlternativeEs: 'Pavo o Pescado blanco',
    safeAlternativeEn: 'Turkey or Whitefish',
  },
  {
    id: 'pescado',
    nameEs: 'Pescado / Salmón / Marisco',
    nameEn: 'Fish / Salmon / Seafood',
    icon: '🐟',
    keywords: ['pescado', 'fish', 'salmon', 'salmón', 'merluza', 'bacalao', 'trucha', 'marisco', 'krill'],
    safeAlternativeEs: 'Pato noble o Pavo campesino',
    safeAlternativeEn: 'Noble Duck or Farmhouse Turkey',
  },
  {
    id: 'lacteos',
    nameEs: 'Lácteos / Leche / Queso / Kéfir',
    nameEn: 'Dairy / Cheese / Milk / Kefir',
    icon: '🧀',
    keywords: ['lacteo', 'lácteo', 'leche', 'queso', 'yogur', 'yogurt', 'kefir', 'kéfir', 'dairy', 'cheese', 'milk'],
    safeAlternativeEs: 'Gelatina de caldo de huesos o Puré de calabaza',
    safeAlternativeEn: 'Bone Broth Gelatin or Pumpkin Puree',
  },
  {
    id: 'cereales',
    nameEs: 'Cereales / Gluten / Trigo / Arroz / Avena',
    nameEn: 'Grains / Gluten / Wheat / Rice / Oats',
    icon: '🌾',
    keywords: ['cereal', 'cereales', 'gluten', 'trigo', 'arroz', 'avena', 'grain', 'wheat', 'rice', 'oat'],
    safeAlternativeEs: 'Boniato asado o Puré de calabaza (100% Grain-Free)',
    safeAlternativeEn: 'Roasted Sweet Potato or Pumpkin (100% Grain-Free)',
  },
  {
    id: 'huevo',
    nameEs: 'Huevo / Yema / Clara',
    nameEn: 'Egg / Yolk / Eggshell',
    icon: '🥚',
    keywords: ['huevo', 'egg', 'yema', 'clara', 'cascara de huevo', 'cáscara de huevo'],
    safeAlternativeEs: 'Carbonato cálcico mineral puro o Harina de algas rojas',
    safeAlternativeEn: 'Pure mineral calcium carbonate or Red Algae (Lithothamnium)',
  },
  {
    id: 'soja',
    nameEs: 'Soja / Derivados',
    nameEn: 'Soy / Soya',
    icon: '🌱',
    keywords: ['soja', 'soy', 'soya'],
    safeAlternativeEs: 'Proteína animal pura 100% libre de legumbres',
    safeAlternativeEn: '100% pure legume-free animal protein',
  },
  {
    id: 'maiz',
    nameEs: 'Maíz / Féculas',
    nameEn: 'Corn / Maize',
    icon: '🌽',
    keywords: ['maiz', 'maíz', 'corn'],
    safeAlternativeEs: 'Boniato o calabacín fresco',
    safeAlternativeEn: 'Sweet potato or fresh zucchini',
  },
];

/**
 * Extracts active allergen keys and words from pet.allergies string or pet.allergensList
 */
export function extractPetAllergens(allergiesStr?: string, allergensList?: string[]): string[] {
  const result = new Set<string>();

  if (allergensList && Array.isArray(allergensList)) {
    allergensList.forEach(a => {
      if (a && a.trim()) result.add(a.trim().toLowerCase());
    });
  }

  if (allergiesStr && typeof allergiesStr === 'string') {
    const rawTokens = allergiesStr
      .toLowerCase()
      .split(/[,;\n\/\+]+/)
      .map(t => t.trim())
      .filter(Boolean);

    rawTokens.forEach(token => {
      // Check if matches a common allergen id or keyword
      const matched = COMMON_FOOD_ALLERGENS.find(def => 
        def.id === token || 
        def.keywords.some(kw => token.includes(kw) || kw.includes(token))
      );
      if (matched) {
        result.add(matched.id);
      } else {
        result.add(token);
      }
    });
  }

  return Array.from(result);
}

/**
 * Checks whether text or ingredient list contains any allergen associated with pet
 */
export function containsPetAllergen(
  textOrIngredients: string | { name: string }[] | string[],
  petAllergens: string[]
): { hasAllergen: boolean; matchedAllergens: string[] } {
  if (!petAllergens || petAllergens.length === 0) {
    return { hasAllergen: false, matchedAllergens: [] };
  }

  const combinedText = Array.isArray(textOrIngredients)
    ? textOrIngredients.map(item => (typeof item === 'string' ? item : item.name)).join(' ').toLowerCase()
    : textOrIngredients.toLowerCase();

  const matched = new Set<string>();

  for (const allergen of petAllergens) {
    const def = COMMON_FOOD_ALLERGENS.find(d => d.id === allergen);
    const keywordsToTest = def ? def.keywords : [allergen.toLowerCase()];

    for (const kw of keywordsToTest) {
      if (combinedText.includes(kw.toLowerCase())) {
        matched.add(def ? def.nameEs : allergen);
        break;
      }
    }
  }

  return {
    hasAllergen: matched.size > 0,
    matchedAllergens: Array.from(matched),
  };
}
