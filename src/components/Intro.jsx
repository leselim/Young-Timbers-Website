import { motion, useReducedMotion } from 'framer-motion';
import { VIEWPORT, sectionReveal, still } from '../lib/motion.js';

/* =========================================================
   Intro

   Positions Young Timbers as an independent digital product
   studio. Two activities sit under one roof: Studio, the
   client work, and Ventures, the company's own products. They
   are presented as two rows of the same label and value list
   used on the contact page, so no new styling is introduced.
   ========================================================= */

const ACTIVITIES = [
  {
    label: 'Studio',
    copy: 'Working with businesses, startups and entrepreneurs to turn ideas into functional digital products through strategy, UX/UI design and engineering.',
  },
  {
    label: 'Ventures',
    copy: 'Conceptualising, designing, developing and owning original digital products, testing them with users and building businesses around the ones that work.',
  },
];

export default function Intro() {
  const reduce = useReducedMotion();
  const reveal = reduce ? still(sectionReveal) : sectionReveal;

  return (
    <motion.section
      className="intro"
      id="about"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <div className="container intro__grid">
        <div className="intro__lead">
          <p className="eyebrow">Who we are</p>
          <h2 className="intro__title">
            An independent digital product studio
          </h2>
        </div>

        <div className="intro__body">
          <p className="intro__copy">
            Young Timbers designs, builds and launches digital products. We bring strategy,
            product design and engineering together, from the first idea to a product in market.
            We work with founders and businesses on their products, and we develop original
            products of our own.
          </p>

          <ul className="detail-list intro__activities">
            {ACTIVITIES.map((item) => (
              <li className="detail" key={item.label}>
                <span className="detail__label">{item.label}</span>
                <span className="detail__value">{item.copy}</span>
              </li>
            ))}
          </ul>

          <p className="intro__meta">One studio, two activities</p>
        </div>
      </div>
    </motion.section>
  );
}
