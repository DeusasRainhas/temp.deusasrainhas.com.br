/*
 * Conteúdo único dos 50 templates da landing Deusas Rainhas.
 *
 * Cada valor é uma string ou { v, provisorio }. Quando há `provisorio`, o
 * valor é fictício e a chave corresponde a uma linha de docs/PENDENCIAS.md;
 * os templates marcam o elemento com data-provisorio="<chave>".
 * Caminhos de imagem são relativos a templates/.
 *
 * Script comum (sem módulos) para funcionar também via file://.
 */
window.DR_CONTEUDO = (function () {
  var whatsappUrl = { v: 'https://wa.me/5562999990000', provisorio: 'whatsapp' };

  return {
    hero: {
      eyebrow: 'Gestão apícola no celular',
      titulo: 'Cuidar das abelhas ficou mais simples',
      subtitulo: 'Um app de gestão apícola que funciona mesmo sem sinal no apiário, feito por quem vive o campo.',
      imagem: { v: '../img/placeholders/hero.svg', provisorio: 'foto-hero' },
      imagemAlt: 'Apicultor revisando uma colmeia no campo, com o celular na mão'
    },

    cta: {
      baixar: {
        texto: 'Baixar o app',
        url: { v: 'https://play.google.com/store/apps/details?id=com.deusasrainhas.app.v2', provisorio: 'play-store' }
      },
      falar: { texto: 'Falar com a gente', url: whatsappUrl },
      ios: { texto: 'Em breve no iPhone', url: { v: '#', provisorio: 'app-store' }, oculto: true }
    },

    prova: {
      stats: [
        { valor: { v: '120', provisorio: 'stat-apicultores' }, rotulo: 'apicultores no beta' },
        { valor: { v: '1.800', provisorio: 'stat-colmeias' }, rotulo: 'colmeias acompanhadas' },
        { valor: { v: '38', provisorio: 'stat-municipios' }, rotulo: 'municípios de Goiás' },
        { valor: '100%', rotulo: 'das funções sem internet' }
      ]
    },

    problema: {
      eyebrow: 'O problema',
      titulo: 'O caderno de campo não dá conta',
      estatistica: {
        valor: '95%',
        texto: 'dos apicultores ainda anotam o manejo em caderno de papel.'
      },
      consequencias: [
        { texto: 'A anotação se perde na chuva, na fumaça e na correria da revisão.' },
        { texto: 'Uma doença que ninguém viu a tempo vira perda de enxame.' },
        { texto: 'Sem histórico, fica difícil saber qual colmeia produz bem e qual precisa de cuidado.' }
      ]
    },

    funcionalidades: {
      eyebrow: 'O que a gente faz',
      titulo: 'Tudo o que o apiário pede, num app só',
      itens: [
        {
          icone: 'dr-mapa',
          titulo: 'Seus apiários no mapa',
          texto: 'Cada apiário com sua localização no mapa e suas colmeias organizadas.'
        },
        {
          icone: 'dr-colmeia',
          titulo: 'Colmeia por colmeia',
          texto: 'Veja de relance quais estão fortes, quais pedem atenção e o que foi feito em cada uma.'
        },
        {
          icone: 'dr-revisao',
          titulo: 'Revisão em poucos toques',
          texto: 'Registre a revisão ali mesmo no apiário, com foto e áudio, sem precisar digitar muito.'
        },
        {
          icone: 'dr-abelha',
          titulo: 'Tire dúvidas na hora',
          texto: 'Pergunte sobre manejo e doenças em português e receba respostas da nossa base de conhecimento.'
        },
        {
          icone: 'dr-offline',
          titulo: 'Funciona sem sinal',
          texto: 'Use tudo mesmo sem internet. Quando o sinal voltar, o app sincroniza sozinho.'
        },
        {
          icone: 'dr-producao',
          titulo: 'Produção na palma da mão',
          texto: 'Acompanhe a produção de mel, própolis, pólen e geleia real ao longo da safra.'
        }
      ]
    },

    comoFunciona: {
      eyebrow: 'Como funciona',
      titulo: 'Do cadastro à colheita em três passos',
      passos: [
        {
          numero: '01',
          titulo: 'Cadastre o apiário',
          texto: 'Marque o local no mapa e adicione suas colmeias. Leva poucos minutos.',
          imagem: '../img/app/01_dashboard_apiarios.png',
          alt: 'Tela inicial do app com a lista de apiários cadastrados'
        },
        {
          numero: '02',
          titulo: 'Registre a revisão no campo',
          texto: 'Abra a colmeia, anote o que viu, tire uma foto ou grave um áudio. Sem sinal, tudo fica salvo no celular.',
          imagem: '../img/app/03_inspecao_detalhada.png',
          alt: 'Tela de revisão de uma colmeia com campos de observação e foto'
        },
        {
          numero: '03',
          titulo: 'Acompanhe a produção',
          texto: 'Veja a situação de cada colmeia e quanto o apiário está produzindo, safra após safra.',
          imagem: '../img/app/02_lista_colmeias_status.png',
          alt: 'Lista de colmeias com a situação de cada uma'
        }
      ]
    },

    paraQuem: {
      eyebrow: 'Para quem',
      titulo: 'Feito para quem trabalha com abelhas',
      perfis: [
        {
          titulo: 'Apicultor familiar',
          texto: 'Para quem cuida das próprias colmeias e quer trocar o caderno por algo que não molha nem se perde.'
        },
        {
          titulo: 'Cooperativa',
          texto: 'Para acompanhar os apiários dos cooperados e ter números confiáveis na hora de planejar e vender.'
        },
        {
          titulo: 'Consultor técnico',
          texto: 'Para orientar vários produtores com o histórico de cada colmeia à mão, mesmo longe da cidade.'
        }
      ]
    },

    tecnologia: {
      eyebrow: 'Tecnologia',
      titulo: 'Tecnologia que trabalha no campo',
      texto: 'A gente une o conhecimento de quem vive a apicultura a ferramentas que antes não chegavam ao pequeno apicultor.',
      pilares: [
        {
          icone: 'dr-offline',
          titulo: 'Funciona sem internet',
          texto: 'O app guarda tudo no celular e sincroniza quando encontra sinal. Nada se perde no caminho.'
        },
        {
          icone: 'dr-abelha',
          titulo: 'Inteligência artificial em português',
          texto: 'Um assistente que entende a sua pergunta e responde com base em conhecimento apícola confiável.'
        },
        {
          icone: 'dr-drone',
          titulo: 'Mapeamento com drone',
          texto: 'Mapeamento com drone para conhecer a florada e o entorno de cada apiário.'
        },
        {
          icone: 'dr-clima',
          titulo: 'Sensores na colmeia',
          texto: 'Sensores na colmeia registram temperatura e umidade para você acompanhar de longe.'
        }
      ]
    },

    equipe: {
      eyebrow: 'Quem somos',
      titulo: 'Nascida no campo, em Cocalzinho de Goiás',
      origem: 'A Deusas Rainhas nasceu das mãos de quem vive a apicultura. A gente junta a sabedoria do campo com a tecnologia que faltava para o pequeno apicultor.',
      pessoas: [
        {
          nome: 'Carolina Cyrino',
          cargo: 'Sócia e diretora comercial',
          foto: { v: '../img/placeholders/equipe.svg', provisorio: 'foto-equipe-1' },
          alt: 'Retrato de Carolina Cyrino'
        },
        {
          nome: 'Bruno Vasconcelos',
          cargo: 'Sócio e fullstack developer',
          foto: { v: '../img/placeholders/equipe.svg', provisorio: 'foto-equipe-2' },
          alt: 'Retrato de Bruno Vasconcelos'
        },
        {
          nome: { v: 'João Batista', provisorio: 'equipe-3' },
          cargo: { v: 'Consultor apícola, 15 anos de campo', provisorio: 'equipe-3' },
          foto: { v: '../img/placeholders/equipe.svg', provisorio: 'foto-equipe-3' },
          alt: 'Retrato do consultor apícola da equipe'
        }
      ],
      apoios: [
        {
          nome: { v: 'Centelha', provisorio: 'apoios' },
          logo: '../img/logos/centelha-negativo.png',
          alt: 'Programa Centelha',
          fundo: 'escuro'
        },
        {
          nome: { v: 'FAPEG', provisorio: 'apoios' },
          logo: '../img/logos/fapeg.png',
          alt: 'FAPEG, Fundação de Amparo à Pesquisa do Estado de Goiás',
          fundo: 'claro'
        },
        {
          nome: { v: 'FINEP', provisorio: 'apoios' },
          logo: '../img/logos/finep.png',
          alt: 'FINEP, Financiadora de Estudos e Projetos',
          fundo: 'claro'
        }
      ]
    },

    depoimento: {
      citacao: { v: 'Antes eu anotava tudo no caderno e perdia na chuva. Agora a revisão fica no celular, mesmo sem sinal.', provisorio: 'depoimento' },
      nome: { v: 'Maria do Socorro', provisorio: 'depoimento' },
      local: { v: 'Apicultora em Pirenópolis (GO)', provisorio: 'depoimento' },
      foto: { v: '../img/placeholders/depoimento.svg', provisorio: 'foto-depoimento' }
    },

    contato: {
      eyebrow: 'Contato',
      titulo: 'Vamos conversar',
      texto: 'Quer usar o app, levar para a sua cooperativa ou apoiar o projeto? Mande uma mensagem que a gente responde.',
      email: { v: 'contato@deusasrainhas.com.br', provisorio: 'email' },
      whatsapp: { v: '+55 (62) 99999-0000', provisorio: 'whatsapp' },
      whatsappUrl: whatsappUrl,
      instagram: '@deusasrainhas',
      instagramUrl: 'https://instagram.com/deusasrainhas',
      formEndpoint: { v: 'https://formspree.io/f/xxxxxxxx', provisorio: 'form-endpoint' },
      form: {
        nome: 'Seu nome',
        email: 'Seu e-mail',
        mensagem: 'Como a gente pode ajudar?',
        enviar: 'Enviar mensagem'
      }
    },

    precos: {
      gratis: {
        nome: 'Começar grátis',
        preco: 'R$ 0',
        descricao: { v: 'Até 10 colmeias', provisorio: 'preco-gratis' }
      },
      pago: {
        nome: { v: 'Plano Colmeia', provisorio: 'preco-pago' },
        preco: { v: 'R$ 29,90/mês', provisorio: 'preco-pago' },
        descricao: { v: 'Colmeias ilimitadas e assistente de IA', provisorio: 'preco-pago' }
      }
    },

    rodape: {
      razaoSocial: { v: 'Deusas Rainhas Tecnologia Apícola Ltda.', provisorio: 'razao-social' },
      cnpj: { v: '00.000.000/0001-00', provisorio: 'cnpj' },
      endereco: { v: 'Cocalzinho de Goiás · GO', provisorio: 'endereco' },
      privacidade: { texto: 'Política de privacidade', url: '../privacidade.html' },
      avisoProvisorio: 'Site em construção. Dados de contato e números são provisórios.',
      direitos: 'Deusas Rainhas. Todos os direitos reservados.'
    }
  };
})();
