import re
from conftest import RAIZ
def carregar(page, raiz_url):
    page.set_content("<html></html>")
    page.add_script_tag(url=raiz_url + "js/conteudo.js")
    return page.evaluate("window.DR_CONTEUDO")
def chaves_pendencias():
    txt = (RAIZ / "docs/PENDENCIAS.md").read_text()
    return set(re.findall(r"- \[[ x]\] `([a-z0-9-]+)`", txt))
def provisorios(obj, acc):
    if isinstance(obj, dict):
        if "provisorio" in obj: acc.add(obj["provisorio"])
        for v in obj.values(): provisorios(v, acc)
    elif isinstance(obj, list):
        for v in obj: provisorios(v, acc)
    return acc
def textos(obj, acc):
    if isinstance(obj, str): acc.append(obj)
    elif isinstance(obj, dict):
        for v in obj.values(): textos(v, acc)
    elif isinstance(obj, list):
        for v in obj: textos(v, acc)
    return acc
def test_secoes_e_contagens(page, raiz_url):
    c = carregar(page, raiz_url)
    for k in ["hero","cta","prova","problema","funcionalidades","comoFunciona","paraQuem","tecnologia","equipe","depoimento","contato","precos","rodape"]:
        assert k in c, k
    assert len(c["prova"]["stats"]) == 4 and len(c["funcionalidades"]["itens"]) == 6
    assert len(c["comoFunciona"]["passos"]) == 3 and len(c["equipe"]["pessoas"]) == 3 and len(c["equipe"]["apoios"]) == 3
def test_provisorios_batem_com_pendencias(page, raiz_url):
    usados = provisorios(carregar(page, raiz_url), set())
    assert usados <= chaves_pendencias(), usados - chaves_pendencias()
    for obrig in ["email","whatsapp","razao-social","cnpj","depoimento","play-store","form-endpoint","preco-pago","stat-apicultores","equipe-3"]:
        assert obrig in usados, obrig
def test_valores_fixos(page, raiz_url):
    c = carregar(page, raiz_url)
    assert c["contato"]["email"]["v"] == "contato@deusasrainhas.com.br"
    assert c["contato"]["whatsappUrl"]["v"] == "https://wa.me/5562999990000"
    assert c["rodape"]["cnpj"]["v"] == "00.000.000/0001-00"
    assert c["cta"]["baixar"]["url"]["v"] == "https://play.google.com/store/apps/details?id=com.deusasrainhas.app.v2"
    assert c["depoimento"]["nome"]["v"] == "Maria do Socorro"
    assert c["equipe"]["pessoas"][0]["nome"] == "Carolina Cyrino"
def test_tom_de_voz(page, raiz_url):
    todos = " ".join(textos(carregar(page, raiz_url), []))
    assert not re.search(r"[\U0001F300-\U0001FAFF☀-➿]", todos), "emoji"
    for proibido in [r"\bRAG\b", "SentenceBERT", "384", "tecnologia de ponta", "end-to-end", "testes automatizados", "<200ms"]:
        assert not re.search(proibido, todos), proibido
    assert "a gente" in todos.lower()
