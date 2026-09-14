import { motion, useReducedMotion } from 'framer-motion';
import { heroGroup, heroLine, still } from '../lib/motion.js';

/* The line breaks are the ones from the original markup. They are
   kept as <br class="lb"> so the same CSS rule still removes them
   below 900px and the headline reflows exactly as it did. */
const LINES = [
  'We design brands that',
  'matter and build products',
  'that last',
];

export default function Hero() {
  const reduce = useReducedMotion();
  const group = reduce ? still(heroGroup) : heroGroup;
  const lineVariants = reduce ? still(heroLine) : heroLine;

  return (
    <section className="hero">
      <div className="container">
        <motion.h1
          className="hero__title"
          variants={group}
          initial="hidden"
          animate="visible"
        >
          {LINES.map((line, lineIndex) => (
            <span className="hero__line-mask" key={line}>
              <motion.span className="hero__line" variants={lineVariants}>
                {line}
              </motion.span>
              {lineIndex < LINES.length - 1 && ' '}
              {lineIndex < LINES.length - 1 && <br className="lb" />}
            </span>
          ))}
        </motion.h1>

        <div className="hero__sub">
          <p className="hero__lede">
            A digital product studio building scalable software, distinct brand
            identities, and growth marketing for modern businesses.
          </p>
        </div>

        <div className="hero__foot">
          <ul className="meta">
            <li>EST. 2019</li>
            <li className="meta__dash" aria-hidden="true">/</li>
            <li>South Africa / Remote</li>
          </ul>
          <a className="btn btn--ghost" href="#services" aria-label="Explore Services">
            <span>Explore Services</span>
          </a>
        </div>
      </div>
    </section>
  );
}
