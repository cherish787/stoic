import { motion } from 'framer-motion';
import { Moon, Swords, Shield } from 'lucide-react';
import type { TimerMode } from '../types';
import { MODE_ORDER, MODE_THEMES } from '../data/theme';

const ICONS = { focus: Swords, train: Shield, rest: Moon } as const;

export function TimerModeSelector({ mode, onChange }: { mode: TimerMode; onChange: (m: TimerMode) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Timer mode"
      className="relative grid grid-cols-3 gap-1 rounded-full border border-white/10 bg-black/35 p-1 backdrop-blur-md"
    >
      {MODE_ORDER.map((m) => {
        const t = MODE_THEMES[m];
        const Icon = ICONS[m];
        const active = m === mode;
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m)}
            className={`relative flex items-center justify-center gap-1.5 rounded-full px-3 py-2 font-display text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors sm:px-5 ${
              active ? 'text-ivory' : 'text-ivory/55 hover:text-ivory/80'
            }`}
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full border"
                style={{ background: 'rgba(21,20,18,0.72)', borderColor: `${t.accent}66` }}
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              />
            )}
            <Icon size={13} className="relative" style={{ color: active ? t.accent : undefined }} strokeWidth={1.8} />
            <span className="relative">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
