import type { CarPayoffNotes } from './types';

export function parseCarPayoffNotes(notes: string | null): CarPayoffNotes {
  if (!notes) {
    return {};
  }

  try {
    return JSON.parse(notes) as CarPayoffNotes;
  } catch {
    return {};
  }
}

export function stringifyCarPayoffNotes(data: CarPayoffNotes) {
  return JSON.stringify(data);
}

export function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
