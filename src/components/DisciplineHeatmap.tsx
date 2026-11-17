import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Moon, Swords, CheckCircle2, X } from 'lucide-react';
import type { DayActivity } from '../types';
import { HEAT_COLORS } from '../data/theme';
import { formatLong, fromKey, todayKey } from '../utils/dateUtils';
import { EMPTY_DAY, intensity, isDisciplined } from '../utils/streakUtils';

interface Props {
  keys: string[];
  activity: Record<string, DayActivity>;
  layout?: 'weeks' | 'journey';
  /** journey layout: number of columns */
  columns?: number;
  /** journey layout: day-number labels relative to this start date */
  startKey?: string;
  ariaLabel: string;
}

interface Selected {
  key: string;
  x: number;
  y: number;
  above: boolean;
}

export function DisciplineHeatmap({ keys, activity, layout = 'weeks', columns = 11, startKey, ariaLabel }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Selected | null>(null);
  const today = todayKey();

  // Weeks layout: pad to start on Monday so rows are weekdays
  const cells = useMemo(() => {
    if (layout !== 'weeks') return keys.map((k) => ({ key: k as string | null }));
    const firstDow = (fromKey(keys[0]).getDay() + 6) % 7; // Monday = 0
    return [...Array.from({ length: firstDow }, () => ({ key: null })), ...keys.map((k) => ({ key: k }))];
  }, [keys, layout]);

  const weekCount = Math.ceil(cells.length / 7);

  const monthLabels = useMemo(() => {
    if (layout !== 'weeks') return [];
    const labels: { col: number; label: string }[] = [];
    let last = -1;
    cells.forEach((c, i) => {
      if (!c.key) return;
      const d = fromKey(c.key);
      const col = Math.floor(i / 7);
      if (d.getMonth() !== last && (d.getDate() <= 7 || labels.length === 0)) {
        if (!labels.some((l) => Math.abs(l.col - col) < 3)) {
          labels.push({ col, label: d.toLocaleDateString(undefined, { month: 'short' }) });
        }
        last = d.getMonth();
      }
    });
    return labels;
  }, [cells, layout]);

  const open = (key: string, el: HTMLElement) => {
    if (!wrap.current) return;
    if (selected?.key === key) return setSelected(null);
    const box = wrap.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const y = r.top - box.top;
    setSelected({ key, x: r.left - box.left + r.width / 2, y: y, above: y > 150 });
  };

  useEffect(() => {
    if (!selected) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setSelected(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  // Close the popover if the layout width changes
  useLayoutEffect(() => {
    const onResize = () => setSelected(null);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const renderCell = (key: string | null, i: number) => {
    if (!key) return <span key={`pad-${i}`} aria-hidden className="aspect-square" />;
    const a = activity[key];
    const future = key > today;
    const level = future ? 0 : intensity(a);
    const isToday = key === today;
    const isSel = selected?.key === key;
    const dayNo = startKey ? keys.indexOf(key) + 1 : undefined;
    const counted = layout === 'journey' && !future && isDisciplined(a);
    return (
      <button
        key={key}
        type="button"
        disabled={future}
        onClick={(e) => open(key, e.currentTarget)}
        aria-label={`${formatLong(key)}${future ? ', upcoming' : `, activity level ${level} of 4`}`}
        className={`group relative aspect-square rounded-[3px] transition-[transform,box-shadow] duration-150 ${
          future ? 'border border-dashed border-line-soft bg-transparent' : 'hover:scale-[1.18] hover:z-10'
        } ${layout === 'journey' ? 'rounded-[5px]' : ''}`}
        style={{
          background: future ? undefined : HEAT_COLORS[level],
          boxShadow: isSel
            ? '0 0 0 1.5px #E4DDCF'
            : isToday
              ? '0 0 0 1.5px #AD9162'
              : level > 0
                ? 'inset 0 1px 0 rgba(255,240,215,0.06)'
                : 'inset 0 0 0 1px rgba(65,57,47,0.45)',
        }}
      >
        {layout === 'journey' && dayNo !== undefined && (
          <span
            className={`absolute inset-0 grid place-items-center text-[9px] font-medium tabular-nums sm:text-[10px] ${
              future ? 'text-muted/60' : counted ? 'text-ivory/85' : 'text-sub/50'
            }`}
          >
            {dayNo}
          </span>
        )}
      </button>
    );
  };

  const selAct = selected ? activity[selected.key] ?? EMPTY_DAY : EMPTY_DAY;
  const wrapWidth = wrap.current?.clientWidth ?? 320;
  const popW = 220;
  const popLeft = selected ? Math.min(Math.max(selected.x - popW / 2, 0), wrapWidth - popW) : 0;

  return (
    <div ref={wrap} className="relative" role="group" aria-label={ariaLabel}>
      {layout === 'weeks' ? (
        <div className="flex gap-2">
          <div className="grid shrink-0 grid-rows-7 gap-[3px] pt-[18px] text-[9px] text-muted sm:gap-1" aria-hidden>
            {['M', '', 'W', '', 'F', '', ''].map((d, i) => (
              <span key={i} className="flex items-center leading-none">{d}</span>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className="relative mb-1.5 h-3 text-[9px] tracking-wider text-muted uppercase" aria-hidden>
              {monthLabels.map((m) => (
                <span key={m.col} className="absolute" style={{ left: `${(m.col / weekCount) * 100}%` }}>
                  {m.label}
                </span>
              ))}
            </div>
            <div
              className="grid grid-flow-col grid-rows-7 gap-[3px] sm:gap-1"
              style={{ gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))` }}
            >
              {cells.map((c, i) => renderCell(c.key, i))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-1 sm:gap-1.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {cells.map((c, i) => renderCell(c.key, i))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.key}
            role="dialog"
            aria-label={`Activity on ${formatLong(selected.key)}`}
            initial={{ opacity: 0, y: selected.above ? 6 : -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute z-30 rounded-xl border border-line bg-elevated p-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
            style={{
              width: popW,
              left: popLeft,
              top: selected.above ? undefined : selected.y + 30,
              bottom: selected.above ? (wrap.current?.clientHeight ?? 0) - selected.y + 8 : undefined,
            }}
          >
            <div className="mb-2.5 flex items-start justify-between gap-2">
              <div>
                <div className="font-display text-[12px] font-semibold tracking-[0.08em] text-ivory">
                  {formatLong(selected.key)}
                </div>
                <div className="mt-0.5 text-[11px] text-muted">
                  {isDisciplined(selAct) ? 'A disciplined day' : intensity(selAct) ? 'Some effort recorded' : 'No activity recorded'}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="-mt-1 -mr-1 rounded p-1 text-muted hover:text-ivory" aria-label="Close">
                <X size={14} />
              </button>
            </div>
            <ul className="space-y-1.5 text-[12.5px]">
              <Row icon={<Swords size={13} />} label="Focus sessions" value={selAct.focus} color="#C08158" />
              <Row icon={<Flame size={13} />} label="Training sessions" value={selAct.train} color="#A9A06A" />
              <Row icon={<Moon size={13} />} label="Rest sessions" value={selAct.rest} color="#8597A6" />
              <Row icon={<CheckCircle2 size={13} />} label="Duties completed" value={selAct.duties} color="#AD9162" />
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ icon, label, value, color }: { icon: ReactNode; label: string; value: number; color: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sub">
        <span style={{ color }}>{icon}</span>
        {label}
      </span>
      <span className="font-medium tabular-nums text-ivory">{value}</span>
    </li>
  );
}

export function HeatLegend() {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-muted" aria-label="Activity legend: less to more">
      <span>Less</span>
      {HEAT_COLORS.map((c, i) => (
        <span key={c} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: c, boxShadow: i === 0 ? 'inset 0 0 0 1px rgba(65,57,47,0.6)' : undefined }} />
      ))}
      <span>More</span>
    </div>
  );
}
