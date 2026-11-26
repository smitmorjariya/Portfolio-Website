import { SectionDivider } from './SectionDivider';

interface SkeletonBlockProps {
  className?: string;
  accent?: boolean;
}

export function SkeletonBlock({ className = '', accent = false }: SkeletonBlockProps) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer ${accent ? 'skeleton-shimmer-accent' : ''} ${className}`}
    />
  );
}

interface ExperienceCardsSkeletonProps {
  count?: number;
}

/**
 * Structural skeleton matching the Experience card layout (12-col split:
 * 4-col date/company/role metadata + 8-col summary, responsibilities & stack).
 */
export function ExperienceCardsSkeleton({ count = 2 }: ExperienceCardsSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-testid="experience-skeleton"
      className="mt-12 space-y-6"
    >
      <span className="sr-only">Loading internship and work experience...</span>
      {Array.from({ length: count }).map((_, cardIdx) => (
        <div
          key={cardIdx}
          className="rounded-2xl border border-white/[0.08] bg-[#0D0F16] p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
            {/* Date & Organization Column */}
            <div className="space-y-3 lg:col-span-4">
              <SkeletonBlock accent className="h-3.5 w-36 rounded-md" />
              <SkeletonBlock className="h-6 w-48 rounded-md" />
              <SkeletonBlock accent className="h-4 w-44 rounded-md" />
              <div className="flex items-center gap-2 pt-1">
                <SkeletonBlock className="h-3 w-16 rounded-md" />
                <SkeletonBlock className="h-3 w-20 rounded-md" />
              </div>
            </div>

            {/* Responsibilities & Stack Column */}
            <div className="lg:col-span-8">
              <div className="space-y-2.5">
                <SkeletonBlock className="h-4 w-full rounded-md" />
                <SkeletonBlock className="h-4 w-11/12 rounded-md" />
              </div>

              <div className="mt-5 space-y-3">
                {Array.from({ length: cardIdx === 0 ? 4 : 2 }).map((_, lineIdx) => (
                  <div key={lineIdx} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7C5CFF]/40"
                    />
                    <SkeletonBlock
                      className={`h-3.5 rounded-md ${
                        lineIdx % 2 === 0 ? 'w-11/12' : 'w-4/5'
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
                <SkeletonBlock className="h-3 w-16 rounded-md" />
                <SkeletonBlock className="h-3 w-56 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface EducationTimelineSkeletonProps {
  count?: number;
}

/**
 * Structural skeleton matching the 2-row Education timeline inside ExperienceEducationSection.
 */
export function EducationTimelineSkeleton({ count = 2 }: EducationTimelineSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-testid="education-skeleton"
      className="divide-y divide-white/[0.08] border-y border-white/[0.08]"
    >
      <span className="sr-only">Loading education timeline...</span>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="py-7 first:pt-6 last:pb-6">
          <div className="flex items-center justify-between gap-4">
            <SkeletonBlock accent className="h-3.5 w-24 rounded-md" />
            <SkeletonBlock accent className="h-3.5 w-20 rounded-md" />
          </div>
          <SkeletonBlock className="mt-3 h-6 w-3/4 max-w-md rounded-md" />
          <SkeletonBlock className="mt-2.5 h-4 w-2/3 max-w-sm rounded-md" />
          <div className="mt-3.5 space-y-2">
            <SkeletonBlock className="h-3.5 w-full rounded-md" />
            <SkeletonBlock className="h-3.5 w-5/6 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Full-section Suspense fallback for ExperienceEducationSection preserving
 * section landmarks (#experience, #education) and exact vertical rhythm.
 */
export function ExperienceSectionSkeleton() {
  return (
    <>
      <section
        id="experience"
        aria-label="Loading experience section"
        className="scroll-mt-16 py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl space-y-3">
            <SkeletonBlock accent className="h-3.5 w-28 rounded-md" />
            <SkeletonBlock className="h-9 w-80 max-w-full rounded-lg" />
            <SkeletonBlock className="h-4 w-full max-w-xl rounded-md" />
          </div>
          <ExperienceCardsSkeleton count={2} />
        </div>
      </section>

      <SectionDivider variant="blue-violet" />

      <section
        id="education"
        aria-label="Loading education section"
        className="scroll-mt-16 py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-3 lg:col-span-4">
              <SkeletonBlock accent className="h-3.5 w-28 rounded-md" />
              <SkeletonBlock className="h-8 w-64 max-w-full rounded-lg" />
              <SkeletonBlock className="h-4 w-full rounded-md" />
              <SkeletonBlock className="h-4 w-4/5 rounded-md" />
            </div>
            <div className="lg:col-span-8">
              <EducationTimelineSkeleton count={2} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

interface ProjectMediaSkeletonProps {
  className?: string;
}

/**
 * Progressive image skeleton overlay shown inside project screenshot preview frames
 * and the fullscreen lightbox while high-resolution PNG assets load.
 */
export function ProjectMediaSkeleton({ className = '' }: ProjectMediaSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-testid="project-media-skeleton"
      className={`pointer-events-none flex h-full w-full flex-col justify-between bg-[#0B0D14] p-4 sm:p-6 ${className}`}
    >
      <span className="sr-only">Loading project preview image...</span>
      {/* Subtle browser/dashboard top bar hint */}
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-2.5 w-2.5 rounded-full" />
          <SkeletonBlock className="h-2.5 w-2.5 rounded-full" />
          <SkeletonBlock className="h-2.5 w-2.5 rounded-full" />
        </div>
        <SkeletonBlock className="h-3 w-36 rounded-md" />
        <SkeletonBlock accent className="h-3 w-16 rounded-md" />
      </div>

      {/* Dashboard-like content blocks */}
      <div className="my-auto grid grid-cols-12 gap-3 py-4 sm:gap-4">
        <SkeletonBlock className="col-span-4 h-20 rounded-xl sm:h-28" />
        <SkeletonBlock className="col-span-4 h-20 rounded-xl sm:h-28" />
        <SkeletonBlock accent className="col-span-4 h-20 rounded-xl sm:h-28" />
        <SkeletonBlock className="col-span-7 h-24 rounded-xl sm:h-36" />
        <SkeletonBlock className="col-span-5 h-24 rounded-xl sm:h-36" />
      </div>

      {/* Bottom subtle status strip */}
      <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] pt-3">
        <SkeletonBlock className="h-2.5 w-44 rounded-md" />
        <SkeletonBlock accent className="h-2.5 w-20 rounded-md" />
      </div>
    </div>
  );
}

interface ProjectCardsSkeletonProps {
  count?: number;
}

/**
 * Structural skeleton matching the Featured Project case-study cards
 * (media preview frame, title & CTA bar, 7/5 problem/contribution/features grid, tech row).
 */
export function ProjectCardsSkeleton({ count = 2 }: ProjectCardsSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-testid="projects-skeleton"
      className="mt-14 space-y-16 lg:space-y-20"
    >
      <span className="sr-only">Loading featured projects...</span>
      {Array.from({ length: count }).map((_, idx) => (
        <article
          key={idx}
          className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0D0F16]"
        >
          {/* Project Media Header Skeleton */}
          <div className="border-b border-white/[0.08] bg-[#090B10] p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
              <div className="flex items-center gap-3">
                <SkeletonBlock accent className="h-3.5 w-6 rounded-md" />
                <SkeletonBlock className="h-3.5 w-52 max-w-[60vw] rounded-md" />
                <SkeletonBlock className="h-3.5 w-10 rounded-md" />
              </div>
              {idx === 0 && (
                <div className="inline-flex items-center gap-1 rounded-lg bg-white/[0.04] p-1">
                  <SkeletonBlock accent className="h-7 w-28 rounded-md" />
                  <SkeletonBlock className="h-7 w-20 rounded-md" />
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#07080C]">
              <div className="aspect-[16/10] w-full">
                <ProjectMediaSkeleton />
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] bg-[#0B0D14] px-4 py-3">
                <SkeletonBlock className="h-3.5 w-72 max-w-[70%] rounded-md" />
                <SkeletonBlock className="h-3.5 w-16 rounded-md" />
              </div>
            </div>
          </div>

          {/* Case Study Details Skeleton */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-8 lg:flex-row lg:items-end">
              <div className="w-full max-w-2xl space-y-3">
                <SkeletonBlock className="h-8 w-80 max-w-full rounded-lg" />
                <SkeletonBlock className="h-4 w-full rounded-md" />
                <SkeletonBlock className="h-4 w-5/6 rounded-md" />
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {idx === 1 && <SkeletonBlock accent className="h-11 w-32 rounded-lg" />}
                <SkeletonBlock
                  accent={idx === 0}
                  className="h-11 w-44 rounded-lg"
                />
              </div>
            </div>

            {/* Structured 7/5 Case Study Grid Skeleton */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <div className="space-y-2.5">
                  <SkeletonBlock accent className="h-3.5 w-32 rounded-md" />
                  <SkeletonBlock className="h-3.5 w-full rounded-md" />
                  <SkeletonBlock className="h-3.5 w-11/12 rounded-md" />
                  <SkeletonBlock className="h-3.5 w-4/5 rounded-md" />
                </div>
                <div className="space-y-2.5">
                  <SkeletonBlock accent className="h-3.5 w-28 rounded-md" />
                  <SkeletonBlock className="h-3.5 w-full rounded-md" />
                  <SkeletonBlock className="h-3.5 w-10/12 rounded-md" />
                </div>
              </div>

              <div className="lg:col-span-5">
                <SkeletonBlock className="h-3.5 w-24 rounded-md" />
                <div className="mt-3.5 space-y-3">
                  {Array.from({ length: 4 }).map((_, featIdx) => (
                    <div key={featIdx} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B82F6]/45"
                      />
                      <SkeletonBlock
                        className={`h-3.5 rounded-md ${
                          featIdx % 2 === 0 ? 'w-11/12' : 'w-4/5'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technologies Footer Skeleton */}
            <div className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center">
              <SkeletonBlock className="h-3.5 w-80 max-w-full rounded-md" />
              {idx === 0 && <SkeletonBlock className="h-3.5 w-52 rounded-md" />}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

/**
 * Full-section Suspense fallback for ProjectsSection preserving #projects landmark
 * and exact layout geometry while the lazy-loaded Projects chunk is fetched.
 */
export function ProjectsSectionSkeleton() {
  return (
    <section
      id="projects"
      aria-label="Loading featured projects section"
      className="scroll-mt-16 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <SkeletonBlock accent className="h-3.5 w-36 rounded-md" />
            <SkeletonBlock className="h-9 w-96 max-w-full rounded-lg" />
            <SkeletonBlock className="h-4 w-full max-w-xl rounded-md" />
          </div>
          <SkeletonBlock className="h-3.5 w-36 rounded-md" />
        </div>
        <ProjectCardsSkeleton count={2} />
      </div>
    </section>
  );
}
