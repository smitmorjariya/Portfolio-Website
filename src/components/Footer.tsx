import { ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] bg-[#06070A] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
        <div>
          <p className="font-display text-base font-semibold text-[#F4F5F8]">
            {PERSONAL_INFO.name}
          </p>
          <p className="mt-1 text-xs text-[#A1A8BA]">
            {PERSONAL_INFO.title}
            <span aria-hidden="true" className="mx-2 text-white/25">
              ·
            </span>
            {PERSONAL_INFO.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#A1A8BA]">
          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="group/link social-pill-link inline-link-underline inline-flex items-center gap-1 hover:text-[#C4B5FD]"
          >
            <span>GitHub</span>
            <ArrowUpRight className="icon-motion icon-shift-tr h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a
            href={PERSONAL_INFO.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="group/link social-pill-link inline-link-underline inline-flex items-center gap-1 hover:text-[#93C5FD]"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="icon-motion icon-shift-tr h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="social-pill-link inline-link-underline hover:text-white"
          >
            Email
          </a>
          <a
            href={PERSONAL_INFO.resumeUrl}
            download="Smit_Morjariya_Resume.pdf"
            className="social-pill-link inline-link-underline hover:text-[#C4B5FD]"
          >
            Resume
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-white/[0.06] px-5 pt-6 sm:px-8">
        <p className="text-xs text-[#6E768B]">
          © {year} {PERSONAL_INFO.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
