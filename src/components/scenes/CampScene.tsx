import { FilmOverlay, GrazingHorse, Particles, SeatedWarrior, useSvgId } from './primitives';

/** REST — a soldier at rest beside a campfire, his horse grazing under a dusk sky. */
export function CampScene({ animate = true, figures = true }: { animate?: boolean; figures?: boolean }) {
  const id = useSvgId('camp');
  const stars = [
    [30, 40], [80, 22], [130, 60], [176, 30], [228, 48], [262, 18], [318, 56], [360, 30],
    [52, 96], [112, 110], [204, 92], [290, 100], [380, 90], [150, 140], [340, 130],
  ];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#141820]">
      <svg
        className={`absolute inset-0 h-full w-full ${animate ? 'anim-pan' : ''}`}
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#10141c" />
            <stop offset="0.45" stopColor="#2b3442" />
            <stop offset="0.62" stopColor="#5b5258" />
            <stop offset="0.72" stopColor="#8a6450" />
          </linearGradient>
          <radialGradient id={`${id}-fire`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffc37a" stopOpacity="0.85" />
            <stop offset="0.25" stopColor="#e9782f" stopOpacity="0.45" />
            <stop offset="1" stopColor="#e9782f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2a2c" />
            <stop offset="1" stopColor="#121212" />
          </linearGradient>
          <linearGradient id={`${id}-tent`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3e3530" />
            <stop offset="1" stopColor="#6a4b38" />
          </linearGradient>
        </defs>

        <rect width="400" height="500" fill={`url(#${id}-sky)`} />
        {stars.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 1.1 : 0.7}
            fill="#e8e2d6"
            className={animate ? 'anim-twinkle' : undefined}
            style={{ animationDelay: `${(i % 5) * -0.7}s` }}
          />
        ))}
        {/* crescent moon */}
        <circle cx="318" cy="84" r="13" fill="#e9e1cf" opacity="0.9" />
        <circle cx="324" cy="80" r="12" fill="#1f2631" />

        {/* far hills */}
        <path d="M0 250 Q60 220 120 238 T240 230 T400 236 V320 H0 Z" fill="#2b2f39" />
        <path d="M0 278 Q90 250 170 270 T320 262 T400 268 V340 H0 Z" fill="#22252d" />

        {/* rows of tents (contubernia) with fire-lit faces */}
        {[
          [36, 296, 0.8], [96, 292, 0.7], [250, 290, 0.65], [306, 294, 0.75], [362, 298, 0.85],
        ].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path d="M-26 0 L0 -34 L26 0 Z" fill={`url(#${id}-tent)`} />
            <path d="M0 -34 L26 0 L34 -4 L8 -36 Z" fill="#2b2420" />
            <path d="M-4 0 L0 -14 L4 0 Z" fill="#c07a46" opacity="0.6" />
          </g>
        ))}
        {/* standards in camp */}
        <path d="M178 300 V236" stroke="#1b1a1d" strokeWidth="2" />
        <path d="M170 240 h16 v18 h-16 Z" fill="#5b2f2c" opacity="0.85" />

        {/* ground */}
        <rect y="318" width="400" height="182" fill={`url(#${id}-ground)`} />
        <ellipse cx="150" cy="420" rx="190" ry="90" fill={`url(#${id}-fire)`} opacity="0.55" />

        {figures && (
          <>
            {/* horse grazing */}
            <ellipse cx="300" cy="402" rx="58" ry="6" fill="#0b0b0c" opacity="0.6" />
            <GrazingHorse x={290} y={402} s={1.25} fill="#121214" rim="#b86c3c" flip animate={animate} />
            {/* seated soldier */}
            <SeatedWarrior x={86} y={448} s={1.5} fill="#100e0e" rim="#e48a46" />
            {/* helmet set down */}
            <path d="M152 450 Q160 436 170 450 Z" fill="#141111" />
            <path d="M151 450 h21" stroke="#c17641" strokeWidth="1" opacity="0.7" />
          </>
        )}

        {/* campfire */}
        <circle cx="196" cy="430" r="90" fill={`url(#${id}-fire)`} className={animate ? 'anim-flicker' : undefined} />
        <g transform="translate(196 446) scale(1.45) translate(-196 -446)">
        <g stroke="#1a110c" strokeWidth="5" strokeLinecap="round">
          <path d="M178 452 L214 440" />
          <path d="M180 440 L214 452" />
        </g>
        <g className={animate ? 'anim-flicker' : undefined}>
          <path d="M184 446 Q186 424 196 410 Q200 426 208 432 Q212 440 208 446 Z" fill="#e8742c" />
          <path d="M189 446 Q192 430 197 422 Q200 434 205 440 L204 446 Z" fill="#ffc27a" />
          <path d="M194 446 Q196 438 198 434 Q200 440 201 446 Z" fill="#fff0c8" />
        </g>
        </g>

        {/* foreground grass */}
        <g className={animate ? 'anim-sway' : undefined} stroke="#151515" strokeWidth="1.6" strokeLinecap="round" fill="none">
          {Array.from({ length: 18 }, (_, i) => {
            const x = 240 + i * 9;
            return <path key={i} d={`M${x} 500 Q${x + 3} 478 ${x + 8} ${462 + (i % 4) * 6}`} />;
          })}
        </g>
      </svg>

      <Particles count={16} color="#ffad5c" size={[1.2, 2.6]} area={{ top: 74, bottom: 88, left: 42, right: 56 }} rise={[-140, -260]} drift={[-30, 40]} duration={[4, 8]} seed={5} glow />
      <FilmOverlay />
    </div>
  );
}
