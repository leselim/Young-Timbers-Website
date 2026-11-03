import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { VIEWPORT, sectionReveal, still } from '../lib/motion.js';

/* =========================================================
   Process: From idea to impact

   Four stages read as one line rather than four cards. Each
   stage opens with its numeral and a hairline that runs on
   to the next numeral, so the eye travels 01 to 04 along a
   single rule. The last rule runs on to the edge, because
   the work does not stop at launch.

   On wide screens the stages sit side by side; below 1080px
   the rule turns vertical and the stages stack. The rules
   draw in once, when the row first comes into view, using
   the same easing as every other line on the site.
   ========================================================= */

const STAGES = [
  {
    id: 1,
    title: 'Establish the brand',
    copy:
      'We define the foundation of your business through strategic positioning, brand development, messaging and visual identity. We help give your business a distinct voice and a recognisable place in the market.',
  },
  {
    id: 2,
    title: 'Design the product',
    copy:
      'We transform ideas into intuitive digital experiences through product strategy, UI/UX research and interface design. Every decision is guided by the people who will use the product and the problem it needs to solve.',
  },
  {
    id: 3,
    title: 'Engineer the technology',
    copy:
      'We turn product concepts and designs into functional digital solutions. From MVP development and custom software to web platforms, we build technology around real business needs.',
  },
  {
    id: 4,
    title: 'Take it to market and grow',
    copy:
      'We help digital products connect with the right audiences through growth strategy, digital marketing and market distribution. Our work extends beyond launch, supporting the growth and visibility of the products we help build.',
  },
];

export default function Process() {
  const reduce = useReducedMotion();
  const reveal = reduce ? still(sectionReveal) : sectionReveal;
  const stepsRef = useRef(null);
  const drawn = useInView(stepsRef, { once: true, amount: 0.25 });

  return (
    <motion.section
      className="process"
      id="process"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <div className="container">
        <div className="process__head">
          <div className="process__lead">
            <p className="eyebrow">How we work</p>
            <h2 className="process__title">From idea to impact</h2>
          </div>
          <p className="process__copy">
            Building a successful digital product takes more than a good idea. It takes a
            clear strategy, thoughtful design, solid engineering and the ability to reach the
            right market. We bring these disciplines together.
          </p>
        </div>

        <ol
          className={`process__steps${drawn || reduce ? ' is-drawn' : ''}`}
          ref={stepsRef}
          data-armed=""
        >
          {STAGES.map((stage, index) => (
            <li className="step" key={stage.id} style={{ '--i': index }}>
              <div className="step__marker" aria-hidden="true">
                <span className="step__num">{String(stage.id).padStart(2, '0')}</span>
                <span className="step__line" />
              </div>
              <h3 className="step__title">{stage.title}</h3>
              <p className="step__copy">{stage.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </motion.section>
  );
}
