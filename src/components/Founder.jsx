import { motion, useReducedMotion } from 'framer-motion';
import { VIEWPORT, sectionReveal, still } from '../lib/motion.js';

const PORTRAIT = '/leseli-morakile.jpg';

export default function Founder() {
  const reduce = useReducedMotion();
  const reveal = reduce ? still(sectionReveal) : sectionReveal;

  return (
    <motion.section
      className="founder"
      id="founder"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <div className="container founder__grid">
        <div className="founder__media">
          <img
            className="founder__portrait"
            src={PORTRAIT}
            alt="Leseli Morakile, founder of Young Timbers"
            width="720"
            height="900"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="founder__content">
          <p className="eyebrow">The founder</p>
          <h2 className="founder__title">Leseli Morakile</h2>
          <div className="founder__body">
            <p>
              Leseli started Young Timbers in 2019, before the studio had a name worth
              printing. The work came first: a brand that needed rebuilding, a system
              that needed fixing, a business that needed to look like itself again.
            </p>
            <p>
              Leseli works across brand, product and code, and does not draw hard lines
              between them. That range is the studio. It is why the brand and the software
              are made by the same hands, and why the person who scopes your project is
              the person who does the work.
            </p>
            <p>
              Young Timbers is named for what it is: something young, growing, and built
              to hold weight.
            </p>
          </div>
          <p className="founder__meta">FOUNDER / YOUNG TIMBERS</p>
        </div>
      </div>
    </motion.section>
  );
}
