import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Flame, CalendarCheck2, Hourglass, Swords, Shield, Moon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DisciplineHeatmap, HeatLegend } from '../components/DisciplineHeatmap';
import { TimerStage } from '../components/TimerStage';
import { QuoteCard } from '../components/QuoteCard';
import { lastNDays, todayKey, formatMinutes } from '../utils/dateUtils';
import { countWhere, currentStreak } from '../utils/streakUtils';
import { PageIntro } from '../components/PageIntro';

export function FocusPage() {
  const { activity, sessions, tasks, prefs } = useStore();
  const keys = useMemo(() => lastNDays(99), []);
  const streak = currentStreak(activity);
  const activeDays = countWhere(keys, activity);

  const today = todayKey();
  const todays = sessions.filter((s) => s.date === today);
  const minutesFor = (m: 'focus' | 'train' | 'rest') =>
    Math.round(todays.filter((s) => s.mode === m).reduce((n, s) => n + s.durationSec, 0) / 60);
  const dutiesToday = tasks.filter((t) => t.date === today);
  const dutiesDone = dutiesToday.filter((t) => t.completed).length;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return 'The night watch';
    if (h < 12) return 'Ave, ' + prefs.name;
    if (h < 18) return 'Hold the line, ' + prefs.name;
    return 'Vesper, ' + prefs.name;
  })();

  return (
    <div className="space-y-5 lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:items-start lg:gap-6 lg:space-y-0">
      <div className="space-y-5 lg:sticky lg:top-[84px]">
        <PageIntro eyebrow={greeting} title="The Arena of the Mind" className="lg:hidden" />
        {/* Discipline log first on mobile */}
        <div className="lg:hidden">
          <DisciplineLog keys={keys} streak={streak} activeDays={activeDays} />
        </div>
        <TimerStage />
      </div>

      <div className="space-y-5">
        <PageIntro eyebrow={greeting} title="The Arena of the Mind" className="hidden lg:block" />
        <div className="hidden lg:block">
          <DisciplineLog keys={keys} streak={streak} activeDays={activeDays} />
        </div>

        <section className="panel p-5" aria-label="Today's record">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="label-caps">Today’s Record</h2>
            <span className="text-[12px] text-muted tabular-nums">
              {todays.length} session{todays.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Tally icon={<Swords size={15} />} color="#C08158" label="Focus" value={formatMinutes(minutesFor('focus'))} />
            <Tally icon={<Shield size={15} />} color="#A9A06A" label="Train" value={formatMinutes(minutesFor('train'))} />
            <Tally icon={<Moon size={15} />} color="#8597A6" label="Rest" value={formatMinutes(minutesFor('rest'))} />
            <Tally icon={<CalendarCheck2 size={15} />} color="#AD9162" label="Duties" value={`${dutiesDone}/${dutiesToday.length}`} />
          </div>
        </section>

        <QuoteCard />
      </div>
    </div>
  );
}

function DisciplineLog({ keys, streak, activeDays }: { keys: string[]; streak: number; activeDays: number }) {
  const { activity } = useStore();
  return (
    <section className="panel p-5" aria-labelledby="dlog-title">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 id="dlog-title" className="label-caps">Discipline Log</h2>
          <p className="mt-1 text-[12.5px] text-muted">Last 99 days · tap a day to inspect</p>
        </div>
        <div className="flex gap-4 text-right">
          <Stat icon={<Flame size={13} className="text-[#C08158]" />} value={streak} label="Day streak" />
          <Stat icon={<Hourglass size={13} className="text-brass" />} value={activeDays} label="Active days" />
        </div>
      </div>
      <DisciplineHeatmap keys={keys} activity={activity} ariaLabel="Discipline log, last 99 days" />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-muted">{Math.round((activeDays / 99) * 100)}% of days active</span>
        <HeatLegend />
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <div>
      <div className="flex items-center justify-end gap-1.5 font-display text-[22px] leading-none font-semibold text-ivory tabular-nums">
        {icon}
        {value}
      </div>
      <div className="mt-1 text-[10px] tracking-[0.14em] text-muted uppercase">{label}</div>
    </div>
  );
}

function Tally({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="panel-inset px-3.5 py-3">
      <div className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] text-sub uppercase">
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <div className="mt-1.5 text-[20px] font-semibold tracking-tight text-ivory tabular-nums">{value}</div>
    </div>
  );
}
