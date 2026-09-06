import { Pet, DayDietPlan, DailyMealItem, DailySnackItem, DailyDessertItem } from '../types';
import { calculateMER } from './nutrition';
import { extractPetAllergens, COMMON_FOOD_ALLERGENS } from '../data/allergensData';

export const HIGH_PERFORMANCE_BREEDS = [
  'border collie',
  'malinois',
  'pastor belga',
  'pastor aleman',
  'pastor alemán',
  'german shepherd',
  'husky',
  'malamute',
  'jack russell',
  'fox terrier',
  'braco',
  'pointer',
  'galgo',
  'greyhound',
  'whippet',
  'doberman',
  'rottweiler',
  'australian shepherd',
  'pastor australiano',
  'perro de agua',
  'setter',
  'beagle',
  'bodeguero'
];

export function isHighPerformancePet(pet: Pet): boolean {
  if (pet.species !== 'dog') return false;
  if (pet.activityLevel === 'working' || pet.activityLevel === 'high_performance') return true;
  if (pet.clinicalCondition === 'high_performance_hyperactivity') return true;
  const breedLower = (pet.breed || '').toLowerCase();
  return HIGH_PERFORMANCE_BREEDS.some(b => breedLower.includes(b));
}

export const HIGH_PERFORMANCE_COGNITIVE_HABITS = [
  {
    dayIndex: 0,
    titleEs: 'Juego de Cajas Olfativo Autónomo',
    titleEn: 'Autonomous Scent Box Game',
    protocolEs: 'Colocar 5-6 cajas de cartón en la sala con premios de alto valor (hígado o pavo) ocultos en 2 de ellas. Permitir 15-20 minutos de búsqueda independiente sin dar órdenes verbales.',
    protocolEn: 'Place 5-6 cardboard boxes with hidden high-value treats in 2 of them. Allow 15-20 minutes of autonomous search without verbal commands.',
    recommendedTime: '11:30',
    icon: '📦',
    benefitsEs: 'Estimula el sistema dopaminérgico de búsqueda tranquila, reduciendo el cortisol hasta un 40% y canalizando la hiperactividad motora.',
  },
  {
    dayIndex: 1,
    titleEs: 'Kong Terapéutico Congelado (Mousse Luna)',
    titleEn: 'Frozen Therapeutic Kong (Moon Mousse)',
    protocolEs: 'Rellenar un juguete Kong con Mousse de Pavo y Calabaza (Receta 41) y congelar durante 4 horas. Ofrecer tras el ejercicio en su cama o transportín abierto.',
    protocolEn: 'Fill a Kong toy with Turkey & Pumpkin Mousse (Recipe 41) and freeze for 4 hours. Offer after exercise in their bed or open crate.',
    recommendedTime: '16:30',
    icon: '🧊',
    benefitsEs: 'El lamido rítmico continuo estimula el nervio vago y libera endorfinas que conmutan el sistema nervioso simpático hacia el descanso reparador.',
  },
  {
    dayIndex: 2,
    titleEs: 'Paseo de Descompresión con Correa Larga (5m)',
    titleEn: 'Decompression Walk with Long Line (5m)',
    protocolEs: 'Salida a campo abierto o parque tranquilo con arnés en Y y correa de rastreo de 5 metros. Dejar que el perro guíe el ritmo y olfatee cada brizna de hierba sin interrupciones.',
    protocolEn: 'Walk in open nature with a Y-harness and 5m long line. Let the dog lead pace and sniff freely without interruptions.',
    recommendedTime: '18:30',
    icon: '🌿',
    benefitsEs: 'Descompresión sensorial profunda. Olfatear a su ritmo equilibra la frecuencia cardíaca y evita la reactividad por frustración.',
  },
  {
    dayIndex: 3,
    titleEs: 'Alfombra de Olfato (Snuffle Mat) de Precisión',
    titleEn: 'Precision Snuffle Mat Session',
    protocolEs: 'Esparcir dados microscópicos de pavo deshidratado o galletas caseras entre las tiras de la alfombra. Exigir discriminación olfativa fina antes de comer.',
    protocolEn: 'Hide tiny dehydrated turkey bites within snuffle mat fleece strips. Requires fine scent discrimination before eating.',
    recommendedTime: '12:00',
    icon: '👃',
    benefitsEs: 'Cansa al cerebro 4 veces más que un sprint físico, desarrollando paciencia y tolerancia a la frustración.',
  },
  {
    dayIndex: 4,
    titleEs: 'Entrenamiento de Autocontrol & "Espera Dinámica"',
    titleEn: 'Impulse Control & Dynamic Wait Training',
    protocolEs: 'Sesión de 10 minutos con el plato de comida en mano. Marcar la calma y contacto visual antes de liberar el cuenco. Premiar la quietud con calma.',
    protocolEn: '10-minute session with meal bowl. Mark eye contact and calmness before releasing the bowl. Reward stillness quietly.',
    recommendedTime: '19:00',
    icon: '🛑',
    benefitsEs: 'Refuerza la corteza prefrontal canina, disminuyendo la impulsividad y la anticipación ansiosa previa a las comidas.',
  },
  {
    dayIndex: 5,
    titleEs: 'Circuito de Propiocepción & Coordinación Lenta',
    titleEn: 'Proprioception & Slow Coordination Circuit',
    protocolEs: 'Guiar al perro muy lentamente sobre troncos bajos, cojines o superficies inestables con luring suave. Cada pata debe apoyarse de forma consciente.',
    protocolEn: 'Guide the dog very slowly over low logs or balance cushions. Each paw must step with conscious awareness.',
    recommendedTime: '10:30',
    icon: '🪵',
    benefitsEs: 'Conexión neuromuscular propioceptiva. Fortalece la musculatura estabilizadora profunda y previene lesiones deportivas en ligamentos.',
  },
  {
    dayIndex: 6,
    titleEs: 'Regla de Oro Anti-Torsión & Masaje TTouch Somático',
    titleEn: 'Anti-Torsion Golden Rule & Somatic TTouch Massage',
    protocolEs: 'Reposo estricto de 60 minutos antes y después de comidas principales. Realizar círculos lentos de 1 vuelta y cuarto con las yemas de los dedos sobre sienes, base del cuello y orejas.',
    protocolEn: 'Strict 60-minute rest before and after main meals. Perform gentle 1.25 circular strokes with fingertips on temples and neck base.',
    recommendedTime: '20:30',
    icon: '💆',
    benefitsEs: 'Prevención clínica vital del síndrome de dilatación/torsión de estómago y descenso integral del tono muscular antes del sueño nocturno.',
  },
];

/**
 * Returns the Monday-based real calendar dates for the current week.
 * Output: array of 7 dates { dateStr: "YYYY-MM-DD", dayIndex: 0..6, isToday: boolean, formattedLabel: string }
 */
export function getCurrentWeekDates(refDate: Date = new Date()): {
  dateStr: string;
  dayIndex: number;
  isToday: boolean;
  dayNumber: number;
  monthName: string;
  dayShortNameEs: string;
  dayShortNameEn: string;
  dayFullNameEs: string;
  dayFullNameEn: string;
  dayNameEs: string;
  dayNameEn: string;
  dateFormatted: string;
}[] {
  const current = new Date(refDate);
  const currentDayOfWeek = current.getDay(); // 0 is Sunday, 1 is Monday
  
  // Calculate distance to Monday
  const distanceToMonday = (currentDayOfWeek === 0 ? -6 : 1) - currentDayOfWeek;
  const monday = new Date(current);
  monday.setDate(current.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const todayStr = refDate.toISOString().split('T')[0];

  const daysEs = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const daysEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const daysShortEs = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const daysShortEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const monthNamesEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const result = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    result.push({
      dateStr,
      dayIndex: i,
      isToday: dateStr === todayStr,
      dayNumber: d.getDate(),
      monthName: monthNamesEs[d.getMonth()],
      dayShortNameEs: daysShortEs[i],
      dayShortNameEn: daysShortEn[i],
      dayFullNameEs: daysEs[i],
      dayFullNameEn: daysEn[i],
      dayNameEs: daysEs[i],
      dayNameEn: daysEn[i],
      dateFormatted: `${d.getDate()} ${monthNamesEs[d.getMonth()]}`,
    });
  }

  return result;
}

/**
 * Generates a 7-day complete, balanced weekly diet plan adapted to the specific pet's
 * species, weight, condition, and caloric/gram requirements.
 */
export function generateWeeklyDietPlan(pet: Pet, language: 'es' | 'en' = 'es'): DayDietPlan[] {
  const merData = calculateMER(pet);
  const totalGrams = merData.dailyFoodGrams;
  const morningGrams = merData.mealPortions.breakfastGrams;
  const nightGrams = merData.mealPortions.dinnerGrams;
  const isDog = pet.species === 'dog';
  const isRenal = pet.clinicalCondition === 'renal';
  const isWeightControl = pet.clinicalCondition === 'weight_loss' || pet.bodyConditionScore >= 6;
  const isJoint = pet.clinicalCondition === 'joint_support';
  const isSensitive = pet.clinicalCondition === 'sensitive_digestive';
  const isHighPerf = isHighPerformancePet(pet);

  // Base multiplier per 10kg
  const weightFactor = Math.max(0.4, pet.weightKg / 10);

  const daysEs = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const daysEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // 7 Unique Days Configuration tailored for dogs and cats
  const weekTemplates = [
    // 0. LUNES / MONDAY (Pavo & Salmón)
    {
      dish1: {
        titleEs: isDog ? 'Pavo Magro con Calabacín al Vapor & Boniato' : 'Mousse Suave de Pavo con Caldo de Ave & Taurina',
        titleEn: isDog ? 'Lean Turkey with Steamed Zucchini & Sweet Potato' : 'Smooth Turkey Mousse with Poultry Broth & Taurine',
        descEs: 'Proteína hipoalergénica de fácil digestión con fibra soluble para regular el tránsito intestinal.',
        descEn: 'Hypoallergenic, easily digestible protein with soluble fiber for healthy intestinal transit.',
        proteinSourceEs: 'Pechuga de Pavo fresca',
        proteinGrams: Math.round(morningGrams * 0.55),
        vegGrams: Math.round(morningGrams * 0.25),
        carbGrams: Math.round(morningGrams * 0.15),
        supplementsEs: isRenal ? 'Cáscara de huevo (quelante) + Aceite de Salmón' : 'Cáscara de huevo + Cúrcuma dorada',
        benefitsEs: ['98% asimilación biológica', 'Bajo en grasas saturadas', 'Óptimo para inicio de semana'],
        benefitsEn: ['98% biological assimilation', 'Low in saturated fat', 'Optimal week kickoff'],
        chefTipEs: 'Cocer al vapor a 80°C para mantener los aminoácidos intactos.',
      },
      dish2: {
        titleEs: isDog ? 'Estofado de Salmón Salvaje con Calabaza & Chía' : 'Tartare Delicado de Salmón & Caldo de Colágeno',
        titleEn: isDog ? 'Wild Salmon Stew with Pumpkin & Chia Seed Gel' : 'Delicate Salmon Tartare & Collagen Broth',
        descEs: 'Cena regeneradora rica en ácidos grasos Omega-3 (EPA/DHA) para lubricación articular y piel sana.',
        descEn: 'Regenerative dinner rich in Omega-3 (EPA/DHA) for joint flexibility and glossy coat.',
        proteinSourceEs: 'Lomo de Salmón o Trucha fresca',
        proteinGrams: Math.round(nightGrams * 0.55),
        vegGrams: Math.round(nightGrams * 0.25),
        carbGrams: Math.round(nightGrams * 0.15),
        supplementsEs: 'Aceite de salmón puro + Colágeno de caldo',
        benefitsEs: ['Reducción de inflamación', 'Salud cardiovascular', 'Brillo intenso en pelaje'],
        benefitsEn: ['Inflammation reduction', 'Cardiovascular health', 'Coat radiance'],
        chefTipEs: 'Retirar espinas cuidadosamente y servir a temperatura corporal (37°C).',
      },
      snack1: {
        titleEs: isDog ? 'Bocaditos Crocantes de Pato & Manzana' : 'Láminas Crujientes de Pato Deshidratado',
        titleEn: isDog ? 'Crispy Duck & Apple Bites' : 'Dehydrated Duck Crisps',
        portionEs: isDog ? '2-3 bocados pequeños' : '1-2 láminas finas',
        descEs: 'Horneados a baja temperatura (75°C), 100% naturales sin aditivos.',
        descEn: 'Slow baked at 75°C, 100% natural with no chemical additives.',
        benefitsEs: 'Refuerzo dental y recompensa hipoalergénica.',
        ingredientsEs: ['Pechuga de pato', 'Manzana golden sin pepitas', 'Pizca de canela'],
      },
      snack2: {
        titleEs: isDog ? 'Bastoncitos de Zanahoria al Vapor con Aceite de Coco' : 'Daditos de Pollo Cocido en Caldo',
        titleEn: isDog ? 'Steamed Carrot Sticks with Virgin Coconut Oil' : 'Tender Chicken Cubes in Bone Broth',
        portionEs: isDog ? '2 bastoncitos tiernos' : '2-3 daditos de 1cm',
        descEs: 'Snack ligero hidratante con carotenos y fibra prebiótica.',
        descEn: 'Light hydrating snack packed with carotenes and prebiotic fiber.',
        benefitsEs: 'Salud visual y saciedad sin calorías excesivas.',
        ingredientsEs: ['Zanahoria baby', 'Aceite de coco virgen virgen extra'],
      },
      dessert1: {
        titleEs: 'Gelatina Refrescante de Caldo de Huesos & Arándanos',
        titleEn: 'Refreshing Bone Broth & Blueberry Jell-O',
        portionEs: isDog ? '1-2 cubitos de gelatina' : '1 cubito pequeño',
        descEs: 'Colágeno puro en gelatina natural con polifenoles antioxidantes.',
        descEn: 'Pure collagen in natural gelatin with antioxidant polyphenols.',
        benefitsEs: 'Sellado intestinal y regeneración de cartílagos.',
        ingredientsEs: ['Caldo de patas y médula gelificado', 'Arándanos silvestres triturados'],
        isFrozenOrGelatin: true,
      },
      dessert2: {
        titleEs: 'Yogur de Kéfir de Cabra con Calabaza Asada & Chía',
        titleEn: 'Goat Milk Kefir with Roasted Pumpkin & Chia',
        portionEs: isDog ? '2 cucharadas soperas' : '1 cucharadita de postre',
        descEs: 'Probióticos vivos con mucílagos que calman la microbiota digestiva.',
        descEn: 'Live probiotics with mucilage calming the digestive microbiota.',
        benefitsEs: 'Refuerzo del sistema inmune entérico.',
        ingredientsEs: ['Kéfir de leche de cabra sin lactosa', 'Puré de calabaza', 'Semillas de chía hidratadas'],
      },
      exercise: {
        durationMin: isDog ? (isWeightControl ? 50 : 40) : 25,
        typeEs: isDog ? 'Paseo matutino de exploración & olfato' : 'Juego interactivo con caña de plumas',
        typeEn: isDog ? 'Morning scent exploration walk' : 'Interactive feather wand play',
        notesEs: 'Permitir paradas de olfateo para reducir el cortisol.',
        notesEn: 'Allow ample sniffing stops to reduce cortisol levels.',
      },
    },

    // 1. MARTES / TUESDAY (Ternera & Merluza)
    {
      dish1: {
        titleEs: isDog ? 'Picada de Ternera de Pasto con Zanahoria & Arroz Blando' : 'Tartare Suave de Ternera Magra & Hígado (Taurina)',
        titleEn: isDog ? 'Grass-Fed Beef with Carrots & Soft Steamed Rice' : 'Gentle Beef Tartare & Organ Taurine Blend',
        descEs: 'Aporte de hierro hemo, zinc biodisponible y aminoácidos para tono muscular.',
        descEn: 'Heme iron, bioavailable zinc and vital amino acids for muscle tone.',
        proteinSourceEs: 'Ternera magra 15% grasa',
        proteinGrams: Math.round(morningGrams * 0.55),
        vegGrams: Math.round(morningGrams * 0.25),
        carbGrams: Math.round(morningGrams * 0.15),
        supplementsEs: 'Carbonato cálcico + Levadura nutricional',
        benefitsEs: ['Fuerza y vitalidad', 'Hematopoyesis', 'Metabolismo activo'],
        benefitsEn: ['Strength and vitality', 'Red blood cell health', 'Active metabolism'],
        chefTipEs: 'Sellar 30 segundos por lado para retener jugos.',
      },
      dish2: {
        titleEs: isDog ? 'Merluza Austral al Vapor con Puré de Boniato & Calabacín' : 'Velouté Gastroprotector de Merluza & Caldo',
        titleEn: isDog ? 'Steamed Hake with Sweet Potato Purée & Zucchini' : 'Gastroprotective Hake Velouté & Broth',
        descEs: 'Pescado blanco ultra digestible, perfecto para descanso nocturno ligero.',
        descEn: 'Ultra digestible white fish, ideal for light evening recovery.',
        proteinSourceEs: 'Lomos de Merluza sin espinas',
        proteinGrams: Math.round(nightGrams * 0.55),
        vegGrams: Math.round(nightGrams * 0.25),
        carbGrams: Math.round(nightGrams * 0.15),
        supplementsEs: 'Cáscara de huevo en polvo + Aceite de Krill',
        benefitsEs: ['Digestión ultra rápida', 'Cero pesadez nocturna', 'Piel protegida'],
        benefitsEn: ['Fast digestion', 'Zero night heaviness', 'Skin protection'],
        chefTipEs: 'Comprobar al tacto la ausencia total de espinas.',
      },
      snack1: {
        titleEs: isDog ? 'Galletitas Caseras de Plátano & Avena Pet-Safe' : 'Bocaditos de Pescado Blanco Secado al Aire',
        titleEn: isDog ? 'Homemade Banana & Oat Pet-Safe Cookies' : 'Air-Dried Whitefish Crispy Bites',
        portionEs: isDog ? '2 galletitas pequeñas' : '2 bocaditos',
        descEs: 'Sin harinas refinadas ni azúcares añadidos.',
        descEn: 'No refined flours or added sugars.',
        benefitsEs: 'Energía sostenida y fibra soluble.',
        ingredientsEs: ['Plátano maduro machacado', 'Copos de avena suave', 'Huevo'],
      },
      snack2: {
        titleEs: isDog ? 'Chips Deshidratados de Manzana sin semillas' : 'Caldo de Médula Templado en Cuenco',
        titleEn: isDog ? 'Dehydrated Apple Chips (Seedless)' : 'Warm Bone Broth Sip',
        portionEs: isDog ? '3-4 chips finos' : '30 ml en tazón',
        descEs: 'Textura crujiente y aroma frutal dulce natural.',
        descEn: 'Crunchy texture with sweet natural aroma.',
        benefitsEs: 'Limpieza mecánica de placa dental y pectina.',
        ingredientsEs: ['Manzana reineta o golden', 'Micro-pizca de perejil'],
      },
      dessert1: {
        titleEs: 'Heladitos Cremosos de Manzana, Coco & Caldo de Pollo',
        titleEn: 'Creamy Apple, Coconut & Broth Popsicles',
        portionEs: isDog ? '1 bombón helado' : '1 cubito pequeño',
        descEs: 'Textura refrescante ideal para gratificación masticatoria.',
        descEn: 'Refreshing treat ideal for rewarding soothing licks.',
        benefitsEs: 'Grasas de cadena media (MCT) que nutren el cerebro.',
        ingredientsEs: ['Puré de manzana cocida', 'Aceite de coco virgen', 'Caldo clarificado'],
        isFrozenOrGelatin: true,
      },
      dessert2: {
        titleEs: 'Cremoso de Calabaza Asada con Semillas de Lino Dorado',
        titleEn: 'Roasted Pumpkin Cream with Golden Flaxseed',
        portionEs: isDog ? '2 cucharadas soperas' : '1 cucharadita',
        descEs: 'Puré templado dulce natural con omega-3 vegetal.',
        descEn: 'Warm naturally sweet purée with plant omega-3.',
        benefitsEs: 'Regulación de glucosa e hidratación celular.',
        ingredientsEs: ['Calabaza moscada asada', 'Lino dorado recién molido'],
      },
      exercise: {
        durationMin: isDog ? 45 : 20,
        typeEs: isDog ? 'Paseo a paso firme & juegos de llamada' : 'Juego con túnel y ratón de sisal',
        typeEn: isDog ? 'Brisk walk & recall practice' : 'Tunnel sprint & sisal mouse play',
        notesEs: 'Variar la ruta para estimulación cognitiva.',
        notesEn: 'Vary walk path to stimulate canine senses.',
      },
    },

    // 2. MIÉRCOLES / WEDNESDAY (Pollo Campero & Conejo)
    {
      dish1: {
        titleEs: isDog ? 'Pollo de Corral con Judías Verdes & Quinoa Real' : 'Mousse Imperial de Pollo & Hígado con Caldo de Ave',
        titleEn: isDog ? 'Free-Range Chicken with Green Beans & Royal Quinoa' : 'Imperial Chicken & Liver Mousse in Golden Broth',
        descEs: 'Proteína completa con aminoácidos ramificados para energía constante.',
        descEn: 'Complete protein with branched-chain amino acids for all-day stamina.',
        proteinSourceEs: 'Muslo y pechuga de pollo desgrasado',
        proteinGrams: Math.round(morningGrams * 0.55),
        vegGrams: Math.round(morningGrams * 0.25),
        carbGrams: Math.round(morningGrams * 0.15),
        supplementsEs: 'Cáscara de huevo triturada + Aceite de oliva virgen',
        benefitsEs: ['Masa muscular magra', 'Fibra saciante', 'Alta digestibilidad'],
        benefitsEn: ['Lean muscle mass', 'Satiating fiber', 'High digestibility'],
        chefTipEs: 'Retirar toda la piel y grasa visible antes de cocer.',
      },
      dish2: {
        titleEs: isDog ? 'Conejo Estofado a Fuego Lento con Dados de Calabacín' : 'Delicia de Conejo & Caldo Renal Bajo en Fósforo',
        titleEn: isDog ? 'Slow-Simmered Rabbit with Zucchini Cubes' : 'Rabbit & Low-Phosphorus Renal Broth Delight',
        descEs: 'Carne noble hipoalergénica con el nivel de colesterol y fósforo más bajo.',
        descEn: 'Noble hypoallergenic meat with low cholesterol and controlled phosphorus.',
        proteinSourceEs: 'Carne magra de conejo deshuesado',
        proteinGrams: Math.round(nightGrams * 0.55),
        vegGrams: Math.round(nightGrams * 0.25),
        carbGrams: Math.round(nightGrams * 0.15),
        supplementsEs: 'Cáscara de huevo molida + Taurina pura',
        benefitsEs: ['Excelente para riñones', 'Hipoalergénico', 'Tacto suave'],
        benefitsEn: ['Kidney protection', 'Hypoallergenic', 'Gentle on stomach'],
        chefTipEs: 'Cocinar en olla tapada a fuego lento 25 minutos.',
      },
      snack1: {
        titleEs: isDog ? 'Tiras de Pechuga de Pavo Deshidratada' : 'Tiritas Tiernas de Pollo al Horno',
        titleEn: isDog ? 'Dehydrated Turkey Breast Jerky' : 'Tender Oven Chicken Strips',
        portionEs: isDog ? '2 tiras crujientes' : '1 tira pequeña',
        descEs: 'Proteína pura desgrasada sin sales.',
        descEn: 'Pure lean protein with zero added salt.',
        benefitsEs: 'Snack de alto valor para adiestramiento.',
        ingredientsEs: ['Pechuga de pavo 100% pura'],
      },
      snack2: {
        titleEs: isDog ? 'Dados de Sandía Fresca Despepitada' : 'Gelatina de Caldo de Codorniz',
        titleEn: isDog ? 'Fresh Seedless Watermelon Cubes' : 'Quail Broth Gelatin Cube',
        portionEs: isDog ? '3-4 daditos fríos' : '1 cubito',
        descEs: 'Bomba de hidratación con licopeno y electrolitos.',
        descEn: 'Hydration powerhouse with lycopene and natural electrolytes.',
        benefitsEs: 'Refresco estival y depuración renal.',
        ingredientsEs: ['Sandía roja dulce sin corteza ni pepitas'],
      },
      dessert1: {
        titleEs: 'Mousse Aterciopelada de Plátano & Algarroba (Pet-Safe)',
        titleEn: 'Banana & Pet-Safe Carob Velvety Mousse',
        portionEs: isDog ? '2 cucharadas' : '1 cucharadita',
        descEs: 'La alternativa 100% segura al chocolate, rica en minerales.',
        descEn: '100% pet-safe chocolate alternative loaded with minerals.',
        benefitsEs: 'Calma el tracto gástrico y aporta potasio.',
        ingredientsEs: ['Harina de algarroba pura', 'Plátano maduro', 'Agua o caldo clarificado'],
      },
      dessert2: {
        titleEs: 'Gelatina Refrescante de Manzanilla, Caldo & Frambuesas',
        titleEn: 'Soothing Chamomile, Broth & Raspberry Jell-O',
        portionEs: isDog ? '2 cubitos' : '1 cubito',
        descEs: 'Espasmolítico natural y protector gástrico.',
        descEn: 'Natural antispasmodic and stomach soother.',
        benefitsEs: 'Antioxidantes y relajación nocturna.',
        ingredientsEs: ['Infusión suave de manzanilla', 'Gelatina neutra', 'Frambuesas'],
        isFrozenOrGelatin: true,
      },
      exercise: {
        durationMin: isDog ? 45 : 25,
        typeEs: isDog ? 'Paseo por parque con ejercicios de propiocepción' : 'Juego de acecho con caja y premios escondidos',
        typeEn: isDog ? 'Park walk with agility balance logs' : 'Stalking foraging box game',
        notesEs: 'Subir suavemente a troncos y bancos para fortalecer tren posterior.',
        notesEn: 'Encourage gentle stepping on balance obstacles for core stability.',
      },
    },

    // 3. JUEVES / THURSDAY (Pescado Azul & Pavo Vital)
    {
      dish1: {
        titleEs: isDog ? 'Lomo de Trucha Desespinada con Calabaza & Arroz Integral' : 'Mousse de Trucha de Río & Yema de Huevo',
        titleEn: isDog ? 'Deboned Trout Fillet with Pumpkin & Brown Rice' : 'River Trout Mousse & Egg Yolk Cream',
        descEs: 'Grasas cardiosaludables astaxantina y proteína noble para ligamentos.',
        descEn: 'Cardioprotective astaxanthin and noble protein for ligament elasticity.',
        proteinSourceEs: 'Lomo de trucha asalmonada fresca',
        proteinGrams: Math.round(morningGrams * 0.55),
        vegGrams: Math.round(morningGrams * 0.25),
        carbGrams: Math.round(morningGrams * 0.15),
        supplementsEs: 'Cáscara de huevo en polvo + Alga Kelp microdosis',
        benefitsEs: ['Yodo orgánico', 'Piel sin picores', 'Vigor mental'],
        benefitsEn: ['Organic iodine', 'Itch-free coat', 'Cognitive sharpness'],
        chefTipEs: 'Cocinar al horno en papillote durante 10 minutos.',
      },
      dish2: {
        titleEs: isDog ? 'Suprema de Pavo Asado con Boniato & Arándanos Silvestres' : 'Gourmet de Pavo & Hígado al Vapor con Caldo Dorado',
        titleEn: isDog ? 'Roasted Turkey Breast with Sweet Potato & Wild Berries' : 'Steamed Turkey & Liver Gourmet in Golden Broth',
        descEs: 'Ración proteica ligera saciante con antioxidantes polifenólicos.',
        descEn: 'Light satiating protein meal with polyphenolic antioxidants.',
        proteinSourceEs: 'Pechuga de pavo limpia',
        proteinGrams: Math.round(nightGrams * 0.55),
        vegGrams: Math.round(nightGrams * 0.25),
        carbGrams: Math.round(nightGrams * 0.15),
        supplementsEs: 'Aceite de salmón salvaje + Carbonato cálcico',
        benefitsEs: ['Antioxidantes urinarios', 'Bajo índice glucémico', 'Masa magra'],
        benefitsEn: ['Urinary tract protection', 'Low glycemic index', 'Lean muscle'],
        chefTipEs: 'Añadir los arándanos al final sin sobrecocinar.',
      },
      snack1: {
        titleEs: isDog ? 'Bocaditos Horneados de Hígado de Ave al 10%' : 'Láminas Deshidratadas de Salmón',
        titleEn: isDog ? 'Oven-Baked 10% Poultry Liver Bites' : 'Dehydrated Salmon Crisps',
        portionEs: isDog ? '2 bocaditos pequeños' : '1 lámina',
        descEs: 'Concentrado de vitamina A y complejo B.',
        descEn: 'Vitamin A and B-complex natural powerhouse.',
        benefitsEs: 'Palatabilidad suprema y refuerzo inmunológico.',
        ingredientsEs: ['Hígado de pollo bio', 'Huevo', 'Harina de avena'],
      },
      snack2: {
        titleEs: isDog ? 'Rodajas Crujientes de Pepino Fresco' : 'Caldo de Gelatina Tibio',
        titleEn: isDog ? 'Crisp Cucumber Hydrating Slices' : 'Warm Gelatin Broth',
        portionEs: isDog ? '3-4 rodajas peladas' : '25 ml',
        descEs: '96% agua con electrolitos y frescor bucal.',
        descEn: '96% water with cooling electrolytes and fresh breath.',
        benefitsEs: 'Hidratación pura sin carga calórica.',
        ingredientsEs: ['Pepino fresco sin semillas'],
      },
      dessert1: {
        titleEs: 'Pannacotta Suave de Leche de Cabra & Arándanos',
        titleEn: 'Goat Milk & Blueberry Soft Pannacotta',
        portionEs: isDog ? '1 vasito pequeño' : '1 cucharadita',
        descEs: 'Textura sedosa con calcio y bacteriocinas probióticas.',
        descEn: 'Silky texture with calcium and protective probiotic cultures.',
        benefitsEs: 'Fácil absorción estomacal y salud vesical.',
        ingredientsEs: ['Leche de cabra pasteurizada', 'Gelatina neutra', 'Arándanos'],
        isFrozenOrGelatin: true,
      },
      dessert2: {
        titleEs: 'Heladitos de Plátano & Aceite de Coco Virgen',
        titleEn: 'Banana & Virgin Coconut Oil Drops',
        portionEs: isDog ? '1 cubito' : '1/2 cubito',
        descEs: 'Ácido láurico antibacteriano natural y potasio.',
        descEn: 'Natural antibacterial lauric acid and potassium.',
        benefitsEs: 'Energía limpia para neuronas y corazón.',
        ingredientsEs: ['Plátano aplastado', 'Aceite de coco virgen virgen extra'],
        isFrozenOrGelatin: true,
      },
      exercise: {
        durationMin: isDog ? 40 : 20,
        typeEs: isDog ? 'Paseo con correa larga & adiestramiento en positivo' : 'Juego con puntero láser suave y captura de premio',
        typeEn: isDog ? 'Long-leash stroll & positive training' : 'Feather chase & catch reward',
        notesEs: 'Premiar la calma y los autocontroles.',
        notesEn: 'Reward calm focus and impulse control.',
      },
    },

    // 4. VIERNES / FRIDAY (Ternera & Pescado Blanco)
    {
      dish1: {
        titleEs: isDog ? 'Guiso de Ternera Magra con Zanahorias Baby & Caldo de Médula' : 'Tartare de Ternera & Corazón de Ave (Taurina Pura)',
        titleEn: isDog ? 'Grass-Fed Beef Stew with Baby Carrots & Bone Broth' : 'Beef Tartare & Poultry Heart (Pure Taurine)',
        descEs: 'Nutrientes de alta densidad para recuperar energía hacia el fin de semana.',
        descEn: 'High density nutrients to refuel energy heading into the weekend.',
        proteinSourceEs: 'Ternera magra y corazón picado',
        proteinGrams: Math.round(morningGrams * 0.55),
        vegGrams: Math.round(morningGrams * 0.25),
        carbGrams: Math.round(morningGrams * 0.15),
        supplementsEs: 'Cáscara de huevo + Cúrcuma dorada con aceite de coco',
        benefitsEs: ['Regeneración muscular', 'Protección articular', 'Sabor irresistible'],
        benefitsEn: ['Muscle recovery', 'Joint support', 'Irresistible taste'],
        chefTipEs: 'Añadir el caldo de colágeno tibio en el momento de servir.',
      },
      dish2: {
        titleEs: isDog ? 'Bacalao Fresco Desalado con Calabacín Rallado & Semillas de Chía' : 'Mousse Suave de Bacalao & Caldo Clarificado',
        titleEn: isDog ? 'Fresh Cod Fillet with Shredded Zucchini & Chia Seeds' : 'Silky Cod Mousse & Clarified Broth',
        descEs: 'Proteína marina noble baja en histaminas con fibra prebiótica suave.',
        descEn: 'Noble white fish protein low in histamine with gentle prebiotic fiber.',
        proteinSourceEs: 'Lomo de bacalao fresco o merluza',
        proteinGrams: Math.round(nightGrams * 0.55),
        vegGrams: Math.round(nightGrams * 0.25),
        carbGrams: Math.round(nightGrams * 0.15),
        supplementsEs: 'Cáscara de huevo en polvo + Aceite de salmón',
        benefitsEs: ['Descanso estomacal nocturno', 'Omega-3 biodisponible', 'Control de peso'],
        benefitsEn: ['Night digestive comfort', 'Bioavailable omega-3', 'Weight balance'],
        chefTipEs: 'Desmenuzar con las yemas de los dedos para confirmar que no hay espinas.',
      },
      snack1: {
        titleEs: isDog ? 'Premios Crujientes de Pescado Blanco Horneado' : 'Snacks Deshidratados de Bacalao',
        titleEn: isDog ? 'Crispy Oven-Baked Whitefish Bites' : 'Air-Dried Cod Flakes',
        portionEs: isDog ? '2-3 premios' : '2 copos',
        descEs: 'Proteína crujiente deshidratada sin grasa.',
        descEn: 'Crunchy fat-free dehydrated protein.',
        benefitsEs: 'Hipoalergénico y bueno para la higiene dental.',
        ingredientsEs: ['Pescado blanco 100%'],
      },
      snack2: {
        titleEs: isDog ? 'Daditos de Calabaza Asada con Canela Pet-Safe' : 'Daditos de Pechuga de Pavo Cocida',
        titleEn: isDog ? 'Roasted Pumpkin Cubes with Ceylon Cinnamon' : 'Tender Cooked Turkey Cubes',
        portionEs: isDog ? '3-4 daditos' : '3 daditos',
        descEs: 'Carbohidratos complejos dulces naturales con betacarotenos.',
        descEn: 'Naturally sweet complex carbs with betacarotene.',
        benefitsEs: 'Regulación del tránsito y alivio digestivo.',
        ingredientsEs: ['Calabaza dulce asada', 'Pizca de canela de Ceilán'],
      },
      dessert1: {
        titleEs: 'Gelatina de Caldo de Ave con Fresas Frescas',
        titleEn: 'Poultry Collagen Gelatin with Fresh Strawberries',
        portionEs: isDog ? '2 cubitos' : '1 cubito',
        descEs: 'Vitamina C natural y colágeno para encías sanas.',
        descEn: 'Natural vitamin C and collagen for healthy gums.',
        benefitsEs: 'Refuerzo capilar y salud gingival.',
        ingredientsEs: ['Caldo de pollo gelificado', 'Fresa fresca madura triturada'],
        isFrozenOrGelatin: true,
      },
      dessert2: {
        titleEs: 'Yogur Natural Sin Lactosa con Puré de Pera & Semillas de Cáñamo',
        titleEn: 'Lactose-Free Yogurt with Pear Purée & Hemp Seeds',
        portionEs: isDog ? '2 cucharadas soperas' : '1 cucharadita',
        descEs: 'Probióticos activos con fibra astringente y ácidos linolénicos.',
        descEn: 'Active probiotics with astringent fiber and linolenic acids.',
        benefitsEs: 'Equilibrio de la flora bacteriana intestinal.',
        ingredientsEs: ['Yogur natural sin lactosa ni azúcar', 'Pera conference sin corazón', 'Semillas de cáñamo'],
      },
      exercise: {
        durationMin: isDog ? (isWeightControl ? 55 : 45) : 25,
        typeEs: isDog ? 'Paseo social al atardecer & juego de persecución controlada' : 'Circuito de juego con cajas de cartón y caña',
        typeEn: isDog ? 'Sunset social walk & controlled fetch game' : 'Cardboard obstacle sprint & wand stalk',
        notesEs: 'Ideal para liberar tensiones acumuladas de la semana.',
        notesEn: 'Helps release weekly built-up excitement.',
      },
    },

    // 5. SÁBADO / SATURDAY (Salmón Royale & Pavo de Fiesta)
    {
      dish1: {
        titleEs: isDog ? 'Estofado Royale de Salmón & Patas con Colágeno' : 'Mousse Festiva de Salmón Salvaje & Conejo',
        titleEn: isDog ? 'Royal Salmon & Collagen Bone Stew' : 'Wild Salmon & Rabbit Festive Mousse',
        descEs: 'El plato insignia de fin de semana: colágeno tipo II y grasas nobles EPA/DHA.',
        descEn: 'Signature weekend dish: Type II collagen and marine omega-3 fatty acids.',
        proteinSourceEs: 'Salmón salvaje y caldo de gelatina',
        proteinGrams: Math.round(morningGrams * 0.55),
        vegGrams: Math.round(morningGrams * 0.25),
        carbGrams: Math.round(morningGrams * 0.15),
        supplementsEs: 'Cáscara de huevo microtriturada + Aceite de krill',
        benefitsEs: ['Regeneración profunda articular', 'Brillo extraordinario', 'Energía'],
        benefitsEn: ['Deep joint regeneration', 'Extraordinary coat shine', 'Stamina'],
        chefTipEs: 'Templar el caldo para fundir la gelatina sobre el salmón.',
      },
      dish2: {
        titleEs: isDog ? 'Suprema de Ave con Verduras de la Huerta & Boniato' : 'Crema Imperial de Pavo, Yema de Campo & Caldo',
        titleEn: isDog ? 'Poultry Supreme with Garden Vegetables & Sweet Potato' : 'Imperial Turkey & Free-Range Yolk in Rich Broth',
        descEs: 'Combinación balanceada de proteínas nobles y antioxidantes botánicos.',
        descEn: 'Balanced blend of noble proteins and botanical antioxidants.',
        proteinSourceEs: 'Pechuga y muslo de ave desgrasado',
        proteinGrams: Math.round(nightGrams * 0.55),
        vegGrams: Math.round(nightGrams * 0.25),
        carbGrams: Math.round(nightGrams * 0.15),
        supplementsEs: 'Carbonato cálcico + Aceite de salmón salvaje',
        benefitsEs: ['Fácil asimilación', 'Cero hinchazón', 'Alta palatabilidad'],
        benefitsEn: ['Effortless digestion', 'Zero bloating', 'High palatability'],
        chefTipEs: 'Servir en plato hondo para retener el jugo aromático.',
      },
      snack1: {
        titleEs: isDog ? 'Galletitas Horneadas de Calabaza & Crema de Cacahuete Pura' : 'Bocaditos Crujientes de Pato al Horno',
        titleEn: isDog ? 'Baked Pumpkin & 100% Pure Peanut Butter Cookies' : 'Oven-Baked Crispy Duck Bites',
        portionEs: isDog ? '2 galletas' : '2 bocaditos',
        descEs: 'Cacahuete 100% puro (sin xilitol, azúcares ni sales añadidas).',
        descEn: '100% pure peanuts (free from xylitol, sugar, and salt).',
        benefitsEs: 'Grasas monoinsaturadas y proteínas vegetales de alta calidad.',
        ingredientsEs: ['Calabaza asada', 'Crema de cacahuete pura 100%', 'Avena integral'],
      },
      snack2: {
        titleEs: isDog ? 'Dados de Pera Dulce sin Semillas' : 'Caldo Dorado en Tazón',
        titleEn: isDog ? 'Sweet Seedless Pear Cubes' : 'Warm Golden Broth Sip',
        portionEs: isDog ? '3-4 dados pelados' : '30 ml',
        descEs: 'Hidratación alcalinizante con fibra soluble.',
        descEn: 'Alkalinizing hydration packed with soluble fiber.',
        benefitsEs: 'Digestión suave y salud renal.',
        ingredientsEs: ['Pera fresca sin corazón ni pepitas'],
      },
      dessert1: {
        titleEs: 'Delicia Helada de Kéfir, Caldo & Arándanos',
        titleEn: 'Kefir, Bone Broth & Blueberry Frozen Treat',
        portionEs: isDog ? '1 polo helado' : '1 cubito',
        descEs: 'Doble acción de probióticos y colágeno congelado.',
        descEn: 'Dual action of live probiotics and frozen bone collagen.',
        benefitsEs: 'Estimulación sensorial y microbiota óptima.',
        ingredientsEs: ['Kéfir de cabra', 'Caldo clarificado de colágeno', 'Arándanos silvestres'],
        isFrozenOrGelatin: true,
      },
      dessert2: {
        titleEs: 'Puré Dorado de Boniato & Aceite de Coco Virgen',
        titleEn: 'Golden Sweet Potato & Virgin Coconut Purée',
        portionEs: isDog ? '2 cucharadas soperas' : '1 cucharadita',
        descEs: 'Carbohidratos de bajo índice glucémico y grasas MCT.',
        descEn: 'Low glycemic complex carbs and healthy MCT fats.',
        benefitsEs: 'Energía muscular de larga duración para el fin de semana.',
        ingredientsEs: ['Boniato asado machacado', 'Aceite de coco virgen'],
      },
      exercise: {
        durationMin: isDog ? (isWeightControl ? 65 : 55) : 30,
        typeEs: isDog ? 'Senderismo suave en naturaleza o paseo largo campestre' : 'Sesión extendida de juego activo y rascador multinivel',
        typeEn: isDog ? 'Nature trail hiking or extended country walk' : 'Extended climbing tree & active play session',
        notesEs: 'Adaptar el ritmo a la temperatura y llevar agua fresca siempre.',
        notesEn: 'Pace appropriately with weather and always carry fresh water.',
      },
    },

    // 6. DOMINGO / SUNDAY (Banquete de Conejo & Velouté Suave)
    {
      dish1: {
        titleEs: isDog ? 'Banquete de Conejo & Cordero Magro con Calabaza Asada' : 'Festín Felino de Conejo & Pescado Blanco con Caldo',
        titleEn: isDog ? 'Rabbit & Lean Lamb Feast with Roasted Pumpkin' : 'Feline Feast of Rabbit & Whitefish in Golden Broth',
        descEs: 'Ración dominical reconstituyente con proteínas de alto valor biológico.',
        descEn: 'Rejuvenating Sunday feast packed with high biological value proteins.',
        proteinSourceEs: 'Conejo magro y cordero desgrasado',
        proteinGrams: Math.round(morningGrams * 0.55),
        vegGrams: Math.round(morningGrams * 0.25),
        carbGrams: Math.round(morningGrams * 0.15),
        supplementsEs: 'Cáscara de huevo en polvo + Aceite de salmón',
        benefitsEs: ['Variedad proteica semanal', 'Fortalecimiento inmune', 'Salud digestiva'],
        benefitsEn: ['Weekly protein diversity', 'Immune boost', 'Digestive health'],
        chefTipEs: 'Guisar a fuego lento 20 minutos con una ramita de romero fresco.',
      },
      dish2: {
        titleEs: isDog ? 'Velouté Digestivo de Pescado Blanco con Boniato & Kéfir' : 'Mousse Velouté de Merluza & Caldo de Médula Suave',
        titleEn: isDog ? 'Digestive Whitefish Velouté with Sweet Potato & Kefir' : 'Gentle Hake Velouté Mousse & Bone Broth',
        descEs: 'Cierre de ciclo semanal: cena ligera y calmante para preparar el estómago.',
        descEn: 'Weekly cycle closure: light soothing dinner preparing the gut for the week ahead.',
        proteinSourceEs: 'Merluza o bacalao fresco al vapor',
        proteinGrams: Math.round(nightGrams * 0.55),
        vegGrams: Math.round(nightGrams * 0.25),
        carbGrams: Math.round(nightGrams * 0.15),
        supplementsEs: 'Cáscara de huevo + Kéfir de cabra (añadido en frío)',
        benefitsEs: ['Reinicio del microbioma', 'Sueño profundo y reparador', 'Cero pesadez'],
        benefitsEn: ['Microbiome reset', 'Deep restorative sleep', 'Zero stomach stress'],
        chefTipEs: 'Incorporar el kéfir fuera del fuego para no inactivar los probióticos.',
      },
      snack1: {
        titleEs: isDog ? 'Tiras de Ternera Magra Deshidratadas al Horno' : 'Copos Deshidratados de Pavo',
        titleEn: isDog ? 'Oven-Baked Lean Beef Jerky' : 'Air-Dried Turkey Flakes',
        portionEs: isDog ? '2 tiras' : '2 copos',
        descEs: 'Proteína pura crujiente sin conservantes.',
        descEn: 'Crunchy pure protein with zero preservatives.',
        benefitsEs: 'Gusto carnívoro y bienestar masticatorio.',
        ingredientsEs: ['Ternera magra de pasto'],
      },
      snack2: {
        titleEs: isDog ? 'Bastoncitos de Calabacín Crujiente al Vapor' : 'Daditos de Merluza al Vapor',
        titleEn: isDog ? 'Steamed Crisp Zucchini Sticks' : 'Tender Steamed Hake Cubes',
        portionEs: isDog ? '3-4 bastoncitos' : '3 daditos',
        descEs: 'Rico en potasio y agua biológica.',
        descEn: 'Rich in potassium and structured biological water.',
        benefitsEs: 'Depuración renal y saciedad.',
        ingredientsEs: ['Calabacín fresco'],
      },
      dessert1: {
        titleEs: 'Pastelito Cremoso de Manzana & Kéfir de Cabra',
        titleEn: 'Apple & Goat Kefir Creamy Tartlet',
        portionEs: isDog ? '1 porción pequeña' : '1 cucharadita',
        descEs: 'Postre gourmet dominical suave y prebiótico.',
        descEn: 'Gentle prebiotic Sunday gourmet treat.',
        benefitsEs: 'Salud digestiva y recompensa cariñosa.',
        ingredientsEs: ['Puré de manzana asada', 'Kéfir de cabra', 'Huevo batido suave'],
      },
      dessert2: {
        titleEs: 'Gelatina de Colágeno Puro & Extracto Suave de Manzanilla',
        titleEn: 'Pure Collagen Gelatin & Mild Chamomile Extract',
        portionEs: isDog ? '2 cubitos' : '1 cubito',
        descEs: 'Calmante natural para cerrar la semana con relax absoluto.',
        descEn: 'Natural soother closing the week in absolute relaxation.',
        benefitsEs: 'Protección de la mucosa gástrica y relajación.',
        ingredientsEs: ['Caldo de patas clarificado', 'Infusión de manzanilla dulce'],
        isFrozenOrGelatin: true,
      },
      exercise: {
        durationMin: isDog ? 45 : 20,
        typeEs: isDog ? 'Paseo relajante de descompresión sensorial & cepillado suave' : 'Cepillado relajante y juego suave de persecución',
        typeEn: isDog ? 'Relaxing decompression sniff walk & gentle grooming' : 'Relaxing grooming brush & gentle toy stalk',
        notesEs: 'Paseo tranquilo a ritmo libre del animal.',
        notesEn: 'Quiet, slow-paced walk letting the pet lead the route.',
      },
    },
  ];

  return weekTemplates.map((template, dayIndex) => {
    const isEn = language === 'en';
    const isPuppyOrKitten = pet.ageYears < 1;
    const isSenior = pet.ageYears >= 7 || pet.clinicalCondition === 'senior_vitality';

    const stageBenefit = isPuppyOrKitten
      ? (isEn ? 'Growth profile: High biological value protein + DHA for brain development' : 'Etapa Crecimiento: Proteína de alta asimilación + DHA para desarrollo cognitivo')
      : isSenior
      ? (isEn ? 'Senior profile: Joint support, easy mastication & kidney-friendly balance' : 'Etapa Senior: Soporte articular, fácil masticación y fósforo equilibrado')
      : (isEn ? 'Adult profile: Muscle tone & optimal metabolic stamina' : 'Etapa Adulto: Tono muscular y vitalidad metabólica óptima');

    const dish1: DailyMealItem = {
      id: `dish-d${dayIndex}-1`,
      title: isHighPerf
        ? (dayIndex === 0 ? 'Súper Guiso Energético de Res con Arroz Integral'
          : dayIndex === 1 ? 'Súper Guiso de Cerdo Energético para Perros Atletas'
          : dayIndex === 2 ? 'Plato de Potencia Canina: Pollo y Quinoa con Verduras'
          : dayIndex === 3 ? 'Menú Deportivo de Pavo y Boniato: Combustible Muscular'
          : dayIndex === 4 ? 'Festín de Cordero Energético con Calabaza y Arroz'
          : dayIndex === 5 ? 'Cazuela Marina de Salmón y Boniato para Perros Deportistas'
          : 'Cazuela de Pescado Blanco y Arroz: Digestión Ligera para Atletas')
        : (isEn ? template.dish1.titleEn : template.dish1.titleEs),
      category: 'dish1',
      mealSlot: 'morning',
      description: isHighPerf
        ? 'Aporte calórico denso (3.5% peso corporal) con aminoácidos ramificados BCAA, grasas nobles MCT y carbohidratos de bajo índice glucémico para energía sostenida sin sobreexcitación.'
        : (isEn ? template.dish1.descEn : template.dish1.descEs),
      portionGrams: morningGrams,
      kcal: Math.round(merData.mer * 0.5),
      ingredients: [
        { name: template.dish1.proteinSourceEs, grams: template.dish1.proteinGrams, category: 'protein' },
        { name: isDog ? 'Verdura al vapor (Calabacín/Zanahoria)' : 'Caldo clarificado de colágeno', grams: template.dish1.vegGrams, category: 'vegetable' },
        { name: isDog ? 'Boniato / Arroz cocido' : 'Proteína noble / Taurina', grams: template.dish1.carbGrams, category: 'fiber_carb' },
        { name: isHighPerf ? 'Aceite MCT + Caldo de médula + Calcio' : (isPuppyOrKitten ? `${template.dish1.supplementsEs} + Calcio Crecimiento` : isSenior ? `${template.dish1.supplementsEs} + Condroprotectores` : template.dish1.supplementsEs), grams: Math.round(weightFactor * 5), category: 'supplement_calcium' },
      ],
      instructions: [
        isEn ? `Step 1: Steam the protein source gently (${template.dish1.proteinGrams}g) without adding salt or spices.` : `Paso 1: Cocer al vapor la proteína (${template.dish1.proteinGrams}g) a baja temperatura (80°C) sin sal añadida.`,
        isEn ? `Step 2: Mash the vegetables and carbs until smooth and tender.` : `Paso 2: Cocer y machacar las verduras y guarnición hasta textura suave y de fácil digestión.`,
        isEn ? `Step 3: Mix the supplements (${template.dish1.supplementsEs}) and serve warm at body temperature (~37°C).` : `Paso 3: Integrar los suplementos (${template.dish1.supplementsEs}) y servir tibio a temperatura ambiente/corporal (~37°C).`,
      ],
      clinicalBenefits: [
        isHighPerf ? '⚡ Ratio proteico/lipídico de alto rendimiento (BCAA + MCT)' : stageBenefit,
        ...(isEn ? template.dish1.benefitsEn : template.dish1.benefitsEs)
      ],
      chefTip: isHighPerf ? '⚠️ Reposo obligatorio: Esperar 60 min antes y después de comer antes de iniciar cualquier carrera o entrenamiento.' : template.dish1.chefTipEs,
    };

    const dish2: DailyMealItem = {
      id: `dish-d${dayIndex}-2`,
      title: isHighPerf
        ? (dayIndex === 0 ? 'Potaje de Res y Arroz Integral para Perros Deportistas'
          : dayIndex === 1 ? 'Estofado Dinámico de Pollo y Avena Atleta'
          : dayIndex === 2 ? 'Plato de Pavo y Avena: Energía Limpia para Perros Activos'
          : dayIndex === 3 ? 'Estofado de Cordero y Quinoa: Recuperación y Masa Muscular'
          : dayIndex === 4 ? 'Guiso de Salmón y Patatas: Resistencia y Salud Articular'
          : dayIndex === 5 ? 'Súper Salmón Atleta: Fuerza, Pelo Brillante y Agilidad'
          : 'Plato de Res y Avena: Potencia y Resistencia para Canes Activos')
        : (isEn ? template.dish2.titleEn : template.dish2.titleEs),
      category: 'dish2',
      mealSlot: 'night',
      description: isHighPerf
        ? 'Cena regenerativa rica en colágeno soluble, glicina y antioxidantes marinos para restaurar micro-fibras musculares y lubricar cartílagos durante el descanso.'
        : (isEn ? template.dish2.descEn : template.dish2.descEs),
      portionGrams: nightGrams,
      kcal: Math.round(merData.mer * 0.5),
      ingredients: [
        { name: template.dish2.proteinSourceEs, grams: template.dish2.proteinGrams, category: 'protein' },
        { name: isDog ? 'Calabaza asada / Calabacín' : 'Caldo de médula ósea', grams: template.dish2.vegGrams, category: 'vegetable' },
        { name: isDog ? 'Fibra soluble / Chía' : 'Clara de huevo / Taurina', grams: template.dish2.carbGrams, category: 'fiber_carb' },
        { name: isHighPerf ? 'Omega-3 EPA/DHA + Colágeno bioasimilable' : (isPuppyOrKitten ? `${template.dish2.supplementsEs} + DHA Cachorro` : isSenior ? `${template.dish2.supplementsEs} + Omega-3 Senior` : template.dish2.supplementsEs), grams: Math.round(weightFactor * 5), category: 'supplement_calcium' },
      ],
      instructions: [
        isEn ? `Step 1: Gently poach the fish/meat (${template.dish2.proteinGrams}g) preserving the natural juices.` : `Paso 1: Pochar suavemente la proteína (${template.dish2.proteinGrams}g) preservando sus jugos naturales.`,
        isEn ? `Step 2: Prepare the vegetable purée and warm collagen broth.` : `Paso 2: Preparar el puré de verduras e integrar el caldo de colágeno tibio.`,
        isEn ? `Step 3: Combine with ${template.dish2.supplementsEs} and serve in two separate calm bowls.` : `Paso 3: Mezclar con ${template.dish2.supplementsEs} y servir en tazón cómodo.`,
      ],
      clinicalBenefits: [
        isHighPerf ? '⚡ Regeneración nocturna de tejido conectivo y glucógeno muscular' : stageBenefit,
        ...(isEn ? template.dish2.benefitsEn : template.dish2.benefitsEs)
      ],
      chefTip: isHighPerf ? 'Servir con una cucharada de caldo de huesos templado para hidratación isotónica.' : template.dish2.chefTipEs,
    };

    const snack1: DailySnackItem = {
      id: `snack-d${dayIndex}-1`,
      title: isEn ? template.snack1.titleEn : template.snack1.titleEs,
      portion: template.snack1.portionEs,
      description: isEn ? template.snack1.descEn : template.snack1.descEs,
      benefits: template.snack1.benefitsEs,
      ingredients: template.snack1.ingredientsEs,
      instructions: [
        isEn ? `Step 1: Slice the ingredients thinly into bite-sized portions suitable for ${pet.name}.` : `Paso 1: Cortar finamente los ingredientes en porciones pequeñas aptas para ${pet.name}.`,
        isEn ? `Step 2: Steam or bake gently at low temperature (75°C - 80°C) without oil or salt.` : `Paso 2: Cocer al vapor suave o deshidratar al horno a baja temperatura (75°C - 80°C) sin sal ni aceites añadidos.`,
        isEn ? `Step 3: Allow to cool down completely before offering as a positive reward.` : `Paso 3: Dejar enfriar por completo a temperatura ambiente antes de ofrecer como premio positivo.`
      ],
      chefTip: isEn ? 'Store in an airtight container in the fridge for up to 4 days.' : 'Conservar en recipiente hermético en nevera hasta 4 días.',
      kcal: Math.round(merData.mer * 0.05),
    };

    const snack2: DailySnackItem = {
      id: `snack-d${dayIndex}-2`,
      title: isEn ? template.snack2.titleEn : template.snack2.titleEs,
      portion: template.snack2.portionEs,
      description: isEn ? template.snack2.descEn : template.snack2.descEs,
      benefits: template.snack2.benefitsEs,
      ingredients: template.snack2.ingredientsEs,
      instructions: [
        isEn ? `Step 1: Wash and prep the fresh ingredients thoroughly.` : `Paso 1: Lavar y preparar los ingredientes frescos retirando partes duras.`,
        isEn ? `Step 2: Steam lightly for 5 minutes to soften cellulose fibers for optimal digestibility.` : `Paso 2: Escaldar o cocer 5 minutos al vapor para ablandar la fibra y facilitar la digestión.`,
        isEn ? `Step 3: Serve fresh as a healthy hydrating treat between main meals.` : `Paso 3: Servir fresco como snack ligero e hidratante entre comidas.`
      ],
      chefTip: isEn ? 'Provides hydration and enzymes without digestive load.' : 'Aporta agua biológica y enzimas sin sobrecargar la digestión.',
      kcal: Math.round(merData.mer * 0.04),
    };

    const dessert1: DailyDessertItem = {
      id: `dessert-d${dayIndex}-1`,
      title: isEn ? template.dessert1.titleEn : template.dessert1.titleEs,
      portion: template.dessert1.portionEs,
      description: isEn ? template.dessert1.descEn : template.dessert1.descEs,
      benefits: template.dessert1.benefitsEs,
      ingredients: template.dessert1.ingredientsEs,
      isFrozenOrGelatin: template.dessert1.isFrozenOrGelatin,
      instructions: [
        isEn ? `Step 1: Blend or whisk the ingredients into a smooth, silky liquid or purée.` : `Paso 1: Triturar o mezclar los ingredientes hasta obtener una consistencia suave y homogénea.`,
        isEn ? `Step 2: Pour into silicone molds or ice trays and chill in the fridge for 2-3 hours until set (or freeze for frozen treats).` : `Paso 2: Verter en moldes de silicona o cubitera y refrigerar 2-3 horas hasta cuajar (o congelar ligeramente si es helado).`,
        isEn ? `Step 3: Unmold 1 portion and serve at room temperature or cool.` : `Paso 3: Desmoldar la porción indicada y servir fresco tras la comida o como postre digestivo.`
      ],
      chefTip: isEn ? 'Rich in glycine and probiotics to soothe gastric mucosa.' : 'Rico en glicina y probióticos para proteger la mucosa gástrica.',
      kcal: Math.round(merData.mer * 0.05),
    };

    const dessert2: DailyDessertItem = {
      id: `dessert-d${dayIndex}-2`,
      title: isEn ? template.dessert2.titleEn : template.dessert2.titleEs,
      portion: template.dessert2.portionEs,
      description: isEn ? template.dessert2.descEn : template.dessert2.descEs,
      benefits: template.dessert2.benefitsEs,
      ingredients: template.dessert2.ingredientsEs,
      isFrozenOrGelatin: template.dessert2.isFrozenOrGelatin,
      instructions: [
        isEn ? `Step 1: Combine the natural probiotics or fruit purée at room temperature.` : `Paso 1: Mezclar los probióticos naturales o puré de fruta a temperatura ambiente.`,
        isEn ? `Step 2: Gently fold in seeds or broth until evenly distributed.` : `Paso 2: Incorporar suavemente las semillas hidratadas o caldo clarificado.`,
        isEn ? `Step 3: Serve freshly made in a clean saucer.` : `Paso 3: Servir en plato limpio como broche digestivo reconfortante.`
      ],
      chefTip: isEn ? 'Natural antioxidant boost for gut microbiome balance.' : 'Potencia la flora intestinal beneficiosa y la absorción de nutrientes.',
      kcal: Math.round(merData.mer * 0.04),
    };

    const exerciseTarget = isHighPerf ? {
      durationMin: 80,
      activityTypeEs: 'Entrenamiento Deportivo / Trabajo & Olfateo de Descompresión',
      activityTypeEn: 'Sport / Work Training & Decompression Scent Session',
      notesEs: '⚠️ Regla de Oro Anti-Torsión: Reposo estricto de 60 min antes y después de comidas. 15-20 min de olfateo autónomo para modular el cortisol.',
      notesEn: '⚠️ Anti-Torsion Golden Rule: Strict 60 min rest before and after meals. 15-20 min autonomous scent search to balance cortisol.',
    } : {
      durationMin: template.exercise.durationMin,
      activityTypeEs: template.exercise.typeEs,
      activityTypeEn: template.exercise.typeEn,
      notesEs: template.exercise.notesEs,
      notesEn: template.exercise.notesEn,
    };

    const dayPlan: DayDietPlan = {
      dayIndex,
      dayNameEs: daysEs[dayIndex],
      dayNameEn: daysEn[dayIndex],
      dish1,
      dish2,
      snack1,
      snack2,
      dessert1,
      dessert2,
      exerciseTarget,
      cognitiveHabitTarget: isHighPerf ? HIGH_PERFORMANCE_COGNITIVE_HABITS[dayIndex] : undefined,
      isHighPerformancePlan: isHighPerf,
    };

    return filterDayPlanForAllergies(dayPlan, pet, language);
  });
}

/**
 * Adapts dishes, snacks, and desserts to eliminate any allergen specified by the pet owner.
 */
function filterDayPlanForAllergies(dayPlan: DayDietPlan, pet: Pet, language: 'es' | 'en'): DayDietPlan {
  const allergens = extractPetAllergens(pet.allergies, pet.allergensList);
  if (!allergens || allergens.length === 0) {
    return dayPlan;
  }

  const isEn = language === 'en';
  const hasAllergen = (text: string, allergenKeys: string[]) => {
    const lower = text.toLowerCase();
    return allergenKeys.some(key => {
      const def = COMMON_FOOD_ALLERGENS.find(d => d.id === key);
      const keywords = def ? def.keywords : [key.toLowerCase()];
      return keywords.some(kw => lower.includes(kw));
    });
  };

  const modifiedDish1 = { ...dayPlan.dish1 };
  const modifiedDish2 = { ...dayPlan.dish2 };
  const modifiedSnack1 = { ...dayPlan.snack1, ingredients: [...dayPlan.snack1.ingredients] };
  const modifiedSnack2 = { ...dayPlan.snack2, ingredients: [...dayPlan.snack2.ingredients] };
  const modifiedDessert1 = { ...dayPlan.dessert1, ingredients: [...dayPlan.dessert1.ingredients] };
  const modifiedDessert2 = { ...dayPlan.dessert2, ingredients: [...dayPlan.dessert2.ingredients] };

  // Check proteins and ingredients in dishes
  const checkAndSubstituteDish = (dish: DailyMealItem) => {
    const dishText = `${dish.title} ${dish.description} ${dish.ingredients.map(i => i.name).join(' ')}`;

    // Pollo
    if (hasAllergen(dishText, ['pollo'])) {
      dish.title = dish.title.replace(/pollo|chicken/gi, isEn ? 'Country Turkey' : 'Pavo Campesino');
      dish.ingredients = dish.ingredients.map(ing => {
        if (/pollo|chicken/gi.test(ing.name)) {
          return { ...ing, name: isEn ? 'Fresh Lean Turkey Breast' : 'Pechuga de Pavo fresca hipoalergénica' };
        }
        return ing;
      });
      dish.description = `${dish.description} (🛡️ ${isEn ? 'Adapted: 100% poultry-free' : 'Adaptado: 100% libre de pollo'})`;
    }

    // Ternera
    if (hasAllergen(dishText, ['ternera'])) {
      dish.title = dish.title.replace(/ternera|beef|res/gi, isEn ? 'Country Turkey' : 'Pavo Magro Campesino');
      dish.ingredients = dish.ingredients.map(ing => {
        if (/ternera|beef|res/gi.test(ing.name)) {
          return { ...ing, name: isEn ? 'Lean Turkey or Steamed Whitefish' : 'Pavo magro o Merluza blanca' };
        }
        return ing;
      });
      dish.description = `${dish.description} (🛡️ ${isEn ? 'Adapted: 100% beef-free' : 'Adaptado: 100% libre de ternera'})`;
    }

    // Pescado / Salmón
    if (hasAllergen(dishText, ['pescado'])) {
      dish.title = dish.title.replace(/salmón|salmon|pescado|fish|merluza|trucha/gi, isEn ? 'Noble Duck & Sweet Potato' : 'Pato Noble o Pavo');
      dish.ingredients = dish.ingredients.map(ing => {
        if (/salmón|salmon|pescado|fish|merluza|trucha/gi.test(ing.name)) {
          return { ...ing, name: isEn ? 'Noble Duck Breast' : 'Magret de Pato o Pavo Campesino' };
        }
        if (/aceite de salmón/gi.test(ing.name)) {
          return { ...ing, name: isEn ? 'Olive Oil & Golden Flax' : 'Aceite de oliva y lino dorado' };
        }
        return ing;
      });
      dish.description = `${dish.description} (🛡️ ${isEn ? 'Adapted: 100% fish-free' : 'Adaptado: 100% libre de pescado y salmón'})`;
    }

    // Cerdo
    if (hasAllergen(dishText, ['cerdo'])) {
      dish.title = dish.title.replace(/cerdo|pork/gi, isEn ? 'Farm Turkey' : 'Pavo Campesino');
      dish.ingredients = dish.ingredients.map(ing => {
        if (/cerdo|pork/gi.test(ing.name)) {
          return { ...ing, name: isEn ? 'Fresh Turkey' : 'Pavo magro campesino' };
        }
        return ing;
      });
    }

    // Cordero
    if (hasAllergen(dishText, ['cordero'])) {
      dish.title = dish.title.replace(/cordero|lamb/gi, isEn ? 'Tender Turkey' : 'Pavo Tierno');
      dish.ingredients = dish.ingredients.map(ing => {
        if (/cordero|lamb/gi.test(ing.name)) {
          return { ...ing, name: isEn ? 'Fresh Turkey' : 'Pavo fresco' };
        }
        return ing;
      });
    }

    // Cereales / Gluten
    if (hasAllergen(dishText, ['cereales'])) {
      dish.title = dish.title.replace(/arroz|avena|rice|oat/gi, isEn ? 'Sweet Potato' : 'Boniato asado');
      dish.ingredients = dish.ingredients.map(ing => {
        if (/arroz|avena|trigo|gluten|cereal/gi.test(ing.name)) {
          return { ...ing, name: isEn ? 'Steamed Sweet Potato or Pumpkin Puree' : 'Boniato asado o Puré de calabaza (Grain-Free)' };
        }
        return ing;
      });
      dish.description = `${dish.description} (🌾 100% Grain-Free)`;
    }

    // Huevo
    if (hasAllergen(dishText, ['huevo'])) {
      dish.ingredients = dish.ingredients.map(ing => {
        if (/huevo|cáscara de huevo/gi.test(ing.name)) {
          return { ...ing, name: isEn ? 'Pure mineral calcium carbonate (Egg-Free)' : 'Carbonato cálcico mineral puro (sin huevo)' };
        }
        return ing;
      });
    }
  };

  checkAndSubstituteDish(modifiedDish1);
  checkAndSubstituteDish(modifiedDish2);

  // Check snacks
  const checkAndSubstituteSnack = (snack: DailySnackItem) => {
    if (hasAllergen(`${snack.title} ${snack.description} ${snack.ingredients.join(' ')}`, ['pollo'])) {
      snack.title = snack.title.replace(/pollo|chicken/gi, isEn ? 'Turkey' : 'Pavo');
      snack.ingredients = snack.ingredients.map(ing => ing.replace(/pollo|chicken/gi, isEn ? 'Turkey' : 'Pechuga de pavo'));
    }
    if (hasAllergen(`${snack.title} ${snack.description} ${snack.ingredients.join(' ')}`, ['ternera'])) {
      snack.title = snack.title.replace(/ternera|beef/gi, isEn ? 'Duck' : 'Pato');
      snack.ingredients = snack.ingredients.map(ing => ing.replace(/ternera|beef/gi, isEn ? 'Duck' : 'Pato'));
    }
    if (hasAllergen(`${snack.title} ${snack.description} ${snack.ingredients.join(' ')}`, ['pescado'])) {
      snack.title = snack.title.replace(/pescado|fish|salmón|salmon/gi, isEn ? 'Duck' : 'Pato crujiente');
      snack.ingredients = snack.ingredients.map(ing => ing.replace(/pescado|salmón/gi, isEn ? 'Duck' : 'Pato'));
    }
    if (hasAllergen(`${snack.title} ${snack.ingredients.join(' ')}`, ['huevo'])) {
      snack.title = isEn ? 'Dehydrated Duck & Apple Bites' : 'Bocaditos de Pato & Manzana';
      snack.ingredients = [isEn ? 'Duck breast' : 'Pechuga de pato', isEn ? 'Apple' : 'Manzana'];
    }
  };

  checkAndSubstituteSnack(modifiedSnack1);
  checkAndSubstituteSnack(modifiedSnack2);

  // Check desserts (especially dairy & broth)
  const checkAndSubstituteDessert = (dessert: DailyDessertItem) => {
    if (hasAllergen(`${dessert.title} ${dessert.description} ${dessert.ingredients.join(' ')}`, ['lacteos'])) {
      dessert.title = isEn ? 'Roasted Pumpkin Puree with Chia Gel & Bone Broth' : 'Puré de Calabaza Asada con Semillas de Chía & Caldo';
      dessert.description = isEn 
        ? '100% dairy-free, hypoallergenic gut-soothing digestive puree.' 
        : 'Postre 100% libre de lácteos, hipoalergénico y reconfortante para la microbiota digestiva.';
      dessert.benefits = isEn ? 'Anti-inflammatory intestinal comfort without lactose.' : 'Alivio antiinflamatorio intestinal 100% libre de lactosa.';
      dessert.ingredients = isEn 
        ? ['Roasted sweet pumpkin', 'Activated chia gel', 'Purified bone broth']
        : ['Puré de calabaza dulce asada', 'Gel de chía hidratada', 'Caldo de huesos clarificado'];
    }
    if (hasAllergen(`${dessert.ingredients.join(' ')}`, ['pollo'])) {
      dessert.ingredients = dessert.ingredients.map(ing => ing.replace(/pollo/gi, 'pavo o ternera'));
    }
  };

  checkAndSubstituteDessert(modifiedDessert1);
  checkAndSubstituteDessert(modifiedDessert2);

  const allergyTag = isEn
    ? `🛡️ 100% Allergen-Free for ${pet.name}: Excluded [${allergens.join(', ')}]`
    : `🛡️ 100% Libre de Alérgenos para ${pet.name}: Excluido [${allergens.join(', ')}]`;

  return {
    ...dayPlan,
    dish1: modifiedDish1,
    dish2: modifiedDish2,
    snack1: modifiedSnack1,
    snack2: modifiedSnack2,
    dessert1: modifiedDessert1,
    dessert2: modifiedDessert2,
    allergyAdaptationNote: allergyTag,
  };
}

/**
 * Helper to fetch a single day's diet plan adapted to the pet
 */
export function generateDailyDietPlan(pet: Pet, dateStr: string, dayIndex: number, language: 'es' | 'en' = 'es'): DayDietPlan {
  const weekly = generateWeeklyDietPlan(pet, language);
  const normalizedIndex = ((dayIndex % 7) + 7) % 7;
  return weekly[normalizedIndex] || weekly[0];
}
