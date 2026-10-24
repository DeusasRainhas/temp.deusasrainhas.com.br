import hashlib
import re
from conftest import RAIZ


def sha(p):
    return hashlib.sha256((RAIZ / p).read_bytes()).hexdigest()


def test_tokens_identico_ao_manual():
    assert sha("css/tokens.css") == sha("docs/brand/entrega_site/tokens.css")


def test_assets_existem():
    for p in ["img/logos/logo-abelha-cor.png", "img/logos/coroa-cor.png", "img/logos/logo-negativa.png",
              "img/logos/centelha-negativo.png", "img/logos/fapeg.png", "img/logos/finep.png",
              "img/icones/sprite-icones.svg", "img/padroes/circuito-divisoria.svg", "img/padroes/favo-claro.svg",
              "img/placeholders/hero.svg", "img/placeholders/equipe.svg",
              "img/placeholders/depoimento.svg"]:
        assert (RAIZ / p).exists(), p


def test_base_css_tem_classes():
    css = (RAIZ / "css/base.css").read_text()
    for c in [".dr-container", ".dr-btn--primario", ".dr-fundo-favo-escuro", "prefers-reduced-motion", ".dr-sr-only"]:
        assert c in css, c


def test_base_css_nao_redefine_tokens():
    css = (RAIZ / "css/base.css").read_text()
    assert "@import" not in css
    assert re.search(r"--(mel|terra|grafite|creme|petroleo|ink|corpo)[a-z-]*\s*:", css) is None
    assert "background-color: var(--grafite)" in css
