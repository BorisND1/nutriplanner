
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MealSchedule as MealScheduleType } from "@/services/mealSchedule";
import { PackageOpen, Clock, ChefHat } from "lucide-react";

interface MealScheduleProps {
  schedule: MealScheduleType[];
  recommendations?: {
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
  }[];
}

const calculatePortionSize = (
  foodItem: MealScheduleProps["recommendations"][0],
  mealType: string,
  timeOfDay: number
): { amount: number; unit: string } => {
  const isBreakfast = timeOfDay < 11;
  const isSnack = mealType.toLowerCase().includes("collation");
  const isDinner = timeOfDay >= 19;

  switch (foodItem.category) {
    case "Protéines":
      return isSnack 
        ? { amount: 20, unit: "g" }
        : { amount: isDinner ? 150 : 130, unit: "g" };
    case "Céréales":
      return isBreakfast 
        ? { amount: 60, unit: "g" }
        : isSnack 
          ? { amount: 30, unit: "g" }
          : { amount: 80, unit: "g" };
    case "Légumineuses":
      return isSnack
        ? { amount: 30, unit: "g" }
        : { amount: 100, unit: "g" };
    case "Oléagineux":
      return { amount: 30, unit: "g" };
    case "Produits laitiers":
      return { amount: isBreakfast ? 200 : 150, unit: "g" };
    default:
      return { amount: 100, unit: "g" };
  }
};

const calculateMealMacros = (
  foods: MealScheduleProps["recommendations"],
  portions: { [key: string]: { amount: number; unit: string } }
) => {
  return foods.reduce((acc, food) => {
    const portion = portions[food.name];
    const factor = portion.amount / 100; // Convert to 100g basis
    return {
      calories: acc.calories + food.macros.caloriesPer100g * factor,
      protein: acc.protein + food.macros.proteinPer100g * factor,
      carbs: acc.carbs + food.macros.carbsPer100g * factor,
      fats: acc.fats + food.macros.fatsPer100g * factor
    };
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
};

const distributeFoodByMeal = (
  recommendations: MealScheduleProps["recommendations"] = [], 
  mealsCount: number,
  schedule: MealScheduleType[]
) => {
  if (!recommendations.length) return new Array(mealsCount).fill([]);

  // Grouper les aliments par catégorie
  const foodByCategory = recommendations.reduce((acc, food) => {
    if (!acc[food.category]) {
      acc[food.category] = [];
    }
    acc[food.category].push(food);
    return acc;
  }, {} as Record<string, typeof recommendations>);

  // Rotation des index pour chaque catégorie
  const categoryIndexes: Record<string, number> = {};
  Object.keys(foodByCategory).forEach(category => {
    categoryIndexes[category] = 0;
  });

  const getNextFoodFromCategory = (category: string) => {
    if (!foodByCategory[category] || foodByCategory[category].length === 0) return null;
    const food = foodByCategory[category][categoryIndexes[category]];
    categoryIndexes[category] = (categoryIndexes[category] + 1) % foodByCategory[category].length;
    return food;
  };

  return schedule.map((meal, index) => {
    const mealTime = Number(meal.scheduledTime.split(':')[0]);
    const mealFoods = [];
    const { complexity, isPackable } = meal;

    // Petit-déjeuner (avant 11h)
    if (mealTime < 11) {
      const cereals = getNextFoodFromCategory("Céréales");
      const dairy = getNextFoodFromCategory("Produits laitiers");
      const protein = getNextFoodFromCategory("Protéines");
      const nuts = getNextFoodFromCategory("Oléagineux");
      
      if (cereals) mealFoods.push(cereals);
      if (dairy) mealFoods.push(dairy);
      if (protein) mealFoods.push(protein);
      if (nuts) mealFoods.push(nuts);
    } 
    // Collations
    else if (meal.mealName.toLowerCase().includes("collation")) {
      const protein = getNextFoodFromCategory("Protéines");
      const nuts = getNextFoodFromCategory("Oléagineux");
      const dairy = getNextFoodFromCategory("Produits laitiers");
      
      if (protein) mealFoods.push(protein);
      if (nuts) mealFoods.push(nuts);
      if (dairy) mealFoods.push(dairy);
    }
    // Déjeuner (11h-15h)
    else if (mealTime >= 11 && mealTime < 15) {
      if (complexity === "simple" || isPackable) {
        const protein = getNextFoodFromCategory("Protéines");
        const legumes = getNextFoodFromCategory("Légumineuses");
        const cereals = getNextFoodFromCategory("Céréales");
        if (protein) mealFoods.push(protein);
        if (legumes) mealFoods.push(legumes);
        if (cereals) mealFoods.push(cereals);
      } else {
        const protein = getNextFoodFromCategory("Protéines");
        const legumes = getNextFoodFromCategory("Légumineuses");
        const cereals = getNextFoodFromCategory("Céréales");
        const fats = getNextFoodFromCategory("Matières grasses");
        if (protein) mealFoods.push(protein);
        if (legumes) mealFoods.push(legumes);
        if (cereals) mealFoods.push(cereals);
        if (fats) mealFoods.push(fats);
      }
    }
    // Dîner (après 15h)
    else {
      if (complexity === "simple") {
        const protein = getNextFoodFromCategory("Protéines");
        const legumes = getNextFoodFromCategory("Légumineuses");
        const cereals = getNextFoodFromCategory("Céréales");
        if (protein) mealFoods.push(protein);
        if (legumes) mealFoods.push(legumes);
        if (cereals) mealFoods.push(cereals);
      } else {
        const protein = getNextFoodFromCategory("Protéines");
        const legumes = getNextFoodFromCategory("Légumineuses");
        const cereals = getNextFoodFromCategory("Céréales");
        const fats = getNextFoodFromCategory("Matières grasses");
        if (protein) mealFoods.push(protein);
        if (legumes) mealFoods.push(legumes);
        if (cereals) mealFoods.push(cereals);
        if (fats) mealFoods.push(fats);
      }
    }

    // Calculer les portions pour chaque aliment
    const portions = mealFoods.reduce((acc, food) => ({
      ...acc,
      [food.name]: calculatePortionSize(food, meal.mealName, mealTime)
    }), {} as { [key: string]: { amount: number; unit: string } });

    // Calculer les macros totaux du repas
    const mealMacros = calculateMealMacros(mealFoods, portions);

    return {
      foods: mealFoods,
      portions,
      macros: mealMacros
    };
  });
};

export function MealSchedule({ schedule, recommendations }: MealScheduleProps) {
  const foodByMeal = distributeFoodByMeal(recommendations, schedule.length, schedule);

  const getComplexityLabel = (complexity: "simple" | "moderate" | "elaborate") => {
    switch (complexity) {
      case "simple":
        return "Repas simple et rapide";
      case "moderate":
        return "Repas de complexité moyenne";
      case "elaborate":
        return "Repas élaboré";
    }
  };

  const getComplexityIcon = (complexity: "simple" | "moderate" | "elaborate") => {
    const className = "w-4 h-4 inline-block mr-2";
    switch (complexity) {
      case "simple":
        return <Clock className={className} />;
      case "moderate":
        return <ChefHat className={className} style={{ opacity: 0.5 }} />;
      case "elaborate":
        return <ChefHat className={className} />;
    }
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Planning des repas</CardTitle>
        <CardDescription>
          Horaires recommandés avec plages de flexibilité et aliments suggérés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map((meal, index) => (
            <div key={index} className="flex flex-col space-y-2 p-4 rounded-lg bg-secondary/10">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">{meal.mealName}</h3>
                <span className="font-bold text-xl">{meal.scheduledTime}</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Plage horaire flexible : {meal.flexibilityBefore} - {meal.flexibilityAfter}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center">
                  {getComplexityIcon(meal.complexity)}
                  {getComplexityLabel(meal.complexity)}
                </span>
                {meal.isPackable && (
                  <span className="flex items-center">
                    <PackageOpen className="w-4 h-4 inline-block mr-2" />
                    À emporter possible
                  </span>
                )}
              </div>

              {foodByMeal[index].foods?.length > 0 && (
                <div className="mt-2 space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Aliments suggérés :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {foodByMeal[index].foods.map((food, foodIndex) => {
                      const portion = foodByMeal[index].portions[food.name];
                      return (
                        <div key={foodIndex} className="bg-background/50 p-3 rounded-lg text-sm">
                          <div className="font-medium">{food.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <div>Portion : {portion.amount}{portion.unit}</div>
                            <div>Calories : {Math.round(food.macros.caloriesPer100g * portion.amount / 100)} kcal</div>
                            <div>Protéines : {Math.round(food.macros.proteinPer100g * portion.amount / 100)}g</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-3 p-2 bg-primary/10 rounded-lg">
                    <div className="text-sm font-medium">Total du repas :</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1 text-xs">
                      <div>Calories : {Math.round(foodByMeal[index].macros.calories)} kcal</div>
                      <div>Protéines : {Math.round(foodByMeal[index].macros.protein)}g</div>
                      <div>Glucides : {Math.round(foodByMeal[index].macros.carbs)}g</div>
                      <div>Lipides : {Math.round(foodByMeal[index].macros.fats)}g</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
