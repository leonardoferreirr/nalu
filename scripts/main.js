(function () {
  'use strict';

  var isTouch = window.matchMedia('(pointer: coarse)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= LOADER ================= */
  var loader = document.getElementById('loader');
  function heroIn() {
    loader.classList.add('is-done');
    document.body.classList.add('is-loaded');
  }
  var heroImg = document.querySelector('.hero__bowl');
  if (heroImg && heroImg.complete) setTimeout(heroIn, 220);
  else if (heroImg) {
    heroImg.addEventListener('load', function () { setTimeout(heroIn, 120); });
    heroImg.addEventListener('error', heroIn);
  }
  setTimeout(heroIn, 1600);

  /* ================= DADOS DAS ONDAS ================= */
  var ING = 'assets/ingredients/';
  var WAVES = [
    {
      name: 'WAIKIKI', bg: '#FF6A00', light: false, price: 'R$ 54',
      ingredients: 'Arroz japonês, mix de folhas, sunomono, cenoura, cream cheese, chips de batata-doce, chips de mandioca, salmão com cream cheese, shimeji, amêndoa laminada, cebola roxa, gengibre e gergelim.',
      orbit: [
        { img: 'salmon', x: '2%', y: '10%', s: 1, r: '-14deg', hx: '-14px', hy: '-10px' },
        { img: 'cucumber', x: '82%', y: '6%', s: .7, r: '10deg', hx: '12px', hy: '-8px' },
        { img: 'onion', x: '88%', y: '62%', s: .75, r: '-6deg', hx: '14px', hy: '8px' },
        { img: 'shimeji', x: '-4%', y: '64%', s: .8, r: '12deg', hx: '-12px', hy: '10px' },
        { img: 'chips', x: '40%', y: '-8%', s: .65, r: '20deg', hx: '0px', hy: '-14px' }
      ]
    },
    {
      name: 'MAUI', bg: '#FFC400', light: true, price: 'R$ 53',
      ingredients: 'Espaguete de pupunha, mix de folhas, tomate cereja, manga, abacate, chips de batata-doce, salmão com cream cheese, castanha-de-caju, cebola roxa, cebolinha e gergelim.',
      orbit: [
        { img: 'mango', x: '0%', y: '14%', s: .95, r: '10deg', hx: '-14px', hy: '-8px' },
        { img: 'avocado', x: '84%', y: '10%', s: .85, r: '-12deg', hx: '12px', hy: '-10px' },
        { img: 'salmon', x: '86%', y: '66%', s: .8, r: '8deg', hx: '14px', hy: '10px' },
        { img: 'tomato', x: '0%', y: '70%', s: .6, r: '-16deg', hx: '-12px', hy: '10px' }
      ]
    },
    {
      name: 'OAHU', bg: '#00B8D9', light: false, price: 'R$ 49',
      ingredients: 'Quinoa, mix de folhas, edamame, tomate cereja, cenoura, chips de batata-doce, couve crispy, frango lemon pepper, amendoim, cebola roxa, cebolinha e gergelim.',
      orbit: [
        { img: 'chicken', x: '2%', y: '12%', s: .9, r: '-10deg', hx: '-14px', hy: '-8px' },
        { img: 'edamame', x: '84%', y: '8%', s: .75, r: '14deg', hx: '12px', hy: '-10px' },
        { img: 'tomato', x: '88%', y: '64%', s: .62, r: '-8deg', hx: '14px', hy: '8px' },
        { img: 'chips', x: '-2%', y: '66%', s: .7, r: '10deg', hx: '-12px', hy: '10px' }
      ]
    },
    {
      name: 'KONA', bg: '#00D6A3', light: false, price: 'R$ 52',
      ingredients: 'Espaguete de abobrinha, mix de folhas, abacate, tomate cereja, pepino japonês, palha nori, salmão, amêndoas laminadas, cebola roxa, cebolinha e gergelim.',
      orbit: [
        { img: 'avocado', x: '0%', y: '10%', s: .9, r: '12deg', hx: '-14px', hy: '-8px' },
        { img: 'salmon', x: '84%', y: '12%', s: .85, r: '-10deg', hx: '12px', hy: '-10px' },
        { img: 'cucumber', x: '88%', y: '66%', s: .68, r: '10deg', hx: '14px', hy: '8px' },
        { img: 'tomato', x: '0%', y: '70%', s: .58, r: '-14deg', hx: '-12px', hy: '10px' }
      ]
    },
    {
      name: 'HILO', bg: '#B6FF00', light: true, price: 'R$ 51',
      ingredients: 'Repolho roxo, mix de folhas, pepino, tomate cereja, cenoura, couve crispy, palha de nori, ceviche, castanha-de-caju, cebolinha, gergelim, cebola roxa e gengibre.',
      orbit: [
        { img: 'onion', x: '2%', y: '12%', s: .85, r: '-12deg', hx: '-14px', hy: '-8px' },
        { img: 'cucumber', x: '84%', y: '8%', s: .72, r: '12deg', hx: '12px', hy: '-10px' },
        { img: 'tomato', x: '88%', y: '64%', s: .6, r: '-8deg', hx: '14px', hy: '8px' },
        { img: 'edamame', x: '0%', y: '68%', s: .68, r: '10deg', hx: '-12px', hy: '10px' }
      ]
    }
  ];

  /* ================= PARALLAX + FLOAT DO HERO ================= */
  var scene = document.getElementById('heroScene');
  var floats = scene ? [].slice.call(scene.querySelectorAll('.fl')) : [];
  var mx = 0, my = 0, tx = 0, ty = 0;

  if (!isTouch && !reduced) {
    window.addEventListener('mousemove', function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  var t0 = performance.now();
  function heroLoop(now) {
    var t = (now - t0) / 1000;
    mx += (tx - mx) * 0.06;
    my += (ty - my) * 0.06;
    for (var i = 0; i < floats.length; i++) {
      var el = floats[i];
      var d = parseFloat(el.dataset.depth) || 1;
      var f = parseFloat(el.dataset.f) || 10;
      var ox = mx * d * 26;
      var oy = my * d * 20 + Math.sin(t * 0.9 + i * 1.7) * f;
      el.style.translate = ox.toFixed(1) + 'px ' + oy.toFixed(1) + 'px';
    }
    requestAnimationFrame(heroLoop);
  }
  if (floats.length && !reduced) requestAnimationFrame(heroLoop);

  /* ================= CARROSSEL DE ONDAS ================= */
  var wavesSection = document.getElementById('sabores');
  var bowls = [].slice.call(document.querySelectorAll('.waves__bowl'));
  var bigName = document.getElementById('waveName');
  var priceEl = document.getElementById('wavePrice');
  var ingEl = document.getElementById('waveIngredients');
  var orbitEl = document.getElementById('waveOrbit');
  var dotsEl = document.getElementById('waveDots');
  var current = 4;
  var autoTimer = null;

  WAVES.forEach(function (w, i) {
    var b = document.createElement('button');
    b.textContent = w.name.charAt(0) + w.name.slice(1).toLowerCase();
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', w.name);
    if (i === 4) b.classList.add('is-active');
    b.addEventListener('click', function () { goTo(i); restartAuto(); });
    dotsEl.appendChild(b);
  });
  var dots = [].slice.call(dotsEl.children);

  function buildOrbit(wave) {
    orbitEl.innerHTML = '';
    wave.orbit.forEach(function (o, i) {
      var img = document.createElement('img');
      img.src = ING + o.img + '.webp';
      img.alt = '';
      img.className = 'orb';
      img.style.setProperty('--x', o.x);
      img.style.setProperty('--y', o.y);
      img.style.setProperty('--s', o.s);
      img.style.setProperty('--r', o.r);
      img.style.setProperty('--hx', o.hx);
      img.style.setProperty('--hy', o.hy);
      img.style.setProperty('--d', (0.08 + i * 0.07) + 's');
      orbitEl.appendChild(img);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { img.classList.add('is-in'); });
      });
    });
  }

  function goTo(index) {
    current = (index + WAVES.length) % WAVES.length;
    var wave = WAVES[current];

    bowls.forEach(function (b, i) { b.classList.toggle('is-active', i === current); });
    dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });

    bigName.classList.add('is-swapping');
    ingEl.classList.add('is-swapping');
    setTimeout(function () {
      bigName.textContent = wave.name;
      ingEl.textContent = wave.ingredients;
      priceEl.textContent = wave.price;
      bigName.classList.remove('is-swapping');
      ingEl.classList.remove('is-swapping');
    }, 320);

    wavesSection.dataset.bg = wave.bg;
    wavesSection.dataset.light = wave.light ? '1' : '';
    applyBgFromScroll(true);
    buildOrbit(wave);
  }

  document.getElementById('wavePrev').addEventListener('click', function () { goTo(current - 1); restartAuto(); });
  document.getElementById('waveNext').addEventListener('click', function () { goTo(current + 1); restartAuto(); });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { goTo(current - 1); restartAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); restartAuto(); }
  });

  var swipeX = null;
  wavesSection.addEventListener('touchstart', function (e) { swipeX = e.touches[0].clientX; }, { passive: true });
  wavesSection.addEventListener('touchend', function (e) {
    if (swipeX === null) return;
    var dx = e.changedTouches[0].clientX - swipeX;
    if (Math.abs(dx) > 48) { goTo(dx < 0 ? current + 1 : current - 1); restartAuto(); }
    swipeX = null;
  }, { passive: true });

  var wavesVisible = false;
  function restartAuto() {
    if (autoTimer) clearInterval(autoTimer);
    if (!wavesVisible || reduced) return;
    autoTimer = setInterval(function () { goTo(current + 1); }, 7000);
  }
  new IntersectionObserver(function (entries) {
    wavesVisible = entries[0].isIntersecting;
    if (wavesVisible) restartAuto();
    else if (autoTimer) clearInterval(autoTimer);
  }, { threshold: 0.3 }).observe(wavesSection);
  wavesSection.addEventListener('mouseenter', function () { if (autoTimer) clearInterval(autoTimer); });
  wavesSection.addEventListener('mouseleave', function () { restartAuto(); });

  buildOrbit(WAVES[4]);

  /* ================= COR DE FUNDO POR SCROLL ================= */
  var bgSections = [].slice.call(document.querySelectorAll('[data-bg]'));
  var lastBg = '';
  function applyBgFromScroll(force) {
    var mid = window.innerHeight * 0.5;
    var active = null;
    for (var i = 0; i < bgSections.length; i++) {
      var r = bgSections[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) { active = bgSections[i]; break; }
    }
    if (!active) return;
    var bg = active.dataset.bg;
    if (bg !== lastBg || force) {
      lastBg = bg;
      document.body.style.backgroundColor = bg;
      var light = active.dataset.light === '1' ||
        ['#FFF7E8', '#FFE1C4', '#FFC400', '#B6FF00'].indexOf(bg.toUpperCase()) !== -1;
      document.body.classList.toggle('on-light', light);
    }
  }
  window.addEventListener('scroll', applyBgFromScroll, { passive: true });
  applyBgFromScroll(true);

  /* ================= WORDS: letras + ingredientes no scroll ================= */
  var wordEls = [].slice.call(document.querySelectorAll('.words__list .w'));
  wordEls.forEach(function (w, i) { w.style.transitionDelay = (i * 0.09) + 's'; });
  var wordsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        wordEls.forEach(function (w) { w.classList.add('is-in'); });
        wordsObserver.disconnect();
      }
    });
  }, { threshold: 0.35 });
  var wordsList = document.querySelector('.words__list');
  if (wordsList) wordsObserver.observe(wordsList);

  var wordsSection = document.getElementById('frescor');
  var wfs = [].slice.call(document.querySelectorAll('.wf'));
  function wordsParallax() {
    if (!wordsSection || !wfs.length) return;
    var r = wordsSection.getBoundingClientRect();
    var vh = window.innerHeight;
    if (r.top > vh || r.bottom < 0) return;
    var progress = (vh - r.top) / (vh + r.height);
    for (var i = 0; i < wfs.length; i++) {
      var sp = parseFloat(wfs[i].dataset.speed) || 0.4;
      var y = -progress * sp * (r.height + vh) * 0.9;
      wfs[i].style.translate = '0 ' + y.toFixed(1) + 'px';
    }
  }
  if (!reduced) window.addEventListener('scroll', wordsParallax, { passive: true });
  wordsParallax();

  /* ================= REVEALS ================= */
  var rvTargets = [].slice.call(document.querySelectorAll('.section-title, .section-sub, .bstep, .rev, .ocard, .about__copy p, .words__intro'));
  rvTargets.forEach(function (el) { el.classList.add('rv'); });
  var rvObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        rvObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  rvTargets.forEach(function (el) { rvObserver.observe(el); });

  /* ================= DOCK ATIVO ================= */
  var dockLinks = [].slice.call(document.querySelectorAll('[data-dock]'));
  var dockMap = {};
  dockLinks.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    dockMap[id] = a;
  });
  var dockObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var link = dockMap[en.target.id];
      if (!link) return;
      if (en.isIntersecting) {
        dockLinks.forEach(function (a) { a.classList.remove('is-active'); });
        link.classList.add('is-active');
      }
    });
  }, { threshold: 0.4 });
  ['sabores', 'monte', 'sobre', 'pedir'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) dockObserver.observe(el);
  });

  /* ================= TOPPINGS LATERAIS (drift no scroll) ================= */
  var sideFls = [].slice.call(document.querySelectorAll('.side-fl'));
  function sideParallax() {
    var vh = window.innerHeight;
    for (var i = 0; i < sideFls.length; i++) {
      var el = sideFls[i];
      var sec = el.parentElement.getBoundingClientRect();
      if (sec.top > vh || sec.bottom < 0) continue;
      var progress = (vh - sec.top) / (vh + sec.height);
      var sp = parseFloat(el.dataset.speed) || 0.4;
      el.style.translate = '0 ' + (-progress * sp * 260).toFixed(1) + 'px';
    }
  }
  if (!reduced) window.addEventListener('scroll', sideParallax, { passive: true });
  sideParallax();

})();
