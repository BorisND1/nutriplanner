
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MealSchedule as MealScheduleType } from "@/services/mealSchedule";

interface MealScheduleProps {
  schedule: MealScheduleType[];
}

export function MealSchedule({ schedule }: MealScheduleProps) {
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Planning des repas</CardTitle>
        <CardDescription>
          Horaires recommandés avec plages de flexibilité
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
