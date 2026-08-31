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

    const ai = getGeminiClient();
    const isEn = language === "en";

    let systemInstruction = isEn
      ? `You are "NutriAI", the veterinary clinical nutrition assistant of "Homemade Pet Recipes" (Recetas caseras para mascotas).
Your tone is warm, professional, empathetic, and scientifically authoritative in animal nutrition.
Respond always in clear English structured with bold titles, clean bullet points, and practical veterinary advice.

Veterinary Principles:
1. Species-specific precision nutrition (Dogs are adapted omnivores; Cats are obligate carnivores needing taurine, arachidonic acid, and high protein).
2. Energy formulas: RER = 70 * (weight_kg^0.75) and MER multipliers (growth, maintenance, neutered, pathologies).
3. Strict toxicological safety: Immediately warn if toxic foods (onions, garlic, grapes, raisins, chocolate, xylitol, cooked bones, macadamias, etc.) are mentioned.
4. For clinical conditions (renal, joint, weight loss, IBD/sensitive digestion, allergies), adapt recipes with low phosphorus, EPA/DHA omega-3, prebiotic fiber, natural collagen bone broths, or novel proteins.
5. Always include a brief friendly deontological note that for severe medical conditions or sudden therapeutic shifts, the attending veterinarian should be consulted.`
      : `Eres "NutriIA", el asistente de nutrición clínica veterinaria y cocina casera de "Recetas caseras para mascotas".
Tu tono es cálido, profesional, empático y de máxima solvencia científica veterinaria.
Respondes siempre en un español claro, cercano y estructurado con orden (usando títulos en negrita, viñetas y consejos prácticos).

Tus principios veterinarios:
1. Nutrición de precisión según especie (Perro o Gato - recuerda que los gatos son carnívoros estrictos y requieren taurina, ácido araquidónico y alta proteína; los perros son omnívoros adaptados).
2. Fórmulas de energía: RER = 70 * (peso_kg^0.75) y factores MER (crecimiento, mantenimiento, esterilización, patologías).
3. Seguridad toxicológica estricta: Advierte inmediatamente si el usuario menciona alimentos tóxicos (cebolla, ajo, uvas, pasas, chocolate, xilitol, huesos cocidos, etc.).
4. Si hay condiciones clínicas (renal, articular, sobrepeso, digestión sensible, alergias), adapta las pautas con base en restricción de fósforo, omega-3 (EPA/DHA), fibra prebiótica, caldos ricos en colágeno natural, o fuentes de proteína nobel.
5. Siempre incluye un aviso deontológico amigable recordando que para diagnósticos graves o cambios terapéuticos agudos se debe consultar al médico veterinario tratante.`;

    if (petContext) {
      systemInstruction += isEn
        ? `\n\nCURRENT PET CONTEXT:
- Name: ${petContext.name || "Pet"}
- Species: ${petContext.species === "cat" ? "Cat" : "Dog"}
- Breed: ${petContext.breed || "Mixed breed"}
- Age: ${petContext.ageYears || "Adult"} years
- Current Weight: ${petContext.weightKg} kg (Target ideal weight: ${petContext.targetWeightKg || petContext.weightKg} kg)
- Neutered/Spayed: ${petContext.isNeutered ? "Yes" : "No"}
- Clinical Condition/Goal: ${petContext.clinicalCondition || "Healthy / Maintenance"}
- Calculated RER: ${Math.round(70 * Math.pow(petContext.weightKg || 5, 0.75))} kcal/day
- Target recommended daily energy: ${petContext.dailyKcalTarget || "Standard"} kcal/day (~${petContext.dailyFoodGrams || "N/A"} g fresh homemade food/day)
- Known Allergies: ${petContext.allergies || "None"}`
        : `\n\nDATOS DE LA MASCOTA ACTUAL:
- Nombre: ${petContext.name || "Mascota"}
- Especie: ${petContext.species === "cat" ? "Gato" : "Perro"}
- Raza: ${petContext.breed || "Mestizo"}
- Edad: ${petContext.ageYears || "Adulto"} años
- Peso actual: ${petContext.weightKg} kg (Peso ideal meta: ${petContext.targetWeightKg || petContext.weightKg} kg)
- Esterilizado: ${petContext.isNeutered ? "Sí" : "No"}
- Condición de salud/Restricción: ${petContext.clinicalCondition || "Sano / Mantenimiento"}
- RER calculado: ${Math.round(70 * Math.pow(petContext.weightKg || 5, 0.75))} kcal/día
- Ingesta calórica objetivo recomendada: ${petContext.dailyKcalTarget || "Estándar"} kcal/día (~${petContext.dailyFoodGrams || "N/A"} g comida casera/día)
- Alergias declaradas: ${petContext.allergies || "Ninguna"}`;
    }

    // Build prompt with history
    let contents = message;
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const formattedHistory = conversationHistory
        .slice(-6)
        .map((h: { role: string; content: string }) => `${h.role === "user" ? (isEn ? "User" : "Usuario") : "NutriAI"}: ${h.content}`)
        .join("\n\n");
      contents = `${isEn ? "CONVERSATION HISTORY" : "HISTORIAL DE LA CONVERSACIÓN"}:\n${formattedHistory}\n\n${isEn ? "NEW USER QUERY" : "NUEVA CONSULTA DEL USUARIO"}:\n${message}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const reply = response.text || (isEn ? "Sorry, could not process the answer at this time." : "Disculpa, no he podido procesar la respuesta en este momento.");
    return res.json({ reply });
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
    const { pet, preferences, availableIngredients, language = "es" } = req.body;
    const ai = getGeminiClient();
    const isEn = language === "en";

    const prompt = isEn
      ? `Create a balanced veterinary homemade recipe for the following pet:
- Species: ${pet?.species === "cat" ? "Cat" : "Dog"}
- Name: ${pet?.name || "Pet"}
- Weight: ${pet?.weightKg || 10} kg
- Condition / Objective: ${pet?.clinicalCondition || "General health & longevity"}
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
- Condición / Objetivo: ${pet?.clinicalCondition || "Salud general"}
- Preferencias / Ingredientes disponibles: ${availableIngredients || preferences || "Ingredientes frescos del mercado"}

Genera una receta balanceada con:
1. Nombre claro y apetitoso de la receta.
2. Porciones y calorías exactas para 1 día (${pet?.weightKg || 10}kg).
3. Lista de ingredientes en gramos precisos con balance proteico, vegetales seguros y fuentes de calcio/grasas saludables.
4. Pasos de cocción a fuego lento / vapor preservando nutrientes.
5. Beneficios clínicos y notas de conservación.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: isEn 
          ? "You are a Veterinary Nutritionist specialized in animal clinical nutrition and natural homemade feeding." 
          : "Eres un Nutricionista Veterinario especializado en nutrición clínica animal y alimentación natural casera.",
      },
    });

    return res.json({ recipeText: response.text });
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
