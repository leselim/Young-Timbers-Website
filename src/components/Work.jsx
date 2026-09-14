import { motion, useReducedMotion } from 'framer-motion';
import { VIEWPORT, sectionReveal, still } from '../lib/motion.js';

const OVERVIEW_WEBP = '/work/threshold/overview.webp';
const OVERVIEW_PNG = '/work/threshold/overview.png';

export default function Work() {
  const reduce = useReducedMotion();
  const reveal = reduce ? still(sectionReveal) : sectionReveal;

  return (
    <motion.section
      className="work"
      id="work"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <div className="container work__grid">
        <div className="work__intro">
          <p className="eyebrow">Selected work</p>
          <h2 className="work__title">Estates and operations platform</h2>
        </div>

        <div className="work__list">
          <article className="work-item">
            <a className="work-item__media-link" href="/work/threshold">
              <picture>
                <source srcSet={OVERVIEW_WEBP} type="image/webp" />
                <img
                  className="work-item__image"
                  src={OVERVIEW_PNG}
                  alt="threshold overview dashboard"
                  width="1600"
                  height="1111"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </a>

            <div className="work-item__content">
              <h3 className="work-item__name">threshold</h3>
              <p className="work-item__copy">
                An operations platform for South African residential estates
              </p>
              <a className="work-item__link" href="/work/threshold">
                <span>Read the case study</span>
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </motion.section>
  );
}
