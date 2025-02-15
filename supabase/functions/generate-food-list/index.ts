
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
      region,
      availableFoods,
      economicAlternatives,
      currencyInfo
    } = await req.json()

    const prompt = `En tant que nutritionniste expert, génère une liste d'aliments adaptée à ce profil et basée sur les aliments traditionnels de la région ${region} :
    - Âge : ${age} ans
    - Poids : ${weight} kg
    - Taille : ${height} cm
    - Niveau d'activité : ${activityLevel}
    - Objectif : ${goal}
    - Allergies : ${allergies.join(', ')}
    - Budget mensuel : ${budget} ${currencyInfo.currencySymbol}
    - Région : ${region}
    - Devise locale : ${currencyInfo.currencySymbol} (${currencyInfo.currencyCode})
    - Besoins quotidiens :
      * Calories : ${macroTargets.calories} kcal
      * Protéines : ${macroTargets.protein}g
      * Glucides : ${macroTargets.carbs}g
      * Lipides : ${macroTargets.fats}g

    Liste des aliments disponibles :
    ${JSON.stringify(availableFoods)}

    Alternatives économiques disponibles :
    ${JSON.stringify(economicAlternatives)}

    Retourne exactement 15 aliments au format JSON stringifié, avec la structure suivante pour chaque aliment :
    {
      "name": string,
      "category": string (une des catégories : "Protéines", "Céréales", "Légumineuses", "Matières grasses"),
      "pricePerKg": number,
      "localPricePerKg": number,
      "macros": {
        "caloriesPer100g": number,
        "proteinPer100g": number,
        "carbsPer100g": number,
        "fatsPer100g": number
      },
      "allergenes": string[],
      "region": string
    }

    Ne retourne que le tableau JSON, pas de commentaires ni d'explications. Assure-toi que c'est un JSON valide.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
      console.error("Erreur lors du parsing de la réponse:", e)
      console.log("Réponse brute:", data.choices[0].message.content)
      
      // Essayer de nettoyer la réponse en enlevant tout ce qui n'est pas entre crochets
      const jsonMatch = data.choices[0].message.content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        try {
          foodList = JSON.parse(jsonMatch[0])
        } catch (e2) {
          console.error("Erreur lors du second parsing:", e2)
          throw new Error("Format de réponse invalide")
        }
      } else {
        throw new Error("Impossible de trouver un JSON valide dans la réponse")
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
