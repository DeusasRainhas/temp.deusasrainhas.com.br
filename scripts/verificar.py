#!/usr/bin/env python3
"""Verificador dos templates: abre cada um no Chromium (desktop e mobile),
aplica as checagens da spec e grava as miniaturas usadas pela galeria."""
import argparse
import functools
import re
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import TimeoutError as PlaywrightTimeout

RAIZ = Path(__file__).resolve().parents[1]
SECOES = ["hero", "prova", "problema", "funcionalidades", "como-funciona",
          "para-quem", "tecnologia", "equipe", "depoimento", "contato", "rodape"]
VIEWPORTS = {"desktop": {"width": 1440, "height": 900},
             "mobile": {"width": 390, "height": 844}}
PRONTO = ("document.querySelector('[data-aviso-provisorio], [data-secao=rodape]')"
          " && window.DR && document.readyState==='complete'")
SLOTS_VAZIOS = """() => Array.from(document.querySelectorAll('[data-c],[data-c-html]'))
  .filter(e => !e.textContent.trim())
  .map(e => e.getAttribute('data-c') || e.getAttribute('data-c-html'))"""


class _Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def servir():
    handler = functools.partial(_Handler, directory=str(RAIZ))
    servidor = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=servidor.serve_forever, daemon=True).start()
    return servidor


def _curto(texto, n=120):
    texto = " ".join(str(texto).split())
    return texto if len(texto) <= n else texto[:n]


def _abrir(page, url):
    """Navega e espera a hidratação.

    Devolve (hidratou, slots_vazios, erros, requisicoes)."""
    erros, requisicoes = [], []
    page.on("console", lambda m: erros.append(m.text) if m.type == "error" else None)
    page.on("response", lambda r: requisicoes.append((r.url, r.status)) if r.status >= 400 else None)
    page.on("requestfailed", lambda r: requisicoes.append((r.url, r.failure or "falhou")))
    page.add_init_script(
        "document.addEventListener('conteudo:pronto', function(){ window.__drPronto = true; });")
    page.goto(url, wait_until="load")
    try:
        page.wait_for_function(
            "window.__drPronto === true && document.readyState === 'complete'", timeout=10000)
    except PlaywrightTimeout:
        return False, [], erros, requisicoes
    vazios = []
    for _ in range(4):
        vazios = page.evaluate(SLOTS_VAZIOS)
        if not vazios:
            break
        page.wait_for_timeout(250)
    return True, vazios, erros, requisicoes


def verificar_template(page, url, viewport_nome="desktop", thumb=None):
    """Roda as checagens num viewport; devolve a lista de motivos (vazia se ok)."""
    motivos = []
    try:
        hidratou, vazios, erros, requisicoes = _abrir(page, url)
        if not hidratou:
            motivos.append("hidratacao nao concluiu")
        for caminho in dict.fromkeys(vazios):
            motivos.append(f"slot vazio ou inexistente: {caminho}")
        for nome in SECOES:
            if page.locator(f'[data-secao="{nome}"]').count() == 0:
                motivos.append(f"secao ausente: {nome}")
        if viewport_nome == "mobile":
            sw, iw = page.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
            if sw > iw:
                motivos.append(f"rolagem horizontal: {sw} > {iw}")
        if page.evaluate("typeof window.gsap === 'undefined'"):
            motivos.append("gsap ausente")
        if not page.evaluate("!!document.querySelector('#dr-switcher')"):
            motivos.append("switcher ausente")
        for texto in erros:
            motivos.append(f"erro de console: {_curto(texto)}")
        for u, status in requisicoes:
            motivos.append(f"requisicao falhou: {u} {status}")
        if thumb is not None:
            page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
            page.wait_for_timeout(200)
            thumb.parent.mkdir(parents=True, exist_ok=True)
            page.screenshot(path=str(thumb), type="webp", quality=80)
    except Exception as e:  # noqa: BLE001 - timeouts etc. viram motivo, não crash
        motivos.append(_curto(f"excecao: {type(e).__name__}: {e}"))
    return motivos


MEDIR_MOVIMENTO = """() => {
  const saida = [];
  const iw = window.innerWidth;
  document.querySelectorAll('[data-secao]').forEach(sec => {
    const nome = sec.getAttribute('data-secao');
    const r = sec.getBoundingClientRect();
    saida.push({tipo: 'sec', nome, op: parseFloat(getComputedStyle(sec).opacity),
                left: r.left, right: r.right, altura: r.height, iw});
    let n = 0;
    sec.querySelectorAll('*').forEach(el => {
      if (n >= 5) return;
      const proprio = Array.from(el.childNodes)
        .some(c => c.nodeType === 3 && c.nodeValue.trim() !== '');
      if (!proprio) return;
      const cs = getComputedStyle(el);
      const op = parseFloat(cs.opacity);
      if (op < 0.9 || cs.visibility === 'hidden') {
        n++;
        saida.push({tipo: 'el', nome, op, tag: el.localName,
                    classe: el.classList.length ? el.classList[0] : ''});
      }
    });
  });
  return saida;
}"""


def verificar_movimento_reduzido(page, url):
    motivos = []
    try:
        hidratou = _abrir(page, url)[0]
        if not hidratou:
            motivos.append("reduced-motion: hidratacao nao concluiu")
        altura = page.evaluate("document.documentElement.scrollHeight")
        y = 0
        while True:
            page.evaluate(f"window.scrollTo({{top: {y}, behavior: 'instant'}})")
            page.wait_for_timeout(150)
            if y >= altura:
                break
            y += 600
        page.wait_for_timeout(300)
        for m in page.evaluate(MEDIR_MOVIMENTO):
            if m["tipo"] == "el":
                motivos.append(f"reduced-motion esconde: {m['nome']} {m['tag']}.{m['classe']} opacity={m['op']}")
                continue
            if m["op"] < 0.9:
                motivos.append(f"reduced-motion esconde: {m['nome']} opacity={m['op']}")
            if m["altura"] == 0:
                motivos.append(f"reduced-motion esconde: {m['nome']} altura=0")
            if m["right"] > m["iw"] + 1 or m["left"] < -1:
                motivos.append(f"reduced-motion fora da tela: {m['nome']}")
    except Exception as e:  # noqa: BLE001
        motivos.append(_curto(f"excecao: {type(e).__name__}: {e}"))
    return motivos


def verificar_completo(browser, url, num, thumbs):
    """Devolve {'desktop': [...], 'mobile': [...]}; reduced-motion conta no desktop."""
    resultado = {}
    for nome, vp in VIEWPORTS.items():
        ctx = browser.new_context(viewport=vp)
        try:
            page = ctx.new_page()
            page.set_default_timeout(15000)
            thumb = thumbs / f"{num}-{nome}.webp" if thumbs else None
            resultado[nome] = verificar_template(page, url, nome, thumb)
        finally:
            ctx.close()
    ctx = browser.new_context(viewport=VIEWPORTS["desktop"], reduced_motion="reduce")
    try:
        page = ctx.new_page()
        page.set_default_timeout(15000)
        resultado["desktop"] += verificar_movimento_reduzido(page, url)
    finally:
        ctx.close()
    return resultado


def descobrir(pasta, apenas):
    lo, hi = 0, 99
    if apenas:
        m = re.fullmatch(r"(\d+)-(\d+)", apenas)
        if not m:
            sys.exit("--apenas espera A-B, ex.: 1-10")
        lo, hi = int(m.group(1)), int(m.group(2))
    achados = []
    for f in sorted(pasta.glob("[0-9][0-9]-*.html")):
        if lo <= int(f.name[:2]) <= hi:
            achados.append(f)
    return achados


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--apenas", help="intervalo A-B pelo número do template")
    ap.add_argument("--templates", default="templates")
    ap.add_argument("--thumbs", default="img/thumbs")
    ap.add_argument("--sem-thumbs", action="store_true")
    args = ap.parse_args(argv)

    pasta = (RAIZ / args.templates).resolve()
    thumbs = None if args.sem_thumbs else (RAIZ / args.thumbs)
    arquivos = descobrir(pasta, args.apenas)
    if not arquivos:
        print("FALHA: nenhum template encontrado")
        return 1
    rel = pasta.relative_to(RAIZ).as_posix()

    from playwright.sync_api import sync_playwright
    servidor = servir()
    porta = servidor.server_address[1]
    falhos = 0
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            try:
                for f in arquivos:
                    num = f.name[:2]
                    slug = f.stem[3:]
                    url = f"http://127.0.0.1:{porta}/{rel}/{f.name}"
                    res = verificar_completo(browser, url, num, thumbs)
                    distintos = list(dict.fromkeys(res["desktop"] + res["mobile"]))
                    st = lambda k: "FALHA" if res[k] else "ok"
                    print(f"{num}  {slug}  {st('desktop')}  {st('mobile')}  {'; '.join(distintos)}".rstrip(), flush=True)
                    falhos += bool(distintos)
            finally:
                browser.close()
    finally:
        servidor.shutdown()
        servidor.server_close()
    if falhos:
        print(f"FALHA: {falhos} de {len(arquivos)} templates")
        return 1
    print(f"OK: {len(arquivos)}/{len(arquivos)} templates")
    return 0


if __name__ == "__main__":
    sys.exit(main())
