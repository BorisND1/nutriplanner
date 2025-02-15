
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
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
      macroTargets,
      region
    } = await req.json()

    const prompt = `En tant que nutritionniste expert, génère une liste d'aliments adaptée à ce profil et basée sur les aliments traditionnels de la région ${region} :
    - Âge : ${age} ans
    - Poids : ${weight} kg
    - Taille : ${height} cm
    - Niveau d'activité : ${activityLevel}
    - Objectif : ${goal}
    - Allergies : ${allergies.join(', ')}
    - Budget mensuel : ${budget}€
    - Région : ${region}
    - Besoins quotidiens :
      * Calories : ${macroTargets.calories} kcal
      * Protéines : ${macroTargets.protein}g
      * Glucides : ${macroTargets.carbs}g
      * Lipides : ${macroTargets.fats}g

    Privilégie les aliments traditionnels et facilement disponibles dans la région ${region}.
    Prends en compte les habitudes alimentaires locales et les préférences culturelles de la région.
    
    Retourne une liste d'aliments au format JSON avec cette structure exacte pour chaque aliment :
    {
      name: string,
      category: string (une des catégories suivantes : "Protéines", "Céréales", "Légumineuses", "Matières grasses", "Produits laitiers", "Oléagineux", "Fruits", "Légumes"),
      pricePerKg: number (prix moyen au kilo en euros),
      macros: {
        caloriesPer100g: number,
        proteinPer100g: number,
        carbsPer100g: number,
        fatsPer100g: number
      },
      allergenes: string[],
      region: string
    }

    Inclure uniquement des aliments qui :
    1. Respectent les contraintes d'allergies mentionnées
    2. Sont adaptés au budget indiqué
    3. Aident à atteindre les objectifs nutritionnels
    4. Sont facilement trouvables dans la région ${region}
    5. Sont culturellement appropriés pour la région
    6. Proviennent principalement de notre base de données d'aliments régionaux

    Retourne exactement 15 aliments typiques de la région.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: "Tu es un expert en nutrition qui génère des listes d'aliments personnalisées au format JSON, spécialisé dans les régimes alimentaires régionaux et traditionnels." },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    let foodList

    try {
      foodList = JSON.parse(data.choices[0].message.content)
    } catch (e) {
      const jsonMatch = data.choices[0].message.content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        foodList = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Impossible de parser la réponse en JSON")
      }
    }

    return new Response(JSON.stringify({ foodList }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
