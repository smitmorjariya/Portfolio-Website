import { ABOUT_CONTENT } from '../data/portfolioData';
import { ReadingTimeBadge } from './ReadingTimeBadge';

const ABOUT_TEXT_SOURCE = [
  ABOUT_CONTENT.heading,
  ABOUT_CONTENT.paragraphs,
] as const;

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      data-reveal-section
      className="scroll-mt-16 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Rail: Section Label & Key Profile Facts */}
          <div className="lg:col-span-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="font-mono text-xs text-[#A78BFA] tabular-nums">01. About Me</p>
              <ReadingTimeBadge source={ABOUT_TEXT_SOURCE} />
            </div>
            <h2
              id="about-heading"
              className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#F4F5F8] sm:text-3xl"
            >
              {ABOUT_CONTENT.heading}
            </h2>

            <dl className="mt-8 space-y-2 border-t border-white/[0.08] pt-6">
              {ABOUT_CONTENT.quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="group space-y-1 rounded-lg border-l-2 border-transparent px-3 py-2 -mx-3 transition-[background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#7C5CFF]/70 hover:bg-white/[0.025]"
                >
                  <dt className="text-xs font-medium text-[#6E768B] transition-colors duration-300 group-hover:text-[#A78BFA]">
                    {fact.label}
                  </dt>
                  <dd className="text-sm text-[#D6DBE7] transition-colors duration-300 group-hover:text-white">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right Rail: Authentic Developer Narrative */}
          <div className="space-y-6 lg:col-span-8 lg:pt-8">
            {ABOUT_CONTENT.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                data-reveal-item
                className={`leading-relaxed ${
                  index === 0
                    ? 'text-base text-[#E6E9F2] sm:text-lg'
                    : 'text-[15px] text-[#A1A8BA] sm:text-base'
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
