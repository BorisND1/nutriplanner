import { supabase } from "@/integrations/supabase/client";
import type { FoodItem } from "./foodRecommendations";

interface MealTiming {
  mealName: string;
  idealTimeOffset: number;
  flexibilityRange: number;
  complexity: "simple" | "moderate" | "elaborate";
  isPackable: boolean;
  suggestedFoodCategories: string[];
}

const mealTimingsByGoal: { [key: string]: MealTiming[] } = {
  perte_poids: [
    { 
      mealName: "Petit-déjeuner", 
      idealTimeOffset: 30, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: false,
      suggestedFoodCategories: ["Protéines", "Céréales", "Produits laitiers", "Oléagineux"]
    },
    { 
      mealName: "Déjeuner", 
      idealTimeOffset: 360, 
      flexibilityRange: 45, 
      complexity: "moderate", 
      isPackable: true,
      suggestedFoodCategories: ["Protéines", "Céréales", "Légumineuses", "Matières grasses"]
    },
    { 
      mealName: "Collation après-midi", 
      idealTimeOffset: 540, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: true,
      suggestedFoodCategories: ["Produits laitiers", "Oléagineux", "Protéines"]
    },
    { 
      mealName: "Dîner", 
      idealTimeOffset: 720, 
      flexibilityRange: 45, 
      complexity: "moderate", 
      isPackable: false,
      suggestedFoodCategories: ["Protéines", "Céréales", "Légumineuses", "Matières grasses"]
    }
  ],
  seche: [
    { 
      mealName: "Petit-déjeuner", 
      idealTimeOffset: 30, 
      flexibilityRange: 30, 
      complexity: "moderate", 
      isPackable: false,
      suggestedFoodCategories: ["Protéines", "Céréales", "Produits laitiers"]
    },
    { 
      mealName: "Collation matinale", 
      idealTimeOffset: 180, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: true,
      suggestedFoodCategories: ["Protéines", "Oléagineux"]
    },
    { 
      mealName: "Déjeuner", 
      idealTimeOffset: 360, 
      flexibilityRange: 45, 
      complexity: "moderate", 
      isPackable: true,
      suggestedFoodCategories: ["Protéines", "Céréales", "Légumineuses", "Matières grasses"]
    },
    { 
      mealName: "Collation après-midi", 
      idealTimeOffset: 540, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: true,
      suggestedFoodCategories: ["Produits laitiers", "Oléagineux"]
    },
    { 
      mealName: "Dîner", 
      idealTimeOffset: 720, 
      flexibilityRange: 45, 
      complexity: "elaborate", 
      isPackable: false,
      suggestedFoodCategories: ["Protéines", "Céréales", "Légumineuses", "Matières grasses"]
    }
  ],
  prise_masse: [
    { 
      mealName: "Petit-déjeuner", 
      idealTimeOffset: 30, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: false,
      suggestedFoodCategories: ["Protéines", "Céréales", "Produits laitiers", "Oléagineux"]
    },
    { 
      mealName: "Collation matinale", 
      idealTimeOffset: 180, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: true,
      suggestedFoodCategories: ["Protéines", "Oléagineux", "Produits laitiers"]
    },
    { 
      mealName: "Déjeuner", 
      idealTimeOffset: 360, 
      flexibilityRange: 45, 
      complexity: "moderate", 
      isPackable: true,
      suggestedFoodCategories: ["Protéines", "Céréales", "Légumineuses", "Matières grasses"]
    },
    { 
      mealName: "Collation après-midi", 
      idealTimeOffset: 540, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: true,
      suggestedFoodCategories: ["Produits laitiers", "Oléagineux", "Protéines"]
    },
    { 
      mealName: "Dîner", 
      idealTimeOffset: 720, 
      flexibilityRange: 45, 
      complexity: "elaborate", 
      isPackable: false,
      suggestedFoodCategories: ["Protéines", "Céréales", "Légumineuses", "Matières grasses"]
    },
    { 
      mealName: "Collation nocturne", 
      idealTimeOffset: 840, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: false,
      suggestedFoodCategories: ["Produits laitiers", "Protéines"]
    }
  ]
};

export interface WorkSchedule {
  workDays: string[];
  startTime: string;
  endTime: string;
  lunchBreak: {
    duration: string;
    isFixedTime: boolean;
    fixedStartTime?: string;
  };
  additionalConstraints: string[];
}

export interface MealSchedule {
  mealName: string;
  scheduledTime: string;
  flexibilityBefore: string;
  flexibilityAfter: string;
  complexity: "simple" | "moderate" | "elaborate";
  isPackable: boolean;
  suggestedFoods: FoodItem[];
}

const adjustMealTimingForWorkDay = (
  meal: MealTiming,
  workSchedule: WorkSchedule,
  wakeTimeInMinutes: number
): { adjustedTime: number; complexity: "simple" | "moderate" | "elaborate" } => {
  const startTimeMinutes = parseInt(workSchedule.startTime.split(':')[0]) * 60 + parseInt(workSchedule.startTime.split(':')[1]);
  const endTimeMinutes = parseInt(workSchedule.endTime.split(':')[0]) * 60 + parseInt(workSchedule.endTime.split(':')[1]);
  const mealTimeMinutes = wakeTimeInMinutes + meal.idealTimeOffset;

  // Si c'est l'heure du déjeuner et qu'il y a une pause déjeuner fixe
  if (meal.mealName === "Déjeuner" && workSchedule.lunchBreak.isFixedTime && workSchedule.lunchBreak.fixedStartTime) {
    const fixedLunchTime = workSchedule.lunchBreak.fixedStartTime.split(':');
    return {
      adjustedTime: parseInt(fixedLunchTime[0]) * 60 + parseInt(fixedLunchTime[1]),
      complexity: "moderate"
    };
  }

  // Gérer les contraintes de temps
  if (mealTimeMinutes > startTimeMinutes - 60 && mealTimeMinutes < startTimeMinutes) {
    // Repas juste avant le travail - faire simple
    return { adjustedTime: startTimeMinutes - 45, complexity: "simple" };
  } else if (mealTimeMinutes > endTimeMinutes && mealTimeMinutes < endTimeMinutes + 60) {
    // Repas juste après le travail - peut être plus élaboré
    return { adjustedTime: endTimeMinutes + 30, complexity: meal.complexity };
  }

  // Pendant les heures de travail - privilégier les repas simples et transportables
  if (mealTimeMinutes > startTimeMinutes && mealTimeMinutes < endTimeMinutes) {
    if (!meal.isPackable) {
      // Déplacer le repas en dehors des heures de travail
      return { adjustedTime: endTimeMinutes + 30, complexity: "simple" };
    }
    return { adjustedTime: mealTimeMinutes, complexity: "simple" };
  }

  // En dehors des heures de travail - garder le timing et la complexité d'origine
  return { adjustedTime: mealTimeMinutes, complexity: meal.complexity };
};

export const generateMealSchedule = (
  wakeUpTime: string,
  bedTime: string,
  goal: string,
  numberOfMeals: number,
  workSchedule?: WorkSchedule,
  recommendedFoods?: FoodItem[]
): MealSchedule[] => {
  const mealTimings = [...mealTimingsByGoal[goal]];
  
  // Si le nombre de repas demandé est inférieur, on retire des collations en priorité
  while (mealTimings.length > numberOfMeals) {
    const snackIndex = mealTimings.findIndex(meal => meal.mealName.includes("Collation"));
    if (snackIndex !== -1) {
      mealTimings.splice(snackIndex, 1);
    } else {
      mealTimings.pop();
    }
  }

  const [wakeHours, wakeMinutes] = wakeUpTime.split(':').map(Number);
  const wakeTimeInMinutes = wakeHours * 60 + wakeMinutes;
  const [bedHours, bedMinutes] = bedTime.split(':').map(Number);
  const bedTimeInMinutes = bedHours * 60 + bedMinutes;

  let awakeTime = bedTimeInMinutes - wakeTimeInMinutes;
  if (awakeTime < 0) {
    awakeTime += 24 * 60; // Ajouter 24h si l'heure de coucher est le lendemain
  }

  return mealTimings.map(timing => {
    let scheduledMinutes = wakeTimeInMinutes + timing.idealTimeOffset;
    let complexity = timing.complexity;
    let suggestedFoods: FoodItem[] = [];

    // Sélectionner les aliments recommandés pour ce repas
    if (recommendedFoods) {
      suggestedFoods = recommendedFoods.filter(food => 
        timing.suggestedFoodCategories.includes(food.category)
      ).sort((a, b) => {
        // Prioriser les aliments adaptés à la complexité du repas
        if (complexity === "simple" && a.pricePerKg < b.pricePerKg) return -1;
        if (complexity === "elaborate" && a.macros.proteinPer100g > b.macros.proteinPer100g) return -1;
        return 0;
      }).slice(0, 4); // Limiter à 4 suggestions par repas
    }

    // Ajuster le timing et la complexité en fonction du planning de travail
    if (workSchedule && workSchedule.workDays.includes(new Date().toLocaleDateString('fr-FR', { weekday: 'long' }))) {
      const adjusted = adjustMealTimingForWorkDay(timing, workSchedule, wakeTimeInMinutes);
      scheduledMinutes = adjusted.adjustedTime;
      complexity = adjusted.complexity;
    }

    if (scheduledMinutes >= 24 * 60) {
      scheduledMinutes -= 24 * 60;
    }

    const scheduledHours = Math.floor(scheduledMinutes / 60);
    const remainingMinutes = scheduledMinutes % 60;

    const scheduledTime = `${String(scheduledHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;

    // Calcul des plages de flexibilité
    let flexBeforeMinutes = (scheduledMinutes - timing.flexibilityRange + 24 * 60) % (24 * 60);
    let flexAfterMinutes = (scheduledMinutes + timing.flexibilityRange) % (24 * 60);

    const flexibilityBefore = `${String(Math.floor(flexBeforeMinutes / 60)).padStart(2, '0')}:${String(flexBeforeMinutes % 60).padStart(2, '0')}`;
    const flexibilityAfter = `${String(Math.floor(flexAfterMinutes / 60)).padStart(2, '0')}:${String(flexAfterMinutes % 60).padStart(2, '0')}`;

    return {
      mealName: timing.mealName,
      scheduledTime,
      flexibilityBefore,
      flexibilityAfter,
      complexity,
      isPackable: timing.isPackable,
      suggestedFoods
    };
  });
};

export interface CustomMealSchedule {
  id: string;
  originalMealName: string;
  customMealName?: string;
  scheduledTime: string;
  customTime?: string;
  mealType: "petit-dejeuner" | "collation" | "dejeuner" | "diner";
  isAlternative: boolean;
  date: string;
}

export const saveMealSchedule = async (schedule: MealSchedule[], date: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Utilisateur non connecté");

  // Sauvegarder le planning des repas
  const mealSchedules = schedule.map(meal => ({
    user_id: user.id,
    original_meal_name: meal.mealName,
    scheduled_time: meal.scheduledTime,
    meal_type: getMealType(meal.mealName),
    date: date,
  }));

  const { error: scheduleError } = await supabase
    .from('meal_schedules')
    .upsert(mealSchedules, { onConflict: 'user_id,date,original_meal_name' });

  if (scheduleError) throw scheduleError;

  // Créer les notifications pour les repas
  const { data: profile } = await supabase
    .from('profiles')
    .select('notification_enabled, notification_advance_minutes')
    .eq('id', user.id)
    .single();

  if (profile?.notification_enabled) {
    const notifications = schedule.map(meal => ({
      user_id: user.id,
      meal_name: meal.mealName,
      scheduled_time: meal.scheduledTime,
      notification_sent: false
    }));

    const { error: notificationError } = await supabase
      .from('meal_notifications')
      .upsert(notifications, { 
        onConflict: 'user_id,meal_name,scheduled_time',
        ignoreDuplicates: true 
      });

    if (notificationError) throw notificationError;
  }
};

export const updateMealSchedule = async (mealId: string, updates: Partial<CustomMealSchedule>) => {
  const { error } = await supabase
    .from('meal_schedules')
    .update({
      custom_meal_name: updates.customMealName,
      custom_time: updates.customTime,
      is_alternative: updates.isAlternative,
    })
    .eq('id', mealId);

  if (error) throw error;
};

export const getMealScheduleForDate = async (date: string): Promise<CustomMealSchedule[]> => {
  const { data, error } = await supabase
    .from('meal_schedules')
    .select('*')
    .eq('date', date)
    .order('scheduled_time');

  if (error) throw error;
  
  return data.map(meal => {
    // Valider le type de repas
    const mealType = validateMealType(meal.meal_type);
    
    return {
      id: meal.id,
      originalMealName: meal.original_meal_name,
      customMealName: meal.custom_meal_name,
      scheduledTime: meal.scheduled_time,
      customTime: meal.custom_time,
      mealType,
      isAlternative: meal.is_alternative,
      date: meal.date,
    };
  });
};

const getMealType = (mealName: string): "petit-dejeuner" | "collation" | "dejeuner" | "diner" => {
  const name = mealName.toLowerCase();
  if (name.includes("petit-déjeuner")) return "petit-dejeuner";
  if (name.includes("collation")) return "collation";
  if (name.includes("déjeuner")) return "dejeuner";
  return "diner";
};

const validateMealType = (type: string): "petit-dejeuner" | "collation" | "dejeuner" | "diner" => {
  const validTypes = ["petit-dejeuner", "collation", "dejeuner", "diner"] as const;
  if (validTypes.includes(type as any)) {
    return type as "petit-dejeuner" | "collation" | "dejeuner" | "diner";
  }
  // Par défaut, retourner "collation" si le type n'est pas valide
  console.warn(`Type de repas invalide: ${type}, utilisation de "collation" par défaut`);
  return "collation";
};

export const generateQuickAlternatives = (meal: MealSchedule): MealSchedule[] => {
  const quickAlternatives: MealSchedule[] = [];
  
  if (meal.mealName.toLowerCase().includes("petit-déjeuner")) {
    quickAlternatives.push({
      ...meal,
      mealName: "Petit-déjeuner express",
      complexity: "simple",
      isPackable: true,
    });
  }
  
  if (meal.mealName.toLowerCase().includes("déjeuner")) {
    quickAlternatives.push({
      ...meal,
      mealName: "Déjeuner sur le pouce",
      complexity: "simple",
      isPackable: true,
    });
  }
  
  if (meal.mealName.toLowerCase().includes("dîner")) {
    quickAlternatives.push({
      ...meal,
      mealName: "Dîner express",
      complexity: "simple",
      isPackable: true,
    });
  }

  return quickAlternatives;
};

export const getAdaptedRecommendations = async (recommendations: FoodItem[]): Promise<FoodItem[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Utilisateur non connecté");

  // Récupérer le profil utilisateur avec ses contraintes
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return recommendations;

  // Filtrer les recommandations en fonction des allergies et du budget
  return recommendations.filter(food => {
    // Vérifier les allergies
    const hasAllergy = food.allergenes?.some(allergene => 
      profile.allergies?.includes(allergene)
    );
    if (hasAllergy) return false;

    // Vérifier le budget (si défini)
    if (profile.monthly_budget) {
      // Estimation simple : le budget quotidien divisé par le nombre de repas
      const dailyBudget = profile.monthly_budget / 30;
      const maxPricePerMeal = dailyBudget / 3; // Hypothèse de 3 repas par jour
      if (food.pricePerKg > maxPricePerMeal * 2) return false; // Marge de sécurité
    }

    return true;
  });
};
