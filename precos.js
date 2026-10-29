/* ==========================================================================
   PRÉVIA (nova tabela com todas as mudanças da Gabi). Não está no ar.
   O link escolhe o que mostrar:  ?n=Maria Silva&s=site,identidade
   Códigos dos serviços: social, identidade, landing, site, logo, posts
   ========================================================================== */
window.PRECOS = {
  descontoAvista: 5, // % de desconto no Pix à vista (só landing page e site institucional)
  limiteCredito: 50, // o crédito do Clube cobre no máximo 50% do projeto
  validadeDias: 7,   // o orçamento vale por 7 dias a partir da data de emissão
  servicos: {
    social: {
      nome: 'Social Media',
      icone: 'posts',
      desc: 'Design, copy e postagem feitos pelo Studio Kairós, todo mês.',
      valorTexto: 'R$ 1.500 por mês',
      total: 4500,           // 3 meses (contrato mínimo)
      totalNota: '3 meses (contrato mínimo)',
      prazo: '3 a 7 dias',
      mensal: true,
      itens: [
        '12 posts por mês, entre posts, carrosséis e stories',
        'Design estratégico, pensado para o seu público e para o seu posicionamento',
        'Copy persuasiva, que conversa com o cliente e leva à ação',
        'Postagem com legendas e hashtags que ajudam no SEO das suas redes',
        'O prazo conta a partir do envio da copy'
      ],
      destaque: 'Contrato mínimo de 3 meses. Pagando os 3 meses à vista no Pix, você tem 5% de desconto.'
    },
    identidade: {
      nome: 'Identidade visual',
      semPixEmDuasVezes: true, // trabalho grande: só Pix à vista ou cartão
      semDesconto: true,
      icone: 'marca',
      desc: 'A essência do seu negócio traduzida em logo, cores e tipografia.',
      valorTexto: 'R$ 1.200',
      total: 1200,
      prazo: '7 a 10 dias',
      itens: [
        'Logo com variações, paleta de cores e tipografia',
        'Logos em PNG, PDF e SVG',
        'Apresentação da identidade visual',
        '3 mockups e 3 posts para ver sua marca no mundo real',
        'O prazo conta a partir do briefing enviado pelo cliente'
      ]
    },
    landing: {
      nome: 'Landing page',
      icone: 'pagina',
      desc: 'Feita para transformar visita em contato ou venda.',
      valorTexto: 'R$ 1.700',
      total: 1700,
      cartao: 1900,
      prazo: '7 a 10 dias',
      hospedagem: 97,
      manutencao: 247,
      itens: [
        'Uma página principal para apresentar o seu negócio com autoridade.',
        'Copy estratégica, design e implementação feitos pelo Studio Kairós',
        'Hospedagem obrigatória: R$ 97 por mês (1 mês grátis)',
        'O prazo conta a partir da aprovação da copy'
      ]
    },
    logo: {
      nome: 'Logo',
      semPixEmDuasVezes: true,
      semDesconto: true,
      icone: 'marca',
      desc: 'A marca do seu negócio, pronta para usar em qualquer lugar.',
      valorTexto: 'R$ 450',
      total: 450,
      prazo: '4 a 7 dias',
      itens: [
        'Logo criada do zero, sem templates prontos',
        'Logo nos formatos PNG, SVG e PDF',
        'Paleta de cores',
        'Tipografia'
      ]
    },
    posts: {
      nome: 'Design de posts',
      semPixEmDuasVezes: true,
      semDesconto: true,
      icone: 'posts',
      desc: 'Um pacote de artes estratégicas para fortalecer a presença da sua marca nas redes sociais.',
      valorTexto: 'R$ 800',
      total: 800,
      prazo: 'a combinar',
      itens: [
        '12 conteúdos entre posts, stories e carrosséis.',
        'Designs criados do zero, sem templates prontos, respeitando a identidade e a personalidade do seu negócio.',
        'Cada arte é pensada estrategicamente para comunicar sua mensagem, destacar seus diferenciais e atrair a atenção do público certo.',
        'Criação visual e diagramação profissional feitas pelo Studio Kairós.'
      ]
    },
    site: {
      nome: 'Site institucional',
      icone: 'site',
      desc: 'Até 4 subpáginas estratégicas para mostrar o universo da sua empresa: sua história, serviços, diferenciais e tudo o que o cliente precisa conhecer.',
      valorTexto: 'R$ 2.900',
      total: 2900,
      cartao: 3330,
      prazo: '7 a 15 dias',
      hospedagem: 197,
      manutencao: 347,
      itens: [
        'Mais oportunidades de ser encontrado no Google, com páginas organizadas para apresentar diferentes áreas do seu negócio.',
        'Copy estratégica, design e implementação feitos pelo Studio Kairós.',
        'Hospedagem obrigatória: R$ 197 por mês (1 mês grátis).',
        'O prazo conta a partir da aprovação da copy'
      ]
    }
  },
  manutencao: {
    valor: 150,
    itens: [
      'Seu site sempre atualizado, sem preocupações. Nós cuidamos de tudo para você!',
      'Precisa trocar imagens, textos, telefones, valores ou informações? Fazemos as alterações sem cobranças adicionais.',
      'Encontrou algum erro ou problema no site? Cuidamos das correções para manter tudo funcionando.',
      'Liberdade para atualizar o conteúdo sempre que precisar, sem pagar a mais por mudanças dentro da estrutura existente.',
      'A única exceção é a criação de novas seções ou páginas, que são orçadas separadamente, sempre com aprovação prévia.'
    ]
  }
};
