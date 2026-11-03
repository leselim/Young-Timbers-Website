import { motion, useReducedMotion } from 'framer-motion';
import { VIEWPORT, sectionReveal, still } from '../lib/motion.js';

/* =========================================================
   Intro

   The company description that used to sit at the top of
   the Services column, given its own short row so the
   positioning is stated once, plainly, before the process
   and the capabilities explain it. Built from the same
   two-column grid, eyebrow, heading scale and meta line the
   other sections already use.
   ========================================================= */

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
            A technology and digital product company
          </h2>
        </div>

        <div className="intro__body">
          <p className="intro__copy">
            From strategy to technology and market growth, we help businesses turn
            opportunities into digital products. Our integrated approach connects brand
            development, product design, engineering and distribution, giving ambitious
            ideas the foundation to become meaningful digital solutions.
          </p>
          <p className="intro__meta">Soar to great heights</p>
        </div>
      </div>
    </motion.section>
  );
}
