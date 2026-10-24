def test_50_cards_e_links(page, raiz_url):
    page.goto(raiz_url + "galeria.html")
    assert page.locator("[data-gal=card]").count() == 50
    assert page.get_attribute("[data-gal=card][data-n='12'] a", "href") == "templates/12-placa.html"
def test_filtro_familia_e_favoritos(page, raiz_url):
    page.goto(raiz_url + "galeria.html"); page.evaluate("localStorage.setItem('dr.favoritos','[2,9]')"); page.reload()
    page.click("[data-gal=familia][data-id='campo']"); assert page.locator("[data-gal=card]:visible").count() == 5
    page.click("[data-gal=familia][data-id='campo']"); page.check("[data-gal=so-favoritos]")
    assert page.locator("[data-gal=card]:visible").count() == 2
def test_placeholder_sem_thumb(page, raiz_url):
    page.goto(raiz_url + "galeria.html")
    page.evaluate("document.querySelector('[data-gal=card][data-n=\"50\"] [data-gal=thumb]').src = 'img/thumbs/nao-existe.webp'")
    page.wait_for_selector("[data-gal=card][data-n='50'] [data-gal=placeholder]")
def test_index_redireciona(page, raiz_url):
    page.goto(raiz_url + "index.html"); page.wait_for_url("**/galeria.html")
