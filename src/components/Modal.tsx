import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  /** 'sheet' slides up on mobile; 'full' is used for immersive reading */
  variant?: 'sheet' | 'full';
  maxWidth?: number;
}

export function Modal({ open, onClose, title, eyebrow, children, variant = 'sheet', maxWidth = 520 }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => {
      const target = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current;
      target?.focus();
    }, 60);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      prevFocus?.focus?.();
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{ maxWidth: variant === 'full' ? 980 : maxWidth }}
            className={`relative w-full overflow-hidden border border-line bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.6)] outline-none ${
              variant === 'full'
                ? 'h-[100dvh] md:h-auto md:max-h-[88vh] md:rounded-[22px]'
                : 'max-h-[92dvh] rounded-t-[22px] md:rounded-[22px]'
            }`}
          >
            {variant === 'sheet' && (
              <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line md:hidden" aria-hidden />
            )}
            {(title || eyebrow) && (
              <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 sm:px-6 sm:pt-5">
                <div>
                  {eyebrow && <div className="label-caps mb-1 text-[10px]">{eyebrow}</div>}
                  {title && <h2 className="font-display text-[19px] font-semibold tracking-[0.06em] text-ivory">{title}</h2>}
                </div>
                <button onClick={onClose} className="icon-btn -mr-2 shrink-0" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
            )}
            <div
              className={variant === 'full' ? 'h-full max-h-[100dvh] overflow-y-auto md:max-h-[88vh]' : 'max-h-[calc(92dvh-72px)] overflow-y-auto px-5 pb-6 sm:px-6'}
              style={{ paddingBottom: variant === 'sheet' ? 'max(24px, env(safe-area-inset-bottom))' : undefined }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
