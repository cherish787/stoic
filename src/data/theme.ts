import type { Category, TimerMode } from '../types';

export interface ModeTheme {
  id: TimerMode;
  label: string;
  latin: string;
  verb: string;
  accent: string;
  accentSoft: string;
  glow: string;
  scene: string;
  caption: string;
  /** Optional photograph to layer over the painted scene, e.g. '/images/focus.jpg' */
  photo?: string;
}

export const MODE_THEMES: Record<TimerMode, ModeTheme> = {
  focus: {
    id: 'focus',
    label: 'Focus',
    latin: 'Pugna',
    verb: 'Enter the arena',
    accent: '#C08158',
    accentSoft: 'rgba(192,129,88,0.16)',
    glow: 'rgba(214,128,70,0.45)',
    scene: 'The Colosseum',
    caption: 'A battle of concentration',
  },
  train: {
    id: 'train',
    label: 'Train',
    latin: 'Exercitatio',
    verb: 'Take the field',
    accent: '#A9A06A',
    accentSoft: 'rgba(169,160,106,0.16)',
    glow: 'rgba(222,196,128,0.4)',
    scene: 'The Training Ground',
    caption: 'Drill until the body obeys',
  },
  rest: {
    id: 'rest',
    label: 'Rest',
    latin: 'Quies',
    verb: 'Return to camp',
    accent: '#8597A6',
    accentSoft: 'rgba(133,151,166,0.16)',
    glow: 'rgba(240,150,80,0.35)',
    scene: 'The Night Camp',
    caption: 'Recovery is part of the campaign',
  },
};

export const MODE_ORDER: TimerMode[] = ['focus', 'train', 'rest'];

export interface CategoryTheme {
  id: Category;
  label: string;
  motto: string;
  color: string;
  soft: string;
  mode: TimerMode;
}

export const CATEGORY_THEMES: Record<Category, CategoryTheme> = {
  work: {
    id: 'work',
    label: 'Work',
    motto: 'Build your craft',
    color: '#A8735C',
    soft: 'rgba(168,115,92,0.14)',
    mode: 'focus',
  },
  train: {
    id: 'train',
    label: 'Train',
    motto: 'Strengthen yourself',
    color: '#959163',
    soft: 'rgba(149,145,99,0.14)',
    mode: 'train',
  },
  rest: {
    id: 'rest',
    label: 'Rest',
    motto: 'Restore your strength',
    color: '#7F8D9A',
    soft: 'rgba(127,141,154,0.14)',
    mode: 'rest',
  },
};

export const CATEGORY_ORDER: Category[] = ['work', 'train', 'rest'];

/** Heatmap intensity colours: stone → brown → burgundy → bronze */
export const HEAT_COLORS = ['#26231F', '#3E3229', '#5E4136', '#80594A', '#AD8A5E'];
