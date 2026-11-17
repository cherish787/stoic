import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Emblem } from './Emblem';

/** A brief threshold moment each time the app opens — tap to skip. */
export function IntroVeil() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setShow(false), reduce ? 400 : 1700);
    return () => window.clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] flex cursor-pointer flex-col items-center justify-center bg-base"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
          onClick={() => setShow(false)}
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(60% 50% at 50% 45%, rgba(117,75,71,0.22), transparent 70%)' }}
          />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <Emblem size={64} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-5 pl-[0.5em] font-display text-[34px] font-semibold text-ivory"
          >
            STOIC
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative mt-3 font-serif text-[17px] text-sub italic"
          >
            Train your mind. Strengthen your body. Master your actions.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
