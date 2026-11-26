interface SectionDividerProps {
  variant?: 'violet-blue' | 'blue-violet';
}

export function SectionDivider({ variant = 'violet-blue' }: SectionDividerProps) {
  const coreAccentClass =
    variant === 'violet-blue'
      ? 'bg-[linear-gradient(90deg,transparent_0%,rgba(124,92,255,0.68)_35%,rgba(59,130,246,0.62)_65%,transparent_100%)]'
      : 'bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.62)_35%,rgba(124,92,255,0.68)_65%,transparent_100%)]';

  const ambientGlowClass =
    variant === 'violet-blue'
      ? 'bg-[linear-gradient(90deg,transparent_0%,rgba(124,92,255,0.35)_38%,rgba(59,130,246,0.32)_62%,transparent_100%)]'
      : 'bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.32)_38%,rgba(124,92,255,0.35)_62%,transparent_100%)]';

  return (
    <div
      aria-hidden="true"
      data-testid="section-divider"
      className="pointer-events-none relative mx-auto max-w-6xl px-5 sm:px-8"
    >
      <div className="relative flex items-center justify-center">
        {/* Base architectural hairline */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

        {/* Symmetric violet-to-blue accent core */}
        <div className={`absolute h-px w-4/5 max-w-2xl ${coreAccentClass}`} />

        {/* Whisper-soft ambient dispersion */}
        <div className={`absolute h-[3px] w-3/5 max-w-xl blur-[2px] ${ambientGlowClass}`} />
      </div>
    </div>
  );
}
