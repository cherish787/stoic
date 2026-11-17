import { motion } from 'framer-motion';
import { Images, ListChecks, Swords, type LucideIcon } from 'lucide-react';
import type { Screen } from '../types';

export const NAV_ITEMS: { id: Screen; label: string; icon: LucideIcon }[] = [
  { id: 'focus', label: 'Focus', icon: Swords },
  { id: 'duties', label: 'Duties', icon: ListChecks },
  { id: 'gallery', label: 'Gallery', icon: Images },
];

export function BottomNavigation({ screen, onNavigate }: { screen: Screen; onNavigate: (s: Screen) => void }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line-soft bg-base/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto grid h-[68px] max-w-[600px] grid-cols-3">
        {NAV_ITEMS.map((item) => {
          const selected = item.id === screen;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={selected ? 'page' : undefined}
              className="relative flex flex-col items-center justify-center gap-1"
            >
              {selected && (
                <motion.span
                  layoutId="bottom-nav-mark"
                  className="absolute top-0 h-[2px] w-10 rounded-full bg-brass"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <item.icon
                size={21}
                strokeWidth={selected ? 1.9 : 1.5}
                className={selected ? 'text-ivory' : 'text-muted'}
              />
              <span
                className={`font-display text-[10px] font-semibold tracking-[0.2em] uppercase ${
                  selected ? 'text-brass' : 'text-muted'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
