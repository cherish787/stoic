import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import type { Screen, Task } from './types';
import { StoreProvider } from './context/StoreContext';
import { TimerProvider, useTimerContext } from './context/TimerContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { SettingsModal } from './components/SettingsModal';
import { IntroVeil } from './components/IntroVeil';
import { FocusPage } from './pages/FocusPage';
import { DutiesPage } from './pages/DutiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { CATEGORY_THEMES } from './data/theme';

const SCREENS: Screen[] = ['focus', 'duties', 'gallery'];

function readHash(): Screen {
  const h = window.location.hash.replace(/^#\/?/, '') as Screen;
  return SCREENS.includes(h) ? h : 'focus';
}

function Shell() {
  const [screen, setScreen] = useState<Screen>(readHash);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { timer, setMode, setTask } = useTimerContext();

  useEffect(() => {
    const onHash = () => setScreen(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((s: Screen) => {
    if (`#${s}` !== window.location.hash) window.location.hash = s;
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const startSessionFor = useCallback(
    (task: Task) => {
      const active = timer.status === 'running' || timer.status === 'paused';
      if (!active) setMode(CATEGORY_THEMES[task.category].mode);
      setTask(task.id);
      navigate('focus');
    },
    [timer.status, setMode, setTask, navigate],
  );

  return (
    <div className="grain relative min-h-[100dvh]">
      <div className="ambient" aria-hidden />
      <Header screen={screen} onNavigate={navigate} onOpenSettings={() => setSettingsOpen(true)} />
      <main className="relative z-[2] mx-auto max-w-[680px] px-4 pt-5 pb-[112px] sm:px-6 md:pb-16 lg:max-w-[1100px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {screen === 'focus' && <FocusPage />}
            {screen === 'duties' && <DutiesPage onStartSession={startSessionFor} />}
            {screen === 'gallery' && <GalleryPage />}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNavigation screen={screen} onNavigate={navigate} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <IntroVeil />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <TimerProvider>
          <ToastProvider>
            <Shell />
          </ToastProvider>
        </TimerProvider>
      </StoreProvider>
    </MotionConfig>
  );
}
