import { useId, useMemo, type CSSProperties, type ReactNode } from 'react';
import { mulberry32 } from '../../utils/storage';

/** Stable, url()-safe id prefix for SVG defs */
export function useSvgId(name: string) {
  const raw = useId();
  return `${name}-${raw.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

/* ———————————————————— Figures ———————————————————— */

interface FigureProps {
  x: number;
  y: number;
  s?: number;
  fill: string;
  rim?: string;
  flip?: boolean;
  animate?: boolean;
}

/** Wraps a figure so a rim-light copy is drawn slightly offset behind it. */
function Rimmed({ x, y, s = 1, fill, rim, flip, children }: FigureProps & { children: (c: string) => ReactNode }) {
  const t = `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`;
  return (
    <g transform={t}>
      {rim && <g transform="translate(-1.1 -0.9)" opacity={0.9}>{children(rim)}</g>}
      {children(fill)}
    </g>
  );
}

/** Murmillo-style gladiator, sword raised, scutum forward. Feet at (0,0), ~100 units tall. */
export function Gladiator(props: FigureProps) {
  return (
    <Rimmed {...props}>
      {(c) => (
        <g fill={c} stroke={c} strokeLinecap="round" strokeLinejoin="round">
          {/* legs */}
          <path d="M-3 -46 L-11 -24 L-17 -1" fill="none" strokeWidth={7.5} />
          <path d="M4 -46 L12 -25 L17 -1" fill="none" strokeWidth={7.5} />
          <path d="M-20 0 h9" strokeWidth={4} />
          <path d="M14 0 h9" strokeWidth={4} />
          {/* greaves */}
          <path d="M-12 -22 L-16 -6" fill="none" strokeWidth={9} />
          {/* belt + skirt */}
          <path d="M-9 -58 L9 -58 L12 -44 L-12 -44 Z" strokeWidth={1} />
          {/* torso */}
          <path d="M-10 -82 C-12 -72 -9 -62 -8 -56 L8 -56 C10 -64 12 -72 10 -82 Z" strokeWidth={1} />
          {/* manica arm + gladius, raised */}
          <g className={props.animate ? 'anim-strike' : undefined}>
            <path d="M-8 -80 L-18 -92 L-12 -105" fill="none" strokeWidth={5.5} />
            <path d="M-13 -106 L6 -132" fill="none" strokeWidth={2.6} />
            <path d="M-16 -103 L-9 -109" fill="none" strokeWidth={2.4} />
          </g>
          {/* head + helmet + crest */}
          <circle cx={0} cy={-90} r={7} strokeWidth={0} />
          <path d="M-9 -88 Q0 -84 10 -87" fill="none" strokeWidth={2.2} />
          <path d="M-6 -95 Q2 -110 14 -100 Q6 -100 -2 -94 Z" strokeWidth={1.2} />
          {/* scutum */}
          <path d="M8 -84 Q20 -82 21 -60 Q20 -38 9 -36 Q12 -60 8 -84 Z" strokeWidth={1.5} />
          <path d="M4 -80 L12 -74" fill="none" strokeWidth={5} />
        </g>
      )}
    </Rimmed>
  );
}

/** Retiarius with trident, net arm low. */
export function Retiarius(props: FigureProps) {
  return (
    <Rimmed {...props}>
      {(c) => (
        <g fill={c} stroke={c} strokeLinecap="round" strokeLinejoin="round">
          <path d="M-3 -46 L-8 -23 L-14 0" fill="none" strokeWidth={7} />
          <path d="M3 -46 L9 -23 L13 0" fill="none" strokeWidth={7} />
          <path d="M-8 -58 L8 -58 L10 -45 L-10 -45 Z" strokeWidth={1} />
          <path d="M-9 -82 C-10 -70 -8 -62 -7 -56 L7 -56 C9 -64 10 -72 9 -82 Z" strokeWidth={1} />
          <circle cx={0} cy={-90} r={6.5} />
          <path d="M8 -80 L20 -70 L28 -78" fill="none" strokeWidth={5} />
          <path d="M14 -40 L46 -120" fill="none" strokeWidth={2.2} />
          <path d="M40 -124 L46 -120 L52 -116 M41 -128 L46 -120 M47 -131 L46 -120" fill="none" strokeWidth={1.8} />
          <path d="M-8 -80 L-16 -66 L-20 -52" fill="none" strokeWidth={5} />
          <path d="M-20 -52 Q-30 -40 -24 -28 Q-16 -36 -20 -52 Z" strokeWidth={1} opacity={0.85} />
        </g>
      )}
    </Rimmed>
  );
}

/** Legionary in a drilling stance facing a post, sword thrust forward. */
export function Legionary(props: FigureProps) {
  return (
    <Rimmed {...props}>
      {(c) => (
        <g fill={c} stroke={c} strokeLinecap="round" strokeLinejoin="round">
          <path d="M-4 -46 L-14 -24 L-22 -1" fill="none" strokeWidth={7.5} />
          <path d="M4 -46 L14 -26 L20 -1" fill="none" strokeWidth={7.5} />
          <path d="M-25 0 h9 M17 0 h9" strokeWidth={4} />
          {/* tunic + lorica */}
          <path d="M-11 -60 L11 -60 L13 -44 L-13 -44 Z" strokeWidth={1} />
          <path d="M-10 -84 C-12 -72 -10 -64 -9 -58 L9 -58 C11 -66 13 -74 11 -84 Z" strokeWidth={1} />
          <path d="M-12 -82 L12 -82" strokeWidth={4} />
          {/* galea helmet with neck guard */}
          <circle cx={1} cy={-92} r={7} />
          <path d="M-7 -90 L-11 -84" strokeWidth={3} />
          <path d="M-3 -99 Q2 -104 8 -99" fill="none" strokeWidth={2} />
          {/* curved scutum on the leading arm */}
          <path d="M8 -88 Q24 -86 25 -62 Q24 -36 9 -33 Q14 -60 8 -88 Z" strokeWidth={1.5} />
          <path d="M14 -62 a3 3 0 1 0 0.1 0" strokeWidth={1.2} fill="none" />
          {/* sword arm thrusting */}
          <g className={props.animate ? 'anim-strike' : undefined}>
            <path d="M8 -80 L20 -74 L30 -78" fill="none" strokeWidth={5} />
            <path d="M30 -78 L52 -84" fill="none" strokeWidth={2.6} />
            <path d="M29 -83 L31 -73" fill="none" strokeWidth={2.2} />
          </g>
        </g>
      )}
    </Rimmed>
  );
}

/** Seated warrior resting, knees up, arm on knee. Ground at y=0. */
export function SeatedWarrior(props: FigureProps) {
  return (
    <Rimmed {...props}>
      {(c) => (
        <g fill={c} stroke={c} strokeLinecap="round" strokeLinejoin="round">
          {/* rock */}
          <path d="M-30 0 Q-34 -18 -18 -24 Q-2 -26 4 -12 Q6 -4 4 0 Z" strokeWidth={1} />
          {/* torso leaning forward */}
          <path d="M-14 -24 C-16 -40 -12 -52 -6 -58 L4 -56 C6 -46 4 -34 2 -24 Z" strokeWidth={1} />
          {/* cloak */}
          <path d="M-8 -58 Q-24 -44 -22 -22 L-12 -22 Q-14 -40 -4 -54 Z" strokeWidth={1} opacity={0.95} />
          {/* head bowed */}
          <circle cx={4} cy={-64} r={6.5} />
          {/* thigh + shin */}
          <path d="M-2 -24 L18 -30 L22 -2" fill="none" strokeWidth={7.5} />
          <path d="M20 0 h7" strokeWidth={4} />
          {/* arm resting on knee */}
          <path d="M2 -52 L14 -40 L20 -32" fill="none" strokeWidth={4.5} />
          {/* sword leaning */}
          <path d="M30 -2 L26 -40" fill="none" strokeWidth={2.2} />
          <path d="M23 -40 L29 -41" fill="none" strokeWidth={2.2} />
        </g>
      )}
    </Rimmed>
  );
}

/** Horse grazing — head lowered to the grass. Hooves at y=0, faces right. */
export function GrazingHorse(props: FigureProps) {
  return (
    <Rimmed {...props}>
      {(c) => (
        <g fill={c} stroke={c} strokeLinecap="round" strokeLinejoin="round">
          {/* legs */}
          <path d="M-26 -30 L-29 -14 L-27 0" fill="none" strokeWidth={4.5} />
          <path d="M-18 -30 L-16 -14 L-18 0" fill="none" strokeWidth={4.5} />
          <path d="M20 -30 L21 -14 L19 0" fill="none" strokeWidth={4.5} />
          <path d="M28 -30 L30 -14 L31 0" fill="none" strokeWidth={4.5} />
          {/* body */}
          <path d="M-34 -42 C-36 -56 -20 -60 0 -58 C18 -60 32 -56 34 -46 C35 -34 26 -28 18 -28 L-24 -28 C-32 -30 -34 -36 -34 -42 Z" strokeWidth={1} />
          {/* tail */}
          <path d="M-34 -48 Q-46 -40 -42 -18 Q-38 -30 -33 -40" strokeWidth={1.5} />
          {/* neck + head lowered */}
          <g className={props.animate ? 'anim-graze' : undefined}>
            <path d="M24 -56 C36 -58 44 -44 50 -24 L56 -6 L48 -4 L42 -20 C36 -34 28 -40 22 -44 Z" strokeWidth={1} />
            <path d="M46 -8 C50 -2 58 -1 60 -4 L57 -10 Z" strokeWidth={1.5} />
            <path d="M30 -58 Q38 -64 42 -54" fill="none" strokeWidth={2} />
          </g>
        </g>
      )}
    </Rimmed>
  );
}

/* ———————————————————— Atmosphere ———————————————————— */

interface ParticleSpec {
  count: number;
  color: string;
  seed?: number;
  size?: [number, number];
  /** vertical travel in px (negative = upward) */
  rise?: [number, number];
  drift?: [number, number];
  duration?: [number, number];
  area?: { top: number; bottom: number; left?: number; right?: number };
  glow?: boolean;
}

export function Particles({
  count,
  color,
  seed = 7,
  size = [1, 3],
  rise = [-60, -160],
  drift = [-30, 60],
  duration = [7, 14],
  area = { top: 30, bottom: 100 },
  glow,
}: ParticleSpec) {
  const items = useMemo(() => {
    const r = mulberry32(seed);
    const lerp = ([a, b]: [number, number]) => a + (b - a) * r();
    return Array.from({ length: count }, () => ({
      left: (area.left ?? 0) + r() * ((area.right ?? 100) - (area.left ?? 0)),
      top: area.top + r() * (area.bottom - area.top),
      size: lerp(size),
      t: lerp(duration),
      d: -r() * 14,
      dx: lerp(drift),
      dy: lerp(rise),
      o: 0.35 + r() * 0.55,
    }));
  }, [count, seed, size, rise, drift, duration, area]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: color,
              boxShadow: glow ? `0 0 ${p.size * 3}px ${color}` : undefined,
              '--t': `${p.t}s`,
              '--d': `${p.d}s`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--o': p.o,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Cinematic finishing: grain, vignette and a soft bottom fade */
export function FilmOverlay({ fade = '#151412', strength = 1 }: { fade?: string; strength?: number }) {
  return (
    <>
      <div className="film-grain pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `radial-gradient(120% 90% at 50% 40%, transparent 45%, rgba(8,6,5,${0.7 * strength}) 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        aria-hidden
        style={{ background: `linear-gradient(180deg, transparent, ${fade}${strength >= 1 ? 'f2' : 'b3'})` }}
      />
    </>
  );
}
