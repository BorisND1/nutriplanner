
import { supabase } from "@/integrations/supabase/client";

interface MealTiming {
  mealName: string;
  idealTimeOffset: number; // minutes après le réveil
  flexibilityRange: number; // minutes de flexibilité avant/après
  complexity: "simple" | "moderate" | "elaborate";
  isPackable: boolean; // indique si le repas peut être préparé à l'avance et emporté
}

const mealTimingsByGoal: { [key: string]: MealTiming[] } = {
  prise_masse: [
    { mealName: "Petit-déjeuner", idealTimeOffset: 30, flexibilityRange: 30, complexity: "simple", isPackable: false },
    { mealName: "Collation matinale", idealTimeOffset: 180, flexibilityRange: 30, complexity: "simple", isPackable: true },
    { mealName: "Déjeuner", idealTimeOffset: 360, flexibilityRange: 45, complexity: "moderate", isPackable: true },
    { mealName: "Collation après-midi", idealTimeOffset: 540, flexibilityRange: 30, complexity: "simple", isPackable: true },
    { mealName: "Dîner", idealTimeOffset: 720, flexibilityRange: 45, complexity: "elaborate", isPackable: false },
    { mealName: "Collation nocturne", idealTimeOffset: 840, flexibilityRange: 30, complexity: "simple", isPackable: false }
  ],
  perte_poids: [
    { mealName: "Petit-déjeuner", idealTimeOffset: 30, flexibilityRange: 30, complexity: "moderate", isPackable: false },
    { mealName: "Collation matinale", idealTimeOffset: 180, flexibilityRange: 30, complexity: "simple", isPackable: true },
    { mealName: "Déjeuner", idealTimeOffset: 360, flexibilityRange: 45, complexity: "moderate", isPackable: true },
    { mealName: "Collation après-midi", idealTimeOffset: 540, flexibilityRange: 30, complexity: "simple", isPackable: true }
  ],
  seche: [
    { mealName: "Petit-déjeuner", idealTimeOffset: 30, flexibilityRange: 30, complexity: "moderate", isPackable: false },
    { mealName: "Collation matinale", idealTimeOffset: 180, flexibilityRange: 30, complexity: "simple", isPackable: true },
    { mealName: "Déjeuner", idealTimeOffset: 360, flexibilityRange: 45, complexity: "moderate", isPackable: true },
    { mealName: "Collation après-midi", idealTimeOffset: 540, flexibilityRange: 30, complexity: "simple", isPackable: true },
    { mealName: "Dîner", idealTimeOffset: 720, flexibilityRange: 45, complexity: "elaborate", isPackable: false }
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
  workSchedule?: WorkSchedule
): MealSchedule[] => {
  const mealTimings = [...mealTimingsByGoal[goal]];
  
  // Si le nombre de repas demandé est inférieur au nombre de repas dans le timing
  // on retire des collations en priorité
  while (mealTimings.length > numberOfMeals) {
    const snackIndex = mealTimings.findIndex(meal => meal.mealName.includes("Collation"));
    if (snackIndex !== -1) {
      mealTimings.splice(snackIndex, 1);
    } else {
      mealTimings.pop(); // Si plus de collations, on retire le dernier repas
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
      isPackable: timing.isPackable
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

  const mealSchedules = schedule.map(meal => ({
    user_id: user.id,
    original_meal_name: meal.mealName,
    scheduled_time: meal.scheduledTime,
    meal_type: getMealType(meal.mealName),
    date: date,
  }));

  const { error } = await supabase
    .from('meal_schedules')
    .upsert(mealSchedules, { onConflict: 'user_id,date,original_meal_name' });

  if (error) throw error;
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
  return data.map(meal => ({
    id: meal.id,
    originalMealName: meal.original_meal_name,
    customMealName: meal.custom_meal_name,
    scheduledTime: meal.scheduled_time,
    customTime: meal.custom_time,
    mealType: meal.meal_type,
    isAlternative: meal.is_alternative,
    date: meal.date,
  }));
};

const getMealType = (mealName: string): "petit-dejeuner" | "collation" | "dejeuner" | "diner" => {
  const name = mealName.toLowerCase();
  if (name.includes("petit-déjeuner")) return "petit-dejeuner";
  if (name.includes("collation")) return "collation";
  if (name.includes("déjeuner")) return "dejeuner";
  return "diner";
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
