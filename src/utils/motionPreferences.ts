export interface CursorEnvironment {
  finePointer: boolean;
  hoverCapable: boolean;
  viewportWidth: number;
  reducedMotion: boolean;
}

export interface ParallaxEnvironment {
  viewportWidth: number;
  reducedMotion: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  saveData?: boolean;
}

export const DESKTOP_MIN_WIDTH = 1024;

export function shouldEnableCustomCursor(env: CursorEnvironment): boolean {
  if (env.reducedMotion) return false;
  if (!env.finePointer || !env.hoverCapable) return false;
  return true;
}

export function shouldEnableParallax(env: ParallaxEnvironment): boolean {
  if (env.reducedMotion) return false;
  if (env.saveData) return false;
  if (env.viewportWidth < DESKTOP_MIN_WIDTH) return false;
  if (typeof env.hardwareConcurrency === 'number' && env.hardwareConcurrency <= 2) {
    return false;
  }
  if (typeof env.deviceMemory === 'number' && env.deviceMemory <= 2) {
    return false;
  }
  return true;
}

export const INTERACTIVE_CURSOR_SELECTOR =
  'a, button, input, textarea, select, label, summary, [role="button"], [role="link"], [role="tab"], [contenteditable="true"]';

export const HOVER_SURFACE_CURSOR_SELECTOR =
  '.card-interactive, .card-portrait, .skill-row-interactive';

export type CursorMode = 'hidden' | 'custom' | 'hover' | 'native';

export function resolveCursorMode(flags: {
  isInteractive: boolean;
  isHoverSurface: boolean;
}): Exclude<CursorMode, 'hidden'> {
  if (flags.isInteractive) return 'native';
  if (flags.isHoverSurface) return 'hover';
  return 'custom';
}

/**
 * Standard linear interpolation between start and end by factor in [0, 1].
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Frame-rate-normalized lerp for smooth, lag-free cursor tracking across 60Hz/120Hz/144Hz displays.
 * Snaps to target within sub-pixel threshold so requestAnimationFrame loops stop cleanly at idle.
 */
export function lerpCursorAxis(
  current: number,
  target: number,
  dtSeconds: number,
  baseFactor = 0.28,
  snapThreshold = 0.2,
): number {
  if (Math.abs(target - current) < snapThreshold) return target;
  const clampedFactor = Math.min(Math.max(baseFactor, 0.01), 1);
  const clampedDt = Math.min(Math.max(dtSeconds, 0), 0.05);
  const frameFactor = 1 - Math.pow(1 - clampedFactor, clampedDt * 60);
  return lerp(current, target, frameFactor);
}
