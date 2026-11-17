import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Hourglass, Pencil, Trash2, StickyNote, Play, Timer } from 'lucide-react';
import type { Task } from '../types';
import { CATEGORY_THEMES } from '../data/theme';
import { formatMinutes, formatTime12 } from '../utils/dateUtils';

interface Props {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStartSession?: () => void;
  showCategory?: boolean;
}

export function TaskCard({ task, onToggle, onEdit, onDelete, onStartSession, showCategory }: Props) {
  const theme = CATEGORY_THEMES[task.category];
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = window.setTimeout(() => setConfirming(false), 3000);
    return () => window.clearTimeout(t);
  }, [confirming]);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
      className={`group relative flex items-start gap-3 rounded-[14px] border px-3.5 py-3 transition-colors ${
        task.completed
          ? 'border-line-soft/60 bg-surface/60'
          : 'border-line-soft bg-surface hover:border-line hover:bg-[#211f1b]'
      }`}
    >
      <span className="absolute top-3 bottom-3 left-0 w-[2px] rounded-full" style={{ background: theme.color, opacity: task.completed ? 0.3 : 0.8 }} aria-hidden />

      <button
        onClick={onToggle}
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? `Reopen “${task.title}”` : `Complete “${task.title}”`}
        className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[7px] border transition-colors"
        style={{
          borderColor: task.completed ? theme.color : '#554a3c',
          background: task.completed ? theme.color : 'transparent',
        }}
      >
        <motion.span
          initial={false}
          animate={{ scale: task.completed ? 1 : 0, opacity: task.completed ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 24 }}
        >
          <Check size={14} strokeWidth={3} className="text-base" />
        </motion.span>
      </button>

      <div className="min-w-0 flex-1">
        <div className={`text-[14.5px] leading-snug font-medium ${task.completed ? 'text-muted line-through decoration-muted/60' : 'text-ivory'}`}>
          {task.title}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-sub">
          {showCategory && (
            <span className="font-display text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: theme.color }}>
              {theme.label}
            </span>
          )}
          {task.time ? (
            <Meta icon={<Clock size={12} />}>{formatTime12(task.time)}</Meta>
          ) : (
            <Meta icon={<Clock size={12} />}>
              <span className="text-muted">Any time</span>
            </Meta>
          )}
          {task.duration ? <Meta icon={<Hourglass size={12} />}>{formatMinutes(task.duration)}</Meta> : null}
          {task.trackedMinutes > 0 && (
            <Meta icon={<Timer size={12} />}>
              <span style={{ color: theme.color }}>{formatMinutes(task.trackedMinutes)} tracked</span>
            </Meta>
          )}
          {task.notes && (
            <Meta icon={<StickyNote size={12} />}>
              <span className="max-w-[160px] truncate">{task.notes}</span>
            </Meta>
          )}
        </div>
      </div>

      <div className="-mr-1.5 -mt-1 flex shrink-0 items-center opacity-100 transition-opacity md:opacity-60 md:group-hover:opacity-100">
        {onStartSession && !task.completed && (
          <IconAction label={`Start a timed session for “${task.title}”`} onClick={onStartSession}>
            <Play size={14} />
          </IconAction>
        )}
        <IconAction label={`Edit “${task.title}”`} onClick={onEdit}>
          <Pencil size={14} />
        </IconAction>
        {confirming ? (
          <button
            onClick={onDelete}
            className="ml-0.5 rounded-full border border-wine/80 bg-wine/30 px-2.5 py-1 text-[11px] font-medium text-ivory"
            aria-label={`Confirm delete “${task.title}”`}
          >
            Delete
          </button>
        ) : (
          <IconAction label={`Delete “${task.title}”`} onClick={() => setConfirming(true)}>
            <Trash2 size={14} />
          </IconAction>
        )}
      </div>
    </motion.li>
  );
}

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-muted">{icon}</span>
      {children}
    </span>
  );
}

function IconAction({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-elevated hover:text-ivory">
      {children}
    </button>
  );
}
