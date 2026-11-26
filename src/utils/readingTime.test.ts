import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ABOUT_CONTENT,
  EDUCATION,
  EXPERIENCES,
  PROJECTS,
  SERVICES,
} from '../data/portfolioData';
import { countWords, estimateReadingTime } from './readingTime';

test('countWords accurately counts words across strings, nested arrays, and punctuation', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords('   — · /  '), 0);
  assert.equal(countWords('Hello world from React.js!'), 4);
  assert.equal(
    countWords(['Frontend developer', ['HTML5', 'CSS3', 'Tailwind CSS']]),
    6,
  );
});

test('estimateReadingTime formats sub-minute, single-minute, and multi-minute reading times', () => {
  const empty = estimateReadingTime('');
  assert.equal(empty.words, 0);
  assert.equal(empty.label, '< 1 min read');

  const shortText = Array(60).fill('word').join(' ');
  const shortEst = estimateReadingTime(shortText, 200);
  assert.equal(shortEst.words, 60);
  assert.equal(shortEst.label, '< 1 min read');

  const oneMinText = Array(180).fill('word').join(' ');
  const oneMinEst = estimateReadingTime(oneMinText, 200);
  assert.equal(oneMinEst.minutes, 1);
  assert.equal(oneMinEst.label, '1 min read');
  assert.equal(oneMinEst.ariaLabel, 'Estimated reading time: 1 minute');

  const twoMinText = Array(380).fill('word').join(' ');
  const twoMinEst = estimateReadingTime(twoMinText, 200);
  assert.equal(twoMinEst.minutes, 2);
  assert.equal(twoMinEst.label, '2 min read');
  assert.equal(twoMinEst.ariaLabel, 'Estimated reading time: 2 minutes');
});

test('portfolio long-form sections yield realistic reading-time estimates from real content', () => {
  const aboutEst = estimateReadingTime([ABOUT_CONTENT.heading, ABOUT_CONTENT.paragraphs]);
  assert.ok(aboutEst.words > 120);
  assert.equal(aboutEst.label, '1 min read');

  const experienceEst = estimateReadingTime(
    EXPERIENCES.flatMap((exp) => [exp.company, exp.role, exp.summary, ...exp.responsibilities]),
  );
  assert.ok(experienceEst.words > 130);
  assert.equal(experienceEst.label, '1 min read');

  const educationEst = estimateReadingTime(
    EDUCATION.flatMap((edu) => [edu.degree, edu.institution, edu.affiliation, edu.highlights]),
  );
  assert.ok(educationEst.words > 50);
  assert.equal(educationEst.label, '< 1 min read');

  const projectsEst = estimateReadingTime(
    PROJECTS.flatMap((p) => [
      p.title,
      p.subtitle,
      p.overview,
      p.problemSolved,
      p.contribution,
      ...p.features,
    ]),
  );
  assert.ok(projectsEst.words > 250);
  assert.equal(projectsEst.label, '2 min read');

  for (const project of PROJECTS) {
    const projectEst = estimateReadingTime([
      project.title,
      project.subtitle,
      project.overview,
      project.problemSolved,
      project.contribution,
      ...project.features,
    ]);
    assert.ok(projectEst.words > 100);
    assert.equal(projectEst.label, '1 min read');
  }

  const servicesEst = estimateReadingTime(
    SERVICES.flatMap((s) => [s.title, s.description, ...s.focus]),
  );
  assert.ok(servicesEst.words > 100);
  assert.equal(servicesEst.label, '1 min read');
});
