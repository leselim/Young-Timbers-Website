/* =========================================================
   Young Timbers - interactions
   Every behaviour is progressive: without JS the page still
   reads correctly (panels open, nav visible, form posts).
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Accordion
     Rows start open so the services section reads as a list;
     set data-accordion-exclusive="true" for one-at-a-time.
     --------------------------------------------------------- */
  function initAccordion(root) {
    var exclusive = root.dataset.accordionExclusive === 'true';
    var toggles = Array.prototype.slice.call(root.querySelectorAll('[aria-controls]'));

    function setOpen(toggle, open) {
      var panel = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!panel) return;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) { panel.removeAttribute('data-collapsed'); }
      else { panel.setAttribute('data-collapsed', ''); }
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
     Header dropdown
     --------------------------------------------------------- */
  function initDropdown(trigger) {
    var menu = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!menu) return;
    var links = Array.prototype.slice.call(menu.querySelectorAll('a'));

    function open(focusFirst) {
      trigger.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
      if (focusFirst && links[0]) links[0].focus();
    }
    function close(refocus) {
      trigger.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      if (refocus) trigger.focus();
    }
    function isOpen() { return trigger.getAttribute('aria-expanded') === 'true'; }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      isOpen() ? close(false) : open(false);
    });

    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); open(true); }
      else if (e.key === 'Escape' && isOpen()) { e.preventDefault(); close(true); }
    });

    menu.addEventListener('keydown', function (e) {
      var i = links.indexOf(document.activeElement);
      if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'ArrowDown' && i > -1) { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      else if (e.key === 'ArrowUp' && i > -1) { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
      else if (e.key === 'Tab') { close(false); }
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () { close(false); });
    });

    document.addEventListener('click', function (e) {
      if (isOpen() && !menu.contains(e.target) && e.target !== trigger) close(false);
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
      if (open) header.setAttribute('data-nav-open', '');
      else header.removeAttribute('data-nav-open');
      if (label) label.textContent = open ? 'Close' : 'Menu';
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    /* Any in-page jump closes the panel. */
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (link) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Leaving the mobile breakpoint resets the panel. */
    var wide = window.matchMedia('(min-width: 901px)');
    var onChange = function (e) { if (e.matches) setOpen(false); };
    wide.addEventListener ? wide.addEventListener('change', onChange) : wide.addListener(onChange);
  }

  /* ---------------------------------------------------------
     Scroll reveal + current-section marking
     --------------------------------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.dropdown__link[href^="#"]'));
    var sections = links
      .map(function (l) { return document.getElementById(l.getAttribute('href').slice(1)); })
      .filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      });
      var current = sections.filter(function (s) { return visible.has(s.id); }).pop();
      links.forEach(function (l) {
        var match = current && l.getAttribute('href') === '#' + current.id;
        if (match) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(function (s) { io.observe(s); });
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
      field.style.cssText = 'position:absolute;left:-9999px';
      document.body.appendChild(field);
      field.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(field);
      return ok;
    }

    button.addEventListener('click', function () {
      var text = button.dataset.copy || '';
      var done = function (ok) {
        if (!label) return;
        label.textContent = ok ? 'Copied' : 'Copy failed';
        button.setAttribute('data-copied', '');
        clearTimeout(timer);
        timer = setTimeout(function () {
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
     Validates on submit, then re-validates a field as it is
     corrected. Posts to form.action when one is set, and
     otherwise runs in demo mode without leaving the browser.
     --------------------------------------------------------- */
  function initForm(form) {
    var status = form.querySelector('.form__status');
    var submit = form.querySelector('[type="submit"]');
    var fields = Array.prototype.slice.call(form.querySelectorAll('.field__input'));
    var validated = false;

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
      field.addEventListener('blur', function () { if (validated) check(field); });
    });

    /* Live character count on the message field. */
    var counter = form.querySelector('[data-count-for]');
    if (counter) {
      var counted = document.getElementById(counter.dataset.countFor);
      if (counted) {
        var max = counted.getAttribute('maxlength') || '600';
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

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      validated = true;

      var invalid = fields.filter(function (f) { return !check(f); });
      if (invalid.length) {
        setStatus(invalid.length === 1 ? 'One field needs attention.' : invalid.length + ' fields need attention.', 'error');
        invalid[0].focus();
        return;
      }

      var data = {};
      fields.forEach(function (f) { data[f.name] = f.value.trim(); });

      submit.disabled = true;
      setStatus('Sending…', null);

      var finish = function () {
        submit.disabled = false;
        form.reset();
        validated = false;
        if (counter && counted) counter.textContent = '0 / ' + max;
        setStatus('Thank you ' + data.name.split(' ')[0] + '. We will get back to you.', null);
      };
      var fail = function () {
        submit.disabled = false;
        setStatus('Something went wrong. Please email info@youngtimbers.co.za instead.', 'error');
      };

      if (form.getAttribute('action')) {
        var params = new URLSearchParams();
        for (var key in data) {
          params.append(key, data[key]);
        }
        fetch(form.getAttribute('action'), {
          method: 'POST',
          mode: 'no-cors',
          body: params
        }).then(function () {
          finish();
        }).catch(function () {
          finish();
        });
      } else {
        /* Demo mode: nothing is transmitted anywhere. */
        setTimeout(finish, 700);
      }
    });
  }

  /* ---------------------------------------------------------
     Back to top smooth scroll
     --------------------------------------------------------- */
  function initBackToTop() {
    var topLinks = document.querySelectorAll('a[href="#top"], .js-back-to-top');
    topLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, '#top');
        }
      });
    });
  }

  /* ---------------------------------------------------------
     Mobile Contact Carousel
     --------------------------------------------------------- */
  function initContactCarousel() {
    var carousel = document.getElementById('contact-carousel');
    var formSlide = document.getElementById('contact-slide-form');
    if (!carousel || !formSlide) return;

    /* Jump to form slide if user clicks any "Start a Project" or "#contact" button on mobile */
    document.querySelectorAll('a[href="#contact"]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 560) {
          setTimeout(function () {
            carousel.scrollTo({
              left: formSlide.offsetLeft - carousel.offsetLeft,
              behavior: reduceMotion ? 'auto' : 'smooth'
            });
          }, 150);
        }
      });
    });
  }

  /* --------------------------------------------------------- */
  document.querySelectorAll('.js-accordion').forEach(initAccordion);
  document.querySelectorAll('.nav__trigger').forEach(initDropdown);
  document.querySelectorAll('.nav-toggle').forEach(initNavToggle);
  document.querySelectorAll('.copy').forEach(initCopy);
  document.querySelectorAll('.js-form').forEach(initForm);
  initReveal();
  initScrollSpy();
  initBackToTop();
  initContactCarousel();
})();
