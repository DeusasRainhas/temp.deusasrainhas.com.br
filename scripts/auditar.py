#!/usr/bin/env python3
"""Audita js/catalogo.js (unicidade das assinaturas) e gera docs/CATALOGO.md."""
import argparse
import json
import re
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
FAMILIAS = ["editorial", "campo", "circuito", "favo", "dados", "app",
            "cinema", "minimo", "narrativa", "estrutural"]
CATALOGOS = [("nav", "N", "Navegação"), ("cards", "C", "Cards"), ("ritmo", "R", "Ritmo")]


def extrair(caminho):
    texto = Path(caminho).read_text(encoding="utf-8")
    m = re.search(r"window\.DR_CATALOGO = (\[.*?\]);", texto, re.S)
    if not m:
        raise SystemExit("window.DR_CATALOGO não encontrado em %s" % caminho)
    return json.loads(m.group(1))


def validar(itens):
    erros = []
    if len(itens) != 50:
        erros.append("esperados 50 itens, encontrados %d" % len(itens))
    ns = sorted(i["n"] for i in itens)
    if ns != list(range(1, 51)):
        erros.append("n deve cobrir 1 a 50 sem buracos nem repetições: %s" % ns)
    for campo in ("efeito", "hero"):
        vistos = {}
        for i in itens:
            if i[campo] in vistos:
                erros.append("%s repetido: %02d e %02d: %s" % (campo, vistos[i[campo]], i["n"], i[campo]))
            else:
                vistos[i[campo]] = i["n"]
    por_fam = defaultdict(list)
    for i in itens:
        por_fam[i["familia"]].append(i)
        if i["familia"] not in FAMILIAS:
            erros.append("%02d: familia desconhecida %s" % (i["n"], i["familia"]))
    for f in FAMILIAS:
        if len(por_fam[f]) != 5:
            erros.append("familia %s tem %d (esperado 5)" % (f, len(por_fam[f])))
    for campo, letra, _ in CATALOGOS:
        total = defaultdict(int)
        for i in itens:
            cod = i[campo]
            if not re.fullmatch(letra + "[0-9]", str(cod)):
                erros.append("%02d: %s inválido (%s)" % (i["n"], campo, cod))
            total[cod] += 1
        for cod, q in sorted(total.items()):
            if q > 5:
                erros.append("%s usado %d vezes (máximo 5)" % (cod, q))
        for f, lista in por_fam.items():
            cont = defaultdict(int)
            for i in lista:
                cont[i[campo]] += 1
            for cod, q in sorted(cont.items()):
                if q > 1:
                    erros.append("familia %s usa %s %d vezes (máximo 1)" % (f, cod, q))
    return erros


def celula(s):
    return str(s).replace("|", "\\|")


def markdown(itens):
    L = ["# Catálogo dos 50 templates", "",
         "Gerado em %s por scripts/auditar.py" % date.today().isoformat(), "",
         "| Nº | Slug | Família | Hero | Efeito | N | C | R |",
         "|---|---|---|---|---|---|---|---|"]
    for i in sorted(itens, key=lambda x: x["n"]):
        L.append("| %02d | %s | %s | %s | %s | %s | %s | %s |" % (
            i["n"], i["slug"], i["familia"], celula(i["hero"]), celula(i["efeito"]),
            i["nav"], i["cards"], i["ritmo"]))
    L += ["", "## Uso dos catálogos", ""]
    for campo, letra, nome in CATALOGOS:
        L += ["### %s (%s)" % (nome, letra), "", "| Item | Usos | Templates |", "|---|---|---|"]
        for d in range(10):
            cod = "%s%d" % (letra, d)
            ts = ["%02d" % i["n"] for i in sorted(itens, key=lambda x: x["n"]) if i[campo] == cod]
            L.append("| %s | %d | %s |" % (cod, len(ts), ", ".join(ts)))
        L.append("")
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("catalogo", nargs="?", default=str(RAIZ / "js/catalogo.js"))
    ap.add_argument("--saida", default=str(RAIZ / "docs/CATALOGO.md"))
    a = ap.parse_args()
    itens = extrair(a.catalogo)
    erros = validar(itens)
    if erros:
        print("\n".join(erros))
        return 1
    Path(a.saida).write_text(markdown(itens), encoding="utf-8")
    print("Catálogo válido: %s" % a.saida)
    return 0


if __name__ == "__main__":
    sys.exit(main())
