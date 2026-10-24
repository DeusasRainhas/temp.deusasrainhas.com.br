# Landing 50 Templates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar 50 landings estáticas da Deusas Rainhas com o mesmo conteúdo e assinaturas visuais distintas, mais switcher flutuante, comparação lado a lado, galeria e verificação automática.

**Architecture:** Páginas HTML independentes em `templates/` que compartilham `css/tokens.css`, `css/base.css` e quatro scripts (`conteudo.js`, `hidratar.js`, `catalogo.js`, `switcher.js`). O conteúdo entra por hidratação de slots `data-c`. A unicidade é um dado em `catalogo.js` auditado por script; a qualidade é verificada por Playwright em todas as páginas.

**Tech Stack:** HTML, CSS, JS nativos; GSAP 3.12.5 + ScrollTrigger via cdnjs; Python 3 com pytest, pytest-playwright e Playwright (Chromium) só para testes e scripts.

**Spec:** `docs/superpowers/specs/2026-10-23-landing-50-templates-design.md`

## Global Constraints

- Sem build. Templates só referenciam `../css/tokens.css`, `../css/base.css`, os 4 JS compartilhados, GSAP em `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/{gsap.min.js,ScrollTrigger.min.js}`, Google Fonts e `../img/`.
- `css/tokens.css` é cópia byte a byte de `docs/brand/entrega_site/tokens.css`.
- Texto em pt-BR, tom do manual: "você", "a gente", sentence case, sem emoji, sem jargão, sem métricas de engenharia.
- Chaves `provisorio` são exatamente as de `docs/PENDENCIAS.md`.
- Cada template tem `<html lang="pt-BR" data-template="NN">` e os 11 `data-secao`: `hero, prova, problema, funcionalidades, como-funciona, para-quem, tecnologia, equipe, depoimento, contato, rodape`.
- Código próprio de um template até 150 KB. Funciona a 360px. `prefers-reduced-motion: reduce` desliga movimento sem esconder conteúdo.
- Mel nunca como texto corrido sobre creme; botão mel com texto `--terra-escura`; logo negativa sobre escuro; favo nunca atrás de texto corrido.
- Mensagens de commit em português, terminadas com `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Testes rodam com `.venv/bin/pytest tests/ -q`; servidor de teste é `http.server` na raiz, iniciado pelo `conftest.py`.

## Review Focus

1. Template aberto por `file://` sem servidor: a hidratação e o switcher precisam funcionar, porque o cliente vai clicar duas vezes no arquivo. Teste em Task 3 (`test_hidrata_via_file`).
2. `localStorage['dr.favoritos']` com JSON inválido ou indisponível: o switcher deve tratar como lista vazia e seguir funcionando. Teste em Task 5 (`test_favoritos_corrompidos`).
3. Página sem rolagem (`scrollHeight == innerHeight`): a razão de scroll deve ser 0, não `NaN`. Teste em Task 5 (`test_scroll_ratio_sem_rolagem`).
4. `comparar.html?a=99&b=abc`: parâmetros fora de 1–50 caem no padrão (favoritos, depois 01 e 02). Teste em Task 6 (`test_parametros_invalidos`).
5. `data-c-html` com `<script>` ou `onclick` no conteúdo: só `<em>`, `<strong>`, `<br>` sobrevivem. Teste em Task 3 (`test_html_sanitizado`).

---

### Task 0: Ambiente de testes

**Files:**
- Create: `scripts/requirements.txt`, `tests/conftest.py`, `tests/test_ambiente.py`, `.gitignore`

**Interfaces:**
- Produces: fixture pytest `raiz_url` (str, ex. `http://127.0.0.1:PORT/`) servindo a raiz do repo; fixture `page` do pytest-playwright; helper `tests/conftest.py::ler(path) -> str`.

- [ ] **Step 1: Escrever `scripts/requirements.txt`**

```
pytest>=8
pytest-playwright>=0.5
playwright>=1.45
```

- [ ] **Step 2: Criar venv e instalar**

Run: `python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt && .venv/bin/playwright install chromium`
Expected: termina sem erro; `.venv/bin/pytest --version` imprime a versão.

- [ ] **Step 3: Escrever `.gitignore`** com `.venv/`, `__pycache__/`, `.pytest_cache/`, `test-results/`.

- [ ] **Step 4: Escrever o teste `tests/test_ambiente.py`**

```python
def test_servidor_serve_raiz(page, raiz_url):
    r = page.goto(raiz_url + "css/tokens.css")
    assert r.status == 200
```

- [ ] **Step 5: Rodar e ver falhar**

Run: `.venv/bin/pytest tests/test_ambiente.py -q`
Expected: FAIL (fixture `raiz_url` não existe).

- [ ] **Step 6: Implementar `tests/conftest.py`**

Fixture de sessão `raiz_url`: inicia `http.server.ThreadingHTTPServer` com `SimpleHTTPRequestHandler` na raiz do repo (`Path(__file__).resolve().parents[1]`) em porta 0, numa `threading.Thread(daemon=True)`, devolve `http://127.0.0.1:{porta}/`, encerra no teardown. Helper `ler(path)` lê um arquivo relativo à raiz como texto. Copiar `docs/brand/entrega_site/tokens.css` para `css/tokens.css` neste passo para o teste ter um alvo.

- [ ] **Step 7: Rodar e ver passar**

Run: `.venv/bin/pytest tests/test_ambiente.py -q`
Expected: `1 passed`.

- [ ] **Step 8: Commit**

```bash
git add scripts/requirements.txt tests/ .gitignore css/tokens.css
git commit -m "Configura ambiente de testes com pytest e Playwright"
```

---

### Task 1: Assets e CSS base

**Files:**
- Create: `css/base.css`, `img/logos/*`, `img/icones/sprite-icones.svg`, `img/padroes/*`, `img/app/*`, `img/placeholders/{hero,equipe,depoimento}.svg`
- Test: `tests/test_assets.py`

**Interfaces:**
- Produces: classes `.dr-container` (max 1200px, gutter 16px), `.dr-btn`, `.dr-btn--primario`, `.dr-btn--secundario`, `.dr-btn--link`, `.dr-eyebrow` (já em tokens), utilitários `.dr-fundo-favo-claro`, `.dr-fundo-favo-escuro` (com scrim radial), `.dr-divisoria-circuito`, `.dr-sr-only`; regra global `@media (prefers-reduced-motion: reduce)` que zera `animation` e `transition`. Ícone: `<svg class="dr-icone"><use href="../img/icones/sprite-icones.svg#dr-colmeia"/></svg>`.
- Arquivos: `img/logos/{logo-abelha-cor,logo-completa,logo-negativa,logo-mono-grafite,logo-mono-terra,logo-mono-mel,coroa-cor,coroa-grafite,coroa-negativa,coroa-terra,centelha-negativo,fapeg,finep}.png`; `img/padroes/{circuito-divisoria,circuito-canto,circuito-vertical,favo-claro,favo-escuro,favo-mel}.svg`; `img/app/{01_dashboard_apiarios,02_lista_colmeias_status,03_inspecao_detalhada,banner_App}.png`.

- [ ] **Step 1: Escrever `tests/test_assets.py`**

```python
import hashlib
from conftest import RAIZ
def sha(p): return hashlib.sha256((RAIZ / p).read_bytes()).hexdigest()
def test_tokens_identico_ao_manual():
    assert sha("css/tokens.css") == sha("docs/brand/entrega_site/tokens.css")
def test_assets_existem():
    for p in ["img/logos/logo-abelha-cor.png","img/logos/coroa-cor.png","img/logos/logo-negativa.png",
              "img/logos/centelha-negativo.png","img/logos/fapeg.png","img/logos/finep.png",
              "img/icones/sprite-icones.svg","img/padroes/circuito-divisoria.svg","img/padroes/favo-claro.svg",
              "img/app/banner_App.png","img/placeholders/hero.svg","img/placeholders/equipe.svg","img/placeholders/depoimento.svg"]:
        assert (RAIZ / p).exists(), p
def test_base_css_tem_classes():
    css = (RAIZ / "css/base.css").read_text()
    for c in [".dr-container",".dr-btn--primario",".dr-fundo-favo-escuro","prefers-reduced-motion",".dr-sr-only"]:
        assert c in css, c
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `.venv/bin/pytest tests/test_assets.py -q` → FAIL (arquivos ausentes). Expor `RAIZ` em `conftest.py` se ainda não existir.

- [ ] **Step 3: Copiar assets** de `docs/brand/02_logos`, `docs/brand/04_icones/sprite-icones.svg`, `docs/brand/05_padroes`, e os 4 PNG de `/home/shx/Sync/code/clientes/deusasrainhas/deusasrainhas_app/frontend_deusasrainhas/screenshots/` para os caminhos acima.

- [ ] **Step 4: Criar os 3 placeholders SVG** em `img/placeholders/`: retângulo `--creme-papel` (#FBF6E3) com `favo-claro` como `<pattern>` a 40% e legenda em Hanken Grotesk 14px `--suave`: "Foto: apicultor no campo, luz natural" (hero, 1600×1000), "Foto: retrato, fundo neutro" (equipe, 600×600), "Foto: depoente no apiário" (depoimento, 600×600).

- [ ] **Step 5: Escrever `css/base.css`** com as classes do bloco Interfaces. `.dr-btn--primario`: fundo `--mel`, texto `--terra-escura`, hover `--mel-escuro`. `.dr-btn--secundario`: borda `--bd-forte`, texto `--terra`. `.dr-fundo-favo-escuro`: `background: radial-gradient(ellipse at center, rgba(32,32,32,.0), rgba(32,32,32,.6)), url(../img/padroes/favo-escuro.svg)`.

- [ ] **Step 6: Rodar e ver passar** → `3 passed`.

- [ ] **Step 7: Commit** `git add css img tests/test_assets.py && git commit -m "Adiciona assets da marca, placeholders e CSS base"`

---

### Task 2: Camada de conteúdo (`conteudo.js`)

**Files:**
- Create: `js/conteudo.js`
- Test: `tests/test_conteudo.py`

**Interfaces:**
- Produces: `window.DR_CONTEUDO` com esta árvore (valor = string ou `{v, provisorio}`):

```
hero: { eyebrow, titulo, subtitulo }
cta: { baixar: {texto, url}, falar: {texto, url}, ios: {texto, url, oculto: true} }
prova: { stats: [ {valor, rotulo} ×4 ] }
problema: { eyebrow, titulo, estatistica: {valor, texto}, consequencias: [ {texto} ×3 ] }
funcionalidades: { eyebrow, titulo, itens: [ {icone, titulo, texto} ×6 ] }
comoFunciona: { eyebrow, titulo, passos: [ {numero, titulo, texto, imagem, alt} ×3 ] }
paraQuem: { eyebrow, titulo, perfis: [ {titulo, texto} ×3 ] }
tecnologia: { eyebrow, titulo, texto, pilares: [ {icone, titulo, texto} ×4 ] }
equipe: { eyebrow, titulo, origem, pessoas: [ {nome, cargo, foto, alt} ×3 ], apoios: [ {nome, logo, alt} ×3 ] }
depoimento: { citacao, nome, local, foto }
contato: { eyebrow, titulo, texto, email, whatsapp, whatsappUrl, instagram, instagramUrl, formEndpoint,
           form: { nome, email, mensagem, enviar } }
precos: { gratis: {nome, preco, descricao}, pago: {nome, preco, descricao} }
rodape: { razaoSocial, cnpj, endereco, privacidade: {texto, url}, avisoProvisorio, direitos }
```

`icone` é um id do sprite (`dr-colmeia`, `dr-revisao`, `dr-offline`, `dr-mapa`, `dr-abelha`, `dr-producao`, `dr-drone`, `dr-sincronizar`, `dr-clima`, `dr-alerta`). `imagem`, `foto`, `logo` são caminhos relativos a `templates/` (`../img/...`).

- [ ] **Step 1: Escrever `tests/test_conteudo.py`**

```python
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
```

- [ ] **Step 2: Rodar e ver falhar** → FAIL (arquivo não existe).

- [ ] **Step 3: Escrever `js/conteudo.js`**

`window.DR_CONTEUDO = {...}` seguindo a árvore de Interfaces. Textos: reescrever os fatos do brief §4 no tom do manual (ex.: hero.titulo "Cuidar das abelhas ficou mais simples", subtitulo "Um app de gestão apícola que funciona mesmo sem sinal no apiário, feito por quem vive o campo."). Valores provisórios e suas chaves exatamente como a tabela do brief §7 / `PENDENCIAS.md`: `email`, `whatsapp` (texto e URL), `razao-social`, `cnpj`, `endereco`, `preco-gratis`, `preco-pago`, `play-store`, `form-endpoint` (`https://formspree.io/f/xxxxxxxx`), `depoimento` (citação, nome e local), `stat-apicultores` ("120"), `stat-colmeias` ("1.800"), `stat-municipios` ("38"), `equipe-3` (nome e cargo), `foto-hero`, `foto-equipe-1..3`, `foto-depoimento`, `apoios`. `rodape.avisoProvisorio` = "Site em construção. Dados de contato e números são provisórios." `cta.ios.oculto = true`. Apoios: `centelha-negativo.png` só funciona sobre escuro; registrar isso em `alt` e deixar o template decidir o fundo.

- [ ] **Step 4: Rodar e ver passar** → `4 passed`.

- [ ] **Step 5: Commit** `git add js/conteudo.js tests/test_conteudo.py && git commit -m "Adiciona camada de conteúdo com valores provisórios marcados"`

---

### Task 3: Hidratador (`hidratar.js`)

**Files:**
- Create: `js/hidratar.js`, `tests/fixtures/hidratar.html`
- Test: `tests/test_hidratar.py`

**Interfaces:**
- Consumes: `window.DR_CONTEUDO`.
- Produces: `window.DR = window.DR || {}; DR.hidratar(raiz = document)`; executa sozinho em `DOMContentLoaded`; atributos `data-c`, `data-c-html`, `data-c-href`, `data-c-src`, `data-c-alt`, `data-c-lista`; marca `data-provisorio`; insere `<p class="dr-caption" data-aviso-provisorio>` no `[data-secao="rodape"]`; dispara `conteudo:pronto` em `document`; `DR.valor(caminho) -> {v, provisorio|null}` para uso em scripts de template.

- [ ] **Step 1: Escrever a fixture `tests/fixtures/hidratar.html`**

Página mínima que carrega `../../js/conteudo.js` e `../../js/hidratar.js` e contém: `<h1 data-c="hero.titulo">`, `<a data-c="cta.baixar.texto" data-c-href="cta.baixar.url">`, `<p data-c-html="hero.subtitulo">`, `<ul data-c-lista="funcionalidades.itens"><template><li><b data-c="titulo"></b><span data-c="texto"></span></li></template></ul>`, `<span data-c="contato.email">`, `<span data-c="nao.existe">`, `<footer data-secao="rodape"></footer>`, e um `<script>` que registra `window.pronto = true` ao receber `conteudo:pronto`.

- [ ] **Step 2: Escrever `tests/test_hidratar.py`**

```python
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
```

- [ ] **Step 3: Rodar e ver falhar** → FAIL.

- [ ] **Step 4: Implementar `js/hidratar.js`**

`DR.valor(caminho)` resolve `a.b[0].c` sobre `DR_CONTEUDO` e normaliza para `{v, provisorio}`. `DR.hidratar(raiz)`: processa `data-c-lista` primeiro (remove filhos gerados anteriores marcados `data-gerado`, clona o `<template>` por item e hidrata o clone com caminhos relativos ao item), depois os demais atributos. `data-c-html`: converte via `DOMParser`, mantém apenas `em`, `strong`, `br` (texto dos demais elementos é preservado, tags removidas), sem atributos. Rehidratação idempotente (o aviso provisório não duplica). `console.error('[hidratar] caminho inexistente: ' + caminho)` quando `DR.valor` devolve `undefined`.

- [ ] **Step 5: Rodar e ver passar** → `7 passed`.

- [ ] **Step 6: Commit** `git add js/hidratar.js tests/fixtures tests/test_hidratar.py && git commit -m "Adiciona hidratador de conteúdo com marcação de provisórios"`

---

### Task 4: Catálogo e auditoria

**Files:**
- Create: `js/catalogo.js`, `scripts/auditar.py`, `tests/fixtures/catalogo_invalido.js`
- Test: `tests/test_auditar.py`

**Interfaces:**
- Produces: `window.DR_CATALOGO`: array de 50 objetos `{n, slug, nome, familia, hero, efeito, nav, cards, ritmo}` na ordem da spec §5.5; `window.DR_FAMILIAS`: array de `{id, nome}` nas 10 famílias; `DR.caminho(n) -> string` (href relativo ao documento atual: `./NN-slug.html` dentro de `templates/`, `templates/NN-slug.html` na raiz); `DR.atual() -> number|null` lido de `html[data-template]`. O arquivo começa com `window.DR_CATALOGO = [` e o array é JSON válido até `];` para o `auditar.py` extrair com regex.
- `scripts/auditar.py [caminho_catalogo] [--saida docs/CATALOGO.md]`: código 0 se válido, 1 com lista de violações no stdout.

- [ ] **Step 1: Escrever `tests/test_auditar.py`**

```python
import subprocess, sys
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
```

- [ ] **Step 2: Rodar e ver falhar** → FAIL.

- [ ] **Step 3: Escrever `js/catalogo.js`** transcrevendo as 50 linhas da spec §5.5 (hero e efeito literais, N/C/R como strings). `DR.caminho` decide o prefixo por `location.pathname.includes('/templates/')`.

- [ ] **Step 4: Escrever `tests/fixtures/catalogo_invalido.js`**: cópia do real com 4 defeitos: template 02 com o `efeito` do 01; N0 atribuído também ao 02 (6 usos); 02 com `cards: "C1"` (repete na família editorial); família campo com só 4 itens (remover o 10).

- [ ] **Step 5: Escrever `scripts/auditar.py`**

Extrai o JSON entre `window.DR_CATALOGO = ` e `];`. Verifica: 50 itens, `n` de 1 a 50 sem buracos; hero e efeito únicos ("efeito repetido: …", "hero repetido: …"); cada família com 5 ("familia X tem N"); por catálogo, item total ≤ 5 ("N0 usado 6 vezes") e por família ≤ 1 ("familia editorial usa C1 2 vezes"); `nav` em N0–N9, `cards` em C0–C9, `ritmo` em R0–R9. Gera `docs/CATALOGO.md`: título, data, tabela `| Nº | Slug | Família | Hero | Efeito | N | C | R |`, e abaixo uma tabela de uso por item de catálogo.

- [ ] **Step 6: Rodar e ver passar** → `3 passed`. Depois `./.venv/bin/python scripts/auditar.py js/catalogo.js` gera `docs/CATALOGO.md`.

- [ ] **Step 7: Commit** `git add js/catalogo.js scripts/auditar.py docs/CATALOGO.md tests/ && git commit -m "Adiciona catálogo dos 50 templates e auditoria de unicidade"`

---

### Task 5: Switcher (`switcher.js`)

**Files:**
- Create: `js/switcher.js`, `tests/fixtures/switcher.html`, `tests/fixtures/templates/01-folha.html` (stub), `tests/fixtures/templates/02-capa.html` (stub)
- Test: `tests/test_switcher.py`

**Interfaces:**
- Consumes: `DR_CATALOGO`, `DR_FAMILIAS`, `DR.caminho`, `DR.atual`, evento `conteudo:pronto`.
- Produces: DOM injetado no `body`: `#dr-switcher` com `[data-sw="pilula"]` (texto `NN / 50`), `[data-sw="painel"]` (atributo `hidden` quando fechado), `[data-sw="busca"]` (input), `[data-sw="item"][data-n="N"]` por template com `[data-sw="fav"]` (botão, `aria-pressed`), `[data-sw="nota"]` (textarea, visível ao expandir), `[data-sw="anterior"|"proximo"|"galeria"|"comparar"|"exportar"]`. Chaves: `localStorage['dr.favoritos']` (JSON array de números), `localStorage['dr.notas']` (JSON objeto), `sessionStorage['dr.scroll']` (string de número). API: `DR.switcher.ir(n)`, `DR.switcher.favoritos() -> number[]`, `DR.switcher.exportar() -> string`, `DR.switcher.scrollRatio() -> number`. Em iframe: não injeta `#dr-switcher`; envia `{tipo:'dr.scroll', ratio, template}` ao `parent` em cada scroll (throttle 50ms); aplica `{tipo:'dr.scrollTo', ratio}` recebido.
- Estilo do switcher embutido no próprio JS (`<style id="dr-switcher-css">`), usando só tokens; `z-index: 2147483000`.

- [ ] **Step 1: Escrever fixtures.** `tests/fixtures/switcher.html`: `<html data-template="01">`, carrega `conteudo.js`, `hidratar.js`, `catalogo.js`, `switcher.js`, `<footer data-secao="rodape">`, corpo com `height: 3000px`. Os dois stubs em `tests/fixtures/templates/` idem, com `data-template` 01 e 02 (o `DR.caminho` dentro deles resolve `./NN-slug.html`, por isso ficam numa pasta `templates/`).

- [ ] **Step 2: Escrever `tests/test_switcher.py`**

```python
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
```

- [ ] **Step 3: Rodar e ver falhar** → FAIL.

- [ ] **Step 4: Implementar `js/switcher.js`** conforme Interfaces e spec §6. Atalhos ignorados quando o foco está em `input`/`textarea` (exceto `Escape`). Favoritos: `try { JSON.parse } catch { [] }`, e `Array.isArray` obrigatório. `scrollRatio`: `max = scrollHeight - innerHeight; return max > 0 ? scrollY / max : 0`. Restauração: após `conteudo:pronto`, `requestAnimationFrame` → `scrollTo(0, ratio * max)` → `sessionStorage.removeItem`. Exportar: uma linha de cabeçalho e, por favorito, `NN Nome · família · hero · efeito · N C R` seguido de `nota: …` quando houver; copia com `navigator.clipboard.writeText` quando disponível e sempre devolve a string. `galeria` abre `DR.caminho`-relativo `../galeria.html` ou `galeria.html`; `comparar` abre `comparar.html?a=F1&b=F2` com os dois últimos favoritos, ou `a=atual&b=próximo` sem favoritos.

- [ ] **Step 5: Rodar e ver passar** → `9 passed`.

- [ ] **Step 6: Commit** `git add js/switcher.js tests/ && git commit -m "Adiciona switcher flutuante com favoritos, notas e scroll ratio"`

---

### Task 6: Comparar (`comparar.html`)

**Files:**
- Create: `comparar.html`
- Test: `tests/test_comparar.py`

**Interfaces:**
- Consumes: `DR_CATALOGO`, `DR.caminho`, mensagens `dr.scroll`/`dr.scrollTo`, `localStorage['dr.favoritos']`.
- Produces: `<select data-cmp="a">`, `<select data-cmp="b">`, `<button data-cmp="inverter">`, `<input type="checkbox" data-cmp="sync" checked>`, `<fieldset data-cmp="largura">` com radios `desktop|768|390`, `<iframe data-cmp="frame-a">`, `<iframe data-cmp="frame-b">`. URL atualizada via `history.replaceState` ao trocar seletores.

- [ ] **Step 1: Escrever `tests/test_comparar.py`**

```python
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
    page.uncheck("[data-cmp=sync]")
    page.evaluate("window.dispatchEvent(new MessageEvent('message',{data:{tipo:'dr.scroll',ratio:0.9,template:1},source:document.querySelector('[data-cmp=frame-a]').contentWindow}))")
    assert page.evaluate("enviado.length") == 1
```

Os testes 1–4 só exigem que os `src` sejam calculados; os templates reais chegam nas Tasks 9–19.

- [ ] **Step 2: Rodar e ver falhar** → FAIL.

- [ ] **Step 3: Escrever `comparar.html`** conforme spec §7: barra superior em grafite com tokens, dois iframes em `display: grid; grid-template-columns: 1fr 1fr` (desktop) ou largura fixa centralizada (768, 390). Validação: `n` inteiro em 1–50, senão padrão. Trava de eco: ao repassar `dr.scrollTo`, ignora o próximo `dr.scroll` vindo do destino por 100ms. `Esc` → `location.href = DR.caminho(a)`.

- [ ] **Step 4: Rodar e ver passar** → `5 passed`.

- [ ] **Step 5: Commit** `git add comparar.html tests/test_comparar.py && git commit -m "Adiciona modo de comparação lado a lado"`

---

### Task 7: Galeria e index

**Files:**
- Create: `galeria.html`, `index.html`
- Test: `tests/test_galeria.py`

**Interfaces:**
- Consumes: `DR_CATALOGO`, `DR_FAMILIAS`, `DR.caminho`, `img/thumbs/NN-desktop.webp`, `NN-mobile.webp`, `localStorage['dr.favoritos']`.
- Produces: `[data-gal="card"][data-n]` com `<img data-gal="thumb">` (fallback `onerror` troca por `<div data-gal="placeholder">` com nome e família), `[data-gal="fav"]`, chips `[data-gal="familia"][data-id]`, `[data-gal="so-favoritos"]` (checkbox), `[data-gal="busca"]`, `[data-gal="comparar"]`.

- [ ] **Step 1: Escrever `tests/test_galeria.py`**

```python
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
```

- [ ] **Step 2: Rodar e ver falhar** → FAIL.

- [ ] **Step 3: Escrever `galeria.html` e `index.html`** conforme spec §8. `index.html`: `<meta http-equiv="refresh" content="0; url=galeria.html">` e `<a href="galeria.html">`. Hover do card troca `src` para a miniatura mobile quando existir.

- [ ] **Step 4: Rodar e ver passar** → `4 passed`.

- [ ] **Step 5: Commit** `git add galeria.html index.html tests/test_galeria.py && git commit -m "Adiciona galeria dos templates e página de entrada"`

---

### Task 8: Verificador (`verificar.py`)

**Files:**
- Create: `scripts/verificar.py`, `tests/fixtures/templates/99-quebrado.html`
- Test: `tests/test_verificar.py`

**Interfaces:**
- Produces: `scripts/verificar.py [--apenas A-B] [--templates DIR] [--thumbs DIR] [--sem-thumbs]`; serve sempre a raiz do repo com `http.server`; descobre templates em `--templates` (padrão `templates/`, relativo à raiz) como `NN-*.html`; por template e viewport (1440×900, 390×844) aplica as 6 checagens da spec §9.1 e grava `--thumbs` (padrão `img/thumbs/`) `NN-desktop.webp` e `NN-mobile.webp`; imprime tabela `NN  slug  desktop  mobile  motivo`; código de saída 1 se qualquer falha. Função reutilizável `verificar_template(page, url) -> list[str]` (lista de motivos de falha, vazia se ok).

- [ ] **Step 1: Escrever a fixture `99-quebrado.html`**: cópia do stub `01-folha.html` com `data-template="99"`, sem `[data-secao="prova"]`, com um `<div style="width:2000px">` e um `<span data-c="nao.existe">`.

- [ ] **Step 2: Escrever `tests/test_verificar.py`**

```python
import subprocess
from conftest import RAIZ
PY = str(RAIZ / ".venv/bin/python")
def test_fixture_quebrada_falha():
    r = subprocess.run([PY, "scripts/verificar.py", "--templates", "tests/fixtures/templates", "--apenas", "99-99", "--sem-thumbs"], capture_output=True, text=True, cwd=RAIZ)
    assert r.returncode == 1
    for m in ["secao ausente: prova", "slot vazio ou inexistente: nao.existe", "rolagem horizontal"]:
        assert m in r.stdout, r.stdout
def test_apenas_filtra():
    r = subprocess.run([PY, "scripts/verificar.py", "--templates", "tests/fixtures/templates", "--apenas", "1-1", "--sem-thumbs"], capture_output=True, text=True, cwd=RAIZ)
    assert "99" not in r.stdout and "01" in r.stdout
```

Os stubs 01 e 02 das fixtures precisam ser completados com os 11 `data-secao` e um `data-c` em cada seção para passarem; GSAP incluído via CDN.

- [ ] **Step 3: Rodar e ver falhar** → FAIL.

- [ ] **Step 4: Implementar `scripts/verificar.py`** com Playwright sync API. Motivos de falha, textos exatos: `erro de console: …`, `requisicao falhou: URL STATUS`, `slot vazio ou inexistente: CAMINHO`, `secao ausente: NOME`, `rolagem horizontal: SCROLLW > INNERW`, `gsap ausente`, `switcher ausente`, `reduced-motion esconde: SECAO opacity=X`. Para reduced-motion: `context.new_page()` com `reduced_motion='reduce'`, rolar em passos de 600px até o fim, esperar 300ms, medir `getComputedStyle(sec).opacity` e `getBoundingClientRect().right <= innerWidth + 1`. Thumbs via `page.screenshot(type='webp', quality=80)` após rolar ao topo. `--apenas A-B` filtra pelo número.

- [ ] **Step 5: Rodar e ver passar** → `2 passed`.

- [ ] **Step 6: Commit** `git add scripts/verificar.py tests/ && git commit -m "Adiciona verificador Playwright dos templates"`

---

### Task 9: Template 01 Folha (referência)

**Files:**
- Create: `templates/01-folha.html`

**Interfaces:**
- Consumes: tudo das Tasks 1–5. Assinatura spec §5.5 linha 01: hero "Primeira página de jornal com manchete serifada e três colunas"; efeito "Capitular e revelação linha a linha ao rolar"; N0, C1, R0.
- Produces: o modelo que as Tasks 10–19 copiam: esqueleto da spec §3.2, comentários `<!-- SEÇÃO: nome -->` marcando cada bloco, padrão de uso de `data-c-lista` para funcionalidades, passos, perfis, pilares, pessoas, apoios e stats; padrão de `gsap.registerPlugin(ScrollTrigger)` dentro de `conteudo:pronto` e `gsap.matchMedia()` com `(prefers-reduced-motion: no-preference)` envolvendo todo movimento.

- [ ] **Step 1: Escrever `templates/01-folha.html`** seguindo a spec §3.2 e a assinatura. Hero em 3 colunas (`columns: 3` em desktop, 1 em celular), manchete `dr-display`, capitular via `::first-letter`. Revelação linha a linha: cada parágrafo dividido em `<span class="linha">` após `conteudo:pronto`, com `gsap.from` em stagger disparado por ScrollTrigger. N0 barra fixa, C1 listas com filetes, R0 `circuito-divisoria.svg` entre seções. Formulário de contato com `action` de `contato.formEndpoint` e `mailto` de fallback no texto. Apoios sobre faixa grafite (por causa de `centelha-negativo.png`). `cta.ios` renderizado com `hidden`.

- [ ] **Step 2: Verificar**

Run: `./.venv/bin/python scripts/verificar.py --apenas 1-1`
Expected: linha `01 folha ok ok` e código 0; `img/thumbs/01-desktop.webp` e `01-mobile.webp` criados.

- [ ] **Step 3: Revisão visual** das duas capturas contra a spec §5.6 (logo com área de proteção, mel não como texto, efeito visível). Corrigir e repetir o Step 2 até passar.

- [ ] **Step 4: Rodar a suíte inteira** `.venv/bin/pytest tests/ -q` → tudo verde.

- [ ] **Step 5: Commit** `git add templates/01-folha.html img/thumbs/01-*.webp && git commit -m "Adiciona template 01 Folha como referência"`

---

### Tasks 10–19: Famílias (uma task por família, executáveis em paralelo)

Cada task segue o mesmo roteiro. Família, números e assinaturas vêm da spec §5.5; o modelo é `templates/01-folha.html`.

| Task | Família | Templates |
|---|---|---|
| 10 | editorial | 02 capa, 03 dossie, 04 entrevista, 05 almanaque |
| 11 | campo | 06 horizonte, 07 diario, 08 estacao, 09 maos, 10 cerrado |
| 12 | circuito | 11 trilha, 12 placa, 13 nos, 14 sinal, 15 esquema |
| 13 | favo | 16 colmeia, 17 celula, 18 enxame, 19 cera, 20 quadro |
| 14 | dados | 21 painel, 22 caderno, 23 relatorio, 24 telemetria, 25 inventario |
| 15 | app | 26 vitrine, 27 passo, 28 tour, 29 bolso, 30 notificacao |
| 16 | cinema | 31 noite, 32 abertura, 33 lanterna, 34 letreiro, 35 projecao |
| 17 | minimo | 36 silencio, 37 linha, 38 pausa, 39 carta, 40 indice |
| 18 | narrativa | 41 jornada, 42 rainha, 43 perdas, 44 dia, 45 origem |
| 19 | estrutural | 46 blocos, 47 poster, 48 manifesto, 49 tabela, 50 arquivo |

**Files:** Create `templates/NN-slug.html` para cada template da família. Modify `js/catalogo.js` somente se permutar N/C/R dentro da família (hero e efeito não mudam).

**Interfaces:** Consumes Tasks 1–5 e o modelo da Task 9. Produces: páginas que passam no `verificar.py`.

- [ ] **Step 1: Ler** a spec §3.1, §3.2, §5.5 (linhas da família), §5.6, e `templates/01-folha.html`.
- [ ] **Step 2: Para cada template da família, escrever `templates/NN-slug.html`**: esqueleto da §3.2, os 11 `data-secao`, hidratação por `data-c`, o hero e o efeito literais da assinatura, N/C/R da linha (permutação dentro da família permitida). CSS e JS no próprio arquivo, até 150 KB. Todo movimento dentro de `gsap.matchMedia` com `(prefers-reduced-motion: no-preference)`; efeitos de cursor com fallback em `pointer: coarse`.
- [ ] **Step 3: Se permutou N/C/R**, editar as linhas correspondentes em `js/catalogo.js` e rodar `./.venv/bin/python scripts/auditar.py js/catalogo.js` → código 0.
- [ ] **Step 4: Verificar** `./.venv/bin/python scripts/verificar.py --apenas A-B` (números da família) → todas as linhas `ok ok`, código 0.
- [ ] **Step 5: Revisão visual** das 10 capturas em `img/thumbs/` contra a spec §5.6 e a presença do efeito. Corrigir e repetir o Step 4.
- [ ] **Step 6: Commit** `git add templates/ img/thumbs/ js/catalogo.js docs/CATALOGO.md && git commit -m "Adiciona templates da família <nome> (NN–MM)"`

---

### Task 20: Fechamento

**Files:**
- Modify: `docs/brief-site-institucional.md` (adicionar seção "9. Protótipos: 50 templates"), `docs/CATALOGO.md` (regenerar), `img/thumbs/*` (regenerar completo)

- [ ] **Step 1: Verificação completa** `./.venv/bin/python scripts/verificar.py` → 50 linhas `ok ok`, código 0, 100 miniaturas em `img/thumbs/`.
- [ ] **Step 2: Auditoria** `./.venv/bin/python scripts/auditar.py js/catalogo.js` → código 0, `docs/CATALOGO.md` atualizado.
- [ ] **Step 3: Suíte** `.venv/bin/pytest tests/ -q` → tudo verde.
- [ ] **Step 4: Galeria** abrir `galeria.html` no Playwright (`page.goto`) e confirmar `page.locator("[data-gal=placeholder]").count() == 0` (todas as miniaturas carregaram).
- [ ] **Step 5: Atualizar o brief** com a seção 9: como abrir (`index.html`), como avaliar (switcher, atalhos, comparar, exportar) e como me devolver a escolha (texto do Exportar).
- [ ] **Step 6: Commit** `git add -A && git commit -m "Fecha os 50 templates: miniaturas, catálogo e instruções de avaliação"`
