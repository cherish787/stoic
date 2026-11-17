import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flag, Flame, Trophy, CalendarCheck2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useStore } from '../context/StoreContext';
import { DisciplineHeatmap, HeatLegend } from './DisciplineHeatmap';
import { addDays, formatShort, todayKey, toRoman } from '../utils/dateUtils';
import { bestStreak, countWhere, currentStreak, isDisciplined, journeyDay } from '../utils/streakUtils';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useToast } from '../context/ToastContext';

export function JourneySection() {
  const { activity, prefs, setPrefs } = useStore();
  const toast = useToast();
  const wide = useMediaQuery('(min-width: 1024px)');
  const start = prefs.journeyStart;
  const keys = useMemo(() => Array.from({ length: 99 }, (_, i) => addDays(start, i)), [start]);
  const today = todayKey();
  const day = journeyDay(start, today);
  const elapsed = keys.filter((k) => k <= today);
  const completed = countWhere(elapsed, activity, isDisciplined);
  const streak = currentStreak(activity, isDisciplined, today);
  const best = Math.max(bestStreak(elapsed, activity, isDisciplined), streak);
  const pct = Math.round((completed / 99) * 100);
  const finished = day > 99;

  return (
    <section className="panel overflow-hidden p-5 sm:p-6" aria-labelledby="journey-title">
      <div
        className="pointer-events-none absolute -top-10 -right-6 font-display text-[120px] leading-none font-semibold text-ivory/[0.03] select-none"
        aria-hidden
      >
        XCIX
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="journey-title" className="label-caps">The 99-Day Journey</h2>
          <p className="mt-1.5 font-serif text-[18px] leading-snug text-ivory italic">
            {finished ? 'The journey is complete. Begin another?' : `Day ${toRoman(Math.max(day, 1))} — ${Math.max(day, 1)} of 99`}
          </p>
          <p className="mt-1 text-[12.5px] text-muted">
            Began {formatShort(start)} · ends {formatShort(keys[98])}. A missed day is not a failure — only a day.
          </p>
        </div>
        {finished && (
          <button
            className="btn-primary"
            onClick={() => {
              setPrefs((p) => ({ ...p, journeyStart: today }));
              toast('A new 99-day journey begins');
            }}
          >
            <Flag size={15} /> Begin anew
          </button>
        )}
      </div>

      {/* progress bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] text-sub">
          <span className="tracking-[0.14em] uppercase">Overall progress</span>
          <span className="font-medium text-ivory tabular-nums">{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line-soft">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-wine via-[#8d6248] to-brass"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <JStat icon={<CalendarCheck2 size={14} />} label="Completed days" value={`${completed}`} />
        <JStat icon={<Flame size={14} />} label="Current streak" value={`${streak}`} />
        <JStat icon={<Trophy size={14} />} label="Best streak" value={`${best}`} />
        <JStat icon={<Flag size={14} />} label="Days remaining" value={`${Math.max(0, 99 - Math.max(day, 0))}`} />
      </div>

      <div className="mt-6">
        <DisciplineHeatmap
          keys={keys}
          activity={activity}
          layout="journey"
          columns={wide ? 33 : 11}
          startKey={start}
          ariaLabel="99-day journey calendar"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
        <span>A day counts when a focus or training session meets real effort.</span>
        <HeatLegend />
      </div>
    </section>
  );
}

function JStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="panel-inset px-3.5 py-3">
      <div className="flex items-center gap-1.5 text-[10.5px] tracking-[0.12em] text-sub uppercase">
        <span className="text-brass">{icon}</span>
        {label}
      </div>
      <div className="mt-1.5 font-display text-[22px] font-semibold text-ivory tabular-nums">{value}</div>
    </div>
  );
}
