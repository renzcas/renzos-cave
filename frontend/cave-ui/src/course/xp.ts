export type Progress = {
  xp: number;
  level: number;
  completedLessons: string[];
};

const XP_PER_LESSON = 50;
const XP_PER_LAB = 75;
const XP_PER_CHALLENGE = 100;

export function loadProgress(): Progress {
  const saved = localStorage.getItem("operator_progress");
  return saved
    ? JSON.parse(saved)
    : { xp: 0, level: 1, completedLessons: [] };
}

export function saveProgress(progress: Progress) {
  localStorage.setItem("operator_progress", JSON.stringify(progress));
}

export function awardXP(progress: Progress, amount: number): Progress {
  const updated = { ...progress, xp: progress.xp + amount };

  // Level up every 500 XP
  updated.level = Math.floor(updated.xp / 500) + 1;

  saveProgress(updated);
  return updated;
}

export function completeLesson(progress: Progress, lessonId: string): Progress {
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    return awardXP(progress, XP_PER_LESSON);
  }
  return progress;
}
