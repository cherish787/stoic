import { FilmOverlay, Gladiator, Particles, Retiarius, useSvgId } from './primitives';

/** FOCUS — a gladiator in the arena at golden hour, torchlight and drifting dust. */
export function ColosseumScene({ animate = true, figures = true }: { animate?: boolean; figures?: boolean }) {
  const id = useSvgId('col');
  const torches = [28, 104, 296, 372];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#22160f]">
      <svg
        className={`absolute inset-0 h-full w-full ${animate ? 'anim-pan' : ''}`}
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a120d" />
            <stop offset="0.45" stopColor="#4a2a19" />
            <stop offset="0.75" stopColor="#8a5232" />
          </linearGradient>
          <radialGradient id={`${id}-sun`} cx="0.72" cy="0.3" r="0.55">
            <stop offset="0" stopColor="#f0b071" stopOpacity="0.75" />
            <stop offset="0.35" stopColor="#c87a45" stopOpacity="0.35" />
            <stop offset="1" stopColor="#c87a45" stopOpacity="0" />
          </radialGradient>
          <pattern id={`${id}-arch1`} width="36" height="70" patternUnits="userSpaceOnUse">
            <rect width="36" height="70" fill="#5c3822" />
            <path d="M6 70 V30 A12 12 0 0 1 30 30 V70 Z" fill="#24150d" />
            <rect x="0" y="0" width="36" height="5" fill="#6d442a" />
            <rect x="0" y="0" width="2" height="70" fill="#704830" />
          </pattern>
          <pattern id={`${id}-arch2`} width="26" height="44" patternUnits="userSpaceOnUse">
            <rect width="26" height="44" fill="#55331f" />
            <path d="M5 44 V20 A8 8 0 0 1 21 20 V44 Z" fill="#20130c" />
            <rect width="26" height="4" fill="#65402a" />
          </pattern>
          <pattern id={`${id}-arch3`} width="18" height="30" patternUnits="userSpaceOnUse">
            <rect width="18" height="30" fill="#4c2e1c" />
            <rect x="5" y="9" width="8" height="12" fill="#1f130c" />
          </pattern>
          <linearGradient id={`${id}-sand`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9a6338" />
            <stop offset="0.35" stopColor="#6e4428" />
            <stop offset="1" stopColor="#24170f" />
          </linearGradient>
          <radialGradient id={`${id}-pool`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#e7a46a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#e7a46a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2216" stopOpacity="0.1" />
            <stop offset="1" stopColor="#b06a3c" stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id={`${id}-torch`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffcf8a" stopOpacity="0.95" />
            <stop offset="0.25" stopColor="#f08a3c" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f08a3c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-ray`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd59c" stopOpacity="0.32" />
            <stop offset="1" stopColor="#ffd59c" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="400" height="500" fill={`url(#${id}-sky)`} />
        <rect width="400" height="500" fill={`url(#${id}-sun)`} />

        {/* velarium masts */}
        {[20, 70, 330, 380].map((x) => (
          <path key={x} d={`M${x} 34 L${x + (x < 200 ? 3 : -3)} 120`} stroke="#2b1a10" strokeWidth="2" />
        ))}

        {/* three arcaded tiers curving away */}
        <path d="M-10 70 Q200 150 410 70 L410 140 Q200 196 -10 140 Z" fill={`url(#${id}-arch3)`} />
        <path d="M-10 136 Q200 192 410 136 L410 214 Q200 254 -10 214 Z" fill={`url(#${id}-arch2)`} />
        <path d="M-10 210 Q200 250 410 210 L410 320 Q200 330 -10 320 Z" fill={`url(#${id}-arch1)`} />
        {/* cornice lines */}
        <path d="M-10 70 Q200 150 410 70" stroke="#7a4e30" strokeWidth="3" fill="none" />
        <path d="M-10 138 Q200 194 410 138" stroke="#7a4e30" strokeWidth="3" fill="none" />
        <path d="M-10 212 Q200 252 410 212" stroke="#80543a" strokeWidth="4" fill="none" />
        {/* atmospheric haze over the far wall */}
        <rect y="60" width="400" height="270" fill={`url(#${id}-haze)`} />
        <rect width="400" height="500" fill={`url(#${id}-sun)`} opacity="0.6" />

        {/* light shafts */}
        <g className={animate ? 'anim-rays' : undefined} style={{ mixBlendMode: 'screen' }}>
          <path d="M300 0 L340 0 L210 500 L120 500 Z" fill={`url(#${id}-ray)`} />
          <path d="M360 0 L380 0 L300 500 L250 500 Z" fill={`url(#${id}-ray)`} opacity="0.7" />
          <path d="M250 0 L262 0 L90 500 L60 500 Z" fill={`url(#${id}-ray)`} opacity="0.5" />
        </g>

        {/* podium wall */}
        <rect y="312" width="400" height="26" fill="#2c1b11" />
        <rect y="312" width="400" height="3" fill="#6b4329" />

        {/* torches */}
        {torches.map((x, i) => (
          <g key={x}>
            <circle
              cx={x}
              cy="304"
              r="24"
              fill={`url(#${id}-torch)`}
              className={animate ? 'anim-flicker' : undefined}
              style={{ animationDelay: `${i * -0.6}s` }}
            />
            <path d={`M${x} 304 L${x} 326`} stroke="#1b110b" strokeWidth="2.5" />
            <path
              d={`M${x - 3} 304 Q${x} 292 ${x + 3} 304 Z`}
              fill="#ffd08a"
              className={animate ? 'anim-flicker' : undefined}
            />
          </g>
        ))}

        {/* sand */}
        <rect y="336" width="400" height="164" fill={`url(#${id}-sand)`} />
        <ellipse cx="190" cy="420" rx="200" ry="70" fill={`url(#${id}-pool)`} />
        <path d="M0 360 Q120 352 220 362 T400 356" stroke="#b47a4a" strokeOpacity="0.25" fill="none" />

        {figures && (
          <>
            {/* opponent in the haze */}
            <Retiarius x={296} y={386} s={0.62} fill="#3a2316" rim="#b27449" flip />
            <ellipse cx="290" cy="387" rx="16" ry="2.5" fill="#1c120b" opacity="0.5" />
            {/* hero gladiator */}
            <ellipse cx="150" cy="452" rx="62" ry="8" fill="#140c08" opacity="0.65" />
            <g className={animate ? 'anim-breathe' : undefined}>
              <Gladiator x={150} y={452} s={1.55} fill="#120b08" rim="#e19a5d" animate={animate} />
            </g>
          </>
        )}
      </svg>

      <Particles count={26} color="#f4c58c" size={[1, 2.6]} area={{ top: 35, bottom: 100 }} rise={[-40, -140]} drift={[10, 80]} seed={3} />
      <Particles count={10} color="#ffb070" size={[1.5, 3]} area={{ top: 60, bottom: 75, left: 0, right: 100 }} rise={[-90, -200]} drift={[-20, 30]} seed={11} glow />
      <FilmOverlay />
    </div>
  );
}
