import { Clock } from 'lucide-react';
import { estimateReadingTime, type TextSource } from '../utils/readingTime';

interface ReadingTimeBadgeProps {
  source: TextSource;
  className?: string;
}

export function ReadingTimeBadge({ source, className = '' }: ReadingTimeBadgeProps) {
  const estimate = estimateReadingTime(source);

  return (
    <span
      data-testid="reading-time-badge"
      aria-label={estimate.ariaLabel}
      title={`${estimate.words} words · ${estimate.label}`}
      className={`inline-flex items-center gap-1.5 rounded-md border border-white/[0.09] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] leading-tight text-[#A1A8BA] tabular-nums whitespace-nowrap shrink-0 transition-[border-color,color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#7C5CFF]/35 hover:bg-[#7C5CFF]/[0.07] hover:text-[#D6DBE7] ${className}`}
    >
      <Clock className="h-3 w-3 shrink-0 text-[#A78BFA]/85" aria-hidden="true" />
      <span>{estimate.label}</span>
    </span>
  );
}
