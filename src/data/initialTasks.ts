import type { ActivityHistory, Preferences, Session, Task, TaskDraft, TimerState } from '../types';
import { addDays, fromKey, todayKey } from '../utils/dateUtils';
import { mulberry32, uid } from '../utils/storage';

type Seed = Partial<TaskDraft> & { title: string; category: Task['category'] } & {
  done?: boolean;
  tracked?: number;
};

function make(date: string, seeds: Seed[]): Task[] {
  const now = new Date().toISOString();
  return seeds.map((s, i) => ({
    id: `seed_${date}_${i}`,
    title: s.title,
    category: s.category,
    date,
    time: s.time,
    duration: s.duration,
    notes: s.notes,
    completed: !!s.done,
    completedAt: s.done ? now : undefined,
    trackedMinutes: s.tracked ?? 0,
    createdAt: now,
  }));
}

export function createInitialTasks(today = todayKey()): Task[] {
  return [
    ...make(addDays(today, -1), [
      { title: 'Learn Java — Generics deep dive', category: 'work', time: '09:00', duration: 90, done: true, tracked: 75 },
      { title: 'Read Meditations, Book II', category: 'work', duration: 30, done: true },
      { title: 'Upper-body strength session', category: 'train', time: '07:00', duration: 60, done: true, tracked: 50 },
      { title: 'Evening walk', category: 'rest', time: '19:30', duration: 30, done: true },
      { title: 'Journal — three lessons from today', category: 'rest', duration: 10, done: false },
    ]),
    ...make(today, [
      {
        title: 'Learn Java — Streams & Collections',
        category: 'work',
        time: '09:00',
        duration: 90,
        notes: 'Finish chapter 7 exercises. Write one small program using groupingBy.',
        done: true,
        tracked: 50,
      },
      {
        title: 'Build portfolio project — auth flow',
        category: 'work',
        time: '11:00',
        duration: 120,
        notes: 'Login form, validation, protected routes.',
        tracked: 25,
      },
      { title: 'Read “Letters from a Stoic” — 20 pages', category: 'work', duration: 30, done: true },
      { title: 'Finish client deliverable', category: 'work', time: '16:00', duration: 60, done: true },
      { title: 'Gym — lower-body strength', category: 'train', time: '07:00', duration: 60, done: true, tracked: 50 },
      { title: 'Run 5 km', category: 'train', time: '18:30', duration: 35, done: true },
      { title: '100 push-ups, through the day', category: 'train', notes: 'Sets of 20. No rush.' },
      { title: 'Meditation — 10 minutes', category: 'rest', duration: 10, done: true },
      { title: 'Sleep 8 hours', category: 'rest', time: '22:30', duration: 480, notes: 'Screens off at 22:00.' },
    ]),
    ...make(addDays(today, 1), [
      { title: 'Java — Concurrency basics', category: 'work', time: '09:00', duration: 90 },
      { title: 'Ship auth flow to staging', category: 'work', duration: 60 },
      { title: 'Yoga & mobility', category: 'train', time: '07:30', duration: 40 },
      { title: 'Evening walk without phone', category: 'rest', duration: 30 },
    ]),
  ];
}

/**
 * Generates ~140 days of realistic prior activity (excluding today).
 * Recent days form an unbroken streak; older days have natural gaps.
 */
export function createSeedHistory(today = todayKey()): ActivityHistory {
  const rand = mulberry32(99);
  const history: ActivityHistory = {};
  const STREAK = 16;
  for (let i = 1; i <= 140; i++) {
    const key = addDays(today, -i);
    const weekday = fromKey(key).getDay();
    const inStreak = i <= STREAK;
    const ramp = Math.max(0.35, 1 - i / 170); // consistency grows over time
    const skip = !inStreak && (i === STREAK + 1 || rand() > ramp + 0.12);
    if (skip) continue;
    const weekend = weekday === 0 || weekday === 6;
    const focus = Math.round(rand() * (weekend ? 2 : 4) * ramp + (inStreak ? 1 : 0));
    const train = rand() > 0.35 ? 1 + (rand() > 0.8 ? 1 : 0) : 0;
    const rest = Math.round(rand() * 2);
    const duties = Math.round(1 + rand() * 5 * ramp);
    history[key] = { focus, train: inStreak && focus + train === 0 ? 1 : train, rest, duties };
  }
  return history;
}

/** A few completed sessions earlier today so the dashboard looks lived-in. */
export function createInitialSessions(today = todayKey()): Session[] {
  const at = (h: number, m: number) => {
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
  return [
    { id: uid('ses'), mode: 'train', durationSec: 50 * 60, completedAt: at(7, 55), date: today, taskId: `seed_${today}_4` },
    { id: uid('ses'), mode: 'focus', durationSec: 25 * 60, completedAt: at(9, 30), date: today, taskId: `seed_${today}_0` },
    { id: uid('ses'), mode: 'rest', durationSec: 5 * 60, completedAt: at(9, 36), date: today },
    { id: uid('ses'), mode: 'focus', durationSec: 25 * 60, completedAt: at(10, 5), date: today, taskId: `seed_${today}_0` },
  ];
}

export function createDefaultPrefs(today = todayKey()): Preferences {
  return {
    name: 'Citizen',
    durations: { focus: 25, train: 50, rest: 5 },
    muted: false,
    journeyStart: addDays(today, -63),
  };
}

export function createIdleTimer(prefs: Preferences, mode: TimerState['mode'] = 'focus'): TimerState {
  return {
    mode,
    durationSec: prefs.durations[mode] * 60,
    status: 'idle',
    startedAt: null,
    elapsedMs: 0,
    sessionId: uid('ses'),
  };
}
