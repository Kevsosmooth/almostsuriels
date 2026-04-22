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

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -115 });
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
              lenis.scrollTo(target, { offset: -115 });
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

  // ---------------------------------------------------------------------------
  // GSAP ScrollTrigger Reveals
  // ---------------------------------------------------------------------------

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.defaults({
    scroller: window
  });

  lenis.on('scroll', ScrollTrigger.update);

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

    Object.values(groups).forEach((elements) => {
      var inView = isInViewport(elements[0]);
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
        '.hero__script, .hero__names, .hero__date, .hero__location'
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
  // RSVP Form Validation
  // ---------------------------------------------------------------------------

  const rsvpForm = document.getElementById('rsvp-form');

  if (rsvpForm) {
    const nameRegex = /^[A-Za-z\u00C0-\u024F\s'\-]{2,50}$/;
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
      }
    };

    const statusEl = document.getElementById('rsvp-status');

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

    const submitBtn = rsvpForm.querySelector('.rsvp__submit');
    const plusOneCheckbox = document.getElementById('rsvp-plus-one');
    const confirmPanel = document.getElementById('rsvp-confirm');
    const confirmSoloBtn = document.getElementById('rsvp-confirm-solo');
    const confirmBackBtn = document.getElementById('rsvp-confirm-back');
    let confirmedSolo = false;

    const step1 = document.getElementById('rsvp-step-1');
    const step2 = document.getElementById('rsvp-step-2');
    const nextBtn = document.getElementById('rsvp-next');
    const backBtn = document.getElementById('rsvp-back');
    const stepDots = rsvpForm.querySelectorAll('.rsvp__step-dot');
    const stepLine = rsvpForm.querySelector('.rsvp__step-line');
    const plusOneDietSection = document.getElementById('rsvp-plusone-diet');

    function goToStep(step) {
      step1.classList.toggle('active', step === 1);
      step2.classList.toggle('active', step === 2);
      stepDots[0].classList.toggle('active', step === 1);
      stepDots[0].classList.toggle('completed', step === 2);
      stepDots[1].classList.toggle('active', step === 2);
      stepLine.classList.toggle('completed', step === 2);

      if (step === 2) {
        plusOneDietSection.style.display = plusOneCheckbox.checked ? '' : 'none';
      }
    }

    nextBtn.addEventListener('click', function() {
      var isValid = true;
      Object.values(fields).forEach(function(field) {
        if (!validateField(field)) isValid = false;
      });
      if (!isValid) return;
      goToStep(2);
    });

    backBtn.addEventListener('click', function() {
      goToStep(1);
    });

    rsvpForm.style.minHeight = rsvpForm.offsetHeight + 'px';

    function getCheckedValues(name) {
      return Array.from(rsvpForm.querySelectorAll('input[name="' + name + '"]:checked'))
        .map(function(cb) { return cb.value; });
    }

    function collectPayload() {
      var dietSelections = getCheckedValues('diet');
      var dietOther = document.getElementById('rsvp-diet-other').value.trim();
      if (dietOther) dietSelections.push(dietOther);

      var payload = {
        firstName: fields.firstName.el.value.trim(),
        lastName: fields.lastName.el.value.trim(),
        phone: fields.phone.el.value.trim(),
        email: fields.email.el.value.trim(),
        plusOne: plusOneCheckbox.checked,
        dietary: dietSelections.join(', ')
      };

      if (plusOneCheckbox.checked) {
        var plusOneDiet = getCheckedValues('plusOneDiet');
        var plusOneDietOther = document.getElementById('rsvp-plusone-diet-other').value.trim();
        if (plusOneDietOther) plusOneDiet.push(plusOneDietOther);
        payload.plusOneDietary = plusOneDiet.join(', ');
      }

      return payload;
    }

    async function sendToSheets(payload) {
      await fetch('https://script.google.com/macros/s/AKfycbzhk4phI-qdAqEZuwDZTLU68Bya4YeNUiQmAXEZ8N3_3o8Etedb19kzHWmw_l3VlYS9MA/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
    }

    async function submitAndCelebrate() {
      var payload = collectPayload();
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      statusEl.textContent = '';
      statusEl.className = 'rsvp__status';

      try {
        await sendToSheets(payload);
        rsvpForm.reset();
        confirmedSolo = false;
        goToStep(1);
        Object.values(fields).forEach(function(field) {
          field.el.setAttribute('aria-invalid', 'false');
          field.error.textContent = '';
        });
        showCelebration();
      } catch (err) {
        statusEl.textContent = 'Network error. Please check your connection and try again.';
        statusEl.className = 'rsvp__status rsvp__status--error';
        confirmPanel.classList.remove('active');
        rsvpForm.style.display = '';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }

    rsvpForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!plusOneCheckbox.checked && !confirmedSolo) {
        rsvpForm.style.display = 'none';
        confirmPanel.classList.add('active');
        return;
      }

      submitAndCelebrate();
    });

    if (confirmSoloBtn) {
      confirmSoloBtn.addEventListener('click', function() {
        confirmedSolo = true;
        var soloOriginal = confirmSoloBtn.textContent;
        confirmSoloBtn.textContent = 'Sending...';
        confirmSoloBtn.disabled = true;
        confirmBackBtn.disabled = true;
        submitAndCelebrate().finally(function() {
          confirmSoloBtn.textContent = soloOriginal;
          confirmSoloBtn.disabled = false;
          confirmBackBtn.disabled = false;
        });
      });
    }

    if (confirmBackBtn) {
      confirmBackBtn.addEventListener('click', () => {
        confirmPanel.classList.remove('active');
        rsvpForm.style.display = '';
        goToStep(1);
        plusOneCheckbox.checked = true;
        plusOneCheckbox.focus();
      });
    }

    const celebrationPanel = document.getElementById('rsvp-celebration');
    const celebrationCloseBtn = document.getElementById('rsvp-celebration-close');

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

    function showCelebration() {
      rsvpForm.style.display = 'none';
      confirmPanel.classList.remove('active');
      statusEl.textContent = '';
      statusEl.className = 'rsvp__status';
      celebrationPanel.classList.add('active');
      fireCelebration();
    }

    function closeCelebration() {
      celebrationPanel.classList.remove('active');
      rsvpForm.style.display = '';
      if (rsvpCard.classList.contains('open')) {
        rsvpCard.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (celebrationCloseBtn) {
      celebrationCloseBtn.addEventListener('click', closeCelebration);
    }
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

  // ---------------------------------------------------------------------------
  // Story Carousel (version picker)
  // ---------------------------------------------------------------------------

  const storyCarousel = document.querySelector('.story__carousel');
  if (storyCarousel) {
    const track = storyCarousel.querySelector('.story__slides');
    const slides = storyCarousel.querySelectorAll('.story__slide');
    const dots = storyCarousel.querySelectorAll('.story__dot');
    const prevBtn = storyCarousel.querySelector('.story__arrow--prev');
    const nextBtn = storyCarousel.querySelector('.story__arrow--next');
    let current = 0;
    const total = slides.length;

    function goTo(index) {
      if (index < 0 || index >= total) return;
      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;

      slides.forEach((s, i) => {
        s.classList.toggle('story__slide--active', i === current);
      });

      dots.forEach((d, i) => {
        d.classList.toggle('story__dot--active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });

      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === total - 1;
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.dot, 10));
      });
    });

    let touchStartX = 0;
    let touchDelta = 0;
    const SWIPE_THRESHOLD = 50;

    storyCarousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchDelta = 0;
    }, { passive: true });

    storyCarousel.addEventListener('touchmove', (e) => {
      touchDelta = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    storyCarousel.addEventListener('touchend', () => {
      if (Math.abs(touchDelta) > SWIPE_THRESHOLD) {
        if (touchDelta < 0) goTo(current + 1);
        else goTo(current - 1);
      }
    });
  }

});
