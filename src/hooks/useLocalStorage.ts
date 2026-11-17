import { useCallback, useEffect, useRef, useState } from 'react';
import { readStorage, writeStorage, type StorageKey } from '../utils/storage';

const PREFIX = 'stoic:v1:';

/**
 * React state mirrored to localStorage, kept in sync across browser tabs.
 * `initial` is only used when nothing has been stored yet.
 */
export function useLocalStorage<T>(key: StorageKey, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const MISSING = Symbol('missing');
    const stored = readStorage<T | typeof MISSING>(key, MISSING);
    if (stored !== MISSING) return stored as T;
    const fallback = typeof initial === 'function' ? (initial as () => T)() : initial;
    writeStorage(key, fallback); // persist seeded demo data immediately
    return fallback;
  });

  const latest = useRef(value);
  latest.current = value;

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(latest.current) : next;
      latest.current = resolved;
      writeStorage(key, resolved);
      setValue(resolved);
    },
    [key],
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== PREFIX + key || e.newValue === null) return;
      try {
        const parsed = JSON.parse(e.newValue) as T;
        latest.current = parsed;
        setValue(parsed);
      } catch {
        /* ignore malformed */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, set] as const;
}
