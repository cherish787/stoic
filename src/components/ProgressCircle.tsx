import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  label: string;
  done: number;
  total: number;
  color: string;
  size?: number;
}

export function ProgressCircle({ label, done, total, color, size = 104 }: Props) {
  const reduce = useReducedMotion();
  const pct = total ? done / total : 0;
  const stroke = 5;
  const r = (size - stroke * 2 - 8) / 2;
  const c = 2 * Math.PI * r;
  const complete = total > 0 && done === total;

  return (
    <div className="flex flex-col items-center" role="img" aria-label={`${label}: ${done} of ${total} duties complete, ${Math.round(pct * 100)}%`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          <circle cx={size / 2} cy={size / 2} r={r + 6} fill="#1D1B18" stroke="rgba(65,57,47,0.6)" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(65,57,47,0.9)" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - pct) }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-[22px] leading-none font-semibold text-ivory tabular-nums">
            {done}
            <span className="text-[14px] text-muted">/{total}</span>
          </div>
          <div className="mt-1 text-[11px] font-medium tabular-nums" style={{ color }}>
            {Math.round(pct * 100)}%
          </div>
        </div>
        {complete && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="absolute -top-0.5 right-1 h-3 w-3 rotate-45 border border-base"
            style={{ background: color }}
            aria-hidden
          />
        )}
      </div>
      <div className="mt-2.5 font-display text-[11px] font-semibold tracking-[0.24em] uppercase" style={{ color }}>
        {label}
      </div>
    </div>
  );
}
