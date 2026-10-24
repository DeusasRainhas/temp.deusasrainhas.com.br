def test_servidor_serve_raiz(page, raiz_url):
    r = page.goto(raiz_url + "css/tokens.css")
    assert r.status == 200
