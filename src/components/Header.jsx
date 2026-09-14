import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/* Lives in /public, so it is referenced by URL rather than imported -
   the file ships as-is and keeps a stable, cacheable path. */
const LOGO = '/young-timbers-logo.png';
const LOGO_2X = '/young-timbers-logo@2x.png';

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'top', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [current, setCurrent] = useState('top');
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const reduce = useReducedMotion();

  /* Hairline progress indicator, painted over the header's
     existing bottom rule so it adds no height. */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  /* ---- mobile drawer ---- */
  const close = useCallback(() => setNavOpen(false), []);

  useEffect(() => {
    if (!navOpen) return undefined;

    const onPointer = (e) => {
      if (navRef.current?.contains(e.target)) return;
      if (toggleRef.current?.contains(e.target)) return;
      close();
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      close();
      toggleRef.current?.focus();
    };

    document.addEventListener('click', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [navOpen, close]);

  /* Leaving the mobile breakpoint resets the drawer. */
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 901px)');
    const sync = (e) => { if (e.matches) close(); };
    wide.addEventListener('change', sync);
    if (wide.matches) close();
    return () => wide.removeEventListener('change', sync);
  }, [close]);

  /* ---- which section is in view ---- */
  useEffect(() => {
    const sections = ['work', 'services', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return undefined;

    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => seen.set(entry.target.id, entry.isIntersecting));
        const active = sections.map((s) => s.id).filter((id) => seen.get(id));
        setCurrent(active.length ? active[active.length - 1] : 'top');
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* Keeps "#top" out of the address bar, as the static site did. */
  const onTop = (e) => {
    close();
    if (window.location.pathname !== '/') {
      return;
    }
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    try {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch {
      /* the scroll already happened */
    }
  };

  const isHome = typeof window !== 'undefined' && window.location.pathname === '/';

  return (
    <header
      className="site-header"
      id="top"
      ref={headerRef}
      {...(navOpen ? { 'data-nav-open': '' } : {})}
    >
      <div className="container header__inner">
        <a
          className="brand"
          href={isHome ? '#top' : '/#top'}
          onClick={onTop}
          aria-label="Young Timbers, back to top"
        >
          <img
            className="brand__logo"
            src={LOGO}
            srcSet={`${LOGO} 1x, ${LOGO_2X} 2x`}
            alt="Young Timbers"
            width="286"
            height="53"
            decoding="async"
          />
        </a>

        <button
          className="nav-toggle"
          type="button"
          ref={toggleRef}
          aria-expanded={navOpen}
          aria-controls="site-nav"
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          onClick={(e) => {
            e.stopPropagation();
            setNavOpen((v) => !v);
          }}
        >
          <span className="nav-toggle__label">{navOpen ? 'Close' : 'Menu'}</span>
        </button>

        <nav className="nav" id="site-nav" aria-label="Primary" ref={navRef}>
          <ul className="nav__list">
            {LINKS.map((link) => {
              const targetHref = isHome ? `#${link.id}` : `/#${link.id}`;
              return (
                <li key={link.id}>
                  <a
                    className="nav__link"
                    href={targetHref}
                    onClick={link.id === 'top' ? onTop : close}
                    {...(current === link.id ? { 'aria-current': 'true' } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <ul className="social" aria-label="Social">
            <li>
              <a
                className="social__link"
                href="https://www.instagram.com/youngtimber.s/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Young Timbers on Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
                </svg>
              </a>
            </li>
            <li>
              <a
                className="social__link"
                href="https://www.linkedin.com/company/youngtimbers/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Young Timbers on LinkedIn"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="6.6" y="10" width="2.4" height="7.6" fill="currentColor" />
                  <rect x="6.5" y="6.3" width="2.6" height="2.3" fill="currentColor" />
                  <path
                    d="M11.4 17.6v-7.6h2.3v1a2.9 2.9 0 0 1 2.5-1.2c1.8 0 2.9 1.1 2.9 3.2v4.6h-2.4v-4.1c0-1.1-.5-1.7-1.4-1.7s-1.6.7-1.6 1.8v4z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
    </header>
  );
}
