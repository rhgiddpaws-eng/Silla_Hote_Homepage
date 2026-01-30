(function () {
  'use strict';

  const POPUP_KEY = 'shillastay_popup_closed';

  // ----- Popup -----
  function initPopup() {
    const layer = document.getElementById('popupLayer');
    const closeBtn = layer?.querySelector('.popup-close');
    const check = document.getElementById('popupCheck');

    if (!layer) return;

    const closedAt = sessionStorage.getItem(POPUP_KEY);
    if (closedAt) {
      const elapsed = Date.now() - Number(closedAt);
      if (elapsed < 24 * 60 * 60 * 1000) {
        layer.classList.add('hidden');
        return;
      }
    }

    function close() {
      layer.classList.add('hidden');
      if (check?.checked) sessionStorage.setItem(POPUP_KEY, String(Date.now()));
    }

    closeBtn?.addEventListener('click', close);
  }

  // ----- Hero slider -----
  function initHero() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dots button');
    if (!slides.length || !dots.length) return;

    let current = 0;
    let timer = null;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === current));
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(function () {
        goTo(current + 1);
      }, 5000);
    }

    function stopAuto() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    dots.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        goTo(i);
        startAuto();
      });
    });

    startAuto();
  }

  // ----- NOW filter -----
  function initNowFilter() {
    const btns = document.querySelectorAll('.filter-tabs .filter-btn');
    const cards = document.querySelectorAll('.now-card');
    if (!btns.length || !cards.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.dataset.filter;
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        cards.forEach(function (card) {
          const cat = card.dataset.cat;
          const show = filter === 'all' || cat === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ----- Mobile nav -----
  function initMobileNav() {
    const header = document.querySelector('.header');
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.nav-overlay');

    function open() {
      header?.classList.add('nav-open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      header?.classList.remove('nav-open');
      document.body.style.overflow = '';
    }

    toggle?.addEventListener('click', function () {
      if (header?.classList.contains('nav-open')) close();
      else open();
    });
    overlay?.addEventListener('click', close);
  }

  // ----- Run -----
  initPopup();
  initHero();
  initNowFilter();
  initMobileNav();
})();
