import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, ChevronLeft, ChevronRight, Copy, Share2, X } from 'lucide-react';
import type { GalleryCategory, GalleryPost as Post } from '../types';
import { GALLERY_FILTERS, GALLERY_POSTS } from '../data/galleryPosts';
import { GalleryPost } from '../components/GalleryPost';
import { SceneBackdrop } from '../components/scenes/SceneBackdrop';
import { Modal } from '../components/Modal';
import { Emblem, Rule } from '../components/Emblem';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { copyText, shareText } from '../utils/share';

type Filter = 'all' | GalleryCategory | 'saved';

export function GalleryPage() {
  const { savedPosts, toggleSavedPost } = useStore();
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const posts = useMemo(() => {
    if (filter === 'all') return GALLERY_POSTS;
    if (filter === 'saved') return GALLERY_POSTS.filter((p) => savedPosts.includes(p.id));
    return GALLERY_POSTS.filter((p) => p.category === filter);
  }, [filter, savedPosts]);

  const save = useCallback(
    (p: Post) => {
      const now = toggleSavedPost(p.id);
      toast(now ? 'Saved to your collection' : 'Removed from saved');
    },
    [toggleSavedPost, toast],
  );
  const copy = useCallback(
    async (p: Post) => toast((await copyText(`“${p.text}” — ${p.author}`)) ? 'Quotation copied' : 'Copy not available'),
    [toast],
  );
  const share = useCallback(
    async (p: Post) => {
      const r = await shareText('STOIC', `“${p.text}” — ${p.author}, ${p.source}`);
      if (r === 'copied') toast('Sharing unavailable — copied instead');
      if (r === 'failed') toast('Sharing not available here');
    },
    [toast],
  );

  const openIndex = posts.findIndex((p) => p.id === openId);
  const openPost = openId ? GALLERY_POSTS.find((p) => p.id === openId) ?? null : null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="label-caps mb-1.5 text-[10px] text-bronze">Inspiratio</div>
          <h1 className="font-display text-[24px] leading-tight font-semibold tracking-[0.12em] text-ivory sm:text-[28px]">THE GALLERY</h1>
          <p className="mt-1 font-serif text-[17px] text-sub italic">Words that outlived empires.</p>
        </div>
        <span className="text-[12px] text-muted">
          {savedPosts.length} saved · {GALLERY_POSTS.length} plates
        </span>
      </div>

      {/* filters */}
      <div className="sticky top-16 z-30 -mx-4 mt-4 border-b border-line-soft/60 bg-base/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto" role="tablist" aria-label="Gallery categories">
          {GALLERY_FILTERS.map((f) => {
            const sel = f.id === filter;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={sel}
                onClick={() => setFilter(f.id)}
                className={`relative shrink-0 rounded-full px-4 py-2 font-display text-[10.5px] font-semibold tracking-[0.2em] uppercase transition-colors ${
                  sel ? 'text-ivory' : 'text-muted hover:text-sub'
                }`}
              >
                {sel && (
                  <motion.span
                    layoutId="gallery-filter"
                    className="absolute inset-0 rounded-full border border-line bg-elevated"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {f.id === 'saved' && <Bookmark size={11} className={sel ? 'fill-brass text-brass' : ''} />}
                  {f.label}
                  {f.id === 'saved' && savedPosts.length > 0 && <span className="text-brass tabular-nums">{savedPosts.length}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div layout className="mt-5 grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {posts.map((p) => (
            <GalleryPost
              key={p.id}
              post={p}
              index={GALLERY_POSTS.indexOf(p)}
              saved={savedPosts.includes(p.id)}
              onToggleSave={() => save(p)}
              onCopy={() => copy(p)}
              onShare={() => share(p)}
              onOpen={() => setOpenId(p.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {posts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="panel mt-5 flex flex-col items-center px-6 py-14 text-center"
        >
          <Emblem size={40} />
          <h2 className="mt-4 font-display text-[15px] font-semibold tracking-[0.18em] text-ivory uppercase">Your collection is empty</h2>
          <p className="mt-2 max-w-xs text-[13.5px] text-sub">
            Tap the bookmark on any plate to keep it here — a private library of words worth returning to.
          </p>
          <button className="btn-ghost mt-5" onClick={() => setFilter('all')}>
            Browse all plates
          </button>
        </motion.div>
      )}

      <p className="mt-10 text-center font-serif text-[15px] text-muted italic">
        The Gallery is for reflection, not applause. No likes, no followers — only words worth keeping.
      </p>

      <Reader
        post={openPost}
        hasPrev={openIndex > 0}
        hasNext={openIndex >= 0 && openIndex < posts.length - 1}
        onPrev={() => openIndex > 0 && setOpenId(posts[openIndex - 1].id)}
        onNext={() => openIndex < posts.length - 1 && setOpenId(posts[openIndex + 1].id)}
        onClose={() => setOpenId(null)}
        saved={!!openPost && savedPosts.includes(openPost.id)}
        onSave={() => openPost && save(openPost)}
        onCopy={() => openPost && copy(openPost)}
        onShare={() => openPost && share(openPost)}
      />
    </div>
  );
}

interface ReaderProps {
  post: Post | null;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  saved: boolean;
  onSave: () => void;
  onCopy: () => void;
  onShare: () => void;
}

function Reader({ post, hasPrev, hasNext, onPrev, onNext, onClose, saved, onSave, onCopy, onShare }: ReaderProps) {
  useEffect(() => {
    if (!post) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [post, onPrev, onNext]);

  return (
    <Modal open={!!post} onClose={onClose} variant="full">
      {post && (
        <div className="relative grid min-h-full md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          <button onClick={onClose} className="icon-btn absolute top-3 right-3 z-20 bg-black/40 text-ivory backdrop-blur" aria-label="Close reader">
            <X size={18} />
          </button>
          <AnimatePresence mode="wait">
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-[46dvh] overflow-hidden md:h-auto md:min-h-[560px]"
            >
              <SceneBackdrop kind={post.backdrop} tint={post.tint} photo={post.photo} animate />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-surface" />
              <div className="absolute top-4 left-4 flex items-center gap-1.5">
                <Emblem size={18} color="#E4DDCF" />
                <span className="font-display text-[10px] font-semibold tracking-[0.34em] text-ivory/85">STOIC</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col px-6 pt-2 pb-8 md:px-10 md:py-14"
            >
              <div className="label-caps text-[10px] text-bronze">{post.category}</div>
              {post.title && <h2 className="mt-2 font-display text-[22px] font-semibold tracking-[0.08em] text-ivory uppercase">{post.title}</h2>}
              <blockquote className="mt-4 font-serif text-[27px] leading-[1.25] font-medium text-ivory md:text-[32px]">{post.category === 'history' ? post.text : `“${post.text}”`}</blockquote>
              <div className="mt-5">
                <div className="font-display text-[13px] font-semibold tracking-[0.2em] text-brass uppercase">{post.author}</div>
                <div className="mt-0.5 text-[12.5px] text-muted">{post.source}</div>
              </div>
              <Rule className="my-7 max-w-[220px]" />
              <div className="label-caps text-[10px]">Reflection</div>
              <p className="mt-2.5 text-[15px] leading-[1.7] text-sub">{post.reflection}</p>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                <button className="btn-ghost" onClick={onSave} aria-pressed={saved}>
                  <Bookmark size={15} className={saved ? 'fill-brass text-brass' : ''} />
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button className="btn-ghost" onClick={onShare}>
                  <Share2 size={15} /> Share
                </button>
                <button className="btn-ghost" onClick={onCopy}>
                  <Copy size={15} /> Copy
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between pt-10">
                <button className="btn-ghost !px-3.5" onClick={onPrev} disabled={!hasPrev} aria-label="Previous plate" style={{ opacity: hasPrev ? 1 : 0.35 }}>
                  <ChevronLeft size={16} /> Prev
                </button>
                <button className="btn-ghost !px-3.5" onClick={onNext} disabled={!hasNext} aria-label="Next plate" style={{ opacity: hasNext ? 1 : 0.35 }}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </Modal>
  );
}
