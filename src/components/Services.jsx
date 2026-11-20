import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT, panelTransition, sectionReveal, still } from '../lib/motion.js';

/* The four capability areas, in the same order as the process
   above, so a stage and the work behind it share a number.
   Product design is the discipline the studio leads with, so it
   is tagged and opens first. */
const SERVICES = [
  {
    id: 1,
    name: 'Brand Strategy & Identity',
    copy: 'A clear position and an identity people recognise, so the market understands what you offer and why it matters.',
    points: ['Brand positioning', 'Brand strategy', 'Messaging frameworks', 'Visual identity development'],
  },
  {
    id: 2,
    name: 'Product Design & Experience',
    tag: 'Core',
    copy: 'Research-led design, from user journeys and wireframes to interactive prototypes and design systems, so the product makes sense to the people using it from the first screen.',
    points: [
      'Product strategy',
      'UI/UX research',
      'User journey mapping',
      'Wireframing',
      'Interactive prototyping',
      'Design systems',
    ],
  },
  {
    id: 3,
    name: 'Product Engineering & Technology',
    copy: 'Working software built around how your business operates, from a first MVP to the platform it becomes.',
    points: ['Product engineering', 'MVP development', 'Web application development', 'Digital platforms'],
  },
  {
    id: 4,
    name: 'Growth & Market Development',
    copy: 'Growth strategy and execution that put a product in front of the right audience and keep it growing after launch.',
    points: ['Growth strategy', 'Growth marketing', 'Digital marketing', 'Audience acquisition and market positioning'],
  },
];

export default function Services() {
  /* Product design opens by default. Single-open behavior closes
     any active row when a new row is opened. */
  const [open, setOpen] = useState(2);
  const toggles = useRef([]);
  const reduce = useReducedMotion();
  const reveal = reduce ? still(sectionReveal) : sectionReveal;

  const isOpen = (id) => open === id;
  const toggle = (id) => setOpen((prev) => (prev === id ? null : id));

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
          <h2 className="services__title">Our capabilities</h2>
          <p className="services__copy">
            A focused studio for designing, building and growing digital products. We combine
            strategy, product design, engineering and market growth across the full product
            lifecycle, for clients and for our own ventures.
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
                    <span className="service__name">
                      {service.name}
                      {service.tag && <span className="service__tag">{service.tag}</span>}
                    </span>
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
                        <ul className="service__points" aria-label={`${service.name} includes`}>
                          {service.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
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
