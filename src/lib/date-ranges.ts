export function getCurrentMonthRange(today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const next = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  return {
    start: start.toISOString().slice(0, 10),
    next: next.toISOString().slice(0, 10),
  };
}

export function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function shiftMonth(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

export function isSameMonth(a: Date, b = new Date()) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isCurrentOrFutureMonth(date: Date, today = new Date()) {
  return getMonthStart(date).getTime() >= getMonthStart(today).getTime();
}

export function getPreviousMonthRange(today = new Date()) {
  return getCurrentMonthRange(new Date(today.getFullYear(), today.getMonth() - 1, 1));
}

export function moveDateToMonth(date: string, targetMonth = new Date()) {
  const sourceDate = new Date(`${date}T12:00:00`);
  const lastDayOfTargetMonth = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth() + 1,
    0,
  ).getDate();
  const day = Math.min(sourceDate.getDate(), lastDayOfTargetMonth);

  return new Date(targetMonth.getFullYear(), targetMonth.getMonth(), day)
    .toISOString()
    .slice(0, 10);
}

export function getFridayForWeekOfMonth(weekNumber: number, targetMonth = new Date()) {
  const firstDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
  const firstFridayOffset = (5 - firstDay.getDay() + 7) % 7;
  const friday = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth(),
    1 + firstFridayOffset + ((weekNumber - 1) * 7),
  );

  if (friday.getMonth() !== targetMonth.getMonth()) {
    return moveDateToMonth(
      friday.toISOString().slice(0, 10),
      targetMonth,
    );
  }

  return friday.toISOString().slice(0, 10);
}

export function formatMonthLabel(date = new Date()) {
  return new Intl.DateTimeFormat('es-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat('es-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}
