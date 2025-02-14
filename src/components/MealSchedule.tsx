
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MealSchedule as MealScheduleType } from "@/services/mealSchedule";

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

const distributeFoodByMeal = (recommendations: MealScheduleProps["recommendations"] = [], mealsCount: number) => {
  if (!recommendations.length) return new Array(mealsCount).fill([]);

  // Grouper les aliments par catégorie
  const foodByCategory = recommendations.reduce((acc, food) => {
    if (!acc[food.category]) {
      acc[food.category] = [];
    }
    acc[food.category].push(food);
    return acc;
  }, {} as Record<string, typeof recommendations>);

  // Rotation des index pour chaque catégorie pour assurer la diversité
  const categoryIndexes: Record<string, number> = {};
  Object.keys(foodByCategory).forEach(category => {
    categoryIndexes[category] = 0;
  });

  // Fonction pour obtenir le prochain aliment d'une catégorie avec rotation
  const getNextFoodFromCategory = (category: string) => {
    if (!foodByCategory[category] || foodByCategory[category].length === 0) return null;
    
    const food = foodByCategory[category][categoryIndexes[category]];
    categoryIndexes[category] = (categoryIndexes[category] + 1) % foodByCategory[category].length;
    return food;
  };

  // Distribution des aliments selon le type de repas et l'heure
  return Array.from({ length: mealsCount }, (_, index) => {
    const mealFoods = [];
    const mealTime = Number(schedule[index].scheduledTime.split(':')[0]);

    // Petit-déjeuner (avant 11h)
    if (mealTime < 11) {
      const cereals = getNextFoodFromCategory("Céréales");
      const dairy = getNextFoodFromCategory("Produits laitiers");
      const nuts = getNextFoodFromCategory("Oléagineux");

      if (cereals) mealFoods.push(cereals);
      if (dairy) mealFoods.push(dairy);
      if (nuts) mealFoods.push(nuts);
    }
    // Déjeuner (11h-15h)
    else if (mealTime >= 11 && mealTime < 15) {
      const protein = getNextFoodFromCategory("Protéines");
      const legumes = getNextFoodFromCategory("Légumineuses");
      const cereals = getNextFoodFromCategory("Céréales");
      const fats = getNextFoodFromCategory("Matières grasses");

      if (protein) mealFoods.push(protein);
      if (legumes) mealFoods.push(legumes);
      if (cereals) mealFoods.push(cereals);
      if (fats) mealFoods.push(fats);
    }
    // Collation (15h-18h)
    else if (mealTime >= 15 && mealTime < 18) {
      // Privilégier les aliments riches en protéines et les fruits secs
      const protein = getNextFoodFromCategory("Protéines");
      const nuts = getNextFoodFromCategory("Oléagineux");
      const dairy = getNextFoodFromCategory("Produits laitiers");

      if (protein) mealFoods.push(protein);
      if (nuts) mealFoods.push(nuts);
      if (dairy) mealFoods.push(dairy);
    }
    // Dîner (après 18h)
    else {
      // Repas plus léger que le déjeuner
      const protein = getNextFoodFromCategory("Protéines");
      const legumes = getNextFoodFromCategory("Légumineuses");
      const fats = getNextFoodFromCategory("Matières grasses");

      if (protein) mealFoods.push(protein);
      if (legumes) mealFoods.push(legumes);
      if (fats) mealFoods.push(fats);
    }

    return mealFoods;
  });
};

export function MealSchedule({ schedule, recommendations }: MealScheduleProps) {
  const foodByMeal = distributeFoodByMeal(recommendations, schedule.length);

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
              
              {/* Affichage des aliments recommandés pour ce repas */}
              {foodByMeal[index].length > 0 && (
                <div className="mt-2 space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Aliments suggérés :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {foodByMeal[index].map((food, foodIndex) => (
                      <div key={foodIndex} className="bg-background/50 p-3 rounded-lg text-sm">
                        <div className="font-medium">{food.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <div>Calories : {food.macros.caloriesPer100g} kcal/100g</div>
                          <div>Protéines : {food.macros.proteinPer100g}g/100g</div>
                          <div>Prix : {food.pricePerKg}€/kg</div>
                        </div>
                      </div>
                    ))}
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
