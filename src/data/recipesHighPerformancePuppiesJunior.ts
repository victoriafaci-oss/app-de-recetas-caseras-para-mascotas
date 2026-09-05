import { Recipe } from '../types';

export const HIGH_PERF_PUPPIES_JUNIOR: Recipe[] = [
  // =========================================================================
  // ETAPA 1: LACTANCIA Y TRANSICIÓN NEONATAL (NACIMIENTO A 8 SEMANAS) - 10 RECETAS
  // =========================================================================
  {
    id: 'hp-dog-01',
    title: 'Leche Maternizada de Emergencia de Cabra',
    frenchTitle: 'Lait Maternisé d’Urgence au Chèvre pour Chiots Énergiques',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Alto Rendimiento & Lactancia Neonatal',
    description: 'Fase de alta densidad calórica. Entibiar leche de cabra a 37-38°C, batir yema con yogur natural y colar para biberón.',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 98,
    prepTimeMin: 10,
    cookTimeMin: 5,
    difficulty: 'Fácil',
    suitability: 'Cachorros lactantes (0-4 semanas) huérfanos o con alta demanda metabólica',
    clinicalBenefits: [
      'Alta digestibilidad sin lactosa pesada',
      'Yema rica en colina y fosfolípidos para desarrollo cerebral',
      'Probióticos suaves para colonización intestinal temprana'
    ],
    ingredients: [
      { name: 'Leche de cabra entera fresca', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 250, notes: '250 ml entibiada a 37-38°C' },
      { name: 'Yema de huevo cruda (sin clara)', category: 'protein', baseGramsFor10kgPetPerDay: 20, notes: '1 yema fresca' },
      { name: 'Yogur natural sin azúcar / sin lactosa', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 15, notes: '1 cdta.' }
    ],
    instructions: [
      'Entibiar la leche de cabra a 37-38°C (temperatura corporal materna).',
      'Batir vigorosamente la yema de huevo con el yogur natural hasta obtener una mezcla homogénea sin grumos.',
      'Colar minuciosamente con colador fino y suministrar con biberón o jeringa de lactancia a temperatura templada.'
    ],
    storageInfo: 'Preparar en el momento o conservar máximo 12h en nevera.',
    macronutrients: { proteinPct: 32, fatPct: 45, fiberCarbPct: 23, moisturePct: 85 }
  },
  {
    id: 'hp-dog-02',
    title: 'Papilla de Destete Primerizo (Pollo e Hidratación)',
    frenchTitle: 'Bouillie Premier Sevrage Poulet & Hydratation',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Destete Primerizo (Semana 3-4)',
    description: 'Semana 3-4. Licuar pollo cocido y arroz muy pasado con caldo casero tibio hasta lograr textura cremosa líquida sin grumos.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 110,
    prepTimeMin: 15,
    cookTimeMin: 25,
    difficulty: 'Fácil',
    suitability: 'Cachorros en semana 3 a 4 iniciando la transición a sólidos con estómagos ultra delicados',
    clinicalBenefits: [
      'Textura semilíquida que previene atragantamientos',
      'Arroz blanco como almidón suave protector de mucosa',
      'Pollo magro para inicio de asimilación peptídica'
    ],
    ingredients: [
      { name: 'Pechuga de pollo cocida (sin piel ni sal)', category: 'protein', baseGramsFor10kgPetPerDay: 100, notes: '100 g bien cocida' },
      { name: 'Caldo de pollo casero colado (sin sal ni cebolla)', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 200, notes: '1 taza tibia' },
      { name: 'Arroz blanco muy cocido (deshecho)', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '1/2 taza' }
    ],
    instructions: [
      'Cocer la pechuga de pollo y el arroz blanco hasta que el arroz esté casi deshecho.',
      'Colocar en licuadora el pollo desmenuzado, el arroz y el caldo casero tibio.',
      'Licuar a máxima potencia durante 2 minutos hasta lograr una consistencia de crema líquida homogénea sin ningún grumo. Servir tibia.'
    ],
    storageInfo: 'Nevera 48h en tarro hermético.',
    macronutrients: { proteinPct: 42, fatPct: 18, fiberCarbPct: 40, moisturePct: 82 }
  },
  {
    id: 'hp-dog-03',
    title: 'Crema de Pavo y Calabaza Súper-Fácil',
    frenchTitle: 'Velouté Doux Dinde & Potiron Sevrage Chiot',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Destete Fibras Nobles (Semana 4-5)',
    description: 'Semana 4-5. Licuar pavo cocido y puré de calabaza con caldo tibio. Aporta fibra soluble que previene el estreñimiento de transición.',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 105,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Cachorros en semana 4 a 5 adaptando su motilidad gastrointestinal',
    clinicalBenefits: [
      'Fibra soluble de calabaza para tránsito intestinal suave',
      'Pavo hipoalergénico que no altera la permeabilidad entérica',
      'Excelente consistencia para rellenar juguetes interactivos o platos de lamido'
    ],
    ingredients: [
      { name: 'Pechuga de pavo cocida', category: 'protein', baseGramsFor10kgPetPerDay: 100, notes: '100 g al vapor' },
      { name: 'Puré de calabaza cocida (sin cáscara ni semillas)', category: 'vegetable', baseGramsFor10kgPetPerDay: 50, notes: '50 g cocida' },
      { name: 'Caldo de pavo casero colado', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 150, notes: 'Caldo sin sal' }
    ],
    instructions: [
      'Cocer el pavo y la calabaza al vapor hasta que queden tiernos.',
      'Licuar con suficiente caldo tibio hasta lograr una papilla sedosa.',
      'Servir tibia en plato llano o usar para ejercicios de lamido relajante.'
    ],
    storageInfo: 'Nevera 48h, congelador 2 meses.',
    macronutrients: { proteinPct: 46, fatPct: 20, fiberCarbPct: 34, moisturePct: 80 }
  },
  {
    id: 'hp-dog-04',
    title: 'Papilla de Ternera Magra y Caldo de Huesos',
    frenchTitle: 'Purée de Bœuf Maigre au Bouillon d’Os & Collagène Chiot',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Desarrollo Articular Temprano (Semana 5-6)',
    description: 'Semana 5-6. Licuar ternera y camote con caldo de huesos rico en colágeno y aminoácidos clave para el desarrollo articular temprano.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 118,
    prepTimeMin: 15,
    cookTimeMin: 25,
    difficulty: 'Fácil',
    suitability: 'Cachorros de razas medianas y grandes con rápido ritmo de crecimiento esquelético',
    clinicalBenefits: [
      'Colágeno y prolina para ligamentos y cápsulas articulares',
      'Hierro hemo para formación de hemoglobina y mioglobina',
      'Camote para energía limpia sin gluten'
    ],
    ingredients: [
      { name: 'Carne magra de ternera cocida', category: 'protein', baseGramsFor10kgPetPerDay: 80, notes: '80 g cocida' },
      { name: 'Caldo de huesos colado (rico en colágeno)', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 120, notes: '1/2 taza' },
      { name: 'Camote hervido', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 30, notes: '30 g hervido' }
    ],
    instructions: [
      'Cocer la ternera magra y el camote hasta ablandar por completo.',
      'Licuar con el caldo de huesos tibio hasta obtener una crema espesa pero fluida.',
      'Servir tibia asegurando deglución pausada.'
    ],
    storageInfo: 'Nevera 48h, congelador 1 mes.',
    macronutrients: { proteinPct: 45, fatPct: 25, fiberCarbPct: 30, moisturePct: 79 }
  },
  {
    id: 'hp-dog-05',
    title: 'Crema de Avena y Kéfir de Cabra',
    frenchTitle: 'Crème d’Avoine Douce & Kéfir de Chèvre Probiotique',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Colonización Microbioma (Semana 5-6)',
    description: 'Semana 5-6. Cocinar avena en agua y mezclar con kéfir de cabra natural. Probióticos vivos que colonizan positivamente la microbiota.',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 88,
    prepTimeMin: 10,
    cookTimeMin: 10,
    difficulty: 'Fácil',
    suitability: 'Cachorros con flora intestinal inmadura, heces blandas ocasionales o tras destete',
    clinicalBenefits: [
      'Bacterias ácido-lácticas del kéfir de cabra que colonizan el colon',
      'Betaglucanos de la avena que alimentan bacterias benéficas',
      'Regulación del pH intestinal'
    ],
    ingredients: [
      { name: 'Avena molida fina', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 30, notes: '2 cdas.' },
      { name: 'Agua purificada tibia', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 120, notes: '1/2 taza' },
      { name: 'Kéfir de cabra natural sin azúcar', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 30, notes: '2 cdas. vivas' }
    ],
    instructions: [
      'Cocinar la avena molida en agua a fuego suave hasta formar una papilla suave.',
      'Dejar entibiar a menos de 35°C para no inactivar los probióticos.',
      'Mezclar vigorosamente con el kéfir de cabra y servir como toma complementaria.'
    ],
    storageInfo: 'Consumir en el día para preservar probióticos vivos.',
    macronutrients: { proteinPct: 22, fatPct: 24, fiberCarbPct: 54, moisturePct: 84 }
  },
  {
    id: 'hp-dog-06',
    title: 'Sopa Cremosa de Hígado de Pollo y Calabacín',
    frenchTitle: 'Soupe Veloutée de Foie de Volaille & Courgettes Minérales',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Bomba de Minerales & Hierro (Semana 6-7)',
    description: 'Semana 6-7. Procesar hígado de pollo cocido y calabacín pelado con caldo. Alta densidad en hierro, vitamina A y minerales de asimilación rápida.',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 115,
    prepTimeMin: 15,
    cookTimeMin: 15,
    difficulty: 'Fácil',
    suitability: 'Cachorros en pico de crecimiento hematopoyético y desarrollo visual',
    clinicalBenefits: [
      'Vitamina A preformada para retina y epitelios mucosos',
      'Hierro orgánico para prevenir anemia del destete',
      'Calabacín hidratante con potasio'
    ],
    ingredients: [
      { name: 'Hígado de pollo cocido', category: 'organ_meat', baseGramsFor10kgPetPerDay: 50, notes: '50 g cocido al vapor' },
      { name: 'Calabacín pelado y cocido', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g pelado' },
      { name: 'Caldo de cocción colado sin sal', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 120, notes: 'Caldo tibio' }
    ],
    instructions: [
      'Cocer el hígado de pollo y el calabacín pelado en agua sin sal durante 10 minutos.',
      'Procesar con el caldo de cocción hasta obtener una textura semilíquida sedosa y fácil de lamer.',
      'Servir templada como premio o refuerzo mineral de la jornada.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 52, fatPct: 28, fiberCarbPct: 20, moisturePct: 81 }
  },
  {
    id: 'hp-dog-07',
    title: 'Licuado de Destete de Pescado Blanco y Zanahoria',
    frenchTitle: 'Smoothie Fondant Merluche Vapeur & Carottes Douces',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Proteína Hipoalergénica & Visión (Semana 6)',
    description: 'Semana 6. Licuar merluza al vapor desespinada y zanahoria con agua tibia. Proteína de altísima asimilación con betacarotenos.',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 95,
    prepTimeMin: 15,
    cookTimeMin: 12,
    difficulty: 'Fácil',
    suitability: 'Cachorros con tendencia a intolerancias o digestiones pesadas con carnes rojas',
    clinicalBenefits: [
      'Digestibilidad de la proteína de pescado >94%',
      'Betacarotenos para salud dérmica y ocular',
      'Sin grasas pesadas para el páncreas del cachorro'
    ],
    ingredients: [
      { name: 'Merluza al vapor desespinada escrupulosamente', category: 'protein', baseGramsFor10kgPetPerDay: 80, notes: '80 g sin espinas' },
      { name: 'Zanahoria cocida suave', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g cocida' },
      { name: 'Agua purificada tibia', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 100, notes: 'Agua de cocción' }
    ],
    instructions: [
      'Cocinar la merluza al vapor y revisar minuciosamente con los dedos la ausencia total de espinas.',
      'Cocer la zanahoria hasta que esté blanda.',
      'Licuar el pescado y la zanahoria con el agua tibia hasta formar una papilla homogénea.'
    ],
    storageInfo: 'Nevera 36 horas.',
    macronutrients: { proteinPct: 50, fatPct: 15, fiberCarbPct: 35, moisturePct: 83 }
  },
  {
    id: 'hp-dog-08',
    title: 'Crema de Camote y Yema de Codorniz Cocida',
    frenchTitle: 'Crème de Patate Douce & Jaune d’Œuf de Caille Chiot',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Microelementos Nobles (Semana 6-7)',
    description: 'Semana 6-7. Machacar camote cocido con yema de codorniz e integrar agua o caldo tibio. Microelementos de absorción óptima.',
    imageUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 112,
    prepTimeMin: 10,
    cookTimeMin: 15,
    difficulty: 'Fácil',
    suitability: 'Cachorros que necesitan densidad nutricional en pequeñas tomas',
    clinicalBenefits: [
      'Lecitina y luteína biodisponibles de la codorniz',
      'Complejo B concentrado para maduración neuromuscular',
      'Energía de asimilación limpia sin azúcares libres'
    ],
    ingredients: [
      { name: 'Camote cocido y machacado', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 60, notes: '60 g cocido' },
      { name: 'Yema de huevo de codorniz cocida', category: 'protein', baseGramsFor10kgPetPerDay: 15, notes: '1 yema cocida' },
      { name: 'Caldo apto o agua tibia', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 80, notes: '1/3 taza' }
    ],
    instructions: [
      'Hervir el camote y el huevo de codorniz.',
      'Pelar y separar la yema cocida de codorniz.',
      'Machacar el camote con la yema e incorporar el agua tibia o caldo hasta crear una crema sedosa y ligera.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 25, fatPct: 30, fiberCarbPct: 45, moisturePct: 80 }
  },
  {
    id: 'hp-dog-09',
    title: 'Crema de Pollo, Manzana y Avena',
    frenchTitle: 'Crème Fondante Poulet Fermier, Pomme Douce & Flocons d’Avoine',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Energía Sostenida & Pectina (Semana 7)',
    description: 'Semana 7. Licuar pollo con manzana roja cocida sin pepitas y avena con caldo sin sal. Pectina que regula el tránsito intestinal.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 120,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Cachorros en fase activa de juego y exploración previa a la comida sólida completa',
    clinicalBenefits: [
      'Pectina de manzana que protege la pared intestinal',
      'Proteína de pollo de alto valor biológico',
      'Carbohidratos de absorción gradual sin hipoglucemias de rebote'
    ],
    ingredients: [
      { name: 'Pechuga de pollo cocida', category: 'protein', baseGramsFor10kgPetPerDay: 100, notes: '100 g cocida' },
      { name: 'Manzana roja pelada y cocida (sin pepitas)', category: 'vegetable', baseGramsFor10kgPetPerDay: 35, notes: '1/4 de manzana' },
      { name: 'Avena cocida', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 20, notes: '1 cda. cocida' },
      { name: 'Caldo de pollo casero sin sal', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 100, notes: 'Caldo tibio' }
    ],
    instructions: [
      'Cocer el pollo y la manzana pelada y descorazonada.',
      'Cocer la avena en caldo de pollo casero.',
      'Licuar todos los ingredientes juntos hasta formar una papilla sedosa y aromática.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 44, fatPct: 20, fiberCarbPct: 36, moisturePct: 78 }
  },
  {
    id: 'hp-dog-10',
    title: 'Elixir Rehidratante para Madre y Cachorros',
    frenchTitle: 'Élixir Rehydratant Longue Cuisson Mère & Portée',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Estimulación Metabólica & Lactancia',
    description: 'Fase de estimulación. Caldo de huesos de res con tuétano a fuego lento 12h con pechuga de pollo deshebrada. Colágeno y electrolitos bioactivos.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 85,
    prepTimeMin: 20,
    cookTimeMin: 360,
    difficulty: 'Media',
    suitability: 'Madres lactantes de alta demanda y cachorros en transición a papilla',
    clinicalBenefits: [
      'Glucosaminoglicanos y electrolitos para rehidratación inmediata',
      'Tuétano con factores inmunitarios naturales',
      'Proteína licuada sin residuos óseos'
    ],
    ingredients: [
      { name: 'Huesos de res con tuétano (para cocer y retirar)', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 200, notes: 'Cocer 12h y retirar 100%' },
      { name: 'Pechuga de pollo cocida licuada', category: 'protein', baseGramsFor10kgPetPerDay: 100, notes: 'Carne deshebrada' },
      { name: 'Agua filtrada pura', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 500, notes: '2 litros en olla' }
    ],
    instructions: [
      'Cocinar los huesos con tuétano a fuego lento durante 8 a 12 horas en abundante agua.',
      'Retirar y desechar TODOS los huesos cocidos (regla estricta de seguridad).',
      'Colar el caldo dorado, licuar con la pechuga de pollo cocida y servir tibio.'
    ],
    storageInfo: 'Nevera 5 días, congelador 3 meses.',
    macronutrients: { proteinPct: 48, fatPct: 32, fiberCarbPct: 20, moisturePct: 86 }
  },

  // =========================================================================
  // ETAPA 2: CACHORROS EN CRECIMIENTO RÁPIDO (DESTETE A 12 MESES) - 10 RECETAS
  // =========================================================================
  {
    id: 'hp-dog-11',
    title: 'Cazuela de Pollo con Zanahoria y Arroz Integral',
    frenchTitle: 'Casserole de Poulet, Carottes & Riz Complet Énergie Durable',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Crecimiento Rápido & Energía Constante',
    description: 'Pollo desmenuzado, arroz integral muy cocido, zanahoria, aceite de coco y calcio de cáscara de huevo. Energía constante para cachorros dinámicos.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 135,
    prepTimeMin: 15,
    cookTimeMin: 30,
    difficulty: 'Fácil',
    suitability: 'Cachorros en crecimiento acelerado (destete a 12 meses) de razas enérgicas',
    clinicalBenefits: [
      'Arroz integral con carbohidratos complejos de bajo índice glucémico',
      'Grasas de cadena media (MCT) del aceite de coco para energía inmediata',
      'Calcio biológico para mineralización ósea equilibrada'
    ],
    ingredients: [
      { name: 'Pechuga de pollo cocida desmenuzada', category: 'protein', baseGramsFor10kgPetPerDay: 150, notes: '150 g desmenuzada' },
      { name: 'Arroz integral muy cocido', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '50 g cocido suave' },
      { name: 'Zanahoria picada fina cocida', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g cocida' },
      { name: 'Aceite de coco virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' },
      { name: 'Polvo fino de cáscara de huevo', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 2.5, notes: '1/2 cdta.' }
    ],
    instructions: [
      'Cocer el arroz integral hasta que quede muy suave.',
      'Mezclar el pollo cocido desmenuzado con el arroz y la zanahoria.',
      'Incorporar el aceite de coco tibio y el polvo de cáscara de huevo molida. Revolver bien y servir templado.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 45, fatPct: 25, fiberCarbPct: 30, moisturePct: 75 }
  },
  {
    id: 'hp-dog-12',
    title: 'Estofado de Pavo con Calabacín y Avena Hidratada',
    frenchTitle: 'Ragoût de Dinde Tendre, Courgettes & Avoine Hydratée Cognition',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Desarrollo Neurocognitivo & DHA/EPA',
    description: 'Pavo molido cocido con avena remojada, calabacín al vapor y aceite de salmón salvaje. Aporte de DHA/EPA para cachorros inteligentes.',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 130,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Cachorros en fase de aprendizaje activo, obediencia y trabajo olfativo',
    clinicalBenefits: [
      'DHA para desarrollo sináptico cerebral y agudeza visual',
      'Avena que aporta triptófano, precursor de serotonina',
      'Pavo ligero que evita pesadez tras la ingesta'
    ],
    ingredients: [
      { name: 'Pavo molido magro cocido', category: 'protein', baseGramsFor10kgPetPerDay: 150, notes: '150 g cocido' },
      { name: 'Avena en hojuelas (remojada en agua caliente)', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 40, notes: '40 g hidratada' },
      { name: 'Calabacín cocido al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g al vapor' },
      { name: 'Aceite de salmón salvaje', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: '1/2 cdta.' }
    ],
    instructions: [
      'Remojar la avena en agua caliente durante 10 minutos hasta que esponje.',
      'Unir el pavo cocido desmenuzado con la avena escurrida y el calabacín.',
      'Aderezar con el aceite de salmón crudo en templado para no oxidar los ácidos grasos.'
    ],
    storageInfo: 'Nevera 3 días.',
    macronutrients: { proteinPct: 48, fatPct: 24, fiberCarbPct: 28, moisturePct: 76 }
  },
  {
    id: 'hp-dog-13',
    title: 'Ternera Molida con Puré de Camote y Espinacas',
    frenchTitle: 'Bœuf Haché Musculaire, Purée de Patate Douce & Épinards',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Musculación & Hierro Biodisponible',
    description: 'Ternera molida cocida con puré de camote, espinacas al vapor y aceite de oliva virgen. Crecimiento muscular vigoroso y antioxidantes.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 140,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Cachorros de razas atléticas, cobradores, pastores o de presa en fase de musculación',
    clinicalBenefits: [
      'Creatina y carnitina naturales para desarrollo de fibras musculares tipo II',
      'Hierro hemo para óptima oxigenación en sprint y juego',
      'Espinacas cocidas con clorofila antioxidante'
    ],
    ingredients: [
      { name: 'Carne molida de ternera cocida', category: 'protein', baseGramsFor10kgPetPerDay: 130, notes: '130 g magra' },
      { name: 'Camote hervido machacado', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 60, notes: '60 g machacado' },
      { name: 'Espinacas cocidas al vapor picadas finas', category: 'vegetable', baseGramsFor10kgPetPerDay: 20, notes: '20 g picadas' },
      { name: 'Aceite de oliva extra virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Saltear o hervir la ternera molida hasta que pierda el tono rojizo.',
      'Combinar con el puré de camote hervido y las espinacas picadas.',
      'Agregar el aceite de oliva y mezclar uniformemente antes de servir.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 46, fatPct: 26, fiberCarbPct: 28, moisturePct: 75 }
  },
  {
    id: 'hp-dog-14',
    title: 'Albóndigas de Pollo y Manzana al Horno',
    frenchTitle: 'Boulettes Rôties de Volaille & Pomme Croquante Chiot',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Estimulación Mandibular & Masticación',
    description: 'Premio o ración masticable horneada. Pollo picado, manzana rallada, harina de avena y huevo. Fortalece mandíbula y estimula juego.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 155,
    prepTimeMin: 20,
    cookTimeMin: 15,
    difficulty: 'Fácil',
    suitability: 'Cachorros hiperactivos que necesitan masticar para autorregularse',
    clinicalBenefits: [
      'La masticación pausada estimula receptores trigeminales que reducen estrés',
      'Huevo con colina y albúmina de máxima biodisponibilidad',
      'Perfecto para ejercicios de espera y premios de alto valor en trabajo de olfato'
    ],
    ingredients: [
      { name: 'Carne de pollo picada cruda', category: 'protein', baseGramsFor10kgPetPerDay: 200, notes: '200 g picada' },
      { name: 'Manzana roja rallada (sin semillas)', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '1/2 manzana' },
      { name: 'Harina de avena integral', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 30, notes: '2 cdas.' },
      { name: 'Huevo entero batido', category: 'protein', baseGramsFor10kgPetPerDay: 25, notes: '1 huevo batido' }
    ],
    instructions: [
      'Mezclar en un cuenco la carne de pollo con la manzana rallada, la avena y el huevo batido.',
      'Formar bolitas del tamaño de un bocado adaptado a la boca del cachorro.',
      'Hornear a 180°C durante 15 minutos en bandeja con papel vegetal. Dejar enfriar por completo antes de ofrecer.'
    ],
    storageInfo: 'Nevera 5 días en táper hermético, congelador 2 meses.',
    macronutrients: { proteinPct: 50, fatPct: 22, fiberCarbPct: 28, moisturePct: 70 }
  },
  {
    id: 'hp-dog-15',
    title: 'Revuelto Proteico Canino con Brócoli',
    frenchTitle: 'Brouillade Canina Protéinée au Dinde & Vapeur de Brocoli',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Aminograma Completo & Brócoli',
    description: 'Huevo entero revuelto con aceite de coco, pavo cocido y flores de brócoli al vapor. El aminograma más completo para síntesis de tejidos.',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 135,
    prepTimeMin: 10,
    cookTimeMin: 10,
    difficulty: 'Fácil',
    suitability: 'Cachorros en recuperación física tras jornadas de ejercicio o adiestramiento',
    clinicalBenefits: [
      'Aminograma patrón del huevo: valor biológico 100',
      'Sulforafano del brócoli al vapor que apoya vías de detoxificación celular',
      'Ácido láurico antimicrobiano del aceite de coco'
    ],
    ingredients: [
      { name: 'Huevo campero entero fresco', category: 'protein', baseGramsFor10kgPetPerDay: 50, notes: '1 huevo entero' },
      { name: 'Carne de pavo cocida troceada', category: 'protein', baseGramsFor10kgPetPerDay: 100, notes: '100 g cocida' },
      { name: 'Flores de brócoli al vapor picadas finas', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g al vapor' },
      { name: 'Aceite de coco virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Hacer un revuelto suave con el huevo en sartén con la cucharadita de aceite de coco a fuego lento.',
      'Una vez tibio, picar el revuelto e integrar el pavo cocido y el brócoli al vapor picado fino.',
      'Servir a temperatura ambiente asegurando excelente palatabilidad.'
    ],
    storageInfo: 'Consumir en el día o nevera 24 horas.',
    macronutrients: { proteinPct: 52, fatPct: 30, fiberCarbPct: 18, moisturePct: 76 }
  },
  {
    id: 'hp-dog-16',
    title: 'Pescado Blanco al Vapor con Puré de Calabaza',
    frenchTitle: 'Filet de Merluche Vapeur & Velouté de Potiron Délicat',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Digestión Ligera & Omega-3 Puro',
    description: 'Filete de merluza desmenuzado sin espinas, puré de calabaza y aceite de salmón. Dieta ligera, altamente digestible para estómagos sensibles.',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 110,
    prepTimeMin: 15,
    cookTimeMin: 15,
    difficulty: 'Fácil',
    suitability: 'Cachorros en días de estrés, viajes o tras episodios de excitación gastrointestinal',
    clinicalBenefits: [
      'Mínima fermentación indeseada en intestino grueso',
      'Omega-3 EPA para reducir mediadores proinflamatorios',
      'Calabaza que proporciona saciedad voluminosa y suave'
    ],
    ingredients: [
      { name: 'Filete de merluza al vapor (sin espinas)', category: 'protein', baseGramsFor10kgPetPerDay: 140, notes: '140 g desmenuzada' },
      { name: 'Puré de calabaza cocida', category: 'vegetable', baseGramsFor10kgPetPerDay: 50, notes: '50 g en puré' },
      { name: 'Aceite de salmón salvaje', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: '1/2 cdta.' }
    ],
    instructions: [
      'Cocer la merluza al vapor y desmenuzar minuciosamente asegurando cero espinas.',
      'Mezclar con el puré de calabaza cocida.',
      'Añadir el aceite de salmón justo antes de servir para preservar los ácidos grasos.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 55, fatPct: 22, fiberCarbPct: 23, moisturePct: 80 }
  },
  {
    id: 'hp-dog-17',
    title: 'Pastel de Res con Zanahoria y Semillas de Chía',
    frenchTitle: 'Terrine de Bœuf Énergétique aux Carottes & Graines de Chia',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Mucílagos Protectores & Fibra Sostenida',
    description: 'Res magra cocida, zanahoria rallada, chía hidratada y arroz integral. Mucílagos protectores del tracto digestivo y omega-3 vegetal.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 140,
    prepTimeMin: 20,
    cookTimeMin: 25,
    difficulty: 'Fácil',
    suitability: 'Cachorros que comen con excesiva rapidez o sufren heces variables por sobreexcitación',
    clinicalBenefits: [
      'Mucílagos de chía que lubrican y calman la pared gástrica',
      'Proteína de res para tono muscular enérgico',
      'Textura prensada ideal para cortar en dados y racionar'
    ],
    ingredients: [
      { name: 'Carne de res magra cocida', category: 'protein', baseGramsFor10kgPetPerDay: 150, notes: '150 g picada' },
      { name: 'Zanahoria rallada cocida', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g al vapor' },
      { name: 'Semillas de chía hidratadas en agua', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 10, notes: '1 cdta. en gel' },
      { name: 'Arroz integral cocido', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 30, notes: '30 g cocido' }
    ],
    instructions: [
      'Hidratar la chía en 3 cucharadas de agua tibia durante 15 minutos hasta formar gel.',
      'Unir la carne con el arroz cocido, la zanahoria y el gel de chía.',
      'Prensar la mezcla en un molde rectangular y dejar asentar en nevera para cortar en dados uniformes.'
    ],
    storageInfo: 'Nevera 4 días, congelador 2 meses.',
    macronutrients: { proteinPct: 48, fatPct: 24, fiberCarbPct: 28, moisturePct: 74 }
  },
  {
    id: 'hp-dog-18',
    title: 'Delicia de Conejo con Calabacín y Arroz',
    frenchTitle: 'Délice de Lapin Fin aux Courgettes & Riz Tendre',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Proteína Novel Hipoalergénica',
    description: 'Conejo deshuesado cocido con arroz blanco y calabacín al vapor. Carne novel baja en grasa y altamente palatable para cachorros selectivos.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 125,
    prepTimeMin: 15,
    cookTimeMin: 35,
    difficulty: 'Fácil',
    suitability: 'Cachorros con paladar exigente o sospecha de reactividad a pollo y ternera',
    clinicalBenefits: [
      'Conejo: carne blanca novel sin grasas proinflamatorias',
      'Arroz blanco como fuente amilácea de digestión sin esfuerzo metabólico',
      'Calabacín con 95% de agua biológica celular'
    ],
    ingredients: [
      { name: 'Carne de conejo deshuesada cocida', category: 'protein', baseGramsFor10kgPetPerDay: 140, notes: '140 g sin huesos' },
      { name: 'Arroz blanco cocido', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '50 g cocido suave' },
      { name: 'Calabacín al vapor picado', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g en dados' }
    ],
    instructions: [
      'Cocer el conejo durante 35 minutos y retirar escrupulosamente todo hueso.',
      'Cortar la carne en trozos pequeños del tamaño de un guisante.',
      'Mezclar con el arroz blanco y el calabacín al vapor templados.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 50, fatPct: 20, fiberCarbPct: 30, moisturePct: 78 }
  },
  {
    id: 'hp-dog-19',
    title: 'Puré Nutritivo de Salmón con Guisantes y Camote',
    frenchTitle: 'Purée Rustique de Saumon Sauvage, Petits Pois Doux & Patate Douce',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Antioxidantes Inmunes & EPA/DHA',
    description: 'Salmón al vapor desmenuzado con camote hervido y guisantes machacados en puré rústico. Aporte proteico con antioxidantes para inmunidad.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 135,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Cachorros en fase de vacunación y socialización con alta demanda inmunitaria',
    clinicalBenefits: [
      'Ácidos grasos esenciales que modulan la respuesta inmunitaria vacunal',
      'Guisantes con luteína y fibra vegetal moderada',
      'Alta aceptación olfativa que despierta el apetito'
    ],
    ingredients: [
      { name: 'Filete de salmón al vapor sin espinas', category: 'protein', baseGramsFor10kgPetPerDay: 120, notes: '120 g sin espinas' },
      { name: 'Camote hervido machacado', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '50 g en puré' },
      { name: 'Guisantes cocidos machacados', category: 'vegetable', baseGramsFor10kgPetPerDay: 20, notes: '20 g machacados' }
    ],
    instructions: [
      'Cocinar el salmón al vapor comprobando minuciosamente la ausencia de espinas.',
      'Hervir el camote y los guisantes tiernos y machacarlos con tenedor.',
      'Integrar el salmón desmenuzado con los vegetales formando un puré rústico templado.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 46, fatPct: 28, fiberCarbPct: 26, moisturePct: 77 }
  },
  {
    id: 'hp-dog-20',
    title: 'Picadillo de Res y Corazón con Espinacas',
    frenchTitle: 'Émincé de Bœuf & Cœur de Bœuf aux Épinards Cardioprotecteur',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Soporte Miocárdico & Taurina/L-Carnitina',
    description: 'Ternera, corazón de res picado fino, arroz integral, espinacas y aceite de oliva. Taurina y L-carnitina para el corazón del cachorro hiperactivo.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 138,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Cachorros con actividad cardiovascular continua, carreras explosivas y resistencia',
    clinicalBenefits: [
      'Corazón de res: la mayor fuente natural de taurina, carnitina y CoQ10',
      'Optimiza la contracción del miocardio durante el esfuerzo vigoroso',
      'Arroz integral que repone glucógeno sin sobrecargar la insulina'
    ],
    ingredients: [
      { name: 'Carne de ternera magra cocida', category: 'protein', baseGramsFor10kgPetPerDay: 100, notes: '100 g picada' },
      { name: 'Corazón de res cocido picado fino', category: 'organ_meat', baseGramsFor10kgPetPerDay: 30, notes: '30 g picado fino' },
      { name: 'Arroz integral cocido', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 30, notes: '30 g cocido' },
      { name: 'Espinacas cocidas picadas', category: 'vegetable', baseGramsFor10kgPetPerDay: 20, notes: '20 g picadas' },
      { name: 'Aceite de oliva extra virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Cocer la ternera y el corazón de res hasta punto tierno y picar minuciosamente.',
      'Mezclar con el arroz integral cocido y las espinacas.',
      'Aderezar con el aceite de oliva y servir templado.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 48, fatPct: 26, fiberCarbPct: 26, moisturePct: 75 }
  },

  // =========================================================================
  // ETAPA 3: JUNIOR (12 A 18 MESES) - 10 RECETAS
  // =========================================================================
  {
    id: 'hp-dog-21',
    title: 'Cazuela de Ternera Magra con Lentejas Muy Cocidas',
    frenchTitle: 'Casserole de Bœuf Maigre aux Lentilles Fondantes Énergie Stable',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Energía Limpia & Bajo Índice Glucémico',
    description: 'Ternera magra con lentejas muy cocidas, puré de calabaza y aceite de coco. Carbohidratos de bajo índice glucémico para evitar picos de glucosa e hiperactividad.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 140,
    prepTimeMin: 15,
    cookTimeMin: 40,
    difficulty: 'Fácil',
    suitability: 'Perros jóvenes (12 a 18 meses) con picos de hiperactividad tras comer',
    clinicalBenefits: [
      'Evita los picos y caídas bruscas de azúcar en sangre que disparan la ansiedad',
      'Fibra fermentable que produce ácidos grasos de cadena corta en colon',
      'Hierro y zinc para desarrollo neuromuscular maduro'
    ],
    ingredients: [
      { name: 'Carne de ternera magra cocida', category: 'protein', baseGramsFor10kgPetPerDay: 150, notes: '150 g picada' },
      { name: 'Lentejas (muy cocidas y deshechas)', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 40, notes: '40 g muy cocidas' },
      { name: 'Puré de calabaza cocida', category: 'vegetable', baseGramsFor10kgPetPerDay: 50, notes: '50 g en puré' },
      { name: 'Aceite de coco virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Cocer las lentejas abundantemente hasta que queden prácticamente deshechas.',
      'Combinar la ternera picada con las lentejas escurridas y el puré de calabaza.',
      'Incorporar el aceite de coco tibio y revolver bien antes de servir.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 47, fatPct: 23, fiberCarbPct: 30, moisturePct: 76 }
  },
  {
    id: 'hp-dog-22',
    title: 'Pollo Desmenuzado con Quinoa y Zanahoria',
    frenchTitle: 'Poulet Fermier Effiloché au Quinoa & Carottes Super-Protéine',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Súper Proteína & Construcción Muscular',
    description: 'Pollo al vapor con quinoa cocida, zanahoria y aceite de oliva. Quinoa con todos los aminoácidos esenciales para la adolescencia canina.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 135,
    prepTimeMin: 15,
    cookTimeMin: 25,
    difficulty: 'Fácil',
    suitability: 'Perros jóvenes en etapa de estirón muscular y consolidación de postura',
    clinicalBenefits: [
      'Quinoa pseudocereal sin gluten con perfil proteico vegetal completo',
      'Magnesio y fósforo para densidad ósea y contracción muscular',
      'Pollo de fácil deglución y asimilación gástrica'
    ],
    ingredients: [
      { name: 'Pechuga de pollo al vapor desmenuzada', category: 'protein', baseGramsFor10kgPetPerDay: 150, notes: '150 g desmenuzada' },
      { name: 'Quinoa (muy enjuagada y cocida)', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '50 g cocida' },
      { name: 'Zanahoria cocida suave', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g picada' },
      { name: 'Aceite de oliva extra virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Lavar muy bien la quinoa en agua fría para retirar saponinas y cocer durante 15 minutos.',
      'Unir el pollo desmenuzado con la quinoa cocida templada y la zanahoria.',
      'Aliñar con la cucharadita de aceite de oliva y servir.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 48, fatPct: 22, fiberCarbPct: 30, moisturePct: 77 }
  },
  {
    id: 'hp-dog-23',
    title: 'Pavo Molido con Arroz Integral y Brócoli',
    frenchTitle: 'Dinde Hachée Maigre, Riz Complet & Brocoli Vapeur',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Masa Magra & Prevención de Sobrepeso',
    description: 'Pavo magro, arroz integral, flores de brócoli al vapor y aceite de salmón. Bajo en grasas saturadas para perros jóvenes dinámicos.',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 130,
    prepTimeMin: 15,
    cookTimeMin: 25,
    difficulty: 'Fácil',
    suitability: 'Perros jóvenes de apetito voraz con tendencia a engordar si no queman energía',
    clinicalBenefits: [
      'Proteína limpia con baja densidad de grasa para mantener silueta atlética',
      'Sulforafano que protege el endotelio vascular durante el esfuerzo físico',
      'Aceite de salmón para pelaje brillante y articulaciones elásticas'
    ],
    ingredients: [
      { name: 'Pavo molido magro cocido', category: 'protein', baseGramsFor10kgPetPerDay: 160, notes: '160 g cocido' },
      { name: 'Arroz integral cocido', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '50 g cocido' },
      { name: 'Brócoli al vapor picado fino', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g al vapor' },
      { name: 'Aceite de salmón salvaje', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: '1/2 cdta.' }
    ],
    instructions: [
      'Cocer el pavo molido y el arroz integral.',
      'Cocinar al vapor el brócoli y picarlo menudito.',
      'Mezclar todos los ingredientes y verter el aceite de salmón justo antes de servir.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 50, fatPct: 20, fiberCarbPct: 30, moisturePct: 76 }
  },
  {
    id: 'hp-dog-24',
    title: 'Ensalada Templada de Salmón, Papa y Espinacas',
    frenchTitle: 'Salade Tiède de Saumon Sauvage, Pomme de Terre & Épinards Récupération',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Recarga Glucogénica & Recuperación Post-Ejercicio',
    description: 'Salmón cocido sin espinas con papa hervida machacada, espinacas y aceite de oliva. Recarga rápida de glucógeno tras ejercicio intenso.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 138,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros jóvenes tras sesiones exigentes de entrenamiento, agility o senderismo',
    clinicalBenefits: [
      'Reposición glucogénica muscular acelerada gracias al almidón cocido de papa',
      'Desinflamación de tejidos ligamentosos gracias a los ácidos EPA/DHA marinos',
      'Potasio para prevenir fatiga o calambres musculares'
    ],
    ingredients: [
      { name: 'Salmón cocido (sin espinas)', category: 'protein', baseGramsFor10kgPetPerDay: 130, notes: '130 g desmenuzado' },
      { name: 'Papa hervida sin piel machacada', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 60, notes: '60 g machacada' },
      { name: 'Espinacas al vapor picadas', category: 'vegetable', baseGramsFor10kgPetPerDay: 20, notes: '20 g al vapor' },
      { name: 'Aceite de oliva extra virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Cocer la papa pelada hasta que esté blanda y machacar con tenedor.',
      'Cocer el salmón, desmigar verificando que no tenga espinas.',
      'Combinar con las espinacas al vapor y el aceite de oliva. Servir tibia tras reposar del ejercicio.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 44, fatPct: 28, fiberCarbPct: 28, moisturePct: 77 }
  },
  {
    id: 'hp-dog-25',
    title: 'Albóndigas de Res y Corazón con Avena y Perejil',
    frenchTitle: 'Boulettes Énergiques Bœuf, Cœur de Bœuf, Avoine & Persil Frais',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Aliento Fresco & Taurina Pura',
    description: 'Res picada, corazón de res, avena, perejil fino y huevo horneadas. El perejil aporta antioxidantes y ayuda a refrescar el aliento.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 160,
    prepTimeMin: 20,
    cookTimeMin: 15,
    difficulty: 'Fácil',
    suitability: 'Perros jóvenes con aliento fuerte por juego con pelotas o comida rápida',
    clinicalBenefits: [
      'Clorofila fresca del perejil que neutraliza compuestos volátiles de azufre bucales',
      'Aporte concentrado de zinc y hierro para inmunidad',
      'Excelente formato para juegos de nariz y premios de autocontrol'
    ],
    ingredients: [
      { name: 'Carne de res picada magra', category: 'protein', baseGramsFor10kgPetPerDay: 120, notes: '120 g picada' },
      { name: 'Corazón de res picado fino', category: 'organ_meat', baseGramsFor10kgPetPerDay: 40, notes: '40 g picado' },
      { name: 'Avena molida', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 25, notes: '2 cdas.' },
      { name: 'Perejil fresco picado muy fino', category: 'vegetable', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' },
      { name: 'Huevo entero batido', category: 'protein', baseGramsFor10kgPetPerDay: 25, notes: '1 huevo' }
    ],
    instructions: [
      'Mezclar la res, el corazón picado, la avena, el perejil fino y el huevo.',
      'Formar albóndigas del tamaño de una nuez.',
      'Hornear a 180°C durante 15 minutos. Servir templadas o frías.'
    ],
    storageInfo: 'Nevera 4 días, congelador 2 meses.',
    macronutrients: { proteinPct: 52, fatPct: 24, fiberCarbPct: 24, moisturePct: 71 }
  },
  {
    id: 'hp-dog-26',
    title: 'Conejo al Horno con Puré de Camote y Linaza',
    frenchTitle: 'Lapin Rôti au Four, Purée de Patate Douce & Lin Doré Pelage',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Piel & Pelaje en Maduración',
    description: 'Conejo cocido desmenuzado con camote asado y semillas de linaza molidas. Apoya el brillo del pelaje y la barrera dérmica en perros jóvenes.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 132,
    prepTimeMin: 15,
    cookTimeMin: 35,
    difficulty: 'Fácil',
    suitability: 'Perros jóvenes durante la muda de pelo de cachorro a pelaje adulto definitivo',
    clinicalBenefits: [
      'Ácido alfa-linolénico (ALA) de la linaza para ceramidas dérmicas',
      'Proteína de conejo sin residuos de histamina',
      'Zinc biológico para queratinización de almohadillas plantares'
    ],
    ingredients: [
      { name: 'Carne de conejo deshuesada cocida', category: 'protein', baseGramsFor10kgPetPerDay: 150, notes: '150 g desmenuzada' },
      { name: 'Camote al horno machacado', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '50 g asado' },
      { name: 'Semillas de linaza molidas finas', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: '1/2 cdta. recién molida' }
    ],
    instructions: [
      'Cocer o asar el conejo y desmigar meticulosamente retirando huesos.',
      'Asar el camote al horno y machacarlo con tenedor.',
      'Mezclar la carne con el camote e integrar las semillas de linaza recién molidas.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 49, fatPct: 23, fiberCarbPct: 28, moisturePct: 77 }
  },
  {
    id: 'hp-dog-27',
    title: 'Guiso de Cerdo Magro con Calabaza y Guisantes',
    frenchTitle: 'Ragoût de Porc Maigre, Potiron Fondant & Petits Pois Thiamine B1',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Vitamina B1 & Metabolismo Energético',
    description: 'Lomo de cerdo magro sin grasa visible, calabaza al vapor y guisantes cocidos. Aporte de tiamina (vitamina B1) vital para la energía celular.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 135,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros jóvenes hiperactivos que consumen grandes cantidades de glucosa cerebral',
    clinicalBenefits: [
      'Tiamina esencial para el ciclo de Krebs y transporte de impulsos nerviosos',
      'Calabaza hidratante que equilibra la densidad de la carne',
      'Guisantes tiernos con aminoácidos ramificados (BCAA)'
    ],
    ingredients: [
      { name: 'Lomo de cerdo magro (cocido, sin grasa visible)', category: 'protein', baseGramsFor10kgPetPerDay: 140, notes: '140 g en cubos' },
      { name: 'Calabaza al vapor machacada', category: 'vegetable', baseGramsFor10kgPetPerDay: 50, notes: '50 g al vapor' },
      { name: 'Guisantes tiernos cocidos', category: 'vegetable', baseGramsFor10kgPetPerDay: 20, notes: '20 g cocidos' }
    ],
    instructions: [
      'Cocer el lomo de cerdo en agua hasta punto seguro y cortar en cubitos pequeños.',
      'Cocer al vapor la calabaza y los guisantes hasta que estén tiernos.',
      'Unir los ingredientes templados en el cuenco y servir.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 52, fatPct: 22, fiberCarbPct: 26, moisturePct: 76 }
  },
  {
    id: 'hp-dog-28',
    title: 'Tazón de Atún Templado con Quinoa y Manzana',
    frenchTitle: 'Bol Énergétique Thon Naturel, Quinoa & Pomme Rouge Microbiome',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Digestión Ligera & Protección del Microbioma',
    description: 'Atún cocido bajo en sodio con quinoa y daditos de manzana roja cocida. Alto valor proteico con fibra soluble para el microbioma de perros jóvenes.',
    imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 128,
    prepTimeMin: 15,
    cookTimeMin: 15,
    difficulty: 'Fácil',
    suitability: 'Perros jóvenes con sensibilidad estomacal que necesitan una comida apetitosa y ligera',
    clinicalBenefits: [
      'Proteína marina de asimilación rápida que no distiende el estómago',
      'Pectina que fomenta flora benéfica y heces consistentes',
      'Excelente aroma natural que estimula perros que se distraen comiendo'
    ],
    ingredients: [
      { name: 'Atún fresco cocido (o al natural muy bajo en sodio)', category: 'protein', baseGramsFor10kgPetPerDay: 120, notes: '120 g cocido' },
      { name: 'Quinoa cocida', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '50 g cocida' },
      { name: 'Manzana roja cocida en dados (sin semillas)', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g en dados' }
    ],
    instructions: [
      'Cocer la quinoa y la manzana en agua hirviendo.',
      'Desmigar el atún cocido verificando que no contenga sal añadida ni espinas.',
      'Mezclar en el tazón la quinoa templada con el atún y los dados de manzana suave.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 50, fatPct: 20, fiberCarbPct: 30, moisturePct: 78 }
  },
  {
    id: 'hp-dog-29',
    title: 'Pollo al Vapor con Brócoli, Calabacín y Salmón',
    frenchTitle: 'Poulet Vapeur, Duo Vert Énergie & Huile de Saumon Sauvage',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Hidratación Tisular & Condición Magra',
    description: 'Pollo picado, brócoli, calabacín al vapor y aceite de salmón salvaje. Satisface el apetito sin exceso calórico, manteniendo la condición magra.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 125,
    prepTimeMin: 15,
    cookTimeMin: 15,
    difficulty: 'Fácil',
    suitability: 'Perros jóvenes muy activos que reclaman raciones voluminosas',
    clinicalBenefits: [
      'Aporte hídrico vegetal orgánico superior al 80%',
      'Sensación de saciedad gástrica duradera',
      'Antioxidantes celulares para contrarrestar radicales libres del ejercicio'
    ],
    ingredients: [
      { name: 'Pechuga de pollo al vapor picada', category: 'protein', baseGramsFor10kgPetPerDay: 160, notes: '160 g picada' },
      { name: 'Brócoli al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g al vapor' },
      { name: 'Calabacín al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g al vapor' },
      { name: 'Aceite de salmón salvaje', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Cocinar el pollo, el brócoli y el calabacín al vapor durante 12-15 minutos.',
      'Combinar los ingredientes al vapor templados en el cuenco.',
      'Verter la cucharadita de aceite de salmón crudo justo antes de servir.'
    ],
    storageInfo: 'Nevera 3 días.',
    macronutrients: { proteinPct: 53, fatPct: 23, fiberCarbPct: 24, moisturePct: 79 }
  },
  {
    id: 'hp-dog-30',
    title: 'Hígado de Pavo con Puré de Zanahoria y Avena',
    frenchTitle: 'Foie de Dinde Gourmand, Purée de Carottes & Flocons d’Avoine Vigueur',
    species: 'dog',
    growthStage: 'puppy_kitten',
    category: 'high_performance',
    categoryLabel: '⚡ Vigor, Hierro & Complejo B',
    description: 'Hígado de pavo picado fino con puré de zanahoria y avena cocida. Excelente aporte de hierro y complejo B para perros deportistas o de trabajo.',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 138,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros jóvenes en jornadas de alta exigencia física o días de adiestramiento',
    clinicalBenefits: [
      'Cobalamina (B12) y folatos para multiplicación celular eficiente',
      'Vitamina A natural para integridad de barreras mucosas y piel',
      'Alta palatabilidad que levanta el ánimo y la concentración'
    ],
    ingredients: [
      { name: 'Hígado de pavo cocido', category: 'organ_meat', baseGramsFor10kgPetPerDay: 80, notes: '80 g cocido' },
      { name: 'Puré de zanahoria cocida', category: 'vegetable', baseGramsFor10kgPetPerDay: 60, notes: '60 g en puré' },
      { name: 'Avena en hojuelas cocida', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 40, notes: '40 g cocida' }
    ],
    instructions: [
      'Cocer el hígado de pavo durante 8 minutos y picar muy fino.',
      'Cocer las zanahorias y machacar en puré.',
      'Mezclar el hígado con la avena tibia cocida y el puré de zanahoria antes de servir.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 48, fatPct: 24, fiberCarbPct: 28, moisturePct: 76 }
  }
];
