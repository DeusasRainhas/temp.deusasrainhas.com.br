/*
 * Hidratador: preenche os slots data-c* a partir de window.DR_CONTEUDO.
 * Script comum (sem módulos) para funcionar também via file://.
 */
window.DR = window.DR || {};

(function (DR) {
  var PERMITIDOS = { em: 1, strong: 1, br: 1 };
  var DESCARTADOS = { script: 1, style: 1 };
  var XHTML = 'http://www.w3.org/1999/xhtml';

  function ehEnvoltorio(o) {
    return o !== null && typeof o === 'object' && !Array.isArray(o) && 'v' in o;
  }

  // Caminho "a.b[0].c" -> ['a','b','0','c']
  function partes(caminho) {
    return String(caminho).replace(/\[(\w+)\]/g, '.$1').split('.').filter(function (p) { return p !== ''; });
  }

  function resolver(caminho, base) {
    var atual = base;
    var ps = partes(caminho);
    if (!ps.length) return undefined;
    for (var i = 0; i < ps.length; i++) {
      if (atual === null || atual === undefined || typeof atual !== 'object') return undefined;
      if (ehEnvoltorio(atual) && !(ps[i] in atual)) return undefined;
      if (!Object.prototype.hasOwnProperty.call(atual, ps[i])) return undefined;
      atual = atual[ps[i]];
    }
    if (atual === undefined) return undefined;
    if (ehEnvoltorio(atual)) return { v: atual.v, provisorio: atual.provisorio || null };
    return { v: atual, provisorio: null };
  }

  DR.valor = function (caminho) {
    return resolver(caminho, window.DR_CONTEUDO);
  };

  function sanitizar(texto) {
    var doc = new DOMParser().parseFromString('<body>' + texto + '</body>', 'text/html');
    var frag = document.createDocumentFragment();
    (function percorrer(origem, destino) {
      Array.prototype.forEach.call(origem.childNodes, function (n) {
        if (n.nodeType === 3) {
          destino.appendChild(document.createTextNode(n.nodeValue));
        } else if (n.nodeType === 1) {
          var tag = n.localName;
          if (DESCARTADOS[tag]) return;
          if (PERMITIDOS[tag] && n.namespaceURI === XHTML) {
            var novo = document.createElement(tag);
            if (tag !== 'br') percorrer(n, novo);
            destino.appendChild(novo);
          } else {
            percorrer(n, destino);
          }
        }
      });
    })(doc.body, frag);
    return frag;
  }

  var ATRIBUTOS = ['href', 'src', 'alt'];

  function hidratarElemento(el, ctx, estado) {
    var provs = [];

    function buscar(caminho) {
      var r = ctx ? resolver(caminho, ctx) : DR.valor(caminho);
      if (r === undefined) {
        console.error('[hidratar] caminho inexistente: ' + caminho);
        return null;
      }
      if (r.provisorio && provs.indexOf(r.provisorio) === -1) provs.push(r.provisorio);
      return r;
    }

    var c = el.getAttribute('data-c');
    if (c !== null) {
      var r = buscar(c);
      if (r) el.textContent = String(r.v);
    }
    var h = el.getAttribute('data-c-html');
    if (h !== null) {
      var rh = buscar(h);
      if (rh) el.replaceChildren(sanitizar(String(rh.v)));
    }
    ATRIBUTOS.forEach(function (a) {
      var caminho = el.getAttribute('data-c-' + a);
      if (caminho === null) return;
      var ra = buscar(caminho);
      if (ra) el.setAttribute(a, String(ra.v));
    });

    if (provs.length) {
      el.setAttribute('data-provisorio', provs.join(' '));
      estado.provisorio = true;
    } else if (el.hasAttribute('data-provisorio')) {
      el.removeAttribute('data-provisorio');
    }
  }

  var SELETOR = '[data-c],[data-c-html],[data-c-href],[data-c-src],[data-c-alt]';

  function hidratarLista(ul, estado) {
    Array.prototype.slice.call(ul.children).forEach(function (f) {
      if (f.hasAttribute('data-gerado')) ul.removeChild(f);
    });
    var tpl = ul.querySelector(':scope > template');
    var r = DR.valor(ul.getAttribute('data-c-lista'));
    if (r === undefined) {
      console.error('[hidratar] caminho inexistente: ' + ul.getAttribute('data-c-lista'));
      return;
    }
    if (!tpl || !Array.isArray(r.v)) return;
    r.v.forEach(function (item) {
      var clone = tpl.content.cloneNode(true);
      var raizes = Array.prototype.slice.call(clone.children);
      raizes.forEach(function (n) {
        n.setAttribute('data-gerado', '');
        if (n.matches(SELETOR)) hidratarElemento(n, item, estado);
        Array.prototype.forEach.call(n.querySelectorAll(SELETOR), function (el) {
          hidratarElemento(el, item, estado);
        });
      });
      ul.insertBefore(clone, tpl);
    });
  }

  // Símbolos de img/icones/sprite-icones.svg embutidos: <use> com arquivo externo
  // é bloqueado via file://, então o sprite vai inline no documento (#dr-sprite).
  var SIMBOLOS = [
    '<symbol id="dr-favo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5 19 6.75 19 15.25 12 19.5 5 15.25 5 6.75Z"></path></symbol>',
    '<symbol id="dr-colmeia" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 19.5h17.2"></path><path d="M5 19.5C5 12 7.9 6.6 12 6.6S19 12 19 19.5"></path><path d="M6.4 15.6h11.2"></path><path d="M7.7 11.7h8.6"></path><path d="M10.5 19.5v-2a1.5 1.5 0 0 1 3 0v2"></path></symbol>',
    '<symbol id="dr-rainha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18h16"></path><path d="M4.4 18 3.2 7.6 8 11.2 12 5 16 11.2 20.8 7.6 19.6 18"></path><circle cx="3.2" cy="7.6" r="1.1"></circle><circle cx="12" cy="5" r="1.1"></circle><circle cx="20.8" cy="7.6" r="1.1"></circle></symbol>',
    '<symbol id="dr-abelha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="13.4" rx="3.3" ry="6.3"></ellipse><path d="M8.95 11.4h6.1M9.35 14.6h5.3"></path><path d="M8.7 9C5.5 6.8 4.7 10.2 7.9 11.5M15.3 9C18.5 6.8 19.3 10.2 16.1 11.5"></path><path d="M10.9 7.2 10.1 5.2M13.1 7.2 13.9 5.2"></path></symbol>',
    '<symbol id="dr-florada" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="2.1"></circle><circle cx="15.7" cy="10.7" r="2.1"></circle><circle cx="14.3" cy="15" r="2.1"></circle><circle cx="9.7" cy="15" r="2.1"></circle><circle cx="8.3" cy="10.7" r="2.1"></circle><circle cx="12" cy="11.6" r="1.3"></circle></symbol>',
    '<symbol id="dr-mel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.4c0 0 5.6 6 5.6 9.9a5.6 5.6 0 0 1-11.2 0C6.4 9.4 12 3.4 12 3.4Z"></path><path d="M9.6 13.6a2.4 2.4 0 0 0 2.4 2.4"></path></symbol>',
    '<symbol id="dr-mapa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10Z"></path><circle cx="12" cy="11" r="2"></circle></symbol>',
    '<symbol id="dr-drone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9.4" y="9.4" width="5.2" height="5.2" rx="1.4"></rect><circle cx="12" cy="12" r="0.9"></circle><path d="M9.4 9.4 6.6 6.6M14.6 9.4 17.4 6.6M9.4 14.6 6.6 17.4M14.6 14.6 17.4 17.4"></path><ellipse cx="5.4" cy="5.4" rx="2.9" ry="1.05"></ellipse><ellipse cx="18.6" cy="5.4" rx="2.9" ry="1.05"></ellipse><ellipse cx="5.4" cy="18.6" rx="2.9" ry="1.05"></ellipse><ellipse cx="18.6" cy="18.6" rx="2.9" ry="1.05"></ellipse></symbol>',
    '<symbol id="dr-producao" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"></path><path d="M7 20v-5.5M12 20v-9.5M17 20v-3.5"></path><circle cx="7" cy="13.4" r="1.5"></circle><circle cx="12" cy="9.4" r="1.5"></circle><circle cx="17" cy="15.4" r="1.5"></circle></symbol>',
    '<symbol id="dr-offline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.4a10 10 0 0 1 3.8-2.5M19 12.4a10 10 0 0 0-3.3-2.3M8 15.4a5.6 5.6 0 0 1 2.8-1.4M12 18.6h.01"></path><path d="m4 4 16 16"></path></symbol>',
    '<symbol id="dr-sincronizar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 9a8 8 0 0 1 13.3-3.4L20 8"></path><path d="M19.5 15a8 8 0 0 1-13.3 3.4L4 16"></path><path d="M20 3.5V8h-4.5M4 20.5V16h4.5"></path></symbol>',
    '<symbol id="dr-clima" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.9V5a2 2 0 1 0-4 0v9.9a4 4 0 1 0 4 0Z"></path><path d="M12 8.5v7"></path></symbol>',
    '<symbol id="dr-alerta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8.5a6 6 0 1 0-12 0c0 6.5-2.8 8.5-2.8 8.5h17.6S18 15 18 8.5"></path><path d="M10.4 20.5a2 2 0 0 0 3.2 0"></path></symbol>',
    '<symbol id="dr-revisao" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2.2"></rect><path d="M9 4v-.7A1.3 1.3 0 0 1 10.3 2h3.4A1.3 1.3 0 0 1 15 3.3V4"></path><path d="m8.8 13 2.3 2.3L15.6 11"></path></symbol>'
  ].join('');

  DR.injetarSprite = function () {
    if (document.getElementById('dr-sprite') || !document.body) return;
    var div = document.createElement('div');
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" id="dr-sprite" aria-hidden="true" ' +
      'style="position:absolute;width:0;height:0;overflow:hidden">' + SIMBOLOS + '</svg>';
    document.body.insertBefore(div.firstChild, document.body.firstChild);
  };

  DR.hidratar = function (raiz) {
    raiz = raiz || document;
    var estado = { provisorio: false };

    Array.prototype.forEach.call(raiz.querySelectorAll('[data-c-lista]'), function (ul) {
      if (ul.closest('[data-gerado]')) return;
      hidratarLista(ul, estado);
    });

    Array.prototype.forEach.call(raiz.querySelectorAll(SELETOR), function (el) {
      if (el.closest('[data-gerado]')) return;
      hidratarElemento(el, null, estado);
    });

    var aviso = document.querySelector('[data-aviso-provisorio]');
    if (document.querySelector('[data-provisorio]') !== null) {
      var rodape = document.querySelector('[data-secao="rodape"]');
      var txt = DR.valor('rodape.avisoProvisorio');
      if (!aviso && rodape && txt) {
        aviso = document.createElement('p');
        aviso.className = 'dr-caption';
        aviso.setAttribute('data-aviso-provisorio', '');
        aviso.textContent = String(txt.v);
        rodape.appendChild(aviso);
      }
    } else if (aviso) {
      aviso.remove();
    }

    document.dispatchEvent(new CustomEvent('conteudo:pronto'));
  };

  function iniciar() { DR.injetarSprite(); DR.hidratar(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})(window.DR);
