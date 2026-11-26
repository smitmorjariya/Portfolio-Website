import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Download } from 'lucide-react';
import { NAV_ITEMS, PERSONAL_INFO } from '../data/portfolioData';
import { toProgressPercent } from '../utils/scrollSpy';

interface NavbarProps {
  activeSection: string;
  sectionProgress?: number;
}

const DESKTOP_BREAKPOINT = 768;

export function Navbar({ activeSection, sectionProgress = 0 }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLSpanElement>(null);
  const midBarRef = useRef<HTMLSpanElement>(null);
  const botBarRef = useRef<HTMLSpanElement>(null);
  const activeLinkProgressRef = useRef<HTMLSpanElement>(null);
  const activeMobileProgressRef = useRef<HTMLSpanElement>(null);
  const hasMountedRef = useRef(false);

  const clampedProgress = Math.min(1, Math.max(0, sectionProgress));
  const progressPercent = toProgressPercent(clampedProgress);
  const activeNavItem = NAV_ITEMS.find((item) => item.id === activeSection);
  const hasActiveSection = Boolean(activeNavItem);

  // Sync GPU-composited scaleX transforms synchronously before paint
  useLayoutEffect(() => {
    const scaleValue = `scaleX(${hasActiveSection ? clampedProgress : 0})`;
    if (activeLinkProgressRef.current) {
      activeLinkProgressRef.current.style.transform = scaleValue;
    }
    if (activeMobileProgressRef.current) {
      activeMobileProgressRef.current.style.transform = scaleValue;
    }
  }, [clampedProgress, hasActiveSection, activeSection]);

  const closeMobileMenu = useCallback((restoreFocus = false) => {
    setMobileOpen(false);
    if (restoreFocus) {
      toggleBtnRef.current?.focus();
    }
  }, []);

  // Track sticky header elevation state on scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on Escape or when resizing to desktop width
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        closeMobileMenu(true);
      }
    };

    const onResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT && mobileOpen) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileOpen, closeMobileMenu]);

  // GSAP-powered collapsible mobile drawer + morphing hamburger bars
  useEffect(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    const accentLine = accentLineRef.current;
    const topBar = topBarRef.current;
    const midBar = midBarRef.current;
    const botBar = botBarRef.current;

    if (!drawer || !backdrop || !topBar || !midBar || !botBar) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navItems = drawer.querySelectorAll<HTMLElement>('[data-mobile-nav-item]');
    const navActions = drawer.querySelector<HTMLElement>('[data-mobile-nav-actions]');

    // Initial closed state on first mount without animating
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      gsap.set(drawer, { height: 0, opacity: 0, display: 'none' });
      gsap.set(backdrop, { opacity: 0, display: 'none' });
      if (accentLine) {
        gsap.set(accentLine, { scaleX: 0, transformOrigin: 'left center' });
      }
      return;
    }

    // Kill any in-flight tweens so rapid toggling stays completely smooth and deterministic
    gsap.killTweensOf([
      drawer,
      backdrop,
      accentLine,
      topBar,
      midBar,
      botBar,
      navItems,
      navActions,
    ]);

    const dur = (seconds: number) => (prefersReducedMotion ? 0 : seconds);

    if (mobileOpen) {
      // Morph hamburger bars into a crisp X
      gsap.to(topBar, { y: 6, rotate: 45, duration: dur(0.3), ease: 'power3.out' });
      gsap.to(midBar, { opacity: 0, scaleX: 0, duration: dur(0.18), ease: 'power2.out' });
      gsap.to(botBar, { y: -6, rotate: -45, duration: dur(0.3), ease: 'power3.out' });

      // Fade in dimmed mobile backdrop
      gsap.set(backdrop, { display: 'block' });
      gsap.to(backdrop, { opacity: 1, duration: dur(0.28), ease: 'power2.out' });

      // Smoothly expand collapsible drawer height and stagger content
      gsap.set(drawer, { display: 'block', overflow: 'hidden' });
      const targetHeight = drawer.scrollHeight;

      const tl = gsap.timeline();
      tl.to(drawer, {
        height: targetHeight,
        opacity: 1,
        duration: dur(0.36),
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(drawer, { height: 'auto', overflow: 'visible' });
        },
      });

      if (accentLine) {
        tl.fromTo(
          accentLine,
          { scaleX: 0 },
          { scaleX: 1, duration: dur(0.38), ease: 'power3.out' },
          0.04,
        );
      }

      if (navItems.length > 0) {
        tl.fromTo(
          navItems,
          { y: -8, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: dur(0.26),
            stagger: prefersReducedMotion ? 0 : 0.04,
            ease: 'power2.out',
            clearProps: 'transform',
          },
          0.08,
        );
      }

      if (navActions) {
        tl.fromTo(
          navActions,
          { y: -6, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: dur(0.26),
            ease: 'power2.out',
            clearProps: 'transform',
          },
          0.16,
        );
      }
    } else {
      // Morph X back into three hamburger bars
      gsap.to(topBar, { y: 0, rotate: 0, duration: dur(0.26), ease: 'power3.inOut' });
      gsap.to(midBar, { opacity: 1, scaleX: 1, duration: dur(0.22), delay: dur(0.06), ease: 'power2.out' });
      gsap.to(botBar, { y: 0, rotate: 0, duration: dur(0.26), ease: 'power3.inOut' });

      // Fade out backdrop
      gsap.to(backdrop, {
        opacity: 0,
        duration: dur(0.24),
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(backdrop, { display: 'none' });
        },
      });

      // Collapse drawer smoothly back to height 0
      gsap.set(drawer, { overflow: 'hidden', height: drawer.offsetHeight });

      const tl = gsap.timeline();
      if (accentLine) {
        tl.to(accentLine, { scaleX: 0, duration: dur(0.2), ease: 'power2.in' }, 0);
      }

      if (navItems.length > 0) {
        tl.to(
          navItems,
          {
            y: -5,
            opacity: 0,
            duration: dur(0.16),
            ease: 'power2.in',
          },
          0,
        );
      }

      if (navActions) {
        tl.to(
          navActions,
          {
            y: -4,
            opacity: 0,
            duration: dur(0.16),
            ease: 'power2.in',
          },
          0,
        );
      }

      tl.to(
        drawer,
        {
          height: 0,
          opacity: 0,
          duration: dur(0.28),
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(drawer, { display: 'none' });
          },
        },
        0.04,
      );
    }
  }, [mobileOpen]);

  const handleNavClick = (sectionId: string) => {
    setMobileOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Dimmed mobile backdrop to dismiss the collapsible menu when tapping outside */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={() => closeMobileMenu(false)}
        className="fixed inset-0 top-16 z-30 hidden bg-[#040509]/70 backdrop-blur-[2px] md:hidden"
      />

      <header
        className={`sticky top-0 z-40 transition-[background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled || mobileOpen
            ? 'border-b border-white/[0.08] bg-[#07080C]/90 backdrop-blur-md'
            : 'border-b border-transparent bg-[#07080C]/60 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
          {/* Zone 1: Single-line brand wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setMobileOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display text-lg font-semibold tracking-tight text-[#F4F5F8] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#C4B5FD] whitespace-nowrap shrink-0"
          >
            {PERSONAL_INFO.shortName}
          </a>

          {/* Zone 2: 5 concise single-line section links (Desktop) */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  data-active={isActive ? 'true' : 'false'}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`nav-link-underline relative text-sm font-medium whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#F4F5F8]'
                      : 'text-[#A1A8BA] hover:text-[#F4F5F8]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      data-testid="active-nav-link-progress"
                      className="pointer-events-none absolute inset-x-0 -bottom-1 block h-[2px] overflow-hidden rounded-full bg-white/[0.12]"
                    >
                      <span
                        ref={activeLinkProgressRef}
                        className="block h-full w-full origin-left rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#3B82F6] transition-transform duration-150 ease-out will-change-transform"
                      />
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Single primary header CTA + Animated Mobile Hamburger Button */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={PERSONAL_INFO.resumeUrl}
              download="Smit_Morjariya_Resume.pdf"
              className="group/btn btn-primary hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#7C5CFF] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0"
            >
              <Download className="icon-motion icon-shift-down h-3.5 w-3.5" aria-hidden="true" />
              <span>Resume</span>
            </a>

            <button
              ref={toggleBtnRef}
              type="button"
              data-testid="mobile-menu-toggle"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`btn-secondary relative inline-flex h-11 w-11 items-center justify-center rounded-lg border cursor-pointer md:hidden ${
                mobileOpen
                  ? 'border-[#7C5CFF]/50 bg-[#7C5CFF]/[0.14] text-white shadow-[0_0_20px_-6px_rgba(124,92,255,0.65)]'
                  : 'border-white/[0.1] bg-white/[0.03] text-[#F4F5F8]'
              }`}
            >
              <span className="flex h-4 w-5 flex-col items-center justify-center gap-[4px]" aria-hidden="true">
                <span
                  ref={topBarRef}
                  className={`block h-[2px] w-5 origin-center rounded-full transition-colors duration-300 ${
                    mobileOpen
                      ? 'bg-gradient-to-r from-[#A78BFA] to-[#60A5FA]'
                      : 'bg-[#F4F5F8]'
                  }`}
                />
                <span
                  ref={midBarRef}
                  className="block h-[2px] w-5 origin-center rounded-full bg-[#A78BFA]"
                />
                <span
                  ref={botBarRef}
                  className={`block h-[2px] w-5 origin-center rounded-full transition-colors duration-300 ${
                    mobileOpen
                      ? 'bg-gradient-to-r from-[#60A5FA] to-[#A78BFA]'
                      : 'bg-[#F4F5F8]'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* GSAP-animated collapsible mobile navigation drawer */}
        <div
          ref={drawerRef}
          id="mobile-navigation-drawer"
          aria-hidden={!mobileOpen}
          className="relative overflow-hidden border-t border-white/[0.08] bg-[#090B12]/98 bg-[radial-gradient(24rem_14rem_at_88%_0%,rgba(124,92,255,0.14),transparent_70%),radial-gradient(20rem_12rem_at_12%_100%,rgba(59,130,246,0.1),transparent_70%)] backdrop-blur-xl md:hidden"
        >
          {/* Subtle purple-to-blue top gradient accent hairline */}
          <div
            ref={accentLineRef}
            aria-hidden="true"
            className="h-[1.5px] w-full bg-gradient-to-r from-[#7C5CFF] via-[#3B82F6] to-transparent"
          />

          <div className="px-5 pb-6 pt-4">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    data-mobile-nav-item
                    href={`#${item.id}`}
                    tabIndex={mobileOpen ? 0 : -1}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                    }}
                    className={`group/mlink relative flex min-h-[46px] items-center justify-between overflow-hidden rounded-xl border px-3.5 py-2.5 text-[15px] font-medium transition-[background-color,border-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? 'border-[#7C5CFF]/35 bg-gradient-to-r from-[#7C5CFF]/[0.16] via-[#3B82F6]/[0.08] to-transparent text-white shadow-[0_6px_20px_-14px_rgba(124,92,255,0.7)]'
                        : 'border-transparent text-[#A1A8BA] hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`h-4 w-[2.5px] rounded-full transition-opacity duration-300 ${
                          isActive
                            ? 'bg-gradient-to-b from-[#7C5CFF] to-[#3B82F6] opacity-100'
                            : 'bg-[#7C5CFF]/60 opacity-0 group-hover/mlink:opacity-60'
                        }`}
                      />
                      <span>{item.label}</span>
                    </span>
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        isActive ? 'text-[#A78BFA]' : 'text-[#6E768B]'
                      }`}
                    >
                      {isActive ? `${progressPercent}%` : `0${idx + 1}`}
                    </span>
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-white/[0.06]"
                      >
                        <span
                          ref={activeMobileProgressRef}
                          className="block h-full w-full origin-left bg-gradient-to-r from-[#7C5CFF] to-[#3B82F6] transition-transform duration-150 ease-out will-change-transform"
                        />
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>

            <div
              data-mobile-nav-actions
              className="mt-4 flex flex-col gap-2.5 border-t border-white/[0.08] pt-4"
            >
              <a
                href={PERSONAL_INFO.resumeUrl}
                download="Smit_Morjariya_Resume.pdf"
                tabIndex={mobileOpen ? 0 : -1}
                onClick={() => setMobileOpen(false)}
                className="group/btn btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFA] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(124,92,255,0.65)]"
              >
                <Download className="icon-motion icon-shift-down h-4 w-4" aria-hidden="true" />
                <span>Download Resume</span>
              </a>
              <a
                href="#contact"
                tabIndex={mobileOpen ? 0 : -1}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('contact');
                }}
                className="group/btn btn-secondary inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-[#7C5CFF]/30 bg-[#7C5CFF]/[0.06] px-4 py-2.5 text-sm font-medium text-[#F4F5F8]"
              >
                <span>Let&apos;s Connect</span>
                <ArrowUpRight className="icon-motion icon-shift-tr h-4 w-4 text-[#A78BFA]" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
