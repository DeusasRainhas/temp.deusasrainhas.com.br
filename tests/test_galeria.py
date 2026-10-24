def test_50_cards_e_links(page, raiz_url):
    page.goto(raiz_url + "galeria.html")
    assert page.locator("[data-gal=card]").count() == 50
    assert page.get_attribute("[data-gal=card][data-n='12'] a", "href") == "templates/12-placa.html"
    assert page.get_attribute("[data-gal=card][data-n='12'] [data-gal=fav]", "aria-label") == "Favoritar 12 Placa"
def test_filtro_familia_e_favoritos(page, raiz_url):
    page.goto(raiz_url + "galeria.html"); page.evaluate("localStorage.setItem('dr.favoritos','[2,9]')"); page.reload()
    page.click("[data-gal=familia][data-id='campo']"); assert page.locator("[data-gal=card]:visible").count() == 5
    page.click("[data-gal=familia][data-id='campo']"); page.check("[data-gal=so-favoritos]")
    assert page.locator("[data-gal=card]:visible").count() == 2
def test_placeholder_sem_thumb(page, raiz_url):
    page.goto(raiz_url + "galeria.html")
    page.locator("[data-gal=card][data-n='50']").scroll_into_view_if_needed()
    page.evaluate("document.querySelector('[data-gal=card][data-n=\"50\"] [data-gal=thumb]').src = 'img/thumbs/nao-existe.webp'")
    page.wait_for_selector("[data-gal=card][data-n='50'] [data-gal=thumb][hidden]", state="attached")
    assert page.is_visible("[data-gal=card][data-n='50'] [data-gal=placeholder]")
def test_index_redireciona(page, raiz_url):
    page.goto(raiz_url + "index.html"); page.wait_for_url("**/galeria.html")
def test_busca_sem_acento(page, raiz_url):
    page.goto(raiz_url + "galeria.html")
    page.fill("[data-gal=busca]", "odometro")
    vis = page.locator("[data-gal=card]:visible")
    assert vis.count() == 1 and vis.first.get_attribute("data-n") == "21"
    page.fill("[data-gal=busca]", "celula")
    ns = [c.get_attribute("data-n") for c in page.locator("[data-gal=card]:visible").all()]
    assert "17" in ns  # nome "Celula"; outros cards casam por "células" no efeito
def test_comparar_href_com_favoritos(page, raiz_url):
    page.goto(raiz_url + "galeria.html"); page.evaluate("localStorage.setItem('dr.favoritos','[5,21,33]')"); page.reload()
    assert page.get_attribute("a[data-gal=comparar]", "href").endswith("comparar.html?a=33&b=21")
def test_favoritos_corrompidos(page, raiz_url):
    erros = []
    page.on("pageerror", lambda e: erros.append(e))
    page.goto(raiz_url + "galeria.html"); page.evaluate("localStorage.setItem('dr.favoritos','{nope')"); page.reload()
    assert page.locator("[data-gal=card]").count() == 50
    page.click("[data-gal=card][data-n='7'] [data-gal=fav]")
    assert page.evaluate("JSON.parse(localStorage.getItem('dr.favoritos'))") == [7]
    assert erros == []
