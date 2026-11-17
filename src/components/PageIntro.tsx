import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}

export function PageIntro({ eyebrow, title, subtitle, right, className = '' }: Props) {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        {eyebrow && <div className="label-caps mb-1.5 text-[10px] text-bronze">{eyebrow}</div>}
        <h1 className="font-display text-[24px] leading-tight font-semibold tracking-[0.08em] text-ivory sm:text-[28px]">
          {title}
        </h1>
        {subtitle && <p className="mt-1 font-serif text-[17px] text-sub italic">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
