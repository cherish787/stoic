import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link2, Pause, Play, RotateCcw, Volume2, VolumeX, ArrowRight, Check } from 'lucide-react';
import type { TimerMode } from '../types';
import { MODE_THEMES } from '../data/theme';
import { useStore } from '../context/StoreContext';
import { useTimerContext } from '../context/TimerContext';
import { CircularTimer } from './CircularTimer';
import { TimerModeSelector } from './TimerModeSelector';
import { ColosseumScene } from './scenes/ColosseumScene';
import { TrainingScene } from './scenes/TrainingScene';
import { CampScene } from './scenes/CampScene';
import { Modal } from './Modal';
import { todayKey } from '../utils/dateUtils';

const PRESETS = [25, 50, 90];

function Scene({ mode }: { mode: TimerMode }) {
  const photo = MODE_THEMES[mode].photo;
  const [ok, setOk] = useState(true);
  return (
    <>
      {mode === 'focus' && <ColosseumScene />}
      {mode === 'train' && <TrainingScene />}
      {mode === 'rest' && <CampScene />}
      {photo && ok && (
        <img src={photo} alt="" onError={() => setOk(false)} className="absolute inset-0 h-full w-full object-cover opacity-90" />
      )}
    </>
  );
}

export function TimerStage() {
  const { tasks, prefs, setPrefs } = useStore();
  const { timer, remainingSec, progress, start, pause, resume, reset, setMode, setDuration, setTask } = useTimerContext();
  const theme = MODE_THEMES[timer.mode];
  const [pendingMode, setPendingMode] = useState<TimerMode | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const active = timer.status === 'running' || timer.status === 'paused';
  const minutes = Math.round(timer.durationSec / 60);
  const isCustom = !PRESETS.includes(minutes) || timer.durationSec % 60 !== 0;

  const today = todayKey();
  const linkable = useMemo(
    () => tasks.filter((t) => t.date === today && (!t.completed || t.id === timer.taskId)),
    [tasks, today, timer.taskId],
  );
  const linked = tasks.find((t) => t.id === timer.taskId);

  const requestMode = (m: TimerMode) => {
    if (m === timer.mode) return;
    if (active) setPendingMode(m);
    else setMode(m);
  };

  const applyCustom = () => {
    const v = Number(customValue);
    if (!Number.isFinite(v) || v < 1 || v > 600) return;
    setDuration(v);
    setCustomOpen(false);
    setCustomValue('');
  };

  const nextMode: TimerMode = timer.mode === 'rest' ? 'focus' : 'rest';

  return (
    <section
      aria-label="Timer"
      className="relative isolate overflow-hidden rounded-[26px] border border-line-soft shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
    >
      {/* environment */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence initial={false}>
          <motion.div
            key={timer.mode}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Scene mode={timer.mode} />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-transparent" />
        <motion.div
          className="absolute inset-0"
          animate={{ boxShadow: `inset 0 0 0 1px ${theme.accent}33, inset 0 -120px 120px -60px ${theme.accentSoft}` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <div className="flex flex-col items-center px-4 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6">
        <TimerModeSelector mode={timer.mode} onChange={requestMode} />

        <AnimatePresence mode="wait">
          <motion.div
            key={timer.mode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="mt-4 text-center"
          >
            <div className="font-display text-[11px] font-semibold tracking-[0.32em] text-ivory/80 uppercase">{theme.scene}</div>
            <div className="mt-1 font-serif text-[16px] text-ivory/70 italic">{theme.caption}</div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 mb-2 w-full">
          <CircularTimer
            progress={progress}
            remainingSec={remainingSec}
            status={timer.status}
            theme={theme}
            durationSec={timer.durationSec}
          />
        </div>

        {/* completion feedback */}
        <AnimatePresence>
          {timer.status === 'completed' && timer.completionMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="mb-3 max-w-sm text-center"
            >
              <p className="font-serif text-[19px] leading-snug text-ivory italic">{timer.completionMessage}</p>
              <p className="mt-1 text-[12px] text-sub">
                Session recorded{linked ? ` · ${Math.round(timer.durationSec / 60)} min added to “${linked.title}”` : ''}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            disabled={timer.status === 'idle'}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/12 bg-black/40 text-ivory/80 backdrop-blur-md transition hover:bg-black/60 disabled:opacity-35"
            aria-label="Reset timer"
          >
            <RotateCcw size={18} strokeWidth={1.7} />
          </button>

          {timer.status === 'running' ? (
            <PrimaryButton onClick={pause} accent={theme.accent} label="Pause" icon={<Pause size={18} fill="currentColor" />} />
          ) : timer.status === 'paused' ? (
            <PrimaryButton onClick={resume} accent={theme.accent} label="Resume" icon={<Play size={18} fill="currentColor" />} />
          ) : timer.status === 'completed' ? (
            <PrimaryButton
              onClick={() => setMode(nextMode)}
              accent={MODE_THEMES[nextMode].accent}
              label={nextMode === 'rest' ? 'Begin rest' : 'Return to focus'}
              icon={<ArrowRight size={18} />}
            />
          ) : (
            <PrimaryButton onClick={start} accent={theme.accent} label="Begin" icon={<Play size={18} fill="currentColor" />} />
          )}

          <button
            onClick={() => setPrefs((p) => ({ ...p, muted: !p.muted }))}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/12 bg-black/40 text-ivory/80 backdrop-blur-md transition hover:bg-black/60"
            aria-label={prefs.muted ? 'Unmute sounds' : 'Mute sounds'}
            aria-pressed={!prefs.muted}
          >
            {prefs.muted ? <VolumeX size={18} strokeWidth={1.7} /> : <Volume2 size={18} strokeWidth={1.7} />}
          </button>
        </div>

        {/* presets */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Duration presets">
          {PRESETS.map((p) => {
            const sel = !isCustom && p === minutes;
            return (
              <button
                key={p}
                disabled={active}
                onClick={() => setDuration(p)}
                aria-pressed={sel}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium tabular-nums backdrop-blur-md transition disabled:opacity-40 ${
                  sel ? 'text-ivory' : 'border-white/10 bg-black/30 text-ivory/65 hover:text-ivory'
                }`}
                style={sel ? { borderColor: `${theme.accent}99`, background: 'rgba(21,20,18,0.7)' } : undefined}
              >
                {p} min
              </button>
            );
          })}
          {customOpen ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyCustom();
              }}
              className="flex items-center gap-1 rounded-full border border-white/15 bg-black/50 py-0.5 pr-0.5 pl-3 backdrop-blur-md"
            >
              <input
                autoFocus
                type="number"
                inputMode="numeric"
                min={1}
                max={600}
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="min"
                aria-label="Custom duration in minutes"
                className="w-12 bg-transparent text-[13px] text-ivory tabular-nums outline-none placeholder:text-ivory/40"
              />
              <button type="submit" className="grid h-7 w-7 place-items-center rounded-full bg-ivory/90 text-base" aria-label="Set custom duration">
                <Check size={14} />
              </button>
            </form>
          ) : (
            <button
              disabled={active}
              onClick={() => setCustomOpen(true)}
              aria-pressed={isCustom}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium backdrop-blur-md transition disabled:opacity-40 ${
                isCustom ? 'text-ivory' : 'border-white/10 bg-black/30 text-ivory/65 hover:text-ivory'
              }`}
              style={isCustom ? { borderColor: `${theme.accent}99`, background: 'rgba(21,20,18,0.7)' } : undefined}
            >
              {isCustom ? `Custom · ${minutes} min` : 'Custom'}
            </button>
          )}
        </div>

        {/* task link */}
        <label className="mt-4 flex w-full max-w-sm items-center gap-2.5 rounded-2xl border border-white/10 bg-black/45 px-3.5 py-2.5 backdrop-blur-md">
          <Link2 size={15} className="shrink-0 text-ivory/60" />
          <span className="sr-only">Link an active duty (optional)</span>
          <select
            value={timer.taskId ?? ''}
            onChange={(e) => setTask(e.target.value || undefined)}
            className="min-w-0 flex-1 appearance-none truncate bg-transparent text-[13.5px] text-ivory outline-none"
          >
            <option value="" className="bg-surface">
              Link an active duty (optional)
            </option>
            {linkable.map((t) => (
              <option key={t.id} value={t.id} className="bg-surface">
                {t.category.toUpperCase()} · {t.title}
              </option>
            ))}
          </select>
          {linked && <span className="shrink-0 text-[11px] text-ivory/50 tabular-nums">{linked.trackedMinutes}m</span>}
        </label>
      </div>

      <Modal open={!!pendingMode} onClose={() => setPendingMode(null)} title="Leave this battle?" eyebrow="Session in progress">
        <p className="text-[14.5px] leading-relaxed text-sub">
          Switching to <span className="text-ivory">{pendingMode ? MODE_THEMES[pendingMode].label : ''}</span> will end your
          current {theme.label.toLowerCase()} session without recording it.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" data-autofocus onClick={() => setPendingMode(null)}>
            Stay the course
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              if (pendingMode) setMode(pendingMode);
              setPendingMode(null);
            }}
          >
            Switch mode
          </button>
        </div>
      </Modal>
    </section>
  );
}

function PrimaryButton({ onClick, label, icon, accent }: { onClick: () => void; label: string; icon: ReactNode; accent: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="flex h-14 min-w-[164px] items-center justify-center gap-2.5 rounded-full px-7 font-display text-[13px] font-semibold tracking-[0.22em] text-[#17140f] uppercase"
      style={{
        background: `linear-gradient(180deg, #ECE4D3, #CFC4AF)`,
        boxShadow: `0 1px 0 rgba(255,255,255,0.6) inset, 0 12px 30px -10px ${accent}aa`,
      }}
    >
      {icon}
      {label}
    </motion.button>
  );
}
