export interface SectionMetric {
  id: string;
  /** Document-relative top offset in pixels (scrollY + rect.top). */
  top: number;
  /** Rendered element height in pixels. */
  height: number;
}

export interface ScrollSpyInput {
  scrollY: number;
  viewportHeight: number;
  documentHeight: number;
  sections: readonly SectionMetric[];
  /** Fraction of viewport height used as the reading anchor line (default 0.3). */
  triggerRatio?: number;
  /** Distance from document bottom in px that locks active section to the final section (default 40). */
  bottomThreshold?: number;
}

export interface ScrollSpyState {
  /** Active navigation section ID, or empty string when above the first tracked section. */
  activeSection: string;
  /** Normalized reading progress for the active section in [0, 1]. */
  sectionProgress: number;
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * Computes both the active navigation section and how much of that section
 * the user has read (0..1), accounting for tall sections, short sections,
 * and the bottom-of-document scroll ceiling for the final section.
 */
export function computeScrollSpyState({
  scrollY,
  viewportHeight,
  documentHeight,
  sections,
  triggerRatio = 0.3,
  bottomThreshold = 40,
}: ScrollSpyInput): ScrollSpyState {
  if (sections.length === 0 || viewportHeight <= 0) {
    return { activeSection: '', sectionProgress: 0 };
  }

  const safeScrollY = Math.max(0, scrollY);
  const triggerY = viewportHeight * triggerRatio;
  const readingLineDocY = safeScrollY + triggerY;
  const maxScrollY = Math.max(0, documentHeight - viewportHeight);
  const nearBottom = safeScrollY + viewportHeight >= documentHeight - bottomThreshold;

  let activeIndex = -1;
  for (let i = 0; i < sections.length; i += 1) {
    if (sections[i].top <= readingLineDocY) {
      activeIndex = i;
    }
  }

  if (nearBottom) {
    activeIndex = sections.length - 1;
  }

  if (activeIndex < 0) {
    return { activeSection: '', sectionProgress: 0 };
  }

  const active = sections[activeIndex];
  const isLastSection = activeIndex === sections.length - 1;

  if (isLastSection && maxScrollY > 0 && safeScrollY >= maxScrollY - 2) {
    return { activeSection: active.id, sectionProgress: 1 };
  }

  const sectionStartScrollY = Math.max(0, active.top - triggerY);
  const safeHeight = Math.max(1, active.height);
  const remainingDocScroll = Math.max(1, maxScrollY - sectionStartScrollY);
  const effectiveSpan = isLastSection
    ? Math.max(1, Math.min(safeHeight, remainingDocScroll))
    : Math.max(1, Math.min(safeHeight, remainingDocScroll));

  const rawProgress = (safeScrollY - sectionStartScrollY) / effectiveSpan;

  return {
    activeSection: active.id,
    sectionProgress: clamp01(rawProgress),
  };
}

/**
 * Quantizes normalized [0, 1] progress into integer percentage [0, 100]
 * for accessible ARIA reporting and crisp UI display.
 */
export function toProgressPercent(progress: number): number {
  return Math.round(clamp01(progress) * 100);
}
