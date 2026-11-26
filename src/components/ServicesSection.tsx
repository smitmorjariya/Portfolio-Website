import { SERVICES } from '../data/portfolioData';
import { ReadingTimeBadge } from './ReadingTimeBadge';

const SERVICES_TEXT_SOURCE = SERVICES.flatMap((service) => [
  service.title,
  service.description,
  ...service.focus,
]);

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      data-reveal-section
      className="py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="font-mono text-xs text-[#A78BFA] tabular-nums">06. What I Do</p>
            <ReadingTimeBadge source={SERVICES_TEXT_SOURCE} />
          </div>
          <h2
            id="services-heading"
            className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#F4F5F8] sm:text-3xl lg:text-4xl"
          >
            Front-end development capabilities.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#A1A8BA] sm:text-base">
            Focused on writing reliable, responsive client-side code for modern web applications and business websites.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {SERVICES.map((service) => (
            <div key={service.number} data-reveal-item>
              <div className="group card-interactive flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0D0F16] p-6 sm:p-8">
                <div>
                  <p className="font-mono text-xs text-[#6E768B] tabular-nums transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#A78BFA]">
                    {service.number}.
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-[#F4F5F8] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A1A8BA] transition-colors duration-300 group-hover:text-[#C8CFDE]">
                    {service.description}
                  </p>
                </div>

                <p className="mt-6 border-t border-white/[0.06] pt-4 text-xs text-[#C8CFDE] transition-colors duration-300 group-hover:border-[#7C5CFF]/25 group-hover:text-[#E6E9F2]">
                  {service.focus.join(' · ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
