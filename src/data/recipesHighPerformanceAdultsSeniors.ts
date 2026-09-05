import { Recipe } from '../types';

export const HIGH_PERF_ADULTS_SENIORS: Recipe[] = [
  // =========================================================================
  // ETAPA 4: ADULTOS DE ALTA ENERGÍA Y TRABAJO (1 A 7 AÑOS) - 10 RECETAS
  // =========================================================================
  {
    id: 'hp-dog-31',
    title: 'Súper Guiso Energético de Res con Arroz Integral',
    frenchTitle: 'Super Ragoût Énergétique de Bœuf au Riz Complet & Huile de Coco',
    species: 'dog',
    growthStage: 'adult',
    category: 'high_performance',
    categoryLabel: '⚡ Rendimiento Deportivo & MCT',
    description: 'Res magra picada, arroz integral, zanahoria, chía gelatinizada y aceite de coco tibio. Energía sostenida y grasas MCT para potencia inmediata.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 155,
    prepTimeMin: 15,
    cookTimeMin: 30,
    difficulty: 'Fácil',
    suitability: 'Perros adultos de trabajo, pastoreo, canicross, agility o perros nerviosos con alta quema calórica',
    clinicalBenefits: [
      'Grasas de cadena media (MCT) que van directo al hígado para generar ATP celular',
      'Arroz integral que repone glucógeno sin sobrecargar la insulina',
      'Chía que aporta protección colónica y retención hídrica intracelular'
    ],
    ingredients: [
      { name: 'Carne de res magra picada cocida', category: 'protein', baseGramsFor10kgPetPerDay: 200, notes: '200 g picada' },
      { name: 'Arroz integral cocido', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 60, notes: '60 g cocido' },
      { name: 'Zanahoria picada al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g picada' },
      { name: 'Semillas de chía hidratadas', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 10, notes: '1 cdta. en gel' },
      { name: 'Aceite de coco virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Unir los ingredientes cocidos en el cuenco.',
      'Incorporar la chía previamente gelatinizada en 3 cucharadas de agua tibia.',
      'Añadir el aceite de coco tibio y revolver bien antes de servir a temperatura ambiente.'
    ],
    storageInfo: 'Nevera 4 días, congelador 2 meses.',
    macronutrients: { proteinPct: 48, fatPct: 26, fiberCarbPct: 26, moisturePct: 73 }
  },
  {
    id: 'hp-dog-32',
    title: 'Banquete de Pavo, Quinoa y Aceite de Coco',
    frenchTitle: 'Banquet de Dinde Fine, Quinoa Royale & Huile de Coco Immunité',
    species: 'dog',
    growthStage: 'adult',
    category: 'high_performance',
    categoryLabel: '⚡ Inmunidad & Asimilación Máxima',
    description: 'Pavo picado, quinoa cocida templada, dados de calabacín y aceite de coco. Proteína altamente asimilable y ácidos grasos para sostener las defensas.',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 145,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros activos que necesitan digestiones ultraligeras para entrenar a diario',
    clinicalBenefits: [
      'Ácido láurico inmunomodulador que protege contra patógenos ambientales',
      'Pavo con alta relación proteína/grasa',
      'Quinoa rica en flavonoides antioxidantes quercetina y kaempferol'
    ],
    ingredients: [
      { name: 'Pavo magro picado cocido', category: 'protein', baseGramsFor10kgPetPerDay: 200, notes: '200 g cocido' },
      { name: 'Quinoa cocida', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 60, notes: '60 g cocida' },
      { name: 'Calabacín cocido picado', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g en dados' },
      { name: 'Aceite de coco virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Cocer la quinoa bien enjuagada y el pavo picado al vapor.',
      'Mezclar el pavo, la quinoa templada y los trozos de calabacín.',
      'Aderezar con la cucharadita de aceite de coco y mezclar.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 52, fatPct: 24, fiberCarbPct: 24, moisturePct: 75 }
  },
  {
    id: 'hp-dog-33',
    title: 'Salmón Salvaje con Puré de Camote y Brócoli',
    frenchTitle: 'Saumon Sauvage Rôti, Purée de Patate Douce & Brocoli Articulaire',
    species: 'dog',
    growthStage: 'adult',
    category: 'high_performance',
    categoryLabel: '⚡ Protección Articular & Esfuerzo Físico Intenso',
    description: 'Salmón desmenuzado sin espinas, puré de camote, espigas de brócoli al vapor y aceite de oliva. Omega-3 puro que protege cartílagos del impacto.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 150,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros que realizan saltos, giros bruscos, persecución o tracción continuada',
    clinicalBenefits: [
      'EPA que amortigua el desgaste en las almohadillas y membranas sinoviales',
      'Camote para reposición glucídica sostenida',
      'Vitamina C y sulforafano del brócoli para síntesis de colágeno'
    ],
    ingredients: [
      { name: 'Filete de salmón fresco cocido sin espinas', category: 'protein', baseGramsFor10kgPetPerDay: 180, notes: '180 g desmenuzado' },
      { name: 'Camote hervido machacado', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 70, notes: '70 g en puré' },
      { name: 'Brócoli al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g espigas' },
      { name: 'Aceite de oliva extra virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Cocer el salmón al vapor o plancha suave y revisar minuciosamente que no queden espinas.',
      'Desmenuzar el salmón y mezclar con el puré de camote y las espigas de brócoli.',
      'Añadir el aceite de oliva en crudo y servir templado.'
    ],
    storageInfo: 'Nevera 3 días.',
    macronutrients: { proteinPct: 46, fatPct: 30, fiberCarbPct: 24, moisturePct: 74 }
  },
  {
    id: 'hp-dog-34',
    title: 'Pollo Campero con Avena y Semillas de Girasol',
    frenchTitle: 'Poulet Fermier, Avoine Douce au Bouillon & Graines de Tournesol Vitamine E',
    species: 'dog',
    growthStage: 'adult',
    category: 'high_performance',
    categoryLabel: '⚡ Antioxidante Muscular & Vitamina E',
    description: 'Pollo desmenuzado, avena cocida en caldo sin sal, calabacín y harina de semillas de girasol molidas. Reduce el estrés oxidativo del músculo.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 142,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros que terminan las jornadas agitados, con fatiga muscular o agujetas',
    clinicalBenefits: [
      'Vitamina E alfa-tocoferol natural que protege los fosfolípidos del sarcolema',
      'Avena que estabiliza el cortisol post-esfuerzo',
      'Calabacín para rehidratación hidroelectrolítica'
    ],
    ingredients: [
      { name: 'Pechuga de pollo desmenuzada', category: 'protein', baseGramsFor10kgPetPerDay: 200, notes: '200 g cocida' },
      { name: 'Avena cocida en caldo sin sal', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '50 g cocida' },
      { name: 'Calabacín cocido al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g al vapor' },
      { name: 'Semillas de girasol molidas finas', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: '1/2 cdta. molida' }
    ],
    instructions: [
      'Cocer la avena en caldo casero sin sal hasta formar una papilla tierna.',
      'Mezclar el pollo con la avena tibia y los dados de calabacín.',
      'Espolvorear la harina de semillas de girasol recién molidas por encima y revolver.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 52, fatPct: 22, fiberCarbPct: 26, moisturePct: 75 }
  },
  {
    id: 'hp-dog-35',
    title: 'Cazuela de Cordero con Papa Hervida y Zanahoria',
    frenchTitle: 'Casserole de Haute Montagne Agneau Maigre, Pommes de Terre & Carottes',
    species: 'dog',
    growthStage: 'adult',
    category: 'high_performance',
    categoryLabel: '⚡ Alta Densidad Calórica & Resistencia',
    description: 'Cordero magro templado, papa machacada sin piel, zanahoria y aceite de lino o coco. Excelente densidad calórica y aminoácidos para deportistas.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 162,
    prepTimeMin: 15,
    cookTimeMin: 25,
    difficulty: 'Fácil',
    suitability: 'Galgos, perros nórdicos, canicross en clima fresco o perros que pierden peso con rapidez',
    clinicalBenefits: [
      'Grasas nobles de fácil oxidación para esfuerzos de larga duración',
      'Carnitina para transporte de ácidos grasos a la mitocondria',
      'Papa como almidón noble de asimilación rápida'
    ],
    ingredients: [
      { name: 'Carne de cordero magra cocida', category: 'protein', baseGramsFor10kgPetPerDay: 180, notes: '180 g cocida' },
      { name: 'Papa hervida sin piel machacada', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 60, notes: '60 g machacada' },
      { name: 'Zanahoria picada al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g picada' },
      { name: 'Aceite de coco virgen o linaza', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Hervir la papa sin piel y la zanahoria hasta ablandar.',
      'Mezclar la carne de cordero templada con la papa machacada y la zanahoria.',
      'Aderezar con el aceite de coco o lino y mezclar hasta obtener una textura jugosa.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 46, fatPct: 30, fiberCarbPct: 24, moisturePct: 72 }
  },
  {
    id: 'hp-dog-36',
    title: 'Picadillo de Res y Asadura con Calabaza',
    frenchTitle: 'Hachis Régal de Bœuf & Foie Multivitaminé au Velouté de Potiron',
    species: 'dog',
    growthStage: 'adult',
    category: 'high_performance',
    categoryLabel: '⚡ Multivitamínico Natural & Cobalamina',
    description: 'Res picada, hígado de res picado fino, puré de calabaza y aceite de salmón. Multivitamínico natural concentrado rico en hierro, cobalamina y vitamina A.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 148,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros que necesitan un estímulo vital, recuperación metabólica o apetito decaído',
    clinicalBenefits: [
      'Complejo B completo que cataliza el metabolismo de carbohidratos y proteínas',
      'Hierro hemo para transporte de oxígeno en sangre',
      'Calabaza que aporta fibra digestiva y previene heces oscuras'
    ],
    ingredients: [
      { name: 'Carne de res magra cocida', category: 'protein', baseGramsFor10kgPetPerDay: 150, notes: '150 g picada' },
      { name: 'Hígado de res cocido picado fino', category: 'organ_meat', baseGramsFor10kgPetPerDay: 40, notes: '40 g picado fino' },
      { name: 'Puré de calabaza cocida', category: 'vegetable', baseGramsFor10kgPetPerDay: 60, notes: '60 g en puré' },
      { name: 'Aceite de salmón salvaje', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Cocer la res y el hígado de res; picar finamente.',
      'Combinar perfectamente la carne picada, el hígado y el puré de calabaza.',
      'Añadir el aceite de salmón crudo templado y revolver antes de servir.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 54, fatPct: 24, fiberCarbPct: 22, moisturePct: 75 }
  },
  {
    id: 'hp-dog-37',
    title: 'Estofado de Conejo con Arroz Integral y Guisantes',
    frenchTitle: 'Ragoût Délicat de Lapin au Riz Complet & Petits Pois Estomacs Réactifs',
    species: 'dog',
    growthStage: 'adult',
    category: 'high_performance',
    categoryLabel: '⚡ Ligero, Sano & Estómagos Reactivos',
    description: 'Conejo deshuesado, arroz integral muy cocido, guisantes machacados y aceite de oliva. Proteína hipoalergénica con digestibilidad superior.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 135,
    prepTimeMin: 15,
    cookTimeMin: 35,
    difficulty: 'Fácil',
    suitability: 'Perros muy activos con digestiones delicadas, ruidos intestinales o heces variables',
    clinicalBenefits: [
      'Conejo: mínima carga antigénica para el epitelio intestinal',
      'Guisantes machacados para absorción sin gases',
      'Arroz integral que aporta energía lineal sin bajones'
    ],
    ingredients: [
      { name: 'Carne de conejo deshuesada cocida', category: 'protein', baseGramsFor10kgPetPerDay: 180, notes: '180 g sin huesos' },
      { name: 'Arroz integral muy cocido', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 60, notes: '60 g cocido suave' },
      { name: 'Guisantes cocidos machacados', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g machacados' },
      { name: 'Aceite de oliva extra virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Cocer el conejo y retirar meticulosamente cualquier hueso.',
      'Cocer el arroz integral hasta que quede bien tierno y aplastar los guisantes.',
      'Unir la carne con el arroz, los guisantes y la cucharadita de aceite de oliva.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 50, fatPct: 20, fiberCarbPct: 30, moisturePct: 76 }
  },
  {
    id: 'hp-dog-38',
    title: 'Festín de Pescado Azul y Puré de Espinacas',
    frenchTitle: 'Festin Océanique de Sardines Fraîches, Patate Douce & Purée d’Épinards',
    species: 'dog',
    growthStage: 'adult',
    category: 'high_performance',
    categoryLabel: '⚡ Soporte Neuromuscular & Calcio Natural',
    description: 'Sardinas frescas al vapor sin espinas ni cabeza con puré de camote, espinacas y aceite de coco. Calcio y fósforo naturales con omega-3.',
    imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 152,
    prepTimeMin: 15,
    cookTimeMin: 15,
    difficulty: 'Fácil',
    suitability: 'Perros deportistas, de rastro o caza que requieren reflejos agudos y contracción sin calambres',
    clinicalBenefits: [
      'Sardinas: ricos en ácidos EPA/DHA de cadena muy larga y fosfolípidos neuronales',
      'Calcio y magnesio en ratio natural para transmisión de impulsos axonales',
      'Camote para glucógeno celular'
    ],
    ingredients: [
      { name: 'Sardinas frescas al vapor (sin espinas ni cabeza)', category: 'protein', baseGramsFor10kgPetPerDay: 160, notes: '160 g limpias' },
      { name: 'Camote hervido machacado', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 60, notes: '60 g en puré' },
      { name: 'Espinacas al vapor picadas', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g al vapor' },
      { name: 'Aceite de coco virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Cocinar las sardinas al vapor y retirar espina central y cabeza con sumo cuidado.',
      'Desmenuzar las sardinas e integrarlas con el camote machacado y las espinacas picadas.',
      'Mezclar con la cucharadita de aceite de coco y servir templado.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 48, fatPct: 30, fiberCarbPct: 22, moisturePct: 74 }
  },
  {
    id: 'hp-dog-39',
    title: 'Pavo Desmenuzado con Arroz e Hilo de Kéfir',
    frenchTitle: 'Dinde Rôtie au Riz Tendre, Courgettes & Coulis de Kéfir Probiotique',
    species: 'dog',
    growthStage: 'adult',
    category: 'high_performance',
    categoryLabel: '⚡ Barrera Intestinal & Anti-Disbiosis',
    description: 'Pavo cocido, arroz blanco, calabacín y salsa fría de kéfir natural sin azúcar. Mantiene la barrera intestinal sana y previene disbiosis por sobreesfuerzo.',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 135,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros que somatizan el estrés en el intestino (diarreas de estrés en competiciones o mudanzas)',
    clinicalBenefits: [
      'Probióticos vivos que impiden la translocación bacteriana en esfuerzos prolongados',
      'Pavo con alta digestibilidad que no retiene líquido intestinal',
      'Arroz blanco aglutinante suave'
    ],
    ingredients: [
      { name: 'Pavo cocido desmenuzado', category: 'protein', baseGramsFor10kgPetPerDay: 180, notes: '180 g desmenuzado' },
      { name: 'Arroz blanco cocido', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '50 g cocido suave' },
      { name: 'Calabacín al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g al vapor' },
      { name: 'Kéfir natural sin azúcar (añadido en frío)', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 30, notes: '2 cdas. vivas' }
    ],
    instructions: [
      'Cocer el pavo y el arroz blanco; mezclar con el calabacín al vapor.',
      'Dejar entibiar a temperatura ambiente en el cuenco.',
      'Coronar el plato con el kéfir fresco como salsa digestiva justo en el momento de comer.'
    ],
    storageInfo: 'Nevera 3 días (añadir el kéfir siempre al servir).',
    macronutrients: { proteinPct: 52, fatPct: 20, fiberCarbPct: 28, moisturePct: 78 }
  },
  {
    id: 'hp-dog-40',
    title: 'Albóndigas de Ternera y Linaza con Espárragos',
    frenchTitle: 'Boulettes Gourmandes de Bœuf, Lin Doré & Pointes d’Asperges Diurétique',
    species: 'dog',
    growthStage: 'adult',
    category: 'high_performance',
    categoryLabel: '⚡ Salud Urinaria & Drenaje Renal',
    description: 'Ternera picada, linaza molida, huevo y puntas de espárragos al vapor en albóndigas horneadas. Fibra insoluble y antioxidantes que promueven vías urinarias sanas.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 155,
    prepTimeMin: 20,
    cookTimeMin: 15,
    difficulty: 'Fácil',
    suitability: 'Perros atléticos que necesitan drenar metabolitos de desecho tras entrenamientos intensos',
    clinicalBenefits: [
      'Asparagina de los espárragos con efecto diurético suave natural',
      'Linaza para regular tránsito colónico y aportar lignanos antioxidantes',
      'Formato ideal para racionar en salidas de campo o adiestramiento'
    ],
    ingredients: [
      { name: 'Carne de ternera picada magra', category: 'protein', baseGramsFor10kgPetPerDay: 200, notes: '200 g picada' },
      { name: 'Semillas de linaza molidas', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta. molida' },
      { name: 'Huevo entero batido', category: 'protein', baseGramsFor10kgPetPerDay: 25, notes: '1 huevo' },
      { name: 'Puntas de espárragos al vapor picadas', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g picadas finas' }
    ],
    instructions: [
      'Cocer al vapor las puntas de espárragos y picar muy fino.',
      'Mezclar la ternera picada con la linaza molida, el huevo batido y los espárragos picados.',
      'Formar albóndigas y hornear a 180°C durante 15 minutos. Servir templadas o frías.'
    ],
    storageInfo: 'Nevera 4 días, congelador 2 meses.',
    macronutrients: { proteinPct: 54, fatPct: 24, fiberCarbPct: 22, moisturePct: 73 }
  },

  // =========================================================================
  // ETAPA 5: SENIORS ACTIVOS (MAYORES DE 7 AÑOS - MÉTODO DEL LICUADO MOUSSE) - 10 RECETAS
  // =========================================================================
  {
    id: 'hp-dog-41',
    title: 'Licuado de Pavo y Calabaza (Método Mousse Luna)',
    frenchTitle: 'Mousse Veloutée Luna de Dinde, Potiron & Bouillon d’Os Senior',
    species: 'dog',
    growthStage: 'senior',
    category: 'high_performance',
    categoryLabel: '⚡ Mousse Senior & Receta Kong Congelado',
    description: 'Pavo cocido, calabaza al vapor y caldo de huesos licuados en mousse fino con aceite de salmón. Evita sarcopenia e hidrata profundamente. Perfecta para rellenar juguetes Kong congelados.',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 115,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros senior (+7 años) con desgaste dental, apetito caprichoso o hiperactividad senil que se calman con lamido prolongado',
    clinicalBenefits: [
      'Textura paté fino que elimina el rechazo de vegetales por perros selectivos',
      'Utilizable como relleno terapéutico para juguetes Kong congelados (libera endorfinas y activa el parasimpático)',
      'Aporte hídrico masivo con colágeno para cartílagos artrósicos'
    ],
    ingredients: [
      { name: 'Pechuga de pavo cocida', category: 'protein', baseGramsFor10kgPetPerDay: 150, notes: '150 g cocida' },
      { name: 'Calabaza cocida al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 60, notes: '60 g en puré' },
      { name: 'Caldo de huesos colado sin sal', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 180, notes: '1 taza tibia' },
      { name: 'Aceite de salmón salvaje', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: '1/2 cdta.' }
    ],
    instructions: [
      'Cocer el pavo y la calabaza al vapor hasta quedar muy tiernos.',
      'Colocar en vaso de licuadora con el caldo de huesos tibio y licuar a máxima potencia durante 2 minutos hasta lograr un mousse sedoso.',
      'Verter el aceite de salmón en templado. Servir en cuenco o rellenar juguetes Kong y congelar 4 horas para terapia de lamido relajante.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 50, fatPct: 22, fiberCarbPct: 28, moisturePct: 82 }
  },
  {
    id: 'hp-dog-42',
    title: 'Crema Antioxidante de Pollo y Camote',
    frenchTitle: 'Crème Protectrice Cérébrale Poulet, Patate Douce & Carottes Bêta-carotène',
    species: 'dog',
    growthStage: 'senior',
    category: 'high_performance',
    categoryLabel: '⚡ Protección Cerebral & Antienvejecimiento',
    description: 'Pollo cocido, camote hervido, zanahoria y aceite de oliva licuados en crema sedosa. Betacarotenos y antioxidantes para combatir el envejecimiento cerebral.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 122,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros mayores con síndrome de disfunción cognitiva, desorientación o menor velocidad de respuesta',
    clinicalBenefits: [
      'Betacarotenos y vitamina E que neutralizan radicales libres en neuronas',
      'Camote de liberación energética suave para el cerebro senil',
      'Deglución sin esfuerzo masticatorio'
    ],
    ingredients: [
      { name: 'Pechuga de pollo cocida', category: 'protein', baseGramsFor10kgPetPerDay: 150, notes: '150 g cocida' },
      { name: 'Camote hervido', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '50 g hervido' },
      { name: 'Zanahoria cocida', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g cocida' },
      { name: 'Agua de cocción tibia o caldo', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 100, notes: '1/2 taza' },
      { name: 'Aceite de oliva extra virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: '1/2 cdta.' }
    ],
    instructions: [
      'Procesar en licuadora el pollo, el camote, la zanahoria y el agua tibia hasta obtener un puré homogéneo y suave.',
      'Mezclar con el aceite de oliva extra virgen.',
      'Servir templado para maximizar el aroma.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 48, fatPct: 22, fiberCarbPct: 30, moisturePct: 80 }
  },
  {
    id: 'hp-dog-43',
    title: 'Sopa Cremosa de Ternera Molida con Puré Verde',
    frenchTitle: 'Soupe d’Oxigénation Cellulaire Bœuf Haché & Purée Verte de Courgettes',
    species: 'dog',
    growthStage: 'senior',
    category: 'high_performance',
    categoryLabel: '⚡ Oxigenación Celular & Hierro Asimilable',
    description: 'Espinacas, calabacín y caldo de res licuados en caldo verde emulsionado sobre ternera molida cocida. Clorofila líquida y hierro para vitalidad en perros mayores.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 130,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros ancianos con cansancio fácil, anemia senil o desánimo físico',
    clinicalBenefits: [
      'Hierro hemo para síntesis de glóbulos rojos',
      'Clorofila de espinaca que mejora la oxigenación celular',
      'La textura en sopa verde garantiza consumo de micronutrientes sin rechazo'
    ],
    ingredients: [
      { name: 'Carne de ternera molida cocida', category: 'protein', baseGramsFor10kgPetPerDay: 130, notes: '130 g cocida' },
      { name: 'Espinacas al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g al vapor' },
      { name: 'Calabacín cocido', category: 'vegetable', baseGramsFor10kgPetPerDay: 30, notes: '30 g cocido' },
      { name: 'Caldo de res casero sin sal', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 180, notes: '1 taza colada' }
    ],
    instructions: [
      'Licuar las espinacas, el calabacín y el caldo de res hasta formar un líquido verde homogéneo.',
      'Verter este licuado caliente sobre la ternera molida ya cocida en el cuenco.',
      'Mezclar con cuchara y servir a temperatura tibia.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 52, fatPct: 24, fiberCarbPct: 24, moisturePct: 81 }
  },
  {
    id: 'hp-dog-44',
    title: 'Puré de Salmón y Calabacín con Cúrcuma',
    frenchTitle: 'Purée Anti-inflammatoire Saumon Vapeur, Courgettes & Curcuma Actif',
    species: 'dog',
    growthStage: 'senior',
    category: 'high_performance',
    categoryLabel: '⚡ Antiinflamatorio Articular & Cúrcuma',
    description: 'Salmón al vapor, calabacín, aceite de coco y pizca minúscula de cúrcuma en polvo licuados en puré suave. La cúrcuma activada reduce el dolor articular senil.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 135,
    prepTimeMin: 15,
    cookTimeMin: 15,
    difficulty: 'Fácil',
    suitability: 'Perros ancianos con artrosis marcada, rigidez matutina o dificultad para incorporarse',
    clinicalBenefits: [
      'Curcumina liposoluble potenciada por los ácidos grasos del aceite de coco',
      'Ácidos EPA/DHA de salmón que reducen citoquinas proinflamatorias',
      'Textura puré de fácil deglución'
    ],
    ingredients: [
      { name: 'Filete de salmón al vapor sin espinas', category: 'protein', baseGramsFor10kgPetPerDay: 150, notes: '150 g limpio' },
      { name: 'Calabacín al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 50, notes: '50 g al vapor' },
      { name: 'Aceite de coco virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: '1/2 cdta. tibia' },
      { name: 'Cúrcuma en polvo', category: 'supplement_calcium', baseGramsFor10kgPetPerDay: 0.5, notes: 'Pizca minúscula' }
    ],
    instructions: [
      'Cocer el salmón al vapor comprobando que no quede ninguna espina.',
      'Licuar el calabacín con el salmón y el aceite de coco tibio hasta formar un puré suave.',
      'Integrar la pizca minúscula de cúrcuma en polvo y remover bien antes de servir.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 46, fatPct: 30, fiberCarbPct: 24, moisturePct: 78 }
  },
  {
    id: 'hp-dog-45',
    title: 'Licuado de Hígado de Pollo y Calabaza',
    frenchTitle: 'Mousse Détox Hépatique Foie de Volaille, Dinde & Potiron Délicat',
    species: 'dog',
    growthStage: 'senior',
    category: 'high_performance',
    categoryLabel: '⚡ Detox Hepático & Nutrición Celular',
    description: 'Hígado de pollo, carne de pavo y calabaza licuados con caldo de ave y aceite de salmón. Estimula el metabolismo y apoya la detoxificación hepática natural.',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 125,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros de edad avanzada con función hepática sobrecargada o medicaciones prolongadas',
    clinicalBenefits: [
      'Glutatión y aminoácidos azufrados para vías de conjugación hepática fase II',
      'Vitamina A biodisponible para regeneración de hepatocitos',
      'Aporte de fluidos calientes que estimulan el peristaltismo suave'
    ],
    ingredients: [
      { name: 'Hígado de pollo cocido', category: 'organ_meat', baseGramsFor10kgPetPerDay: 60, notes: '60 g cocido' },
      { name: 'Pechuga de pavo cocida', category: 'protein', baseGramsFor10kgPetPerDay: 40, notes: '40 g cocida' },
      { name: 'Calabaza cocida', category: 'vegetable', baseGramsFor10kgPetPerDay: 50, notes: '50 g cocida' },
      { name: 'Caldo de pollo casero colado', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 120, notes: '1/2 taza' },
      { name: 'Aceite de salmón salvaje', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: '1/2 cdta.' }
    ],
    instructions: [
      'Cocer el hígado de pollo y el pavo durante 10-15 minutos en agua sin sal.',
      'Licuar el hígado, la carne de pavo y la calabaza con el caldo hasta obtener una crema espesa.',
      'Adicionar el aceite de salmón y servir tibia.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 54, fatPct: 22, fiberCarbPct: 24, moisturePct: 80 }
  },
  {
    id: 'hp-dog-46',
    title: 'Crema de Conejo con Puré de Zanahoria y Aceite de Coco',
    frenchTitle: 'Crème de Lapin Tendre, Carottes Douces & Huile de Coco Énergie Cérébrale',
    species: 'dog',
    growthStage: 'senior',
    category: 'high_performance',
    categoryLabel: '⚡ Triglicéridos MCT & Energía Cerebral Senior',
    description: 'Conejo deshuesado cocido, zanahoria y caldo con aceite de coco emulsionado en crema sedosa. Triglicéridos de cadena media (MCT) para energía cerebral limpia.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 132,
    prepTimeMin: 15,
    cookTimeMin: 35,
    difficulty: 'Fácil',
    suitability: 'Perros ancianos que necesitan combustibles alternativos a la glucosa para el cerebro',
    clinicalBenefits: [
      'MCT que generan cuerpos cetónicos asimilables por neuronas envejecidas',
      'Conejo: proteína blanca de fácil fraccionamiento enzimático',
      'Zanahoria con carotenos protectores del cristalino'
    ],
    ingredients: [
      { name: 'Carne de conejo deshuesada cocida', category: 'protein', baseGramsFor10kgPetPerDay: 140, notes: '140 g sin huesos' },
      { name: 'Zanahoria cocida suave', category: 'vegetable', baseGramsFor10kgPetPerDay: 50, notes: '50 g cocida' },
      { name: 'Caldo de ave o agua tibia', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 120, notes: '1/2 taza' },
      { name: 'Aceite de coco virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Cocer el conejo y comprobar meticulosamente que no quede ningún fragmento óseo.',
      'Cocer la zanahoria hasta que esté blanda.',
      'Licuar el conejo, la zanahoria y el caldo con el aceite de coco tibio hasta homogenizar en crema sedosa.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 50, fatPct: 24, fiberCarbPct: 26, moisturePct: 79 }
  },
  {
    id: 'hp-dog-47',
    title: 'Sopa de Pescado Blanco con Puré de Camote y Chía',
    frenchTitle: 'Velouté Digestif Poisson Blanc, Patate Douce & Graines de Chia',
    species: 'dog',
    growthStage: 'senior',
    category: 'high_performance',
    categoryLabel: '⚡ Digestión Inmediata & Tránsito Regular',
    description: 'Merluza al vapor desespinada, camote hervido y caldo licuados, espolvoreados con chía molida fina. Asimilación casi inmediata y fibra soluble.',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 115,
    prepTimeMin: 15,
    cookTimeMin: 15,
    difficulty: 'Fácil',
    suitability: 'Perros ancianos con estómago perezoso, estreñimiento o apetito disminuido',
    clinicalBenefits: [
      'Mucílagos de chía que rehidratan el bolo fecal evitando constipación',
      'Pescado blanco sin purinas excesivas para riñones seniles',
      'Sabor suave y reconfortante'
    ],
    ingredients: [
      { name: 'Filete de merluza al vapor (sin espinas)', category: 'protein', baseGramsFor10kgPetPerDay: 130, notes: '130 g limpio' },
      { name: 'Camote hervido', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 50, notes: '50 g en puré' },
      { name: 'Semillas de chía molidas finas', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: '1/2 cdta. molida' },
      { name: 'Caldo de pescado casero sin sal', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 150, notes: 'Caldo tibio' }
    ],
    instructions: [
      'Licuar el pescado al vapor desespinado y el camote con el caldo de pescado casero tibio.',
      'Espolvorear e integrar la chía molida fina removiendo durante 1 minuto.',
      'Servir a temperatura tibia.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 48, fatPct: 20, fiberCarbPct: 32, moisturePct: 81 }
  },
  {
    id: 'hp-dog-48',
    title: 'Picadillo de Res Licuado con Brócoli y Aceite de Oliva',
    frenchTitle: 'Hachis de Bœuf Émulsionné au Brocoli Vert & Huile d’Olive Sulforaphane',
    species: 'dog',
    growthStage: 'senior',
    category: 'high_performance',
    categoryLabel: '⚡ Sulforafano & Sin Rechazo Selectivo',
    description: 'Brócoli al vapor licuado con agua y aceite de oliva virgen en emulsión verde mezclada vigorosamente con carne molida de res. Cero rechazo selectivo.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 138,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros senior que apartan las verduras con la nariz dejando la carne',
    clinicalBenefits: [
      'La emulsión verde impregna cada fibra cárnica garantizando la ingesta de fitonutrientes',
      'Sulforafano antioxidante celular',
      'Ácido oleico del aceite de oliva para salud cardiovascular y dérmica'
    ],
    ingredients: [
      { name: 'Carne de res molida magra cocida', category: 'protein', baseGramsFor10kgPetPerDay: 140, notes: '140 g picada' },
      { name: 'Flores de brócoli al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g al vapor' },
      { name: 'Agua de cocción tibia o caldo', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 100, notes: '1/2 taza' },
      { name: 'Aceite de oliva extra virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 5, notes: '1 cdta.' }
    ],
    instructions: [
      'Cocinar al vapor el brócoli y licuar con el agua tibia y el aceite de oliva hasta crear una emulsión verde cremosa.',
      'Mezclar vigorosamente esta emulsión verde sobre la carne molida de res cocida.',
      'Servir templado logrando una palatabilidad homogénea.'
    ],
    storageInfo: 'Nevera 3 días, congelador 2 meses.',
    macronutrients: { proteinPct: 52, fatPct: 26, fiberCarbPct: 22, moisturePct: 78 }
  },
  {
    id: 'hp-dog-49',
    title: 'Crema de Pavo y Huevo de Codorniz con Calabacín',
    frenchTitle: 'Crème Délicate Dinde, Jaune de Caille & Courgettes Soutien Rénal',
    species: 'dog',
    growthStage: 'senior',
    category: 'high_performance',
    categoryLabel: '⚡ Soporte Renal Senior & Minerales Amigables',
    description: 'Pavo cocido, yema de huevo de codorniz, calabacín al vapor y caldo de huesos tibio en crema suave. Proteínas nobles muy amigables para los riñones.',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 125,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros ancianos con valores de urea o creatinina en rango superior limítrofe',
    clinicalBenefits: [
      'Ratio calcio/fósforo estrictamente balanceado',
      'Yema de codorniz rica en fosfolípidos nobles y baja en albúminas irritantes',
      'Hidratación orgánica extrema que previene cálculos e hiperconcentración urinaria'
    ],
    ingredients: [
      { name: 'Pechuga de pavo cocida', category: 'protein', baseGramsFor10kgPetPerDay: 120, notes: '120 g cocida' },
      { name: 'Yema de huevo de codorniz cocida', category: 'protein', baseGramsFor10kgPetPerDay: 15, notes: '1 yema cocida' },
      { name: 'Calabacín cocido al vapor', category: 'vegetable', baseGramsFor10kgPetPerDay: 50, notes: '50 g al vapor' },
      { name: 'Caldo de huesos suave colado', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 100, notes: '1/3 taza' }
    ],
    instructions: [
      'Licuar el pavo, el calabacín y el caldo de huesos suave.',
      'Añadir la yema de huevo de codorniz cocida y procesar un instante hasta homogenizar en crema sedosa.',
      'Servir tibia en tomas fraccionadas si el perro prefiere comer poco a poco.'
    ],
    storageInfo: 'Nevera 48 horas.',
    macronutrients: { proteinPct: 50, fatPct: 24, fiberCarbPct: 26, moisturePct: 80 }
  },
  {
    id: 'hp-dog-50',
    title: 'Crema de Pollo, Manzana Cocida y Avena',
    frenchTitle: 'Crème Réconfortante Poulet, Pomme Cuite & Avoine Douce Convalescent',
    species: 'dog',
    growthStage: 'senior',
    category: 'high_performance',
    categoryLabel: '⚡ Reconfortante, Suave & Inapetencia',
    description: 'Pollo, manzana roja cocida sin pepitas, avena muy cocida y aceite de coco licuados con caldo tibio. Muy reconfortante y suave para la mucosa gástrica senil.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    kcalPer100g: 126,
    prepTimeMin: 15,
    cookTimeMin: 20,
    difficulty: 'Fácil',
    suitability: 'Perros ancianos inapetentes, convalecientes o en días fríos',
    clinicalBenefits: [
      'Aroma dulce natural de la manzana cocida que despierta el olfato senil',
      'Avena que forma un escudo protector coloidal sobre la mucosa del estómago',
      'Digestión rápida sin sensación de pesadez ni letargo'
    ],
    ingredients: [
      { name: 'Pechuga de pollo cocida', category: 'protein', baseGramsFor10kgPetPerDay: 130, notes: '130 g cocida' },
      { name: 'Manzana roja cocida (sin semillas)', category: 'vegetable', baseGramsFor10kgPetPerDay: 40, notes: '40 g cocida' },
      { name: 'Avena muy cocida en papilla', category: 'fiber_carb', baseGramsFor10kgPetPerDay: 30, notes: '30 g cocida' },
      { name: 'Caldo de ave casero tibio', category: 'broth_liquid', baseGramsFor10kgPetPerDay: 120, notes: '1/2 taza' },
      { name: 'Aceite de coco virgen', category: 'healthy_fat', baseGramsFor10kgPetPerDay: 3, notes: '1/2 cdta.' }
    ],
    instructions: [
      'Licuar todos los ingredientes juntos con el caldo tibio y el aceite de coco hasta lograr una crema suave y fragante.',
      'Verificar temperatura templada agradable al tacto antes de ofrecer.',
      'Ideal también para lamer de un plato térmico o alfombrilla antiansiedad.'
    ],
    storageInfo: 'Nevera 3 días.',
    macronutrients: { proteinPct: 48, fatPct: 22, fiberCarbPct: 30, moisturePct: 80 }
  }
];
