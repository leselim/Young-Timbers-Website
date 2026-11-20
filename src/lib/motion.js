/* =========================================================
   Motion tokens

   One easing curve and one small set of durations across the
   whole site, so every transition feels like it came from the
   same hand. Anything that moves without the visitor asking
   for it stays under 0.7s and under 10px of travel.
   ========================================================= */

export const EASE = [0.22, 1, 0.36, 1];
export const EASE_OUT = [0.16, 1, 0.3, 1];

export const DURATION = {
  fast: 0.22,
  base: 0.36,
  slow: 0.6,
};

/* Sections settle into place as they arrive. Matches the 6px
   translate the static site used for [data-reveal]. */
export const sectionReveal = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

export const VIEWPORT = { once: true, amount: 0.12, margin: '0px 0px -8% 0px' };

/* Page-load sequence for the hero. */
export const heroGroup = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.12, staggerChildren: 0.035 },
  },
};

export const heroWord = {
  hidden: { opacity: 0, y: '0.5em' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export const heroTail = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

/* Accordion panels: a person asked for this one, so it can be
   a touch quicker and more definite than the ambient motion. */
export const panelTransition = {
  height: { duration: 0.38, ease: EASE },
  opacity: { duration: 0.26, ease: 'linear' },
};

/* Reduced motion: hand back the same variants with no travel
   and no delay, so the content still composes correctly. */
export function still(variants) {
  const out = {};
  for (const key of Object.keys(variants)) {
    out[key] = { opacity: key === 'hidden' ? 0 : 1, x: 0, y: 0, transition: { duration: 0.01 } };
  }
  return out;
}
