/* =========================================================
   Young Timbers - interactions

   Everything here is progressive. The page is fully readable
   and the form still submits with scripting turned off, so
   the "js" class is added from here rather than from the
   document head: if this file fails to load, nothing stays
   hidden waiting for a reveal that will never run.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reduceMotion() { return motionQuery.matches; }
  function scrollMode() { return reduceMotion() ? 'auto' : 'smooth'; }

  function toArray(list) { return Array.prototype.slice.call(list); }

  /* matchMedia listener, with the deprecated fallback for older Safari. */
  function onMediaChange(mq, handler) {
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
  }

  /* ---------------------------------------------------------
     Accordion
     Rows start open so the services section reads as a list;
     set data-accordion-exclusive="true" for one-at-a-time.
     --------------------------------------------------------- */
  function initAccordion(list) {
    var exclusive = list.getAttribute('data-accordion-exclusive') === 'true';
    var toggles = toArray(list.querySelectorAll('[aria-controls]'));

    function setOpen(toggle, open) {
      var panel = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!panel) return;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) panel.removeAttribute('data-collapsed');
      else panel.setAttribute('data-collapsed', '');
    }

    toggles.forEach(function (toggle, i) {
      setOpen(toggle, toggle.getAttribute('aria-expanded') === 'true');

      toggle.addEventListener('click', function () {
        var willOpen = toggle.getAttribute('aria-expanded') !== 'true';
        if (exclusive && willOpen) {
          toggles.forEach(function (other) {
            if (other !== toggle) setOpen(other, false);
          });
        }
        setOpen(toggle, willOpen);
      });

      /* Arrow keys move between headers - the WAI-ARIA accordion pattern. */
      toggle.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown') next = toggles[(i + 1) % toggles.length];
        else if (e.key === 'ArrowUp') next = toggles[(i - 1 + toggles.length) % toggles.length];
        else if (e.key === 'Home') next = toggles[0];
        else if (e.key === 'End') next = toggles[toggles.length - 1];
        if (next) { e.preventDefault(); next.focus(); }
      });
    });
  }

  /* ---------------------------------------------------------
     Mobile nav
     --------------------------------------------------------- */
  function initNavToggle(toggle) {
    var header = toggle.closest('.site-header');
    var label = toggle.querySelector('.nav-toggle__label');
    var nav = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!header || !nav) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) header.setAttribute('data-nav-open', '');
      else header.removeAttribute('data-nav-open');
      if (label) label.textContent = open ? 'Close' : 'Menu';
    }

    function isOpen() { return toggle.getAttribute('aria-expanded') === 'true'; }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!isOpen());
    });

    /* Any in-page jump closes the panel. */
    nav.addEventListener('click', function (e) {
      var target = e.target;
      var link = target && target.closest ? target.closest('a[href^="#"]') : null;
      if (link) setOpen(false);
    });

    /* Tapping the page outside the open panel closes it too. */
    document.addEventListener('click', function (e) {
      if (!isOpen()) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Leaving the mobile breakpoint resets the panel. */
    var wide = window.matchMedia('(min-width: 901px)');
    onMediaChange(wide, function (e) { if (e.matches) setOpen(false); });
    if (wide.matches) setOpen(false);
  }

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */
  function initReveal() {
    var targets = toArray(document.querySelectorAll('[data-reveal]'));
    if (!targets.length) return;

    function revealAll() {
      targets.forEach(function (el) { el.classList.add('is-revealed'); });
    }

    if (!('IntersectionObserver' in window) || reduceMotion()) {
      revealAll();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    targets.forEach(function (el) { io.observe(el); });

    /* Safety net for anything already on screen that the observer did
       not report. Sections further down keep their reveal. */
    window.setTimeout(function () {
      targets.forEach(function (el) {
        if (el.classList.contains('is-revealed')) return;
        var box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) el.classList.add('is-revealed');
      });
    }, 2000);
  }

  /* ---------------------------------------------------------
     Marks the nav link for the section currently in view.
     --------------------------------------------------------- */
  function initScrollSpy() {
    var main = document.getElementById('main');
    if (!main || !('IntersectionObserver' in window)) return;

    var pairs = [];
    toArray(document.querySelectorAll('.nav__link[href^="#"]')).forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = id ? document.getElementById(id) : null;
      /* Only sections inside <main>: "#top" is the header, not a section. */
      if (section && main.contains(section)) pairs.push({ link: link, section: section });
    });
    if (!pairs.length) return;

    var visible = Object.create(null);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        visible[e.target.id] = e.isIntersecting;
      });

      var current = null;
      pairs.forEach(function (p) { if (visible[p.section.id]) current = p; });

      pairs.forEach(function (p) {
        if (p === current) p.link.setAttribute('aria-current', 'true');
        else p.link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    pairs.forEach(function (p) { io.observe(p.section); });
  }

  /* ---------------------------------------------------------
     Copy to clipboard
     --------------------------------------------------------- */
  function initCopy(button) {
    var label = button.querySelector('.copy__label');
    var original = label ? label.textContent : '';
    var timer;

    /* Used on file:// and whenever the async clipboard is refused. */
    function legacyCopy(text) {
      var field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:absolute;left:-9999px;top:0';
      document.body.appendChild(field);
      field.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(field);
      return ok;
    }

    button.addEventListener('click', function () {
      var text = button.getAttribute('data-copy') || '';
      if (!text) return;

      var done = function (ok) {
        if (!label) return;
        label.textContent = ok ? 'Copied' : 'Copy failed';
        button.setAttribute('data-copied', '');
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          label.textContent = original;
          button.removeAttribute('data-copied');
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { done(true); },
          function () { done(legacyCopy(text)); }
        );
      } else {
        done(legacyCopy(text));
      }
    });
  }

  /* ---------------------------------------------------------
     Contact form
     Validates on submit, then re-validates each field as it is
     corrected. Posts to form.action when one is set, otherwise
     runs locally without transmitting anything.
     --------------------------------------------------------- */
  function initForm(form) {
    var status = form.querySelector('.form__status');
    var submit = form.querySelector('[type="submit"]');
    var fields = toArray(form.querySelectorAll('.field__input'));
    var trap = form.querySelector('.field--trap input');
    var validated = false;
    var sending = false;

    var rules = {
      name: function (v) {
        if (!v.trim()) return 'Please enter your name.';
        if (v.trim().length < 2) return 'That name looks too short.';
        return '';
      },
      email: function (v) {
        if (!v.trim()) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Please enter a valid email address.';
        return '';
      },
      project: function (v) {
        if (!v) return 'Please choose a project type.';
        return '';
      },
      message: function (v) {
        if (!v.trim()) return 'Please tell us about the project.';
        if (v.trim().length < 10) return 'A little more detail would help.';
        return '';
      }
    };

    function check(field) {
      var rule = rules[field.name];
      var error = rule ? rule(field.value) : '';
      var box = document.getElementById('error-' + field.name);
      if (error) {
        field.setAttribute('aria-invalid', 'true');
        if (box) { box.textContent = error; box.hidden = false; }
      } else {
        field.removeAttribute('aria-invalid');
        if (box) { box.textContent = ''; box.hidden = true; }
      }
      return !error;
    }

    fields.forEach(function (field) {
      var revalidate = function () { if (validated) check(field); };
      field.addEventListener('input', revalidate);
      field.addEventListener('change', revalidate);
      field.addEventListener('blur', revalidate);
    });

    /* Live character count on the message field. */
    var counter = form.querySelector('[data-count-for]');
    var counted = null;
    var max = '600';
    if (counter) {
      counted = document.getElementById(counter.getAttribute('data-count-for'));
      if (counted) {
        max = counted.getAttribute('maxlength') || '600';
        var render = function () { counter.textContent = counted.value.length + ' / ' + max; };
        counted.addEventListener('input', render);
        render();
      }
    }

    function setStatus(text, state) {
      if (!status) return;
      status.textContent = text;
      if (state) status.setAttribute('data-state', state);
      else status.removeAttribute('data-state');
    }

    function resetCounter() {
      if (counter && counted) counter.textContent = '0 / ' + max;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      validated = true;

      var invalid = fields.filter(function (f) { return !check(f); });
      if (invalid.length) {
        setStatus(invalid.length === 1 ? 'One field needs attention.' : invalid.length + ' fields need attention.', 'error');
        invalid[0].focus();
        return;
      }

      /* A filled spam trap is dropped silently. */
      if (trap && trap.value) {
        form.reset();
        resetCounter();
        setStatus('Thank you. We will get back to you.', null);
        return;
      }

      var data = {};
      fields.forEach(function (f) { data[f.name] = f.value.trim(); });

      sending = true;
      if (submit) submit.disabled = true;
      setStatus('Sending…', null);

      var finish = function () {
        sending = false;
        if (submit) submit.disabled = false;
        form.reset();
        validated = false;
        fields.forEach(function (f) {
          f.removeAttribute('aria-invalid');
          var box = document.getElementById('error-' + f.name);
          if (box) { box.textContent = ''; box.hidden = true; }
        });
        resetCounter();
        setStatus('Thank you ' + (data.name || '').split(' ')[0] + '. We will get back to you.', null);
      };

      var fail = function () {
        sending = false;
        if (submit) submit.disabled = false;
        setStatus('That did not send. Please email info@youngtimbers.co.za instead.', 'error');
      };

      var action = form.getAttribute('action');
      if (!action) {
        /* No endpoint configured: nothing is transmitted. */
        window.setTimeout(finish, 700);
        return;
      }

      var params = new URLSearchParams();
      Object.keys(data).forEach(function (key) { params.append(key, data[key]); });

      /* The endpoint is opaque under no-cors, so a resolved request is
         treated as delivered and a rejected one as a genuine failure -
         previously both paths reported success. */
      var controller = ('AbortController' in window) ? new AbortController() : null;
      var timeout = window.setTimeout(function () {
        if (controller) controller.abort();
      }, 15000);

      var options = { method: 'POST', mode: 'no-cors', body: params };
      if (controller) options.signal = controller.signal;

      fetch(action, options).then(function () {
        window.clearTimeout(timeout);
        finish();
      }).catch(function () {
        window.clearTimeout(timeout);
        fail();
      });
    });
  }

  /* ---------------------------------------------------------
     Back to top
     --------------------------------------------------------- */
  function initBackToTop() {
    toArray(document.querySelectorAll('a[href="#top"], .js-back-to-top')).forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: scrollMode() });
        /* Some browsers refuse history writes on file:// URLs. */
        try {
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        } catch (err) { /* the scroll already happened */ }
      });
    });
  }

  /* ---------------------------------------------------------
     Contact carousel

     Below the breakpoint the two contact panels become a
     swipeable track. Above it they are an ordinary two-column
     grid, so the carousel roles, the dots and the measured
     height are all attached and detached with the breakpoint
     rather than left on the markup permanently.
     --------------------------------------------------------- */
  function initContactCarousel() {
    var track = document.getElementById('contact-carousel');
    var dotsWrap = document.querySelector('.contact__dots');
    if (!track || !dotsWrap) return;

    var slides = toArray(track.querySelectorAll('.contact__slide'));
    var dots = toArray(dotsWrap.querySelectorAll('.contact__dot'));
    if (slides.length < 2 || dots.length !== slides.length) return;

    var mq = window.matchMedia('(max-width: 600px)');
    var active = 0;
    var on = false;
    var heights = [];
    var frame = null;
    var syncFrame = null;
    var lastHeight = -1;
    var resizeObserver = null;

    function label(i) {
      return slides[i].getAttribute('data-slide-label') || ('Slide ' + (i + 1));
    }

    function measure() {
      heights = slides.map(function (slide) { return slide.offsetHeight; });
    }

    /* The panels are different heights, so the track height is
       interpolated across the swipe. Without this the taller panel
       is clipped mid-gesture. */
    function applyHeight() {
      if (!on) return;
      var width = track.clientWidth;
      if (!width || !heights.length) return;

      var position = track.scrollLeft / width;
      var from = Math.max(0, Math.min(slides.length - 1, Math.floor(position)));
      var to = Math.max(0, Math.min(slides.length - 1, from + 1));
      var ratio = Math.max(0, Math.min(1, position - from));
      var height = Math.round(heights[from] + (heights[to] - heights[from]) * ratio);

      /* Only write when the value actually changes, so a resize
         observer watching the slides cannot feed itself. */
      if (height > 0 && height !== lastHeight) {
        lastHeight = height;
        track.style.height = height + 'px';
      }
    }

    function setActive(index) {
      active = Math.max(0, Math.min(slides.length - 1, index));
      dots.forEach(function (dot, i) {
        var current = i === active;
        dot.classList.toggle('is-active', current);
        if (on) dot.setAttribute('aria-current', current ? 'true' : 'false');
        else dot.removeAttribute('aria-current');
      });
    }

    function goTo(index, behavior) {
      if (!on) return;
      var target = slides[Math.max(0, Math.min(slides.length - 1, index))];
      if (!target) return;
      track.scrollTo({
        left: target.offsetLeft - slides[0].offsetLeft,
        behavior: behavior || scrollMode()
      });
      setActive(index);
    }

    function onScroll() {
      if (!on) return;
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(function () {
        frame = null;
        applyHeight();
        var width = track.clientWidth;
        if (!width) return;
        setActive(Math.round(track.scrollLeft / width));
      });
    }

    /* Left/right arrows step between panels when a dot has focus. */
    dotsWrap.addEventListener('keydown', function (e) {
      var index = dots.indexOf(document.activeElement);
      if (index < 0) return;
      var next = null;
      if (e.key === 'ArrowRight') next = (index + 1) % dots.length;
      else if (e.key === 'ArrowLeft') next = (index - 1 + dots.length) % dots.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = dots.length - 1;
      if (next === null) return;
      e.preventDefault();
      dots[next].focus();
      goTo(next);
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    track.addEventListener('scroll', onScroll, { passive: true });

    function enable() {
      on = true;
      track.classList.add('is-carousel');
      dotsWrap.classList.add('is-carousel');

      track.setAttribute('role', 'group');
      track.setAttribute('aria-roledescription', 'carousel');
      track.setAttribute('aria-label', 'Ways to get in touch');
      track.setAttribute('tabindex', '0');

      slides.forEach(function (slide, i) {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', (i + 1) + ' of ' + slides.length + ': ' + label(i));
      });

      measure();
      setActive(Math.round(track.scrollLeft / (track.clientWidth || 1)));
      applyHeight();

      if ('ResizeObserver' in window && !resizeObserver) {
        resizeObserver = new ResizeObserver(function () {
          measure();
          applyHeight();
        });
        slides.forEach(function (slide) { resizeObserver.observe(slide); });
      }
    }

    function disable() {
      on = false;
      track.classList.remove('is-carousel');
      dotsWrap.classList.remove('is-carousel');
      track.style.height = '';
      track.scrollLeft = 0;
      lastHeight = -1;

      ['role', 'aria-roledescription', 'aria-label', 'tabindex'].forEach(function (attr) {
        track.removeAttribute(attr);
      });
      slides.forEach(function (slide) {
        ['role', 'aria-roledescription', 'aria-label'].forEach(function (attr) {
          slide.removeAttribute(attr);
        });
      });
      dots.forEach(function (dot) { dot.removeAttribute('aria-current'); });

      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    }

    function sync() {
      if (mq.matches && !on) enable();
      else if (!mq.matches && on) disable();
      else if (on) { measure(); applyHeight(); }
    }

    /* Resize fires in bursts; one measurement per frame is enough. */
    function queueSync() {
      if (syncFrame) return;
      syncFrame = window.requestAnimationFrame(function () {
        syncFrame = null;
        sync();
      });
    }

    onMediaChange(mq, queueSync);
    window.addEventListener('resize', queueSync);
    window.addEventListener('orientationchange', function () {
      window.setTimeout(queueSync, 200);
    });
    sync();

    /* "Start a Project" opens the message panel rather than the
       details panel; the plain "Contact" nav link does not. */
    toArray(document.querySelectorAll('[data-contact-target="form"]')).forEach(function (link) {
      link.addEventListener('click', function () {
        if (!on) return;
        window.setTimeout(function () { goTo(slides.length - 1); }, 250);
      });
    });
  }

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  function initYear() {
    toArray(document.querySelectorAll('[data-current-year]')).forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* --------------------------------------------------------- */
  toArray(document.querySelectorAll('.js-accordion')).forEach(initAccordion);
  toArray(document.querySelectorAll('.nav-toggle')).forEach(initNavToggle);
  toArray(document.querySelectorAll('.copy')).forEach(initCopy);
  toArray(document.querySelectorAll('.js-form')).forEach(initForm);
  initReveal();
  initScrollSpy();
  initBackToTop();
  initContactCarousel();
  initYear();
})();
