/* Catálogo dos 50 templates: assinatura de cada um (hero, efeito, N, C, R).
   O array abaixo é JSON válido; scripts/auditar.py o extrai por regex. */
window.DR = window.DR || {};
window.DR_CATALOGO = [
  {"n": 1, "slug": "folha", "nome": "Folha", "familia": "editorial", "hero": "Primeira página de jornal com manchete serifada e três colunas", "efeito": "Capitular e revelação linha a linha ao rolar", "nav": "N0", "cards": "C1", "ritmo": "R0"},
  {"n": 2, "slug": "capa", "nome": "Capa", "familia": "editorial", "hero": "Capa de revista: título display 64px full-bleed sobre creme", "efeito": "Letras do título entram em cascata (stagger de caracteres)", "nav": "N1", "cards": "C3", "ritmo": "R3"},
  {"n": 3, "slug": "dossie", "nome": "Dossiê", "familia": "editorial", "hero": "Dossiê com sumário lateral e título numerado", "efeito": "Índice fixo destaca a seção atual e mostra progresso", "nav": "N2", "cards": "C5", "ritmo": "R6"},
  {"n": 4, "slug": "entrevista", "nome": "Entrevista", "familia": "editorial", "hero": "Pergunta em serifa itálica, resposta em sans", "efeito": "Perguntas e respostas aparecem em máquina de escrever", "nav": "N3", "cards": "C7", "ritmo": "R9"},
  {"n": 5, "slug": "almanaque", "nome": "Almanaque", "familia": "editorial", "hero": "Grade de fichas técnicas como almanaque agrícola", "efeito": "Fichas viram (flip 3D) ao entrar na tela", "nav": "N4", "cards": "C9", "ritmo": "R2"},
  {"n": 6, "slug": "horizonte", "nome": "Horizonte", "familia": "campo", "hero": "Foto full-bleed do campo com título na linha do horizonte", "efeito": "Parallax em três camadas com scrub", "nav": "N1", "cards": "C2", "ritmo": "R1"},
  {"n": 7, "slug": "diario", "nome": "Diario", "familia": "campo", "hero": "Diário de um dia no apiário, hora a hora", "efeito": "Linha do tempo horizontal pinada ao scroll", "nav": "N2", "cards": "C4", "ritmo": "R4"},
  {"n": 8, "slug": "estacao", "nome": "Estacao", "familia": "campo", "hero": "Floradas do ano em quatro blocos de estação", "efeito": "Temperatura de cor dos fundos muda ao rolar (variáveis CSS animadas)", "nav": "N3", "cards": "C6", "ritmo": "R7"},
  {"n": 9, "slug": "maos", "nome": "Mãos", "familia": "campo", "hero": "Close de mãos e colmeia, título sobreposto", "efeito": "Imagens revelam por clip-path a partir do centro", "nav": "N4", "cards": "C8", "ritmo": "R0"},
  {"n": 10, "slug": "cerrado", "nome": "Cerrado", "familia": "campo", "hero": "Mapa de Goiás em SVG com Cocalzinho marcado", "efeito": "Pinos do mapa caem em sequência e ligam linhas", "nav": "N5", "cards": "C0", "ritmo": "R3"},
  {"n": 11, "slug": "trilha", "nome": "Trilha", "familia": "circuito", "hero": "Uma trilha de circuito atravessa toda a página", "efeito": "Traço SVG desenha com stroke-dashoffset conforme o scroll", "nav": "N2", "cards": "C3", "ritmo": "R2"},
  {"n": 12, "slug": "placa", "nome": "Placa", "familia": "circuito", "hero": "Grade de componentes de placa com a abelha como chip central", "efeito": "Células acendem em sequência (stagger em grade)", "nav": "N3", "cards": "C5", "ritmo": "R5"},
  {"n": 13, "slug": "nos", "nome": "Nós", "familia": "circuito", "hero": "Nós terminais como pontos de ancoragem do layout", "efeito": "Linhas em canvas conectam as seções seguindo o scroll", "nav": "N4", "cards": "C7", "ritmo": "R8"},
  {"n": 14, "slug": "sinal", "nome": "Sinal", "familia": "circuito", "hero": "Dados viajando do apiário ao celular", "efeito": "Pulsos percorrem trilhas via offset-path", "nav": "N5", "cards": "C9", "ritmo": "R1"},
  {"n": 15, "slug": "esquema", "nome": "Esquema", "familia": "circuito", "hero": "Blueprint técnico com grade e coordenadas", "efeito": "Grade e cotas revelam por seção, estilo desenho técnico", "nav": "N6", "cards": "C1", "ritmo": "R4"},
  {"n": 16, "slug": "colmeia", "nome": "Colmeia", "familia": "favo", "hero": "Grade hexagonal preenchendo o hero", "efeito": "Hexágonos expandem no hover e no toque", "nav": "N3", "cards": "C4", "ritmo": "R3"},
  {"n": 17, "slug": "celula", "nome": "Celula", "familia": "favo", "hero": "Uma célula hexagonal gigante emoldura a foto", "efeito": "Máscara hexagonal revela a imagem ao rolar", "nav": "N4", "cards": "C6", "ritmo": "R6"},
  {"n": 18, "slug": "enxame", "nome": "Enxame", "familia": "favo", "hero": "Partículas douradas sobre creme", "efeito": "Partículas em canvas se organizam em hexágonos", "nav": "N5", "cards": "C8", "ritmo": "R9"},
  {"n": 19, "slug": "cera", "nome": "Cera", "familia": "favo", "hero": "Hero com nível de mel subindo", "efeito": "Preenchimento líquido sobe nas seções (altura animada com onda)", "nav": "N6", "cards": "C0", "ritmo": "R2"},
  {"n": 20, "slug": "quadro", "nome": "Quadro", "familia": "favo", "hero": "Quadro de colmeia antes e depois", "efeito": "Divisor arrastável compara caderno e app", "nav": "N7", "cards": "C2", "ritmo": "R5"},
  {"n": 21, "slug": "painel", "nome": "Painel", "familia": "dados", "hero": "Painel de controle com números grandes", "efeito": "Contadores rolam como odômetro", "nav": "N4", "cards": "C9", "ritmo": "R4"},
  {"n": 22, "slug": "caderno", "nome": "Caderno", "familia": "dados", "hero": "Caderno de papel à esquerda, app à direita", "efeito": "Duas colunas rolam sincronizadas em velocidades diferentes", "nav": "N8", "cards": "C7", "ritmo": "R7"},
  {"n": 23, "slug": "relatorio", "nome": "Relatorio", "familia": "dados", "hero": "Relatório de produção com tabela", "efeito": "Linhas da tabela deslizam e sparklines se traçam", "nav": "N6", "cards": "C5", "ritmo": "R0"},
  {"n": 24, "slug": "telemetria", "nome": "Telemetria", "familia": "dados", "hero": "Gráfico de linha de produção como hero", "efeito": "Gráficos se desenham ao entrar na tela", "nav": "N7", "cards": "C1", "ritmo": "R3"},
  {"n": 25, "slug": "inventario", "nome": "Inventario", "familia": "dados", "hero": "Lista densa de colmeias com status", "efeito": "Cabeçalhos fixos por grupo e filtro instantâneo", "nav": "N5", "cards": "C3", "ritmo": "R6"},
  {"n": 26, "slug": "vitrine", "nome": "Vitrine", "familia": "app", "hero": "Celular central com tela do app", "efeito": "Celular pinado troca telas conforme o scroll", "nav": "N5", "cards": "C6", "ritmo": "R5"},
  {"n": 27, "slug": "passo", "nome": "Passo", "familia": "app", "hero": "Três passos numerados ao lado de um celular", "efeito": "Contador de etapas pinado com crossfade de telas", "nav": "N6", "cards": "C8", "ritmo": "R8"},
  {"n": 28, "slug": "tour", "nome": "Tour", "familia": "app", "hero": "Telas do app em fila horizontal", "efeito": "Seção de scroll horizontal com translateX via ScrollTrigger", "nav": "N7", "cards": "C0", "ritmo": "R1"},
  {"n": 29, "slug": "bolso", "nome": "Bolso", "familia": "app", "hero": "Layout mobile exagerado mesmo no desktop", "efeito": "Navegação em bottom sheet e gestos de arrastar", "nav": "N8", "cards": "C2", "ritmo": "R4"},
  {"n": 30, "slug": "notificacao", "nome": "Notificação", "familia": "app", "hero": "Notificações do app empilhadas como hero", "efeito": "Cards empilham e encolhem como pilha de push", "nav": "N9", "cards": "C4", "ritmo": "R7"},
  {"n": 31, "slug": "noite", "nome": "Noite", "familia": "cinema", "hero": "Grafite total com um foco de luz mel", "efeito": "Brilho mel acompanha a posição do scroll", "nav": "N6", "cards": "C7", "ritmo": "R6"},
  {"n": 32, "slug": "abertura", "nome": "Abertura", "familia": "cinema", "hero": "Tela escura que abre em sequência: coroa, nome, frase", "efeito": "Sequência de intro única com timeline GSAP, depois libera o scroll", "nav": "N7", "cards": "C9", "ritmo": "R9"},
  {"n": 33, "slug": "lanterna", "nome": "Lanterna", "familia": "cinema", "hero": "Conteúdo no escuro revelado por um foco", "efeito": "Máscara radial segue o cursor; no toque, segue o dedo", "nav": "N8", "cards": "C1", "ritmo": "R2"},
  {"n": 34, "slug": "letreiro", "nome": "Letreiro", "familia": "cinema", "hero": "Frases da marca em letreiro contínuo", "efeito": "Marquees em sentidos opostos com velocidade por scroll", "nav": "N9", "cards": "C3", "ritmo": "R5"},
  {"n": 35, "slug": "projecao", "nome": "Projeção", "familia": "cinema", "hero": "Título gigante com foto dentro das letras", "efeito": "background-clip: text com imagem que desloca ao rolar", "nav": "N0", "cards": "C5", "ritmo": "R8"},
  {"n": 36, "slug": "silencio", "nome": "Silêncio", "familia": "minimo", "hero": "Só título, uma frase e um botão", "efeito": "Apenas opacidade, sem transform, durações longas", "nav": "N7", "cards": "C8", "ritmo": "R7"},
  {"n": 37, "slug": "linha", "nome": "Linha", "familia": "minimo", "hero": "Uma única linha horizontal divide o hero", "efeito": "A linha cresce e desce como indicador de progresso", "nav": "N8", "cards": "C0", "ritmo": "R0"},
  {"n": 38, "slug": "pausa", "nome": "Pausa", "familia": "minimo", "hero": "Margens enormes, título pequeno e centralizado", "efeito": "Escala sutil (1 a 1,04) atrelada ao scroll", "nav": "N9", "cards": "C2", "ritmo": "R3"},
  {"n": 39, "slug": "carta", "nome": "Carta", "familia": "minimo", "hero": "Carta ao apicultor em serifa sobre papel", "efeito": "Máscara deslizante revela o texto como escrita", "nav": "N0", "cards": "C4", "ritmo": "R6"},
  {"n": 40, "slug": "indice", "nome": "Índice", "familia": "minimo", "hero": "Lista numerada das seções como hero", "efeito": "Pré-visualização de imagem segue o hover do item", "nav": "N1", "cards": "C6", "ritmo": "R9"},
  {"n": 41, "slug": "jornada", "nome": "Jornada", "familia": "narrativa", "hero": "Do caderno ao app, em capítulos", "efeito": "Número do capítulo pinado enquanto o texto rola", "nav": "N8", "cards": "C9", "ritmo": "R8"},
  {"n": 42, "slug": "rainha", "nome": "Rainha", "familia": "narrativa", "hero": "A rainha no centro, tudo em volta", "efeito": "Layout radial com elementos em órbita lenta", "nav": "N9", "cards": "C1", "ritmo": "R1"},
  {"n": 43, "slug": "perdas", "nome": "Perdas", "familia": "narrativa", "hero": "Começa pelo problema em terracota", "efeito": "Paleta transiciona de terracota a mel conforme a solução aparece", "nav": "N0", "cards": "C3", "ritmo": "R4"},
  {"n": 44, "slug": "dia", "nome": "Dia", "familia": "narrativa", "hero": "Um dia de campo do amanhecer ao fim de tarde", "efeito": "Arco do sol avança no céu com o scroll", "nav": "N1", "cards": "C5", "ritmo": "R7"},
  {"n": 45, "slug": "origem", "nome": "Origem", "familia": "narrativa", "hero": "Mapa do Brasil como hero", "efeito": "Zoom progressivo do Brasil até Cocalzinho em SVG", "nav": "N2", "cards": "C7", "ritmo": "R0"},
  {"n": 46, "slug": "blocos", "nome": "Blocos", "familia": "estrutural", "hero": "Grade dura de blocos com bordas grossas", "efeito": "Movimento em degraus com `steps()`, sem easing", "nav": "N9", "cards": "C0", "ritmo": "R9"},
  {"n": 47, "slug": "poster", "nome": "Poster", "familia": "estrutural", "hero": "Cartaz tipográfico rotacionado", "efeito": "Tipografia gigante fixa enquanto o conteúdo passa", "nav": "N0", "cards": "C2", "ritmo": "R2"},
  {"n": 48, "slug": "manifesto", "nome": "Manifesto", "familia": "estrutural", "hero": "Manifesto da marca em frases curtas", "efeito": "Destaque palavra a palavra ao rolar, estilo karaokê", "nav": "N1", "cards": "C4", "ritmo": "R5"},
  {"n": 49, "slug": "tabela", "nome": "Tabela", "familia": "estrutural", "hero": "Funcionalidades em tabela periódica", "efeito": "Células viram e mostram tooltip no hover", "nav": "N2", "cards": "C6", "ritmo": "R8"},
  {"n": 50, "slug": "arquivo", "nome": "Arquivo", "familia": "estrutural", "hero": "Gavetas de arquivo com as seções", "efeito": "Gavetas abrem em acordeão com altura animada", "nav": "N3", "cards": "C8", "ritmo": "R1"}
];
window.DR_FAMILIAS = [{id:'editorial',nome:'Editorial'},{id:'campo',nome:'Campo'},{id:'circuito',nome:'Circuito'},{id:'favo',nome:'Favo'},{id:'dados',nome:'Dados'},{id:'app',nome:'App'},{id:'cinema',nome:'Cinema'},{id:'minimo',nome:'Mínimo'},{id:'narrativa',nome:'Narrativa'},{id:'estrutural',nome:'Estrutural'}];
(function (DR) {
  DR.caminho = function (n) {
    var num = String(n).padStart(2, '0');
    var item = window.DR_CATALOGO.find(function (i) { return i.n === Number(n); });
    if (!item) return null;
    var arq = num + '-' + item.slug + '.html';
    return location.pathname.includes('/templates/') ? './' + arq : 'templates/' + arq;
  };
  DR.atual = function () {
    var v = parseInt(document.documentElement.dataset.template, 10);
    return isNaN(v) ? null : v;
  };
})(window.DR);
