import nodemailer from 'nodemailer';
import {
  validateContactForm,
  type ContactFormField,
  type ContactFormValues,
  type ContactValidationErrors,
} from '../utils/contactValidation.ts';

export const DEFAULT_OWNER_EMAIL = 'smit.8189@gmail.com';
export const PORTFOLIO_SITE_URL = 'https://smitmorjariya.vercel.app/';

export interface EmailMessagePayload {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

export interface MailTransporterLike {
  sendMail(mailOptions: EmailMessagePayload): Promise<{ messageId?: string }>;
}

export interface ContactMailSuccess {
  ok: true;
  status: 200;
  message: string;
  submittedAt: string;
  ownerMessageId?: string;
  autoReplyMessageId?: string;
}

export interface ContactMailFailure {
  ok: false;
  status: 400 | 500 | 502 | 503;
  code:
    | 'VALIDATION_ERROR'
    | 'EMAIL_NOT_CONFIGURED'
    | 'AUTH_ERROR'
    | 'DELIVERY_FAILED'
    | 'AUTOREPLY_FAILED';
  error: string;
  fieldErrors?: ContactValidationErrors;
}

export type ContactMailResult = ContactMailSuccess | ContactMailFailure;

export interface SendContactEmailsOptions {
  env?: Record<string, string | undefined>;
  transporter?: MailTransporterLike;
  now?: Date;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatMultilineHtml(value: string): string {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, '<br />');
}

export function formatSubmissionTimestamp(date: Date): {
  readable: string;
  iso: string;
} {
  const iso = date.toISOString();
  try {
    const formatted = new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata',
    }).format(date);
    return {
      readable: `${formatted} IST`,
      iso,
    };
  } catch {
    return {
      readable: date.toUTCString(),
      iso,
    };
  }
}

export function buildOwnerNotificationEmail(
  sanitized: ContactFormValues,
  submittedAt: { readable: string; iso: string },
  fromEmail: string,
  ownerEmail: string = DEFAULT_OWNER_EMAIL,
): EmailMessagePayload {
  const effectiveSubject = sanitized.subject || `Portfolio Inquiry from ${sanitized.name}`;
  const safeName = escapeHtml(sanitized.name);
  const safeEmail = escapeHtml(sanitized.email);
  const safeSubject = escapeHtml(effectiveSubject);
  const safeTimestamp = escapeHtml(submittedAt.readable);
  const safeMessageHtml = formatMultilineHtml(sanitized.message);
  const replyMailto = `mailto:${encodeURIComponent(sanitized.email)}?subject=${encodeURIComponent(`Re: ${effectiveSubject}`)}`;

  const text = [
    'New Contact Form Submission — Smit Morjariya Portfolio',
    '======================================================',
    '',
    `Name:            ${sanitized.name}`,
    `Email Address:   ${sanitized.email}`,
    `Subject:         ${effectiveSubject}`,
    `Submitted At:    ${submittedAt.readable} (${submittedAt.iso})`,
    '',
    'Message:',
    '------------------------------------------------------',
    sanitized.message,
    '------------------------------------------------------',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Portfolio Contact Message</title>
  </head>
  <body style="margin:0;padding:24px 16px;background-color:#07080C;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#F4F5F8;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background-color:#0D0F16;border:1px solid #232738;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:24px 28px;background:linear-gradient(135deg,#18142E 0%,#0D1326 100%);border-bottom:1px solid #232738;">
          <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#A78BFA;font-weight:600;">
            Portfolio Contact Notification
          </p>
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#F4F5F8;font-weight:700;">
            New message from ${safeName}
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:20px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1C2030;color:#8E96AB;font-size:13px;width:130px;vertical-align:top;">Sender Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #1C2030;color:#F4F5F8;font-size:14px;font-weight:600;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1C2030;color:#8E96AB;font-size:13px;vertical-align:top;">Email Address</td>
              <td style="padding:10px 0;border-bottom:1px solid #1C2030;font-size:14px;">
                <a href="mailto:${safeEmail}" style="color:#93C5FD;text-decoration:none;">${safeEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1C2030;color:#8E96AB;font-size:13px;vertical-align:top;">Subject</td>
              <td style="padding:10px 0;border-bottom:1px solid #1C2030;color:#F4F5F8;font-size:14px;">${safeSubject}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1C2030;color:#8E96AB;font-size:13px;vertical-align:top;">Submitted At</td>
              <td style="padding:10px 0;border-bottom:1px solid #1C2030;color:#D6DBE7;font-size:13px;">${safeTimestamp}</td>
            </tr>
          </table>

          <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#A78BFA;font-weight:600;">
            Message
          </p>
          <div style="padding:16px 18px;background-color:#07080C;border:1px solid #1E2233;border-radius:12px;color:#E2E6F0;font-size:14px;line-height:1.65;word-break:break-word;">
            ${safeMessageHtml}
          </div>

          <div style="margin-top:24px;">
            <a href="${escapeHtml(replyMailto)}" style="display:inline-block;padding:11px 20px;background-color:#7C5CFF;color:#FFFFFF;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
              Reply to ${safeName}
            </a>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;background-color:#090B10;border-top:1px solid #1C2030;color:#6E768B;font-size:12px;">
          Sent from your portfolio contact form at ${escapeHtml(PORTFOLIO_SITE_URL)}
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    from: `"Smit Morjariya Portfolio" <${fromEmail}>`,
    to: ownerEmail,
    replyTo: sanitized.email,
    subject: `[Portfolio Contact] ${effectiveSubject}`,
    text,
    html,
  };
}

export function buildUserAutoReplyEmail(
  sanitized: ContactFormValues,
  submittedAt: { readable: string; iso: string },
  fromEmail: string,
  ownerEmail: string = DEFAULT_OWNER_EMAIL,
): EmailMessagePayload {
  const effectiveSubject = sanitized.subject || 'Portfolio Inquiry';
  const safeName = escapeHtml(sanitized.name);
  const safeSubject = escapeHtml(effectiveSubject);
  const safeTimestamp = escapeHtml(submittedAt.readable);
  const safeMessageHtml = formatMultilineHtml(sanitized.message);

  const text = [
    `Hi ${sanitized.name},`,
    '',
    'Thank you for reaching out through my portfolio! This is a quick confirmation that your message has been successfully received.',
    '',
    'I will review your inquiry and get back to you as soon as possible (typically within 24–48 hours).',
    '',
    'Summary of your message:',
    `Subject: ${effectiveSubject}`,
    `Submitted At: ${submittedAt.readable}`,
    '',
    sanitized.message,
    '',
    'Best regards,',
    'Smit Morjariya',
    'Front-End Developer',
    `Email: ${ownerEmail}`,
    `Portfolio: ${PORTFOLIO_SITE_URL}`,
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thank You for Contacting Me</title>
  </head>
  <body style="margin:0;padding:24px 16px;background-color:#07080C;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#F4F5F8;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background-color:#0D0F16;border:1px solid #232738;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:26px 28px;background:linear-gradient(135deg,#18142E 0%,#0D1326 100%);border-bottom:1px solid #232738;">
          <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#A78BFA;font-weight:600;">
            Message Received
          </p>
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#F4F5F8;font-weight:700;">
            Thank you for reaching out, ${safeName}!
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:26px 28px;">
          <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#D6DBE7;">
            Hi ${safeName},
          </p>
          <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#A1A8BA;">
            Thank you for contacting me through my portfolio. I&apos;ve received your message and appreciate you taking the time to connect.
          </p>
          <p style="margin:0 0 22px 0;font-size:15px;line-height:1.65;color:#A1A8BA;">
            I&apos;ll review your note carefully and get back to you as soon as possible, typically within 24&ndash;48 hours.
          </p>

          <div style="padding:16px 18px;background-color:#07080C;border:1px solid #1E2233;border-radius:12px;margin-bottom:24px;">
            <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#A78BFA;font-weight:600;">
              Copy of Your Submission
            </p>
            <p style="margin:0 0 6px 0;font-size:13px;color:#8E96AB;">
              <strong style="color:#D6DBE7;">Subject:</strong> ${safeSubject}
            </p>
            <p style="margin:0 0 12px 0;font-size:13px;color:#8E96AB;">
              <strong style="color:#D6DBE7;">Submitted:</strong> ${safeTimestamp}
            </p>
            <div style="padding-top:12px;border-top:1px solid #1C2030;font-size:14px;line-height:1.6;color:#D6DBE7;word-break:break-word;">
              ${safeMessageHtml}
            </div>
          </div>

          <p style="margin:0 0 4px 0;font-size:14px;color:#F4F5F8;font-weight:600;">
            Best regards,
          </p>
          <p style="margin:0 0 2px 0;font-size:14px;color:#D6DBE7;">
            Smit Morjariya
          </p>
          <p style="margin:0 0 18px 0;font-size:13px;color:#8E96AB;">
            Front-End Developer &middot; React.js &amp; Modern Web Interfaces
          </p>

          <div>
            <a href="${escapeHtml(PORTFOLIO_SITE_URL)}" style="display:inline-block;padding:10px 18px;background-color:#7C5CFF;color:#FFFFFF;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;">
              Visit Portfolio
            </a>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;background-color:#090B10;border-top:1px solid #1C2030;color:#6E768B;font-size:12px;line-height:1.5;">
          This is an automated confirmation email. You can reply directly to <a href="mailto:${escapeHtml(ownerEmail)}" style="color:#93C5FD;text-decoration:none;">${escapeHtml(ownerEmail)}</a> if you need to add more details.
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    from: `"Smit Morjariya" <${fromEmail}>`,
    to: sanitized.email,
    replyTo: ownerEmail,
    subject: 'Thank You for Contacting Me — Smit Morjariya',
    text,
    html,
  };
}

export function createEmailTransporter(
  env: Record<string, string | undefined>,
): MailTransporterLike {
  const emailUser = env.EMAIL_USER?.trim() ?? '';
  const emailPass = env.EMAIL_PASS?.trim() ?? '';
  const smtpHost = env.SMTP_HOST?.trim();

  if (smtpHost) {
    const smtpPort = Number(env.SMTP_PORT) || 587;
    const smtpSecure =
      env.SMTP_SECURE !== undefined
        ? env.SMTP_SECURE === 'true'
        : smtpPort === 465;

    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

function classifyTransportError(error: unknown): {
  status: 500 | 502;
  code: 'AUTH_ERROR' | 'DELIVERY_FAILED';
  message: string;
} {
  const err = error as { code?: string; responseCode?: number; message?: string } | undefined;
  const rawMessage = err?.message ?? '';

  if (
    err?.code === 'EAUTH' ||
    err?.responseCode === 534 ||
    err?.responseCode === 535 ||
    rawMessage.includes('Application-specific password required') ||
    rawMessage.includes('Invalid login')
  ) {
    return {
      status: 500,
      code: 'AUTH_ERROR',
      message:
        'The contact email service could not authenticate with the mail server. Please try again later or email smit.8189@gmail.com directly.',
    };
  }

  return {
    status: 502,
    code: 'DELIVERY_FAILED',
    message:
      'We could not deliver your email right now due to a mail server issue. Please try again in a moment or email smit.8189@gmail.com directly.',
  };
}

export async function sendContactEmails(
  rawInput: Partial<Record<ContactFormField, unknown>> | null | undefined,
  options: SendContactEmailsOptions = {},
): Promise<ContactMailResult> {
  const validation = validateContactForm(rawInput ?? {});
  if (!validation.isValid) {
    return {
      ok: false,
      status: 400,
      code: 'VALIDATION_ERROR',
      error: 'Please correct the highlighted fields before submitting.',
      fieldErrors: validation.errors,
    };
  }

  const env = options.env ?? process.env;
  const emailUser = env.EMAIL_USER?.trim() ?? '';
  const emailPass = env.EMAIL_PASS?.trim() ?? '';
  const ownerEmail = (env.CONTACT_RECIPIENT_EMAIL?.trim() || DEFAULT_OWNER_EMAIL).trim();

  if (!options.transporter && (!emailUser || !emailPass)) {
    return {
      ok: false,
      status: 503,
      code: 'EMAIL_NOT_CONFIGURED',
      error:
        'The automated contact email service is temporarily unavailable. Please reach out directly at smit.8189@gmail.com or copy your message below.',
    };
  }

  const fromEmail = emailUser || ownerEmail;
  const submittedAt = formatSubmissionTimestamp(options.now ?? new Date());
  const transporter = options.transporter ?? createEmailTransporter(env);

  const ownerMail = buildOwnerNotificationEmail(
    validation.sanitized,
    submittedAt,
    fromEmail,
    ownerEmail,
  );
  const autoReplyMail = buildUserAutoReplyEmail(
    validation.sanitized,
    submittedAt,
    fromEmail,
    ownerEmail,
  );

  let ownerMessageId: string | undefined;
  try {
    const ownerInfo = await transporter.sendMail(ownerMail);
    ownerMessageId = ownerInfo?.messageId;
  } catch (error) {
    const mapped = classifyTransportError(error);
    return {
      ok: false,
      status: mapped.status,
      code: mapped.code,
      error: mapped.message,
    };
  }

  let autoReplyMessageId: string | undefined;
  try {
    const autoReplyInfo = await transporter.sendMail(autoReplyMail);
    autoReplyMessageId = autoReplyInfo?.messageId;
  } catch (error) {
    const mapped = classifyTransportError(error);
    return {
      ok: false,
      status: mapped.status === 500 ? 500 : 502,
      code: mapped.code === 'AUTH_ERROR' ? 'AUTH_ERROR' : 'AUTOREPLY_FAILED',
      error:
        'Your message reached Smit, but we could not send the automatic confirmation email to your address. Please double-check your email address or try again.',
    };
  }

  return {
    ok: true,
    status: 200,
    message:
      'Your message has been delivered to Smit Morjariya and a confirmation email has been sent to your inbox.',
    submittedAt: submittedAt.iso,
    ownerMessageId,
    autoReplyMessageId,
  };
}
