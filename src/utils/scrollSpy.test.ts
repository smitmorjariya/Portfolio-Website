import test from 'node:test';
import assert from 'node:assert/strict';
import { computeScrollSpyState, toProgressPercent, type SectionMetric } from './scrollSpy';

const MOCK_SECTIONS: SectionMetric[] = [
  { id: 'about', top: 900, height: 700 },
  { id: 'skills', top: 1600, height: 800 },
  { id: 'experience', top: 2400, height: 900 },
  { id: 'projects', top: 4100, height: 2200 },
  { id: 'contact', top: 7000, height: 800 },
];

const VIEWPORT_HEIGHT = 900; // triggerY = 270
const DOCUMENT_HEIGHT = 8000; // maxScrollY = 7100

test('returns empty active section and 0 progress while in hero above first tracked section', () => {
  const result = computeScrollSpyState({
    scrollY: 0,
    viewportHeight: VIEWPORT_HEIGHT,
    documentHeight: DOCUMENT_HEIGHT,
    sections: MOCK_SECTIONS,
  });

  assert.deepEqual(result, { activeSection: '', sectionProgress: 0 });
});

test('starts at 0% right when the first section reaches the reading anchor', () => {
  // about.top = 900, triggerY = 270 => sectionStartScrollY = 630
  const result = computeScrollSpyState({
    scrollY: 630,
    viewportHeight: VIEWPORT_HEIGHT,
    documentHeight: DOCUMENT_HEIGHT,
    sections: MOCK_SECTIONS,
  });

  assert.equal(result.activeSection, 'about');
  assert.equal(result.sectionProgress, 0);
});

test('advances monotonically through a section and reaches ~50% at midpoint', () => {
  // about: startScrollY = 630, height = 700 => midpoint = 980
  const mid = computeScrollSpyState({
    scrollY: 980,
    viewportHeight: VIEWPORT_HEIGHT,
    documentHeight: DOCUMENT_HEIGHT,
    sections: MOCK_SECTIONS,
  });

  assert.equal(mid.activeSection, 'about');
  assert.ok(Math.abs(mid.sectionProgress - 0.5) < 0.001);

  const nearEnd = computeScrollSpyState({
    scrollY: 1320,
    viewportHeight: VIEWPORT_HEIGHT,
    documentHeight: DOCUMENT_HEIGHT,
    sections: MOCK_SECTIONS,
  });

  assert.equal(nearEnd.activeSection, 'about');
  assert.ok(nearEnd.sectionProgress > 0.95 && nearEnd.sectionProgress < 1);
});

test('tracks tall projects section smoothly across quartiles', () => {
  // projects: top = 4100, triggerY = 270 => startScrollY = 3830, height = 2200
  const q1 = computeScrollSpyState({
    scrollY: 3830 + 550,
    viewportHeight: VIEWPORT_HEIGHT,
    documentHeight: DOCUMENT_HEIGHT,
    sections: MOCK_SECTIONS,
  });
  const q2 = computeScrollSpyState({
    scrollY: 3830 + 1100,
    viewportHeight: VIEWPORT_HEIGHT,
    documentHeight: DOCUMENT_HEIGHT,
    sections: MOCK_SECTIONS,
  });
  const q3 = computeScrollSpyState({
    scrollY: 3830 + 1650,
    viewportHeight: VIEWPORT_HEIGHT,
    documentHeight: DOCUMENT_HEIGHT,
    sections: MOCK_SECTIONS,
  });

  assert.equal(q1.activeSection, 'projects');
  assert.equal(toProgressPercent(q1.sectionProgress), 25);
  assert.equal(toProgressPercent(q2.sectionProgress), 50);
  assert.equal(toProgressPercent(q3.sectionProgress), 75);
});

test('scales final contact section against remaining document scroll so it reaches 100% at page bottom', () => {
  // contact: top = 7000, triggerY = 270 => startScrollY = 6730, maxScrollY = 7100 => effectiveSpan = 370
  const midContact = computeScrollSpyState({
    scrollY: 6730 + 185,
    viewportHeight: VIEWPORT_HEIGHT,
    documentHeight: DOCUMENT_HEIGHT,
    sections: MOCK_SECTIONS,
  });
  assert.equal(midContact.activeSection, 'contact');
  assert.equal(toProgressPercent(midContact.sectionProgress), 50);

  const atBottom = computeScrollSpyState({
    scrollY: 7100,
    viewportHeight: VIEWPORT_HEIGHT,
    documentHeight: DOCUMENT_HEIGHT,
    sections: MOCK_SECTIONS,
  });
  assert.equal(atBottom.activeSection, 'contact');
  assert.equal(atBottom.sectionProgress, 1);
});

test('handles empty sections array and out-of-bounds values safely', () => {
  const empty = computeScrollSpyState({
    scrollY: 500,
    viewportHeight: VIEWPORT_HEIGHT,
    documentHeight: DOCUMENT_HEIGHT,
    sections: [],
  });
  assert.deepEqual(empty, { activeSection: '', sectionProgress: 0 });
  assert.equal(toProgressPercent(-0.4), 0);
  assert.equal(toProgressPercent(1.8), 100);
  assert.equal(toProgressPercent(Number.NaN), 0);
});
