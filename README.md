# Young Timbers

The youngtimbers.co.za site, rebuilt as a React application.

The design is unchanged. `src/index.css` opens with the original stylesheet exactly as it
was — same tokens, same layout, same type scale, same breakpoints — and everything added
for this build sits below a marked divider near the end of the file. Copy, navigation,
section order and footer are carried over as they were.

What is new: the wordmark is now an image, the capabilities line runs as a ticker, and
there is a motion layer over the whole page.

## Stack

Vite 5, React 18, Framer Motion 11, Tailwind 3.

Tailwind is wired up and its config mirrors the brand tokens, but the site is still driven
by the hand-written CSS. Utilities are there if you want them for anything new.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the built output
```

## Deploying

`netlify.toml` is set up for Netlify: `npm run build`, publish `dist`, with a catch-all
redirect to `index.html`. Point Netlify at the repository and it needs no further
configuration.

## Structure

```
index.html              Vite entry, meta and font loading
netlify.toml            build command, publish dir, SPA redirect
public/                 copied to the site root at build time
  favicon.svg
  young-timbers-logo.png
  young-timbers-logo@2x.png
  Young-Timbers-Design-Overview.pdf
src/
  main.jsx              mounts the app
  App.jsx               section order
  index.css             the original stylesheet + the interaction layer
  lib/motion.js         easing curves and shared variants
  components/           Header, Hero, Capabilities, Services, Contact, ContactForm, Footer
build/                  generates the standalone preview
docs/
  preview.html          single self-contained file, opens without a build step
  Young-Timbers-Design-Overview.pdf
```

Assets live in `public/`, so they are referenced by URL (`/young-timbers-logo.png`) rather
than imported. That keeps the paths identical in development and in production.

## The preview file

`docs/preview.html` is the whole site in one file — stylesheet inlined, wordmark embedded.
It mirrors the React app: same markup, same CSS, same interactions. Open it straight from
the file system, email it, or drop it on any static host.

Rebuild it after editing `src/index.css` so the two do not drift:

```bash
node build/build-preview.mjs
```

## The contact form

Enquiries go to a Google Apps Script web app, which writes them into a Google Sheet.

| | |
|---|---|
| Method | `POST` |
| Mode | `no-cors` |
| Content type | `text/plain;charset=utf-8` |
| Body | `{ name, email, projectType, message }` |
| Timeout | 15s, via `AbortController` |

The endpoint is the `ENDPOINT` constant at the top of
`src/components/ContactForm.jsx`, and the same value in `build/build-preview.mjs`. Change
it in both if the script is ever redeployed.

Because the request is opaque under `no-cors`, a resolved fetch is treated as delivered and
a rejected one as a genuine failure. On failure the visitor is pointed at
`info@youngtimbers.co.za` and nothing they typed is lost.

The form also carries a native `action` and `method`, so an enquiry still reaches the same
endpoint if JavaScript never runs.

A hidden `company` field acts as a spam trap. If it is filled in, the enquiry is dropped
silently and the sender sees the normal confirmation.

## Motion

One easing curve (`cubic-bezier(0.22, 1, 0.36, 1)`) and one set of durations, in
`src/lib/motion.js`.

- **On arrival** — the headline sets word by word, then the paragraph, meta line and button.
- **On scroll** — Services and Contact settle 8px into place; a hairline under the header
  tracks reading position.
- **On action** — accordion rows open on a measured height, buttons fill from the base, nav
  links draw an underline, the copy control confirms in place.
- **Always** — the capabilities ticker, paused while the pointer is over it.

Every one of these has a reduced-motion path. With the system preference set, the ticker
becomes a scrollable row, entrances resolve immediately, the progress hairline is removed
and smooth scrolling is off.

## Accessibility

Kept from the original build: skip link, visible focus, 44px touch targets, the WAI-ARIA
accordion keyboard pattern, labelled form fields with errors tied to their inputs, and the
carousel roles that attach and detach with the breakpoint rather than sitting on the markup
permanently.

---

`docs/Young-Timbers-Design-Overview.pdf` covers the design system, the motion inventory,
the lead-capture pipeline and the build in more detail.
