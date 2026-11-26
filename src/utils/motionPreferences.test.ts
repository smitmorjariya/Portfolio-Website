import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DESKTOP_MIN_WIDTH,
  lerp,
  lerpCursorAxis,
  resolveCursorMode,
  shouldEnableCustomCursor,
  shouldEnableParallax,
} from './motionPreferences';

test('shouldEnableCustomCursor enables on fine-pointer hover devices at any desktop or preview width without reduced motion', () => {
  assert.equal(
    shouldEnableCustomCursor({
      finePointer: true,
      hoverCapable: true,
      viewportWidth: 1440,
      reducedMotion: false,
    }),
    true,
  );

  // Split-screen or embedded desktop preview pane with mouse/trackpad
  assert.equal(
    shouldEnableCustomCursor({
      finePointer: true,
      hoverCapable: true,
      viewportWidth: DESKTOP_MIN_WIDTH - 260,
      reducedMotion: false,
    }),
    true,
  );

  assert.equal(
    shouldEnableCustomCursor({
      finePointer: false,
      hoverCapable: false,
      viewportWidth: 1440,
      reducedMotion: false,
    }),
    false,
  );

  assert.equal(
    shouldEnableCustomCursor({
      finePointer: true,
      hoverCapable: false,
      viewportWidth: 1440,
      reducedMotion: false,
    }),
    false,
  );

  assert.equal(
    shouldEnableCustomCursor({
      finePointer: true,
      hoverCapable: true,
      viewportWidth: 1440,
      reducedMotion: true,
    }),
    false,
  );
});

test('shouldEnableParallax respects reduced motion, mobile viewports, save-data, and low-end devices', () => {
  assert.equal(
    shouldEnableParallax({
      viewportWidth: 1440,
      reducedMotion: false,
      hardwareConcurrency: 8,
      deviceMemory: 8,
      saveData: false,
    }),
    true,
  );

  // Mobile viewport disabled
  assert.equal(
    shouldEnableParallax({
      viewportWidth: 390,
      reducedMotion: false,
      hardwareConcurrency: 8,
      deviceMemory: 8,
    }),
    false,
  );

  // Reduced motion disabled
  assert.equal(
    shouldEnableParallax({
      viewportWidth: 1440,
      reducedMotion: true,
      hardwareConcurrency: 8,
      deviceMemory: 8,
    }),
    false,
  );

  // Low-end CPU / memory disabled
  assert.equal(
    shouldEnableParallax({
      viewportWidth: 1440,
      reducedMotion: false,
      hardwareConcurrency: 2,
      deviceMemory: 8,
    }),
    false,
  );

  assert.equal(
    shouldEnableParallax({
      viewportWidth: 1440,
      reducedMotion: false,
      hardwareConcurrency: 4,
      deviceMemory: 2,
    }),
    false,
  );

  // Save-Data preference disabled
  assert.equal(
    shouldEnableParallax({
      viewportWidth: 1440,
      reducedMotion: false,
      hardwareConcurrency: 8,
      saveData: true,
    }),
    false,
  );
});

test('lerp and lerpCursorAxis interpolate smoothly, stay frame-rate independent, and snap at idle', () => {
  assert.equal(lerp(0, 100, 0.25), 25);
  assert.equal(lerp(50, 100, 0.5), 75);

  // Snaps directly when within sub-pixel threshold so idle rAF stops
  assert.equal(lerpCursorAxis(99.85, 100, 1 / 60), 100);
  assert.equal(lerpCursorAxis(100.1, 100, 1 / 60), 100);

  // Exact baseFactor progress on a 60Hz frame
  const next60 = lerpCursorAxis(0, 100, 1 / 60, 0.28);
  assert.ok(Math.abs(next60 - 28) < 1e-9, `Expected 28 at 60Hz, got ${next60}`);

  // Frame-rate independence: two 120Hz steps equal one 60Hz step
  const halfStep = lerpCursorAxis(0, 100, 1 / 120, 0.28);
  const twoHalfSteps = lerpCursorAxis(halfStep, 100, 1 / 120, 0.28);
  assert.ok(Math.abs(twoHalfSteps - next60) < 1e-9);
});

test('resolveCursorMode prioritizes native OS cursor on interactive controls and hover ring on card surfaces', () => {
  assert.equal(resolveCursorMode({ isInteractive: true, isHoverSurface: true }), 'native');
  assert.equal(resolveCursorMode({ isInteractive: true, isHoverSurface: false }), 'native');
  assert.equal(resolveCursorMode({ isInteractive: false, isHoverSurface: true }), 'hover');
  assert.equal(resolveCursorMode({ isInteractive: false, isHoverSurface: false }), 'custom');
});
