import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { calculateDailyMacros, generateFoodRecommendations } from "@/services/foodRecommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const profileFormSchema = z.object({
  // Informations personnelles
  age: z.string().min(1, "L'âge est requis").transform(Number),
  weight: z.string().min(1, "Le poids est requis").transform(Number),
  height: z.string().min(1, "La taille est requise").transform(Number),
  activityLevel: z.enum(["sedentaire", "leger", "modere", "actif", "tres_actif"]),
  
  // Objectif physique
  goal: z.enum(["prise_masse", "perte_poids", "seche"]),
  
  // Allergies (multiple selection possible)
  allergies: z.array(z.string()).default([]),
  otherAllergies: z.string().optional(),
  
  // Budget
  monthlyBudget: z.string().min(1, "Le budget est requis").transform(Number),
  
  // Créneaux horaires
  wakeUpTime: z.string().min(1, "L'heure de réveil est requise"),
  bedTime: z.string().min(1, "L'heure de coucher est requise"),
  mealsPerDay: z.enum(["3", "4", "5", "6"]),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  activityLevel: "modere",
  goal: "perte_poids",
  mealsPerDay: "4",
  allergies: [],
  otherAllergies: "",
};

const allergiesList = [
  { value: "gluten", label: "Gluten", description: "Alternatives : riz, quinoa, sarrasin" },
  { value: "lactose", label: "Lactose", description: "Alternatives : lait d'amande, soja, avoine" },
  { value: "arachides", label: "Arachides", description: "Alternatives : graines de tournesol, citrouille" },
  { value: "fruits_a_coque", label: "Fruits à coque", description: "Alternatives : graines, légumineuses" },
  { value: "oeufs", label: "Œufs", description: "Alternatives : tofu, légumineuses" },
  { value: "poisson", label: "Poisson", description: "Alternatives : algues, graines de chia (oméga-3)" },
  { value: "crustaces", label: "Crustacés", description: "Alternatives : légumineuses, tofu" },
  { value: "soja", label: "Soja", description: "Alternatives : pois chiches, lentilles" },
  { value: "sesame", label: "Sésame", description: "Alternatives : graines de lin, chia" },
  { value: "sulfites", label: "Sulfites", description: "Présents dans certains vins et fruits secs" },
  { value: "celeri", label: "Céleri", description: "Alternatives : fenouil, persil" },
  { value: "moutarde", label: "Moutarde", description: "Alternatives : curcuma, gingembre" }
];

export function ProfileForm() {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  function onSubmit(data: ProfileFormValues) {
    // Calculer les besoins en macronutriments
    const macroTargets = calculateDailyMacros(
      data.weight,
      data.height,
      data.age,
      data.activityLevel,
      data.goal
    );

    // Générer les recommandations alimentaires
    const { recommendations, alternativesIfNeeded } = generateFoodRecommendations(
      macroTargets,
      data.allergies,
      data.monthlyBudget
    );

    toast({
      title: "Programme généré avec succès !",
      description: "Voici vos besoins quotidiens en macronutriments :",
      duration: 5000,
    });

    // Afficher les résultats dans la console pour le développement
    console.log({
      macroTargets,
      recommendations,
      alternativesIfNeeded
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Informations personnelles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Âge</FormLabel>
                  <FormControl>
                    <Input type="number" min="15" max="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poids (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" min="30" max="250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taille (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" min="100" max="250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="activityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau d'activité physique</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre niveau d'activité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sedentaire">Sédentaire (peu ou pas d'exercice)</SelectItem>
                    <SelectItem value="leger">Légèrement actif (exercice 1-3 fois/semaine)</SelectItem>
                    <SelectItem value="modere">Modérément actif (exercice 3-5 fois/semaine)</SelectItem>
                    <SelectItem value="actif">Très actif (exercice 6-7 fois/semaine)</SelectItem>
                    <SelectItem value="tres_actif">Extrêmement actif (exercice intense quotidien)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Objectif physique</h2>
          
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="prise_masse" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Prise de masse
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="perte_poids" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Perte de poids
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="seche" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Sèche
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Allergies et Budget</h2>
          
          <FormField
            control={form.control}
            name="allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allergies alimentaires</FormLabel>
                <FormDescription>
                  Sélectionnez vos allergies ou intolérances. Nous adapterons votre programme en conséquence.
                </FormDescription>
                <Select
                  onValueChange={(value) => {
                    if (!field.value.includes(value)) {
                      field.onChange([...field.value, value]);
                    }
                  }}
                  value={field.value[field.value.length - 1]}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez vos allergies" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allergiesList.map((allergie) => (
                      <SelectItem key={allergie.value} value={allergie.value}>
                        <div className="flex flex-col">
                          <span>{allergie.label}</span>
                          <span className="text-xs text-muted-foreground">{allergie.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((allergie, index) => {
                    const allergieInfo = allergiesList.find(a => a.value === allergie);
                    return (
                      <div
                        key={index}
                        className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2 group relative"
                      >
                        {allergieInfo?.label || allergie}
                        <button
                          type="button"
                          onClick={() => {
                            const newAllergies = [...field.value];
                            newAllergies.splice(index, 1);
                            field.onChange(newAllergies);
                          }}
                          className="text-foreground/60 hover:text-foreground"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {allergieInfo?.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otherAllergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Autres allergies ou intolérances</FormLabel>
                <FormDescription>
                  Si vous avez d'autres allergies non listées, précisez-les ici
                </FormDescription>
                <FormControl>
                  <Input {...field} placeholder="Ex: kiwi, fruits de mer..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlyBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget mensuel (€)</FormLabel>
                <FormControl>
                  <Input type="number" min="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Créneaux horaires</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="wakeUpTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure de réveil</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bedTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure de coucher</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="mealsPerDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de repas par jour</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le nombre de repas" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="3">3 repas</SelectItem>
                    <SelectItem value="4">4 repas</SelectItem>
                    <SelectItem value="5">5 repas</SelectItem>
                    <SelectItem value="6">6 repas</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-8 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Besoins journaliers</CardTitle>
              <CardDescription>
                Ces valeurs seront calculées en fonction de vos objectifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-secondary/20 rounded-lg text-center">
                  <div className="text-sm font-medium text-muted-foreground">Calories</div>
                  <div className="text-2xl font-bold text-primary">--</div>
                </div>
                <div className="p-4 bg-secondary/20 rounded-lg text-center">
                  <div className="text-sm font-medium text-muted-foreground">Protéines</div>
                  <div className="text-2xl font-bold text-primary">--</div>
                </div>
                <div className="p-4 bg-secondary/20 rounded-lg text-center">
                  <div className="text-sm font-medium text-muted-foreground">Glucides</div>
                  <div className="text-2xl font-bold text-primary">--</div>
                </div>
                <div className="p-4 bg-secondary/20 rounded-lg text-center">
                  <div className="text-sm font-medium text-muted-foreground">Lipides</div>
                  <div className="text-2xl font-bold text-primary">--</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button type="submit" className="w-full">
          Générer mon programme
        </Button>
      </form>
    </Form>
  );
}
