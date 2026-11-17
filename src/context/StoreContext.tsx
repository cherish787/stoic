import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import type {
  ActivityHistory,
  DayActivity,
  Preferences,
  Session,
  Task,
  TaskDraft,
  TimerState,
} from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, clearStorage, uid } from '../utils/storage';
import {
  createDefaultPrefs,
  createIdleTimer,
  createInitialSessions,
  createInitialTasks,
  createSeedHistory,
} from '../data/initialTasks';
import { buildActivityMap } from '../utils/streakUtils';
import { todayKey } from '../utils/dateUtils';

interface Store {
  tasks: Task[];
  sessions: Session[];
  history: ActivityHistory;
  prefs: Preferences;
  timer: TimerState;
  favoriteQuotes: string[];
  savedPosts: string[];
  activity: Record<string, DayActivity>;

  addTask: (draft: TaskDraft) => void;
  updateTask: (id: string, patch: Partial<TaskDraft>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  setTimer: (next: TimerState | ((prev: TimerState) => TimerState)) => void;
  recordSession: (session: Session) => boolean;

  setPrefs: (next: Preferences | ((prev: Preferences) => Preferences)) => void;
  toggleFavoriteQuote: (id: string) => void;
  toggleSavedPost: (id: string) => boolean;

  resetDemo: () => void;
  clearAll: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEYS.tasks, () => createInitialTasks());
  const [sessions, setSessions] = useLocalStorage<Session[]>(STORAGE_KEYS.sessions, () =>
    createInitialSessions(),
  );
  const [history, setHistory] = useLocalStorage<ActivityHistory>(STORAGE_KEYS.history, () =>
    createSeedHistory(),
  );
  const [prefs, setPrefs] = useLocalStorage<Preferences>(STORAGE_KEYS.prefs, () =>
    createDefaultPrefs(),
  );
  const [timer, setTimer] = useLocalStorage<TimerState>(STORAGE_KEYS.timer, () =>
    createIdleTimer(createDefaultPrefs()),
  );
  const [favoriteQuotes, setFavoriteQuotes] = useLocalStorage<string[]>(
    STORAGE_KEYS.favoriteQuotes,
    [],
  );
  const [savedPosts, setSavedPosts] = useLocalStorage<string[]>(STORAGE_KEYS.savedPosts, [
    'g03',
    'g11',
  ]);

  const activity = useMemo(
    () => buildActivityMap(history, sessions, tasks),
    [history, sessions, tasks],
  );

  const addTask = useCallback(
    (draft: TaskDraft) =>
      setTasks((prev) => [
        ...prev,
        {
          ...draft,
          id: uid('task'),
          completed: false,
          trackedMinutes: 0,
          createdAt: new Date().toISOString(),
        },
      ]),
    [setTasks],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<TaskDraft>) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    [setTasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setTimer((prev) => (prev.taskId === id ? { ...prev, taskId: undefined } : prev));
    },
    [setTasks, setTimer],
  );

  const toggleTask = useCallback(
    (id: string) =>
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: !t.completed,
                completedAt: t.completed ? undefined : new Date().toISOString(),
              }
            : t,
        ),
      ),
    [setTasks],
  );

  /** Returns false if this session id was already recorded (duplicate guard). */
  const recordSession = useCallback(
    (session: Session) => {
      let added = false;
      setSessions((prev) => {
        if (prev.some((s) => s.id === session.id)) return prev;
        added = true;
        return [...prev, session];
      });
      if (added && session.taskId) {
        const minutes = Math.round(session.durationSec / 60);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === session.taskId ? { ...t, trackedMinutes: t.trackedMinutes + minutes } : t,
          ),
        );
      }
      return added;
    },
    [setSessions, setTasks],
  );

  const toggleFavoriteQuote = useCallback(
    (id: string) =>
      setFavoriteQuotes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setFavoriteQuotes],
  );

  const toggleSavedPost = useCallback(
    (id: string) => {
      let nowSaved = false;
      setSavedPosts((prev) => {
        nowSaved = !prev.includes(id);
        return nowSaved ? [...prev, id] : prev.filter((x) => x !== id);
      });
      return nowSaved;
    },
    [setSavedPosts],
  );

  const resetDemo = useCallback(() => {
    clearStorage();
    const p = createDefaultPrefs();
    setTasks(createInitialTasks());
    setSessions(createInitialSessions());
    setHistory(createSeedHistory());
    setPrefs(p);
    setTimer(createIdleTimer(p));
    setFavoriteQuotes([]);
    setSavedPosts(['g03', 'g11']);
  }, [setTasks, setSessions, setHistory, setPrefs, setTimer, setFavoriteQuotes, setSavedPosts]);

  const clearAll = useCallback(() => {
    clearStorage();
    const p = createDefaultPrefs();
    setTasks([]);
    setSessions([]);
    setHistory({});
    setPrefs({ ...p, journeyStart: todayKey() });
    setTimer(createIdleTimer(p));
    setFavoriteQuotes([]);
    setSavedPosts([]);
  }, [setTasks, setSessions, setHistory, setPrefs, setTimer, setFavoriteQuotes, setSavedPosts]);

  const value: Store = {
    tasks,
    sessions,
    history,
    prefs,
    timer,
    favoriteQuotes,
    savedPosts,
    activity,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setTimer,
    recordSession,
    setPrefs,
    toggleFavoriteQuote,
    toggleSavedPost,
    resetDemo,
    clearAll,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
