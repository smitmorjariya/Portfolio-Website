import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Download, Mail } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export function HeroSection() {
  const [portraitFailed, setPortraitFailed] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      {/* Subtle architectural hairline grid with gentle scroll depth */}
      <div
        aria-hidden="true"
        data-hero-grid-parallax
        className="editorial-grid-bg pointer-events-none absolute -inset-y-12 inset-x-0 will-change-transform"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Core Identity & Recruiter CTAs */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <p
                data-hero-reveal
                className="text-xs font-medium text-[#A1A8BA] sm:text-sm"
              >
                <span className="text-[#C4B5FD]">{PERSONAL_INFO.title}</span>
                <span aria-hidden="true" className="mx-2 text-white/25">
                  /
                </span>
                <span>{PERSONAL_INFO.location}</span>
              </p>

              <h1
                id="hero-heading"
                data-hero-reveal
                className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-[#F4F5F8] sm:text-5xl lg:text-[3.75rem]"
              >
                {PERSONAL_INFO.name}
              </h1>

              <p
                data-hero-reveal
                className="mt-4 max-w-2xl font-display text-xl font-medium leading-snug text-[#D6DBE7] sm:text-2xl"
              >
                {PERSONAL_INFO.tagline}
              </p>

              <p
                data-hero-reveal
                className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#A1A8BA] sm:text-base"
              >
                {PERSONAL_INFO.heroIntro}
              </p>

              {/* Primary & Secondary Recruiter Actions */}
              <div
                data-hero-reveal
                className="mt-8 flex flex-wrap items-center gap-3.5"
              >
                <button
                  type="button"
                  onClick={() => scrollToSection('projects')}
                  className="group/btn btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#7C5CFF] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>View My Work</span>
                  <ArrowDownRight className="icon-motion icon-shift-br h-4 w-4" aria-hidden="true" />
                </button>

                <a
                  href={PERSONAL_INFO.resumeUrl}
                  download="Smit_Morjariya_Resume.pdf"
                  className="group/btn btn-secondary inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/[0.14] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-[#F4F5F8] whitespace-nowrap shrink-0"
                >
                  <Download className="icon-motion icon-shift-down h-4 w-4 text-[#A78BFA]" aria-hidden="true" />
                  <span>Download Resume</span>
                </a>

                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="group/btn btn-ghost inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium text-[#C8CFDE] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Mail className="icon-motion icon-scale-subtle h-4 w-4 text-[#60A5FA]" aria-hidden="true" />
                  <span>Let&apos;s Connect</span>
                </button>
              </div>
            </div>

            {/* Quiet availability note — editorial text, zero decorative pulsing dots */}
            <div
              data-hero-reveal
              className="mt-10 border-t border-white/[0.08] pt-5 text-xs leading-relaxed text-[#A1A8BA] sm:text-sm"
            >
              <span className="font-medium text-[#F4F5F8]">Open to roles:</span>{' '}
              Frontend Developer, React.js Intern &amp; Junior Web Developer opportunities
            </div>
          </div>

          {/* Right Column: Clean Editorial Portrait Frame */}
          <div data-hero-media className="lg:col-span-5">
            <div className="group card-portrait relative h-full min-h-[340px] overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0D0F16] sm:min-h-[400px]">
              {!portraitFailed ? (
                <img
                  src={PERSONAL_INFO.portraitUrl}
                  alt="Portrait of Smit Morjariya, Front-End Developer"
                  referrerPolicy="no-referrer"
                  onError={() => setPortraitFailed(true)}
                  className="portrait-img-interactive h-full w-full object-cover object-top will-change-[filter,transform]"
                />
              ) : (
                <div className="flex h-full min-h-[360px] w-full flex-col items-center justify-center bg-gradient-to-br from-[#131622] to-[#0B0D14] p-8 text-center">
                  <span className="font-display text-3xl font-semibold text-[#F4F5F8]">SM</span>
                  <span className="mt-2 text-sm text-[#A1A8BA]">{PERSONAL_INFO.name}</span>
                </div>
              )}

              {/* Measured bottom scrim for legible caption without dulling original hover colors */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#07080C]/92 via-[#07080C]/45 to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-2.5 p-5 sm:flex-row sm:items-end">
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold text-white">
                    {PERSONAL_INFO.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#C8CFDE]">
                    B.E. Computer Science · GTU
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-[#D6DBE7] shrink-0">
                  <a
                    href={PERSONAL_INFO.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group/link social-pill-link inline-link-underline inline-flex items-center gap-1 hover:text-[#C4B5FD] whitespace-nowrap"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="icon-motion icon-shift-tr h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <span aria-hidden="true" className="text-white/25">
                    ·
                  </span>
                  <a
                    href={PERSONAL_INFO.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group/link social-pill-link inline-link-underline inline-flex items-center gap-1 hover:text-[#93C5FD] whitespace-nowrap"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="icon-motion icon-shift-tr h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width recruiter scan strip below the split hero */}
        <div
          data-hero-reveal
          className="mt-12 grid grid-cols-1 gap-6 border-t border-white/[0.08] pt-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="group rounded-xl p-3 -m-3 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/[0.025]">
            <p className="text-xs font-medium text-[#6E768B] transition-colors duration-300 group-hover:text-[#A78BFA]">
              Education
            </p>
            <p className="mt-1.5 text-sm font-medium text-[#F4F5F8]">
              B.E. Computer Science &amp; Eng.
            </p>
            <p className="mt-0.5 font-mono text-xs text-[#A1A8BA] tabular-nums">
              GTU · 2021–2025 · CGPA 7.83
            </p>
          </div>

          <div className="group rounded-xl p-3 -m-3 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/[0.025]">
            <p className="text-xs font-medium text-[#6E768B] transition-colors duration-300 group-hover:text-[#93C5FD]">
              Latest Internship
            </p>
            <p className="mt-1.5 text-sm font-medium text-[#F4F5F8]">
              Zidio Development (MERN)
            </p>
            <p className="mt-0.5 font-mono text-xs text-[#A1A8BA] tabular-nums">
              Feb 2025 – May 2025 · Remote
            </p>
          </div>

          <div className="group rounded-xl p-3 -m-3 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/[0.025]">
            <p className="text-xs font-medium text-[#6E768B] transition-colors duration-300 group-hover:text-[#A78BFA]">
              Core Stack
            </p>
            <p className="mt-1.5 text-sm font-medium text-[#F4F5F8]">
              React.js · JavaScript · Tailwind
            </p>
            <p className="mt-0.5 text-xs text-[#A1A8BA]">
              HTML5 · CSS3 · Git &amp; GitHub
            </p>
          </div>

          <div className="group rounded-xl p-3 -m-3 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/[0.025]">
            <p className="text-xs font-medium text-[#6E768B] transition-colors duration-300 group-hover:text-[#93C5FD]">
              Direct Contact
            </p>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="inline-link-underline mt-1.5 inline-block text-sm font-medium text-[#C4B5FD] hover:text-white"
            >
              {PERSONAL_INFO.email}
            </a>
            <p className="mt-0.5 text-xs text-[#A1A8BA]">{PERSONAL_INFO.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
