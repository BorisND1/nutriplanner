
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
};

export function ProfileForm() {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profil mis à jour",
      description: "Votre programme alimentaire est en cours de génération...",
    });
    console.log(data);
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
                <Select
                  onValueChange={(value) => field.onChange([...field.value, value])}
                  value={field.value[field.value.length - 1]}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez vos allergies" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gluten">Gluten</SelectItem>
                    <SelectItem value="lactose">Lactose</SelectItem>
                    <SelectItem value="arachides">Arachides</SelectItem>
                    <SelectItem value="fruits_a_coque">Fruits à coque</SelectItem>
                    <SelectItem value="oeufs">Œufs</SelectItem>
                    <SelectItem value="poisson">Poisson</SelectItem>
                    <SelectItem value="crustaces">Crustacés</SelectItem>
                    <SelectItem value="soja">Soja</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((allergie, index) => (
                    <div
                      key={index}
                      className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {allergie}
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
                    </div>
                  ))}
                </div>
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

        <Button type="submit" className="w-full">
          Générer mon programme
        </Button>
      </form>
    </Form>
  );
}
