import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import {
  buildMailtoUrl,
  formatPlaintextInquiry,
  validateContactField,
  validateContactForm,
  type ContactFormField,
  type ContactFormValues,
  type ContactValidationErrors,
} from '../utils/contactValidation';

const INITIAL_VALUES: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

interface ContactApiResponse {
  ok?: boolean;
  message?: string;
  error?: string;
  code?: string;
  fieldErrors?: ContactValidationErrors;
}

interface DeliveredReceipt {
  senderName: string;
  senderEmail: string;
  message: string;
}

export function ContactSection() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactFormField, boolean>>>({});
  const [showErrorSummary, setShowErrorSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deliveredReceipt, setDeliveredReceipt] = useState<DeliveredReceipt | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedFallbackMessage, setCopiedFallbackMessage] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleCopyFallbackMessage = async () => {
    try {
      const plaintext = formatPlaintextInquiry(values);
      await navigator.clipboard.writeText(plaintext);
      setCopiedFallbackMessage(true);
      window.setTimeout(() => setCopiedFallbackMessage(false), 2200);
    } catch {
      setCopiedFallbackMessage(false);
    }
  };

  const updateFieldValidation = (field: ContactFormField, nextValue: string) => {
    const fieldError = validateContactField(field, nextValue);
    setErrors((prev) => {
      const updated: ContactValidationErrors = { ...prev };
      if (fieldError) {
        updated[field] = fieldError;
      } else {
        delete updated[field];
      }
      if (Object.keys(updated).length === 0) {
        setShowErrorSummary(false);
      }
      return updated;
    });
  };

  const handleFieldChange = (field: ContactFormField, nextValue: string) => {
    setValues((prev) => ({ ...prev, [field]: nextValue }));
    if (submitError) {
      setSubmitError(null);
    }
    if (deliveredReceipt) {
      setDeliveredReceipt(null);
    }

    // Match PixelCraft's responsive real-time validation while keeping initial untouched state clean
    if (touched[field] || errors[field] || showErrorSummary || (field === 'email' && nextValue.trim().length > 0)) {
      updateFieldValidation(field, nextValue);
    }
  };

  const handleFieldBlur = (field: ContactFormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    updateFieldValidation(field, values[field]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    setSubmitError(null);
    setDeliveredReceipt(null);

    const validation = validateContactForm(values);
    if (!validation.isValid) {
      setTouched({ name: true, email: true, subject: true, message: true });
      setErrors(validation.errors);
      setShowErrorSummary(true);
      return;
    }

    setErrors({});
    setShowErrorSummary(false);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validation.sanitized),
      });

      let data: ContactApiResponse = {};
      try {
        data = (await response.json()) as ContactApiResponse;
      } catch {
        data = {};
      }

      if (!response.ok || !data.ok) {
        if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
          setTouched({ name: true, email: true, subject: true, message: true });
          setErrors(data.fieldErrors);
          setShowErrorSummary(true);
        }
        setSubmitError(
          data.error ||
            'Unable to send your message right now. Please try again or email smit.8189@gmail.com directly.',
        );
        return;
      }

      setDeliveredReceipt({
        senderName: validation.sanitized.name,
        senderEmail: validation.sanitized.email,
        message:
          data.message ||
          `Your message was delivered to ${PERSONAL_INFO.email} and a confirmation email was sent to ${validation.sanitized.email}.`,
      });
      setValues(INITIAL_VALUES);
      setTouched({});
      setErrors({});
      setShowErrorSummary(false);
    } catch {
      setSubmitError(
        `Network error while connecting to the mail server. Your message was not sent — please check your connection or email ${PERSONAL_INFO.email} directly.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeErrorList = Object.entries(errors).filter(
    (entry): entry is [ContactFormField, string] => Boolean(entry[1]),
  );

  const fallbackMailtoUrl = buildMailtoUrl(PERSONAL_INFO.email, values);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      data-contact-section
      className="scroll-mt-16 overflow-x-clip py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5">
            <div data-contact-intro>
              <p className="font-mono text-xs text-[#A78BFA] tabular-nums">07. Contact</p>
              <h2
                id="contact-heading"
                className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#F4F5F8] sm:text-3xl lg:text-4xl"
              >
                Let&apos;s discuss a role or project.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#A1A8BA] sm:text-base">
                I am actively looking for Frontend Developer, React.js Intern, and Junior Web Developer opportunities. Feel free to reach out directly by email, LinkedIn, or the message form.
              </p>
            </div>

            <div className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {/* Email */}
              <div data-contact-detail className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="text-xs text-[#6E768B]">Email</p>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="group/link social-pill-link inline-link-underline mt-0.5 inline-flex max-w-full items-center gap-2 text-sm font-medium text-[#F4F5F8] hover:text-[#C4B5FD]"
                  >
                    <Mail className="icon-motion icon-scale-subtle h-4 w-4 text-[#A78BFA] shrink-0" aria-hidden="true" />
                    <span className="truncate">{PERSONAL_INFO.email}</span>
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className="group/btn btn-secondary inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#D6DBE7] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#34D399]" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="icon-motion icon-scale-subtle h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* LinkedIn */}
              <div data-contact-detail className="py-4">
                <p className="text-xs text-[#6E768B]">LinkedIn</p>
                <a
                  href={PERSONAL_INFO.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link social-pill-link inline-link-underline mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#F4F5F8] hover:text-[#93C5FD]"
                >
                  <Linkedin className="icon-motion icon-scale-subtle h-4 w-4 text-[#60A5FA]" aria-hidden="true" />
                  <span>linkedin.com/in/smitmorjariya</span>
                  <ArrowUpRight className="icon-motion icon-shift-tr h-3.5 w-3.5 text-[#6E768B] group-hover/link:text-[#93C5FD]" aria-hidden="true" />
                </a>
              </div>

              {/* GitHub */}
              <div data-contact-detail className="py-4">
                <p className="text-xs text-[#6E768B]">GitHub</p>
                <a
                  href={PERSONAL_INFO.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link social-pill-link inline-link-underline mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#F4F5F8] hover:text-[#C4B5FD]"
                >
                  <Github className="icon-motion icon-scale-subtle h-4 w-4 text-[#A1A8BA] group-hover/link:text-[#C4B5FD]" aria-hidden="true" />
                  <span>github.com/smitmorjariya</span>
                  <ArrowUpRight className="icon-motion icon-shift-tr h-3.5 w-3.5 text-[#6E768B] group-hover/link:text-[#C4B5FD]" aria-hidden="true" />
                </a>
              </div>

              {/* Location */}
              <div data-contact-detail className="py-4">
                <p className="text-xs text-[#6E768B]">Location</p>
                <p className="mt-1 inline-flex items-center gap-2 text-sm text-[#D6DBE7]">
                  <MapPin className="h-4 w-4 text-[#6E768B]" aria-hidden="true" />
                  <span>{PERSONAL_INFO.location}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Contact Form */}
          <div data-contact-form className="lg:col-span-7">
            <div className="rounded-2xl border border-white/[0.09] bg-[#0D0F16] p-6 transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#7C5CFF]/25 hover:shadow-[0_18px_40px_-24px_rgba(124,92,255,0.22)] sm:p-8">
              <h3 className="font-display text-xl font-semibold text-[#F4F5F8]">
                Send a message
              </h3>
              <p className="mt-1.5 text-sm text-[#A1A8BA]">
                Sends directly to {PERSONAL_INFO.email} with an automatic confirmation email to your inbox.
              </p>

              {/* Validation Error Summary Banner (matching PixelCraft UX) */}
              {showErrorSummary && activeErrorList.length > 0 && (
                <div
                  role="alert"
                  data-testid="contact-error-summary"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-rose-500/35 bg-rose-500/[0.08] p-4 text-sm text-rose-100"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-medium text-rose-200">
                      Please fix the following before sending:
                    </p>
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-rose-200/90">
                      {activeErrorList.map(([field, message]) => (
                        <li key={field}>{message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Server / Delivery Error Banner */}
              {submitError && (
                <div
                  role="alert"
                  data-testid="contact-submit-error"
                  className="mt-6 rounded-xl border border-rose-500/35 bg-rose-500/[0.08] p-4 text-sm text-rose-100"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="font-medium text-rose-200">Email could not be delivered</p>
                      <p className="mt-1 text-xs leading-relaxed text-rose-100/85">
                        {submitError}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2.5">
                        <a
                          href={fallbackMailtoUrl}
                          className="btn-secondary inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white"
                        >
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Email Directly</span>
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyFallbackMessage}
                          className="btn-secondary inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white cursor-pointer"
                        >
                          {copiedFallbackMessage ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-[#34D399]" aria-hidden="true" />
                              <span>Message Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Copy Message</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmed Delivery Success Banner */}
              {deliveredReceipt && (
                <div
                  role="status"
                  data-testid="contact-success-banner"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] p-4 text-sm text-emerald-100"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-medium text-white">
                      Message sent, {deliveredReceipt.senderName}!
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-emerald-100/85">
                      {deliveredReceipt.message}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/85">
                      If you don&apos;t see the confirmation email in your inbox, please check your Spam or Junk folder as well.
                    </p>
                    <p className="mt-1.5 text-xs text-emerald-200/75">
                      Confirmation sent to <span className="font-medium text-emerald-100">{deliveredReceipt.senderEmail}</span>.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium text-[#D6DBE7]"
                    >
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      disabled={isSubmitting}
                      placeholder="Recruiter or team member"
                      value={values.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      onBlur={() => handleFieldBlur('name')}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={`mt-2 block w-full rounded-lg border bg-[#07080C] px-3.5 py-2.5 text-sm text-white placeholder-[#6E768B] transition-[border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/[0.2] focus:border-[#7C5CFF] focus:shadow-[0_0_0_3px_rgba(124,92,255,0.16)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                        errors.name ? 'border-rose-500/70' : 'border-white/[0.1]'
                      }`}
                    />
                    {errors.name && (
                      <p id="contact-name-error" className="mt-1.5 text-xs text-rose-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-medium text-[#D6DBE7]"
                    >
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={isSubmitting}
                      placeholder="you@company.com"
                      value={values.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleFieldBlur('email')}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className={`mt-2 block w-full rounded-lg border bg-[#07080C] px-3.5 py-2.5 text-sm text-white placeholder-[#6E768B] transition-[border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/[0.2] focus:border-[#7C5CFF] focus:shadow-[0_0_0_3px_rgba(124,92,255,0.16)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                        errors.email ? 'border-rose-500/70' : 'border-white/[0.1]'
                      }`}
                    />
                    {errors.email && (
                      <p id="contact-email-error" className="mt-1.5 text-xs text-rose-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-medium text-[#D6DBE7]"
                  >
                    Subject <span className="text-[#6E768B]">(Optional)</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    disabled={isSubmitting}
                    placeholder="Frontend Developer / React.js Intern Opportunity"
                    value={values.subject}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                    onBlur={() => handleFieldBlur('subject')}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                    className={`mt-2 block w-full rounded-lg border bg-[#07080C] px-3.5 py-2.5 text-sm text-white placeholder-[#6E768B] transition-[border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/[0.2] focus:border-[#7C5CFF] focus:shadow-[0_0_0_3px_rgba(124,92,255,0.16)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.subject ? 'border-rose-500/70' : 'border-white/[0.1]'
                    }`}
                  />
                  {errors.subject && (
                    <p id="contact-subject-error" className="mt-1.5 text-xs text-rose-400">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-[#D6DBE7]"
                  >
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    disabled={isSubmitting}
                    placeholder="Share details about the role, team, or project..."
                    value={values.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    onBlur={() => handleFieldBlur('message')}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className={`mt-2 block w-full resize-y rounded-lg border bg-[#07080C] px-3.5 py-2.5 text-sm text-white placeholder-[#6E768B] transition-[border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/[0.2] focus:border-[#7C5CFF] focus:shadow-[0_0_0_3px_rgba(124,92,255,0.16)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.message ? 'border-rose-500/70' : 'border-white/[0.1]'
                    }`}
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="mt-1.5 text-xs text-rose-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group/btn btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#7C5CFF] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="icon-motion icon-shift-right h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  <span className="text-xs text-[#6E768B]">
                    Direct response via {PERSONAL_INFO.email}
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
