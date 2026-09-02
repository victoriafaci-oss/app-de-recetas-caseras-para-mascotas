import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Resilient Gemini model cascade
const GEMINI_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.1-pro-preview",
];

async function callGeminiCascade(contents: string, systemInstruction?: string): Promise<string> {
  const ai = getGeminiClient();
  let lastErr: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      if (response && response.text && response.text.trim().length > 0) {
        return response.text;
      }
    } catch (err: any) {
      lastErr = err;
      console.warn(`[Gemini API] Model ${model} request failed:`, err.message);
    }
  }

  throw lastErr || new Error("All Gemini models were unavailable.");
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Recetas Caseras para Mascotas Server" });
});

// AI Concierge Chat endpoint
app.post("/api/nutri-chat", async (req, res) => {
  try {
    const { message, petContext, conversationHistory, language = "es" } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const isEn = language === "en";
    const apiKey = process.env.GEMINI_API_KEY;

    // If API Key is available, invoke Gemini Cascade
    if (apiKey && apiKey.trim().length > 0 && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        let systemInstruction = isEn
          ? `You are "NutriAI & Pet Concierge", a veterinary clinical assistant and pet care expert in "Homemade Pet Recipes & Pet Care".

MANDATORY DIRECT RESPONSE RULES:
1. DIRECT ANSWER FIRST: Respond IMMEDIATELY and directly to the user's specific question or problem in the very first sentence. Never make the user ask twice or confirm before answering.
2. DO NOT DUMP PET PROFILE STATS: Do NOT list or recite the pet's bio, weight, age, calorie formulas, or medical record unless the user specifically asked for portion calculations or weight analysis.
3. CONCRETE ACTIONABLE ADVICE: When asked "what should I do if my pet did X", "can my dog eat Y", "how to train Z", or health/hygiene questions, provide immediate step-by-step instructions, danger triage, dos and don'ts, and practical solutions.
4. Structure responses with clear bold headings and concise bullet points.`
          : `Eres "NutriIA & Pet Concierge", asistente clínico veterinario y experto en cuidado de mascotas de "Recetas caseras para mascotas".

REGLAS OBLIGATORIAS DE RESPUESTA DIRECTA:
1. RESPUESTA DIRECTA DESDE LA PRIMERA LÍNEA: Responde DE INMEDIATO y de forma concreta a la pregunta, duda o situación planteada por el usuario en el primer párrafo. NUNCA hagas que el usuario tenga que repetir la pregunta ni respondas con un mensaje evasivo o introductorio sin solucionar la duda.
2. NO REPITAS LA FICHA NI LOS DATOS GENERALES: Está TERMINANTEMENTE PROHIBIDO volcar o listar la ficha, peso, edad, calorías (RER/MER) o perfil de la mascota a menos que el usuario haya preguntado explícitamente cuánto debe comer o calcular raciones.
3. CONSEJOS Y SOLUCIONES PRÁCTICAS PASO A PASO: Ante preguntas de "¿qué hago si mi perro se comió X?", "¿qué alimentos puede comer?", "¿cómo solucionar una conducta?", o dudas de salud/higiene, entrega de inmediato las soluciones exactas, pasos a seguir, qué hacer, qué evitar y signos de alarma.
4. Estructura la respuesta con títulos claros en negrita, viñetas y pasos numerados fáciles de aplicar.`;

        if (petContext) {
          systemInstruction += isEn
            ? `\n\n(Context: Pet is ${petContext.species === "cat" ? "Cat" : "Dog"} named "${petContext.name || "Pet"}", ${petContext.weightKg || 10}kg${petContext.allergies ? `, Allergies: ${petContext.allergies}` : ""}. Tailor your advice to this species/breed/weight without reciting these stats).`
            : `\n\n(Contexto interno: La mascota es un ${petContext.species === "cat" ? "Gato" : "Perro"} llamado "${petContext.name || "Mascota"}", de ${petContext.weightKg || 10}kg${petContext.allergies ? `, Alergias: ${petContext.allergies}` : ""}. Adapta tus consejos y dosis a esta especie y tamaño sin recitar estos datos al inicio).`;
        }

        // Build prompt with history
        let promptContent = message;
        if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          const formattedHistory = conversationHistory
            .slice(-6)
            .map((h: { role: string; content: string }) => `${h.role === "user" ? (isEn ? "User" : "Usuario") : "NutriAI"}: ${h.content}`)
            .join("\n\n");
          promptContent = `${isEn ? "CONVERSATION HISTORY" : "HISTORIAL PREVIO"}:\n${formattedHistory}\n\n${isEn ? "CURRENT USER QUESTION / SITUATION" : "PREGUNTA O SITUACIÓN ACTUAL DEL USUARIO"}:\n${message}`;
        }

        const reply = await callGeminiCascade(promptContent, systemInstruction);
        if (reply) {
          return res.json({ reply });
        }
      } catch (geminiErr: any) {
        console.warn("Gemini cascade warning, using intelligent local engine:", geminiErr.message);
      }
    }

    // High-precision veterinary knowledge engine (Fallback)
    const petName = petContext?.name || (isEn ? "your pet" : "tu mascota");
    const petSpecies = petContext?.species === "cat" ? (isEn ? "cat" : "gato") : (isEn ? "dog" : "perro");
    const petWeight = petContext?.weightKg || 10;
    const rer = Math.round(70 * Math.pow(petWeight, 0.75));
    const lowerMsg = message.toLowerCase();

    let fallbackReply = "";

    // 1. Ingested foreign object / strange food / accident
    if (lowerMsg.includes("comio") || lowerMsg.includes("comió") || lowerMsg.includes("trago") || lowerMsg.includes("tragó") || lowerMsg.includes("ingerio") || lowerMsg.includes("ingerió") || lowerMsg.includes("ate") || lowerMsg.includes("swallowed") || lowerMsg.includes("calcetin") || lowerMsg.includes("calcetín") || lowerMsg.includes("juguete") || lowerMsg.includes("plastico") || lowerMsg.includes("plástico") || lowerMsg.includes("planta")) {
      fallbackReply = isEn
        ? `### 🚨 Guidance: What to Do If ${petName} Ingested Something

**1. Immediate Assessment:**
- **Do NOT induce vomiting** without veterinary instruction, especially if the object was sharp, caustic, or a bone (it can cause esophageal tearing coming back up).
- Check ${petName}'s airway: Ensure there is no active choking, coughing, or pale/blue gums.

**2. Step-by-Step Action Plan:**
1. **Identify the Item & Quantity:** Determine exactly what was eaten, how long ago, and if it could contain toxic elements or batteries.
2. **Watch for Blockage Signs:** Persistent gagging, vomiting, abdominal tenderness, lack of appetite, or inability to pass stool.
3. **Veterinary Action:** If it was within the last 1–2 hours, a veterinarian can safely induce vomiting via clinical medication (*apomorphine* for dogs) before it enters the intestine.

*If ${petName} displays lethargy, swelling, or distress, visit an emergency veterinary clinic immediately.*`
        : `### 🚨 Protocolo de Actuación: Si ${petName} ha comido o ingerido algo extraño

**1. Regla de Oro Inmediata:**
- **NO induzcas el vómito por tu cuenta** sin indicación veterinaria expresa (nunca uses sal ni agua oxigenada casera, y menos si es un objeto punzante, plástico duro o hueso, ya que puede desgarrar el esófago al subir).
- Revisa que ${petName} no tenga obstrucción de vías respiratorias y que sus encías tengan buen color rosado.

**2. Pasos a Seguir Ahora Mismo:**
1. **Identifica el material y la hora:** Determina con exactitud qué se ha comido, la cantidad y hace cuánto tiempo (la ventana para actuar en clínica antes de que pase al intestino suele ser de 1 a 2 horas).
2. **Vigilancia de signos de obstrucción:** Vómitos repetidos, intentos fallidos de defecar, abdomen tenso o quejidos al tocarle la tripa.
3. **Consulta de Urgencia:** Llama a tu centro veterinario. Si fue reciente, ellos pueden inducir el vómito de forma segura y controlada con medicación veterinaria (*apomorfina*).

*Si observas decaimiento repentino, dolor abdominal o vómitos, acude a urgencias veterinarias de inmediato.*`;

    // 2. Not eating / Inappetence
    } else if (lowerMsg.includes("no come") || lowerMsg.includes("no quiere comer") || lowerMsg.includes("inapetente") || lowerMsg.includes("apetito") || lowerMsg.includes("not eating") || lowerMsg.includes("refuses food")) {
      fallbackReply = isEn
        ? `### 🥣 Solutions for Inappetence & Lack of Appetite in ${petName}

**1. Identify Potential Causes:**
- Dental pain or inflamed gums.
- Flavor fatigue from dry processed food.
- Mild gastrointestinal discomfort or stress/routine change.

**2. Practical Home Appetizers:**
1. **Warm Bone Broth:** Add 2–3 tablespoons of lukewarm, unseasoned homemade bone broth over the food to release appealing aromas.
2. **Gentle Warming:** Heat the food slightly (lukewarm, ~37°C) to stimulate olfactory interest.
3. **Palatable Topper:** Add a teaspoon of pureed pumpkin, a pinch of scrambled egg, or cooked turkey shreds.

*⚠️ Clinical Rule: If a cat does not eat for >24 hours (risk of hepatic lipidosis) or a dog for >48 hours with lethargy, consult your veterinarian.*`
        : `### 🥣 Soluciones y Consejos si ${petName} no quiere comer

**1. Causas más Frecuentes:**
- Molestias bucodentales (sarro o encías sensibles).
- Aburrimiento del pienso seco o cambio brusco de alimento.
- Malestar digestivo leve o estrés por cambios en el entorno.

**2. Estrategias Prácticas para Estimular el Apetito:**
1. **Aroma Térmico:** Templar la comida unos segundos para que emita olores atractivos (los animales comen principalmente por el olfato).
2. **Añadir Caldo de Huesos Tibio:** Verter 2–3 cucharadas de caldo de huesos rico en colágeno (sin sal ni cebolla) sobre su comida.
3. **Topping Natural Palatable:** Añadir unos trocitos de pechuga de pavo cocida, una cucharadita de calabaza asada o un poco de huevo revuelto.

*⚠️ Alerta: Si un gato pasa más de 24 horas sin comer (riesgo de lipidosis hepática) o un perro más de 48 horas acompañado de decaimiento, debe ser evaluado por un veterinario.*`;

    // 3. Behavior / Training / Barking / Biting / Anxiety
    } else if (lowerMsg.includes("ansiedad") || lowerMsg.includes("ladra") || lowerMsg.includes("muerde") || lowerMsg.includes("comportamiento") || lowerMsg.includes("etologia") || lowerMsg.includes("adiestra") || lowerMsg.includes("educar") || lowerMsg.includes("correa") || lowerMsg.includes("bark") || lowerMsg.includes("anxiety") || lowerMsg.includes("behavior") || lowerMsg.includes("train") || lowerMsg.includes("leash")) {
      fallbackReply = isEn
        ? `### 🐾 Ethology & Behavior Solutions for ${petName}

**1. Practical Training & Calm Protocol:**
- **Positive Reinforcement Only:** Reward desired calm behaviors with small healthy treats (e.g. boiled turkey cubes) within 2 seconds of the good action. Never use physical punishment, which increases cortisol and defensive anxiety.
- **Leash Walking:** If pulling on the leash, immediately stop moving like a tree. Only resume walking when the leash loosens.
- **Mental Tire-Out:** 15 minutes of sniffing games (snuffle mats, hiding kibble in cardboard boxes) exhausts cognitive energy more than a 1-hour fast run.

**2. For Separation Anxiety:**
- Practice departures of 1 to 5 minutes without high-energy goodbyes.
- Provide a frozen lick-mat or Kong with bone broth before stepping out.`
        : `### 🐾 Consejos de Comportamiento y Soluciones para ${petName}

**1. Pautas de Educación y Modificación de Conducta:**
- **Refuerzo Positivo Inmediato:** Premia la calma y las conductas correctas en los primeros 2 segundos con un trocito de pavo cocido o una caricia tranquila. Evita reñir a posteriori, ya que solo genera confusión y estrés.
- **Paseos sin Tirones:** Si tira de la correa, quédate completamente quieto ("modo árbol"). Vuelve a avanzar únicamente cuando la correa esté destensada.
- **Cansancio Cognitivo:** 15 minutos de juegos de olfato (alfombras olfativas o buscar comida escondida) relajan el sistema nervioso mucho más que correr una hora.

**2. Si es Ansiedad o Nerviosismo:**
- Desensibiliza las llaves y la puerta haciendo salidas falsas de 2 minutos sin despedidas efusivas.
- Déjale un juguete rellenable congelado con caldo de huesos para fomentar el lamido relajante.`;

    // 4. Safe fruits, vegetables and permitted treats
    } else if (lowerMsg.includes("fruta") || lowerMsg.includes("verdura") || lowerMsg.includes("premio") || lowerMsg.includes("snack") || lowerMsg.includes("manzana") || lowerMsg.includes("platano") || lowerMsg.includes("plátano") || lowerMsg.includes("fruit") || lowerMsg.includes("vegetable")) {
      fallbackReply = isEn
        ? `### 🍎 Safe Fruits, Vegetables & Treats for ${petName}

**✅ Safe & Healthy Treats:**
- **Apple & Pear:** Excellent fiber (ALWAYS remove core and seeds, which contain trace cyanogenic glycosides).
- **Blueberries & Strawberries:** Packed with antioxidants and polyphenols.
- **Cooked Pumpkin & Zucchini:** Superb for digestive regulation and gut motility.
- **Carrot Sticks:** Great for mechanical dental cleaning and low in calories.
- **Watermelon & Melon:** Highly hydrating in summer (remove all black seeds and rind).

**🚫 STRICTLY FORBIDDEN:** Grapes, raisins, avocado, onions, garlic, and macadamia nuts.`
        : `### 🍎 Frutas, Verduras y Premios Seguros para ${petName}

**✅ Alimentos Saludables Permitidos (con moderación ~10% de la dieta):**
- **Manzana y Pera:** Ricas en fibra y vitamina C (siempre sin semillas ni corazón).
- **Arándanos y Fresas:** Potentes antioxidantes antiinflamatorios.
- **Calabaza y Calabacín cocidos:** Ideales para regular el tránsito intestinal y saciar.
- **Zanahoria cruda o al vapor:** Excelente snack crujiente bajo en calorías que ayuda a limpiar los dientes.
- **Sandía y Melón:** Muy refrescantes e hidratantes en días calurosos (sin semillas ni cáscara).

**🚫 PROHIBIDOS:** Uvas, pasas, aguacate, cebolla, ajo y huesos cocidos.`;

    // 5. Hygiene, Baths, Nails, Ears
    } else if (lowerMsg.includes("baño") || lowerMsg.includes("bañar") || lowerMsg.includes("higiene") || lowerMsg.includes("uña") || lowerMsg.includes("oido") || lowerMsg.includes("oreja") || lowerMsg.includes("diente") || lowerMsg.includes("sarro") || lowerMsg.includes("bath") || lowerMsg.includes("groom") || lowerMsg.includes("nail") || lowerMsg.includes("teeth")) {
      fallbackReply = isEn
        ? `### 🛁 Hygiene & Grooming Protocol for ${petName}

**1. Bathing Guidelines:**
- Bathe every 4 to 8 weeks using a pet-specific neutral pH shampoo (~7.0). Human shampoos damage the canine/feline skin barrier.
**2. Ear & Dental Care:**
- Clean ears monthly using veterinary otic solution and a gentle gauze (never Q-tips into the canal).
- Brush teeth 3x weekly with enzymatic pet toothpaste (never human fluoride toothpaste).
**3. Safe Nail Trimming:**
- Cut only the curved white/translucent tip at a 45-degree angle, staying clear of the internal pink blood vessel (*quick*).`
        : `### 🛁 Guía de Higiene y Cuidados para ${petName}

**1. Baño y Piel:**
- Bañar cada 4 a 8 semanas con champú veterinario de pH neutro (~7.0). Los champús humanos irritan y resecan su piel.
**2. Limpieza de Oídos y Dientes:**
- Limpiar las orejas con un limpiador auricular ótico específico y gasa suave (nunca introducir bastoncillos en el canal).
- Cepillar dientes con pasta enzimática para mascotas (nunca usar pasta dental humana con flúor).
**3. Corte de Uñas Seguro:**
- Cortar solo la punta curvada transparente a 45º, dejando un margen de seguridad de 2-3 mm antes de la vena rosada interior.`;

    // 6. Gastrointestinal, Diarrhea, Vomiting
    } else if (lowerMsg.includes("vomit") || lowerMsg.includes("diarrea") || lowerMsg.includes("suelta") || lowerMsg.includes("blanda") || lowerMsg.includes("caca") || lowerMsg.includes("pancita") || lowerMsg.includes("estomago") || lowerMsg.includes("sick") || lowerMsg.includes("diarrhea") || lowerMsg.includes("vomit")) {
      fallbackReply = isEn
        ? `### 🩺 Home Protocol for Mild Digestive Upset in ${petName}

**1. Immediate 24h Bland Diet:**
- **Protein (60%):** Boiled skinless, boneless chicken or turkey breast.
- **Fiber (40%):** Steamed pure pumpkin mash or well-cooked white rice.
- Feed small portions 3–4 times throughout the day instead of large meals.

**2. Hydration Support:**
- Offer small sips of lukewarm homemade bone broth to restore electrolytes.

*⚠️ Consult your vet immediately if there is fever, blood in stool, severe lethargy, or if symptoms last >24 hours.*`
        : `### 🩺 Pauta para Molestias Digestivas y Diarrea Leve en ${petName}

**1. Dieta Blanda de Recuperación (24–48 horas):**
- **60% Pechuga de Pavo o Pollo:** Hervida en agua sin sal, sin piel y desmenuzada.
- **40% Puré de Calabaza suave o Arroz blanco muy cocido:** Aporta fibra soluble que absorbe el exceso de agua en el colon.
- Ofrecer en 3 o 4 tomas pequeñas a lo largo del día para no sobrecargar el estómago.

**2. Hidratación:**
- Mantener agua fresca disponible y ofrecer pequeños sorbos de caldo de huesos templado para reponer electrolitos.

*⚠️ Acudir al veterinario si hay sangre en las heces, vómitos continuos o decaimiento marcado.*`;

    // 7. General question resolution with clear guidance
    } else {
      fallbackReply = isEn
        ? `### 🐾 Veterinary Care & Practical Solutions for ${petName}

Thank you for your question regarding **${petName}** (${petSpecies}, ${petWeight} kg).

**Key Solutions & Recommendations:**
1. **Direct Care Approach:** For ${petSpecies}s, sudden changes or routines should be addressed gradually over 5–7 days with positive reinforcement.
2. **Balanced Nutrition:** Maintain high-quality steamed lean proteins, prebiotic vegetables (pumpkin/zucchini), and natural omega-3 fatty acids for immune strength.
3. **Daily Well-being:** Ensure active enrichment (olfactory stimulation, interactive games) to keep ${petName} physically and mentally balanced.

*Feel free to ask more details about training, specific recipes, health symptoms, or emergency care!*`
        : `### 🐾 Respuestas y Consejos Prácticos para ${petName}

He analizado tu consulta para **${petName}** (${petSpecies}, ${petWeight} kg).

**Recomendaciones y Soluciones Clave:**
1. **Pauta de Acción:** Para cualquier duda de manejo, alimentación o comportamiento en ${petSpecies}s, la consistencia y las transiciones graduales son la clave para evitar estrés digestivo o conductual.
2. **Nutrición Óptima:** Prioriza proteínas nobles cocinadas al vapor, fibra digestible (calabaza, calabacín) y un buen aporte de omega-3 (aceite de salmón) para proteger su salud articular y dérmica.
3. **Bienestar Diario:** Dedica al menos 15 minutos al día a juegos interactivos y estimulación olfativa para mantener a ${petName} equilibrado y feliz.

*¡Pregúntame cualquier duda concreta sobre adiestramiento, síntomas, qué hacer ante una situación puntual o recetas específicas!*`;
    }

    return res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error("Error in /api/nutri-chat:", error);
    return res.status(500).json({
      error: "Error communicating with NutriAI Concierge",
      details: error.message || "Unknown error",
    });
  }
});

// Custom AI Recipe Generator endpoint
app.post("/api/custom-recipe-ai", async (req, res) => {
  try {
    const { pet, goal, preferences, availableIngredients, language = "es" } = req.body;
    const isEn = language === "en";
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 0 && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        const prompt = isEn
          ? `Create a balanced veterinary homemade recipe for the following pet:
- Species: ${pet?.species === "cat" ? "Cat" : "Dog"}
- Name: ${pet?.name || "Pet"}
- Weight: ${pet?.weightKg || 10} kg
- Condition / Objective: ${goal || pet?.clinicalCondition || "General health & longevity"}
- Available or Preferred Ingredients: ${availableIngredients || preferences || "Fresh market ingredients"}

Generate a balanced recipe in English with:
1. Clear recipe name.
2. Exact portion and calories for 1 day (${pet?.weightKg || 10}kg).
3. List of ingredients with exact grams (healthy protein, safe vegetables, healthy fats & calcium/bone broth source).
4. Gentle cooking / steaming instructions preserving nutrients.
5. Clinical benefits and storage advice.`
          : `Crea una receta casera veterinaria equilibrada para la siguiente mascota:
- Especie: ${pet?.species === "cat" ? "Gato" : "Perro"}
- Nombre: ${pet?.name || "Mascota"}
- Peso: ${pet?.weightKg || 10} kg
- Condición / Objetivo: ${goal || pet?.clinicalCondition || "Salud general"}
- Preferencias / Ingredientes disponibles: ${availableIngredients || preferences || "Ingredientes frescos del mercado"}

Genera una receta balanceada con:
1. Nombre claro y apetitoso de la receta.
2. Porciones y calorías exactas para 1 día (${pet?.weightKg || 10}kg).
3. Lista de ingredientes en gramos precisos con balance proteico, vegetales seguros y fuentes de calcio/grasas saludables.
4. Pasos de cocción a fuego lento / vapor preservando nutrientes.
5. Beneficios clínicos y notas de conservación.`;

        const systemInstruction = isEn 
          ? "You are a Veterinary Nutritionist specialized in animal clinical nutrition and natural homemade feeding." 
          : "Eres un Nutricionista Veterinario especializado en nutrición clínica animal y alimentación natural casera.";

        const recipeText = await callGeminiCascade(prompt, systemInstruction);

        if (recipeText) {
          return res.json({ recipeText });
        }
      } catch (geminiErr: any) {
        console.warn("Gemini recipe AI error, deploying structured recipe builder:", geminiErr.message);
      }
    }

    // Fallback formula generator
    const petWeight = pet?.weightKg || 10;
    const petName = pet?.name || "Mascota";
    const rer = Math.round(70 * Math.pow(petWeight, 0.75));
    const mer = Math.round(rer * 1.5);
    const dailyGrams = Math.round(mer / 1.35);

    const recipeText = isEn
      ? `### 🥣 Custom Veterinary Recipe: Gourmet Medley for ${petName} (${petWeight} kg)

**Nutritional Target:** ${goal || "Longevity & Digestive Comfort"}  
**Daily Energy Target:** ~${mer} kcal/day (Total Daily Food: ~${dailyGrams}g)

#### 🥩 Ingredients for 1 Day:
- **${Math.round(dailyGrams * 0.65)}g** Boneless lean turkey or chicken breast (steamed)
- **${Math.round(dailyGrams * 0.20)}g** Steamed pumpkin or zucchini mash
- **${Math.round(dailyGrams * 0.10)}g** Well-cooked oats or steamed sweet potato
- **${Math.max(1, Math.round(dailyGrams * 0.01))} tsp** Pure wild salmon oil (Omega-3 EPA/DHA)
- **${(dailyGrams * 0.005).toFixed(1)}g** Micropulverized eggshell powder (bioavailable calcium)
- **40ml** Collagen rich bone broth (serve lukewarm)

#### 🍳 Preparation Method:
1. Steam the protein and vegetables gently to preserve vitamins.
2. Mix all ingredients once lukewarm.
3. Divide into 2 balanced meals (morning and evening).`
      : `### 🥣 Receta Veterinaria Personalizada: Guiso Noble para ${petName} (${petWeight} kg)

**Objetivo Terapéutico:** ${goal || "Salud general y bienestar digestivo"}  
**Aporte Calórico Calculado:** ~${mer} kcal/día (Ración fresca diaria: ~${dailyGrams}g)

#### 🥩 Ingredientes para 1 Día:
- **${Math.round(dailyGrams * 0.65)}g** Pechuga de pavo o pollo magro picado (cocinado al vapor)
- **${Math.round(dailyGrams * 0.20)}g** Puré de calabaza asada o calabacín suave
- **${Math.round(dailyGrams * 0.10)}g** Avena cocida o batata al vapor
- **${Math.max(1, Math.round(dailyGrams * 0.01))} cucharadita** Aceite de salmón salvaje (Omega-3 EPA/DHA)
- **${(dailyGrams * 0.005).toFixed(1)}g** Cáscara de huevo micropulverizada (calcio biodisponible)
- **40ml** Caldo de huesos con colágeno natural (servir tibio)

#### 🍳 Preparación Paso a Paso:
1. Cocinar las proteínas y verduras a fuego lento o al vapor para preservar los nutrientes esenciales.
2. Mezclar e integrar el aceite de salmón y el calcio una vez templado.
3. Dividir en 2 tomas equilibradas (50% en la mañana y 50% en la noche).`;

    return res.json({ recipeText });
  } catch (error: any) {
    console.error("Error in /api/custom-recipe-ai:", error);
    return res.status(500).json({ error: "Could not generate custom recipe", details: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NutriPet Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
