import { Particles, useSvgId } from './primitives';

const svgProps = {
  className: 'absolute inset-0 h-full w-full',
  viewBox: '0 0 360 640',
  preserveAspectRatio: 'xMidYMid slice',
  'aria-hidden': true,
} as const;

/** Temple of Saturn–style portico at dusk */
export function TempleBackdrop() {
  const id = useSvgId('tmp');
  const cols = [70, 114, 158, 202, 246, 290];
  return (
    <div className="absolute inset-0 bg-[#1b1714]">
      <svg {...svgProps}>
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1714" />
            <stop offset="0.55" stopColor="#4a3a2e" />
            <stop offset="0.75" stopColor="#7b5d45" />
          </linearGradient>
          <linearGradient id={`${id}-marble`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8c7a65" />
            <stop offset="0.5" stopColor="#6a5a4a" />
            <stop offset="1" stopColor="#3a3029" />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx="0.5" cy="0.62" r="0.5">
            <stop offset="0" stopColor="#d79a62" stopOpacity="0.4" />
            <stop offset="1" stopColor="#d79a62" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="360" height="640" fill={`url(#${id}-sky)`} />
        <rect width="360" height="640" fill={`url(#${id}-glow)`} />
        {/* pediment */}
        <path d="M40 252 L180 182 L320 252 Z" fill="#3b3028" />
        <path d="M56 248 L180 190 L304 248 Z" fill="#2a221c" />
        <rect x="36" y="252" width="288" height="28" fill="#4c3e33" />
        <rect x="36" y="276" width="288" height="5" fill="#2a221c" />
        {cols.map((x) => (
          <g key={x}>
            <rect x={x - 12} y="282" width="24" height="230" fill={`url(#${id}-marble)`} />
            <rect x={x - 16} y="282" width="32" height="8" fill="#7d6a56" />
            <path d={`M${x - 5} 292 V510 M${x + 1} 292 V510 M${x + 7} 292 V510`} stroke="#2e2620" strokeOpacity="0.5" />
          </g>
        ))}
        {/* steps */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={24 - i * 14} y={512 + i * 12} width={312 + i * 28} height="12" fill={i % 2 ? '#3e332a' : '#4a3d32'} />
        ))}
        <rect y="560" width="360" height="80" fill="#1c1815" />
      </svg>
      <Particles count={14} color="#e8c99a" area={{ top: 30, bottom: 90 }} seed={41} />
    </div>
  );
}

/** Marble bust in profile — the philosopher-emperor */
export function BustBackdrop() {
  const id = useSvgId('bust');
  return (
    <div className="absolute inset-0 bg-[#171412]">
      <svg {...svgProps}>
        <defs>
          <radialGradient id={`${id}-bg`} cx="0.62" cy="0.38" r="0.7">
            <stop offset="0" stopColor="#4d3a2e" />
            <stop offset="0.6" stopColor="#221b17" />
            <stop offset="1" stopColor="#141110" />
          </radialGradient>
          <linearGradient id={`${id}-hair`} x1="1" y1="0" x2="0" y2="0.3">
            <stop offset="0" stopColor="#b3a896" />
            <stop offset="0.45" stopColor="#6d645a" />
            <stop offset="1" stopColor="#24201d" />
          </linearGradient>
          <radialGradient id={`${id}-shade`} cx="0.75" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="0.7" stopColor="#0d0b0a" stopOpacity="0.35" />
            <stop offset="1" stopColor="#0d0b0a" stopOpacity="0.7" />
          </radialGradient>
          <linearGradient id={`${id}-marble`} x1="1" y1="0" x2="0" y2="0.4">
            <stop offset="0" stopColor="#d9cfbe" />
            <stop offset="0.35" stopColor="#9d9282" />
            <stop offset="0.75" stopColor="#3f3833" />
            <stop offset="1" stopColor="#1d1917" />
          </linearGradient>
        </defs>
        <rect width="360" height="640" fill={`url(#${id}-bg)`} />
        {/* bust: laurel-crowned, bearded head in profile facing right */}
        <path
          fill={`url(#${id}-marble)`}
          d="M150 150 C120 156 104 190 106 226 C108 252 116 270 126 284 C122 300 124 318 132 330
             C120 344 102 352 86 362 C60 378 40 404 34 440 L326 440 C318 404 296 380 268 366
             C250 356 236 348 228 338 C238 334 250 330 256 322 C262 312 258 302 262 296
             C272 292 274 284 268 278 C274 272 274 264 266 258 C272 252 274 246 268 240
             L282 230 C286 226 284 220 278 216 L262 202 C262 180 256 162 238 150
             C214 136 178 140 150 150 Z"
        />
        {/* curled hair & beard masses, shaded like carved marble */}
        <g fill={`url(#${id}-hair)`}>
          {[
            [146, 156, 16], [168, 146, 16], [192, 142, 15], [216, 144, 14], [236, 152, 12],
            [128, 172, 15], [118, 194, 14], [114, 218, 13], [120, 240, 12], [140, 176, 14],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} />
          ))}
        </g>
        <g fill={`url(#${id}-hair)`}>
          {[
            [176, 300, 13], [196, 312, 13], [218, 316, 12], [238, 308, 11], [252, 294, 9],
            [160, 284, 12], [150, 266, 11], [206, 330, 11], [228, 326, 10], [186, 322, 11],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} />
          ))}
        </g>
        <g fill="#5f6a45" opacity="0.85">
          {Array.from({ length: 9 }, (_, i) => {
            const x = 120 + i * 15;
            const y = 170 - Math.sin((i + 0.5) / 2.6) * 22;
            return <ellipse key={i} cx={x} cy={y} rx="9" ry="3.6" transform={`rotate(${-38 + i * 7} ${x} ${y})`} />;
          })}
        </g>
        <rect width="360" height="640" fill={`url(#${id}-shade)`} />
        {/* eye + brow */}
        <path d="M244 214 Q252 210 258 214" stroke="#3b332d" strokeWidth="2.5" fill="none" />
        {/* pedestal */}
        <rect x="110" y="440" width="140" height="20" fill="#3a332e" />
        <rect x="128" y="460" width="104" height="120" fill="#2b2522" />
        <rect y="580" width="360" height="60" fill="#151210" />
      </svg>
    </div>
  );
}

/** Via — a Roman road lined with cypress at sunset */
export function RoadBackdrop() {
  const id = useSvgId('road');
  return (
    <div className="absolute inset-0 bg-[#1c1612]">
      <svg {...svgProps}>
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1714" />
            <stop offset="0.4" stopColor="#5b3b2c" />
            <stop offset="0.52" stopColor="#c27e4c" />
            <stop offset="0.56" stopColor="#e6aa6c" />
          </linearGradient>
          <linearGradient id={`${id}-road`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a87650" />
            <stop offset="1" stopColor="#2a1f19" />
          </linearGradient>
        </defs>
        <rect width="360" height="640" fill={`url(#${id}-sky)`} />
        <circle cx="180" cy="348" r="34" fill="#f2c487" opacity="0.85" />
        <path d="M0 340 Q90 320 180 338 T360 334 V380 H0 Z" fill="#4a3226" />
        <rect y="356" width="360" height="284" fill="#251b16" />
        <path d="M170 356 L190 356 L320 640 L40 640 Z" fill={`url(#${id}-road)`} />
        {Array.from({ length: 9 }, (_, i) => {
          const t = i / 8;
          const y = 360 + t * t * 280;
          return <path key={i} d={`M${172 - t * 128} ${y} L${188 + t * 128} ${y}`} stroke="#1f1712" strokeOpacity="0.45" strokeWidth={0.6 + t * 2} />;
        })}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const t = (i + 1) / 6;
          const h = 30 + t * t * 260;
          const y = 360 + t * t * 240;
          const off = 14 + t * 130;
          return (
            <g key={i} fill="#120d0a">
              <path d={`M${180 - off - 6} ${y} Q${180 - off - h * 0.12} ${y - h * 0.5} ${180 - off} ${y - h} Q${180 - off + h * 0.12} ${y - h * 0.5} ${180 - off + 6} ${y} Z`} />
              <path d={`M${180 + off - 6} ${y} Q${180 + off - h * 0.12} ${y - h * 0.5} ${180 + off} ${y - h} Q${180 + off + h * 0.12} ${y - h * 0.5} ${180 + off + 6} ${y} Z`} />
            </g>
          );
        })}
      </svg>
      <Particles count={12} color="#ffd29a" area={{ top: 40, bottom: 70 }} seed={8} />
    </div>
  );
}

/** Legion standards and helmets against a smoky battlefield sky */
export function LegionBackdrop() {
  const id = useSvgId('leg');
  return (
    <div className="absolute inset-0 bg-[#1a1514]">
      <svg {...svgProps}>
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d1716" />
            <stop offset="0.5" stopColor="#5a3530" />
            <stop offset="0.7" stopColor="#a0603e" />
          </linearGradient>
        </defs>
        <rect width="360" height="640" fill={`url(#${id}-sky)`} />
        <ellipse cx="180" cy="420" rx="260" ry="60" fill="#c27a48" opacity="0.25" />
        {/* standards */}
        {[
          [90, 150, 'vex'], [180, 110, 'eagle'], [270, 160, 'vex'],
        ].map(([x, top, kind]) => (
          <g key={x as number} fill="#140f0e" stroke="#140f0e">
            <path d={`M${x} ${top} V470`} strokeWidth="3" />
            {kind === 'eagle' ? (
              <g transform={`translate(${x} ${top})`}>
                <path d="M0 -6 C-18 -26 -36 -22 -44 -36 C-30 -34 -18 -40 -6 -30 L0 -40 L6 -30 C18 -40 30 -34 44 -36 C36 -22 18 -26 0 -6 Z" strokeWidth="0" />
                <circle cx="0" cy="2" r="9" strokeWidth="0" />
                <rect x="-16" y="12" width="32" height="5" strokeWidth="0" />
              </g>
            ) : (
              <g transform={`translate(${x} ${top})`}>
                <path d="M-20 0 H20" strokeWidth="3" />
                <path d="M-18 2 H18 V40 L10 46 L0 40 L-10 46 L-18 40 Z" fill="#5d2b28" stroke="none" />
                {[24, 54, 84].map((dy) => (
                  <circle key={dy} cx="0" cy={dy + 30} r="10" fill="none" strokeWidth="3" />
                ))}
              </g>
            )}
          </g>
        ))}
        {/* ranks of helmets and pila */}
        {[0, 1, 2].map((row) => (
          <g key={row} fill={row === 2 ? '#0e0b0a' : row === 1 ? '#1a1312' : '#2a1d19'}>
            {Array.from({ length: 12 }, (_, i) => {
              const x = -10 + i * 34 + (row % 2) * 16;
              const y = 470 + row * 46;
              const s = 1 + row * 0.25;
              return (
                <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                  <path d="M0 -60 V-110" stroke="currentColor" strokeWidth="1.6" style={{ color: row === 2 ? '#0e0b0a' : '#1f1614' }} />
                  <path d="M-12 0 Q-14 -34 0 -38 Q14 -34 12 0 Z" />
                  <path d="M-10 -36 Q0 -48 10 -36" fill="none" stroke="currentColor" strokeWidth="5" style={{ color: '#5e2a26' }} />
                </g>
              );
            })}
          </g>
        ))}
        <rect y="556" width="360" height="84" fill="#0e0b0a" />
      </svg>
      <Particles count={18} color="#f0a46a" area={{ top: 20, bottom: 80 }} seed={13} rise={[-80, -200]} glow />
    </div>
  );
}

/** Triumphal arch among ruins under a stormy sky */
export function ArchBackdrop() {
  const id = useSvgId('arc');
  return (
    <div className="absolute inset-0 bg-[#171617]">
      <svg {...svgProps}>
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141518" />
            <stop offset="0.5" stopColor="#3a3a40" />
            <stop offset="0.72" stopColor="#8a6a55" />
          </linearGradient>
          <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5b524a" />
            <stop offset="1" stopColor="#2c2724" />
          </linearGradient>
        </defs>
        <rect width="360" height="640" fill={`url(#${id}-sky)`} />
        <path d="M0 120 Q90 90 180 120 T360 110 V160 Q260 140 180 160 T0 150 Z" fill="#26262b" opacity="0.6" />
        <path
          fillRule="evenodd"
          fill={`url(#${id}-stone)`}
          d="M60 200 H300 V520 H60 Z M150 520 V350 A30 30 0 0 1 210 350 V520 Z M82 520 V420 A14 14 0 0 1 110 420 V520 Z M250 520 V420 A14 14 0 0 1 278 420 V520 Z"
        />
        <rect x="52" y="196" width="256" height="10" fill="#6b6058" />
        <rect x="52" y="250" width="256" height="6" fill="#463e38" />
        <rect x="70" y="210" width="220" height="34" fill="#3a332e" />
        {[80, 126, 234, 280].map((x) => (
          <rect key={x} x={x - 4} y="262" width="8" height="258" fill="#6a6058" opacity="0.6" />
        ))}
        <rect x="140" y="160" width="80" height="36" fill="#2a2522" />
        <path d="M0 520 H360 V640 H0 Z" fill="#191716" />
        <path d="M20 520 L24 470 L34 470 L36 520 Z M318 520 L320 440 L332 440 L336 520 Z" fill="#2a2522" />
      </svg>
      <Particles count={10} color="#d8c3a5" area={{ top: 30, bottom: 90 }} seed={17} />
    </div>
  );
}
