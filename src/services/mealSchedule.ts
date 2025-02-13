
interface MealTiming {
  mealName: string;
  idealTimeOffset: number; // minutes après le réveil
  flexibilityRange: number; // minutes de flexibilité avant/après
}

const mealTimingsByGoal: { [key: string]: MealTiming[] } = {
  prise_masse: [
    { mealName: "Petit-déjeuner", idealTimeOffset: 30, flexibilityRange: 30 },
    { mealName: "Collation matinale", idealTimeOffset: 180, flexibilityRange: 30 },
    { mealName: "Déjeuner", idealTimeOffset: 360, flexibilityRange: 45 },
    { mealName: "Collation après-midi", idealTimeOffset: 540, flexibilityRange: 30 },
    { mealName: "Dîner", idealTimeOffset: 720, flexibilityRange: 45 },
    { mealName: "Collation nocturne", idealTimeOffset: 840, flexibilityRange: 30 }
  ],
  perte_poids: [
    { mealName: "Petit-déjeuner", idealTimeOffset: 30, flexibilityRange: 30 },
    { mealName: "Collation matinale", idealTimeOffset: 180, flexibilityRange: 30 },
    { mealName: "Déjeuner", idealTimeOffset: 360, flexibilityRange: 45 },
    { mealName: "Collation après-midi", idealTimeOffset: 540, flexibilityRange: 30 }
  ],
  seche: [
    { mealName: "Petit-déjeuner", idealTimeOffset: 30, flexibilityRange: 30 },
    { mealName: "Collation matinale", idealTimeOffset: 180, flexibilityRange: 30 },
    { mealName: "Déjeuner", idealTimeOffset: 360, flexibilityRange: 45 },
    { mealName: "Collation après-midi", idealTimeOffset: 540, flexibilityRange: 30 },
    { mealName: "Dîner", idealTimeOffset: 720, flexibilityRange: 45 }
  ]
};

export interface MealSchedule {
  mealName: string;
  scheduledTime: string;
  flexibilityBefore: string;
  flexibilityAfter: string;
}

export const generateMealSchedule = (
  wakeUpTime: string,
  bedTime: string,
  goal: string,
  numberOfMeals: number
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
      flexibilityAfter
    };
  });
};
