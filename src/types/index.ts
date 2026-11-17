export type TimerMode = 'focus' | 'train' | 'rest';
export type Category = 'work' | 'train' | 'rest';
export type Screen = 'focus' | 'duties' | 'gallery';

export interface Task {
  id: string;
  title: string;
  category: Category;
  /** Day the duty belongs to (YYYY-MM-DD) */
  date: string;
  /** Optional scheduled time, "HH:MM" */
  time?: string;
  /** Estimated duration in minutes */
  duration?: number;
  notes?: string;
  completed: boolean;
  completedAt?: string;
  /** Minutes of timer sessions linked to this duty */
  trackedMinutes: number;
  createdAt: string;
}

export type TaskDraft = Omit<Task, 'id' | 'completed' | 'completedAt' | 'trackedMinutes' | 'createdAt'>;

export interface Session {
  id: string;
  mode: TimerMode;
  /** Planned length in seconds */
  durationSec: number;
  completedAt: string;
  date: string;
  taskId?: string;
}

export interface DayActivity {
  focus: number;
  train: number;
  rest: number;
  duties: number;
}

/** Imported / seeded historical activity keyed by date */
export type ActivityHistory = Record<string, DayActivity>;

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerState {
  mode: TimerMode;
  durationSec: number;
  status: TimerStatus;
  /** Epoch ms when the current running segment started */
  startedAt: number | null;
  /** Milliseconds accumulated before the current segment */
  elapsedMs: number;
  /** Stable id of the in-flight session — guards against duplicate recording */
  sessionId: string;
  taskId?: string;
  completionMessage?: string;
}

export interface Preferences {
  name: string;
  durations: Record<TimerMode, number>; // minutes
  muted: boolean;
  journeyStart: string; // YYYY-MM-DD
}

export interface Quote {
  id: string;
  text: string;
  author: 'Marcus Aurelius' | 'Seneca' | 'Epictetus';
  source: string;
}

export type GalleryCategory = 'wisdom' | 'discipline' | 'courage' | 'mindset' | 'history';

export type BackdropKind =
  | 'colosseum'
  | 'courtyard'
  | 'camp'
  | 'temple'
  | 'bust'
  | 'road'
  | 'legion'
  | 'arch';

export type PostLayout = 'center' | 'bottom' | 'top' | 'numeral' | 'framed';

export interface GalleryPost {
  id: string;
  category: GalleryCategory;
  title?: string;
  text: string;
  author: string;
  source: string;
  reflection: string;
  backdrop: BackdropKind;
  layout: PostLayout;
  tint: 'ember' | 'dusk' | 'stone' | 'wine' | 'olive';
  /** Optional photograph (e.g. /images/gallery-01.jpg). Falls back to the painted backdrop. */
  photo?: string;
}
