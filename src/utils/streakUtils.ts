import type { ActivityHistory, DayActivity, Session, Task } from '../types';
import { addDays, diffDays, todayKey } from './dateUtils';

export const EMPTY_DAY: DayActivity = { focus: 0, train: 0, rest: 0, duties: 0 };

/** Merge seeded history, recorded sessions and completed duties into one map. */
export function buildActivityMap(
  history: ActivityHistory,
  sessions: Session[],
  tasks: Task[],
): Record<string, DayActivity> {
  const map: Record<string, DayActivity> = {};
  const get = (k: string) => (map[k] ??= { ...(history[k] ?? EMPTY_DAY) });
  for (const k of Object.keys(history)) get(k);
  for (const s of sessions) get(s.date)[s.mode] += 1;
  for (const t of tasks) if (t.completed) get(t.date).duties += 1;
  return map;
}

export function dayScore(a: DayActivity | undefined): number {
  if (!a) return 0;
  return a.focus + a.train + a.duties + a.rest * 0.5;
}

/** 0–4 intensity bucket used by the heatmaps */
export function intensity(a: DayActivity | undefined): 0 | 1 | 2 | 3 | 4 {
  const s = dayScore(a);
  if (s <= 0) return 0;
  if (s < 2) return 1;
  if (s < 4) return 2;
  if (s < 6.5) return 3;
  return 4;
}

export const isActive = (a: DayActivity | undefined) => dayScore(a) > 0;

/** A day "counts" toward the 99-day journey when real work met real effort. */
export const isDisciplined = (a: DayActivity | undefined) =>
  !!a && a.focus + a.train >= 1 && dayScore(a) >= 3;

/**
 * Consecutive days satisfying `pred`, ending today. If today has nothing yet,
 * the streak is still alive and is counted from yesterday.
 */
export function currentStreak(
  map: Record<string, DayActivity>,
  pred: (a: DayActivity | undefined) => boolean = isActive,
  today = todayKey(),
): number {
  let cursor = pred(map[today]) ? today : addDays(today, -1);
  let n = 0;
  while (pred(map[cursor])) {
    n += 1;
    cursor = addDays(cursor, -1);
  }
  return n;
}

export function bestStreak(
  keys: string[],
  map: Record<string, DayActivity>,
  pred: (a: DayActivity | undefined) => boolean = isActive,
): number {
  let best = 0;
  let run = 0;
  for (const k of keys) {
    if (pred(map[k])) {
      run += 1;
      best = Math.max(best, run);
    } else run = 0;
  }
  return best;
}

export function countWhere(
  keys: string[],
  map: Record<string, DayActivity>,
  pred: (a: DayActivity | undefined) => boolean = isActive,
): number {
  return keys.reduce((n, k) => n + (pred(map[k]) ? 1 : 0), 0);
}

/** Day number (1-based) of the 99-day journey; may exceed 99. */
export function journeyDay(start: string, today = todayKey()): number {
  return diffDays(today, start) + 1;
}
