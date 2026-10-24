import json
FIX = "tests/fixtures/switcher.html"
T = "tests/fixtures/templates/"
def abrir(page, raiz_url, path=FIX):
    page.goto(raiz_url + path); page.wait_for_selector("#dr-switcher")
def test_pilula_e_painel(page, raiz_url):
    abrir(page, raiz_url)
    assert page.text_content("[data-sw=pilula]").split() == ["01", "/", "50"]
    assert page.get_attribute("[data-sw=painel]", "hidden") is not None
    page.click("[data-sw=pilula]")
    assert page.get_attribute("[data-sw=painel]", "hidden") is None
    assert page.locator("[data-sw=item]").count() == 50
    page.keyboard.press("Escape"); assert page.get_attribute("[data-sw=painel]", "hidden") is not None
def test_busca_filtra(page, raiz_url):
    abrir(page, raiz_url); page.keyboard.press("/")
    page.fill("[data-sw=busca]", "odômetro")
    assert page.locator("[data-sw=item]:visible").count() == 1
    assert page.get_attribute("[data-sw=item]:visible", "data-n") == "21"
def test_setas_navegam(page, raiz_url):
    abrir(page, raiz_url, T + "01-folha.html"); page.keyboard.press("ArrowRight")
    page.wait_for_url("**/02-capa.html"); page.wait_for_selector("#dr-switcher")
    page.keyboard.press("ArrowLeft"); page.wait_for_url("**/01-folha.html")
def test_favorito_e_nota_persistem(page, raiz_url):
    abrir(page, raiz_url); page.keyboard.press("f")
    assert json.loads(page.evaluate("localStorage.getItem('dr.favoritos')")) == [1]
    page.click("[data-sw=pilula]"); page.click("[data-sw=item][data-n='3']")
    page.fill("[data-sw=item][data-n='3'] [data-sw=nota]", "muito editorial"); page.keyboard.press("Tab")
    assert json.loads(page.evaluate("localStorage.getItem('dr.notas')")) == {"3": "muito editorial"}
    txt = page.evaluate("DR.switcher.exportar()")
    assert "01 Folha" in txt and "editorial" in txt and "Capitular" in txt
def test_favoritos_corrompidos(page, raiz_url):
    page.goto(raiz_url + FIX); page.evaluate("localStorage.setItem('dr.favoritos', '{nope')"); page.reload()
    page.wait_for_selector("#dr-switcher"); assert page.evaluate("DR.switcher.favoritos()") == []
def test_scroll_ratio_e_restauracao(page, raiz_url):
    abrir(page, raiz_url, T + "01-folha.html"); page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    r = page.evaluate("DR.switcher.scrollRatio()"); assert 0.99 <= r <= 1.0
    page.evaluate("DR.switcher.ir(2)"); page.wait_for_url("**/02-capa.html"); page.wait_for_timeout(300)
    assert page.evaluate("window.scrollY") > 1000 and page.evaluate("sessionStorage.getItem('dr.scroll')") is None
def test_scroll_ratio_sem_rolagem(page, raiz_url):
    abrir(page, raiz_url); page.evaluate("document.body.style.height='10px'")
    assert page.evaluate("DR.switcher.scrollRatio()") == 0
def test_tecla_h_oculta(page, raiz_url):
    abrir(page, raiz_url); page.keyboard.press("h"); assert not page.is_visible("[data-sw=pilula]")
def test_em_iframe_nao_mostra_e_posta(page, raiz_url):
    page.set_content(f"<iframe src='{raiz_url}{FIX}' style='height:400px'></iframe><script>window.msgs=[];addEventListener('message',e=>msgs.push(e.data))</script>")
    f = page.frame_locator("iframe"); f.locator("[data-secao=rodape]").wait_for()
    assert f.locator("#dr-switcher").count() == 0
    page.frames[1].evaluate("window.scrollTo(0, 1500)"); page.wait_for_timeout(200)
    m = page.evaluate("msgs.at(-1)"); assert m["tipo"] == "dr.scroll" and m["template"] == 1 and 0 < m["ratio"] <= 1
    page.frames[1].evaluate("window.postMessage({tipo:'dr.scrollTo', ratio:0}, '*')"); page.wait_for_timeout(100)
    assert page.frames[1].evaluate("window.scrollY") == 0
def test_storage_bloqueado(page, raiz_url):
    erros = []; page.on("pageerror", lambda e: erros.append(e))
    page.add_init_script("Object.defineProperty(window,'localStorage',{get(){ throw new Error('blocked') }}); Object.defineProperty(window,'sessionStorage',{get(){ throw new Error('blocked') }})")
    abrir(page, raiz_url)
    assert page.evaluate("DR.switcher.favoritos()") == []
    page.keyboard.press("f")
    assert page.evaluate("DR.switcher.favoritos()") == [1]
    assert erros == []
def test_throttle_envia_posicao_final(page, raiz_url):
    page.set_content(f"<iframe src='{raiz_url}{FIX}' style='height:400px'></iframe><script>window.msgs=[];addEventListener('message',e=>msgs.push(e.data))</script>")
    page.frame_locator("iframe").locator("[data-secao=rodape]").wait_for()
    fr = page.frames[1]
    # Dois eventos de scroll separados dentro da janela de 50ms: o segundo cai no throttle.
    fr.evaluate("addEventListener('scroll', () => window.scrollTo(0,1500), {once:true}); window.scrollTo(0,500)")
    page.wait_for_timeout(150)
    esperado = fr.evaluate("DR.switcher.scrollRatio()")
    assert abs(page.evaluate("msgs.at(-1)")["ratio"] - esperado) < 0.01
def test_nota_por_teclado(page, raiz_url):
    abrir(page, raiz_url); page.click("[data-sw=pilula]")
    page.locator("[data-sw=item][data-n='3'] [data-sw=expandir]").focus(); page.keyboard.press("Enter")
    assert page.is_visible("[data-sw=item][data-n='3'] [data-sw=nota]")
    assert page.get_attribute("[data-sw=item][data-n='3'] [data-sw=expandir]", "aria-expanded") == "true"
