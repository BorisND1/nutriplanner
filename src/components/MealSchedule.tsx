import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomMealSchedule, FoodItem, getAdaptedRecommendations, getMealScheduleForDate, saveMealSchedule } from "@/services/mealSchedule";

interface MealScheduleProps {
  schedule: {
    mealName: string;
    scheduledTime: string;
    flexibilityBefore: string;
    flexibilityAfter: string;
    complexity: "simple" | "moderate" | "elaborate";
    isPackable: boolean;
  }[];
  recommendations: FoodItem[];
}

const foodByMeal: { [mealName: string]: string[] } = {
  "Petit-déjeuner": ["Œufs", "Avoine", "Yaourt grec", "Amandes"],
  "Collation matinale": ["Amandes", "Graines de chia", "Fromage blanc 0%"],
  "Déjeuner": ["Poulet (blanc)", "Quinoa", "Lentilles", "Huile d'olive"],
  "Collation après-midi": ["Amandes", "Fromage blanc 0%", "Graines de chia"],
  "Dîner": ["Saumon", "Riz brun", "Lentilles", "Huile d'olive"],
  "Collation nocturne": ["Yaourt grec", "Amandes"]
};

export function MealSchedule({ schedule, recommendations }: MealScheduleProps) {
  const [customSchedules, setCustomSchedules] = useState<CustomMealSchedule[]>([]);
  const [adaptedRecommendations, setAdaptedRecommendations] = useState<FoodItem[]>(recommendations);
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Sauvegarder le planning initial et configurer les notifications
    saveMealSchedule(schedule, currentDate).catch(console.error);
    
    // Charger les plannings personnalisés
    loadCustomSchedules();

    // Adapter les recommandations aux contraintes de l'utilisateur
    getAdaptedRecommendations(recommendations)
      .then(setAdaptedRecommendations)
      .catch(console.error);
  }, [schedule, currentDate, recommendations]);

  const loadCustomSchedules = async () => {
    try {
      const customSchedules = await getMealScheduleForDate(currentDate);
      setCustomSchedules(customSchedules);
    } catch (error) {
      console.error("Erreur lors du chargement des plannings personnalisés:", error);
    }
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Planning des repas</CardTitle>
        <CardDescription>Voici votre planning de repas personnalisé</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map((meal, index) => {
            const customSchedule = customSchedules.find(
              cs => cs.originalMealName === meal.mealName
            );
            
            // Filtrer les recommandations adaptées pour ce repas
            const mealRecommendations = adaptedRecommendations.filter(food => 
              foodByMeal[meal.mealName]?.includes(food.name)
            );
            
            return (
              <div key={index} className="flex flex-col space-y-2 p-4 rounded-lg bg-secondary/10">
                <h3 className="text-lg font-semibold">{meal.mealName}</h3>
                <p className="text-sm text-muted-foreground">
                  Prévu à {meal.scheduledTime} ({meal.flexibilityBefore} - {meal.flexibilityAfter})
                </p>
                
                {mealRecommendations.length === 0 && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Aucune recommandation disponible compte tenu de vos contraintes.
                    Consultez un nutritionniste pour des alternatives adaptées.
                  </div>
                )}
                
                {mealRecommendations.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">Aliments recommandés :</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {mealRecommendations.map((food, idx) => (
                        <div key={idx} className="text-sm p-2 bg-background rounded-md">
                          <span className="font-medium">{food.name}</span>
                          <div className="text-muted-foreground">
                            {food.pricePerKg}€/kg - {food.macros.proteinPer100g}g protéines/100g
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
