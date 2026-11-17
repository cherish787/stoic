import { FilmOverlay, Legionary, Particles, useSvgId } from './primitives';

/** TRAIN — a legionary drilling against the palus in a sunlit colonnaded courtyard. */
export function TrainingScene({ animate = true, figures = true }: { animate?: boolean; figures?: boolean }) {
  const id = useSvgId('trn');
  const columns = [18, 78, 138, 198, 258, 318, 378];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#2a2016]">
      <svg
        className={`absolute inset-0 h-full w-full ${animate ? 'anim-pan' : ''}`}
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6d5236" />
            <stop offset="0.5" stopColor="#b8925e" />
            <stop offset="1" stopColor="#d9b67f" />
          </linearGradient>
          <radialGradient id={`${id}-sun`} cx="0.15" cy="0.08" r="0.7">
            <stop offset="0" stopColor="#fff1cf" stopOpacity="0.9" />
            <stop offset="0.3" stopColor="#f2cf8e" stopOpacity="0.35" />
            <stop offset="1" stopColor="#f2cf8e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-col`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c9a87a" />
            <stop offset="0.45" stopColor="#a4845b" />
            <stop offset="1" stopColor="#5a432c" />
          </linearGradient>
          <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a3824" />
            <stop offset="1" stopColor="#2e2217" />
          </linearGradient>
          <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b48a5a" />
            <stop offset="0.3" stopColor="#7b5a3a" />
            <stop offset="1" stopColor="#261b12" />
          </linearGradient>
          <linearGradient id={`${id}-ray`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff0cc" stopOpacity="0.5" />
            <stop offset="1" stopColor="#fff0cc" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${id}-pool`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#f6d79f" stopOpacity="0.5" />
            <stop offset="1" stopColor="#f6d79f" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="400" height="500" fill={`url(#${id}-sky)`} />
        {/* distant hills & cypress beyond the colonnade */}
        <path d="M0 250 Q80 214 160 236 T320 226 T400 232 V300 H0 Z" fill="#a98458" opacity="0.6" />
        {[48, 108, 232, 290, 350].map((x, i) => (
          <path key={x} d={`M${x - 7} 266 Q${x - 9} 228 ${x} ${200 - (i % 2) * 12} Q${x + 9} 228 ${x + 7} 266 Z`} fill="#5f4d33" opacity="0.55" />
        ))}

        {/* back wall behind colonnade */}
        <rect y="268" width="400" height="60" fill={`url(#${id}-wall)`} />
        {/* entablature */}
        <rect y="70" width="400" height="34" fill="#3d2d1d" />
        <rect y="100" width="400" height="6" fill="#8c6c47" />
        <rect y="70" width="400" height="4" fill="#9a7a52" />
        {Array.from({ length: 34 }, (_, i) => (
          <rect key={i} x={i * 12 + 2} y="80" width="6" height="14" fill="#2d2116" />
        ))}

        {/* columns */}
        {columns.map((x) => (
          <g key={x}>
            <rect x={x - 11} y="106" width="22" height="222" fill={`url(#${id}-col)`} />
            <rect x={x - 15} y="106" width="30" height="8" fill="#b89568" />
            <rect x={x - 13} y="114" width="26" height="4" fill="#8a6c48" />
            <rect x={x - 15} y="322" width="30" height="8" fill="#6a5034" />
            {[-6, -1, 4].map((dx) => (
              <path key={dx} d={`M${x + dx} 120 V320`} stroke="#5a432c" strokeOpacity="0.35" strokeWidth="1" />
            ))}
          </g>
        ))}

        {/* sun bloom + shafts */}
        <rect width="400" height="500" fill={`url(#${id}-sun)`} />
        <g className={animate ? 'anim-rays' : undefined} style={{ mixBlendMode: 'screen' }}>
          <path d="M0 0 L70 0 L360 500 L220 500 Z" fill={`url(#${id}-ray)`} opacity="0.55" />
          <path d="M90 0 L120 0 L400 420 L400 500 L340 500 Z" fill={`url(#${id}-ray)`} opacity="0.35" />
        </g>

        {/* ground + long column shadows */}
        <rect y="328" width="400" height="172" fill={`url(#${id}-ground)`} />
        {columns.map((x) => (
          <path key={x} d={`M${x - 11} 330 L${x + 11} 330 L${x + 110} 500 L${x + 70} 500 Z`} fill="#2a1d12" opacity="0.32" />
        ))}
        <ellipse cx="200" cy="420" rx="170" ry="50" fill={`url(#${id}-pool)`} />

        {/* weapon rack */}
        <g stroke="#2a1d13" strokeLinecap="round">
          <path d="M30 420 L38 300" strokeWidth="2.5" />
          <path d="M42 420 L46 296" strokeWidth="2.5" />
          <path d="M54 420 L52 300" strokeWidth="2.5" />
          <path d="M22 380 H66" strokeWidth="4" />
          <path d="M37 300 l2 -10 l2 10 M45 296 l2 -10 l2 10 M51 300 l2 -10 l2 10" strokeWidth="1.5" fill="#2a1d13" />
        </g>

        {figures && (
          <>
            {/* palus — the wooden training post */}
            <ellipse cx="300" cy="446" rx="22" ry="4" fill="#1e150d" opacity="0.6" />
            <rect x="291" y="330" width="18" height="116" rx="3" fill="#3a2717" />
            <rect x="291" y="330" width="5" height="116" fill="#7a5634" opacity="0.6" />
            <path d="M291 360 h18 M291 392 h18" stroke="#24180e" strokeWidth="1.5" />
            {/* drilling legionary */}
            <ellipse cx="200" cy="452" rx="60" ry="7" fill="#1a120b" opacity="0.6" />
            <g className={animate ? 'anim-breathe' : undefined}>
              <Legionary x={200} y={452} s={1.45} fill="#18110b" rim="#f4d39a" animate={animate} />
            </g>
            {/* a second soldier in the colonnade */}
            <Legionary x={96} y={326} s={0.48} fill="#3b2c1c" rim="#d9b680" />
          </>
        )}
      </svg>

      <Particles count={30} color="#fff0c8" size={[1, 2.4]} area={{ top: 10, bottom: 95, left: 0, right: 80 }} rise={[-20, 60]} drift={[40, 120]} duration={[10, 18]} seed={21} />
      <FilmOverlay fade="#151412" />
    </div>
  );
}
