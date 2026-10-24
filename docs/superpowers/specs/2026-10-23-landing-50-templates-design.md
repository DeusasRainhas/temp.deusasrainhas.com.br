# Landing institucional Deusas Rainhas: 50 templates com seletor

Data: 2026-10-23 · Estado: aprovado em conversa, aguardando revisão escrita

## 1. Objetivo

Produzir 50 versões visualmente distintas da landing institucional da Deusas Rainhas, todas com o mesmo conteúdo e todas dentro do manual da marca, mais um seletor flutuante, um modo de comparação lado a lado e uma galeria, para que o cliente escolha de 1 a 3 finalistas. Os 50 são material de decisão. O site final nasce do finalista escolhido, em fase posterior.

Fontes de verdade, nesta ordem:
1. `docs/brand/01_manual/Manual de Identidade Visual.pdf` e `docs/brand/entrega_site/`
2. `docs/brief-site-institucional.md` (arquitetura da informação, públicos, tom)
3. `docs/PENDENCIAS.md` (valores provisórios e suas chaves)

## 2. Decisões fechadas

| Tema | Decisão |
|---|---|
| Fidelidade | Os 50 obedecem ao manual: cores, fontes, logo, área de proteção, sentence case, sem emoji. Variam composição, layout, ritmo, motion e efeitos |
| Stack | HTML, CSS e JS estáticos, sem build. GSAP 3 com ScrollTrigger via CDN com versão fixa. Nenhuma outra biblioteca |
| Arquitetura | 50 páginas HTML independentes que compartilham tokens, base, conteúdo e switcher. Trocar template é navegar para outro arquivo |
| Conteúdo | Um único `js/conteudo.js` hidrata todos os templates. Textos reescritos no tom do manual. Valores provisórios marcados por chave |
| Avaliação | Switcher com lista, favoritos, notas e exportação; `comparar.html` com dois iframes; `galeria.html` com miniaturas |
| Verificação | Playwright em todas as páginas em desktop e celular; auditoria de unicidade do catálogo; revisão visual por família |

## 3. Estrutura de arquivos

```
/
├── index.html                  redireciona para galeria.html
├── galeria.html                grade com 50 miniaturas e filtros
├── comparar.html               dois iframes lado a lado
├── css/
│   ├── tokens.css              cópia intacta de docs/brand/entrega_site/tokens.css
│   └── base.css                reset, .dr-container, .dr-btn, utilitários de favo e circuito, reduced-motion
├── js/
│   ├── conteudo.js             todo o texto do site em um objeto; valores provisórios marcados
│   ├── hidratar.js             preenche slots data-c e marca data-provisorio
│   ├── switcher.js             menu flutuante, favoritos, notas, atalhos, scroll ratio
│   └── catalogo.js             os 50: número, slug, nome, família, assinatura
├── img/
│   ├── logos/                  de docs/brand/02_logos (inclui selos Centelha, FAPEG, FINEP)
│   ├── icones/sprite-icones.svg
│   ├── padroes/                circuito-*.svg, favo-*.svg
│   ├── app/                    screenshots de deusasrainhas_app/frontend_deusasrainhas/screenshots
│   ├── placeholders/           blocos de foto provisória (SVG) para hero, equipe, depoimento
│   └── thumbs/                 NN-desktop.webp e NN-mobile.webp gerados pelo verificar.py
├── templates/
│   ├── 01-folha.html … 50-arquivo.html
├── scripts/
│   ├── verificar.py            Playwright: checa e captura os 50
│   ├── auditar.py              valida unicidade do catálogo e gera docs/CATALOGO.md
│   └── requirements.txt        playwright
└── docs/
    ├── brief-site-institucional.md
    ├── PENDENCIAS.md
    ├── CATALOGO.md             gerado
    └── superpowers/specs/      esta spec
```

### 3.1 Regras de dependência de um template

Um template pode referenciar apenas:
- `../css/tokens.css`, `../css/base.css`
- `../js/conteudo.js`, `../js/hidratar.js`, `../js/catalogo.js`, `../js/switcher.js`
- GSAP e ScrollTrigger de `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/`
- Google Fonts com o link exato do manual (Newsreader, Hanken Grotesk, JetBrains Mono)
- Arquivos em `../img/`

Todo CSS e JS específico do template fica no próprio arquivo, em `<style>` e `<script>`. Um template nunca referencia outro. Tamanho do código próprio: até 150 KB.

### 3.2 Esqueleto obrigatório de um template

```html
<!doctype html>
<html lang="pt-BR" data-template="12">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Deusas Rainhas · 12 Placa</title>
  <link rel="icon" href="../img/logos/coroa-cor.png">
  <!-- preconnect + link do Google Fonts conforme docs/brand/entrega_site/LEIA-ME.md -->
  <link rel="stylesheet" href="../css/tokens.css">
  <link rel="stylesheet" href="../css/base.css">
  <style>/* CSS do template */</style>
</head>
<body>
  <nav data-secao="nav">…</nav>
  <main>
    <section data-secao="hero">…</section>
    <section data-secao="prova">…</section>
    <section data-secao="problema">…</section>
    <section data-secao="funcionalidades">…</section>
    <section data-secao="como-funciona">…</section>
    <section data-secao="para-quem">…</section>
    <section data-secao="tecnologia">…</section>
    <section data-secao="equipe">…</section>
    <section data-secao="depoimento">…</section>
    <section data-secao="contato">…</section>
  </main>
  <footer data-secao="rodape">…</footer>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="../js/conteudo.js"></script>
  <script src="../js/hidratar.js"></script>
  <script src="../js/catalogo.js"></script>
  <script src="../js/switcher.js"></script>
  <script>
    document.addEventListener('conteudo:pronto', () => { /* efeitos do template */ });
  </script>
</body>
</html>
```

As 11 seções (`nav` não conta; `hero` até `rodape` contam) são obrigatórias. Duas seções podem ser fundidas em um só bloco visual, mas cada `data-secao` precisa existir no DOM, mesmo que como filho da outra. Omitir uma seção é falha no `verificar.py`.

## 4. Camada de conteúdo

### 4.1 `conteudo.js`

Define `window.DR_CONTEUDO`, um objeto com uma chave por seção. Textos em português, no tom do manual: "você", "a gente", sentence case, frases curtas, sem jargão, sem emoji, sem métricas de engenharia. Os fatos vêm do site em produção, da descrição da Play Store e do pitch (ver brief, seção 4).

Um valor pode ser string ou objeto `{ v, provisorio }`:

```js
contato: {
  email:    { v: 'contato@deusasrainhas.com.br', provisorio: 'email' },
  whatsapp: { v: '+55 (62) 99999-0000', provisorio: 'whatsapp' },
  whatsappUrl: { v: 'https://wa.me/5562999990000', provisorio: 'whatsapp' },
  instagram: '@deusasrainhas',
}
```

As chaves de `provisorio` são exatamente as de `docs/PENDENCIAS.md`. Listas (funcionalidades, passos, públicos, equipe, stats) são arrays de objetos com campos nomeados e, quando houver, um campo `icone` com o id do sprite (`dr-colmeia`, `dr-revisao`, …).

Conteúdo mínimo por seção:

| Seção | Campos |
|---|---|
| hero | eyebrow, titulo, subtitulo, cta primário (texto, url), cta secundário (texto, url) |
| prova | 4 stats: valor, rotulo |
| problema | eyebrow, titulo, estatistica (valor, texto), 3 consequencias |
| funcionalidades | eyebrow, titulo, 6 itens: icone, titulo, texto |
| como-funciona | eyebrow, titulo, 3 passos: numero, titulo, texto, screenshot |
| para-quem | eyebrow, titulo, 3 perfis: titulo, texto |
| tecnologia | eyebrow, titulo, texto, 4 pilares: icone, titulo, texto |
| equipe | eyebrow, titulo, origem (texto sobre Cocalzinho), 3 pessoas: nome, cargo, foto; apoios: 3 selos |
| depoimento | citacao, nome, local, foto |
| contato | eyebrow, titulo, texto, email, whatsapp, whatsappUrl, instagram, instagramUrl, formEndpoint, campos do formulário (rótulos e placeholders) |
| rodape | razaoSocial, cnpj, endereco, links (privacidade), avisoProvisorio |
| cta | baixar (texto, url, provisorio play-store), ios (texto, url, oculto) |
| precos | gratis (nome, preco, descricao), pago (nome, preco, descricao) |

### 4.2 `hidratar.js`

Ao carregar:
1. Para cada elemento com `data-c="caminho.da.chave"`, define `textContent`. `data-c-html` permite marcação mínima (somente `<em>`, `<strong>`, `<br>`), para templates que destacam palavras.
2. `data-c-href`, `data-c-src`, `data-c-alt` definem os atributos correspondentes.
3. `data-c-lista="funcionalidades.itens"` em um elemento com um filho `<template>` repete o filho para cada item, hidratando os `data-c` relativos dentro dele.
4. Se o valor é `{ v, provisorio }`, usa `v` e adiciona `data-provisorio="<chave>"` ao elemento.
5. Se qualquer `data-provisorio` foi aplicado, insere no `[data-secao="rodape"]` um `<p class="dr-caption" data-aviso-provisorio>` com `rodape.avisoProvisorio`.
6. Dispara `document.dispatchEvent(new CustomEvent('conteudo:pronto'))`.

Slot cujo caminho não existe lança `console.error` com o caminho. Isso é o que o `verificar.py` captura.

Templates que precisam dividir texto em palavras ou letras fazem isso no handler de `conteudo:pronto`, nunca antes.

## 5. Sistema de unicidade

### 5.1 Assinatura

Cada template tem uma assinatura em cinco eixos, registrada em `catalogo.js`:

```js
{ n: 12, slug: 'placa', nome: 'Placa', familia: 'circuito',
  hero: 'Grade de componentes de placa com a abelha como chip central',
  efeito: 'Células acendem em sequência (stagger em grade)',
  nav: 'N4', cards: 'C3', ritmo: 'R2' }
```

Invariantes, verificados por `auditar.py`:
- `hero` e `efeito` são únicos entre os 50.
- `nav`, `cards` e `ritmo` vêm dos catálogos de 10 abaixo. Cada item aparece no máximo 5 vezes no total e no máximo 1 vez por família.
- Toda família tem exatamente 5 templates.

Átomos da marca podem repetir livremente: tokens, escala tipográfica, `.dr-btn`, `.dr-eyebrow`, logo, ícones do sprite, padrões SVG como textura.

### 5.2 Catálogo de navegação (N)

| Id | Padrão |
|---|---|
| N0 | Barra superior fixa com logo à esquerda e CTA à direita |
| N1 | Trilho lateral vertical com ícones do sprite |
| N2 | Pílula inferior centralizada, estilo app |
| N3 | Barra que se oculta ao descer e reaparece ao subir |
| N4 | Botão hambúrguer que abre overlay em tela cheia |
| N5 | Índice em coluna fixa à esquerda com seções e progresso |
| N6 | Pontos de navegação laterais, um por seção |
| N7 | Barra de progresso no topo com rótulos de seção |
| N8 | Botão coroa no canto que expande em leque |
| N9 | Cabeçalho que encolhe ao rolar e vira só coroa + CTA |

### 5.3 Catálogo de cards e números (C)

| Id | Tratamento |
|---|---|
| C0 | Cards com borda hairline `--linha`, raio `--r-lg`, ícone em petróleo |
| C1 | Sem borda, itens separados por filetes horizontais, como lista |
| C2 | Tiles sólidos em `--creme-papel` com número grande em mono |
| C3 | Cards com `circuito-canto.svg` no canto superior |
| C4 | Hexágonos (clip-path), conteúdo centralizado |
| C5 | Linhas de tabela com sparkline SVG |
| C6 | Cards com `--sh-md` e tilt 3D sutil no hover |
| C7 | Blocos de borda grossa 2px terra, sem raio |
| C8 | Fichas brancas com eyebrow e dado em destaque |
| C9 | Chips e pílulas em fluxo, estilo nuvem de tags |

### 5.4 Catálogo de ritmo entre seções (R)

| Id | Ritmo |
|---|---|
| R0 | `circuito-divisoria.svg` entre todas as seções |
| R1 | Faixas alternando `--creme` e `--creme-papel` |
| R2 | Blocos full-bleed grafite intercalados com creme |
| R3 | Hairlines e muito espaço em branco |
| R4 | Número de seção gigante em mono como marcador |
| R5 | `favo-claro.svg` como fundo em seções alternadas |
| R6 | Seções como cartões de canto `--r-xl` sobre o creme |
| R7 | Scroll contínuo sem divisões; só a tipografia marca a mudança |
| R8 | Grade visível com linhas e bordas grossas |
| R9 | Fundo muda por seção: creme, papel, superfície, véu de mel |

### 5.5 Os 50

Famílias em ordem: editorial, campo, circuito, favo, dados, app, cinema, minimo, narrativa, estrutural. A atribuição de N, C e R abaixo é a padrão e satisfaz os invariantes. O implementador de uma família pode permutar N, C ou R entre os 5 templates da família para melhor encaixe semântico, e pode trocar um item com outra família desde que `auditar.py` continue passando. O que não pode mudar sem revisar esta spec: hero e efeito.

| Nº | Slug | Família | Conceito de hero | Efeito principal | N | C | R |
|---|---|---|---|---|---|---|---|
| 01 | folha | editorial | Primeira página de jornal com manchete serifada e três colunas | Capitular e revelação linha a linha ao rolar | N0 | C1 | R0 |
| 02 | capa | editorial | Capa de revista: título display 64px full-bleed sobre creme | Letras do título entram em cascata (stagger de caracteres) | N1 | C3 | R3 |
| 03 | dossie | editorial | Dossiê com sumário lateral e título numerado | Índice fixo destaca a seção atual e mostra progresso | N2 | C5 | R6 |
| 04 | entrevista | editorial | Pergunta em serifa itálica, resposta em sans | Perguntas e respostas aparecem em máquina de escrever | N3 | C7 | R9 |
| 05 | almanaque | editorial | Grade de fichas técnicas como almanaque agrícola | Fichas viram (flip 3D) ao entrar na tela | N4 | C9 | R2 |
| 06 | horizonte | campo | Foto full-bleed do campo com título na linha do horizonte | Parallax em três camadas com scrub | N1 | C2 | R1 |
| 07 | diario | campo | Diário de um dia no apiário, hora a hora | Linha do tempo horizontal pinada ao scroll | N2 | C4 | R4 |
| 08 | estacao | campo | Floradas do ano em quatro blocos de estação | Temperatura de cor dos fundos muda ao rolar (variáveis CSS animadas) | N3 | C6 | R7 |
| 09 | maos | campo | Close de mãos e colmeia, título sobreposto | Imagens revelam por clip-path a partir do centro | N4 | C8 | R0 |
| 10 | cerrado | campo | Mapa de Goiás em SVG com Cocalzinho marcado | Pinos do mapa caem em sequência e ligam linhas | N5 | C0 | R3 |
| 11 | trilha | circuito | Uma trilha de circuito atravessa toda a página | Traço SVG desenha com stroke-dashoffset conforme o scroll | N2 | C3 | R2 |
| 12 | placa | circuito | Grade de componentes de placa com a abelha como chip central | Células acendem em sequência (stagger em grade) | N3 | C5 | R5 |
| 13 | nos | circuito | Nós terminais como pontos de ancoragem do layout | Linhas em canvas conectam as seções seguindo o scroll | N4 | C7 | R8 |
| 14 | sinal | circuito | Dados viajando do apiário ao celular | Pulsos percorrem trilhas via offset-path | N5 | C9 | R1 |
| 15 | esquema | circuito | Blueprint técnico com grade e coordenadas | Grade e cotas revelam por seção, estilo desenho técnico | N6 | C1 | R4 |
| 16 | colmeia | favo | Grade hexagonal preenchendo o hero | Hexágonos expandem no hover e no toque | N3 | C4 | R3 |
| 17 | celula | favo | Uma célula hexagonal gigante emoldura a foto | Máscara hexagonal revela a imagem ao rolar | N4 | C6 | R6 |
| 18 | enxame | favo | Partículas douradas sobre creme | Partículas em canvas se organizam em hexágonos | N5 | C8 | R9 |
| 19 | cera | favo | Hero com nível de mel subindo | Preenchimento líquido sobe nas seções (altura animada com onda) | N6 | C0 | R2 |
| 20 | quadro | favo | Quadro de colmeia antes e depois | Divisor arrastável compara caderno e app | N7 | C2 | R5 |
| 21 | painel | dados | Painel de controle com números grandes | Contadores rolam como odômetro | N4 | C5 | R4 |
| 22 | caderno | dados | Caderno de papel à esquerda, app à direita | Duas colunas rolam sincronizadas em velocidades diferentes | N5 | C7 | R7 |
| 23 | relatorio | dados | Relatório de produção com tabela | Linhas da tabela deslizam e sparklines se traçam | N6 | C9 | R0 |
| 24 | telemetria | dados | Gráfico de linha de produção como hero | Gráficos se desenham ao entrar na tela | N7 | C1 | R3 |
| 25 | inventario | dados | Lista densa de colmeias com status | Cabeçalhos fixos por grupo e filtro instantâneo | N8 | C3 | R6 |
| 26 | vitrine | app | Celular central com tela do app | Celular pinado troca telas conforme o scroll | N5 | C6 | R5 |
| 27 | passo | app | Três passos numerados ao lado de um celular | Contador de etapas pinado com crossfade de telas | N6 | C8 | R8 |
| 28 | tour | app | Telas do app em fila horizontal | Seção de scroll horizontal com translateX via ScrollTrigger | N7 | C0 | R1 |
| 29 | bolso | app | Layout mobile exagerado mesmo no desktop | Navegação em bottom sheet e gestos de arrastar | N8 | C2 | R4 |
| 30 | notificacao | app | Notificações do app empilhadas como hero | Cards empilham e encolhem como pilha de push | N9 | C4 | R7 |
| 31 | noite | cinema | Grafite total com um foco de luz mel | Brilho mel acompanha a posição do scroll | N6 | C7 | R6 |
| 32 | abertura | cinema | Tela escura que abre em sequência: coroa, nome, frase | Sequência de intro única com timeline GSAP, depois libera o scroll | N7 | C9 | R9 |
| 33 | lanterna | cinema | Conteúdo no escuro revelado por um foco | Máscara radial segue o cursor; no toque, segue o dedo | N8 | C1 | R2 |
| 34 | letreiro | cinema | Frases da marca em letreiro contínuo | Marquees em sentidos opostos com velocidade por scroll | N9 | C3 | R5 |
| 35 | projecao | cinema | Título gigante com foto dentro das letras | background-clip: text com imagem que desloca ao rolar | N0 | C5 | R8 |
| 36 | silencio | minimo | Só título, uma frase e um botão | Apenas opacidade, sem transform, durações longas | N7 | C8 | R7 |
| 37 | linha | minimo | Uma única linha horizontal divide o hero | A linha cresce e desce como indicador de progresso | N8 | C0 | R0 |
| 38 | pausa | minimo | Margens enormes, título pequeno e centralizado | Escala sutil (1 a 1,04) atrelada ao scroll | N9 | C2 | R3 |
| 39 | carta | minimo | Carta ao apicultor em serifa sobre papel | Máscara deslizante revela o texto como escrita | N0 | C4 | R6 |
| 40 | indice | minimo | Lista numerada das seções como hero | Pré-visualização de imagem segue o hover do item | N1 | C6 | R9 |
| 41 | jornada | narrativa | Do caderno ao app, em capítulos | Número do capítulo pinado enquanto o texto rola | N8 | C9 | R8 |
| 42 | rainha | narrativa | A rainha no centro, tudo em volta | Layout radial com elementos em órbita lenta | N9 | C1 | R1 |
| 43 | perdas | narrativa | Começa pelo problema em terracota | Paleta transiciona de terracota a mel conforme a solução aparece | N0 | C3 | R4 |
| 44 | dia | narrativa | Um dia de campo do amanhecer ao fim de tarde | Arco do sol avança no céu com o scroll | N1 | C5 | R7 |
| 45 | origem | narrativa | Mapa do Brasil como hero | Zoom progressivo do Brasil até Cocalzinho em SVG | N2 | C7 | R0 |
| 46 | blocos | estrutural | Grade dura de blocos com bordas grossas | Movimento em degraus com `steps()`, sem easing | N9 | C0 | R9 |
| 47 | poster | estrutural | Cartaz tipográfico rotacionado | Tipografia gigante fixa enquanto o conteúdo passa | N0 | C2 | R2 |
| 48 | manifesto | estrutural | Manifesto da marca em frases curtas | Destaque palavra a palavra ao rolar, estilo karaokê | N1 | C4 | R5 |
| 49 | tabela | estrutural | Funcionalidades em tabela periódica | Células viram e mostram tooltip no hover | N2 | C6 | R8 |
| 50 | arquivo | estrutural | Gavetas de arquivo com as seções | Gavetas abrem em acordeão com altura animada | N3 | C8 | R1 |

### 5.6 Regras comuns

- Funciona a 360px. Efeitos de cursor têm fallback para toque ou ficam estáticos no toque.
- `@media (prefers-reduced-motion: reduce)`: todo movimento desligado; nada fica invisível aguardando trigger.
- Mel nunca é cor de texto corrido sobre creme. Botão mel leva texto `--terra-escura`.
- Logo: área de proteção igual à altura da coroa; completa nunca abaixo de 32px; negativa sobre escuro; sem sombra, rotação ou recolorir.
- Favo sobre escuro: sutil, com scrim, nunca atrás de texto corrido.
- Fotografia: enquanto não houver fotos reais, usar `img/placeholders/*.svg` (bloco creme com favo claro e legenda do que a foto deve mostrar) e os screenshots do app. Nunca banco de imagens.
- Ícones genéricos ausentes no sprite: Lucide inline como SVG, traço 1,8px.

## 6. Switcher (`js/switcher.js`)

Incluído em todos os 50. Lê `catalogo.js` e `document.documentElement.dataset.template`.

**Estado fechado.** Pílula fixa no canto inferior direito, grafite, coroa em creme e rótulo `12 / 50` em mono. Tecla `H` esconde e mostra. Z-index acima de qualquer elemento do template.

**Estado aberto.** Painel lateral direito de 320px (100% em celular) com:
- Campo de busca por número, nome, família ou efeito.
- Lista agrupada por família. Cada linha: número, nome, estrela de favorito, efeito em `dr-caption`. Linha atual destacada. Clique expande um campo de nota.
- Rodapé: Anterior, Próximo, Galeria, Comparar, Exportar.

**Teclado.** `←` `→` anterior e próximo; `/` foca a busca; `F` favorita o atual; `G` galeria; `C` comparar; `H` oculta a pílula; `Esc` fecha o painel.

**Persistência.** `localStorage['dr.favoritos']` (array de números) e `localStorage['dr.notas']` (objeto número → texto). Exportar copia para a área de transferência um texto com, por favorito: número, nome, família, assinatura e nota.

**Scroll ratio.** Antes de navegar, grava `sessionStorage['dr.scroll'] = scrollY / (scrollHeight - innerHeight)`. Ao carregar, se existir, restaura a mesma razão após `conteudo:pronto` e um `requestAnimationFrame`, depois apaga.

**Em iframe** (`window.self !== window.top`): não renderiza a pílula; a cada scroll envia `parent.postMessage({ tipo: 'dr.scroll', ratio, template }, '*')`; recebe `{ tipo: 'dr.scrollTo', ratio }` e aplica.

## 7. Comparar (`comparar.html`)

- Dois iframes, A e B, lado a lado. Parâmetros `?a=12&b=37`. Sem parâmetros, usa os dois últimos favoritos; sem favoritos, 01 e 02.
- Barra superior: seletores A e B (listas do catálogo), botão Inverter, alternância Sincronizar scroll (ligada por padrão), largura de visualização: Desktop (metade da tela cada), Tablet 768, Celular 390.
- Sincronização: ao receber `dr.scroll` de um iframe, envia `dr.scrollTo` ao outro, com trava para não ecoar.
- Teclado: `S` inverte; `Esc` abre o template A em tela cheia.

## 8. Galeria (`galeria.html`)

- Grade responsiva de 50 cards: miniatura desktop, miniatura celular no hover, número, nome, família, estrela.
- Filtros: por família (chips) e "só favoritos". Busca igual à do switcher.
- Clique abre `templates/NN-slug.html`. Botão Comparar abre `comparar.html` com os dois primeiros favoritos.
- Sem miniatura disponível, mostra placeholder com nome e família.
- `index.html` redireciona para a galeria via `<meta http-equiv="refresh">` e link de fallback.

## 9. Verificação

### 9.1 `scripts/verificar.py`

Python com Playwright, servindo a raiz com `http.server` em porta livre. Para cada template, em 1440×900 e 390×844:
1. Carrega a página; falha se houver `console.error` ou requisição com status ≥ 400.
2. Aguarda `conteudo:pronto`; falha se algum `[data-c]` ou `[data-c-html]` estiver vazio.
3. Falha se faltar qualquer um dos 11 `data-secao`.
4. Em 390px, falha se `document.documentElement.scrollWidth > innerWidth`.
5. Falha se `window.gsap` ou a pílula do switcher não existirem.
6. Emula `prefers-reduced-motion: reduce`; rola até o fim; falha se qualquer `[data-secao]` tiver `opacity` computada menor que 0,9 ou estiver fora da viewport horizontal.
7. Captura `img/thumbs/NN-desktop.webp` (1440×900, topo) e `NN-mobile.webp` (390×844, topo).
8. Imprime uma tabela com resultado por template e sai com código 1 se houve falha.

Aceita `--apenas 11-15` para rodar um lote.

### 9.2 `scripts/auditar.py`

Lê `js/catalogo.js` (extrai o JSON do arquivo), verifica os invariantes da seção 5.1 e gera `docs/CATALOGO.md` com a tabela dos 50. Sai com código 1 se houver violação.

### 9.3 Revisão visual

Após cada família, revisar as 10 capturas contra: fidelidade ao manual, área de proteção da logo, contraste de mel sobre creme, favo atrás de texto, presença visível do efeito, aparência em 390px. Problema vira correção antes do commit da família.

## 10. Ordem de construção

1. **Fundação.** Copiar assets de `docs/brand`; `tokens.css` intacto; `base.css`; `conteudo.js` completo com os textos reescritos e os valores provisórios; `hidratar.js`; `switcher.js`; `catalogo.js` com as 50 assinaturas da seção 5.5; `comparar.html`; `galeria.html`; `index.html`; `scripts/`; placeholders de foto; template **01 Folha** como referência. Rodar `verificar.py --apenas 1` e `auditar.py`. Commit.
2. **Famílias.** Dez lotes de 5, um por família, construídos em paralelo por agentes. Cada agente recebe: esta spec, o template 01, `conteudo.js`, as 5 assinaturas da família e a regra de permutação. Após cada lote: `verificar.py --apenas`, `auditar.py`, revisão visual, correções, commit.
3. **Fechamento.** `verificar.py` completo; galeria com as 100 miniaturas; `docs/CATALOGO.md`; atualizar `docs/brief-site-institucional.md` com um parágrafo apontando para a galeria. Commit.

## 11. Critérios de pronto

- Os 50 templates passam no `verificar.py` em desktop e celular.
- `auditar.py` passa sem violação e `docs/CATALOGO.md` está gerado.
- A galeria mostra 50 miniaturas e os filtros funcionam.
- O switcher troca, favorita, anota e exporta; o scroll ratio é preservado.
- `comparar.html` sincroniza dois favoritos e alterna larguras.
- Nenhum template viola as regras da seção 5.6 na revisão visual.

## 12. Fora de escopo

- Escolher o template final.
- Substituir valores provisórios por reais (fica em `docs/PENDENCIAS.md`).
- Backend do formulário, analytics, SEO fino, deploy.
- Modo escuro global; escuro só onde o template pede e o manual permite.
