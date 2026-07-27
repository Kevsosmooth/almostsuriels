// Refreshes always start at the top: scrollRestoration is set to 'manual' by
// an inline <head> script (before the browser's restore decision); these are
// the belt-and-braces for engines that restore late anyway. Back/forward
// cache returns (persisted) keep their spot -- only real (re)loads reset.
window.scrollTo(0, 0);
window.addEventListener('pageshow', (e) => {
  if (!e.persisted) window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  if (typeof gsap === 'undefined' || typeof Lenis === 'undefined') {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.visibility = 'visible';
    });
    return;
  }

  document.documentElement.classList.add('js-enabled');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------------------
  // Lenis Smooth Scroll
  // ---------------------------------------------------------------------------

  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const rootStyles = getComputedStyle(document.documentElement);
  const navHeight = parseInt(rootStyles.getPropertyValue('--nav-height'), 10) || 0;
  const announcementHeight = parseInt(rootStyles.getPropertyValue('--announcement-banner-height'), 10) || 0;
  const scrollOffset = -(navHeight + announcementHeight + 10);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: scrollOffset });
    });
  });

  // ---------------------------------------------------------------------------
  // Navbar
  // ---------------------------------------------------------------------------

  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  const backdrop = document.getElementById('mobile-backdrop');

  function closeDrawer() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
    lenis.start();
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      if (backdrop) backdrop.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      if (isOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        closeDrawer();
        if (targetId && targetId !== '#') {
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            setTimeout(() => {
              lenis.scrollTo(target, { offset: scrollOffset });
            }, 350);
          }
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Countdown Timer
  // ---------------------------------------------------------------------------

  const weddingDate = new Date('2026-10-04T16:00:00-04:00');

  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const rsvpDeadlineEl = document.getElementById('rsvp-deadline');
  const rsvpDeadline = new Date('2026-08-24T23:59:59-04:00');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now = new Date();
    let diff = weddingDate - now;

    if (diff <= 0) {
      diff = 0;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (cdDays) cdDays.textContent = days;
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMinutes) cdMinutes.textContent = pad(minutes);
    if (cdSeconds) cdSeconds.textContent = pad(seconds);
  }

  if (cdDays && cdHours && cdMinutes && cdSeconds) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  function pluralize(value, singular) {
    return `${value} ${singular}${value === 1 ? '' : 's'}`;
  }

  function updateRsvpDeadlineCountdown() {
    if (!rsvpDeadlineEl) return;

    const now = new Date();
    let diff = rsvpDeadline - now;

    if (isNaN(rsvpDeadline.getTime())) {
      rsvpDeadlineEl.textContent = 'RSVP deadline: August 24, 2026.';
      rsvpDeadlineEl.setAttribute('data-state', 'closed');
      return;
    }

    if (diff <= 0) {
      diff = 0;
      rsvpDeadlineEl.textContent = 'RSVP deadline has passed. Please contact us directly if needed.';
      rsvpDeadlineEl.setAttribute('data-state', 'closed');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const timeChunks = [];
    if (days) timeChunks.push(pluralize(days, 'day'));
    if (hours || timeChunks.length) timeChunks.push(pluralize(hours, 'hour'));
    if (minutes || timeChunks.length) timeChunks.push(pluralize(minutes, 'minute'));
    timeChunks.push(pluralize(seconds, 'second'));

    rsvpDeadlineEl.textContent = `RSVP closes in ${timeChunks.join(', ')} (deadline: August 24, 2026).`;
    rsvpDeadlineEl.setAttribute('data-state', 'active');
  }

  if (rsvpDeadlineEl) {
    updateRsvpDeadlineCountdown();
    setInterval(updateRsvpDeadlineCountdown, 1000);
  }

  // ---------------------------------------------------------------------------
  // GSAP ScrollTrigger Reveals
  // ---------------------------------------------------------------------------

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.defaults({
    scroller: window
  });

  lenis.on('scroll', ScrollTrigger.update);

  // The Zola registry widget (and any late embed) resizes the page after
  // ScrollTrigger has measured, leaving every trigger below it stale.
  // Re-measure whenever the document height changes.
  if ('ResizeObserver' in window) {
    let lastBodyHeight = document.body.scrollHeight;
    let refreshTimer = null;

    new ResizeObserver(() => {
      if (document.body.scrollHeight === lastBodyHeight) return;
      lastBodyHeight = document.body.scrollHeight;
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    }).observe(document.body);
  }

  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealElements.forEach((el) => {
      el.style.visibility = 'visible';
    });
  } else {
    var viewportH = window.innerHeight;

    function isInViewport(el) {
      var rect = el.getBoundingClientRect();
      return rect.top < viewportH && rect.bottom > 0;
    }

    const groups = {};

    revealElements.forEach((el) => {
      const group = el.dataset.revealGroup;

      if (group) {
        if (!groups[group]) groups[group] = [];
        groups[group].push(el);
      } else {
        var inView = isInViewport(el);
        gsap.fromTo(el,
          { y: inView ? 0 : 40, opacity: 0, visibility: 'hidden' },
          {
            y: 0,
            opacity: 1,
            visibility: 'visible',
            duration: inView ? 0.3 : 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    Object.keys(groups).forEach((name) => {
      var elements = groups[name];
      var inView = isInViewport(elements[0]);

      // The wedding-party crew doesn't fade in -- they bounce onto the dance
      // floor: springy pop with an alternating tilt, one after another.
      var isPartyCrew = name.indexOf('party') === 0;

      if (isPartyCrew && !inView) {
        gsap.fromTo(elements,
          {
            y: 70,
            scale: 0.4,
            rotation: (i) => (i % 2 ? 8 : -8),
            opacity: 0,
            visibility: 'hidden'
          },
          {
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            visibility: 'visible',
            duration: 0.9,
            ease: 'back.out(1.9)',
            stagger: 0.14,
            scrollTrigger: {
              trigger: elements[0],
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          }
        );
        return;
      }

      gsap.fromTo(elements,
        { y: inView ? 0 : 40, opacity: 0, visibility: 'hidden' },
        {
          y: 0,
          opacity: 1,
          visibility: 'visible',
          duration: inView ? 0.3 : 0.8,
          ease: 'power3.out',
          stagger: inView ? 0.03 : 0.1,
          scrollTrigger: {
            trigger: elements[0],
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  // ---------------------------------------------------------------------------
  // Wedding Party: confetti welcome
  // ---------------------------------------------------------------------------

  const partySection = document.querySelector('.party');

  if (partySection && !prefersReducedMotion && typeof confetti !== 'undefined') {
    const rootStyle = getComputedStyle(document.documentElement);
    const confettiColors = ['--signal', '--signal-light', '--accent-soft', '--canvas']
      .map((token) => rootStyle.getPropertyValue(token).trim())
      .filter(Boolean);

    ScrollTrigger.create({
      trigger: partySection,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        // Two party poppers, one from each side of the screen
        confetti({
          particleCount: 70,
          angle: 60,
          spread: 60,
          origin: { x: 0.05, y: 0.6 },
          colors: confettiColors,
          disableForReducedMotion: true
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 60,
          origin: { x: 0.95, y: 0.6 },
          colors: confettiColors,
          disableForReducedMotion: true
        });
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Hero Entrance Animation
  // ---------------------------------------------------------------------------

  if (!prefersReducedMotion) {
    const heroCard = document.querySelector('.hero__card');

    if (heroCard) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(heroCard, {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        delay: 0.2
      });

      const heroChildren = heroCard.querySelectorAll(
        '.hero__script, .hero__names, .hero__date-container, .hero__location'
      );

      if (heroChildren.length) {
        tl.from(heroChildren, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.15
        }, '-=0.4');
      }
    }
  }

  // ---------------------------------------------------------------------------
  // FAQ Accordion
  // ---------------------------------------------------------------------------

  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherQuestion = other.querySelector('.faq__question');
          const otherAnswer = other.querySelector('.faq__answer');
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        }
      });

      if (isActive) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Slide Carousel Helper (venue + hotel)
  // ---------------------------------------------------------------------------

  function initSlideCarousel(container, slideSelector) {
    if (!container) return;

    const slides = container.querySelectorAll(slideSelector);
    const leftBtn = container.querySelector('.details__arrow--left');
    const rightBtn = container.querySelector('.details__arrow--right');
    let current = 0;

    function goTo(index) {
      slides[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
    }

    if (leftBtn) leftBtn.addEventListener('click', () => goTo(current - 1));
    if (rightBtn) rightBtn.addEventListener('click', () => goTo(current + 1));
  }

  initSlideCarousel(
    document.querySelector('.details__venue-carousel'),
    '.details__venue-slide'
  );

  initSlideCarousel(
    document.querySelector('.details__hotel-carousel'),
    '.details__hotel-slide'
  );

  // ---------------------------------------------------------------------------
  // Gallery Carousel
  // ---------------------------------------------------------------------------

  const galleryTrack = document.querySelector('.gallery__track');
  const arrowLeft = document.querySelector('.gallery__arrow--left');
  const arrowRight = document.querySelector('.gallery__arrow--right');

  if (galleryTrack && arrowLeft && arrowRight) {
    const origItems = Array.from(galleryTrack.querySelectorAll('.gallery__item'));

    origItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      galleryTrack.appendChild(clone);
    });

    const scrollAmount = () => {
      const item = galleryTrack.querySelector('.gallery__item');
      if (!item) return 300;
      return item.offsetWidth + (parseInt(getComputedStyle(galleryTrack).gap) || 16);
    };

    const origWidth = () => scrollAmount() * origItems.length;

    let isResetting = false;

    galleryTrack.addEventListener('scrollend', () => {
      if (isResetting) return;
      isResetting = true;
      if (galleryTrack.scrollLeft >= origWidth()) {
        galleryTrack.style.scrollBehavior = 'auto';
        galleryTrack.scrollLeft = galleryTrack.scrollLeft - origWidth();
        galleryTrack.style.scrollBehavior = '';
      } else if (galleryTrack.scrollLeft <= 0) {
        galleryTrack.style.scrollBehavior = 'auto';
        galleryTrack.scrollLeft = galleryTrack.scrollLeft + origWidth();
        galleryTrack.style.scrollBehavior = '';
      }
      isResetting = false;
    });

    arrowLeft.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    arrowRight.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
  }

  // ---------------------------------------------------------------------------
  // RSVP Mobile Toggle
  // ---------------------------------------------------------------------------

  const rsvpTrigger = document.getElementById('rsvp-trigger');
  const rsvpCard = document.querySelector('.rsvp__card');
  const rsvpClose = document.getElementById('rsvp-close');

  if (rsvpTrigger && rsvpCard && rsvpClose) {
    rsvpTrigger.addEventListener('click', () => {
      rsvpCard.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    rsvpClose.addEventListener('click', (e) => {
      e.stopPropagation();
      rsvpCard.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // ---------------------------------------------------------------------------
  // RSVP Wizard
  // ---------------------------------------------------------------------------

  const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzhk4phI-qdAqEZuwDZTLU68Bya4YeNUiQmAXEZ8N3_3o8Etedb19kzHWmw_l3VlYS9MA/exec';

  const rsvpForm = document.getElementById('rsvp-form');

  if (rsvpForm) {
    // Dinner plates -- add a new object here and both pickers pick it up.
    const PLATES = [
      {
        value: 'Red Snapper Escoveitch',
        desc: 'Served with coconut rice and sautéed green beans with garlic and butter.',
        vegan: false
      },
      {
        value: 'Grilled Churrasco',
        desc: 'Topped with chimichurri, served with moro rice and sweet maduros.',
        vegan: false
      },
      {
        value: 'Vegan Lasagna',
        desc: 'Grilled vegetables, cauliflower and mushrooms layered with tomato sauce and vegan cheese.',
        vegan: true
      },
      {
        value: 'Zucchini Pasta',
        desc: 'Zucchini noodles in tomato sauce, served with vegan meatballs.',
        vegan: true
      }
    ];

    function renderPlates(container, radioName) {
      PLATES.forEach(function(plate) {
        const label = document.createElement('label');
        label.className = 'rsvp__plate';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = radioName;
        input.value = plate.value;

        const card = document.createElement('span');
        card.className = 'rsvp__plate-card';

        const head = document.createElement('span');
        head.className = 'rsvp__plate-head';

        const name = document.createElement('span');
        name.className = 'rsvp__plate-name';
        name.textContent = plate.value;
        head.appendChild(name);

        if (plate.vegan) {
          const tag = document.createElement('span');
          tag.className = 'rsvp__plate-tag';
          tag.textContent = 'Vegan';
          head.appendChild(tag);
        }

        const desc = document.createElement('span');
        desc.className = 'rsvp__plate-desc';
        desc.textContent = plate.desc;

        card.appendChild(head);
        card.appendChild(desc);
        label.appendChild(input);
        label.appendChild(card);
        container.appendChild(label);
      });
    }

    renderPlates(document.getElementById('rsvp-plates-guest'), 'entree');
    renderPlates(document.getElementById('rsvp-plates-plusone'), 'plusOneEntree');

    // --- Field validation (same rules as the old form) ---

    const nameRegex = /^[A-Za-zÀ-ɏ\s'\-]{2,50}$/;
    const phoneFormatted = /^\(\d{3}\) \d{3}-\d{4}$/;
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9\-]+(\.[a-zA-Z]{2,})+$/;

    function formatPhone(raw) {
      const digits = raw.replace(/\D/g, '').slice(0, 10);
      if (digits.length <= 3) return digits.length ? '(' + digits : '';
      if (digits.length <= 6) return '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
      return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
    }

    const phoneInput = document.getElementById('rsvp-phone');
    phoneInput.addEventListener('input', () => {
      const cursor = phoneInput.selectionStart;
      const before = phoneInput.value.length;
      phoneInput.value = formatPhone(phoneInput.value);
      const after = phoneInput.value.length;
      const newCursor = cursor + (after - before);
      phoneInput.setSelectionRange(newCursor, newCursor);
    });

    const fields = {
      firstName: {
        el: document.getElementById('rsvp-first-name'),
        error: document.getElementById('rsvp-first-name-error'),
        validate(val) {
          if (!val.trim()) return 'First name is required';
          if (!nameRegex.test(val.trim())) return 'Please enter a valid first name';
          return '';
        }
      },
      lastName: {
        el: document.getElementById('rsvp-last-name'),
        error: document.getElementById('rsvp-last-name-error'),
        validate(val) {
          if (!val.trim()) return 'Last name is required';
          if (!nameRegex.test(val.trim())) return 'Please enter a valid last name';
          return '';
        }
      },
      phone: {
        el: phoneInput,
        error: document.getElementById('rsvp-phone-error'),
        validate(val) {
          if (!val.trim()) return 'Phone number is required';
          if (!phoneFormatted.test(val.trim())) return 'Enter a 10-digit phone: (555) 123-4567';
          return '';
        }
      },
      email: {
        el: document.getElementById('rsvp-email'),
        error: document.getElementById('rsvp-email-error'),
        validate(val) {
          if (!val.trim()) return '';
          if (!emailRegex.test(val.trim())) return 'Enter a valid email (e.g. name@example.com)';
          return '';
        }
      },
      plusOneName: {
        el: document.getElementById('rsvp-plusone-name'),
        error: document.getElementById('rsvp-plusone-name-error'),
        validate(val) {
          if (!val.trim()) return "Your plus one's name is required";
          if (!nameRegex.test(val.trim())) return 'Please enter a valid name';
          return '';
        }
      }
    };

    function validateField(field) {
      const msg = field.validate(field.el.value);
      field.error.textContent = msg;
      field.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }

    Object.values(fields).forEach((field) => {
      field.el.addEventListener('blur', () => validateField(field));
      field.el.addEventListener('input', () => {
        if (field.el.getAttribute('aria-invalid') === 'true') {
          validateField(field);
        }
      });
    });

    // --- Wizard state and navigation ---

    const screens = Array.from(rsvpForm.querySelectorAll('.rsvp__screen'));
    const progressBar = document.getElementById('rsvp-progress');
    const progressFill = document.getElementById('rsvp-progress-fill');
    const progressLabel = document.getElementById('rsvp-progress-label');
    const backBtn = document.getElementById('rsvp-back');
    const statusEl = document.getElementById('rsvp-status');
    const plusOneDietSection = document.getElementById('rsvp-plusone-diet');

    const state = { attending: null, plusOne: null, roomBlock: null };

    function screenVisible(name) {
      if (name === 'decline-note') return state.attending === false;
      if (name === 'attending' || name === 'name') return true;
      if (state.attending === false) return false;
      if (name === 'plusone-name' || name === 'plusone-entree') return state.plusOne === true;
      return true;
    }

    function visibleScreens() {
      return screens.filter((s) => screenVisible(s.dataset.screen));
    }

    function currentScreen() {
      return screens.find((s) => s.classList.contains('active'));
    }

    const rsvpBody = document.querySelector('.rsvp__body');

    function showScreen(el, skipFocus) {
      screens.forEach((s) => s.classList.toggle('active', s === el));

      // "We hope you can join us!" reads wrong once someone says they can't.
      if (rsvpBody) rsvpBody.style.display = state.attending === false ? 'none' : '';

      const vis = visibleScreens();
      const pos = vis.indexOf(el) + 1;
      progressFill.style.width = ((pos / vis.length) * 100) + '%';
      progressLabel.textContent = pos + ' of ' + vis.length;
      progressBar.setAttribute('aria-valuemax', String(vis.length));
      progressBar.setAttribute('aria-valuenow', String(pos));
      backBtn.hidden = pos <= 1;

      if (el.dataset.screen === 'review') buildReview();

      // Only autofocus screens whose main job is typing -- focusing the
      // dietary "other" field would pop the phone keyboard uninvited.
      const TYPING_SCREENS = ['name', 'contact', 'plusone-name'];
      if (!skipFocus && TYPING_SCREENS.indexOf(el.dataset.screen) !== -1) {
        const firstInput = el.querySelector('.rsvp__input');
        if (firstInput) firstInput.focus({ preventScroll: true });
      }
    }

    function go(dir) {
      const vis = visibleScreens();
      const next = vis[vis.indexOf(currentScreen()) + dir];
      if (next) showScreen(next);
    }

    function selectedRadio(name) {
      const checked = rsvpForm.querySelector('input[name="' + name + '"]:checked');
      return checked ? checked.value : '';
    }

    function screenError(id, msg) {
      const el = document.getElementById(id);
      if (el) el.textContent = msg;
    }

    function validateScreen(el) {
      switch (el.dataset.screen) {
        case 'attending':
          if (state.attending === null) {
            screenError('rsvp-attending-error', 'Please pick one to continue');
            return false;
          }
          return true;
        case 'name': {
          const a = validateField(fields.firstName);
          const b = validateField(fields.lastName);
          return a && b;
        }
        case 'contact': {
          const a = validateField(fields.phone);
          const b = validateField(fields.email);
          return a && b;
        }
        case 'plusone-name':
          return validateField(fields.plusOneName);
        case 'plusone':
          if (state.plusOne === null) {
            screenError('rsvp-plusone-error', 'Please pick one to continue');
            return false;
          }
          return true;
        case 'entree':
          if (!selectedRadio('entree')) {
            screenError('rsvp-entree-error', 'Please choose a plate to continue');
            return false;
          }
          return true;
        case 'plusone-entree':
          if (!selectedRadio('plusOneEntree')) {
            screenError('rsvp-plusone-entree-error', 'Please choose their plate to continue');
            return false;
          }
          return true;
        case 'roomblock':
          if (state.roomBlock === null) {
            screenError('rsvp-roomblock-error', 'Please pick one to continue');
            return false;
          }
          return true;
        default:
          return true;
      }
    }

    rsvpForm.querySelectorAll('[data-next]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const screen = currentScreen();
        if (validateScreen(screen)) go(1);
      });
    });

    showScreen(screens[0], true);

    backBtn.addEventListener('click', () => go(-1));

    // Enter inside a text input advances instead of submitting early
    rsvpForm.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.target.tagName !== 'INPUT') return;
      const screen = currentScreen();
      if (screen.dataset.screen === 'review') return;
      e.preventDefault();
      const nextBtn = screen.querySelector('[data-next]');
      if (nextBtn) nextBtn.click();
      else if (validateScreen(screen)) go(1);
    });

    // Big choice buttons (plus one / room block): select, then auto-advance
    rsvpForm.querySelectorAll('.rsvp__choice').forEach((btn) => {
      btn.addEventListener('click', () => {
        const group = btn.dataset.choiceGroup;
        state[group] = btn.dataset.choice === 'yes';

        rsvpForm.querySelectorAll('[data-choice-group="' + group + '"]').forEach((b) => {
          b.classList.toggle('selected', b === btn);
        });

        screenError('rsvp-' + group.toLowerCase() + '-error', '');
        if (group === 'plusOne') {
          plusOneDietSection.style.display = state.plusOne ? '' : 'none';
        }

        setTimeout(() => go(1), 250);
      });
    });

    // Plate cards auto-advance on selection
    rsvpForm.addEventListener('change', (e) => {
      if (e.target.name === 'entree') {
        screenError('rsvp-entree-error', '');
        setTimeout(() => go(1), 250);
      } else if (e.target.name === 'plusOneEntree') {
        screenError('rsvp-plusone-entree-error', '');
        setTimeout(() => go(1), 250);
      }
    });

    // --- Review screen ---

    function buildReview() {
      const review = document.getElementById('rsvp-review');
      review.textContent = '';

      const plusOneName = fields.plusOneName.el.value.trim();
      const rows = [
        ['Name', fields.firstName.el.value.trim() + ' ' + fields.lastName.el.value.trim()],
        ['Plus one', state.plusOne ? plusOneName : 'Just me'],
        ['Your plate', selectedRadio('entree')]
      ];
      if (state.plusOne) {
        rows.push([plusOneName ? plusOneName + "'s plate" : 'Their plate', selectedRadio('plusOneEntree')]);
      }
      rows.push(['Hilton room block', state.roomBlock ? 'Yes, at the group rate' : 'No thanks']);

      rows.forEach(function(row) {
        const wrap = document.createElement('div');
        wrap.className = 'rsvp__review-row';
        const dt = document.createElement('dt');
        dt.textContent = row[0];
        const dd = document.createElement('dd');
        dd.textContent = row[1];
        wrap.appendChild(dt);
        wrap.appendChild(dd);
        review.appendChild(wrap);
      });
    }

    // --- Payload and submit ---

    function getCheckedValues(name) {
      return Array.from(rsvpForm.querySelectorAll('input[name="' + name + '"]:checked'))
        .map(function(cb) { return cb.value; });
    }

    function collectPayload() {
      var dietSelections = getCheckedValues('diet');
      var dietOther = document.getElementById('rsvp-diet-other').value.trim();
      if (dietOther) dietSelections.push(dietOther);

      var payload = {
        attending: true,
        firstName: fields.firstName.el.value.trim(),
        lastName: fields.lastName.el.value.trim(),
        phone: fields.phone.el.value.trim(),
        email: fields.email.el.value.trim(),
        plusOne: state.plusOne === true,
        entree: selectedRadio('entree'),
        dietary: dietSelections.join(', '),
        roomBlock: state.roomBlock === true
      };

      if (state.plusOne) {
        payload.plusOneName = fields.plusOneName.el.value.trim();
        payload.plusOneEntree = selectedRadio('plusOneEntree');
        var plusOneDiet = getCheckedValues('plusOneDiet');
        var plusOneDietOther = document.getElementById('rsvp-plusone-diet-other').value.trim();
        if (plusOneDietOther) plusOneDiet.push(plusOneDietOther);
        payload.plusOneDietary = plusOneDiet.join(', ');
      }

      return payload;
    }

    function collectDeclinePayload() {
      return {
        attending: false,
        firstName: fields.firstName.el.value.trim(),
        lastName: fields.lastName.el.value.trim(),
        note: document.getElementById('rsvp-decline-note').value.trim()
      };
    }

    async function sendToSheets(payload) {
      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
    }

    function resetWizard() {
      rsvpForm.reset();
      state.attending = null;
      state.plusOne = null;
      state.roomBlock = null;
      plusOneDietSection.style.display = 'none';
      rsvpForm.querySelectorAll('.rsvp__choice.selected').forEach(function(b) {
        b.classList.remove('selected');
      });
      Object.values(fields).forEach(function(field) {
        field.el.setAttribute('aria-invalid', 'false');
        field.error.textContent = '';
      });
      showScreen(screens[0], true);
    }

    const declineStatusEl = document.getElementById('rsvp-decline-status');

    rsvpForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      var screen = currentScreen();
      var screenName = screen.dataset.screen;
      if (screenName !== 'review' && screenName !== 'decline-note') return;

      var declining = screenName === 'decline-note';
      var submitBtn = screen.querySelector('.rsvp__submit');
      var status = declining ? declineStatusEl : statusEl;

      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      status.textContent = '';
      status.className = 'rsvp__status';

      try {
        var payload = declining ? collectDeclinePayload() : collectPayload();
        await sendToSheets(payload);
        resetWizard();
        if (declining) showDecline();
        else showCelebration(payload.roomBlock);
      } catch (err) {
        status.textContent = 'Network error. Please check your connection and try again.';
        status.className = 'rsvp__status rsvp__status--error';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });

    // --- Celebration ---

    const celebrationPanel = document.getElementById('rsvp-celebration');
    const celebrationCloseBtn = document.getElementById('rsvp-celebration-close');
    const declinePanel = document.getElementById('rsvp-decline-panel');
    const declineCloseBtn = document.getElementById('rsvp-decline-close');

    function fireCelebration() {
      if (typeof confetti !== 'function') return;
      var confettiOpts = { zIndex: 300 };
      var duration = 3000;
      var end = Date.now() + duration;

      (function frame() {
        confetti(Object.assign({}, confettiOpts, {
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#9B1B30', '#B52540', '#E8D5D0', '#FFF8F0', '#FFD700']
        }));
        confetti(Object.assign({}, confettiOpts, {
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#9B1B30', '#B52540', '#E8D5D0', '#FFF8F0', '#FFD700']
        }));
        if (Date.now() < end) requestAnimationFrame(frame);
      })();

      setTimeout(function() {
        confetti(Object.assign({}, confettiOpts, {
          particleCount: 80,
          spread: 100,
          origin: { x: 0.5, y: 0.4 },
          colors: ['#9B1B30', '#B52540', '#E8D5D0', '#FFF8F0', '#FFD700']
        }));
      }, 600);
    }

    function showCelebration(wantsRoom) {
      var roomSection = document.getElementById('rsvp-celebration-room');
      if (roomSection) roomSection.hidden = !wantsRoom;
      rsvpForm.style.display = 'none';
      celebrationPanel.classList.add('active');
      fireCelebration();
    }

    function showDecline() {
      rsvpForm.style.display = 'none';
      declinePanel.classList.add('active');
    }

    function closeCelebration() {
      celebrationPanel.classList.remove('active');
      if (declinePanel) declinePanel.classList.remove('active');
      rsvpForm.style.display = '';
      if (rsvpCard.classList.contains('open')) {
        rsvpCard.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (celebrationCloseBtn) {
      celebrationCloseBtn.addEventListener('click', closeCelebration);
    }
    if (declineCloseBtn) {
      declineCloseBtn.addEventListener('click', closeCelebration);
    }
  }

  // ---------------------------------------------------------------------------
  // Hilton room block: live rooms-remaining counter
  // ---------------------------------------------------------------------------

  const roomsRemainingEl = document.querySelector('[data-rooms-remaining]');
  if (roomsRemainingEl) {
    fetch(SHEETS_URL)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && typeof data.roomsRemaining === 'number') {
          roomsRemainingEl.textContent = String(Math.max(0, data.roomsRemaining));
        }
      })
      .catch(function() { /* script not redeployed yet or offline -- keep static count */ });
  }

  // Calendar dropdown toggle
  document.querySelectorAll('.calendar-dropdown__toggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = btn.closest('.calendar-dropdown');
      const isOpen = dropdown.hasAttribute('data-open');
      document.querySelectorAll('.calendar-dropdown[data-open]').forEach((d) => {
        d.removeAttribute('data-open');
        d.querySelector('.calendar-dropdown__toggle').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        dropdown.setAttribute('data-open', '');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.calendar-dropdown[data-open]').forEach((d) => {
      d.removeAttribute('data-open');
      d.querySelector('.calendar-dropdown__toggle').setAttribute('aria-expanded', 'false');
    });
  });

});

// -----------------------------------------------------------------------------
// Background Music + beat-driven party pulse
// Independent of the GSAP/Lenis block above so music works even if a CDN fails.
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const music = document.getElementById('site-music');
  const toggle = document.getElementById('music-toggle');

  if (!music || !toggle) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Phones: skip the WebAudio analyser. Routing the <audio> element through
  // an AudioContext crackles on iOS, and the per-frame --beat style writes
  // make scrolling stutter. The party photos keep their CSS heartbeat.
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const MUTED_KEY = 'wedding-music-muted';
  let userMuted = false;

  try {
    userMuted = localStorage.getItem(MUTED_KEY) === '1';
  } catch (e) { /* private mode: default to unmuted */ }

  let audioCtx = null;
  let analyser = null;
  let freqData = null;
  let beatLevel = 0;
  let rafId = null;

  function setToggleState(playing) {
    toggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    toggle.setAttribute('aria-label', playing ? 'Mute music' : 'Play music');
  }

  // Routes the <audio> element through an analyser so the wedding-party
  // photos can pulse to the actual bass of the track.
  function setupAnalyser() {
    if (audioCtx || reducedMotion || coarsePointer) return;
    if (!window.AudioContext && !window.webkitAudioContext) return;

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(music);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      freqData = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) {
      audioCtx = null;
      analyser = null;
    }
  }

  function beatLoop() {
    if (music.paused || !analyser) {
      rafId = null;
      document.documentElement.style.setProperty('--beat', '0');
      return;
    }

    analyser.getByteFrequencyData(freqData);

    // Average the low bins (bass/kick range), then normalize past a floor so
    // only the beats -- not the constant rumble -- move the photos.
    let sum = 0;
    const bins = 10;
    for (let i = 1; i <= bins; i++) sum += freqData[i];
    const bass = sum / (bins * 255);
    const target = Math.min(1, Math.max(0, (bass - 0.55) / 0.4));

    // Fast attack, slow release: snaps up on the kick, eases back down.
    beatLevel = target > beatLevel ? target : beatLevel * 0.9;
    document.documentElement.style.setProperty('--beat', beatLevel.toFixed(3));

    rafId = requestAnimationFrame(beatLoop);
  }

  function startBeat() {
    if (!analyser || reducedMotion) return;
    document.body.classList.add('music-playing');
    if (!rafId) rafId = requestAnimationFrame(beatLoop);
  }

  function stopBeat() {
    document.body.classList.remove('music-playing');
    document.documentElement.style.setProperty('--beat', '0');
  }

  function tryPlay() {
    if (userMuted) return Promise.resolve(false);

    setupAnalyser();
    if (audioCtx && audioCtx.state === 'suspended') {
      // Fire-and-forget: without a user gesture resume() stays pending
      // forever in Chrome, and awaiting it would hang this whole chain.
      audioCtx.resume().catch(() => {});
    }

    return music.play().then(() => {
      setToggleState(true);
      startBeat();
      return true;
    }).catch(() => {
      // Autoplay blocked: stay quiet, the bouncing toggle invites the tap.
      setToggleState(false);
      return false;
    });
  }

  // No overlay, no tap-anywhere hijack: try autoplay once (usually blocked),
  // and if the song isn't running, bounce the toggle until the visitor uses it.
  // Runs even for returning visitors who muted before: the whole point of the
  // attract state (bounce + arrow) is making the toggle findable while silent.
  function setAttract(on) {
    toggle.classList.toggle('music-toggle--attract', on);
  }

  tryPlay().then((started) => {
    if (!started) setAttract(true);
  });

  toggle.addEventListener('click', () => {
    setAttract(false);
    if (music.paused) {
      userMuted = false;
      try { localStorage.setItem(MUTED_KEY, '0'); } catch (e) { /* ignore */ }
      tryPlay();
    } else {
      userMuted = true;
      try { localStorage.setItem(MUTED_KEY, '1'); } catch (e) { /* ignore */ }
      music.pause();
      setToggleState(false);
      stopBeat();
    }
  });

  music.addEventListener('pause', stopBeat);
  music.addEventListener('play', () => {
    setAttract(false);
    setToggleState(true);
    startBeat();
  });
});
