import { motion, useReducedMotion } from 'framer-motion';
import { heroGroup, heroTail, heroWord, still } from '../lib/motion.js';

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
  const word = reduce ? still(heroWord) : heroWord;
  const tail = reduce ? still(heroTail) : heroTail;

  return (
    <section className="hero">
      <motion.div className="container" variants={group} initial="hidden" animate="visible">
        <h1 className="hero__title">
          {LINES.map((line, lineIndex) => (
            <span key={line}>
              {line.split(' ').map((token, i, all) => (
                <span key={`${line}-${i}`}>
                  <motion.span
                    variants={word}
                    style={{ display: 'inline-block', willChange: 'transform' }}
                  >
                    {token}
                  </motion.span>
                  {/* a real space, so the headline still wraps normally */}
                  {i < all.length - 1 || lineIndex < LINES.length - 1 ? ' ' : null}
                </span>
              ))}
              {lineIndex < LINES.length - 1 && <br className="lb" />}
            </span>
          ))}
        </h1>

        <div className="hero__sub">
          <motion.p className="hero__lede" variants={tail}>
            A digital product and venture studio building scalable software, distinct brand
            identities, and growth marketing for modern businesses.
          </motion.p>
        </div>

        <motion.div className="hero__foot" variants={tail}>
          <ul className="meta">
            <li>EST. 2019</li>
            <li className="meta__dash" aria-hidden="true">/</li>
            <li>South Africa / Remote</li>
          </ul>
          <a className="btn btn--ghost" href="#services" aria-label="Explore Services">
            <span>Explore Services</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
