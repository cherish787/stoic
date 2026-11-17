import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Category, Task } from '../types';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import { CATEGORY_ORDER, CATEGORY_THEMES } from '../data/theme';
import { ProgressCircle } from '../components/ProgressCircle';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { JourneySection } from '../components/JourneySection';
import { Emblem } from '../components/Emblem';
import { addDays, formatLong, relativeLabel, todayKey } from '../utils/dateUtils';

interface Props {
  onStartSession: (task: Task) => void;
}

const byTime = (a: Task, b: Task) => {
  if (a.time && b.time) return a.time.localeCompare(b.time);
  if (a.time) return -1;
  if (b.time) return 1;
  return a.createdAt.localeCompare(b.createdAt);
};

export function DutiesPage({ onStartSession }: Props) {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useStore();
  const toast = useToast();
  const [date, setDate] = useState(todayKey);
  const [view, setView] = useLocalStorage<{ completedOpen: boolean; lastCategory: Category }>(STORAGE_KEYS.dutiesView, {
    completedOpen: true,
    lastCategory: 'work',
  });
  const [form, setForm] = useState<{ open: boolean; task: Task | null; category: Category }>({
    open: false,
    task: null,
    category: view.lastCategory,
  });

  const dayTasks = useMemo(() => tasks.filter((t) => t.date === date), [tasks, date]);
  const open = dayTasks.filter((t) => !t.completed).sort(byTime);
  const done = dayTasks
    .filter((t) => t.completed)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
  const stats = CATEGORY_ORDER.map((c) => {
    const all = dayTasks.filter((t) => t.category === c);
    return { c, total: all.length, done: all.filter((t) => t.completed).length };
  });
  const total = dayTasks.length;
  const totalDone = done.length;
  const isToday = date === todayKey();

  const openNew = (category: Category) => setForm({ open: true, task: null, category });

  const handleToggle = (t: Task) => {
    toggleTask(t.id);
    if (!t.completed) toast(`“${t.title}” complete`);
  };

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label-caps mb-1.5 text-[10px] text-bronze">{relativeLabel(date)}</div>
          <h1 className="font-display text-[24px] leading-tight font-semibold tracking-[0.12em] text-ivory sm:text-[28px]">DAILY DUTIES</h1>
          <p className="mt-1 font-serif text-[17px] text-sub italic">Action precedes clarity.</p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-line-soft bg-surface p-1">
          <button className="icon-btn h-9 w-9" onClick={() => setDate((d) => addDays(d, -1))} aria-label="Previous day">
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setDate(todayKey())}
            disabled={isToday}
            className="min-w-[150px] px-2 text-center text-[13px] font-medium text-ivory disabled:cursor-default"
            aria-label={isToday ? formatLong(date) : `${formatLong(date)} — return to today`}
          >
            {formatLong(date)}
            {!isToday && <span className="block text-[10px] tracking-[0.18em] text-brass uppercase">Return to today</span>}
          </button>
          <button className="icon-btn h-9 w-9" onClick={() => setDate((d) => addDays(d, 1))} aria-label="Next day">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* progress circles */}
      <section className="panel px-4 py-5 sm:px-6" aria-label="Daily progress">
        <div className="grid grid-cols-3 gap-2 sm:gap-6">
          {stats.map(({ c, total: t, done: d }) => (
            <div key={c} className="flex justify-center">
              <ProgressCircle label={CATEGORY_THEMES[c].label} done={d} total={t} color={CATEGORY_THEMES[c].color} size={typeof window !== 'undefined' && window.innerWidth < 380 ? 92 : 104} />
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-line-soft pt-4">
          <div className="flex items-center justify-between text-[12px]">
            <span className="tracking-[0.14em] text-sub uppercase">Total completion</span>
            <span className="text-ivory tabular-nums">
              {totalDone} of {total} · <span className="text-brass">{total ? Math.round((totalDone / total) * 100) : 0}%</span>
            </span>
          </div>
          <div className="mt-2 flex h-1.5 gap-[3px] overflow-hidden rounded-full">
            {stats.map(({ c, total: t, done: d }) =>
              t ? (
                <div key={c} className="relative h-full overflow-hidden rounded-full bg-line-soft" style={{ flex: t }}>
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: CATEGORY_THEMES[c].color }}
                    initial={false}
                    animate={{ width: `${(d / t) * 100}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              ) : null,
            )}
            {!total && <div className="h-full flex-1 rounded-full bg-line-soft" />}
          </div>
        </div>
      </section>

      {/* categories */}
      <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
        {CATEGORY_ORDER.map((c) => {
          const theme = CATEGORY_THEMES[c];
          const list = open.filter((t) => t.category === c);
          const stat = stats.find((s) => s.c === c)!;
          return (
            <section key={c} className="panel p-4" aria-labelledby={`cat-${c}`}>
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-20 rounded-t-[18px]"
                style={{ background: `linear-gradient(180deg, ${theme.soft}, transparent)` }}
                aria-hidden
              />
              <div className="relative mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 id={`cat-${c}`} className="font-display text-[14px] font-semibold tracking-[0.26em] uppercase" style={{ color: theme.color }}>
                    {theme.label}
                  </h2>
                  <p className="font-serif text-[15px] text-sub italic">{theme.motto}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-muted tabular-nums">
                    {stat.done}/{stat.total}
                  </span>
                  <button
                    onClick={() => openNew(c)}
                    className="grid h-8 w-8 place-items-center rounded-full border border-line text-sub transition hover:text-ivory"
                    style={{ background: theme.soft }}
                    aria-label={`Add a ${theme.label} duty`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <ul className="relative space-y-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {list.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onToggle={() => handleToggle(t)}
                      onEdit={() => setForm({ open: true, task: t, category: t.category })}
                      onDelete={() => {
                        deleteTask(t.id);
                        toast('Duty removed');
                      }}
                      onStartSession={isToday ? () => onStartSession(t) : undefined}
                    />
                  ))}
                </AnimatePresence>
                {list.length === 0 && (
                  <li>
                    <button
                      onClick={() => openNew(c)}
                      className="flex w-full flex-col items-center gap-1.5 rounded-[14px] border border-dashed border-line px-4 py-5 text-center transition hover:border-bronze/60 hover:bg-surface/50"
                    >
                      <Emblem size={22} color={theme.color} />
                      <span className="text-[13px] text-sub">
                        {stat.total ? 'All done here. Well fought.' : `No ${theme.label.toLowerCase()} duties yet`}
                      </span>
                      <span className="text-[12px] text-brass">+ Add a duty</span>
                    </button>
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>

      {/* completed */}
      <section className="panel" aria-label="Completed duties">
        <button
          onClick={() => setView((v) => ({ ...v, completedOpen: !v.completedOpen }))}
          className="flex w-full items-center justify-between px-5 py-4"
          aria-expanded={view.completedOpen}
        >
          <span className="flex items-center gap-3">
            <span className="label-caps">Completed</span>
            <span className="rounded-full bg-elevated px-2 py-0.5 text-[11px] text-sub tabular-nums">{done.length}</span>
          </span>
          <motion.span animate={{ rotate: view.completedOpen ? 180 : 0 }} className="text-muted">
            <ChevronDown size={18} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {view.completedOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 px-4 pb-4">
                <AnimatePresence initial={false} mode="popLayout">
                  {done.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      showCategory
                      onToggle={() => handleToggle(t)}
                      onEdit={() => setForm({ open: true, task: t, category: t.category })}
                      onDelete={() => {
                        deleteTask(t.id);
                        toast('Duty removed');
                      }}
                    />
                  ))}
                </AnimatePresence>
                {done.length === 0 && <li className="px-1 py-3 text-center text-[13px] text-muted">Nothing completed yet. The first step is the hardest.</li>}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <JourneySection />

      {/* floating add (mobile) */}
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => openNew(view.lastCategory)}
        className="fixed right-5 bottom-[88px] z-30 grid h-14 w-14 place-items-center rounded-full text-[#17140f] shadow-[0_14px_30px_-8px_rgba(0,0,0,0.7)] md:hidden"
        style={{ background: 'linear-gradient(180deg, #ECE4D3, #CFC4AF)', marginBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Add a duty"
      >
        <Plus size={24} />
      </motion.button>

      <TaskForm
        open={form.open}
        initial={form.task}
        defaultCategory={form.category}
        date={date}
        onClose={() => setForm((f) => ({ ...f, open: false }))}
        onSubmit={(draft) => {
          if (form.task) {
            updateTask(form.task.id, draft);
            toast('Duty updated');
          } else {
            addTask(draft);
            setView((v) => ({ ...v, lastCategory: draft.category }));
            toast('Duty added');
          }
        }}
      />
    </div>
  );
}
