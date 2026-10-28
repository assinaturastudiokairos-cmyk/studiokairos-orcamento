/* ==========================================================================
   TABELA DE PREÇOS: é só aqui que se mudam valores, prazos e o que está incluso.
   O link escolhe o que mostrar:  ?n=Maria Silva&s=site,identidade
   Códigos dos serviços: social, identidade, landing, site
   ========================================================================== */
window.PRECOS = {
  descontoAvista: 5, // % de desconto no Pix à vista
  descontoSocial3Meses: 350, // Social Media: desconto em reais para quem paga os 3 meses à vista no Pix
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
        'Design, copy e postagem feitos por nós'
      ],
      destaque: 'Contrato mínimo de 3 meses. Pagando os 3 meses à vista no Pix, você tem R$ 350 de desconto.'
    },
    identidade: {
      nome: 'Identidade visual',
      icone: 'marca',
      desc: 'A essência do seu negócio traduzida em logo, cores e tipografia.',
      valorTexto: 'R$ 1.200',
      total: 1200,
      prazo: '7 a 10 dias',
      itens: [
        'Logo, paleta de cores e tipografia',
        'Apresentação da identidade com 3 mockups',
        '3 posts',
        'Logos em PNG, PDF e SVG'
      ],
    },
    landing: {
      nome: 'Landing page',
      icone: 'pagina',
      desc: 'Uma página única, feita para transformar visita em contato ou venda.',
      valorTexto: 'R$ 1.700',
      total: 1700,
      cartao: 1900,
      prazo: '7 a 10 dias',
      hospedagem: 97,
      manutencao: 247,
      itens: [
        'Uma página única e completa, com visual sofisticado',
        'Copy, design e implementação',
        'Hospedagem obrigatória: R$ 97 por mês (1 mês grátis)'
      ],
    },
    site: {
      nome: 'Site institucional',
      icone: 'site',
      desc: 'Uma página principal com subpáginas, para apresentar o seu negócio com autoridade.',
      valorTexto: 'R$ 2.900',
      total: 2900,
      cartao: 3330,
      prazo: '7 a 15 dias',
      hospedagem: 147,
      manutencao: 297,
      itens: [
        'Uma página principal com até 4 subpáginas',
        'Copy, design e implementação',
        'Hospedagem obrigatória: R$ 147 por mês (1 mês grátis)'
      ],
    }
  },
  manutencao: {
    valor: 150,
    itens: [
      'Troca de imagens, telefone, números e textos',
      'Correção de erros e bugs',
      'Novas seções não entram: passamos o valor antes'
    ]
  }
};
