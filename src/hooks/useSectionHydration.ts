import { type RefObject, useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface UseSectionHydrationOptions {
  /** Optional external loading override (e.g., async data fetch or test control). */
  externalLoading?: boolean;
  /** Brief progressive skeleton settle window when first entering the viewport. */
  delayMs?: number;
  /** Skip hydration delay when landing directly on a matching hash/route deep link. */
  deepLinkIds?: string[];
}

function matchesDeepLink(deepLinkIds: string[]): boolean {
  if (typeof window === 'undefined' || deepLinkIds.length === 0) return false;
  const hash = window.location.hash.replace(/^#/, '').toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();

  return deepLinkIds.some((id) => {
    const lower = id.toLowerCase();
    return (
      hash === lower ||
      hash.startsWith(`${lower}-`) ||
      pathname.includes(lower) ||
      search.includes(lower)
    );
  });
}

/**
 * Coordinates intersection-aware skeleton hydration for below-the-fold sections.
 * Displays the matching skeleton structure as a section enters view and smoothly
 * settles into full content while keeping GSAP ScrollTrigger positions in sync.
 */
export function useSectionHydration(
  targetRef: RefObject<HTMLElement | null>,
  {
    externalLoading = false,
    delayMs = 340,
    deepLinkIds = [],
  }: UseSectionHydrationOptions = {},
): boolean {
  const [hydrated, setHydrated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    if (matchesDeepLink(deepLinkIds)) return true;
    return false;
  });

  useEffect(() => {
    if (hydrated) return;

    const el = targetRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setHydrated(true);
      return;
    }

    let timerId: number | null = null;
    let settled = false;

    const triggerHydrate = () => {
      if (settled) return;
      settled = true;
      timerId = window.setTimeout(() => {
        setHydrated(true);
      }, delayMs);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          triggerHydrate();
        }
      },
      { rootMargin: '140px 0px', threshold: 0.01 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
    };
  }, [hydrated, targetRef, delayMs]);

  useEffect(() => {
    if (!hydrated || externalLoading) return;
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(rafId);
  }, [hydrated, externalLoading]);

  return externalLoading || !hydrated;
}
