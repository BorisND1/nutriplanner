
import React, { useState } from "react";
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
import { calculateDailyMacros, generateFoodRecommendations, generateCustomFoodList } from "@/services/foodRecommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MealSchedule } from "./MealSchedule";
import type { MealSchedule as MealScheduleType } from "@/services/mealSchedule";

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

const profileFormSchema = z.object({
  age: z.string().min(1, "L'âge est requis").transform(Number),
  weight: z.string().min(1, "Le poids est requis").transform(Number),
  height: z.string().min(1, "La taille est requise").transform(Number),
  activityLevel: z.enum(["sedentaire", "leger", "modere", "actif", "tres_actif"]),
  goal: z.enum(["prise_masse", "perte_poids", "seche"]),
  allergies: z.array(z.string()).default([]),
  otherAllergies: z.string().optional(),
  monthlyBudget: z.string().min(1, "Le budget est requis").transform(Number),
  wakeUpTime: z.string().min(1, "L'heure de réveil est requise"),
  bedTime: z.string().min(1, "L'heure de coucher est requise"),
  mealsPerDay: z.enum(["3", "4", "5", "6"]),
  macroTargets: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fats: z.number(),
  }).optional(),
  recommendations: z.array(z.object({
    name: z.string(),
    category: z.string(),
    pricePerKg: z.number(),
    macros: z.object({
      caloriesPer100g: z.number(),
      proteinPer100g: z.number(),
      carbsPer100g: z.number(),
      fatsPer100g: z.number(),
    }),
    allergenes: z.array(z.string()),
  })).optional(),
  alternatives: z.array(z.object({
    name: z.string(),
    category: z.string(),
    pricePerKg: z.number(),
    macros: z.object({
      caloriesPer100g: z.number(),
      proteinPer100g: z.number(),
      carbsPer100g: z.number(),
      fatsPer100g: z.number(),
    }),
    allergenes: z.array(z.string()),
  })).optional(),
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
  const [mealScheduleData, setMealScheduleData] = useState<MealScheduleType[] | null>(null);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  async function onSubmit(data: ProfileFormValues) {
    const macroTargets = calculateDailyMacros(
      data.weight,
      data.height,
      data.age,
      data.activityLevel,
      data.goal
    );

    // On utilise d'abord les recommandations statiques comme fallback
    const { recommendations, alternativesIfNeeded } = generateFoodRecommendations(
      macroTargets,
      data.allergies,
      data.monthlyBudget
    );

    // Générer le nombre de repas recommandé et le planning
    const result = await generateCustomFoodList(
      data.age,
      data.weight,
      data.height,
      data.activityLevel,
      data.goal,
      data.allergies,
      data.monthlyBudget,
      macroTargets,
      data.wakeUpTime,
      data.bedTime
    );

    // Mise à jour automatique du nombre de repas recommandé
    form.setValue("mealsPerDay", result.recommendedMeals);

    // Afficher les résultats
    toast({
      title: "Programme généré avec succès",
      description: (
        <div className="mt-2">
          <p>Calories : {macroTargets.calories} kcal</p>
          <p>Protéines : {macroTargets.protein}g</p>
          <p>Glucides : {macroTargets.carbs}g</p>
          <p>Lipides : {macroTargets.fats}g</p>
          <p className="mt-2 font-medium">Nombre de repas recommandé : {result.recommendedMeals}</p>
        </div>
      ),
      duration: 5000,
    });

    // Mettre à jour le formulaire avec les résultats
    form.setValue("macroTargets", macroTargets);
    form.setValue("recommendations", result.foodList);
    form.setValue("alternatives", alternativesIfNeeded);
    
    // Mettre à jour le planning des repas
    setMealScheduleData(result.mealSchedule);
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
                <FormDescription>
                  Indiquez votre budget mensuel pour l'alimentation. Nous adapterons les recommandations en conséquence.
                </FormDescription>
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
                  <div className="text-2xl font-bold text-primary">
                    {form.watch("macroTargets")?.calories || "--"}
                  </div>
                </div>
                <div className="p-4 bg-secondary/20 rounded-lg text-center">
                  <div className="text-sm font-medium text-muted-foreground">Protéines</div>
                  <div className="text-2xl font-bold text-primary">
                    {form.watch("macroTargets")?.protein || "--"}g
                  </div>
                </div>
                <div className="p-4 bg-secondary/20 rounded-lg text-center">
                  <div className="text-sm font-medium text-muted-foreground">Glucides</div>
                  <div className="text-2xl font-bold text-primary">
                    {form.watch("macroTargets")?.carbs || "--"}g
                  </div>
                </div>
                <div className="p-4 bg-secondary/20 rounded-lg text-center">
                  <div className="text-sm font-medium text-muted-foreground">Lipides</div>
                  <div className="text-2xl font-bold text-primary">
                    {form.watch("macroTargets")?.fats || "--"}g
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {form.watch("recommendations") && (
            <Card>
              <CardHeader>
                <CardTitle>Aliments recommandés</CardTitle>
                <CardDescription>
                  Sélection optimisée selon vos besoins et contraintes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["Protéines", "Céréales", "Légumineuses", "Matières grasses"].map(category => {
                    const categoryFoods = form.watch("recommendations")?.filter(food => food.category === category);
                    if (!categoryFoods?.length) return null;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <h3 className="font-semibold text-foreground">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categoryFoods.map((food, index) => (
                            <div key={index} className="bg-secondary/10 p-4 rounded-lg">
                              <div className="font-medium">{food.name}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                <div>Calories : {food.macros.caloriesPer100g} kcal/100g</div>
                                <div>Protéines : {food.macros.proteinPer100g}g/100g</div>
                                <div>Prix : {food.pricePerKg}€/kg</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {form.watch("alternatives") && form.watch("alternatives").length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Alternatives économiques</CardTitle>
                <CardDescription>
                  Options plus abordables pour votre budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {form.watch("alternatives").map((food, index) => (
                    <div key={index} className="bg-secondary/10 p-4 rounded-lg">
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <div>Calories : {food.macros.caloriesPer100g} kcal/100g</div>
                        <div>Protéines : {food.macros.proteinPer100g}g/100g</div>
                        <div>Prix : {food.pricePerKg}€/kg</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ajouter le composant MealSchedule après les résultats des macros */}
        {mealScheduleData && (
          <MealSchedule schedule={mealScheduleData} />
        )}

        <Button type="submit" className="w-full">
          Générer mon programme
        </Button>
      </form>
    </Form>
  );
}
