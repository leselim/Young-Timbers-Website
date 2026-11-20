import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT, panelTransition, sectionReveal, still } from '../lib/motion.js';

const FAQS = [
  {
    id: 1,
    question: 'Who do you work with?',
    answer:
      'Founders and startups taking a new product from idea to launch, growing businesses whose brand, product or platform needs to keep pace, and established organisations modernising platforms, workflows and customer facing systems.',
  },
  {
    id: 2,
    question: 'How does a project start?',
    answer:
      'With a conversation about what you want to build or fix and the opportunity behind it. We then send a written scope that sets out the price, the timeline and what falls outside it. Work begins once that is agreed.',
  },
  {
    id: 3,
    question: 'Do we own the code and the accounts?',
    answer:
      'Yes. The code, repositories, hosting and third party accounts are yours, and they are handed over with documentation at the end of the engagement.',
  },
  {
    id: 4,
    question: 'Can you work with our existing team?',
    answer:
      'Yes. We can lead the full journey from brand to launch, or work alongside your in-house designers and engineers on a defined part of it, whether that is the brand, the product design, the build or the growth work.',
  },
  {
    id: 5,
    question: 'Do you support the product after launch?',
    answer:
      'Yes, through a monthly retainer covering iteration, maintenance and support. It is optional and quoted separately, and it can sit alongside ongoing growth work once the product is in market.',
  },
  {
    id: 6,
    question: 'Where are you based?',
    answer: 'We are based in South Africa and work remotely with clients wherever they are.',
  },
];

export default function Faq() {
  /* Questions start closed by default. Single-open behavior closes any
     active question when a new question is opened. */
  const [open, setOpen] = useState(null);
  const toggles = useRef([]);
  const reduce = useReducedMotion();
  const reveal = reduce ? still(sectionReveal) : sectionReveal;

  const isOpen = (id) => open === id;
  const toggle = (id) => setOpen((prev) => (prev === id ? null : id));

  /* Arrow keys move between headers - the WAI-ARIA accordion pattern. */
  const onKeyDown = (e, index) => {
    const last = FAQS.length - 1;
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
      className="faq"
      id="faq"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <div className="container faq__grid">
        <div className="faq__intro">
          <p className="eyebrow">Questions</p>
          <h2 className="faq__title">What people ask before we start</h2>
          <p className="faq__copy">
            If something here is not covered, ask us directly and we will give you a straight
            answer.
          </p>
        </div>

        <ul className="service-list faq-list">
          {FAQS.map((item, index) => {
            const expanded = isOpen(item.id);
            const panelId = `faq-panel-${item.id}`;
            return (
              <li className="service" key={item.id}>
                <h3 className="service__head">
                  <button
                    className="service__toggle"
                    type="button"
                    ref={(el) => { toggles.current[index] = el; }}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                    onKeyDown={(e) => onKeyDown(e, index)}
                  >
                    <span className="service__name">{item.question}</span>
                    <motion.span
                      className="service__num faq__mark"
                      aria-hidden="true"
                      animate={{ rotate: expanded ? 45 : 0, opacity: expanded ? 1 : 0.45 }}
                      transition={{ duration: 0.28, ease: EASE }}
                    >
                      +
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-label={item.question}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={reduce ? { duration: 0.01 } : panelTransition}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="service__panel-inner">
                        <p>{item.answer}</p>
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
