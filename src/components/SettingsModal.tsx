import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Bell, Flag, RotateCcw, Trash2, Volume2, VolumeX } from 'lucide-react';
import type { TimerMode } from '../types';
import { Modal } from './Modal';
import { useStore } from '../context/StoreContext';
import { useTimerContext } from '../context/TimerContext';
import { useToast } from '../context/ToastContext';
import { MODE_ORDER, MODE_THEMES } from '../data/theme';
import { QUOTES } from '../data/quotes';
import { formatMinutes, todayKey } from '../utils/dateUtils';

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { prefs, setPrefs, sessions, favoriteQuotes, resetDemo, clearAll } = useStore();
  const { timer, setMode } = useTimerContext();
  const toast = useToast();
  const [name, setName] = useState(prefs.name);
  const [confirm, setConfirm] = useState<'reset' | 'clear' | null>(null);
  const [notif, setNotif] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    if (!open) return;
    setName(prefs.name);
    setConfirm(null);
    setNotif('Notification' in window ? Notification.permission : 'unsupported');
  }, [open, prefs.name]);

  const totalMinutes = Math.round(sessions.reduce((n, s) => n + s.durationSec, 0) / 60);
  const favs = QUOTES.filter((q) => favoriteQuotes.includes(q.id));

  const setDefault = (m: TimerMode, v: number) => {
    const val = Math.min(600, Math.max(1, Math.round(v) || 1));
    setPrefs((p) => ({ ...p, durations: { ...p.durations, [m]: val } }));
  };

  return (
    <Modal open={open} onClose={onClose} title="Settings" eyebrow="Tabularium · Your record" maxWidth={560}>
      <div className="space-y-6">
        {/* profile */}
        <section className="panel-inset p-4">
          <label htmlFor="pref-name" className="label-caps mb-2 block text-[10px]">How shall we address you?</label>
          <input
            id="pref-name"
            className="field"
            value={name}
            maxLength={24}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setPrefs((p) => ({ ...p, name: name.trim() || 'Citizen' }))}
          />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Mini label="Sessions" value={String(sessions.length)} />
            <Mini label="Time logged" value={formatMinutes(totalMinutes)} />
            <Mini label="Favourites" value={String(favs.length)} />
          </div>
        </section>

        {/* timer defaults */}
        <section>
          <h3 className="label-caps mb-3 text-[10px]">Default durations</h3>
          <div className="grid grid-cols-3 gap-2">
            {MODE_ORDER.map((m) => (
              <label key={m} className="panel-inset block px-3 py-2.5">
                <span className="font-display text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: MODE_THEMES[m].accent }}>
                  {MODE_THEMES[m].label}
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <input
                    type="number"
                    min={1}
                    max={600}
                    value={prefs.durations[m]}
                    onChange={(e) => setDefault(m, Number(e.target.value))}
                    className="w-full bg-transparent font-display text-[20px] font-semibold text-ivory tabular-nums outline-none"
                    aria-label={`${MODE_THEMES[m].label} default minutes`}
                  />
                  <span className="text-[11px] text-muted">min</span>
                </div>
              </label>
            ))}
          </div>
          {timer.status === 'idle' && (
            <button className="mt-2 text-[12px] text-brass hover:text-ivory" onClick={() => setMode(timer.mode)}>
              Apply to the current {MODE_THEMES[timer.mode].label.toLowerCase()} timer
            </button>
          )}
        </section>

        {/* preferences */}
        <section className="space-y-2">
          <h3 className="label-caps mb-3 text-[10px]">Preferences</h3>
          <Toggle
            icon={prefs.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            title="Session sounds"
            desc="A soft strike to begin, a bronze gong on completion."
            on={!prefs.muted}
            onChange={() => setPrefs((p) => ({ ...p, muted: !p.muted }))}
          />
          <Toggle
            icon={<Bell size={16} />}
            title="Completion notifications"
            desc={
              notif === 'unsupported'
                ? 'Not supported in this browser.'
                : notif === 'denied'
                  ? 'Blocked — enable notifications in your browser settings.'
                  : 'Notify me when a session ends in a background tab.'
            }
            on={notif === 'granted'}
            disabled={notif === 'unsupported' || notif === 'denied' || notif === 'granted'}
            onChange={async () => {
              if (!('Notification' in window)) return;
              const r = await Notification.requestPermission();
              setNotif(r);
              toast(r === 'granted' ? 'Notifications enabled' : 'Notifications not enabled');
            }}
          />
        </section>

        {favs.length > 0 && (
          <section>
            <h3 className="label-caps mb-3 text-[10px]">Favourite quotations</h3>
            <ul className="space-y-2">
              {favs.map((q) => (
                <li key={q.id} className="panel-inset px-4 py-3">
                  <p className="font-serif text-[16px] leading-snug text-ivory">“{q.text}”</p>
                  <p className="mt-1 text-[11px] tracking-[0.12em] text-brass uppercase">{q.author}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* data */}
        <section>
          <h3 className="label-caps mb-3 text-[10px]">Data</h3>
          <p className="mb-3 text-[12.5px] text-muted">Everything is stored only in this browser. Nothing leaves your device.</p>
          <div className="space-y-2">
            <button
              className="btn-ghost w-full justify-start"
              onClick={() => {
                setPrefs((p) => ({ ...p, journeyStart: todayKey() }));
                toast('A new 99-day journey begins today');
              }}
            >
              <Flag size={15} className="text-brass" /> Restart the 99-day journey from today
            </button>
            {confirm === 'reset' ? (
              <ConfirmRow
                text="Replace everything with fresh demo data?"
                onCancel={() => setConfirm(null)}
                onConfirm={() => {
                  resetDemo();
                  setConfirm(null);
                  toast('Demo data restored');
                  onClose();
                }}
              />
            ) : (
              <button className="btn-ghost w-full justify-start" onClick={() => setConfirm('reset')}>
                <RotateCcw size={15} className="text-brass" /> Reset demo data
              </button>
            )}
            {confirm === 'clear' ? (
              <ConfirmRow
                text="Erase all duties, sessions and history?"
                onCancel={() => setConfirm(null)}
                onConfirm={() => {
                  clearAll();
                  setConfirm(null);
                  toast('All data cleared — a blank slate');
                  onClose();
                }}
              />
            ) : (
              <button className="btn-ghost w-full justify-start" onClick={() => setConfirm('clear')}>
                <Trash2 size={15} className="text-[#b07a72]" /> Start from a blank slate
              </button>
            )}
          </div>
        </section>
        <p className="pb-1 text-center font-serif text-[14px] text-muted italic">Train your mind. Strengthen your body. Master your actions.</p>
      </div>
    </Modal>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line-soft bg-card px-2 py-2.5">
      <div className="text-[17px] font-semibold text-ivory tabular-nums">{value}</div>
      <div className="mt-0.5 text-[10px] tracking-[0.12em] text-muted uppercase">{label}</div>
    </div>
  );
}

function Toggle({
  icon,
  title,
  desc,
  on,
  onChange,
  disabled,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  on: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onChange}
      disabled={disabled}
      className="panel-inset flex w-full items-center gap-3 px-4 py-3 text-left disabled:cursor-default"
    >
      <span className="text-sub">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] text-ivory">{title}</span>
        <span className="block text-[12px] text-muted">{desc}</span>
      </span>
      <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${on ? 'bg-bronze' : 'bg-line'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
      </span>
    </button>
  );
}

function ConfirmRow({ text, onCancel, onConfirm }: { text: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-wine/70 bg-wine/15 px-4 py-3">
      <span className="text-[13px] text-ivory">{text}</span>
      <div className="flex gap-2">
        <button className="btn-ghost !px-4 !py-2 text-[13px]" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-primary !px-4 !py-2 text-[13px]" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
}
