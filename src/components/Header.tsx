import { motion } from 'framer-motion';
import { Settings2 } from 'lucide-react';
import type { Screen } from '../types';
import { Emblem } from './Emblem';
import { NAV_ITEMS } from './BottomNavigation';
import { useTimerContext } from '../context/TimerContext';
import { MODE_THEMES } from '../data/theme';
import { formatClock, toRoman } from '../utils/dateUtils';

interface Props {
  screen: Screen;
  onNavigate: (s: Screen) => void;
  onOpenSettings: () => void;
}

export function Header({ screen, onNavigate, onOpenSettings }: Props) {
  const { timer, remainingSec } = useTimerContext();
  const now = new Date();
  const dateLabel = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const romanYear = toRoman(now.getFullYear());
  const active = timer.status === 'running' || timer.status === 'paused';
  const theme = MODE_THEMES[timer.mode];

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft/70 bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center gap-3 px-4 sm:px-6">
        <button
          onClick={() => onNavigate('focus')}
          className="flex items-center gap-2.5 rounded-lg"
          aria-label="STOIC — go to Focus"
        >
          <Emblem size={30} />
          <div className="text-left leading-none">
            <div className="font-display text-[19px] font-semibold tracking-[0.32em] text-ivory">STOIC</div>
            <div className="mt-1 hidden font-display text-[9px] tracking-[0.3em] text-muted sm:block">
              ANNO {romanYear}
            </div>
          </div>
        </button>

        {/* Desktop navigation */}
        <nav className="mx-auto hidden items-center gap-1 rounded-full border border-line-soft bg-surface/80 p-1 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const selected = item.id === screen;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-current={selected ? 'page' : undefined}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 font-display text-[11px] font-semibold tracking-[0.2em] transition-colors ${
                  selected ? 'text-ivory' : 'text-muted hover:text-sub'
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="desk-nav-pill"
                    className="absolute inset-0 rounded-full border border-line bg-elevated"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <item.icon size={14} className="relative" strokeWidth={1.75} />
                <span className="relative uppercase">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {active && screen !== 'focus' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onNavigate('focus')}
              className="flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-[12px] tabular-nums text-ivory"
              aria-label={`${theme.label} timer ${timer.status}, ${formatClock(remainingSec)} remaining`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${timer.status === 'running' ? 'animate-pulse' : ''}`}
                style={{ background: theme.accent }}
              />
              {formatClock(remainingSec)}
            </motion.button>
          )}
          <span className="font-display text-[10px] tracking-[0.14em] text-sub uppercase sm:text-[11px] sm:tracking-[0.18em]">
            {dateLabel}
          </span>
          <button onClick={onOpenSettings} className="icon-btn" aria-label="Profile and settings">
            <Settings2 size={18} strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </header>
  );
}
