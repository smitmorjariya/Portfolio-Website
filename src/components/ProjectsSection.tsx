import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Expand, Github, X } from 'lucide-react';
import { PROJECTS, type ProjectItem } from '../data/portfolioData';
import { useSectionHydration } from '../hooks/useSectionHydration';
import { ReadingTimeBadge } from './ReadingTimeBadge';
import { ProjectCardsSkeleton, ProjectMediaSkeleton } from './Skeleton';

const PROJECTS_TEXT_SOURCE = PROJECTS.flatMap((project) => [
  project.title,
  project.subtitle,
  project.overview,
  project.problemSolved,
  project.contribution,
  ...project.features,
]);

const PROJECT_DEEP_LINK_IDS = ['projects', 'project', ...PROJECTS.map((project) => project.id)];

interface LightboxState {
  project: ProjectItem;
  imageIndex: number;
}

interface ProjectsSectionProps {
  onInspectProject?: (projectId: string | null) => void;
  isLoading?: boolean;
}

export function ProjectsSection({
  onInspectProject,
  isLoading = false,
}: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [activeImageByProject, setActiveImageByProject] = useState<Record<string, number>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const showProjectsSkeleton = useSectionHydration(sectionRef, {
    externalLoading: isLoading,
    delayMs: 360,
    deepLinkIds: PROJECT_DEEP_LINK_IDS,
  });

  const markImageLoaded = useCallback((src: string) => {
    setLoadedImages((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  }, []);

  useEffect(() => {
    if (showProjectsSkeleton || !listRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-project-card]', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, listRef);

    return () => ctx.revert();
  }, [showProjectsSkeleton]);

  useEffect(() => {
    onInspectProject?.(lightbox ? lightbox.project.id : null);
  }, [lightbox, onInspectProject]);

  useEffect(() => {
    if (!lightbox) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightbox(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox]);

  const getActiveImageIndex = (projectId: string) => activeImageByProject[projectId] ?? 0;

  const lightboxImage = lightbox ? lightbox.project.images[lightbox.imageIndex] : undefined;
  const lightboxImageLoaded = lightboxImage ? Boolean(loadedImages[lightboxImage.src]) : false;

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-heading"
      aria-busy={showProjectsSkeleton}
      className="scroll-mt-16 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="font-mono text-xs text-[#A78BFA] tabular-nums">05. Featured Projects</p>
              <ReadingTimeBadge source={PROJECTS_TEXT_SOURCE} />
            </div>
            <h2
              id="projects-heading"
              className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#F4F5F8] sm:text-3xl lg:text-4xl"
            >
              Real applications I built and shipped.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#A1A8BA] sm:text-base">
              Actual previews captured from my repositories and live deployments, detailing the problem solved, architecture, and my direct contribution.
            </p>
          </div>
          <p className="font-mono text-xs text-[#6E768B] tabular-nums">
            02 Selected Case Studies
          </p>
        </div>

        {showProjectsSkeleton ? (
          <ProjectCardsSkeleton count={PROJECTS.length} />
        ) : (
          <div ref={listRef} className="mt-14 space-y-16 lg:space-y-20">
            {PROJECTS.map((project) => {
              const activeIndex = getActiveImageIndex(project.id);
              const activeImage = project.images[activeIndex] ?? project.images[0];
              const imageFailed = Boolean(failedImages[activeImage.src]);
              const imageLoaded = Boolean(loadedImages[activeImage.src]);

              return (
                <article
                  key={project.id}
                  id={`project-${project.id}`}
                  data-project-card
                  data-project-id={project.id}
                  className="scroll-mt-24"
                >
                  <div className="card-interactive overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0D0F16]">
                    {/* Project Media Header — Large Authentic Screenshot Preview */}
                    <div className="border-b border-white/[0.08] bg-[#090B10] p-4 sm:p-6 lg:p-8">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#A1A8BA]">
                          <span className="font-mono text-[#A78BFA] tabular-nums">
                            {project.number}
                          </span>
                          <span aria-hidden="true" className="text-white/20">
                            /
                          </span>
                          <span>{project.category}</span>
                          <span aria-hidden="true" className="text-white/20">
                            ·
                          </span>
                          <span className="font-mono tabular-nums">{project.year}</span>
                          <ReadingTimeBadge
                            source={[
                              project.title,
                              project.subtitle,
                              project.overview,
                              project.problemSolved,
                              project.contribution,
                              ...project.features,
                            ]}
                          />
                        </div>

                        {/* Multi-screen switcher when a project has multiple real captures */}
                        {project.images.length > 1 && (
                          <div
                            role="tablist"
                            aria-label={`${project.title} preview screens`}
                            className="inline-flex items-center gap-1 rounded-lg bg-white/[0.04] p-1"
                          >
                            {project.images.map((img, idx) => (
                              <button
                                key={img.src}
                                type="button"
                                role="tab"
                                aria-selected={activeIndex === idx}
                                onClick={() =>
                                  setActiveImageByProject((prev) => ({
                                    ...prev,
                                    [project.id]: idx,
                                  }))
                                }
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-[background-color,color,box-shadow,transform,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer ${
                                  activeIndex === idx
                                    ? 'bg-[#7C5CFF] text-white shadow-[0_4px_14px_-4px_rgba(124,92,255,0.6)]'
                                    : 'text-[#A1A8BA] hover:bg-white/[0.06] hover:text-white'
                                }`}
                              >
                                {idx === 0 ? 'Dashboard View' : 'Login View'}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Interactive Preview Frame */}
                      <div data-parallax-frame className="will-change-transform">
                        <div className="group/frame relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#07080C] transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#7C5CFF]/35 hover:shadow-[0_14px_32px_-16px_rgba(124,92,255,0.28)]">
                          <button
                            type="button"
                            onClick={() => setLightbox({ project, imageIndex: activeIndex })}
                            aria-label={`Inspect ${project.title} screenshot fullscreen`}
                            data-cursor="expand"
                            className="block w-full text-left cursor-pointer focus-visible:outline-2"
                          >
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0B0D14]">
                              {!imageFailed && !imageLoaded && (
                                <ProjectMediaSkeleton className="absolute inset-0 z-10" />
                              )}

                              {!imageFailed ? (
                                <img
                                  key={activeImage.src}
                                  ref={(imgEl) => {
                                    if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
                                      markImageLoaded(activeImage.src);
                                    }
                                  }}
                                  src={activeImage.src}
                                  alt={activeImage.alt}
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  onLoad={() => markImageLoaded(activeImage.src)}
                                  onError={() =>
                                    setFailedImages((prev) => ({
                                      ...prev,
                                      [activeImage.src]: true,
                                    }))
                                  }
                                  className={`project-preview-img h-full w-full object-cover object-top will-change-transform transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                    imageLoaded ? 'opacity-100' : 'opacity-0'
                                  }`}
                                />
                              ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#131622] to-[#0A0C12] p-8 text-center">
                                  <p className="font-display text-2xl font-semibold text-[#F4F5F8]">
                                    {project.title}
                                  </p>
                                  <p className="mt-2 text-sm text-[#A1A8BA]">{project.subtitle}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] bg-[#0B0D14] px-4 py-3 text-xs text-[#A1A8BA] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/frame:bg-[#0F121D]">
                              <span className="truncate transition-colors duration-300 group-hover/frame:text-[#D6DBE7]">
                                {activeImage.caption}
                              </span>
                              <span className="inline-flex items-center gap-1.5 font-medium text-[#D6DBE7] transition-colors duration-300 group-hover/frame:text-[#C4B5FD] whitespace-nowrap shrink-0">
                                <Expand className="icon-motion icon-scale-subtle h-3.5 w-3.5" aria-hidden="true" />
                                <span>Inspect</span>
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Case Study Details */}
                    <div className="p-6 sm:p-8 lg:p-10">
                      <div className="flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-8 lg:flex-row lg:items-end">
                        <div>
                          <h3 className="font-display text-2xl font-bold tracking-tight text-[#F4F5F8] sm:text-3xl">
                            {project.title}
                            <span className="font-normal text-[#A1A8BA]">
                              {' '}
                              — {project.subtitle}
                            </span>
                          </h3>
                          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#D6DBE7] sm:text-base">
                            {project.overview}
                          </p>
                        </div>

                        {/* Action Links */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="group/btn btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#7C5CFF] px-4 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0"
                            >
                              <span>Live Demo</span>
                              <ArrowUpRight className="icon-motion icon-shift-tr h-4 w-4" aria-hidden="true" />
                            </a>
                          )}

                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`group/btn inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap shrink-0 ${
                              project.liveUrl
                                ? 'btn-secondary border border-white/[0.14] bg-white/[0.03] text-[#F4F5F8]'
                                : 'btn-primary bg-[#7C5CFF] font-semibold text-white'
                            }`}
                          >
                            <Github className="icon-motion icon-scale-subtle h-4 w-4" aria-hidden="true" />
                            <span>GitHub Repository</span>
                            <ArrowUpRight className="icon-motion icon-shift-tr h-4 w-4" aria-hidden="true" />
                          </a>
                        </div>
                      </div>

                      {/* Structured Case Study Grid */}
                      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                        <div className="space-y-6 lg:col-span-7">
                          <div>
                            <h4 className="text-xs font-semibold tracking-wide text-[#A78BFA]">
                              Problem It Solves
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-[#A1A8BA] sm:text-[15px]">
                              {project.problemSolved}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold tracking-wide text-[#93C5FD]">
                              My Contribution
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-[#A1A8BA] sm:text-[15px]">
                              {project.contribution}
                            </p>
                          </div>
                        </div>

                        <div className="lg:col-span-5">
                          <h4 className="text-xs font-semibold tracking-wide text-[#F4F5F8]">
                            Key Features
                          </h4>
                          <ul className="mt-3 space-y-2.5">
                            {project.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 text-sm leading-relaxed text-[#A1A8BA]"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#3B82F6]"
                                />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Technologies Used — clean unboxed typographic metadata */}
                      <div className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[0.08] pt-5 text-xs text-[#A1A8BA] sm:flex-row sm:items-center">
                        <p>
                          <span className="font-medium text-[#6E768B]">Technologies: </span>
                          <span className="text-[#D6DBE7]">{project.technologies.join(' · ')}</span>
                        </p>
                        {!project.liveUrl && (
                          <span className="font-mono text-[#6E768B] whitespace-nowrap shrink-0">
                            Local MERN build · Full source on GitHub
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Screenshot Lightbox Modal */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.project.title} screenshot viewer`}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-4 backdrop-blur-sm sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0B0D14]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-4">
              <div className="min-w-0">
                <p className="font-display text-base font-semibold text-white truncate">
                  {lightbox.project.title} — {lightbox.project.subtitle}
                </p>
                <p className="mt-0.5 text-xs text-[#A1A8BA] truncate">
                  {lightboxImage?.caption}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {lightbox.project.images.length > 1 && (
                  <div className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-white/[0.05] p-1">
                    {lightbox.project.images.map((img, idx) => (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() =>
                          setLightbox((prev) => (prev ? { ...prev, imageIndex: idx } : null))
                        }
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-[background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
                          lightbox.imageIndex === idx
                            ? 'bg-[#7C5CFF] text-white'
                            : 'text-[#A1A8BA] hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        {idx === 0 ? 'Dashboard' : 'Login'}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  aria-label="Close screenshot viewer"
                  className="btn-secondary inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.04] text-white cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="relative overflow-auto bg-[#07080C] p-3 sm:p-5">
              {lightboxImage && !lightboxImageLoaded && (
                <div className="mx-auto aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-lg border border-white/[0.08]">
                  <ProjectMediaSkeleton />
                </div>
              )}
              {lightboxImage && (
                <img
                  key={lightboxImage.src}
                  ref={(imgEl) => {
                    if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
                      markImageLoaded(lightboxImage.src);
                    }
                  }}
                  src={lightboxImage.src}
                  alt={lightboxImage.alt}
                  referrerPolicy="no-referrer"
                  onLoad={() => markImageLoaded(lightboxImage.src)}
                  className={`mx-auto max-h-[75vh] w-auto rounded-lg border border-white/[0.08] object-contain transition-opacity duration-300 ${
                    lightboxImageLoaded ? 'opacity-100' : 'h-0 opacity-0'
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProjectsSection;
