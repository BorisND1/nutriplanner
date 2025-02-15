
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CustomMealSchedule, MealSchedule as MealScheduleType, getAdaptedRecommendations, getMealScheduleForDate, saveMealSchedule } from "@/services/mealSchedule";
import type { FoodItem } from "@/services/foodRecommendations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MealScheduleProps {
  schedule: MealScheduleType[];
  recommendations: FoodItem[];
}

export function MealSchedule({ schedule, recommendations }: MealScheduleProps) {
  const [customSchedules, setCustomSchedules] = useState<CustomMealSchedule[]>([]);
  const [adaptedRecommendations, setAdaptedRecommendations] = useState<FoodItem[]>(recommendations);
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMealName, setSelectedMealName] = useState<string>("");

  useEffect(() => {
    saveMealSchedule(schedule, currentDate).catch(console.error);
    loadCustomSchedules();
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

  const handleComplexityClick = (complexity: string, mealName: string) => {
    setSelectedComplexity(complexity);
    setSelectedMealName(mealName);
    setIsDialogOpen(true);
  };

  const getFilteredRecommendations = () => {
    if (!selectedComplexity) return [];

    const complexityToTime = {
      simple: 15,
      moderate: 30,
      elaborate: 45,
    };

    return adaptedRecommendations.filter(food => {
      const preparationTime = Math.floor(food.pricePerKg / 10); // Estimation simplifiée du temps de préparation
      const maxTime = complexityToTime[selectedComplexity as keyof typeof complexityToTime];
      return preparationTime <= maxTime;
    });
  };

  return (
    <>
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
              
              return (
                <div key={index} className="flex flex-col space-y-2 p-4 rounded-lg bg-secondary/10">
                  <h3 className="text-lg font-semibold">{meal.mealName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Prévu à {meal.scheduledTime} ({meal.flexibilityBefore} - {meal.flexibilityAfter})
                  </p>
                  
                  {meal.suggestedFoods && meal.suggestedFoods.length > 0 ? (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-2">Aliments recommandés :</h4>
                      <div className="flex flex-wrap gap-2">
                        {meal.suggestedFoods.map((food, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {food.name} - {food.macros.proteinPer100g}g prot/100g
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-2">
                      Consultez la liste complète des aliments recommandés pour des suggestions
                    </div>
                  )}

                  <Separator className="my-2" />
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Badge 
                      variant="default"
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => handleComplexityClick("simple", meal.mealName)}
                    >
                      Rapide
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => handleComplexityClick("moderate", meal.mealName)}
                    >
                      Modéré
                    </Badge>
                    <Badge 
                      variant="outline"
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => handleComplexityClick("elaborate", meal.mealName)}
                    >
                      Élaboré
                    </Badge>
                    {meal.isPackable && (
                      <Badge variant="outline">
                        Transportable
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Aliments recommandés pour {selectedMealName} - {selectedComplexity === "simple" ? "Rapide" : selectedComplexity === "moderate" ? "Modéré" : "Élaboré"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {getFilteredRecommendations().map((food, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/10">
                <div>
                  <h4 className="font-medium">{food.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Protéines: {food.macros.proteinPer100g}g/100g • Prix: {food.pricePerKg}€/kg
                  </p>
                </div>
                <Badge>{food.category}</Badge>
              </div>
            ))}
            {getFilteredRecommendations().length === 0 && (
              <p className="text-center text-muted-foreground">
                Aucun aliment trouvé pour ce niveau de complexité
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
