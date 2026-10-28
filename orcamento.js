(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Data de emissão e validade (o CRM manda e=AAAA-MM-DD; sem ela vale o dia de hoje) ---------- */
  function datas(esp) {
    var dias = (esp && Number(esp.validadeDias)) || (window.PRECOS && window.PRECOS.validadeDias) || 7;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((esp && esp.emissao) || new URLSearchParams(location.search).get('e') || '');
    var emissao = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date();
    emissao.setHours(0, 0, 0, 0);
    var valida = new Date(emissao.getTime());
    valida.setDate(valida.getDate() + dias);
    var fmt = function (x) { return x.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }); };
    var hojeZ = new Date(); hojeZ.setHours(0, 0, 0, 0);
    var vencida = hojeZ.getTime() > valida.getTime();
    var e = document.getElementById('pData'), v = document.getElementById('pValida'), c = document.getElementById('closingValid');
    if (e) e.textContent = fmt(emissao);
    if (v) { v.textContent = fmt(valida) + (vencida ? ' (expirada)' : ''); if (vencida) v.classList.add('pmeta-late'); }
    if (c) c.textContent = vencida
      ? 'Este orçamento expirou em ' + fmt(valida) + '. Fale com a gente para atualizar os valores.'
      : 'Orçamento válido até ' + fmt(valida) + ', para o escopo acima.';
  }

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

  /* ---------- Orçamento montado pelo link: ?n=Nome&s=site,identidade (valores vêm de precos.js) ---------- */
  // esp = condição especial vinda do CRM (?o=CODIGO); sem ela, monta pelo link normal
  function renderizar(esp) {
    var P = window.PRECOS;
    if (!P) return;
    var q = new URLSearchParams(location.search);
    var money = function (n) { return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); };
    var nome = ((esp ? esp.nome : q.get('n')) || '').trim().slice(0, 60), S;
    if (esp) {
      S = (esp.itens || []).slice(0, 12).map(function (it) {
        var valor = Math.max(0, Number(it.valor) || 0), base = P.servicos[it.cod];
        if (base) return Object.assign({}, base, { total: valor, valorTexto: money(valor), totalNota: '' });
        return { nome: String(it.nome || 'Serviço').slice(0, 60), desc: String(it.desc || '').slice(0, 200), icone: 'pagina', valorTexto: money(valor), total: valor, prazo: String(it.prazo || 'combinado').slice(0, 30), itens: (it.itens || []).slice(0, 8).map(function (x) { return String(x).slice(0, 120); }) };
      });
      if (!S.length) return;
    } else {
      var cods = (q.get('s') || 'landing').split(',').map(function (c) { return c.trim(); })
        .filter(function (c, i, a) { return P.servicos[c] && a.indexOf(c) === i; });
      if (!cods.length) cods = ['landing'];
      S = cods.map(function (c) { return P.servicos[c]; });
    }

    var el = function (tag, cls, txt) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (txt != null) e.textContent = txt;
      return e;
    };
    var byId = function (id) { return document.getElementById(id); };
    var ICONES = {
      pagina: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 14h5"/><path d="M8 17h8"/></svg>',
      site: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M9 9v11"/></svg>',
      marca: '<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></svg>',
      posts: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>',
      check: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>'
    };

    if (nome) {
      document.querySelectorAll('.js-nome').forEach(function (x) { x.textContent = nome; });
      document.title = 'Orçamento · ' + nome + ' · Studio Kairós';
    }

    var soma = S.reduce(function (t, s) { return t + s.total; }, 0);
    var cred = Math.max(0, Math.min(Number(esp ? esp.credito : q.get("c")) || 0, Math.floor(soma * (P.limiteCredito || 50) / 100))); // crédito do Clube, no máximo 50% do projeto
    soma -= cred;
    var avista = Math.round(soma * (1 - P.descontoAvista / 100));
    var temSocial = S.some(function (s) { return s.mensal; });
    var cartaoDefinido = S.every(function (s) { return s.cartao; });
    var cartao = S.reduce(function (t, s) { return t + (s.cartao || s.total); }, 0) - cred;

    byId('escopoTitulo').textContent = S.length === 1 ? S[0].nome + '.' : 'Os seus serviços.';

    var offers = byId('offers');
    S.forEach(function (s) {
      var a = el('article', 'offer reveal');
      var top = el('div', 'offer-top');
      var ico = el('span', 'offer-ico');
      ico.setAttribute('aria-hidden', 'true');
      ico.innerHTML = ICONES[s.icone] || ICONES.pagina; // ícones fixos do código, sem texto vindo do link
      top.appendChild(ico);
      top.appendChild(el('span', 'offer-price', s.valorTexto));
      a.appendChild(top);
      a.appendChild(el('h3', 'offer-name', s.nome));
      a.appendChild(el('p', 'offer-desc', s.desc));
      var ul = el('ul', 'offer-list');
      s.itens.forEach(function (i) { ul.appendChild(el('li', null, i)); });
      a.appendChild(ul);
      a.appendChild(el('p', 'offer-chip', 'Prazo de entrega: ' + s.prazo + ' úteis'));
      if (s.destaque) {
        var hl = el('p', 'offer-hl');
        var ck = el('span', 'offer-hl-ico');
        ck.setAttribute('aria-hidden', 'true');
        ck.innerHTML = ICONES.check;
        hl.appendChild(ck);
        hl.appendChild(el('span', null, s.destaque));
        a.appendChild(hl);
      }
      offers.appendChild(a);
    });

    var facts = byId('facts');
    var f1 = el('div', 'fact');
    f1.appendChild(el('span', 'fact-k', 'Prazo de entrega'));
    f1.appendChild(el('span', 'fact-v', S.length === 1 ? S[0].prazo + ' dias úteis' : 'Conforme cada serviço'));
    f1.appendChild(el('span', 'fact-s', S.length === 1 ? 'A partir da aprovação do orçamento e da conversa de briefing.' : 'Cada serviço tem o seu prazo, indicado acima.'));
    var f2 = el('div', 'fact');
    f2.appendChild(el('span', 'fact-k', 'Investimento total'));
    f2.appendChild(el('span', 'fact-v', money(soma)));
    f2.appendChild(el('span', 'fact-s', S.map(function (s) { return s.nome + (s.totalNota ? ' (' + s.totalNota + ')' : ''); }).join(' + ') + (cred ? ' · já com o crédito do Clube de ' + money(cred) + ' descontado' : '')));
    facts.appendChild(f1); facts.appendChild(f2);

    var grid = byId('paygrid');
    var pay = function (hl, badge, k, big, small, off, note, riscar) {
      var c = el('div', 'pay reveal' + (hl ? ' pay-hl' : ''));
      if (badge) c.appendChild(el('span', 'pay-badge', badge));
      c.appendChild(el('span', 'pay-k', k));
      var v = el('div', 'pay-v');
      v.appendChild(el('b', null, big));
      if (small) v.appendChild(el(riscar ? 's' : 'span', null, small)); // só o preço antigo do desconto à vista fica riscado
      c.appendChild(v);
      if (off) c.appendChild(el('span', 'pay-off', off));
      c.appendChild(el('p', 'pay-note', note));
      grid.appendChild(c);
    };
    var pagEsp = esp && Array.isArray(esp.pagamentos) ? esp.pagamentos.slice(0, 4) : [];
    if (pagEsp.length) {
      // condição combinada só para este cliente: os cartões vêm prontos do CRM
      pagEsp.forEach(function (p, i) {
        pay(i === 0, i === 0 ? 'Condição combinada' : '', String(p.titulo || '').slice(0, 60), String(p.destaque || '').slice(0, 40), String(p.pequeno || '').slice(0, 40), '', String(p.nota || '').slice(0, 200), p.riscado === true);
      });
      if (grid.children.length === 3) grid.classList.add('paygrid--3');
      // a observação da Gabi vira um destaque dentro do próprio cartão da condição combinada
      var primeiro = grid.firstElementChild;
      if (esp.obs && primeiro) {
        var ob = el('p', 'pay-obs');
        ob.appendChild(el('b', null, 'Combinado: '));
        ob.appendChild(document.createTextNode(String(esp.obs).slice(0, 300)));
        primeiro.appendChild(ob);
      }
      byId('payExtra').hidden = true;
      var fechar = document.querySelector('#fechar .lead');
      if (fechar) fechar.textContent = 'Condição combinada especialmente para você. É só aprovar que a gente já começa.';
    } else {
      pay(true, 'Melhor opção', 'No Pix, à vista', money(avista), money(soma),
        P.descontoAvista + '% de desconto · economize ' + money(soma - avista),
        'Pagamento único na aprovação do orçamento.', true);
      if (!temSocial) {
        pay(false, '', 'No Pix, em 2 vezes', money(soma / 2), '+ ' + money(soma / 2), '',
          'Metade na entrada e metade na entrega final. O primeiro pagamento é antes de começar.');
      }
      pay(false, '', 'No cartão', money(cartao), cartaoDefinido ? 'em até 5x sem juros' : '', '',
        cartaoDefinido ? 'A taxa do cartão já está incluída no valor.' : 'Sem desconto. Parcelado com os juros da maquininha do seu cartão.');
      if (grid.children.length === 3) grid.classList.add('paygrid--3');
      byId('payExtra').textContent = 'Pagamento por Pix ou cartão, com a taxa do cartão repassada.';
      byId('totalTxt').textContent = money(soma);
      byId('totalPix').textContent = money(avista);
    }

    var host = S.filter(function (s) { return s.hospedagem; });
    if (host.length) {
      var r = byId('recurring');
      r.hidden = false;
      r.appendChild(el('h3', 'recurring-title', 'Depois que o projeto estiver no ar'));
      var rows = el('div', 'recurring-grid');
      host.forEach(function (s) {
        var c = el('div', 'rec');
        c.appendChild(el('span', 'rec-k', 'Hospedagem · ' + s.nome));
        c.appendChild(el('b', 'rec-v', money(s.hospedagem) + ' por mês'));
        c.appendChild(el('p', null, 'Seu site no ar, com dados salvos e manutenção de servidor. O primeiro mês é grátis.'));
        rows.appendChild(c);
      });
      var m = el('div', 'rec rec-opt');
      m.appendChild(el('span', 'rec-k', 'Manutenção · opcional'));
      m.appendChild(el('b', 'rec-v', '+ ' + money(P.manutencao.valor) + ' por mês'));
      m.appendChild(el('p', null, P.manutencao.itens.join('. ') + '.'));
      host.forEach(function (s) { m.appendChild(el('p', 'rec-sum', s.nome + ' com manutenção: ' + money(s.manutencao) + ' por mês.')); });
      rows.appendChild(m);
      r.appendChild(rows);
    }
  }

  /* ---------- Link "Início" na barra: só aparece depois da capa, ao chegar nos clientes ---------- */
  (function () {
    var nav = document.querySelector('.nav');
    var alvo = document.getElementById('clientes');
    if (!nav || !alvo) return;
    var atualiza = function () {
      nav.classList.toggle('show-home', alvo.getBoundingClientRect().top <= window.innerHeight * 0.5);
    };
    atualiza();
    window.addEventListener('scroll', atualiza, { passive: true });
    window.addEventListener('resize', atualiza);
  })();

  /* ---------- Faixa de logos: duplica a lista para a esteira girar sem emenda ---------- */
  (function () {
    var track = document.querySelector('.logos-track');
    if (!track || reduce) return;
    Array.prototype.slice.call(track.children).forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.querySelector('img').alt = '';
      track.appendChild(c);
    });
  })();

  /* ---------- Animação ao rolar ---------- */
  function revelar() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (x) { x.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      els.forEach(function (x, i) { x.style.setProperty('--d', ((i % 3) * 80) + 'ms'); io.observe(x); });
    }
  }

  /* ---------- Começo: com ?o=CODIGO busca a condição especial no CRM; sem ele, monta direto ---------- */
  var CRM_API = 'https://crm-studio-kairos.vercel.app/api/orcamento/ver?c=';
  function comecar(esp) { datas(esp); renderizar(esp); revelar(); }
  var codigo = new URLSearchParams(location.search).get('o');
  if (codigo && /^[a-z0-9]{10,24}$/i.test(codigo)) {
    fetch(CRM_API + encodeURIComponent(codigo), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('nao_encontrado'); return r.json(); })
      .then(function (esp) { comecar(esp); })
      .catch(function () {
        var h = document.querySelector('.phead-inner h1');
        if (h) h.textContent = 'Este orçamento não está disponível.';
        var l = document.querySelector('.phead-inner .lead');
        if (l) l.textContent = 'O link pode estar incorreto ou ter expirado. Fale com a gente pelo WhatsApp.';
        document.querySelectorAll('main > section:not(.phead)').forEach(function (s) { s.hidden = true; });
      });
  } else {
    comecar(null);
  }
})();
