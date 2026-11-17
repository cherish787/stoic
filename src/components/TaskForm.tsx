import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import type { Category, Task, TaskDraft } from '../types';
import { CATEGORY_ORDER, CATEGORY_THEMES } from '../data/theme';
import { Modal } from './Modal';
import { formatLong } from '../utils/dateUtils';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
  initial?: Task | null;
  defaultCategory?: Category;
  date: string;
}

const DURATIONS = [15, 30, 45, 60, 90, 120];

export function TaskForm({ open, onClose, onSubmit, initial, defaultCategory = 'work', date }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [hasTime, setHasTime] = useState(false);
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? '');
    setCategory(initial?.category ?? defaultCategory);
    setHasTime(!!initial?.time);
    setTime(initial?.time ?? '09:00');
    setDuration(initial?.duration ? String(initial.duration) : '');
    setNotes(initial?.notes ?? '');
    setError('');
  }, [open, initial, defaultCategory]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) {
      setError('Give this duty a name.');
      return;
    }
    const dur = Number(duration);
    onSubmit({
      title: clean.slice(0, 120),
      category,
      date: initial?.date ?? date,
      time: hasTime ? time : undefined,
      duration: Number.isFinite(dur) && dur > 0 ? Math.min(dur, 1440) : undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit duty' : 'New duty'}
      eyebrow={formatLong(initial?.date ?? date)}
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="duty-title" className="label-caps mb-2 block text-[10px]">Duty</label>
          <input
            id="duty-title"
            data-autofocus
            className="field"
            placeholder="e.g. Learn Java — chapter 8"
            value={title}
            maxLength={120}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'duty-error' : undefined}
          />
          {error && (
            <p id="duty-error" className="mt-1.5 text-[12.5px] text-[#c98b80]">
              {error}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="label-caps mb-2 text-[10px]">Category</legend>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORY_ORDER.map((c) => {
              const t = CATEGORY_THEMES[c];
              const sel = c === category;
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={sel}
                  className="rounded-xl border px-2 py-2.5 text-center transition"
                  style={{
                    borderColor: sel ? t.color : '#41392F',
                    background: sel ? t.soft : '#1D1B18',
                  }}
                >
                  <div className="font-display text-[12px] font-semibold tracking-[0.2em] uppercase" style={{ color: sel ? t.color : '#A39A8B' }}>
                    {t.label}
                  </div>
                  <div className="mt-0.5 text-[10.5px] text-muted">{t.motto}</div>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="label-caps text-[10px]">Scheduled time</span>
              <button
                type="button"
                onClick={() => setHasTime((v) => !v)}
                className="text-[12px] text-brass hover:text-ivory"
              >
                {hasTime ? 'Make flexible' : 'Set a time'}
              </button>
            </div>
            {hasTime ? (
              <input type="time" className="field tabular-nums" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Scheduled time" />
            ) : (
              <div className="field flex items-center gap-2 text-sub">
                <Clock size={15} className="text-muted" /> Any time today
              </div>
            )}
          </div>
          <div>
            <label htmlFor="duty-duration" className="label-caps mb-2 block text-[10px]">Estimated duration</label>
            <div className="relative">
              <input
                id="duty-duration"
                type="number"
                inputMode="numeric"
                min={1}
                max={1440}
                className="field pr-14 tabular-nums"
                placeholder="Optional"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[12px] text-muted">min</span>
            </div>
          </div>
        </div>
        <div className="-mt-2 flex flex-wrap gap-1.5">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(String(d))}
              className={`rounded-full border px-3 py-1 text-[12px] tabular-nums transition ${
                Number(duration) === d ? 'border-bronze bg-elevated text-ivory' : 'border-line-soft text-sub hover:border-line hover:text-ivory'
              }`}
            >
              {d < 60 ? `${d}m` : `${d / 60}h`}
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="duty-notes" className="label-caps mb-2 block text-[10px]">Notes</label>
          <textarea
            id="duty-notes"
            className="field min-h-[84px] resize-y"
            placeholder="Optional — what does done look like?"
            value={notes}
            maxLength={500}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary min-w-[128px]">
            {initial ? 'Save changes' : 'Add duty'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
