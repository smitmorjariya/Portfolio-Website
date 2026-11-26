import test from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import {
  DEFAULT_OWNER_EMAIL,
  escapeHtml,
  sendContactEmails,
  type EmailMessagePayload,
  type MailTransporterLike,
} from './contactMailer.ts';

test('Scenario 1: Empty form submission is rejected with 400 and sends zero emails', async () => {
  const sent: EmailMessagePayload[] = [];
  const fakeTransporter: MailTransporterLike = {
    async sendMail(mail) {
      sent.push(mail);
      return { messageId: 'unexpected' };
    },
  };

  const result = await sendContactEmails(
    { name: '', email: '', subject: '', message: '' },
    { transporter: fakeTransporter, env: { EMAIL_USER: 'smit.8189@gmail.com', EMAIL_PASS: 'app-pass' } },
  );

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.status, 400);
    assert.equal(result.code, 'VALIDATION_ERROR');
    assert.ok(result.fieldErrors?.name);
    assert.ok(result.fieldErrors?.email);
    assert.ok(result.fieldErrors?.message);
  }
  assert.equal(sent.length, 0);
});

test('Scenario 2: Invalid email address is rejected with 400 and sends zero emails', async () => {
  const sent: EmailMessagePayload[] = [];
  const fakeTransporter: MailTransporterLike = {
    async sendMail(mail) {
      sent.push(mail);
      return { messageId: 'unexpected' };
    },
  };

  const result = await sendContactEmails(
    {
      name: 'Riya Patel',
      email: 'riya..patel@invalid',
      subject: 'Frontend Opportunity',
      message: 'We would love to interview you for a React.js role.',
    },
    { transporter: fakeTransporter, env: { EMAIL_USER: 'smit.8189@gmail.com', EMAIL_PASS: 'app-pass' } },
  );

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.status, 400);
    assert.equal(result.code, 'VALIDATION_ERROR');
    assert.ok(result.fieldErrors?.email);
    assert.equal(result.fieldErrors?.name, undefined);
    assert.equal(result.fieldErrors?.message, undefined);
  }
  assert.equal(sent.length, 0);
});

test('Scenarios 3, 4, 5, 6: Valid submission sends formatted owner email to smit.8189@gmail.com and auto-reply to visitor email', async () => {
  const sent: EmailMessagePayload[] = [];
  const fakeTransporter: MailTransporterLike = {
    async sendMail(mail) {
      sent.push(mail);
      return { messageId: `<msg-${sent.length}@test.local>` };
    },
  };

  const fixedDate = new Date('2026-05-15T10:30:00.000Z');
  const result = await sendContactEmails(
    {
      name: 'Riya <script>alert(1)</script> Patel',
      email: 'riya.patel@example.com',
      subject: 'Frontend Developer Interview',
      message: 'Hi Smit,\nWe loved your TeamOrbit & PixelCraft projects!\nLet us schedule a call.',
    },
    {
      transporter: fakeTransporter,
      now: fixedDate,
      env: { EMAIL_USER: 'smit.8189@gmail.com', EMAIL_PASS: 'test-app-password' },
    },
  );

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.status, 200);
    assert.equal(result.ownerMessageId, '<msg-1@test.local>');
    assert.equal(result.autoReplyMessageId, '<msg-2@test.local>');
    assert.equal(result.submittedAt, fixedDate.toISOString());
  }

  assert.equal(sent.length, 2);

  // Verify Email #1: Owner notification to smit.8189@gmail.com
  const ownerMail = sent[0];
  assert.equal(ownerMail.to, DEFAULT_OWNER_EMAIL);
  assert.equal(ownerMail.to, 'smit.8189@gmail.com');
  assert.equal(ownerMail.replyTo, 'riya.patel@example.com');
  assert.ok(ownerMail.subject.includes('Frontend Developer Interview'));
  assert.ok(ownerMail.text.includes('riya.patel@example.com'));
  assert.ok(ownerMail.text.includes('2026-05-15T10:30:00.000Z'));
  assert.ok(ownerMail.text.includes('TeamOrbit & PixelCraft'));
  // Ensure HTML escaping prevented raw script tag injection
  assert.ok(!ownerMail.html.includes('<script>alert(1)</script>'));
  assert.ok(ownerMail.html.includes(escapeHtml('Riya <script>alert(1)</script> Patel')));
  assert.ok(ownerMail.html.includes('<br />'));

  // Verify Email #2: Automatic confirmation reply strictly to visitor's email (NOT owner's email)
  const autoReplyMail = sent[1];
  assert.equal(autoReplyMail.to, 'riya.patel@example.com');
  assert.notEqual(autoReplyMail.to, DEFAULT_OWNER_EMAIL);
  assert.equal(autoReplyMail.replyTo, DEFAULT_OWNER_EMAIL);
  assert.equal(autoReplyMail.subject, 'Thank You for Contacting Me — Smit Morjariya');
  assert.ok(autoReplyMail.text.includes('Hi Riya <script>alert(1)</script> Patel,'));
  assert.ok(autoReplyMail.text.includes('successfully received'));
  assert.ok(!autoReplyMail.html.includes('<script>alert(1)</script>'));
  assert.ok(autoReplyMail.html.includes('Thank you for reaching out'));
});

test('Nodemailer real jsonTransport compiles both MIME emails cleanly', async () => {
  const jsonTransporter = nodemailer.createTransport({ jsonTransport: true });
  const envelopes: Array<{ from: string; to: string[] }> = [];

  const wrappedTransporter: MailTransporterLike = {
    async sendMail(mail) {
      const info = await jsonTransporter.sendMail(mail);
      const parsed = JSON.parse(info.message) as { to: { address: string }[]; from: { address: string } };
      envelopes.push({
        from: parsed.from.address,
        to: parsed.to.map((r) => r.address),
      });
      return { messageId: info.messageId };
    },
  };

  const result = await sendContactEmails(
    {
      name: 'Karan Mehta',
      email: 'karan.mehta@company.io',
      subject: '',
      message: 'Hi Smit, reaching out regarding a React internship position.',
    },
    {
      transporter: wrappedTransporter,
      env: { EMAIL_USER: 'smit.8189@gmail.com', EMAIL_PASS: 'test-pass' },
    },
  );

  assert.equal(result.ok, true);
  assert.equal(envelopes.length, 2);
  assert.deepEqual(envelopes[0].to, ['smit.8189@gmail.com']);
  assert.deepEqual(envelopes[1].to, ['karan.mehta@company.io']);
});

test('Scenario 7a: Missing EMAIL_USER / EMAIL_PASS returns 503 EMAIL_NOT_CONFIGURED and never fakes success', async () => {
  const result = await sendContactEmails(
    {
      name: 'Neha Shah',
      email: 'neha@example.com',
      subject: 'Hello',
      message: 'Checking error handling when SMTP credentials are absent.',
    },
    { env: {} },
  );

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.status, 503);
    assert.equal(result.code, 'EMAIL_NOT_CONFIGURED');
    assert.ok(result.error.includes('smit.8189@gmail.com'));
    assert.ok(!result.error.includes('EMAIL_PASS'));
  }
});

test('Scenario 7b: SMTP authentication failure returns 500 AUTH_ERROR without leaking credentials', async () => {
  const failingTransporter: MailTransporterLike = {
    async sendMail() {
      const err = new Error('Invalid login: 534-5.7.9 Application-specific password required') as Error & {
        code?: string;
        responseCode?: number;
      };
      err.code = 'EAUTH';
      err.responseCode = 534;
      throw err;
    },
  };

  const result = await sendContactEmails(
    {
      name: 'Neha Shah',
      email: 'neha@example.com',
      subject: 'Hello',
      message: 'Checking error handling on bad Gmail App Password.',
    },
    {
      transporter: failingTransporter,
      env: { EMAIL_USER: 'smit.8189@gmail.com', EMAIL_PASS: 'super-secret-password' },
    },
  );

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.status, 500);
    assert.equal(result.code, 'AUTH_ERROR');
    assert.ok(!result.error.includes('super-secret-password'));
    assert.ok(!result.error.includes('EMAIL_PASS'));
    assert.ok(result.error.includes('smit.8189@gmail.com'));
  }
});

test('Scenario 7c: Failure during auto-reply returns 502 AUTOREPLY_FAILED instead of false success', async () => {
  let callCount = 0;
  const partialFailureTransporter: MailTransporterLike = {
    async sendMail() {
      callCount += 1;
      if (callCount === 1) {
        return { messageId: '<owner-ok@test.local>' };
      }
      throw new Error('Temporary SMTP connection drop');
    },
  };

  const result = await sendContactEmails(
    {
      name: 'Neha Shah',
      email: 'neha@example.com',
      subject: 'Hello',
      message: 'Checking partial delivery error reporting.',
    },
    {
      transporter: partialFailureTransporter,
      env: { EMAIL_USER: 'smit.8189@gmail.com', EMAIL_PASS: 'test-pass' },
    },
  );

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.status, 502);
    assert.equal(result.code, 'AUTOREPLY_FAILED');
  }
});
