
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

  // Distribution des aliments selon le type de repas
  return Array.from({ length: mealsCount }, (_, index) => {
    const mealFoods = [];

    // Petit-déjeuner
    if (index === 0) {
      // Petit déjeuner équilibré avec céréales, produits laitiers et oléagineux
      const cereals = getNextFoodFromCategory("Céréales");
      const dairy = getNextFoodFromCategory("Produits laitiers");
      const nuts = getNextFoodFromCategory("Oléagineux");

      if (cereals) mealFoods.push(cereals);
      if (dairy) mealFoods.push(dairy);
      if (nuts) mealFoods.push(nuts);
    }
    // Déjeuner et dîner
    else if (index === Math.floor(mealsCount / 2) || index === mealsCount - 1) {
      // Repas principaux avec protéines, légumineuses et matières grasses
      const protein = getNextFoodFromCategory("Protéines");
      const legumes = getNextFoodFromCategory("Légumineuses");
      const fats = getNextFoodFromCategory("Matières grasses");
      const cereals = getNextFoodFromCategory("Céréales");

      if (protein) mealFoods.push(protein);
      if (legumes) mealFoods.push(legumes);
      if (fats) mealFoods.push(fats);
      if (cereals) mealFoods.push(cereals);
    }
    // Collations
    else {
      // Collations variées avec oléagineux, produits laitiers ou légumineuses
      const snacks = [
        getNextFoodFromCategory("Oléagineux"),
        getNextFoodFromCategory("Produits laitiers"),
        getNextFoodFromCategory("Légumineuses")
      ].filter(Boolean);

      mealFoods.push(...snacks.slice(0, 2)); // Limite à 2 aliments par collation
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
