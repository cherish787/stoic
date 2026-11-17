import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { TimerStatus } from '../types';
import type { ModeTheme } from '../data/theme';
import { formatClock } from '../utils/dateUtils';
import { Emblem } from './Emblem';

interface Props {
  progress: number;
  remainingSec: number;
  status: TimerStatus;
  theme: ModeTheme;
  durationSec: number;
}

const SIZE = 300;
const R = 128;
const C = 2 * Math.PI * R;

export function CircularTimer({ progress, remainingSec, status, theme, durationSec }: Props) {
  const reduce = useReducedMotion();
  const done = status === 'completed';
  const angle = progress * 360 - 90;
  const knobX = SIZE / 2 + R * Math.cos((angle * Math.PI) / 180);
  const knobY = SIZE / 2 + R * Math.sin((angle * Math.PI) / 180);

  const statusLabel =
    status === 'running' ? 'In battle' : status === 'paused' ? 'Holding' : done ? 'Victory' : 'Ready';

  return (
    <div
      className="relative mx-auto aspect-square w-[min(74vw,300px)] md:w-[300px]"
      role="timer"
      aria-live="off"
      aria-label={`${theme.label} timer, ${formatClock(remainingSec)} remaining`}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full -rotate-0">
        <defs>
          <radialGradient id="timer-face" cx="0.5" cy="0.42" r="0.6">
            <stop offset="0" stopColor="#1d1a17" stopOpacity="0.28" />
            <stop offset="0.7" stopColor="#0f0d0c" stopOpacity="0.45" />
            <stop offset="1" stopColor="#0f0d0c" stopOpacity="0.7" />
          </radialGradient>
        </defs>
        {/* glass face */}
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R + 22} fill="url(#timer-face)" />
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R + 22} fill="none" stroke="rgba(228,221,207,0.08)" />
        {/* sundial ticks */}
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
          const major = i % 5 === 0;
          const r1 = R + 12;
          const r2 = R + (major ? 18 : 15);
          const passed = i / 60 < progress;
          return (
            <line
              key={i}
              x1={SIZE / 2 + r1 * Math.cos(a)}
              y1={SIZE / 2 + r1 * Math.sin(a)}
              x2={SIZE / 2 + r2 * Math.cos(a)}
              y2={SIZE / 2 + r2 * Math.sin(a)}
              stroke={passed ? theme.accent : 'rgba(228,221,207,0.22)'}
              strokeOpacity={passed ? 0.9 : major ? 0.9 : 0.5}
              strokeWidth={major ? 1.6 : 1}
            />
          );
        })}
        {/* track */}
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(65,57,47,0.85)" strokeWidth={6} />
        {/* progress */}
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={theme.accent}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={C}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          initial={false}
          animate={{ strokeDashoffset: C * (1 - progress), stroke: theme.accent }}
          transition={{ duration: reduce ? 0 : status === 'running' ? 0.3 : 0.6, ease: status === 'running' ? 'linear' : 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${theme.glow})` }}
        />
        {progress > 0.002 && !done && (
          <circle cx={knobX} cy={knobY} r={5} fill="#E4DDCF" stroke={theme.accent} strokeWidth={2} />
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ rotate: -12, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <Emblem size={64} color={theme.accent} />
              </motion.div>
              <div className="mt-2 font-display text-[22px] font-semibold tracking-[0.24em] text-ivory">VICTORIA</div>
              <div className="mt-1 text-[12px] text-sub">{Math.round(durationSec / 60)} min recorded</div>
            </motion.div>
          ) : (
            <motion.div key="clock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <div className="font-display text-[11px] font-semibold tracking-[0.34em] uppercase" style={{ color: theme.accent }}>
                {theme.latin}
              </div>
              <div
                className="mt-1 font-display text-[56px] leading-none font-medium tracking-[0.02em] text-ivory tabular-nums sm:text-[62px]"
                style={{ textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {formatClock(remainingSec)}
              </div>
              <div className="mt-2.5 flex items-center gap-2 text-[11px] tracking-[0.2em] text-sub uppercase">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${status === 'running' && !reduce ? 'animate-pulse' : ''}`}
                  style={{ background: status === 'idle' ? '#777168' : theme.accent }}
                />
                {statusLabel}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
