import { supabase } from "@/integrations/supabase/client";
import { generateMealSchedule, MealSchedule } from "./mealSchedule";

interface CurrencyInfo {
  currencyCode: string;
  currencySymbol: string;
  exchangeRateToEuro: number;
  exchange_rates_updated_at?: string;
}

interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface FoodItem {
  name: string;
  category: string;
  pricePerKg: number;
  localPricePerKg: number;
  macros: {
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatsPer100g: number;
  };
  allergenes: string[];
  region: string;
}

export const calculateDailyMacros = (
  weight: number,
  height: number,
  age: number,
  activityLevel: string,
  goal: string
): MacroTargets => {
  // Calcul BMR (Basal Metabolic Rate) avec l'équation de Mifflin-St Jeor
  let bmr = 10 * weight + 6.25 * height - 5 * age;

  // Facteur d'activité
  const activityFactors: { [key: string]: number } = {
    sedentaire: 1.2,
    leger: 1.375,
    modere: 1.55,
    actif: 1.725,
    tres_actif: 1.9
  };

  let tdee = bmr * activityFactors[activityLevel]; // Total Daily Energy Expenditure

  // Ajustement selon l'objectif
  const goalAdjustments: { [key: string]: number } = {
    prise_masse: 1.1, // +10% calories
    perte_poids: 0.8, // -20% calories
    seche: 0.85 // -15% calories
  };

  let targetCalories = tdee * goalAdjustments[goal];

  // Répartition des macronutriments selon l'objectif
  let proteinRatio, carbsRatio, fatsRatio;

  switch (goal) {
    case "prise_masse":
      proteinRatio = 0.25; // 25% des calories
      carbsRatio = 0.50; // 50% des calories
      fatsRatio = 0.25; // 25% des calories
      break;
    case "perte_poids":
      proteinRatio = 0.40; // 40% des calories
      carbsRatio = 0.35; // 35% des calories
      fatsRatio = 0.25; // 25% des calories
      break;
    case "seche":
      proteinRatio = 0.45; // 45% des calories
      carbsRatio = 0.30; // 30% des calories
      fatsRatio = 0.25; // 25% des calories
      break;
    default:
      proteinRatio = 0.30;
      carbsRatio = 0.40;
      fatsRatio = 0.30;
  }

  return {
    calories: Math.round(targetCalories),
    protein: Math.round((targetCalories * proteinRatio) / 4), // 4 calories par gramme de protéines
    carbs: Math.round((targetCalories * carbsRatio) / 4), // 4 calories par gramme de glucides
    fats: Math.round((targetCalories * fatsRatio) / 9) // 9 calories par gramme de lipides
  };
};

export const generateFoodRecommendations = (
  macroTargets: MacroTargets,
  allergies: string[],
  budget: number
): { 
  recommendations: FoodItem[];
  alternativesIfNeeded: FoodItem[];
} => {
  const foodDatabase: FoodItem[] = [];

  // Filtrer les aliments en fonction des allergies
  let availableFoods = foodDatabase.filter(food => 
    !food.allergenes.some(allergene => allergies.includes(allergene))
  );

  // Trier les aliments par rapport qualité/prix (protéines par euro)
  const sortedByValue = availableFoods.sort((a, b) => 
    (b.macros.proteinPer100g / b.pricePerKg) - (a.macros.proteinPer100g / a.pricePerKg)
  );

  const recommendations = {
    proteins: sortedByValue.filter(food => food.macros.proteinPer100g > 20).slice(0, 3),
    carbs: sortedByValue.filter(food => food.macros.carbsPer100g > 15).slice(0, 3),
    fats: sortedByValue.filter(food => food.macros.fatsPer100g > 10).slice(0, 2)
  };

  const alternativesIfNeeded = availableFoods
    .filter(food => food.pricePerKg < 5)
    .sort((a, b) => b.macros.proteinPer100g - a.macros.proteinPer100g)
    .slice(0, 3);

  return {
    recommendations: [...recommendations.proteins, ...recommendations.carbs, ...recommendations.fats],
    alternativesIfNeeded
  };
};

export const calculateOptimalMealsPerDay = (
  goal: string,
  activityLevel: string,
  wakeUpTime: string,
  bedTime: string
): number => {
  // Convertir les heures en minutes depuis minuit pour faciliter les calculs
  const wakeUpMinutes = convertTimeToMinutes(wakeUpTime);
  const bedMinutes = convertTimeToMinutes(bedTime);
  
  // Calculer la durée d'éveil
  let awakeTime = bedMinutes - wakeUpMinutes;
  if (awakeTime < 0) {
    awakeTime += 24 * 60; // Ajouter 24h si l'heure de coucher est le lendemain
  }

  // Base du nombre de repas selon l'objectif
  let baseNumberOfMeals = 3; // Par défaut

  switch (goal) {
    case "prise_masse":
      baseNumberOfMeals = 5; // Plus de repas pour la prise de masse
      break;
    case "perte_poids":
      baseNumberOfMeals = 4; // Repas plus fréquents mais plus petits
      break;
    case "seche":
      baseNumberOfMeals = 6; // Repas très fréquents pour maintenir le métabolisme
      break;
  }

  // Ajustement selon le niveau d'activité
  switch (activityLevel) {
    case "tres_actif":
    case "actif":
      baseNumberOfMeals += 1; // Ajouter un repas pour les personnes très actives
      break;
    case "sedentaire":
      baseNumberOfMeals = Math.max(3, baseNumberOfMeals - 1); // Réduire les repas pour les sédentaires
      break;
  }

  // Si la personne est éveillée moins de 14h, limiter le nombre de repas
  if (awakeTime < 14 * 60) {
    baseNumberOfMeals = Math.min(baseNumberOfMeals, 4);
  }

  // Ne jamais descendre en dessous de 3 repas ou dépasser 6 repas
  return Math.min(Math.max(baseNumberOfMeals, 3), 6);
};

const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const generateCustomFoodList = async (
  age: number,
  weight: number,
  height: number,
  activityLevel: string,
  goal: string,
  allergies: string[],
  budget: number,
  macroTargets: MacroTargets,
  wakeUpTime: string,
  bedTime: string,
  region: string
): Promise<{
  foodList: FoodItem[];
  recommendedMeals: "3" | "4" | "5" | "6";
  mealSchedule: MealSchedule[];
  currencyInfo: CurrencyInfo;
}> => {
  try {
    // Récupérer les informations de devise pour la région
    const { data: currencyData, error: currencyError } = await supabase
      .from('currency_by_region')
      .select('currency_code, currency_symbol, exchange_rate_to_euro, exchange_rates_updated_at')
      .eq('region', region)
      .single();

    if (currencyError) {
      console.error("Erreur lors de la récupération des informations de devise:", currencyError);
      throw new Error("Erreur lors de la récupération des informations de devise");
    }

    const currencyInfo: CurrencyInfo = {
      currencyCode: currencyData.currency_code,
      currencySymbol: currencyData.currency_symbol,
      exchangeRateToEuro: currencyData.exchange_rate_to_euro,
      exchange_rates_updated_at: currencyData.exchange_rates_updated_at
    };
    
    // Récupérer les aliments filtrés par région et budget en utilisant notre nouvelle fonction RPC
    const { data: regionalFoods, error: foodsError } = await supabase
      .rpc('get_foods_by_region_and_budget', {
        p_region: region,
        p_budget: budget
      });

    if (foodsError) {
      console.error("Erreur lors de la récupération des aliments régionaux:", foodsError);
      throw new Error("Erreur lors de la récupération des aliments régionaux");
    }

    // Transformer les données pour correspondre à la structure FoodItem
    const formattedFoods: FoodItem[] = regionalFoods.map(food => ({
      name: food.name,
      category: food.category,
      pricePerKg: food.price_per_kg,
      localPricePerKg: food.local_price_per_kg,
      macros: {
        caloriesPer100g: food.calories_per_100g,
        proteinPer100g: food.protein_per_100g,
        carbsPer100g: food.carbs_per_100g,
        fatsPer100g: food.fat_per_100g
      },
      allergenes: [],
      region: food.region
    }));

    // Récupérer des alternatives économiques pour chaque catégorie principale
    const categories = ["Protéines", "Céréales", "Légumes", "Fruits"];
    const alternativesPromises = categories.map(category => 
      supabase.rpc('get_budget_alternatives', {
        p_region: region,
        p_budget: budget * 0.7,
        p_category: category
      })
    );

    const alternativesResults = await Promise.all(alternativesPromises);
    const economicAlternatives = alternativesResults
      .map(result => result.data || [])
      .flat()
      .map(food => ({
        name: food.name,
        category: food.category,
        pricePerKg: food.price_per_kg,
        localPricePerKg: food.local_price_per_kg,
        macros: {
          caloriesPer100g: food.calories_per_100g,
          proteinPer100g: food.protein_per_100g,
          carbsPer100g: food.carbs_per_100g,
          fatsPer100g: food.fat_per_100g
        },
        allergenes: [],
        region: food.region
      }));

    // Filtrer les aliments en fonction des allergies
    const filteredFoods = formattedFoods.filter(food => 
      !food.allergenes.some(allergene => allergies.includes(allergene))
    );

    const recommendedMealsNumber = calculateOptimalMealsPerDay(goal, activityLevel, wakeUpTime, bedTime);
    const recommendedMeals = String(recommendedMealsNumber) as "3" | "4" | "5" | "6";

    const mealSchedule = generateMealSchedule(
      wakeUpTime,
      bedTime,
      goal,
      recommendedMealsNumber
    );

    return {
      foodList: filteredFoods,
      recommendedMeals,
      mealSchedule,
      currencyInfo
    };
  } catch (error) {
    console.error("Erreur lors de la génération de la liste d'aliments:", error);
    
    // Fallback : utiliser la fonction de recommandation statique
    const { recommendations } = generateFoodRecommendations(macroTargets, allergies, budget);
    
    const recommendedMealsNumber = calculateOptimalMealsPerDay(goal, activityLevel, wakeUpTime, bedTime);
    const recommendedMeals = String(recommendedMealsNumber) as "3" | "4" | "5" | "6";
    
    const mealSchedule = generateMealSchedule(
      wakeUpTime,
      bedTime,
      goal,
      recommendedMealsNumber
    );

    // Utiliser l'euro comme devise par défaut en cas d'erreur
    const defaultCurrencyInfo: CurrencyInfo = {
      currencyCode: 'EUR',
      currencySymbol: '€',
      exchangeRateToEuro: 1.0
    };

    return {
      foodList: recommendations,
      recommendedMeals,
      mealSchedule,
      currencyInfo: defaultCurrencyInfo
    };
  }
};
