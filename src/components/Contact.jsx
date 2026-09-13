import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT, sectionReveal, still } from '../lib/motion.js';
import ContactForm from './ContactForm.jsx';

const EMAIL = 'info@youngtimbers.co.za';

/* ---------------------------------------------------------
   Copy to clipboard
   --------------------------------------------------------- */
function CopyButton({ value }) {
  const [label, setLabel] = useState('Copy');
  const timer = useRef(null);

  const legacyCopy = (text) => {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:absolute;left:-9999px;top:0';
    document.body.appendChild(field);
    field.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    document.body.removeChild(field);
    return ok;
  };

  const flash = (ok) => {
    setLabel(ok ? 'Copied' : 'Copy failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLabel('Copy'), 2000);
  };

  const onClick = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(() => flash(true), () => flash(legacyCopy(value)));
    } else {
      flash(legacyCopy(value));
    }
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      className="copy"
      type="button"
      onClick={onClick}
      aria-label={label === 'Copied' ? 'Email address copied' : label === 'Copy failed' ? 'Failed to copy email address' : 'Copy email address'}
      {...(label !== 'Copy' ? { 'data-copied': '' } : {})}
    >
      <motion.span
        className="copy__label"
        key={label}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        {label}
      </motion.span>
    </button>
  );
}

/* ---------------------------------------------------------
   Small-screen carousel

   Above 600px the two panels are an ordinary two-column grid.
   Below it they become a swipeable track, so the carousel
   roles, the dots and the measured height are attached and
   detached with the breakpoint rather than left on the markup.
   --------------------------------------------------------- */
function useContactCarousel(trackRef, dotsRef) {
  const [active, setActive] = useState(0);
  const [on, setOn] = useState(false);
  const state = useRef({ heights: [], frame: null, lastHeight: -1, observer: null });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const slides = Array.from(track.querySelectorAll('.contact__slide'));
    if (slides.length < 2) return undefined;

    const mq = window.matchMedia('(max-width: 600px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const s = state.current;
    let enabled = false;

    const measure = () => { s.heights = slides.map((slide) => slide.offsetHeight); };

    /* The panels are different heights, so the track height is
       interpolated across the swipe. Without this the taller
       panel is clipped mid-gesture. */
    const applyHeight = () => {
      if (!enabled) return;
      const width = track.clientWidth;
      if (!width || !s.heights.length) return;
      const position = track.scrollLeft / width;
      const from = Math.max(0, Math.min(slides.length - 1, Math.floor(position)));
      const to = Math.max(0, Math.min(slides.length - 1, from + 1));
      const ratio = Math.max(0, Math.min(1, position - from));
      const height = Math.round(s.heights[from] + (s.heights[to] - s.heights[from]) * ratio);
      if (height > 0 && height !== s.lastHeight) {
        s.lastHeight = height;
        track.style.height = `${height}px`;
      }
    };

    const onScroll = () => {
      if (!enabled) return;
      if (s.frame) window.cancelAnimationFrame(s.frame);
      s.frame = window.requestAnimationFrame(() => {
        s.frame = null;
        applyHeight();
        const width = track.clientWidth;
        if (!width) return;
        setActive(Math.round(track.scrollLeft / width));
      });
    };

    const enable = () => {
      enabled = true;
      setOn(true);
      track.classList.add('is-carousel');
      dotsRef.current?.classList.add('is-carousel');
      track.setAttribute('role', 'group');
      track.setAttribute('aria-roledescription', 'carousel');
      track.setAttribute('aria-label', 'Ways to get in touch');
      track.setAttribute('tabindex', '0');
      slides.forEach((slide, i) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute(
          'aria-label',
          `${i + 1} of ${slides.length}: ${slide.getAttribute('data-slide-label') || `Slide ${i + 1}`}`
        );
      });
      measure();
      setActive(Math.round(track.scrollLeft / (track.clientWidth || 1)));
      applyHeight();
      if ('ResizeObserver' in window && !s.observer) {
        s.observer = new ResizeObserver(() => { measure(); applyHeight(); });
        slides.forEach((slide) => s.observer.observe(slide));
      }
    };

    const disable = () => {
      enabled = false;
      setOn(false);
      track.classList.remove('is-carousel');
      dotsRef.current?.classList.remove('is-carousel');
      track.style.height = '';
      track.scrollLeft = 0;
      s.lastHeight = -1;
      ['role', 'aria-roledescription', 'aria-label', 'tabindex'].forEach((a) => track.removeAttribute(a));
      slides.forEach((slide) => {
        ['role', 'aria-roledescription', 'aria-label'].forEach((a) => slide.removeAttribute(a));
      });
      if (s.observer) { s.observer.disconnect(); s.observer = null; }
    };

    const sync = () => {
      if (mq.matches && !enabled) enable();
      else if (!mq.matches && enabled) disable();
      else if (enabled) { measure(); applyHeight(); }
    };

    let syncFrame = null;
    const queueSync = () => {
      if (syncFrame) return;
      syncFrame = window.requestAnimationFrame(() => { syncFrame = null; sync(); });
    };

    const onOrientation = () => window.setTimeout(queueSync, 200);

    track.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener('change', queueSync);
    window.addEventListener('resize', queueSync);
    window.addEventListener('orientationchange', onOrientation);
    sync();

    /* "Start a Project" opens the message panel rather than the
       details panel; the plain "Contact" nav link does not. */
    const jumpLinks = Array.from(document.querySelectorAll('[data-contact-target="form"]'));
    const onJump = () => {
      if (!enabled) return;
      window.setTimeout(() => {
        const target = slides[slides.length - 1];
        track.scrollTo({
          left: target.offsetLeft - slides[0].offsetLeft,
          behavior: reduce.matches ? 'auto' : 'smooth',
        });
      }, 250);
    };
    jumpLinks.forEach((link) => link.addEventListener('click', onJump));

    return () => {
      track.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', queueSync);
      window.removeEventListener('resize', queueSync);
      window.removeEventListener('orientationchange', onOrientation);
      jumpLinks.forEach((link) => link.removeEventListener('click', onJump));
      if (s.frame) window.cancelAnimationFrame(s.frame);
      if (syncFrame) window.cancelAnimationFrame(syncFrame);
      disable();
    };
  }, [trackRef, dotsRef]);

  const goTo = (index) => {
    const track = trackRef.current;
    if (!track || !on) return;
    const slides = Array.from(track.querySelectorAll('.contact__slide'));
    const target = slides[Math.max(0, Math.min(slides.length - 1, index))];
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({
      left: target.offsetLeft - slides[0].offsetLeft,
      behavior: reduce ? 'auto' : 'smooth',
    });
    setActive(index);
  };

  return { active, on, goTo };
}

export default function Contact() {
  const trackRef = useRef(null);
  const dotsRef = useRef(null);
  const { active, on, goTo } = useContactCarousel(trackRef, dotsRef);
  const reduce = useReducedMotion();
  const reveal = reduce ? still(sectionReveal) : sectionReveal;

  const onDotsKeyDown = (e) => {
    const dots = Array.from(dotsRef.current?.querySelectorAll('.contact__dot') || []);
    const index = dots.indexOf(document.activeElement);
    if (index < 0) return;
    let next = null;
    if (e.key === 'ArrowRight') next = (index + 1) % dots.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + dots.length) % dots.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = dots.length - 1;
    if (next === null) return;
    e.preventDefault();
    dots[next].focus();
    goTo(next);
  };

  return (
    <motion.section
      className="contact"
      id="contact"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <div className="container">
        <div className="contact__grid" id="contact-carousel" ref={trackRef}>
          <div
            className="contact__intro contact__slide"
            id="contact-slide-info"
            data-slide-label="Contact details"
          >
            <p className="eyebrow">Direct contact</p>
            <h2 className="contact__title">Reach out directly</h2>
            <p className="contact__copy">
              Give us a call or send an email directly. We review every enquiry and will get back
              to you.
            </p>

            <ul className="detail-list">
              <li className="detail">
                <span className="detail__label">Email</span>
                <span className="detail__value">
                  <a href={`mailto:${EMAIL}`} aria-label={`Send email to ${EMAIL}`}>{EMAIL}</a>
                  <CopyButton value={EMAIL} />
                </span>
              </li>
              <li className="detail">
                <span className="detail__label">Phone</span>
                <span className="detail__value"><a href="tel:+27639464108" aria-label="Call studio at +27 63 946 4108">+27 63 946 4108</a></span>
              </li>
              <li className="detail">
                <span className="detail__label">Studio</span>
                <span className="detail__value">South Africa</span>
              </li>
            </ul>
          </div>

          <ContactForm id="contact-slide-form" slideLabel="Send a message" />
        </div>

        <div className="contact__dots" ref={dotsRef} onKeyDown={onDotsKeyDown}>
          <button
            className={`contact__dot${active === 0 ? ' is-active' : ''}`}
            type="button"
            onClick={() => goTo(0)}
            aria-label="Show contact details"
            {...(on ? { 'aria-current': active === 0 ? 'true' : 'false' } : {})}
          >
            <span className="visually-hidden">Show contact details</span>
          </button>
          <button
            className={`contact__dot${active === 1 ? ' is-active' : ''}`}
            type="button"
            onClick={() => goTo(1)}
            aria-label="Show the message form"
            {...(on ? { 'aria-current': active === 1 ? 'true' : 'false' } : {})}
          >
            <span className="visually-hidden">Show the message form</span>
          </button>
        </div>
      </div>
    </motion.section>
  );
}
