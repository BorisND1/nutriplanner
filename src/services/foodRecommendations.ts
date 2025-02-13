
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
  macros: {
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatsPer100g: number;
  };
  allergenes: string[];
}

// Base de données simplifiée des aliments
const foodDatabase: FoodItem[] = [
  {
    name: "Poulet (blanc)",
    category: "Protéines",
    pricePerKg: 10,
    macros: {
      caloriesPer100g: 165,
      proteinPer100g: 31,
      carbsPer100g: 0,
      fatsPer100g: 3.6
    },
    allergenes: []
  },
  {
    name: "Quinoa",
    category: "Céréales",
    pricePerKg: 6,
    macros: {
      caloriesPer100g: 120,
      proteinPer100g: 4.4,
      carbsPer100g: 21.3,
      fatsPer100g: 1.9
    },
    allergenes: []
  },
  {
    name: "Yaourt grec",
    category: "Produits laitiers",
    pricePerKg: 4,
    macros: {
      caloriesPer100g: 97,
      proteinPer100g: 9,
      carbsPer100g: 3.6,
      fatsPer100g: 5
    },
    allergenes: ["lactose"]
  },
  // ... Ajoutez plus d'aliments selon vos besoins
];

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
  // Filtrer les aliments en fonction des allergies
  let availableFoods = foodDatabase.filter(food => 
    !food.allergenes.some(allergene => allergies.includes(allergene))
  );

  // Trier les aliments par rapport qualité/prix (protéines par euro)
  const sortedByValue = availableFoods.sort((a, b) => 
    (b.macros.proteinPer100g / b.pricePerKg) - (a.macros.proteinPer100g / a.pricePerKg)
  );

  // Sélectionner les meilleurs aliments dans chaque catégorie
  const recommendations = {
    proteins: sortedByValue.filter(food => food.macros.proteinPer100g > 20).slice(0, 3),
    carbs: sortedByValue.filter(food => food.macros.carbsPer100g > 15).slice(0, 3),
    fats: sortedByValue.filter(food => food.macros.fatsPer100g > 10).slice(0, 2)
  };

  // Trouver des alternatives économiques si nécessaire
  const alternativesIfNeeded = availableFoods
    .filter(food => food.pricePerKg < 5)
    .sort((a, b) => b.macros.proteinPer100g - a.macros.proteinPer100g)
    .slice(0, 3);

  return {
    recommendations: [...recommendations.proteins, ...recommendations.carbs, ...recommendations.fats],
    alternativesIfNeeded
  };
};
