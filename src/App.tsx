/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ParallaxBackdrop } from './components/ParallaxBackdrop';
import { ScrollProgress } from './components/ScrollProgress';
import { SectionDivider } from './components/SectionDivider';
import { ServicesSection } from './components/ServicesSection';
import { ExperienceSectionSkeleton, ProjectsSectionSkeleton } from './components/Skeleton';
import { SkillsSection } from './components/SkillsSection';
import { NAV_ITEMS, PROJECTS } from './data/portfolioData';
import { useDocumentMetadata } from './hooks/useDocumentMetadata';
import { DESKTOP_MIN_WIDTH, shouldEnableParallax } from './utils/motionPreferences';
import { computeScrollSpyState } from './utils/scrollSpy';
import {
  SEO_SECTION_IDS,
  parseSeoTargetFromLocation,
  type SeoTarget,
} from './utils/seoMetadata';

const ExperienceEducationSection = lazy(() =>
  import('./components/ExperienceEducationSection').then((module) => ({
    default: module.ExperienceEducationSection,
  })),
);

const ProjectsSection = lazy(() =>
  import('./components/ProjectsSection').then((module) => ({
    default: module.ProjectsSection,
  })),
);

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [sectionProgress, setSectionProgress] = useState<number>(0);
  const [scrollSeoTarget, setScrollSeoTarget] = useState<SeoTarget>(() =>
    typeof window !== 'undefined' ? parseSeoTargetFromLocation(window.location) : 'home',
  );
  const [inspectedProjectId, setInspectedProjectId] = useState<string | null>(null);

  const activeSeoTarget: SeoTarget = inspectedProjectId
    ? `project:${inspectedProjectId}`
    : scrollSeoTarget;

  useDocumentMetadata(activeSeoTarget);

  // Handle initial deep-link routes (/projects/teamorbit, ?project=pixelcraft, #project-teamorbit)
  useEffect(() => {
    const initialTarget = parseSeoTargetFromLocation(window.location);
    if (initialTarget.startsWith('project:')) {
      const projectId = initialTarget.slice('project:'.length);
      const targetEl = document.getElementById(`project-${projectId}`);
      if (targetEl) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
      setScrollSeoTarget(initialTarget);
    }
  }, []);

  // Track active nav section and granular section/project SEO metadata across scroll & hash changes
  useEffect(() => {
    let rafId = 0;

    const updateActiveState = () => {
      const navSections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
        (el): el is HTMLElement => Boolean(el),
      );
      if (navSections.length === 0) return;

      const seoSections = SEO_SECTION_IDS.map((id) => ({
        id,
        el: document.getElementById(id),
      })).filter((entry): entry is { id: (typeof SEO_SECTION_IDS)[number]; el: HTMLElement } =>
        Boolean(entry.el),
      );
      const projectCards = PROJECTS.map((project) => ({
        id: project.id,
        el: document.getElementById(`project-${project.id}`),
      })).filter((entry): entry is { id: string; el: HTMLElement } => Boolean(entry.el));

      const sectionMetrics = navSections.map((section) => {
        const rect = section.getBoundingClientRect();
        return {
          id: section.id,
          top: window.scrollY + rect.top,
          height: rect.height,
        };
      });

      const triggerY = window.innerHeight * 0.3;
      const nearBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40;

      // 1. Update top navbar highlight and current-section reading progress
      const spy = computeScrollSpyState({
        scrollY: window.scrollY,
        viewportHeight: window.innerHeight,
        documentHeight: document.documentElement.scrollHeight,
        sections: sectionMetrics,
      });
      const quantizedProgress = Math.round(spy.sectionProgress * 100) / 100;
      setActiveSection((prev) => (prev === spy.activeSection ? prev : spy.activeSection));
      setSectionProgress((prev) => (prev === quantizedProgress ? prev : quantizedProgress));

      // 2. Update granular SEO target (sections + individual project cards)
      let currentSeo: SeoTarget = 'home';
      for (const { id, el } of seoSections) {
        if (el.getBoundingClientRect().top <= triggerY) {
          currentSeo = id;
        }
      }

      if (currentSeo === 'projects') {
        for (const { id, el } of projectCards) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.25) {
            currentSeo = `project:${id}`;
          }
        }
      }

      if (nearBottom) {
        currentSeo = 'contact';
      }

      // Preserve explicit project deep-link metadata while still at top of document
      if (window.scrollY < 40) {
        const locationTarget = parseSeoTargetFromLocation(window.location);
        if (locationTarget !== 'home') {
          currentSeo = locationTarget;
        }
      }

      setScrollSeoTarget((prev) => (prev === currentSeo ? prev : currentSeo));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveState);
    };

    const onLocationChange = () => {
      const target = parseSeoTargetFromLocation(window.location);
      if (target !== 'home') {
        setScrollSeoTarget(target);
      } else {
        onScroll();
      }
    };

    updateActiveState();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  // GSAP + ScrollTrigger choreography (compositor-only, respects reduced motion & low-end/mobile devices)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !rootRef.current) return;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };

    const parallaxCapable = shouldEnableParallax({
      viewportWidth: DESKTOP_MIN_WIDTH,
      reducedMotion: prefersReducedMotion,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: nav.deviceMemory,
      saveData: nav.connection?.saveData,
    });

    const ctx = gsap.context(() => {
      // Hero entrance — subtle vertical rise + opacity, smooth symmetric deceleration
      gsap.from('[data-hero-reveal]', {
        y: 22,
        opacity: 0,
        duration: 0.78,
        stagger: 0.08,
        ease: 'power3.inOut',
        clearProps: 'transform,opacity',
      });

      gsap.from('[data-hero-media]', {
        y: 24,
        opacity: 0,
        duration: 0.85,
        delay: 0.12,
        ease: 'power3.inOut',
        clearProps: 'transform,opacity',
      });

      // Scroll-triggered staggered section items
      gsap.utils.toArray<HTMLElement>('[data-reveal-section]').forEach((section) => {
        const items = section.querySelectorAll('[data-reveal-item]');
        if (items.length === 0) return;

        gsap.from(items, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.inOut',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: section,
            start: 'top 84%',
            once: true,
          },
        });
      });

      // Staggered fade-in and slide-up for individual skill badges per group
      gsap.utils.toArray<HTMLElement>('[data-skill-group]').forEach((group, groupIndex) => {
        const badges = group.querySelectorAll<HTMLElement>('[data-skill-badge]');
        if (badges.length === 0) return;

        gsap.from(badges, {
          y: 18,
          opacity: 0,
          duration: 0.56,
          delay: groupIndex === 0 ? 0.12 : 0.18,
          stagger: 0.075,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: group,
            start: 'top 84%',
            once: true,
          },
        });
      });

      // Staggered Featured Project cards
      gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card) => {
        gsap.from(card, {
          y: 28,
          opacity: 0,
          duration: 0.78,
          ease: 'power3.inOut',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true,
          },
        });
      });

      // Contact section subtle slide-in entrance for contact details and message form
      const contactSection = rootRef.current?.querySelector<HTMLElement>('[data-contact-section]');
      if (contactSection) {
        const contactIntro = contactSection.querySelector<HTMLElement>('[data-contact-intro]');
        const contactDetails = contactSection.querySelectorAll<HTMLElement>('[data-contact-detail]');
        const contactForm = contactSection.querySelector<HTMLElement>('[data-contact-form]');

        const contactTl = gsap.timeline({
          scrollTrigger: {
            trigger: contactSection,
            start: 'top 82%',
            once: true,
          },
        });

        if (contactIntro) {
          contactTl.from(contactIntro, {
            x: -20,
            opacity: 0,
            duration: 0.72,
            ease: 'power3.inOut',
            clearProps: 'transform,opacity',
          });
        }

        if (contactDetails.length > 0) {
          contactTl.from(
            contactDetails,
            {
              x: -26,
              opacity: 0,
              duration: 0.7,
              stagger: 0.09,
              ease: 'power3.inOut',
              clearProps: 'transform,opacity',
            },
            '-=0.45',
          );
        }

        if (contactForm) {
          contactTl.from(
            contactForm,
            {
              x: 24,
              opacity: 0,
              duration: 0.78,
              ease: 'power3.inOut',
              clearProps: 'transform,opacity',
            },
            '<0.12',
          );
        }
      }

      // Subtle GPU-composited parallax layers — strictly desktop & capable devices via matchMedia
      if (parallaxCapable) {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
          // 1. Ambient backdrop atmospheric layers drifting across full document scroll
          gsap.utils.toArray<HTMLElement>('[data-parallax-layer]').forEach((layer) => {
            const distance = Number(layer.dataset.parallaxY ?? -80);
            gsap.fromTo(
              layer,
              { y: 0 },
              {
                y: distance,
                ease: 'power2.inOut',
                force3D: true,
                scrollTrigger: {
                  trigger: document.documentElement,
                  start: 'top top',
                  end: 'bottom bottom',
                  scrub: 1.15,
                },
              },
            );
          });

          // 2. Hero architectural grid gentle scroll depth
          const heroGrid = rootRef.current?.querySelector<HTMLElement>('[data-hero-grid-parallax]');
          const heroSection = document.getElementById('top');
          if (heroGrid && heroSection) {
            gsap.fromTo(
              heroGrid,
              { y: 0 },
              {
                y: 44,
                ease: 'power2.inOut',
                force3D: true,
                scrollTrigger: {
                  trigger: heroSection,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 0.95,
                },
              },
            );
          }

          // 3. Subtle depth shift on Featured Project preview frames
          gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card) => {
            const frame = card.querySelector<HTMLElement>('[data-parallax-frame]');
            if (!frame) return;
            gsap.fromTo(
              frame,
              { y: 14 },
              {
                y: -14,
                ease: 'power2.inOut',
                force3D: true,
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.9,
                },
              },
            );
          });
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen bg-[#07080C] text-[#F4F5F8]">
      <ParallaxBackdrop />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-[#7C5CFF] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <ScrollProgress />
      <CustomCursor />

      <div className="relative z-10">
        <Navbar activeSection={activeSection} sectionProgress={sectionProgress} />

        <main id="main-content">
          <HeroSection />
          <SectionDivider variant="violet-blue" />
          <AboutSection />
          <SectionDivider variant="blue-violet" />
          <SkillsSection />
          <SectionDivider variant="violet-blue" />
          <Suspense fallback={<ExperienceSectionSkeleton />}>
            <ExperienceEducationSection />
          </Suspense>
          <SectionDivider variant="violet-blue" />
          <Suspense fallback={<ProjectsSectionSkeleton />}>
            <ProjectsSection onInspectProject={setInspectedProjectId} />
          </Suspense>
          <SectionDivider variant="blue-violet" />
          <ServicesSection />
          <SectionDivider variant="violet-blue" />
          <ContactSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}
