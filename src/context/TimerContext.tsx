import { createContext, useContext, type ReactNode } from 'react';
import { useTimer } from '../hooks/useTimer';

type TimerApi = ReturnType<typeof useTimer>;

const TimerContext = createContext<TimerApi | null>(null);

/** Runs the timer engine at the app root so sessions complete on any screen. */
export function TimerProvider({ children }: { children: ReactNode }) {
  const api = useTimer();
  return <TimerContext.Provider value={api}>{children}</TimerContext.Provider>;
}

export function useTimerContext(): TimerApi {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimerContext must be used within TimerProvider');
  return ctx;
}
