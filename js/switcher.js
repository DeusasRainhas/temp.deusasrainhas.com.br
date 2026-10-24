/* Switcher: menu flutuante para navegar entre os 50 templates, favoritar,
   anotar e abrir galeria/comparar. Em iframe, só sincroniza o scroll. */
window.DR = window.DR || {};
(function (DR) {
  'use strict';

  if (!window.DR_CATALOGO) {
    console.error('[switcher] catálogo ausente');
    return;
  }

  var CAT = window.DR_CATALOGO;
  var FAMILIAS = window.DR_FAMILIAS || [];
  var TOTAL = CAT.length;
  var K_FAV = 'dr.favoritos';
  var K_NOTAS = 'dr.notas';
  var K_SCROLL = 'dr.scroll';
  var EM_IFRAME = (function () {
    try { return window.self !== window.top; } catch (e) { return true; }
  })();

  /* ---------- utilitários ---------- */

  function pad(n) { return String(n).padStart(2, '0'); }

  function normalizar(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function item(n) { return CAT.find(function (i) { return i.n === Number(n); }) || null; }

  function nomeFamilia(id) {
    var f = FAMILIAS.find(function (x) { return x.id === id; });
    return f ? f.nome : id;
  }

  function vizinho(n, passo) {
    var base = Number(n) || 1;
    return ((base - 1 + passo) % TOTAL + TOTAL) % TOTAL + 1;
  }

  /* Acessar window.localStorage pode lançar (SecurityError) quando o navegador
     bloqueia armazenamento; nesse caso tudo cai numa memória local da página. */
  var memoria = {};
  function store(nome) {
    try { return window[nome] || null; } catch (e) { return null; }
  }

  function lerBruto(nome, chave) {
    var s = store(nome);
    if (s) { try { return s.getItem(chave); } catch (e) { /* cai na memória */ } }
    return Object.prototype.hasOwnProperty.call(memoria, nome + ':' + chave) ? memoria[nome + ':' + chave] : null;
  }

  function lerJSON(nome, chave) {
    try { return JSON.parse(lerBruto(nome, chave)); } catch (e) { return null; }
  }

  function gravar(nome, chave, valor) {
    var s = store(nome);
    if (s) { try { s.setItem(chave, valor); return; } catch (e) { /* cai na memória */ } }
    memoria[nome + ':' + chave] = valor;
  }

  function apagar(nome, chave) {
    var s = store(nome);
    if (s) { try { s.removeItem(chave); } catch (e) { /* ignore */ } }
    delete memoria[nome + ':' + chave];
  }

  function dentroTemplates() { return location.pathname.indexOf('/templates/') !== -1; }
  function prefixo() { return dentroTemplates() ? '../' : ''; }

  /* ---------- estado persistido ---------- */

  function favoritos() {
    var v = lerJSON('localStorage', K_FAV);
    if (!Array.isArray(v)) return [];
    var vistos = {};
    return v.filter(function (n) {
      if (!Number.isInteger(n) || n < 1 || n > TOTAL || vistos[n]) return false;
      vistos[n] = true;
      return true;
    });
  }

  function alternarFavorito(n) {
    var favs = favoritos();
    var i = favs.indexOf(n);
    if (i === -1) favs.push(n); else favs.splice(i, 1);
    gravar('localStorage', K_FAV, JSON.stringify(favs));
    atualizarEstrelas();
    return favs;
  }

  function notas() {
    var v = lerJSON('localStorage', K_NOTAS);
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  }

  function salvarNota(n, texto) {
    var obj = notas();
    if (String(texto).trim() === '') delete obj[n]; else obj[n] = String(texto);
    gravar('localStorage', K_NOTAS, JSON.stringify(obj));
  }

  /* ---------- API ---------- */

  function scrollRatio() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, window.scrollY / max) : 0;
  }

  function ir(n) {
    var destino = DR.caminho(n);
    if (!destino) return;
    gravar('sessionStorage', K_SCROLL, String(scrollRatio()));
    location.href = destino;
  }

  function exportar() {
    var favs = favoritos().slice().sort(function (a, b) { return a - b; });
    var obj = notas();
    var linhas = ['Deusas Rainhas · templates favoritos (' + favs.length + ')'];
    favs.forEach(function (n) {
      var t = item(n);
      if (!t) return;
      linhas.push(pad(n) + ' ' + t.nome + ' · ' + t.familia + ' · ' + t.hero + ' · ' + t.efeito +
        ' · ' + t.nav + ' ' + t.cards + ' ' + t.ritmo);
      if (obj[n]) linhas.push('  nota: ' + obj[n]);
    });
    var txt = linhas.join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).catch(function () {});
      }
    } catch (e) { /* sem área de transferência */ }
    return txt;
  }

  function abrirGaleria() { location.href = prefixo() + 'galeria.html'; }

  function abrirComparar() {
    var favs = favoritos();
    var a, b;
    if (favs.length >= 2) {
      a = favs[favs.length - 2];
      b = favs[favs.length - 1];
    } else {
      a = DR.atual() || 1;
      b = vizinho(a, 1);
    }
    location.href = prefixo() + 'comparar.html?a=' + a + '&b=' + b;
  }

  DR.switcher = { ir: ir, favoritos: favoritos, exportar: exportar, scrollRatio: scrollRatio };

  /* ---------- modo iframe ---------- */

  if (EM_IFRAME) {
    var ultimo = 0;
    var pendente = null;
    function postar() {
      ultimo = Date.now();
      pendente = null;
      parent.postMessage({ tipo: 'dr.scroll', ratio: scrollRatio(), template: DR.atual() }, '*');
    }
    /* Throttle de 50ms com borda final: a posição de repouso sempre é enviada. */
    window.addEventListener('scroll', function () {
      var resta = 50 - (Date.now() - ultimo);
      if (pendente) { clearTimeout(pendente); pendente = null; }
      if (resta <= 0) postar();
      else pendente = setTimeout(postar, resta);
    }, { passive: true });
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || d.tipo !== 'dr.scrollTo' || typeof d.ratio !== 'number' || !isFinite(d.ratio)) return;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.max(0, Math.min(1, d.ratio)) * Math.max(0, max));
    });
    return;
  }

  /* ---------- restauração do scroll ---------- */

  var restaurado = false;
  function restaurar() {
    if (restaurado) return;
    restaurado = true;
    var bruto = lerBruto('sessionStorage', K_SCROLL);
    if (bruto === null) return;
    requestAnimationFrame(function () {
      var r = parseFloat(bruto);
      if (isFinite(r)) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.max(0, Math.min(1, r)) * Math.max(0, max));
      }
      apagar('sessionStorage', K_SCROLL);
    });
  }
  document.addEventListener('conteudo:pronto', restaurar);
  /* hidratar.js pode já ter disparado conteudo:pronto antes deste script. */
  if (document.readyState === 'complete') restaurar();
  else window.addEventListener('load', restaurar);

  /* ---------- estilo ---------- */

  var CSS = [
    '#dr-switcher{position:fixed;right:16px;bottom:16px;z-index:2147483000;font-family:var(--sans,system-ui,sans-serif);font-size:14px;line-height:1.4;color:var(--grafite,#202020)}',
    '#dr-switcher [hidden]{display:none!important}',
    '#dr-switcher *,#dr-switcher *::before,#dr-switcher *::after{box-sizing:border-box}',
    '#dr-switcher button,#dr-switcher input,#dr-switcher textarea{font:inherit;color:inherit;margin:0}',
    '#dr-switcher :focus-visible{outline:2px solid var(--petroleo,#176B66);outline-offset:2px}',
    '.dr-sw-pilula{position:relative;display:inline-flex;align-items:center;gap:8px;padding:8px 14px 8px 10px;border:0;border-radius:var(--r-pill,999px);background:var(--grafite,#202020);color:var(--creme,#FFFBE6)!important;box-shadow:var(--sh-lg,0 14px 40px rgba(78,52,46,.14));cursor:pointer;opacity:.92;transition:opacity .2s}',
    '.dr-sw-pilula:hover,.dr-sw-pilula:focus-visible{opacity:1}',
    '.dr-sw-pilula svg{width:20px;height:20px;flex:none;fill:var(--creme,#FFFBE6)}',
    '.dr-sw-pilula span{font-family:var(--mono,ui-monospace,monospace);font-size:13px;letter-spacing:.02em}',
    '.dr-sw-painel{position:fixed;top:0;right:0;bottom:0;width:320px;max-width:100%;display:flex;flex-direction:column;background:var(--creme,#FFFBE6);border-left:1px solid var(--linha,#E7DFC8);box-shadow:var(--sh-lg,0 14px 40px rgba(78,52,46,.14))}',
    '@media (max-width:480px){.dr-sw-painel{width:100%;border-left:0}}',
    '.dr-sw-topo{display:flex;align-items:center;gap:8px;padding:12px 12px 8px}',
    '.dr-sw-busca{flex:1;min-width:0;height:36px;padding:0 12px;border:1px solid var(--linha,#E7DFC8);border-radius:var(--r-md,8px);background:var(--branco,#fff)}',
    '.dr-sw-fechar{width:36px;height:36px;border:0;border-radius:var(--r-md,8px);background:transparent;cursor:pointer;font-size:20px;line-height:1}',
    '.dr-sw-fechar:hover{background:var(--superficie,#F4ECD2)}',
    '.dr-sw-lista{flex:1;overflow-y:auto;overscroll-behavior:contain;margin:0;padding:0 0 8px;list-style:none}',
    '.dr-sw-grupo{margin:0;padding:12px 16px 4px;font-family:var(--mono,ui-monospace,monospace);font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--terra-escura,#4E342E)}',
    '.dr-sw-item{display:block;padding:6px 8px 6px 16px;border-left:3px solid transparent;cursor:pointer}',
    '.dr-sw-item:hover{background:var(--superficie,#F4ECD2)}',
    '.dr-sw-item[aria-current]{border-left-color:var(--mel-escuro,#D9A521);background:var(--mel-veu,#FDEFC2)}',
    '.dr-sw-linha{display:flex;align-items:center;gap:8px}',
    '.dr-sw-num{font-family:var(--mono,ui-monospace,monospace);font-size:12px;color:var(--terra-escura,#4E342E);flex:none}',
    '.dr-sw-nome{color:var(--grafite,#202020)!important;font-weight:600;text-decoration:none}',
    '.dr-sw-nome:hover{text-decoration:underline}',
    '.dr-sw-esp{flex:1}',
    '.dr-sw-fav{width:28px;height:28px;flex:none;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:var(--r-md,8px);background:transparent;cursor:pointer}',
    '.dr-sw-fav svg{width:16px;height:16px;fill:none;stroke:var(--terra-escura,#4E342E);stroke-width:1.6}',
    '.dr-sw-fav[aria-pressed="true"] svg{fill:var(--mel,#F5C02C);stroke:var(--mel-escuro,#D9A521)}',
    '.dr-sw-expandir[aria-expanded="true"]{background:var(--superficie,#F4ECD2)}',
    '.dr-sw-efeito{display:block;margin:0 0 0 28px;font-size:12px;color:var(--terra-escura,#4E342E)}',
    '.dr-sw-nota{display:block;width:calc(100% - 28px);margin:6px 0 2px 28px;min-height:64px;padding:8px;border:1px solid var(--linha,#E7DFC8);border-radius:var(--r-md,8px);background:var(--branco,#fff);resize:vertical}',
    '.dr-sw-rodape{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:8px;border-top:1px solid var(--linha,#E7DFC8)}',
    '.dr-sw-rodape button{padding:8px 2px;border:1px solid var(--linha,#E7DFC8);border-radius:var(--r-md,8px);background:transparent;cursor:pointer;font-size:12px}',
    '.dr-sw-rodape button:hover{background:var(--superficie,#F4ECD2)}'
  ].join('\n');

  var SVG_COROA = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M3 8l4.5 4L12 4l4.5 8L21 8l-2 11H5L3 8z"/></svg>';
  var SVG_NOTA = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M5 6h14M5 11h14M5 16h9"/></svg>';
  var SVG_ESTRELA = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>';

  /* ---------- DOM ---------- */

  var raiz, pilula, painel, busca, lista;

  function el(tag, attrs, texto) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (texto != null) e.textContent = texto;
    return e;
  }

  function construir() {
    if (document.getElementById('dr-switcher')) return;
    var atual = DR.atual();
    var notasSalvas = notas();

    var estilo = el('style', { id: 'dr-switcher-css' });
    estilo.textContent = CSS;
    document.head.appendChild(estilo);

    raiz = el('div', { id: 'dr-switcher' });

    pilula = el('button', {
      type: 'button', 'data-sw': 'pilula', 'class': 'dr-sw-pilula',
      'aria-expanded': 'false', 'aria-controls': 'dr-sw-painel',
      'aria-label': 'Templates: ' + (atual ? pad(atual) : '--') + ' de ' + TOTAL + '. Abrir menu'
    });
    pilula.innerHTML = SVG_COROA;
    pilula.appendChild(el('span', null, (atual ? pad(atual) : '--') + ' / ' + TOTAL));

    painel = el('div', {
      id: 'dr-sw-painel', 'data-sw': 'painel', 'class': 'dr-sw-painel',
      role: 'dialog', 'aria-label': 'Templates Deusas Rainhas', hidden: ''
    });

    var topo = el('div', { 'class': 'dr-sw-topo' });
    busca = el('input', {
      type: 'search', 'data-sw': 'busca', 'class': 'dr-sw-busca',
      placeholder: 'Buscar número, nome, família, efeito', 'aria-label': 'Buscar templates',
      autocomplete: 'off', spellcheck: 'false'
    });
    var fechar = el('button', { type: 'button', 'class': 'dr-sw-fechar', 'aria-label': 'Fechar menu' }, '×');
    topo.appendChild(busca);
    topo.appendChild(fechar);

    lista = el('ul', { 'class': 'dr-sw-lista' });
    var ordemFamilias = FAMILIAS.length ? FAMILIAS.map(function (f) { return f.id; })
      : CAT.map(function (t) { return t.familia; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    ordemFamilias.forEach(function (fid) {
      var itens = CAT.filter(function (t) { return t.familia === fid; });
      if (!itens.length) return;
      lista.appendChild(el('li', { 'class': 'dr-sw-grupo', 'data-sw': 'grupo', 'data-familia': fid }, nomeFamilia(fid)));
      itens.forEach(function (t) { lista.appendChild(linhaItem(t, atual, notasSalvas)); });
    });

    var rodape = el('div', { 'class': 'dr-sw-rodape' });
    [['anterior', 'Anterior'], ['proximo', 'Próximo'], ['galeria', 'Galeria'], ['comparar', 'Comparar'], ['exportar', 'Exportar']]
      .forEach(function (b) {
        rodape.appendChild(el('button', { type: 'button', 'data-sw': b[0] }, b[1]));
      });

    painel.appendChild(topo);
    painel.appendChild(lista);
    painel.appendChild(rodape);
    raiz.appendChild(pilula);
    raiz.appendChild(painel);
    document.body.appendChild(raiz);

    atualizarEstrelas();
    ligarEventos(fechar, rodape);
  }

  function linhaItem(t, atual, notasSalvas) {
    var li = el('li', {
      'class': 'dr-sw-item', 'data-sw': 'item', 'data-n': String(t.n), 'data-familia': t.familia,
      'data-busca': normalizar([pad(t.n), t.n, t.nome, t.familia, nomeFamilia(t.familia), t.efeito].join(' '))
    });
    if (t.n === atual) li.setAttribute('aria-current', 'page');

    var linha = el('div', { 'class': 'dr-sw-linha' });
    linha.appendChild(el('span', { 'class': 'dr-sw-num' }, pad(t.n)));
    var a = el('a', { 'class': 'dr-sw-nome', href: DR.caminho(t.n) }, t.nome);
    linha.appendChild(a);
    linha.appendChild(el('span', { 'class': 'dr-sw-esp' }));
    var exp = el('button', {
      type: 'button', 'class': 'dr-sw-fav dr-sw-expandir', 'data-sw': 'expandir',
      'aria-expanded': 'false', 'aria-label': 'Anotar', title: 'Anotar ' + t.nome
    });
    exp.innerHTML = SVG_NOTA;
    linha.appendChild(exp);
    var fav = el('button', {
      type: 'button', 'class': 'dr-sw-fav', 'data-sw': 'fav', 'aria-pressed': 'false',
      'aria-label': 'Favoritar ' + t.nome
    });
    fav.innerHTML = SVG_ESTRELA;
    linha.appendChild(fav);
    li.appendChild(linha);
    li.appendChild(el('span', { 'class': 'dr-sw-efeito dr-caption' }, t.efeito));

    var nota = el('textarea', {
      'class': 'dr-sw-nota', 'data-sw': 'nota', rows: '3',
      placeholder: 'Nota sobre este template', 'aria-label': 'Nota sobre ' + t.nome, hidden: ''
    });
    nota.value = notasSalvas[t.n] || '';
    li.appendChild(nota);
    return li;
  }

  function atualizarEstrelas() {
    if (!raiz) return;
    var favs = favoritos();
    raiz.querySelectorAll('[data-sw="item"]').forEach(function (li) {
      var on = favs.indexOf(Number(li.dataset.n)) !== -1;
      li.querySelector('[data-sw="fav"]').setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function filtrar(q) {
    var termo = normalizar(q).trim();
    lista.querySelectorAll('[data-sw="item"]').forEach(function (li) {
      li.hidden = termo !== '' && li.dataset.busca.indexOf(termo) === -1;
    });
    lista.querySelectorAll('[data-sw="grupo"]').forEach(function (g) {
      var algum = lista.querySelector('[data-sw="item"][data-familia="' + g.dataset.familia + '"]:not([hidden])');
      g.hidden = !algum;
    });
  }

  function aberto() { return painel && !painel.hidden; }

  function abrir() {
    pilula.hidden = false;
    painel.hidden = false;
    pilula.setAttribute('aria-expanded', 'true');
    var cur = lista.querySelector('[aria-current]');
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'center' });
  }

  function fecharPainel() {
    painel.hidden = true;
    pilula.setAttribute('aria-expanded', 'false');
  }

  function ligarEventos(fechar, rodape) {
    pilula.addEventListener('click', function () { if (aberto()) fecharPainel(); else abrir(); });
    fechar.addEventListener('click', function () { fecharPainel(); pilula.focus(); });
    busca.addEventListener('input', function () { filtrar(busca.value); });

    lista.addEventListener('click', function (e) {
      var li = e.target.closest('[data-sw="item"]');
      if (!li) return;
      var n = Number(li.dataset.n);
      if (e.target.closest('[data-sw="fav"]')) { alternarFavorito(n); return; }
      if (e.target.closest('a')) {
        if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); ir(n); }
        return;
      }
      if (e.target.closest('[data-sw="nota"]')) return;
      var nota = li.querySelector('[data-sw="nota"]');
      var expandir = !li.classList.contains('expanded');
      li.classList.toggle('expanded', expandir);
      li.querySelector('[data-sw="expandir"]').setAttribute('aria-expanded', expandir ? 'true' : 'false');
      nota.hidden = !expandir;
      if (expandir) nota.focus();
    });

    function persistir(e) {
      if (!e.target.matches('[data-sw="nota"]')) return;
      salvarNota(Number(e.target.closest('[data-sw="item"]').dataset.n), e.target.value);
    }
    lista.addEventListener('input', persistir);
    lista.addEventListener('focusout', persistir);

    rodape.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var acao = b.dataset.sw;
      if (acao === 'anterior') ir(vizinho(DR.atual(), -1));
      else if (acao === 'proximo') ir(vizinho(DR.atual(), 1));
      else if (acao === 'galeria') abrirGaleria();
      else if (acao === 'comparar') abrirComparar();
      else if (acao === 'exportar') {
        exportar();
        var orig = b.textContent;
        b.textContent = 'Copiado';
        setTimeout(function () { b.textContent = orig; }, 1500);
      }
    });

    document.addEventListener('keydown', teclado);
  }

  function editavel(t) {
    if (!t || t.nodeType !== 1) return false;
    var tag = t.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable;
  }

  function teclado(e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Escape') {
      if (editavel(e.target) && raiz.contains(e.target)) e.target.blur();
      if (aberto()) { fecharPainel(); if (raiz.contains(document.activeElement) || document.activeElement === document.body) pilula.focus(); }
      return;
    }
    if (editavel(e.target)) return;
    var atual = DR.atual();
    switch (e.key.toLowerCase()) {
      case 'arrowleft': ir(vizinho(atual, -1)); break;
      case 'arrowright': ir(vizinho(atual, 1)); break;
      case '/': e.preventDefault(); abrir(); busca.focus(); busca.select(); break;
      case 'f': if (atual) alternarFavorito(atual); break;
      case 'g': abrirGaleria(); break;
      case 'c': abrirComparar(); break;
      case 'h':
        if (pilula.hidden) { pilula.hidden = false; }
        else { fecharPainel(); pilula.hidden = true; }
        break;
      default: return;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', construir);
  else construir();
})(window.DR);
