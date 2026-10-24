# Deusas Rainhas — Pacote de identidade para o site

Tudo o que é preciso para aplicar a marca na web. O manual completo (PDF) acompanha este pacote. Se houver dúvida, o manual prevalece.

## Conteúdo

- `logos/` — PNG com fundo transparente
  - `logo-abelha-cor.png` — **versão preferencial**, sobre fundos claros (creme, branco)
  - `logo-completa.png` — abelha + nome
  - `logo-negativa.png` — para fundos escuros (grafite, terra escura). Nunca use a versão colorida sobre fundo escuro.
  - `logo-mono-grafite / -terra / -mel.png` — 1 cor (ex.: logo sobre fundo mel → grafite)
  - `coroa-*.png` — submarca para tamanhos pequenos: **favicon**, avatar e cabeçalho compacto
- `icones/` — conjunto próprio em SVG (traço 1,8px, `stroke="currentColor"`: a cor herda do texto). `sprite-icones.svg` reúne todos como `<symbol id="dr-…">`. Para ícones genéricos que não existem aqui, use **Lucide** (mesmo peso).
- `padroes/` — motivos gráficos em SVG
  - `circuito-*.svg` — trilha de circuito (vem da asa da abelha): divisórias, cantos, trilha vertical. Sempre em traço fino.
  - `favo-*.svg` — favo de mel em padrão repetível, para fundos. Sobre fundo escuro, use com sutileza e nunca atrás de texto corrido.
- `css/tokens.css` — variáveis CSS de cor, tipografia, espaçamento, raios e sombras, além de classes de texto prontas (`.dr-h1`, `.dr-body`, `.dr-eyebrow`…).

## Cores

| Papel | Token | HEX |
|---|---|---|
| Fundo principal | `--creme` | #FFFBE6 |
| Superfície alternativa | `--creme-papel` | #FBF6E3 |
| Destaque primário (mel) | `--mel` | #F5C02C |
| Hover/pressed do mel | `--mel-escuro` | #D9A521 |
| Títulos | `--terra-escura` | #4E342E |
| Terra | `--terra` | #6D4C41 |
| Texto de corpo | `--corpo` | #4A4036 |
| Texto forte | `--ink` | #2B2622 |
| Contraste / seções escuras | `--grafite` | #202020 |
| Digital: links, dados | `--petroleo` | #176B66 |

Proporção de uso aproximada: creme 60%, terra 25%, mel 12%, petróleo 3%.
O mel é cor de destaque (botões, realces, números). Não use em texto corrido sobre creme, porque o contraste é baixo. Botão mel leva texto terra escura.

## Tipografia (Google Fonts, gratuitas)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Hanken+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/tokens.css">
```

- **Newsreader** (serifada, peso 500) — títulos e citações
- **Hanken Grotesk** — corpo, menus, botões, interface
- **JetBrains Mono** — rótulos curtos em CAIXA ALTA com espaçamento largo (eyebrows), números e dados

Títulos em *sentence case*: só a primeira letra maiúscula.

## Regras da logo

- **Área de proteção:** margem livre igual à altura da coroa, nos quatro lados.
- **Tamanho mínimo:** 32px de altura para a logo completa. Abaixo disso, use a coroa.
- **Nunca:** distorcer, recolorir, girar, aplicar sombra, reduzir a opacidade ou usar sobre fundo de baixo contraste.

## Tom de voz

Próximo e competente. Fale com o leitor como "você" e, quando se referir à marca, use "a gente". Frases simples, sem jargão ("Funciona mesmo sem sinal no apiário", e não "Tecnologia offline-first de ponta"). **Sem emoji.**

## Fotografia

Luz natural e quente: campo, abelhas, mãos, colmeias. Evite banco de imagens frio e 3D genérico.

Contato: deusasrainhas@gmail.com · deusasrainhas.com.br · @deusasrainhas
