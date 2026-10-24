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

  function iniciar() { DR.hidratar(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})(window.DR);
