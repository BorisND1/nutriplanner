
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MealSchedule, CustomMealSchedule, updateMealSchedule, generateQuickAlternatives } from "@/services/mealSchedule";
import { useToast } from "@/components/ui/use-toast";
import { Clock, RefreshCw } from "lucide-react";

interface MealScheduleEditProps {
  meal: MealSchedule;
  customSchedule?: CustomMealSchedule;
  onUpdate: () => void;
}

export function MealScheduleEdit({ meal, customSchedule, onUpdate }: MealScheduleEditProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [customTime, setCustomTime] = React.useState(customSchedule?.customTime || meal.scheduledTime);
  const [customName, setCustomName] = React.useState(customSchedule?.customMealName || meal.mealName);
  const alternatives = generateQuickAlternatives(meal);

  const handleSave = async () => {
    try {
      if (customSchedule?.id) {
        await updateMealSchedule(customSchedule.id, {
          customTime,
          customMealName: customName,
        });
        toast({
          title: "Modifications enregistrées",
          description: "Le planning a été mis à jour avec succès.",
        });
        onUpdate();
        setIsOpen(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du repas.",
      });
    }
  };

  const handleAlternativeSelect = async (alternative: MealSchedule) => {
    try {
      if (customSchedule?.id) {
        await updateMealSchedule(customSchedule.id, {
          customMealName: alternative.mealName,
          isAlternative: true,
        });
        toast({
          title: "Alternative sélectionnée",
          description: "Le repas a été remplacé par une alternative plus rapide.",
        });
        onUpdate();
        setIsOpen(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sélection de l'alternative.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Clock className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le repas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nom du repas</Label>
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Nom personnalisé du repas"
            />
          </div>
          <div className="space-y-2">
            <Label>Horaire</Label>
            <Input
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
            />
          </div>
          
          {alternatives.length > 0 && (
            <div className="space-y-2">
              <Label>Alternatives rapides disponibles</Label>
              <div className="space-y-2">
                {alternatives.map((alt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleAlternativeSelect(alt)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {alt.mealName}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
