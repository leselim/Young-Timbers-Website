import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { VIEWPORT, sectionReveal, still } from '../lib/motion.js';

const OVERVIEW_WEBP = '/work/threshold/overview.webp';
const OVERVIEW_PNG = '/work/threshold/overview.png';
const ACCESS_WEBP = '/work/threshold/access.webp';
const ACCESS_PNG = '/work/threshold/access.png';
const EXCEPTION_WEBP = '/work/threshold/exception.webp';
const EXCEPTION_PNG = '/work/threshold/exception.png';
const INSIGHTS_WEBP = '/work/threshold/insights.webp';
const INSIGHTS_PNG = '/work/threshold/insights.png';

export default function ThresholdCaseStudy() {
  const reduce = useReducedMotion();
  const reveal = reduce ? still(sectionReveal) : sectionReveal;

  useEffect(() => {
    document.title = 'threshold, estate operations platform | Young Timbers';
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'A case study on designing an operations platform for South African residential estates. Gates, visitors, contractors and reporting in one view.'
      );
    }
    return () => {
      document.title = 'Young Timbers - digital product studio';
      if (metaDesc && prevDesc) metaDesc.setAttribute('content', prevDesc);
    };
  }, []);

  return (
    <div className="case-study">
      {/* HEADER */}
      <section className="case-study__header">
        <div className="container">
          <p className="eyebrow">Selected work</p>
          <h1 className="case-study__title">A control room for residential estates</h1>
          <p className="case-study__standfirst">
            An estate operations platform built around how South African estate managers actually run their gates, visitors and contractors.
          </p>

          <div className="case-study__meta">
            <div className="case-study__meta-item">
              <span className="case-study__meta-label">Role</span>
              <span className="case-study__meta-sep"> — </span>
              <span className="case-study__meta-val">Product and interface design</span>
            </div>
            <div className="case-study__meta-item">
              <span className="case-study__meta-label">Year</span>
              <span className="case-study__meta-sep"> — </span>
              <span className="case-study__meta-val">2026</span>
            </div>
            <div className="case-study__meta-item">
              <span className="case-study__meta-label">Scope</span>
              <span className="case-study__meta-sep"> — </span>
              <span className="case-study__meta-val">Product definition, design system, working MVP</span>
            </div>
            <div className="case-study__meta-item">
              <span className="case-study__meta-label">Platform</span>
              <span className="case-study__meta-sep"> — </span>
              <span className="case-study__meta-val">Desktop and tablet web</span>
            </div>
          </div>

          <div className="case-study__action">
            <a
              className="btn btn--solid"
              href="/work/threshold/demo.html"
              target="_blank"
              rel="noopener"
              aria-label="Open the live demo"
            >
              <span>Open the live demo</span>
            </a>
          </div>
        </div>
      </section>

      {/* CONTEXT */}
      <motion.section
        className="case-study__section"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <div className="container">
          <h2 className="case-study__heading">Estates already collect the data. Nobody has time to read it.</h2>
          <div className="case-study__prose">
            <p>
              A secure estate in Cape Town with 1,248 households records every boom lift at four gates, every visitor code and every contractor permit. That data sits in the gate controller software, the visitor system and a permit spreadsheet. The manager sees it only when something has already gone wrong: a complaint about the morning queue, a contractor on site with an expired permit, guests parking on verges on a Saturday night.
            </p>
            <p>
              threshold turns those separate logs into one calm view of the estate. It shows what is happening now, what has changed against a normal week, and which few things need a decision. It stops short of making the decision.
            </p>
          </div>

          <div className="case-study__stats">
            <div className="case-study__stat">
              <span className="case-study__stat-num">1,248</span>
              <span className="case-study__stat-label">Households in the demo estate</span>
            </div>
            <div className="case-study__stat">
              <span className="case-study__stat-num">4</span>
              <span className="case-study__stat-label">Gates with eight lanes in total</span>
            </div>
            <div className="case-study__stat">
              <span className="case-study__stat-num">7,655</span>
              <span className="case-study__stat-label">Vehicle movements on a Friday</span>
            </div>
            <div className="case-study__stat">
              <span className="case-study__stat-num">61</span>
              <span className="case-study__stat-label">Days of history behind every comparison</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* THE FOUR QUESTIONS */}
      <motion.section
        className="case-study__section"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <div className="container">
          <h2 className="case-study__heading">Questions a manager could not answer quickly</h2>
          <div className="case-study__questions">
            <div className="case-study__question-item">
              <h3 className="case-study__question-q">
                Was this morning's queue at Main Gate unusual, or does it happen every Friday?
              </h3>
              <p className="case-study__question-a">Overview, and Operations</p>
            </div>
            <div className="case-study__question-item">
              <h3 className="case-study__question-q">
                Which access events from today still need someone to look at them?
              </h3>
              <p className="case-study__question-a">Needs attention, and the Access log</p>
            </div>
            <div className="case-study__question-item">
              <h3 className="case-study__question-q">
                Do we need overflow visitor parking, and on which evenings?
              </h3>
              <p className="case-study__question-a">Insights, with the evidence and method</p>
            </div>
            <div className="case-study__question-item">
              <h3 className="case-study__question-q">
                What should go in this week's report to the trustees?
              </h3>
              <p className="case-study__question-a">Reports</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* DESIGN PRINCIPLES */}
      <motion.section
        className="case-study__section"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <div className="container">
          <h2 className="case-study__heading">Four rules that decided most arguments</h2>
          <div className="case-study__principles">
            <div className="case-study__principle">
              <h3 className="case-study__principle-title">Normal first, exceptions second</h3>
              <p className="case-study__principle-copy">
                Every figure is shown against the usual range for that day and time. A Friday is compared with previous Fridays, not with a Sunday. Colour is kept for the few things outside that range.
              </p>
            </div>
            <div className="case-study__principle">
              <h3 className="case-study__principle-title">Show the evidence, leave the decision</h3>
              <p className="case-study__principle-copy">
                Insights state a finding, show the comparison period and explain the calculation. The product never acts on her behalf.
              </p>
            </div>
            <div className="case-study__principle">
              <h3 className="case-study__principle-title">Say when a number is estimated</h3>
              <p className="case-study__principle-copy">
                Queue times and parking occupancy are modelled from arrivals and departures. They carry an Estimated label and a method note.
              </p>
            </div>
            <div className="case-study__principle">
              <h3 className="case-study__principle-title">Private by default</h3>
              <p className="case-study__principle-copy">
                Registrations are masked. Showing a full plate is a deliberate action, and the audit log records it with the time and the person.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SCREENS */}
      <motion.section
        className="case-study__section"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <div className="container">
          <div className="case-study__screens">
            {/* Screen 1: overview */}
            <div className="case-study__screen">
              <div className="case-study__screen-text">
                <h3 className="case-study__screen-heading">The estate's state, readable in ten seconds</h3>
                <p className="case-study__screen-copy">
                  Overview brings together entries and exits, baseline comparisons, attention cards, and gate metrics into a single screen that can be scanned in ten seconds.
                </p>
              </div>
              <div className="case-study__screen-media">
                <picture>
                  <source srcSet={OVERVIEW_WEBP} type="image/webp" />
                  <img
                    className="case-study__screen-img"
                    src={OVERVIEW_PNG}
                    alt="The estate's state, readable in ten seconds"
                    width="1600"
                    height="1111"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>

            {/* Screen 2: access */}
            <div className="case-study__screen">
              <div className="case-study__screen-text">
                <h3 className="case-study__screen-heading">A dense log that stays readable at 7,655 rows a day</h3>
                <p className="case-study__screen-copy">
                  Fast filtering by date, gate, and access type, paired with a side panel that shows vehicle history and linked permits without taking you away from the list.
                </p>
              </div>
              <div className="case-study__screen-media">
                <picture>
                  <source srcSet={ACCESS_WEBP} type="image/webp" />
                  <img
                    className="case-study__screen-img"
                    src={ACCESS_PNG}
                    alt="A dense log that stays readable at 7,655 rows a day"
                    width="1600"
                    height="1000"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>

            {/* Screen 3: exception */}
            <div className="case-study__screen">
              <div className="case-study__screen-text">
                <h3 className="case-study__screen-heading">
                  From flagged at the gate to reviewed, with a record of who decided
                </h3>
                <p className="case-study__screen-copy">
                  Exceptions show the reason first, allow the manager to add an operational note, and record every review and plate reveal in the audit log.
                </p>
              </div>
              <div className="case-study__screen-media">
                <picture>
                  <source srcSet={EXCEPTION_WEBP} type="image/webp" />
                  <img
                    className="case-study__screen-img"
                    src={EXCEPTION_PNG}
                    alt="From flagged at the gate to reviewed, with a record of who decided"
                    width="1600"
                    height="1000"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>

            {/* Screen 4: insights */}
            <div className="case-study__screen">
              <div className="case-study__screen-text">
                <h3 className="case-study__screen-heading">Written like an operations brief, not a dashboard widget</h3>
                <p className="case-study__screen-copy">
                  Findings state what happened, show the comparison period, explain the calculation, and suggest an operational consideration to bring to trustees.
                </p>
              </div>
              <div className="case-study__screen-media">
                <picture>
                  <source srcSet={INSIGHTS_WEBP} type="image/webp" />
                  <img
                    className="case-study__screen-img"
                    src={INSIGHTS_PNG}
                    alt="Written like an operations brief, not a dashboard widget"
                    width="1600"
                    height="1111"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CLOSING */}
      <motion.section
        className="case-study__section case-study__closing"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <div className="container">
          <h2 className="case-study__heading">What we would test next</h2>
          <div className="case-study__prose">
            <p>
              Sit with three estate managers for a week of mornings and measure how long it takes to answer those four questions, with and without threshold.
            </p>
            <p>
              threshold runs on a seeded simulation of a fictional estate. Registrations follow South African formats and are invented. No real people, units or vehicles are represented.
            </p>
          </div>
          <div className="case-study__footer-action">
            <a className="btn btn--solid" href="/#contact" aria-label="Start a project">
              <span>Start a project</span>
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
