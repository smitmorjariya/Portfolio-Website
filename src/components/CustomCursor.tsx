import { useEffect, useRef, useState } from 'react';
import {
  HOVER_SURFACE_CURSOR_SELECTOR,
  INTERACTIVE_CURSOR_SELECTOR,
  lerpCursorAxis,
  resolveCursorMode,
  shouldEnableCustomCursor,
  type CursorMode,
} from '../utils/motionPreferences';

const RING_LERP_FACTOR = 0.28;

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const ringPosRef = useRef<HTMLDivElement>(null);
  const dotPosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const evaluateEnvironment = () => {
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      const hoverCapable = window.matchMedia('(hover: hover)').matches;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setEnabled(
        shouldEnableCustomCursor({
          finePointer,
          hoverCapable,
          viewportWidth: window.innerWidth,
          reducedMotion,
        }),
      );
    };

    evaluateEnvironment();

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const hoverQuery = window.matchMedia('(hover: hover)');

    window.addEventListener('resize', evaluateEnvironment, { passive: true });
    reducedQuery.addEventListener('change', evaluateEnvironment);
    pointerQuery.addEventListener('change', evaluateEnvironment);
    hoverQuery.addEventListener('change', evaluateEnvironment);

    return () => {
      window.removeEventListener('resize', evaluateEnvironment);
      reducedQuery.removeEventListener('change', evaluateEnvironment);
      pointerQuery.removeEventListener('change', evaluateEnvironment);
      hoverQuery.removeEventListener('change', evaluateEnvironment);
    };
  }, []);

  useEffect(() => {
    const rootEl = document.documentElement;

    if (!enabled) {
      rootEl.classList.remove('custom-cursor-active');
      return;
    }

    const container = containerRef.current;
    const ringPos = ringPosRef.current;
    const dotPos = dotPosRef.current;
    if (!container || !ringPos || !dotPos) return;

    rootEl.classList.add('custom-cursor-active');

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let hasPosition = false;
    let currentMode: CursorMode = 'hidden';
    let isPressed = false;
    let rafId = 0;
    let lastTime = 0;

    const applyPosition = (el: HTMLDivElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const setCursorMode = (nextMode: CursorMode) => {
      if (currentMode === nextMode) return;
      currentMode = nextMode;
      container.dataset.cursorMode = nextMode;
      if (nextMode === 'hidden' || nextMode === 'native') {
        if (isPressed) {
          isPressed = false;
          container.dataset.pressed = 'false';
        }
      }
    };

    const setPressedState = (nextPressed: boolean) => {
      if (isPressed === nextPressed) return;
      isPressed = nextPressed;
      container.dataset.pressed = nextPressed ? 'true' : 'false';
    };

    const tick = (now: number) => {
      const dt = lastTime ? (now - lastTime) / 1000 : 1 / 60;
      lastTime = now;

      ringX = lerpCursorAxis(ringX, targetX, dt, RING_LERP_FACTOR);
      ringY = lerpCursorAxis(ringY, targetY, dt, RING_LERP_FACTOR);
      applyPosition(ringPos, ringX, ringY);

      if (ringX !== targetX || ringY !== targetY) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = 0;
        lastTime = 0;
      }
    };

    const startLerpLoop = () => {
      if (!rafId) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const stopLerpLoop = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
        lastTime = 0;
      }
    };

    const inspectTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        return { isInteractive: false, isHoverSurface: false };
      }
      return {
        isInteractive: Boolean(target.closest(INTERACTIVE_CURSOR_SELECTOR)),
        isHoverSurface: Boolean(target.closest(HOVER_SURFACE_CURSOR_SELECTOR)),
      };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') {
        handleLeave();
        return;
      }

      targetX = e.clientX;
      targetY = e.clientY;

      // Zero-latency direct GPU transform for the precision center dot
      applyPosition(dotPos, targetX, targetY);

      const nextMode = resolveCursorMode(inspectTarget(e.target));
      const wasHiddenOrNative = currentMode === 'hidden' || currentMode === 'native';

      // Snap outer ring on initial entry or when returning from hidden/native mode
      if (!hasPosition || wasHiddenOrNative) {
        hasPosition = true;
        stopLerpLoop();
        ringX = targetX;
        ringY = targetY;
        applyPosition(ringPos, ringX, ringY);
      } else {
        startLerpLoop();
      }

      setCursorMode(nextMode);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') {
        handleLeave();
        return;
      }
      if (inspectTarget(e.target).isInteractive) return;
      setPressedState(true);
    };

    const handlePointerUp = () => {
      setPressedState(false);
    };

    const handleLeave = () => {
      hasPosition = false;
      stopLerpLoop();
      setCursorMode('hidden');
    };

    container.dataset.cursorMode = 'hidden';
    container.dataset.pressed = 'false';

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('blur', handleLeave);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      rootEl.classList.remove('custom-cursor-active');
      stopLerpLoop();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('blur', handleLeave);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-testid="custom-cursor"
      data-cursor-mode="hidden"
      data-pressed="false"
      className="pointer-events-none fixed inset-0 z-[60]"
    >
      {/* Fixed-position outer ring driven by requestAnimationFrame + lerp */}
      <div
        ref={ringPosRef}
        className="pointer-events-none fixed top-0 left-0 will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div className="custom-cursor-ring -ml-3.5 -mt-3.5 flex h-7 w-7 items-center justify-center rounded-full">
          <span className="absolute -top-[2px] h-[4px] w-[1px] bg-[#A78BFA]/85" />
          <span className="absolute -bottom-[2px] h-[4px] w-[1px] bg-[#60A5FA]/85" />
        </div>
      </div>

      {/* Fixed-position zero-latency center pointer */}
      <div
        ref={dotPosRef}
        className="pointer-events-none fixed top-0 left-0 will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div className="custom-cursor-dot -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[#C4B5FD] to-[#3B82F6]" />
      </div>
    </div>
  );
}
