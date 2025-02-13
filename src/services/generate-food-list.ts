
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      age, 
      weight, 
      height, 
      activityLevel, 
      goal, 
      allergies, 
      budget,
      macroTargets 
    } = await req.json();

    const prompt = `En tant que nutritionniste expert, génère une liste d'aliments adaptée à ce profil :
    - Âge : ${age} ans
    - Poids : ${weight} kg
    - Taille : ${height} cm
    - Niveau d'activité : ${activityLevel}
    - Objectif : ${goal}
    - Allergies : ${allergies.join(', ')}
    - Budget mensuel : ${budget}€
    - Besoins quotidiens :
      * Calories : ${macroTargets.calories} kcal
      * Protéines : ${macroTargets.protein}g
      * Glucides : ${macroTargets.carbs}g
      * Lipides : ${macroTargets.fats}g

    Retourne une liste d'aliments au format JSON avec cette structure exacte pour chaque aliment :
    {
      name: string,
      category: string (une des catégories suivantes : "Protéines", "Céréales", "Légumineuses", "Matières grasses", "Produits laitiers", "Oléagineux"),
      pricePerKg: number (prix moyen au kilo en euros),
      macros: {
        caloriesPer100g: number,
        proteinPer100g: number,
        carbsPer100g: number,
        fatsPer100g: number
      },
      allergenes: string[] (liste des allergènes potentiels)
    }

    Inclure uniquement des aliments qui :
    1. Respectent les contraintes d'allergies mentionnées
    2. Sont adaptés au budget indiqué
    3. Aident à atteindre les objectifs nutritionnels
    4. Sont facilement trouvables en supermarché

    Retourne exactement 15 aliments.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: "Tu es un expert en nutrition qui génère des listes d'aliments personnalisées au format JSON." },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    let foodList;
    
    try {
      foodList = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      // Si le parsing JSON échoue, on utilise une regex pour extraire le JSON
      const jsonMatch = data.choices[0].message.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        foodList = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Impossible de parser la réponse en JSON");
      }
    }

    return new Response(JSON.stringify({ foodList }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
