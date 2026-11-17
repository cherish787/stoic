import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Copy, RefreshCw } from 'lucide-react';
import { QUOTES } from '../data/quotes';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { copyText } from '../utils/share';

function dayIndex() {
  const d = new Date();
  return (d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate()) % QUOTES.length;
}

export function QuoteCard({ className = '' }: { className?: string }) {
  const [index, setIndex] = useState(dayIndex);
  const [spin, setSpin] = useState(0);
  const { favoriteQuotes, toggleFavoriteQuote } = useStore();
  const toast = useToast();
  const q = QUOTES[index];
  const fav = favoriteQuotes.includes(q.id);

  const next = () => {
    setSpin((s) => s + 1);
    setIndex((i) => {
      let n = i;
      while (n === i) n = Math.floor(Math.random() * QUOTES.length);
      return n;
    });
  };

  return (
    <section className={`panel overflow-hidden px-6 pt-6 pb-5 sm:px-7 ${className}`} aria-label="Stoic quotation">
      <div
        className="pointer-events-none absolute -top-6 right-4 font-serif text-[150px] leading-none text-wine/25 select-none"
        aria-hidden
      >
        “
      </div>
      <div className="label-caps text-[10px]">Meditatio · Daily Reflection</div>
      <div className="relative min-h-[132px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={q.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="pt-4"
          >
            <blockquote className="font-serif text-[22px] leading-[1.32] font-medium text-ivory sm:text-[24px]">
              “{q.text}”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="h-px w-6 bg-bronze/70" />
              <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-brass uppercase">{q.author}</span>
              <span className="truncate text-[12px] text-muted">{q.source}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex items-center justify-end gap-1 border-t border-line-soft pt-3">
        <button
          className="icon-btn"
          aria-label="Copy quotation"
          onClick={async () => {
            const ok = await copyText(`“${q.text}” — ${q.author}`);
            toast(ok ? 'Quotation copied' : 'Copy not available');
          }}
        >
          <Copy size={16} strokeWidth={1.6} />
        </button>
        <button
          className="icon-btn"
          aria-pressed={fav}
          aria-label={fav ? 'Remove from favourites' : 'Save to favourites'}
          onClick={() => {
            toggleFavoriteQuote(q.id);
            toast(fav ? 'Removed from favourites' : 'Saved to favourites');
          }}
        >
          <Bookmark size={16} strokeWidth={1.6} className={fav ? 'fill-brass text-brass' : ''} />
        </button>
        <button className="btn-ghost ml-1 !px-4 !py-2 text-[13px]" onClick={next} aria-label="Show another quotation">
          <motion.span animate={{ rotate: spin * 180 }} transition={{ duration: 0.45 }} className="inline-flex">
            <RefreshCw size={14} strokeWidth={1.8} />
          </motion.span>
          Another
        </button>
      </div>
    </section>
  );
}
