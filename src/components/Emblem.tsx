/** Laurel wreath emblem used in the wordmark and empty states */
export function Emblem({ size = 28, color = '#AD9162' }: { size?: number; color?: string }) {
  const leaves = Array.from({ length: 6 }, (_, i) => 118 + i * 21); // degrees, bottom → top on the left
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <g fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
        <path d="M17.5 34 A14 14 0 0 1 9.5 9.5" />
        <path d="M22.5 34 A14 14 0 0 0 30.5 9.5" />
      </g>
      <g fill={color}>
        {leaves.map((deg, i) => {
          const a = (deg * Math.PI) / 180;
          const r = 14.6;
          const x = 20 + Math.cos(a) * r;
          const y = 21 + Math.sin(a) * r;
          const rot = deg + 90 - 35; // tangent, angled outward
          return (
            <g key={i}>
              <ellipse cx={x} cy={y} rx="1.6" ry="3.6" transform={`rotate(${rot} ${x} ${y})`} />
              <ellipse cx={40 - x} cy={y} rx="1.6" ry="3.6" transform={`rotate(${-rot} ${40 - x} ${y})`} />
            </g>
          );
        })}
      </g>
      <circle cx="20" cy="35" r="1.4" fill={color} />
    </svg>
  );
}

/** Thin decorative rule with a central lozenge */
export function Rule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-line" />
      <span className="h-1.5 w-1.5 rotate-45 border border-bronze/70" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-line" />
    </div>
  );
}
