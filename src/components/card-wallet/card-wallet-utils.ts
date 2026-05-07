export function getCurrentWeekNumber(date: string) {
  const day = new Date(`${date}T12:00:00`).getDate();
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
}
