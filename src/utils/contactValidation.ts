export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactFormField = keyof ContactFormValues;

export interface ContactValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ContactValidationErrors;
  sanitized: ContactFormValues;
}

// Strict RFC-style email pattern aligned with PixelCraft's contact form validation
const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const CONTROL_CHAR_PATTERN = /[\r\n\u0000-\u001F\u007F]/;

export function isValidEmail(rawEmail: string): boolean {
  const email = rawEmail.trim();
  if (!email || email.length > 254 || CONTROL_CHAR_PATTERN.test(email)) {
    return false;
  }

  const atIndex = email.lastIndexOf('@');
  if (atIndex <= 0 || atIndex === email.length - 1) {
    return false;
  }

  const localPart = email.slice(0, atIndex);
  const domainPart = email.slice(atIndex + 1);

  if (localPart.length > 64 || domainPart.length > 253) {
    return false;
  }

  if (domainPart.includes('..') || domainPart.startsWith('.') || domainPart.endsWith('.')) {
    return false;
  }

  const domainLabels = domainPart.split('.');
  if (
    domainLabels.some(
      (label) =>
        label.length === 0 ||
        label.length > 63 ||
        label.startsWith('-') ||
        label.endsWith('-'),
    )
  ) {
    return false;
  }

  return EMAIL_PATTERN.test(email);
}

export function validateContactField(
  field: ContactFormField,
  rawValue: string,
): string | undefined {
  const trimmed = rawValue.trim();

  switch (field) {
    case 'name': {
      if (!trimmed) {
        return 'Please enter your name.';
      }
      if (CONTROL_CHAR_PATTERN.test(trimmed)) {
        return 'Name cannot contain line breaks or control characters.';
      }
      if (trimmed.length < 2) {
        return 'Name should be at least 2 characters.';
      }
      if (trimmed.length > 100) {
        return 'Name should be 100 characters or fewer.';
      }
      return undefined;
    }

    case 'email': {
      if (!trimmed) {
        return 'Please enter your email address.';
      }
      if (!isValidEmail(trimmed)) {
        return 'Please enter a valid email address (e.g., name@example.com).';
      }
      return undefined;
    }

    case 'subject': {
      if (!trimmed) {
        return undefined;
      }
      if (CONTROL_CHAR_PATTERN.test(trimmed)) {
        return 'Subject cannot contain line breaks or control characters.';
      }
      if (trimmed.length > 150) {
        return 'Subject should be 150 characters or fewer.';
      }
      return undefined;
    }

    case 'message': {
      if (!trimmed) {
        return 'Please enter a message.';
      }
      return undefined;
    }
  }
}

function toSafeString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function validateContactForm(
  values: Partial<Record<ContactFormField, unknown>>,
): ValidationResult {
  const sanitized: ContactFormValues = {
    name: toSafeString(values.name).trim(),
    email: toSafeString(values.email).trim(),
    subject: toSafeString(values.subject).trim(),
    message: toSafeString(values.message).trim(),
  };

  const errors: ContactValidationErrors = {};

  const fields: ContactFormField[] = ['name', 'email', 'subject', 'message'];
  for (const field of fields) {
    const fieldError = validateContactField(field, sanitized[field]);
    if (fieldError) {
      errors[field] = fieldError;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

export function buildMailtoUrl(recipientEmail: string, values: ContactFormValues): string {
  const clean = {
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject.trim() || `Portfolio Inquiry from ${values.name.trim()}`,
    message: values.message.trim(),
  };

  const bodyLines = [
    `Name: ${clean.name}`,
    `Email: ${clean.email}`,
    '',
    'Message:',
    clean.message,
  ].join('\n');

  const params = new URLSearchParams({
    subject: clean.subject,
    body: bodyLines,
  });

  // Replace + with %20 so all mail clients render spaces cleanly
  const encodedQuery = params.toString().replace(/\+/g, '%20');
  return `mailto:${recipientEmail}?${encodedQuery}`;
}

export function formatPlaintextInquiry(values: ContactFormValues): string {
  const subject = values.subject.trim() || `Portfolio Inquiry from ${values.name.trim()}`;
  return [
    `Subject: ${subject}`,
    `From: ${values.name.trim()} <${values.email.trim()}>`,
    '',
    values.message.trim(),
  ].join('\n');
}
