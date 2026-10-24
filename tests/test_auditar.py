import subprocess
from conftest import RAIZ
PY = str(RAIZ / ".venv/bin/python")
def rodar(*args):
    return subprocess.run([PY, str(RAIZ / "scripts/auditar.py"), *args], capture_output=True, text=True, cwd=RAIZ)
def test_catalogo_real_passa(tmp_path):
    r = rodar("js/catalogo.js", "--saida", str(tmp_path / "C.md"))
    assert r.returncode == 0, r.stdout
    md = (tmp_path / "C.md").read_text()
    assert md.count("\n| ") >= 51 and "| 50 | arquivo |" in md
def test_catalogo_invalido_falha():
    r = rodar("tests/fixtures/catalogo_invalido.js")
    assert r.returncode == 1
    for msg in ["efeito repetido", "N0 usado 6", "familia editorial usa C1 2", "familia campo tem 4"]:
        assert msg in r.stdout, r.stdout
def test_catalogo_js_carrega(page, raiz_url):
    page.set_content("<html data-template='12'></html>")
    page.add_script_tag(url=raiz_url + "js/catalogo.js")
    assert page.evaluate("DR_CATALOGO.length") == 50
    assert page.evaluate("DR_CATALOGO[11]") == {"n":12,"slug":"placa","nome":"Placa","familia":"circuito",
        "hero":"Grade de componentes de placa com a abelha como chip central",
        "efeito":"Células acendem em sequência (stagger em grade)","nav":"N3","cards":"C5","ritmo":"R5"}
    assert page.evaluate("DR.atual()") == 12
    assert page.evaluate("DR.caminho(7)") == "templates/07-diario.html"
