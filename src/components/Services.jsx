import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT, panelTransition, sectionReveal, still } from '../lib/motion.js';

const SERVICES = [
  {
    id: 1,
    name: 'Brand Strategy & Identity',
    copy: 'Positioning, messaging frameworks, and visual identities designed to give modern digital brands a distinct market presence.',
  },
  {
    id: 2,
    name: 'Product Design & Engineering',
    copy: 'End-to-end product design, rapid MVP prototyping, scalable architecture, and custom web development.',
  },
  {
    id: 3,
    name: 'Digital Platforms & UX',
    copy: 'High-performance web applications, responsive user experiences, and systematic design foundations built to scale.',
  },
  {
    id: 4,
    name: 'Growth & Digital Marketing',
    copy: 'Go-to-market execution, performance marketing, content strategy, and conversion optimization to drive user acquisition.',
  },
];

export default function Services() {
  /* Rows start open, exactly as they did before, so the section
     still reads as a list rather than a set of closed drawers. */
  const [open, setOpen] = useState(() => SERVICES.map((s) => s.id));
  const toggles = useRef([]);
  const reduce = useReducedMotion();
  const reveal = reduce ? still(sectionReveal) : sectionReveal;

  const isOpen = (id) => open.includes(id);
  const toggle = (id) =>
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  /* Arrow keys move between headers - the WAI-ARIA accordion pattern. */
  const onKeyDown = (e, index) => {
    const last = SERVICES.length - 1;
    let next = null;
    if (e.key === 'ArrowDown') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowUp') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    toggles.current[next]?.focus();
  };

  return (
    <motion.section
      className="services"
      id="services"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <div className="container services__grid">
        <div className="services__intro">
          <p className="eyebrow">What we do</p>
          <h2 className="services__title">
            End-to-end product design, engineering, and growth for digital-first brands
          </h2>
          <p className="services__copy">
            We build full-spectrum digital products from zero to one, combining strategic branding
            with robust engineering and market distribution.
          </p>
          <a className="btn btn--solid" href="#contact" data-contact-target="form" aria-label="Start a Project">
            <span>Start a Project</span>
          </a>
        </div>

        <ul className="service-list">
          {SERVICES.map((service, index) => {
            const expanded = isOpen(service.id);
            const panelId = `service-panel-${service.id}`;
            return (
              <li className="service" key={service.id}>
                <h3 className="service__head">
                  <button
                    className="service__toggle"
                    type="button"
                    ref={(el) => { toggles.current[index] = el; }}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    aria-label={`Toggle details for ${service.name}`}
                    onClick={() => toggle(service.id)}
                    onKeyDown={(e) => onKeyDown(e, index)}
                  >
                    <span className="service__name">{service.name}</span>
                    <motion.span
                      className="service__num"
                      aria-hidden="true"
                      animate={{ opacity: expanded ? 1 : 0.45, y: expanded ? 0 : 1 }}
                      transition={{ duration: 0.28, ease: EASE }}
                    >
                      {String(service.id).padStart(2, '0')}
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-label={service.name}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={reduce ? { duration: 0.01 } : panelTransition}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="service__panel-inner">
                        <p>{service.copy}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.section>
  );
}
