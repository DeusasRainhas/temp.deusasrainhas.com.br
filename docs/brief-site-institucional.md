# Brief — Site institucional Deusas Rainhas (temp.deusasrainhas.com.br)

Resultado da sessão de brainstorm de 2026-10-23. Serve como especificação de entrada para a implementação.

## 1. Decisões tomadas

| Tema | Decisão |
|---|---|
| O que é | Site institucional estático, também usado como base reutilizável de componentes de marca |
| Stack | HTML + CSS + JS mínimo, sem build e sem dependências. Sobe em qualquer hospedagem estática |
| Fonte visual | `docs/brand/entrega_site/` (tokens.css, logos, ícones, padrões). O manual em `docs/brand/01_manual` prevalece em caso de dúvida |
| Fonte de conteúdo | O site em produção https://deusasrainhas.com.br (idêntico a `deusasrainhas_app/backend_deusasrainhas/landing/index.html`), mais `PLAY_STORE_DESCRIPTIONS.txt` e `docs/06-business-pitch/`, **reescritos no tom de voz da marca** (ver seção 4) |
| Objetivos (todos) | Presença e credibilidade · captar interessados · institucional para investidores · base reutilizável |
| Idioma | Português do Brasil |

## 2. Públicos e o que cada um precisa encontrar

1. **Pequeno apicultor** (celular, sinal fraco, pouco tempo). Precisa entender em 10 segundos o que o app faz e como baixar ou entrar na lista de espera. Página leve, botões grandes.
2. **Investidor, parceiro, programa de fomento** (Centelha, FAPEG, FINEP). Precisa de problema, solução, tração, equipe, apoios, contato formal.
3. **Imprensa e curiosos** que digitam o domínio. Precisam de quem somos, onde estamos, como falar com a gente.

## 3. Arquitetura da informação (página única com âncoras + 1 página legal)

```
index.html
├── Cabeçalho fixo        logo (coroa em compacto) · Início · Produto · Para quem · Tecnologia · Equipe · Contato · [Baixar o app]
├── Hero                  título serifado, subtítulo, 2 CTAs (Baixar o app / Falar com a gente), imagem ou favo claro de fundo
├── Prova rápida          faixa com 3 ou 4 números em mono (ex.: colmeias cadastradas, apiários, funciona offline)
├── O problema            "95% dos apicultores ainda usam caderno de papel" + 3 consequências
├── O que a gente faz     6 cards com ícones próprios: colmeia, revisao, offline, mapa, abelha (IA), producao
├── Como funciona         3 passos com telas do app (screenshots existentes)
├── Para quem             apicultor familiar · cooperativa · consultor técnico
├── Tecnologia            seção escura (grafite) com trilha de circuito: offline-first, IA em português, drone, sensores
├── Equipe e origem       Cocalzinho de Goiás, sócios, apoios (selos Centelha, FAPEG, FINEP)
├── Depoimento            citação serifada (dr-quote), só se houver depoimento real autorizado
├── Contato / interesse   formulário curto + WhatsApp + e-mail + Instagram
└── Rodapé                logo negativa, navegação, política de privacidade, CNPJ/razão social, © ano
privacidade.html          política de privacidade (migrar de static/legal/privacy-policy.html, limpar emoji)
componentes.html          guia de estilo vivo: cada bloco acima isolado, com o HTML copiável (atende "base reutilizável")
```

## 4. Conteúdo: o que reaproveitar e o que reescrever

O site em produção (verificado em 2026-10-23) é a mesma landing do repositório: fonte Poppins, paleta laranja #FF9500 fora da marca, hero em SVG genérico, nenhuma foto, nenhum e-mail, telefone ou rede social, e a seção Contato aponta só para documentação da API. Ele viola o manual em vários pontos: emoji (❤️, ✓), jargão ("RAG 384 dimensões", "SentenceBERT", "stack moderna e robusta", "tecnologia de ponta"), caixa alta em títulos e métricas de engenharia (contagem de testes, latência) como argumento de venda. O manual pede "você" e "a gente", frases simples, sem emoji, sentence case.

**Reaproveitar como fato, reescrever a forma:**

| Fato existente | Como a marca diria |
|---|---|
| "100% Offline First - funciona sem internet" | "Funciona mesmo sem sinal no apiário." |
| "IA com RAG para análise inteligente" | "Tire dúvidas sobre manejo e doenças em português, com respostas da nossa base de conhecimento." |
| "Inspeções Programadas ... fotos, observações" | "Registre a revisão em poucos toques, com foto e áudio." |
| "Geolocalização precisa" | "Cada apiário com sua localização no mapa." |
| "Controle de produção (mel, própolis, pólen, geleia real)" | "Acompanhe a produção de mel, própolis, pólen e geleia real." |
| "909 testes / <200ms" | Não vai para o site. Fica para documentação técnica |

**Fatos de negócio disponíveis em `docs/06-business-pitch/PITCH_DECK_CENTELHA_CONTENT.md`:**
- 95% dos apicultores usam cadernos de papel; perdas de produtividade e por doenças não detectadas
- Planos: gratuito e R$ 29,90/mês (há menção a R$ 49,90, confirmar qual vale)
- Programa Centelha 3 Goiás, subvenção FAPEG
- Roadmap: beta com 20 apicultores, depois lançamento

**Equipe (do manual, pág. 12):** Carolina Cyrino, sócia e diretora comercial · Bruno Vasconcelos, sócio e fullstack developer. O pitch cita outros papéis (consultor apícola, UX) sem nome: confirmar quem entra.

## 5. Sistema de componentes (a parte "template")

Um arquivo `css/site.css` importado depois de `tokens.css`, com classes de bloco prefixadas `dr-`:

- **Layout:** `.dr-container` (max 1200px), `.dr-section`, `.dr-section--escura`, `.dr-grid-2/3`
- **Navegação:** `.dr-nav` fixa, troca para coroa + menu hambúrguer abaixo de 768px
- **Botões:** `.dr-btn` primário (mel com texto terra escura), secundário (contorno terra), link (petróleo). Hover usa `--mel-escuro`
- **Cards:** `.dr-card` com `--sh-sm`, borda `--linha`, raio `--r-lg`, ícone do sprite em petróleo
- **Números:** `.dr-stat` usando `.dr-data` + `.dr-eyebrow`
- **Divisórias:** `circuito-divisoria.svg` entre seções, `circuito-canto.svg` em cards de destaque
- **Fundos:** `favo-claro.svg` em hero e seções claras; `favo-escuro.svg` na seção escura com scrim e nunca atrás de texto corrido
- **Formulário:** campos com borda `--linha-forte`, foco em petróleo, erro em `--erro`
- **Rodapé:** grafite, logo negativa, links em creme

Regras obrigatórias herdadas do manual: área de proteção da logo igual à altura da coroa; logo completa nunca abaixo de 32px; negativa sobre escuro; sem sombra, giro ou recolorir; sentence case em títulos; ícones genéricos faltantes vêm do Lucide com traço 1,8px.

## 6. Requisitos não funcionais

- Mobile first, 16px de gutter, sem rolagem horizontal
- Fontes do Google Fonts com `preconnect` e `display=swap`; opcional self-host depois
- Lighthouse acessibilidade e boas práticas acima de 90; contraste AA (atenção: mel sobre creme não serve para texto)
- Meta tags Open Graph e Twitter, favicon a partir de `coroa-cor.png`, `og-image` 1200x630 a gerar
- `sitemap.xml`, `robots.txt`, `lang="pt-BR"`
- Sem rastreadores por padrão; se analytics, opção leve (Plausible ou Umami) a decidir
- Formulário sem backend: Formspree, Web3Forms ou link direto para WhatsApp. Recomendação: WhatsApp como CTA principal para apicultor, formulário por serviço externo para parceiros

## 7. Valores provisórios adotados (substituir antes de publicar)

Nenhuma pendência trava a implementação. Cada item abaixo entra no site com um **valor fictício**, marcado no HTML com o atributo `data-provisorio="<chave>"` e um comentário `<!-- PROVISÓRIO: … -->`. A lista operacional de troca está em `docs/PENDENCIAS.md`. Valores fictícios nunca devem ir ao ar: o checklist precisa estar todo riscado antes do deploy.

| Chave | Pendência | Valor provisório no site | Origem / observação |
|---|---|---|---|
| `foto-hero` | Foto do hero | Bloco creme com `favo-claro.svg` + screenshot `banner_App.png`, legenda "Foto: apicultor no campo, luz natural" | Trocar por JPG 1600x1000, luz natural, campo e colmeias |
| `foto-equipe-*` | Fotos dos sócios | Avatar com a coroa (`coroa-cor.png`) sobre `--superficie`, 320x320 | Trocar por retrato 600x600, fundo neutro, luz natural |
| `foto-depoimento` | Foto do depoente | Mesmo avatar de coroa | Opcional, só com autorização |
| `email` | E-mail oficial | `contato@deusasrainhas.com.br` | **Fictício.** Manual diz `deusasrainhas@gmail.com`; repositório usa `admin@deusasrainhas.com.br` |
| `whatsapp` | WhatsApp comercial | `+55 (62) 99999-0000` → `https://wa.me/5562999990000` | **Fictício** (número inválido de propósito) |
| `instagram` | Instagram | `@deusasrainhas` → `https://instagram.com/deusasrainhas` | Real, consta no manual |
| `razao-social` | Razão social | `Deusas Rainhas Tecnologia Apícola Ltda.` | **Fictício.** Política de privacidade cita "Climacocal" |
| `cnpj` | CNPJ | `00.000.000/0001-00` | **Fictício** (inválido de propósito) |
| `endereco` | Endereço | `Cocalzinho de Goiás · GO` | Cidade real (manual); sem logradouro até confirmar |
| `preco-gratis` | Plano gratuito | "Começar grátis · até 10 colmeias" | Limite fictício; pitch cita plano FREE sem limite definido |
| `preco-pago` | Plano pago | "Plano Colmeia · R$ 29,90/mês · colmeias ilimitadas + IA" | R$ 29,90 vem do pitch; nome do plano e escopo são fictícios. Pitch também cita R$ 49,90 |
| `play-store` | Link do app | `https://play.google.com/store/apps/details?id=com.deusasrainhas.app.v2` | `applicationId` real do Flutter; confirmar se o app está publicado nesse id |
| `app-store` | iOS | Botão oculto por padrão (`hidden`) | Mostrar quando houver link |
| `form-endpoint` | Destino do formulário | `https://formspree.io/f/xxxxxxxx` com fallback `mailto:` para `email` | **Fictício.** Exige conta Formspree ou troca por Web3Forms |
| `depoimento` | Depoimento | "Antes eu anotava tudo no caderno e perdia na chuva. Agora a revisão fica no celular, mesmo sem sinal." — **Maria do Socorro, apicultora em Pirenópolis (GO)** | **Fictício.** Pessoa inventada. Trocar por depoimento real autorizado ou remover a seção |
| `stat-apicultores` | Prova rápida | "120 apicultores no beta" | **Fictício.** Pitch prevê beta com 20 |
| `stat-colmeias` | Prova rápida | "1.800 colmeias acompanhadas" | **Fictício** |
| `stat-municipios` | Prova rápida | "38 municípios de Goiás" | **Fictício** (38 é o número de colmeias do mockup do manual, reaproveitado) |
| `stat-offline` | Prova rápida | "100% das funções sem internet" | Real (arquitetura offline-first) |
| `equipe-1` | Sócia | Carolina Cyrino · Sócia e diretora comercial | Real, manual pág. 12 |
| `equipe-2` | Sócio | Bruno Vasconcelos · Sócio e fullstack developer | Real, manual pág. 12 |
| `equipe-3` | Consultor apícola | "João Batista · Consultor apícola, 15 anos de campo" | **Fictício.** Pitch cita o papel sem nome |
| `apoios` | Selos de fomento | Centelha, FAPEG, FINEP (`docs/brand/02_logos/`) | Logos reais; confirmar se os três podem ser exibidos |
| `ano-copyright` | Rodapé | 2026 | Gerado por JS a partir da data atual |

**Regra de exibição:** enquanto um valor for provisório, o rodapé mostra em `dr-caption` a frase "Site em construção. Dados de contato e números são provisórios." Essa frase sai junto com o último item do checklist.

## 8. Entregáveis da implementação

```
/
├── index.html
├── privacidade.html
├── componentes.html
├── css/tokens.css        (cópia de docs/brand/entrega_site/tokens.css)
├── css/site.css
├── js/site.js            (menu mobile, scroll suave, header compacto)
├── img/logos/…           (de docs/brand/02_logos)
├── img/icones/sprite-icones.svg
├── img/padroes/…
├── img/app/…             (screenshots)
├── img/fotos/…           (a receber)
├── favicon.ico / favicon.svg / apple-touch-icon.png
├── og-image.jpg
├── robots.txt
└── sitemap.xml
docs/PENDENCIAS.md          (checklist de troca dos valores provisórios)
```

Ordem sugerida: componentes.html e site.css primeiro (valida o sistema com a marca), depois index.html com placeholders no tom de voz, depois troca pelos textos finais e fotos.
