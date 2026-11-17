# STOIC — Roman Empire Edition

> Train your mind. Strengthen your body. Master your actions.

A frontend-only productivity app: focus, training and rest timers, daily duties, discipline heatmaps,
a 99-day journey and a cinematic Stoic gallery. No backend, no login, no paid services: all data lives in `localStorage`.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the Vite dev server on port 5173         |
| `npm run build`     | Type-check and build to `dist/`                |
| `npm run preview`   | Serve the production build locally             |
| `npm run typecheck` | TypeScript only                                |

Requires Node 18+ (20 or newer recommended).

## Deploy to Vercel

1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. In Vercel, choose **Add New → Project** and import the repo.
3. Vercel detects Vite automatically (and `vercel.json` sets it explicitly). Build command: `npm run build`. Output directory: `dist`.
4. Deploy. You don't need any environment variables.

Or use the CLI: `npm i -g vercel && vercel --prod`.

Routing is hash-based (`#focus`, `#duties`, `#gallery`), so no rewrite rules are needed. Any static host works the same way, including Netlify, GitHub Pages and Cloudflare Pages.

## Architecture

```
src/
  App.tsx                 shell, hash routing, screen transitions
  main.tsx                entry, self-hosted fonts (Cinzel, Inter, Cormorant Garamond)
  index.css               Tailwind v4 theme tokens, textures, scene animations
  context/
    StoreContext.tsx      all persisted state + actions (tasks, sessions, prefs, favourites)
    TimerContext.tsx      runs the timer engine at the root so sessions finish on any screen
    ToastContext.tsx      lightweight toasts
  hooks/
    useTimer.ts           wall-clock timer: start / pause / resume / reset / complete
    useLocalStorage.ts    state mirrored to localStorage, synced across tabs
    useMediaQuery.ts
  components/
    Header, BottomNavigation, Modal, PageIntro, Emblem
    DisciplineHeatmap     GitHub-style grid + day popover (weeks or journey layout)
    TimerStage            scene + mode selector + CircularTimer + presets + duty link
    CircularTimer, TimerModeSelector, QuoteCard, ProgressCircle
    TaskCard, TaskForm, JourneySection, GalleryPost, SettingsModal, IntroVeil
    scenes/               painted SVG environments (Colosseum, training ground, camp, temple…)
  pages/                  FocusPage, DutiesPage, GalleryPage
  data/                   quotes, gallery posts, demo tasks/history, theme tokens
  utils/                  dates, streaks, storage, share/copy, synthesized sound
  types/                  shared TypeScript interfaces
```

### Timer accuracy
The timer never counts ticks. It stores `startedAt` (epoch ms) and `elapsedMs`, and works out the remaining time from
`Date.now()` on every render. Throttled or backgrounded tabs, sleep, and even closing and reopening the browser all
stay accurate. Each session has a stable `sessionId`, and recording is idempotent, so a session can't be logged twice
(across reloads or tabs).

### Streak rules
- **Discipline Log**: a day is *active* if anything was recorded. The streak counts back from today, and stays alive until today ends.
- **99-Day Journey**: a day *counts* when at least one focus or training session happened and the day's effort score is 3 or more
  (sessions + duties + ½ × rest). Missed days never reset progress.

## Imagery
The cinematic environments are painted in SVG: layered light, haze, torchlight, dust particles and film grain. They need no
network and never break. To add real photographs as well, put them in `public/images/` and reference them:

- Timer scenes: set `photo: '/images/focus.jpg'` (or `train`/`rest`) in `src/data/theme.ts`
- Gallery plates: set `photo: '/images/plate-01.jpg'` on any post in `src/data/galleryPosts.ts`

If a photo fails to load, the app falls back to the painted scene on its own.

## Data
Everything is stored under `stoic:v1:*` keys in `localStorage`. **Settings → Reset demo data** restores the sample
data, and **Start from a blank slate** clears everything.
