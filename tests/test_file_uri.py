"""Artefatos reais abertos via file:// (duplo clique no index.html)."""
from conftest import RAIZ

PRONTO = "document.addEventListener('conteudo:pronto', function(){ window.__drPronto = true; });"


def test_template_icones_via_file(page):
    erros = []
    page.on("pageerror", lambda e: erros.append(str(e)))
    page.add_init_script(PRONTO)
    page.goto((RAIZ / "templates/01-folha.html").as_uri())
    page.wait_for_function("window.__drPronto === true")
    assert page.locator("#dr-sprite").count() == 1
    assert page.locator("#dr-sprite symbol").count() == 14
    larguras = page.evaluate(
        "Array.from(document.querySelectorAll('main use')).map(u => u.getBoundingClientRect().width)")
    assert larguras, "nenhum <use> dentro de main"
    assert all(w > 0 for w in larguras), larguras
    assert not erros, erros


def test_galeria_via_file(page):
    page.goto((RAIZ / "galeria.html").as_uri())
    assert page.locator("[data-gal=card]").count() == 50
    altura = page.evaluate("document.documentElement.scrollHeight")
    y = 0
    while y < altura:
        page.evaluate(f"window.scrollTo(0, {y})")
        page.wait_for_timeout(100)
        y += 600
        altura = page.evaluate("document.documentElement.scrollHeight")
    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    page.wait_for_function(
        "document.querySelectorAll('[data-gal=placeholder]:not([hidden])').length === 0", timeout=10000)
    assert page.locator("[data-gal=placeholder]:not([hidden])").count() == 0


def test_comparar_via_file(page):
    page.goto((RAIZ / "comparar.html").as_uri() + "?a=12&b=37")
    for nome in ("frame-a", "frame-b"):
        frame = page.locator(f"[data-cmp={nome}]").element_handle().content_frame()
        # hidratado = todo slot do rodapé preenchido
        frame.wait_for_function(
            "(() => { const r = document.querySelector('[data-secao=rodape]');"
            " if (!r || !r.textContent.trim()) return false;"
            " return Array.from(r.querySelectorAll('[data-c]')).every(e => e.textContent.trim()); })()")
        assert frame.evaluate("document.querySelector('[data-secao=rodape]').textContent.trim()") != ""
        assert frame.evaluate("!document.querySelector('#dr-switcher')")
