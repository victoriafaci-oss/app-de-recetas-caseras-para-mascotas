/**
 * Utility to provide photographic visuals for dishes, snacks, and desserts,
 * with Nutri IA automatic culinary generation and custom user photo uploads.
 */

export interface DishImageResult {
  imageUrl: string;
  source: 'nutri_ia' | 'user_upload' | 'default';
  platingDescriptionEs: string;
  platingDescriptionEn: string;
}

const DEFAULT_DISH_IMAGES = {
  turkey_chicken: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
  salmon_fish: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
  beef_meat: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  duck_specialty: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  broth_soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
  snacks_biscuit: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
  dessert_gelatin: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
  cat_salmon_puree: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80',
  general_wholesome: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=80',
};

const NUTRI_IA_VARIATIONS: Record<string, string[]> = {
  poultry: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  ],
  fish: [
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80',
  ],
  beef: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=80',
  ],
  treats: [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
  ],
};

/**
 * Returns a culinary image matching the dish title and ingredients.
 * Checks localStorage first if the user has uploaded their own photo or generated one.
 */
export function getDishImage(dishTitle: string, ingredientsText = '', isCat = false): DishImageResult {
  const normalizedKey = `dish_img_${dishTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  
  // Check if user uploaded a photo or saved custom Nutri IA image
  try {
    const saved = localStorage.getItem(normalizedKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.imageUrl) {
        return parsed;
      }
    }
  } catch {
    // ignore localStorage errors
  }

  const text = `${dishTitle} ${ingredientsText}`.toLowerCase();

  if (text.includes('postre') || text.includes('gelatina') || text.includes('helado') || text.includes('dessert')) {
    return {
      imageUrl: DEFAULT_DISH_IMAGES.dessert_gelatin,
      source: 'default',
      platingDescriptionEs: 'Emplatado en molde digestivo de gelatina suave y puré hidratante.',
      platingDescriptionEn: 'Served in soothing digestive gelatin mold and hydrating puree.',
    };
  }

  if (text.includes('snack') || text.includes('premio') || text.includes('galleta') || text.includes('bites') || text.includes('bocaditos')) {
    return {
      imageUrl: DEFAULT_DISH_IMAGES.snacks_biscuit,
      source: 'default',
      platingDescriptionEs: 'Premios deshidratados crujientes en porciones dosificadas para refuerzo positivo.',
      platingDescriptionEn: 'Crispy dehydrated treats portioned for positive reinforcement.',
    };
  }

  if (text.includes('salmón') || text.includes('salmon') || text.includes('pescado') || text.includes('merluza') || text.includes('fish')) {
    return {
      imageUrl: isCat ? DEFAULT_DISH_IMAGES.cat_salmon_puree : DEFAULT_DISH_IMAGES.salmon_fish,
      source: 'default',
      platingDescriptionEs: 'Emplatado tibio con lomos de pescado cocidos a fuego lento, puré vegetal y aceite virgen.',
      platingDescriptionEn: 'Warm plating with gently poached fish fillets, veggie puree, and virgin oil.',
    };
  }

  if (text.includes('pato') || text.includes('duck')) {
    return {
      imageUrl: DEFAULT_DISH_IMAGES.duck_specialty,
      source: 'default',
      platingDescriptionEs: 'Magret de pato tierno cocido al vapor con boniato asado y arándanos silvestres.',
      platingDescriptionEn: 'Tender steamed duck breast with roasted sweet potato and wild blueberries.',
    };
  }

  if (text.includes('ternera') || text.includes('beef') || text.includes('res')) {
    return {
      imageUrl: DEFAULT_DISH_IMAGES.beef_meat,
      source: 'default',
      platingDescriptionEs: 'Ternera magra sellada a baja temperatura con verduras tiernas y caldo mineral.',
      platingDescriptionEn: 'Lean beef gently sealed at low temperature with tender veggies and mineral broth.',
    };
  }

  if (text.includes('caldo') || text.includes('broth') || text.includes('sopa')) {
    return {
      imageUrl: DEFAULT_DISH_IMAGES.broth_soup,
      source: 'default',
      platingDescriptionEs: 'Caldo de huesos y colágeno clarificado, servido a temperatura corporal.',
      platingDescriptionEn: 'Clarified bone and collagen broth served at body temperature.',
    };
  }

  // Default poultry (pavo / pollo)
  return {
    imageUrl: DEFAULT_DISH_IMAGES.turkey_chicken,
    source: 'default',
    platingDescriptionEs: 'Pechuga magra desmenuzada con verduras al vapor, calabaza asada y caldo templado.',
    platingDescriptionEn: 'Shredded lean breast with steamed veggies, roasted pumpkin, and warm broth.',
  };
}

/**
 * Saves a user-uploaded image for a dish in localStorage
 */
export function saveDishCustomImage(dishTitle: string, imageUrl: string, source: 'user_upload' | 'nutri_ia' = 'user_upload'): void {
  const normalizedKey = `dish_img_${dishTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  try {
    localStorage.setItem(normalizedKey, JSON.stringify({
      imageUrl,
      source,
      platingDescriptionEs: source === 'user_upload' ? '📸 Fotografía real cocinada por el tutor en casa.' : '✨ Emplatado gourmet generado por Nutri IA Chef.',
      platingDescriptionEn: source === 'user_upload' ? '📸 Real photo cooked by owner at home.' : '✨ Gourmet plating generated by Nutri IA Chef.',
    }));
  } catch (err) {
    console.error('Error saving custom dish image:', err);
  }
}

/**
 * Simulates Nutri IA generating a customized photographic visual for this specific dish
 */
export function generateNutriIADishVisual(dishTitle: string, ingredientsText = ''): Promise<DishImageResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const text = `${dishTitle} ${ingredientsText}`.toLowerCase();
      let pool = NUTRI_IA_VARIATIONS.poultry;

      if (text.includes('pescado') || text.includes('salmón') || text.includes('salmon')) {
        pool = NUTRI_IA_VARIATIONS.fish;
      } else if (text.includes('ternera') || text.includes('beef')) {
        pool = NUTRI_IA_VARIATIONS.beef;
      } else if (text.includes('snack') || text.includes('postre') || text.includes('gelatina')) {
        pool = NUTRI_IA_VARIATIONS.treats;
      }

      const randomIdx = Math.floor(Math.random() * pool.length);
      const chosenUrl = pool[randomIdx] || pool[0];

      const result: DishImageResult = {
        imageUrl: chosenUrl,
        source: 'nutri_ia',
        platingDescriptionEs: `✨ Nutri IA Chef ha generado este emplatado gourmet adaptado para "${dishTitle}" con cortes suaves de proteína, vegetales cocinados al dente a 75°C y caldo bioactivo templado.`,
        platingDescriptionEn: `✨ Nutri IA Chef generated this tailored gourmet visual for "${dishTitle}" with gentle protein cuts and bioactive warm broth.`,
      };

      saveDishCustomImage(dishTitle, result.imageUrl, 'nutri_ia');
      resolve(result);
    }, 1800);
  });
}

/**
 * Convenience helper that returns the image URL for any dish or catalog recipe
 */
export function resolveDishImage(dishTitle: string, species = 'dog', fallbackUrl?: string): string {
  const custom = getDishImage(dishTitle, '', species === 'cat');
  if (custom.source !== 'default') {
    return custom.imageUrl;
  }
  if (fallbackUrl && fallbackUrl.startsWith('http') && !fallbackUrl.includes('placeholder')) {
    return fallbackUrl;
  }
  return custom.imageUrl;
}

/**
 * Convenience helper to save a custom dish image
 */
export function saveCustomDishImage(dishTitle: string, imageUrl: string, source: 'user_upload' | 'nutri_ia' = 'user_upload'): void {
  saveDishCustomImage(dishTitle, imageUrl, source);
}

