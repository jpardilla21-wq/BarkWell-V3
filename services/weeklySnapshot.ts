export interface WeeklySnapshotData {
  dogId: string;
  dogName: string;
  dogPhoto: string | null;
  weekStart: string;
  weekEnd: string;
  digestiveTrend: "Improving" | "Stable" | "Needs Attention";
  avgPoopScore: number;
  topSuspects: string[];
  consistencyPct: number;
  dailyScores: number[];
  behaviorTags: string[];
}

export function getWeeklySnapshot(
  dogId: string,
  dogName: string,
  dogPhoto: string | null
): WeeklySnapshotData {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);

  const formatDate = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return {
    dogId,
    dogName,
    dogPhoto,
    weekStart: formatDate(weekStart),
    weekEnd: formatDate(today),
    digestiveTrend: "Improving",
    avgPoopScore: 73,
    topSuspects: ["Chicken", "Dairy"],
    consistencyPct: 86,
    dailyScores: [62, 70, 70, 68, 78, 78, 85],
    behaviorTags: ["Itchy", "Low Energy", "Gassy"],
  };
}
