def test_parametros_validos(page, raiz_url):
    page.goto(raiz_url + "comparar.html?a=12&b=37")
    assert page.get_attribute("[data-cmp=frame-a]", "src").endswith("templates/12-placa.html")
    assert page.get_attribute("[data-cmp=frame-b]", "src").endswith("templates/37-linha.html")
def test_parametros_invalidos(page, raiz_url):
    page.goto(raiz_url + "comparar.html"); page.evaluate("localStorage.clear()")
    page.goto(raiz_url + "comparar.html?a=99&b=abc")
    assert page.get_attribute("[data-cmp=frame-a]", "src").endswith("01-folha.html")
    assert page.get_attribute("[data-cmp=frame-b]", "src").endswith("02-capa.html")
def test_padrao_usa_favoritos(page, raiz_url):
    page.goto(raiz_url + "comparar.html"); page.evaluate("localStorage.setItem('dr.favoritos','[5,21,33]')")
    page.goto(raiz_url + "comparar.html")
    assert "21-painel" in page.get_attribute("[data-cmp=frame-a]", "src") and "33-lanterna" in page.get_attribute("[data-cmp=frame-b]", "src")
def test_inverter_e_largura(page, raiz_url):
    page.goto(raiz_url + "comparar.html?a=1&b=2"); page.keyboard.press("s")
    assert "02-capa" in page.get_attribute("[data-cmp=frame-a]", "src") and "?a=2&b=1" in page.url
    page.check("[data-cmp=largura] input[value='390']")
    assert page.evaluate("document.querySelector('[data-cmp=frame-a]').getBoundingClientRect().width") == 390
def test_sync_repassa_scroll(page, raiz_url):
    page.goto(raiz_url + "comparar.html?a=1&b=2")
    page.evaluate("window.enviado=[]; const b=document.querySelector('[data-cmp=frame-b]'); b.contentWindow.postMessage=(m)=>enviado.push(m)")
    page.evaluate("window.dispatchEvent(new MessageEvent('message',{data:{tipo:'dr.scroll',ratio:0.5,template:1},source:document.querySelector('[data-cmp=frame-a]').contentWindow}))")
    assert page.evaluate("enviado.at(-1)") == {"tipo": "dr.scrollTo", "ratio": 0.5}
    antes = page.evaluate("enviado.length")  # o evaluate inicial chama o spy uma vez com null (Playwright invoca funções retornadas)
    page.uncheck("[data-cmp=sync]")
    page.evaluate("window.dispatchEvent(new MessageEvent('message',{data:{tipo:'dr.scroll',ratio:0.9,template:1},source:document.querySelector('[data-cmp=frame-a]').contentWindow}))")
    assert page.evaluate("enviado.length") == antes
def test_eco_nao_retransmite(page, raiz_url):
    page.goto(raiz_url + "comparar.html?a=1&b=2")
    page.evaluate("window.enviado=[]; const a=document.querySelector('[data-cmp=frame-a]'); a.contentWindow.postMessage=(m)=>enviado.push(m)")
    page.evaluate("window.dispatchEvent(new MessageEvent('message',{data:{tipo:'dr.scroll',ratio:0.5,template:1},source:document.querySelector('[data-cmp=frame-a]').contentWindow}))")
    antes = page.evaluate("enviado.length")
    page.evaluate("window.dispatchEvent(new MessageEvent('message',{data:{tipo:'dr.scroll',ratio:0.5,template:2},source:document.querySelector('[data-cmp=frame-b]').contentWindow}))")
    assert page.evaluate("enviado.length") == antes
def test_a_igual_b(page, raiz_url):
    page.goto(raiz_url + "comparar.html?a=7&b=7")
    assert page.get_attribute("[data-cmp=frame-b]", "src").endswith("08-estacao.html") and "?a=7&b=8" in page.url
def test_so_b(page, raiz_url):
    page.goto(raiz_url + "comparar.html?b=1")
    assert page.get_attribute("[data-cmp=frame-a]", "src").endswith("50-arquivo.html")
    assert page.get_attribute("[data-cmp=frame-b]", "src").endswith("01-folha.html")
def test_escape_abre_a(page, raiz_url):
    page.goto(raiz_url + "comparar.html?a=12&b=37"); page.keyboard.press("Escape")
    page.wait_for_url("**/templates/12-placa.html")
def test_largura_768(page, raiz_url):
    page.set_viewport_size({"width": 1800, "height": 900})
    page.goto(raiz_url + "comparar.html?a=1&b=2"); page.check("[data-cmp=largura] input[value='768']")
    assert page.evaluate("[...document.querySelectorAll('iframe')].map(f=>f.getBoundingClientRect().width)") == [768, 768]
