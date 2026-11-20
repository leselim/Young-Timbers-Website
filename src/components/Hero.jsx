import { motion, useReducedMotion } from 'framer-motion';
import { heroGroup, heroTail, heroWord, still } from '../lib/motion.js';

/* The line breaks are the ones from the original markup. They are
   kept as <br class="lb"> so the same CSS rule still removes them
   below 900px and the headline reflows exactly as it did. */
const LINES = [
<<<<<<< HEAD
  'We design, build and launch',
  'digital products that',
  'move businesses forward',
=======
  'We turn ambitious ideas',
  'into technology that',
  'moves businesses forward',
>>>>>>> 53a1ec74db7f05cc99ed5950bde3f11109c8aa85
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
<<<<<<< HEAD
            Young Timbers is an independent digital product studio. We help founders and
            businesses research, design, engineer and launch digital products, and we
            build our own product ideas alongside our client work.
=======
            We help businesses and founders establish, design, engineer and grow
            digital products. From early-stage concepts to fully developed digital
            experiences, we bring strategy, design and technology together to build
            for what comes next.
>>>>>>> 53a1ec74db7f05cc99ed5950bde3f11109c8aa85
          </motion.p>
        </div>

        <motion.div className="hero__foot" variants={tail}>
          <ul className="meta">
            <li>EST. 2019</li>
            <li className="meta__dash" aria-hidden="true">/</li>
            <li>South Africa / Remote</li>
          </ul>
          <div className="hero__actions">
            <a className="btn btn--solid" href="#contact" data-contact-target="form" aria-label="Start a Project">
              <span>Start a Project</span>
            </a>
            <a className="btn btn--ghost" href="#services" aria-label="Explore Our Capabilities">
              <span>Explore Our Capabilities</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
