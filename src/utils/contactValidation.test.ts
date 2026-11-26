import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMailtoUrl,
  formatPlaintextInquiry,
  isValidEmail,
  validateContactField,
  validateContactForm,
} from './contactValidation';
import { PERSONAL_INFO, PROJECTS, SKILL_GROUPS } from '../data/portfolioData';

test('validateContactForm rejects empty required fields', () => {
  const result = validateContactForm({
    name: '   ',
    email: '',
    subject: '',
    message: '   ',
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
});

test('isValidEmail rejects malformed, injection, and edge-case email addresses', () => {
  const invalidEmails = [
    '',
    '   ',
    'plainaddress',
    'invalid-email@',
    '@domain.com',
    'user@domain',
    'user@domain.c',
    'user..name@domain.com',
    '.user@domain.com',
    'user.@domain.com',
    'user@.domain.com',
    'user@domain..com',
    'user@-domain.com',
    'user@domain-.com',
    'user name@domain.com',
    'user<script>@gmail.com',
    'user@gmail.com\r\nBcc: attacker@evil.com',
  ];

  for (const bad of invalidEmails) {
    assert.equal(isValidEmail(bad), false, `Expected invalid email to be rejected: ${JSON.stringify(bad)}`);
  }
});

test('isValidEmail accepts standard valid email addresses', () => {
  const validEmails = [
    'priya@company.com',
    'smit.8189@gmail.com',
    'recruiter+frontend@studio.co.in',
    'alex_patel-2026@sub.domain.dev',
  ];

  for (const good of validEmails) {
    assert.equal(isValidEmail(good), true, `Expected valid email to pass: ${good}`);
  }
});

test('validateContactField gives clear real-time errors and allows messages of any non-empty length', () => {
  assert.ok(validateContactField('name', ''));
  assert.ok(validateContactField('name', 'A'));
  assert.equal(validateContactField('name', 'Priya Sharma'), undefined);

  assert.ok(validateContactField('email', ''));
  assert.ok(validateContactField('email', 'bad..email@test.com'));
  assert.equal(validateContactField('email', 'priya@company.com'), undefined);

  assert.equal(validateContactField('subject', ''), undefined);
  assert.ok(validateContactField('subject', 'Line1\nLine2'));
  assert.equal(validateContactField('subject', 'Frontend Role'), undefined);

  assert.ok(validateContactField('message', ''));
  assert.ok(validateContactField('message', '   '));
  for (const validMsg of [
    'H',
    'OK',
    'Hi',
    'Hello',
    'Hello Smit, we reviewed your portfolio and would like to chat.',
    'A'.repeat(15000),
  ]) {
    assert.equal(
      validateContactField('message', validMsg),
      undefined,
      `Expected message of length ${validMsg.length} to be accepted`,
    );
  }
});

test('validateContactForm rejects invalid email format and header injection', () => {
  const result = validateContactForm({
    name: 'Priya Sharma',
    email: 'invalid-email@',
    subject: 'Frontend Intern Role',
    message: 'Hi Smit, we reviewed your portfolio and would like to connect.',
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.name, undefined);
  assert.ok(result.errors.email);
  assert.equal(result.errors.message, undefined);

  const injection = validateContactForm({
    name: 'Priya\r\nBcc: bad@example.com',
    email: 'priya@company.com',
    subject: 'Role\nBcc: bad@example.com',
    message: 'Hello Smit, testing header injection rejection.',
  });

  assert.equal(injection.isValid, false);
  assert.ok(injection.errors.name);
  assert.ok(injection.errors.subject);
});

test('validateContactForm accepts valid input and trims values', () => {
  const result = validateContactForm({
    name: '  Priya Sharma  ',
    email: '  priya@company.com ',
    subject: '  Interview Opportunity ',
    message: '  Hello Smit, we would like to discuss a React.js internship role.  ',
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
  assert.equal(result.sanitized.name, 'Priya Sharma');
  assert.equal(result.sanitized.email, 'priya@company.com');
  assert.equal(result.sanitized.subject, 'Interview Opportunity');
});

test('buildMailtoUrl creates properly encoded mailto URI with real recipient', () => {
  const url = buildMailtoUrl(PERSONAL_INFO.email, {
    name: 'Alex Patel',
    email: 'alex@studio.dev',
    subject: 'Frontend Developer Role',
    message: 'Interested in discussing our junior frontend opening.',
  });

  assert.ok(url.startsWith('mailto:smit.8189@gmail.com?'));
  assert.ok(url.includes('subject=Frontend%20Developer%20Role'));
  assert.ok(url.includes('Alex%20Patel'));
  assert.ok(!url.includes('your-email@example.com'));
});

test('formatPlaintextInquiry formats readable clipboard text', () => {
  const text = formatPlaintextInquiry({
    name: 'Alex Patel',
    email: 'alex@studio.dev',
    subject: '',
    message: 'Hello Smit, let us connect.',
  });

  assert.ok(text.includes('Subject: Portfolio Inquiry from Alex Patel'));
  assert.ok(text.includes('From: Alex Patel <alex@studio.dev>'));
  assert.ok(text.includes('Hello Smit, let us connect.'));
});

test('portfolioData integrity: real links, required skills, and real project screenshots', () => {
  assert.equal(PERSONAL_INFO.email, 'smit.8189@gmail.com');
  assert.equal(PERSONAL_INFO.githubUrl, 'https://github.com/smitmorjariya');
  assert.equal(PERSONAL_INFO.linkedinUrl, 'https://www.linkedin.com/in/smitmorjariya/');

  const frontendSkills = SKILL_GROUPS.find((g) => g.category === 'Frontend')?.items.map((i) => i.name);
  assert.deepEqual(frontendSkills, ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'React.js']);

  const toolSkills = SKILL_GROUPS.find((g) => g.category === 'Tools')?.items.map((i) => i.name);
  assert.deepEqual(toolSkills, ['Git', 'GitHub', 'VS Code', 'Google AI Studio']);

  assert.equal(PROJECTS.length, 2);
  assert.equal(PROJECTS[0].githubUrl, 'https://github.com/smitmorjariya/TeamOrbit-Task-Manager-App');
  assert.equal(PROJECTS[0].liveUrl, null);
  assert.equal(PROJECTS[1].githubUrl, 'https://github.com/smitmorjariya/PixelCraft_Website');
  assert.equal(PROJECTS[1].liveUrl, 'https://pixelcraftcreativestudio.vercel.app/');
});
