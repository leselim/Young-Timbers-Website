import { Fragment } from 'react';

/* =========================================================
   Capabilities

   Same strip, same height, same borders and same type as the
   static site. The row now runs as a continuous ticker: four
   identical groups sit on one track and the track travels
   exactly one group's width before looping, so the seam never
   shows. Pointing at the row pauses it and lifts the item
   under the cursor out of the line.
   ========================================================= */

const ITEMS = [
  'Brand Identity',
  'Product Engineering',
  'MVP Development',
  'Web Platforms',
  'UI/UX Strategy',
  'Growth Marketing',
];

const CELLS = ['Capabilities', ...ITEMS];
const COPIES = [0, 1, 2, 3];

function Group({ hidden }) {
  return (
    <ul className="ticker__group" aria-hidden={hidden || undefined}>
      {CELLS.map((cell, i) => (
        <Fragment key={cell}>
          <li className={i === 0 ? 'ticker__item ticker__item--label' : 'ticker__item'}>{cell}</li>
          <li className="ticker__sep" aria-hidden="true">/</li>
        </Fragment>
      ))}
    </ul>
  );
}

export default function Capabilities() {
  return (
    <section className="trusted" aria-label="Capabilities">
      <div className="container">
        <div className="ticker">
          <div className="ticker__track">
            {COPIES.map((copy) => (
              <Group key={copy} hidden={copy > 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
