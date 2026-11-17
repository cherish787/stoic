import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { TimerMode } from '../types';
import { uid } from '../utils/storage';
import { toKey } from '../utils/dateUtils';
import { COMPLETION_MESSAGES } from '../data/quotes';
import { playGong, playStrike, unlockAudio } from '../utils/sound';

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Wall-clock based timer. Remaining time is always derived from Date.now() and the
 * persisted start timestamp, so it stays accurate when the tab is backgrounded,
 * throttled, or even closed and reopened.
 */
export function useTimer() {
  const { timer, setTimer, recordSession, prefs } = useStore();
  const [now, setNow] = useState(() => Date.now());
  const completing = useRef<string | null>(null);

  const running = timer.status === 'running';
  const elapsedMs =
    timer.elapsedMs + (running && timer.startedAt ? Math.max(0, now - timer.startedAt) : 0);
  const totalMs = timer.durationSec * 1000;
  const remainingMs = Math.max(0, totalMs - elapsedMs);
  const progress = totalMs > 0 ? Math.min(1, elapsedMs / totalMs) : 0;

  // Tick while running; re-sync immediately when the tab becomes visible again.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    const onVisible = () => setNow(Date.now());
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    setNow(Date.now());
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [running]);

  // Completion — guarded so a session is recorded exactly once.
  useEffect(() => {
    if (!running || remainingMs > 0) return;
    if (completing.current === timer.sessionId) return;
    completing.current = timer.sessionId;
    const finishedAt = timer.startedAt
      ? new Date(timer.startedAt + (totalMs - timer.elapsedMs))
      : new Date();
    const added = recordSession({
      id: timer.sessionId,
      mode: timer.mode,
      durationSec: timer.durationSec,
      completedAt: finishedAt.toISOString(),
      date: toKey(finishedAt),
      taskId: timer.taskId,
    });
    setTimer((prev) =>
      prev.sessionId === timer.sessionId
        ? {
            ...prev,
            status: 'completed',
            startedAt: null,
            elapsedMs: prev.durationSec * 1000,
            completionMessage: pick(COMPLETION_MESSAGES[prev.mode]),
          }
        : prev,
    );
    if (added && !prefs.muted) playGong();
    if (added && document.hidden && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('STOIC — session complete', { body: pick(COMPLETION_MESSAGES[timer.mode]) });
      } catch {
        /* notifications not supported in this context */
      }
    }
  }, [running, remainingMs, timer, totalMs, recordSession, setTimer, prefs.muted]);

  const start = useCallback(() => {
    unlockAudio();
    if (!prefs.muted) playStrike();
    const t = Date.now();
    setNow(t);
    setTimer((prev) => {
      if (prev.status === 'running') return prev; // prevent double-start
      const fresh = prev.status === 'completed';
      return {
        ...prev,
        status: 'running',
        startedAt: t,
        elapsedMs: fresh ? 0 : prev.elapsedMs,
        sessionId: fresh ? uid('ses') : prev.sessionId,
        completionMessage: undefined,
      };
    });
  }, [setTimer, prefs.muted]);

  const pause = useCallback(() => {
    const t = Date.now();
    setTimer((prev) =>
      prev.status !== 'running' || !prev.startedAt
        ? prev
        : {
            ...prev,
            status: 'paused',
            elapsedMs: Math.min(prev.durationSec * 1000, prev.elapsedMs + (t - prev.startedAt)),
            startedAt: null,
          },
    );
  }, [setTimer]);

  const resume = useCallback(() => {
    unlockAudio();
    const t = Date.now();
    setNow(t);
    setTimer((prev) => (prev.status !== 'paused' ? prev : { ...prev, status: 'running', startedAt: t }));
  }, [setTimer]);

  const reset = useCallback(() => {
    setTimer((prev) => ({
      ...prev,
      status: 'idle',
      startedAt: null,
      elapsedMs: 0,
      sessionId: uid('ses'),
      completionMessage: undefined,
    }));
  }, [setTimer]);

  const setMode = useCallback(
    (mode: TimerMode) =>
      setTimer((prev) => ({
        ...prev,
        mode,
        durationSec: prefs.durations[mode] * 60,
        status: 'idle',
        startedAt: null,
        elapsedMs: 0,
        sessionId: uid('ses'),
        completionMessage: undefined,
      })),
    [setTimer, prefs.durations],
  );

  const setDuration = useCallback(
    (minutes: number) =>
      setTimer((prev) => ({
        ...prev,
        durationSec: Math.round(Math.min(600, Math.max(1, minutes)) * 60),
        status: 'idle',
        startedAt: null,
        elapsedMs: 0,
        sessionId: uid('ses'),
        completionMessage: undefined,
      })),
    [setTimer],
  );

  const setTask = useCallback(
    (taskId: string | undefined) => setTimer((prev) => ({ ...prev, taskId })),
    [setTimer],
  );

  return {
    timer,
    remainingSec: remainingMs / 1000,
    progress,
    start,
    pause,
    resume,
    reset,
    setMode,
    setDuration,
    setTask,
  };
}
