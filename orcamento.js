(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Data de emissão: preenchida sozinha ---------- */
  var d = document.getElementById('pData');
  if (d) d.textContent = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  /* ---------- Fundo: brilho que segue o mouse (computador) ou o dedo (celular) ---------- */
  var glow = document.getElementById('bgGlow');
  if (glow && !reduce) {
    var touchMode = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var tx = window.innerWidth * (touchMode ? 0.5 : 0.6), ty = window.innerHeight * (touchMode ? 0.35 : 0.28), gx = tx, gy = ty;
    var ease = touchMode ? 0.22 : 0.08;
    if (touchMode) {
      var follow = function (e) { var t = e.touches[0]; if (t) { tx = t.clientX; ty = t.clientY; } };
      window.addEventListener('touchstart', follow, { passive: true });
      window.addEventListener('touchmove', follow, { passive: true });
    } else {
      window.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    }
    (function glowLoop() {
      gx += (tx - gx) * ease; gy += (ty - gy) * ease;
      glow.style.setProperty('--mx', gx.toFixed(1) + 'px');
      glow.style.setProperty('--my', gy.toFixed(1) + 'px');
      requestAnimationFrame(glowLoop);
    })();
  }

  /* ---------- Cursor personalizado (só com mouse) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var root = document.documentElement;
    var dot = document.createElement('div'); dot.className = 'cur-dot'; dot.setAttribute('aria-hidden', 'true');
    var ring = document.createElement('div'); ring.className = 'cur-ring'; ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring); document.body.appendChild(dot);
    root.classList.add('has-cursor');
    var cx = -100, cy = -100, rx = -100, ry = -100;
    window.addEventListener('pointermove', function (e) {
      cx = e.clientX; cy = e.clientY; root.classList.add('cur-on');
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      var t = e.target.closest ? e.target.closest('a, button, [role="button"]') : null;
      root.classList.toggle('cur-hover', !!t);
    }, { passive: true });
    document.addEventListener('mouseleave', function () { root.classList.remove('cur-on'); });
    window.addEventListener('pointerdown', function () { root.classList.add('cur-down'); });
    window.addEventListener('pointerup', function () { root.classList.remove('cur-down'); });
    (function ringLoop() {
      var k = reduce ? 1 : 0.18;
      rx += (cx - rx) * k; ry += (cy - ry) * k;
      ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px)';
      requestAnimationFrame(ringLoop);
    })();
  }

  /* ---------- Animação ao rolar ---------- */
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    els.forEach(function (x) { x.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (x, i) { x.style.setProperty('--d', ((i % 3) * 80) + 'ms'); io.observe(x); });
  }
})();
