import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../lib/motion.js';

/* Google Apps Script web app that logs enquiries into Google Sheets.
   The request is opaque under no-cors, so a resolved fetch is treated
   as delivered and a rejected one as a genuine failure. */
const ENDPOINT =
  'https://script.google.com/macros/s/AKfycbx4SdMZrXXj8AFwI-POmBUikaPKY_ZQpZJCjoeb77cDtponCTpgTIg4Klj30Nh3VSU2/exec';

const MAX_MESSAGE = 600;

const PROJECT_TYPES = [
  { value: 'brand-strategy-identity', label: 'Brand Strategy & Identity' },
  { value: 'product-design-mvp', label: 'Product Design & MVP Engineering' },
  { value: 'web-platforms-uiux', label: 'Web Platforms & UI/UX' },
  { value: 'digital-marketing-growth', label: 'Digital Marketing & Growth Strategy' },
  { value: 'full-spectrum-build', label: 'Full-Spectrum Build (All Capabilities)' },
];

const EMPTY = { name: '', email: '', projectType: '', message: '', company: '' };

const RULES = {
  name: (v) => {
    if (!v.trim()) return 'Please enter your name.';
    if (v.trim().length < 2) return 'That name looks too short.';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Please enter a valid email address.';
    return '';
  },
  projectType: (v) => (v ? '' : 'Please choose a project type.'),
  message: (v) => {
    if (!v.trim()) return 'Please tell us about the project.';
    if (v.trim().length < 10) return 'A little more detail would help.';
    return '';
  },
};

const FIELD_ORDER = ['name', 'email', 'projectType', 'message'];

export default function ContactForm({ id, slideLabel }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState({ text: '', state: null });
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState(null);

  const refs = useRef({});
  const reduce = useReducedMotion();

  const set = (key) => (e) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [key]: value }));
    if (validated) {
      setErrors((prev) => ({ ...prev, [key]: RULES[key] ? RULES[key](value) : '' }));
    }
  };

  const blur = (key) => () => {
    if (!validated) return;
    setErrors((prev) => ({ ...prev, [key]: RULES[key] ? RULES[key](values[key]) : '' }));
  };

  const resetAll = () => {
    setValues(EMPTY);
    setErrors({});
    setValidated(false);
    setStatus({ text: '', state: null });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setValidated(true);

    const found = {};
    FIELD_ORDER.forEach((key) => {
      const message = RULES[key](values[key]);
      if (message) found[key] = message;
    });
    setErrors(found);

    const invalid = FIELD_ORDER.filter((key) => found[key]);
    if (invalid.length) {
      setStatus({
        text: invalid.length === 1 ? 'One field needs attention.' : `${invalid.length} fields need attention.`,
        state: 'error',
      });
      refs.current[invalid[0]]?.focus();
      return;
    }

    /* A filled spam trap is dropped silently. */
    if (values.company) {
      const first = values.name.trim().split(' ')[0];
      resetAll();
      setSentTo(first);
      return;
    }

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      projectType: values.projectType,
      message: values.message.trim(),
    };

    setSending(true);
    setStatus({ text: 'Sending', state: 'sending' });

    const controller = 'AbortController' in window ? new AbortController() : null;
    const timeout = window.setTimeout(() => controller?.abort(), 15000);

    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        ...(controller ? { signal: controller.signal } : {}),
      });
      window.clearTimeout(timeout);
      const first = payload.name.split(' ')[0];
      resetAll();
      setSentTo(first);
    } catch {
      window.clearTimeout(timeout);
      setStatus({
        text: 'That did not send. Please email info@youngtimbers.co.za instead.',
        state: 'error',
      });
    } finally {
      setSending(false);
    }
  };

  const errorFor = (key) => errors[key] || '';

  const fieldProps = (key) => ({
    id: `field-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    onBlur: blur(key),
    ref: (el) => { refs.current[key] = el; },
    'aria-describedby': `error-${key}`,
    ...(errorFor(key) ? { 'aria-invalid': 'true' } : {}),
  });

  return (
    <form
      className="form contact__slide"
      id={id}
      data-slide-label={slideLabel}
      method="post"
      action={ENDPOINT}
      onSubmit={onSubmit}
      noValidate
    >
      <div className="form__intro">
        <p className="eyebrow">Send a message</p>
        <h2 className="contact__title">Start a conversation</h2>
        <p className="contact__copy">Fill in your details below and we will get back to you.</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {sentTo ? (
          <motion.div
            key="sent"
            className="form__success"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0.01 : 0.42, ease: EASE }}
            role="status"
            aria-live="polite"
          >
            <svg className="form__success-mark" viewBox="0 0 26 26" aria-hidden="true">
              <motion.path
                d="M2 13.6 L9.4 21 L24 5"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduce ? 0.01 : 0.55, delay: 0.12, ease: EASE }}
              />
            </svg>
            <p className="form__success-title">
              Thank you{sentTo ? `, ${sentTo}` : ''}. Your message is with us.
            </p>
            <p className="form__success-copy">
              We read every enquiry and reply within two working days. If it is urgent, call
              +27 63 946 4108.
            </p>
            <button className="form__success-again" type="button" onClick={() => setSentTo(null)}>
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="fields"
            className="form__body"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: reduce ? 0.01 : 0.32, ease: EASE }}
          >
            <div className="field">
              <label className="field__label" htmlFor="field-name">Name</label>
              <input
                className="field__input"
                type="text"
                autoComplete="name"
                autoCapitalize="words"
                {...fieldProps('name')}
              />
              <p className="field__error" id="error-name" hidden={!errorFor('name')}>
                {errorFor('name')}
              </p>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="field-email">Email</label>
              <input
                className="field__input"
                type="email"
                autoComplete="email"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
                inputMode="email"
                {...fieldProps('email')}
              />
              <p className="field__error" id="error-email" hidden={!errorFor('email')}>
                {errorFor('email')}
              </p>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="field-projectType">Project type</label>
              <div className="field__select">
                <select className="field__input" {...fieldProps('projectType')}>
                  <option value="">Select one</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <span className="field__caret" aria-hidden="true" />
              </div>
              <p className="field__error" id="error-projectType" hidden={!errorFor('projectType')}>
                {errorFor('projectType')}
              </p>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="field-message">
                Message
                <span className="field__count" aria-hidden="true">
                  {values.message.length} / {MAX_MESSAGE}
                </span>
              </label>
              <textarea
                className="field__input field__input--area"
                rows="4"
                maxLength={MAX_MESSAGE}
                {...fieldProps('message')}
              />
              <p className="field__error" id="error-message" hidden={!errorFor('message')}>
                {errorFor('message')}
              </p>
            </div>

            {/* Spam trap: left empty by people, filled in by bots. */}
            <div className="field field--trap" aria-hidden="true">
              <label htmlFor="field-company">Company</label>
              <input
                id="field-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.company}
                onChange={set('company')}
              />
            </div>

            <div className="form__foot">
              <button className="btn btn--solid" type="submit" disabled={sending}>
                <span>{sending ? 'Sending' : 'Send Message'}</span>
              </button>
              <p
                className={`form__status${status.state === 'sending' ? ' form__dots' : ''}`}
                role="status"
                aria-live="polite"
                {...(status.state === 'error' ? { 'data-state': 'error' } : {})}
              >
                {status.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
