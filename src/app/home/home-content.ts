export interface Pillar {
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly topics: readonly string[];
}

export const pillars: readonly Pillar[] = [
  {
    eyebrow: 'Comece pelo agora',
    title: 'Organizar',
    summary:
      'Entenda para onde seu dinheiro vai e transforme intenção em um plano possível.',
    topics: [
      'A importância de investir em educação financeira',
      'Quebra de paradigmas ao falar sobre dinheiro',
      'Como criar consciência sobre o que gasta',
      'Como reduzir custos desnecessários',
    ],
  },
  {
    eyebrow: 'Construa segurança',
    title: 'Proteger',
    summary:
      'Crie margem para imprevistos e dê um papel claro para cada parte da sua renda.',
    topics: [
      'Como estabelecer metas financeiras',
      'Como separar finanças pessoais e do negócio',
      'O que é reserva de emergência e por que ter uma',
      'Como organizar seus gastos em uma planilha',
      'A regra do ovo: como se organizar para ter 30% da renda sobrando',
    ],
  },
  {
    eyebrow: 'Prepare o futuro',
    title: 'Crescer',
    summary:
      'Conheça caminhos para ampliar a renda e começar a investir com consciência.',
    topics: [
      'Como diversificar suas fontes de renda',
      'Introdução a investimentos',
      'Renda fixa',
      'Por que a poupança pode fazer você perder dinheiro',
      'Conceitos de taxas simples de juros',
      'Renda variável e o mercado de ações',
    ],
  },
];

export const practicalBenefits = [
  'Gestão eficiente do dinheiro',
  'Tomada de decisões informadas',
  'Controle sobre a dívida',
  'Construção de patrimônio',
  'Melhor capacidade de lidar com emergências financeiras',
  'Redução do estresse financeiro',
  'Planejamento para o futuro',
  'Aumento da segurança financeira',
  'Desenvolvimento de uma mentalidade de prosperidade',
  'Um estilo de vida mais leve',
] as const;
