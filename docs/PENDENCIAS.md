# Pendências — valores provisórios no site

Checklist operacional. Cada linha corresponde a um `data-provisorio="<chave>"` no HTML. Quando o valor real entrar, marque a caixa e remova o atributo e o comentário `<!-- PROVISÓRIO -->` correspondentes. O site só pode ir ao ar com todas as caixas marcadas ou com o item explicitamente removido do layout.

Para localizar tudo que ainda é provisório:

```bash
grep -rn 'data-provisorio' *.html
```

## Contato e identidade legal

- [ ] `email` — trocar `contato@deusasrainhas.com.br` pelo e-mail oficial (candidatos: `deusasrainhas@gmail.com` do manual, `admin@deusasrainhas.com.br` do repositório)
- [ ] `whatsapp` — trocar `+55 (62) 99999-0000` e o link `wa.me/5562999990000` pelo número comercial real
- [ ] `razao-social` — trocar `Deusas Rainhas Tecnologia Apícola Ltda.` pela razão social (a política de privacidade cita "Climacocal")
- [ ] `cnpj` — trocar `00.000.000/0001-00` pelo CNPJ real
- [ ] `endereco` — confirmar se exibe só a cidade ou logradouro completo
- [x] `instagram` — `@deusasrainhas` confirmado no manual

## Produto e comercial

- [ ] `play-store` — confirmar que o app está publicado como `com.deusasrainhas.app.v2`; se não, trocar o botão por lista de espera
- [ ] `app-store` — remover `hidden` do botão quando houver link iOS
- [ ] `preco-gratis` — confirmar limite do plano gratuito (provisório: até 10 colmeias)
- [ ] `preco-pago` — confirmar valor (R$ 29,90 ou R$ 49,90), nome do plano e o que inclui; ou remover a seção de preços nesta fase
- [ ] `form-endpoint` — criar conta no Formspree (ou Web3Forms) e trocar `xxxxxxxx` pelo id; ou remover o formulário e manter só WhatsApp e e-mail

## Conteúdo e prova social

- [ ] `depoimento` — **pessoa fictícia** (Maria do Socorro, Pirenópolis). Trocar por depoimento real com autorização por escrito, ou remover a seção
- [ ] `stat-apicultores` — trocar "120 apicultores no beta" pelo número real
- [ ] `stat-colmeias` — trocar "1.800 colmeias acompanhadas" pelo número real
- [ ] `stat-municipios` — trocar "38 municípios de Goiás" pelo número real
- [x] `stat-offline` — "100% das funções sem internet" é real
- [ ] `equipe-3` — **pessoa fictícia** (João Batista, consultor apícola). Trocar pelo nome real ou remover o card
- [x] `equipe-1` — Carolina Cyrino, sócia e diretora comercial (manual pág. 12)
- [x] `equipe-2` — Bruno Vasconcelos, sócio e fullstack developer (manual pág. 12)
- [ ] `apoios` — confirmar autorização para exibir os selos Centelha, FAPEG e FINEP

## Imagens

- [ ] `foto-hero` — substituir o bloco favo + screenshot por foto JPG 1600x1000 (campo, colmeias, luz natural quente)
- [ ] `foto-equipe-1`, `foto-equipe-2`, `foto-equipe-3` — retratos 600x600, fundo neutro, luz natural
- [ ] `foto-depoimento` — opcional, só com autorização
- [ ] `og-image` — gerar 1200x630 com logo e foto real (provisório usa favo + logo)

## Encerramento

- [ ] Remover do rodapé a frase "Site em construção. Dados de contato e números são provisórios."
- [ ] Rodar `grep -rn 'data-provisorio' *.html` e confirmar saída vazia
