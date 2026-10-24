import pytest
from conftest import RAIZ
FIX = "tests/fixtures/hidratar.html"
def abrir(page, raiz_url):
    erros = []
    page.on("console", lambda m: erros.append(m.text) if m.type == "error" else None)
    page.goto(raiz_url + FIX); page.wait_for_function("window.pronto === true")
    return erros
def test_texto_href_e_lista(page, raiz_url):
    abrir(page, raiz_url)
    assert page.text_content("h1") == page.evaluate("DR_CONTEUDO.hero.titulo")
    assert page.get_attribute("a", "href") == page.evaluate("DR_CONTEUDO.cta.baixar.url.v")
    assert page.locator("ul li").count() == 6
    assert page.text_content("ul li:first-child b") == page.evaluate("DR_CONTEUDO.funcionalidades.itens[0].titulo")
def test_marca_provisorio_e_aviso(page, raiz_url):
    abrir(page, raiz_url)
    assert page.get_attribute("[data-c='contato.email']", "data-provisorio") == "email"
    assert page.get_attribute("a", "data-provisorio") == "play-store"
    assert page.text_content("[data-aviso-provisorio]") == "Site em construção. Dados de contato e números são provisórios."
def test_caminho_inexistente_loga_erro(page, raiz_url):
    erros = abrir(page, raiz_url)
    assert any("nao.existe" in e for e in erros)
def test_html_sanitizado(page, raiz_url):
    abrir(page, raiz_url)
    page.evaluate("DR_CONTEUDO.hero.subtitulo = 'a <em>b</em> <script>x()</script> <a onclick=1>c</a>'; DR.hidratar()")
    html = page.inner_html("[data-c-html]")
    assert "<em>b</em>" in html and "<script" not in html and "onclick" not in html and "<a" not in html
def test_hidrata_via_file(page):
    page.goto((RAIZ / FIX).as_uri()); page.wait_for_function("window.pronto === true")
    assert page.text_content("h1").strip() != ""
def test_lista_vazia_nao_quebra(page, raiz_url):
    abrir(page, raiz_url)
    page.evaluate("DR_CONTEUDO.funcionalidades.itens = []; DR.hidratar()")
    assert page.locator("ul li").count() == 0 and page.locator("ul template").count() == 1
def test_valor(page, raiz_url):
    abrir(page, raiz_url)
    assert page.evaluate("DR.valor('contato.email')") == {"v": "contato@deusasrainhas.com.br", "provisorio": "email"}
    assert page.evaluate("DR.valor('hero.titulo').provisorio") is None
