import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { EDUCATION, EXPERIENCES } from '../data/portfolioData';
import { useSectionHydration } from '../hooks/useSectionHydration';
import { ReadingTimeBadge } from './ReadingTimeBadge';
import { SectionDivider } from './SectionDivider';
import { EducationTimelineSkeleton, ExperienceCardsSkeleton } from './Skeleton';

const EXPERIENCE_TEXT_SOURCE = EXPERIENCES.flatMap((exp) => [
  exp.company,
  exp.role,
  exp.summary,
  ...exp.responsibilities,
]);

const EDUCATION_TEXT_SOURCE = EDUCATION.flatMap((edu) => [
  edu.degree,
  edu.institution,
  edu.affiliation,
  edu.highlights,
]);

interface ExperienceEducationSectionProps {
  isLoading?: boolean;
}

export function ExperienceEducationSection({
  isLoading = false,
}: ExperienceEducationSectionProps) {
  const experienceSectionRef = useRef<HTMLElement>(null);
  const experienceListRef = useRef<HTMLDivElement>(null);
  const educationSectionRef = useRef<HTMLElement>(null);
  const educationListRef = useRef<HTMLOListElement>(null);

  const showExperienceSkeleton = useSectionHydration(experienceSectionRef, {
    externalLoading: isLoading,
    delayMs: 340,
    deepLinkIds: ['experience'],
  });

  const showEducationSkeleton = useSectionHydration(educationSectionRef, {
    externalLoading: isLoading,
    delayMs: 320,
    deepLinkIds: ['education'],
  });

  useEffect(() => {
    if (showExperienceSkeleton || !experienceListRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-experience-card]', {
        y: 16,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }, experienceListRef);

    return () => ctx.revert();
  }, [showExperienceSkeleton]);

  useEffect(() => {
    if (showEducationSkeleton || !educationListRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-education-item]', {
        y: 14,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }, educationListRef);

    return () => ctx.revert();
  }, [showEducationSkeleton]);

  return (
    <>
      {/* Section 03: Experience */}
      <section
        ref={experienceSectionRef}
        id="experience"
        aria-labelledby="experience-heading"
        aria-busy={showExperienceSkeleton}
        className="scroll-mt-16 py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="font-mono text-xs text-[#A78BFA] tabular-nums">03. Experience</p>
              <ReadingTimeBadge source={EXPERIENCE_TEXT_SOURCE} />
            </div>
            <h2
              id="experience-heading"
              className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#F4F5F8] sm:text-3xl lg:text-4xl"
            >
              Practical internship experience.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#A1A8BA] sm:text-base">
              Hands-on remote development internships building responsive front-end layouts and a full-stack MERN task management application.
            </p>
          </div>

          {showExperienceSkeleton ? (
            <ExperienceCardsSkeleton count={EXPERIENCES.length} />
          ) : (
            <div ref={experienceListRef} className="mt-12 space-y-6">
              {EXPERIENCES.map((item) => (
                <div key={item.id} data-experience-card>
                  <article className="group card-interactive rounded-2xl border border-white/[0.08] bg-[#0D0F16] p-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
                      {/* Date & Organization Column */}
                      <div className="lg:col-span-4">
                        <p className="font-mono text-xs text-[#93C5FD] tabular-nums">
                          {item.period}
                        </p>
                        <h3 className="mt-2 font-display text-xl font-semibold text-[#F4F5F8] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white">
                          {item.company}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-[#C4B5FD]">{item.role}</p>
                        <p className="mt-2 text-xs text-[#A1A8BA]">
                          {item.location}
                          <span aria-hidden="true" className="mx-2 text-white/25">
                            ·
                          </span>
                          {item.duration}
                        </p>
                      </div>

                      {/* Responsibilities & Stack Column */}
                      <div className="lg:col-span-8">
                        <p className="text-[15px] leading-relaxed text-[#E6E9F2]">
                          {item.summary}
                        </p>

                        <ul className="mt-5 space-y-2.5">
                          {item.responsibilities.map((point, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-sm leading-relaxed text-[#A1A8BA] transition-colors duration-300 group-hover:text-[#C8CFDE]"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#7C5CFF]"
                              />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6 border-t border-white/[0.06] pt-4 text-xs text-[#A1A8BA]">
                          <span className="font-medium text-[#6E768B]">Stack used: </span>
                          {item.technologies.join(' · ')}
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionDivider variant="blue-violet" />

      {/* Section 04: Education (Dedicated Separate Timeline) */}
      <section
        ref={educationSectionRef}
        id="education"
        aria-labelledby="education-heading"
        aria-busy={showEducationSkeleton}
        className="scroll-mt-16 py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <p className="font-mono text-xs text-[#A78BFA] tabular-nums">04. Education</p>
                <ReadingTimeBadge source={EDUCATION_TEXT_SOURCE} />
              </div>
              <h2
                id="education-heading"
                className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#F4F5F8] sm:text-3xl"
              >
                Academic foundation in computer science.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#A1A8BA]">
                Formal engineering education in Computer Science &amp; Engineering under Gujarat Technological University (GTU).
              </p>
            </div>

            <div className="lg:col-span-8">
              {showEducationSkeleton ? (
                <EducationTimelineSkeleton count={EDUCATION.length} />
              ) : (
                <ol
                  ref={educationListRef}
                  className="divide-y divide-white/[0.08] border-y border-white/[0.08]"
                >
                  {EDUCATION.map((edu) => (
                    <li key={edu.id} data-education-item>
                      <div className="group -mx-4 rounded-xl border-l-2 border-transparent px-4 py-7 transition-[background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] first:pt-6 last:pb-6 hover:border-[#7C5CFF]/70 hover:bg-white/[0.025]">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-mono text-xs text-[#93C5FD] tabular-nums">
                            {edu.period}
                          </span>
                          <span className="font-mono text-xs text-[#C4B5FD] tabular-nums">
                            {edu.grade}
                          </span>
                        </div>

                        <h3 className="mt-2 font-display text-xl font-semibold text-[#F4F5F8] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white">
                          {edu.degree}
                        </h3>

                        <p className="mt-1 text-sm text-[#919ae6]">
                          {edu.institution}
                          <span aria-hidden="true" className="mx-2 text-white">
                            ·
                          </span>
                          <span className="text-[#A1A8BA]">{edu.affiliation}</span>
                        </p>

                        <p className="mt-3 text-sm leading-relaxed text-[#A1A8BA] transition-colors duration-300 group-hover:text-[#C8CFDE]">
                          {edu.highlights}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ExperienceEducationSection;
