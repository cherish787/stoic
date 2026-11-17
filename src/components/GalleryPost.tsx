import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Share2, Copy, BookOpen } from 'lucide-react';
import type { GalleryPost as Post } from '../types';
import { SceneBackdrop } from './scenes/SceneBackdrop';
import { Emblem, Rule } from './Emblem';
import { toRoman } from '../utils/dateUtils';

interface Props {
  post: Post;
  index: number;
  saved: boolean;
  onToggleSave: () => void;
  onShare: () => void;
  onCopy: () => void;
  onOpen: () => void;
}

const CATEGORY_LABEL: Record<Post['category'], string> = {
  wisdom: 'Sapientia · Wisdom',
  discipline: 'Disciplina · Discipline',
  courage: 'Virtus · Courage',
  mindset: 'Animus · Mindset',
  history: 'Historia · History',
};

export function GalleryPost({ post, index, saved, onToggleSave, onShare, onCopy, onOpen }: Props) {
  const long = post.text.length > 90;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative aspect-[9/16] w-full snap-start overflow-hidden rounded-[22px] border border-line-soft bg-card shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
    >
      <button
        onClick={onOpen}
        className="absolute inset-0 z-0 block h-full w-full cursor-pointer text-left"
        aria-label={`Read more: ${post.title ?? post.text.slice(0, 60)}`}
      >
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.035]">
          <SceneBackdrop kind={post.backdrop} tint={post.tint} photo={post.photo} />
        </div>
        <div className="film-grain absolute inset-0" aria-hidden />
        <Overlay layout={post.layout} />
      </button>

      {/* brand */}
      <div className="pointer-events-none absolute top-0 inset-x-0 z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-1.5">
          <Emblem size={18} color="#E4DDCF" />
          <span className="font-display text-[10px] font-semibold tracking-[0.34em] text-ivory/85">STOIC</span>
        </div>
        <span className="font-display text-[9px] tracking-[0.24em] text-ivory/65 uppercase">{CATEGORY_LABEL[post.category]}</span>
      </div>

      {/* typography — composition varies by layout */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col p-6 pb-20">
        {post.layout === 'center' && (
          <div className="my-auto text-center">
            <p className={`font-serif leading-[1.18] font-medium text-ivory ${long ? 'text-[25px]' : 'text-[32px]'}`} style={{ textShadow: '0 2px 18px rgba(0,0,0,0.7)' }}>
              {post.text}
            </p>
            <Rule className="mx-auto mt-5 w-28" />
            <Author post={post} center />
          </div>
        )}
        {post.layout === 'bottom' && (
          <div className="mt-auto">
            {post.title && <div className="mb-2 font-display text-[11px] font-semibold tracking-[0.3em] text-brass uppercase">{post.title}</div>}
            <p className="font-serif text-[22px] leading-[1.25] text-ivory" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              {post.category === 'history' ? post.text : `“${post.text}”`}
            </p>
            <Author post={post} />
          </div>
        )}
        {post.layout === 'top' && (
          <div className="mt-10">
            {post.title && (
              <h3 className="font-display text-[26px] leading-tight font-semibold tracking-[0.08em] text-ivory uppercase" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}>
                {post.title}
              </h3>
            )}
            <span className="mt-3 block h-px w-12 bg-brass/80" />
            <p className="mt-3 max-w-[92%] font-serif text-[19px] leading-[1.32] text-ivory/90" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              {post.text}
            </p>
            <Author post={post} />
          </div>
        )}
        {post.layout === 'numeral' && (
          <div className="mt-auto">
            <div className="font-display text-[86px] leading-none font-semibold text-ivory/15">{toRoman(index + 1)}</div>
            <p className="-mt-6 font-serif text-[27px] leading-[1.18] font-medium text-ivory italic" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.75)' }}>
              {post.text}
            </p>
            <Author post={post} />
          </div>
        )}
        {post.layout === 'framed' && (
          <div className="absolute inset-5 top-14 bottom-[72px] flex flex-col items-center justify-center border border-ivory/25 px-5 text-center">
            <span className="absolute inset-1.5 border border-ivory/10" aria-hidden />
            {post.title && <div className="mb-3 font-display text-[11px] font-semibold tracking-[0.3em] text-brass uppercase">{post.title}</div>}
            <Emblem size={30} color="#AD9162" />
            <p className="mt-3 font-serif text-[21px] leading-[1.28] text-ivory" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              {post.text}
            </p>
            <Author post={post} center />
          </div>
        )}
      </div>

      {/* actions */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 p-3.5">
        <button
          onClick={onOpen}
          className="flex items-center gap-2 rounded-full border border-ivory/15 bg-black/45 px-3.5 py-2 text-[12px] font-medium text-ivory backdrop-blur-md transition hover:bg-black/65"
        >
          <BookOpen size={14} /> Read more
        </button>
        <div className="flex items-center gap-1.5">
          <CardAction label="Copy quotation" onClick={onCopy}>
            <Copy size={15} />
          </CardAction>
          <CardAction label="Share" onClick={onShare}>
            <Share2 size={15} />
          </CardAction>
          <CardAction label={saved ? 'Remove from saved' : 'Save post'} onClick={onToggleSave} pressed={saved}>
            <motion.span key={String(saved)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className="inline-flex">
              <Bookmark size={15} className={saved ? 'fill-brass text-brass' : ''} />
            </motion.span>
          </CardAction>
        </div>
      </div>
    </motion.article>
  );
}

function Author({ post, center }: { post: Post; center?: boolean }) {
  return (
    <div className={`mt-4 ${center ? 'text-center' : ''}`}>
      <div className="font-display text-[12px] font-semibold tracking-[0.22em] text-ivory uppercase">{post.author}</div>
      <div className="mt-0.5 text-[11.5px] text-ivory/60">{post.source}</div>
    </div>
  );
}

function Overlay({ layout }: { layout: Post['layout'] }) {
  const bg =
    layout === 'top'
      ? 'linear-gradient(180deg, rgba(10,9,8,0.82) 0%, rgba(10,9,8,0.35) 45%, rgba(10,9,8,0.55) 100%)'
      : layout === 'center' || layout === 'framed'
        ? 'radial-gradient(90% 60% at 50% 50%, rgba(10,9,8,0.55), rgba(10,9,8,0.35) 70%), linear-gradient(180deg, rgba(10,9,8,0.4), transparent 25%, transparent 70%, rgba(10,9,8,0.8))'
        : 'linear-gradient(180deg, rgba(10,9,8,0.45) 0%, transparent 25%, rgba(10,9,8,0.35) 50%, rgba(10,9,8,0.92) 100%)';
  return <div className="absolute inset-0" style={{ background: bg }} aria-hidden />;
}

function CardAction({ label, onClick, children, pressed }: { label: string; onClick: () => void; children: ReactNode; pressed?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-ivory/15 bg-black/45 text-ivory/90 backdrop-blur-md transition hover:bg-black/65"
    >
      {children}
    </button>
  );
}
