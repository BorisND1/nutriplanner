
interface MealTiming {
  mealName: string;
  idealTimeOffset: number; // minutes après le réveil
  flexibilityRange: number; // minutes de flexibilité avant/après
  complexity: "simple" | "moderate" | "elaborate";
  isPackable: boolean; // indique si le repas peut être préparé à l'avance et emporté
  timeWindow?: { start: number; end: number }; // plage horaire idéale en minutes depuis minuit
}

const mealTimingsByGoal: { [key: string]: MealTiming[] } = {
  prise_masse: [
    { 
      mealName: "Petit-déjeuner", 
      idealTimeOffset: 30, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: false,
      timeWindow: { start: 6 * 60, end: 10 * 60 } // 6h-10h
    },
    { 
      mealName: "Collation matinale", 
      idealTimeOffset: 180, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: true,
      timeWindow: { start: 9 * 60, end: 11 * 60 } // 9h-11h
    },
    { 
      mealName: "Déjeuner", 
      idealTimeOffset: 360, 
      flexibilityRange: 45, 
      complexity: "moderate", 
      isPackable: true,
      timeWindow: { start: 12 * 60, end: 14 * 60 } // 12h-14h
    },
    { 
      mealName: "Collation après-midi", 
      idealTimeOffset: 540, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: true,
      timeWindow: { start: 15 * 60, end: 17 * 60 } // 15h-17h
    },
    { 
      mealName: "Dîner", 
      idealTimeOffset: 720, 
      flexibilityRange: 45, 
      complexity: "elaborate", 
      isPackable: false,
      timeWindow: { start: 19 * 60, end: 21 * 60 } // 19h-21h
    },
    { 
      mealName: "Collation nocturne", 
      idealTimeOffset: 840, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: false,
      timeWindow: { start: 21 * 60, end: 22 * 60 } // 21h-22h
    }
  ],
  perte_poids: [
    { 
      mealName: "Petit-déjeuner", 
      idealTimeOffset: 30, 
      flexibilityRange: 30, 
      complexity: "moderate", 
      isPackable: false,
      timeWindow: { start: 6 * 60, end: 9 * 60 } // 6h-9h
    },
    { 
      mealName: "Collation matinale", 
      idealTimeOffset: 180, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: true,
      timeWindow: { start: 10 * 60, end: 11 * 60 } // 10h-11h
    },
    { 
      mealName: "Déjeuner", 
      idealTimeOffset: 360, 
      flexibilityRange: 45, 
      complexity: "moderate", 
      isPackable: true,
      timeWindow: { start: 12 * 60, end: 14 * 60 } // 12h-14h
    },
    { 
      mealName: "Collation après-midi", 
      idealTimeOffset: 540, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: true,
      timeWindow: { start: 16 * 60, end: 17 * 60 } // 16h-17h
    }
  ],
  seche: [
    { 
      mealName: "Petit-déjeuner", 
      idealTimeOffset: 30, 
      flexibilityRange: 30, 
      complexity: "moderate", 
      isPackable: false,
      timeWindow: { start: 6 * 60, end: 9 * 60 } // 6h-9h
    },
    { 
      mealName: "Collation matinale", 
      idealTimeOffset: 180, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: true,
      timeWindow: { start: 10 * 60, end: 11 * 60 } // 10h-11h
    },
    { 
      mealName: "Déjeuner", 
      idealTimeOffset: 360, 
      flexibilityRange: 45, 
      complexity: "moderate", 
      isPackable: true,
      timeWindow: { start: 12 * 60, end: 14 * 60 } // 12h-14h
    },
    { 
      mealName: "Collation après-midi", 
      idealTimeOffset: 540, 
      flexibilityRange: 30, 
      complexity: "simple", 
      isPackable: true,
      timeWindow: { start: 16 * 60, end: 17 * 60 } // 16h-17h
    },
    { 
      mealName: "Dîner", 
      idealTimeOffset: 720, 
      flexibilityRange: 45, 
      complexity: "elaborate", 
      isPackable: false,
      timeWindow: { start: 19 * 60, end: 21 * 60 } // 19h-21h
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
  timeWindowStart?: string;
  timeWindowEnd?: string;
}

const adjustMealTimingForWorkDay = (
  meal: MealTiming,
  workSchedule: WorkSchedule,
  wakeTimeInMinutes: number
): { adjustedTime: number; complexity: "simple" | "moderate" | "elaborate" } => {
  const startTimeMinutes = parseInt(workSchedule.startTime.split(':')[0]) * 60 + parseInt(workSchedule.startTime.split(':')[1]);
  const endTimeMinutes = parseInt(workSchedule.endTime.split(':')[0]) * 60 + parseInt(workSchedule.endTime.split(':')[1]);
  
  // Si une fenêtre de temps est définie, utiliser celle-ci comme base
  let targetTime = meal.timeWindow 
    ? (meal.timeWindow.start + meal.timeWindow.end) / 2 
    : wakeTimeInMinutes + meal.idealTimeOffset;

  // Si c'est l'heure du déjeuner et qu'il y a une pause déjeuner fixe
  if (meal.mealName === "Déjeuner" && workSchedule.lunchBreak.isFixedTime && workSchedule.lunchBreak.fixedStartTime) {
    const fixedLunchTime = workSchedule.lunchBreak.fixedStartTime.split(':');
    return {
      adjustedTime: parseInt(fixedLunchTime[0]) * 60 + parseInt(fixedLunchTime[1]),
      complexity: "moderate"
    };
  }

  // Gérer les contraintes de temps de travail
  if (targetTime > startTimeMinutes - 60 && targetTime < startTimeMinutes) {
    // Repas juste avant le travail - faire simple et plus tôt
    return { adjustedTime: startTimeMinutes - 45, complexity: "simple" };
  } else if (targetTime > endTimeMinutes && targetTime < endTimeMinutes + 60) {
    // Repas juste après le travail - peut être plus élaboré
    return { adjustedTime: endTimeMinutes + 30, complexity: meal.complexity };
  }

  // Pendant les heures de travail
  if (targetTime > startTimeMinutes && targetTime < endTimeMinutes) {
    if (!meal.isPackable) {
      // Reporter à après le travail si le repas n'est pas transportable
      return { adjustedTime: endTimeMinutes + 30, complexity: "simple" };
    }
    // Garder l'heure mais simplifier la préparation
    return { adjustedTime: targetTime, complexity: "simple" };
  }

  // En dehors des heures de travail - garder le timing et la complexité d'origine
  return { adjustedTime: targetTime, complexity: meal.complexity };
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
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
    awakeTime += 24 * 60;
  }

  return mealTimings.map(timing => {
    let scheduledMinutes = wakeTimeInMinutes + timing.idealTimeOffset;
    let complexity = timing.complexity;

    // Ajuster le timing et la complexité en fonction du planning de travail et de la fenêtre de temps idéale
    if (workSchedule && workSchedule.workDays.includes(new Date().toLocaleDateString('fr-FR', { weekday: 'long' }))) {
      const adjusted = adjustMealTimingForWorkDay(timing, workSchedule, wakeTimeInMinutes);
      scheduledMinutes = adjusted.adjustedTime;
      complexity = adjusted.complexity;
    } else if (timing.timeWindow) {
      // Si en dehors de la fenêtre de temps idéale, ajuster vers la fenêtre la plus proche
      if (scheduledMinutes < timing.timeWindow.start) {
        scheduledMinutes = timing.timeWindow.start;
      } else if (scheduledMinutes > timing.timeWindow.end) {
        scheduledMinutes = timing.timeWindow.end;
      }
    }

    // Normaliser à 24h
    scheduledMinutes = scheduledMinutes % (24 * 60);

    // Calculer les plages de flexibilité
    let flexBeforeMinutes = (scheduledMinutes - timing.flexibilityRange + 24 * 60) % (24 * 60);
    let flexAfterMinutes = (scheduledMinutes + timing.flexibilityRange) % (24 * 60);

    return {
      mealName: timing.mealName,
      scheduledTime: formatTime(scheduledMinutes),
      flexibilityBefore: formatTime(flexBeforeMinutes),
      flexibilityAfter: formatTime(flexAfterMinutes),
      complexity,
      isPackable: timing.isPackable,
      timeWindowStart: timing.timeWindow ? formatTime(timing.timeWindow.start) : undefined,
      timeWindowEnd: timing.timeWindow ? formatTime(timing.timeWindow.end) : undefined
    };
  });
};
