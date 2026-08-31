# Redesign Angular — Jovens Empreendedores

## Objetivo

Reestruturar o site estático “Jovens Empreendedores” como uma aplicação Angular standalone, responsiva, acessível e fácil de manter. A nova experiência deve preservar o nome, o conteúdo textual e a proposta de democratizar a educação financeira, enquanto reformula por completo a arquitetura, a identidade visual e a navegação.

O público é amplo e possui diferentes níveis de familiaridade com finanças. A interface deve, portanto, ser clara para iniciantes sem assumir um tom infantil.

## Escopo

### Incluído

- Migração das três páginas estáticas para uma aplicação Angular.
- Nova identidade visual, mantendo apenas o nome “Jovens Empreendedores”.
- Reorganização do conteúdo atual, com correções ortográficas e de apresentação que não alterem seu significado.
- Landing page, formulário de inscrição e confirmação em rotas próprias.
- Formulário reativo com validação local e envio simulado.
- Layout responsivo para celular, tablet e desktop.
- Acessibilidade por teclado, foco visível, contraste WCAG AA e suporte a movimento reduzido.
- Testes dos fluxos principais e build de produção.

### Não incluído

- Backend, API, banco de dados ou envio de e-mail.
- Armazenamento de dados pessoais, inclusive no navegador.
- Autenticação, área do aluno ou módulos de curso.
- Redesign editorial que altere a mensagem dos textos existentes.

## Arquitetura

A aplicação usará Angular standalone e Angular Router. As rotas serão:

- `/inicio`: landing page principal;
- `/inscricao`: formulário de inscrição;
- `/confirmacao`: confirmação após um envio local válido;
- rota curinga: redirecionamento para `/inicio`;
- rota raiz: redirecionamento para `/inicio`.

O cabeçalho, o rodapé e os controles de ação reutilizáveis serão componentes compartilhados. As páginas serão componentes de rota. Blocos internos só serão extraídos quando tiverem responsabilidade própria, comportamento independente ou reutilização real; o projeto evitará componentes pequenos sem benefício de manutenção.

Conteúdos repetitivos, como os pilares e as listas de benefícios, serão representados por dados tipados e renderizados declarativamente. Nenhum serviço de persistência será criado nesta fase.

## Organização da landing page

A página inicial seguirá esta ordem:

1. Cabeçalho com nova marca tipográfica e navegação por âncoras.
2. Hero com a proposta central e chamada para inscrição.
3. Conteúdos ensinados, agrupados nos pilares Organizar, Proteger e Crescer.
4. Explicação em vídeo sobre educação financeira.
5. Missão, visão e impacto social.
6. Benefícios práticos da educação financeira.
7. Chamada final para inscrição.
8. Rodapé com Instagram, e-mail, telefone e direitos autorais.

Os links do cabeçalho devem levar às seções correspondentes da landing page. Ao retornar de outra rota, a navegação por seção deve abrir `/inicio` e posicionar o conteúdo corretamente.

## Direção visual

A linguagem será clean, otimista e adulta. Ela usará espaço em branco generoso, largura máxima controlada, composição assimétrica e poucos cartões. Gradientes decorativos, excesso de sombras e padrões visuais de dashboard serão evitados.

### Paleta

- Papel frio `#F5F7FA`: fundo principal.
- Tinta profunda `#122033`: texto e áreas de alto contraste.
- Azul conhecimento `#2E5BFF`: ações principais e links.
- Verde progresso `#38B28A`: evolução e confirmação.
- Amarelo decisão `#F2C14E`: destaques pontuais.
- Linha suave `#DCE3EC`: bordas, divisórias e campos.

Todos os pares de cor usados em textos e controles devem atingir contraste WCAG AA.

### Tipografia

- Sora: títulos e marca.
- Source Sans 3: textos e controles.
- IBM Plex Mono: pequenas etiquetas e indicadores.

As fontes devem ser carregadas com estratégia que evite texto invisível durante o carregamento e inclua fallbacks de sistema adequados.

### Assinatura visual

O elemento distintivo será um “mapa de decisões financeiras”: uma linha contínua que conecta os pilares Organizar, Proteger e Crescer. No hero, esse mapa funcionará como contraponto visual à mensagem principal. Ao longo da página, a mesma linha reaparecerá de forma discreta para dar unidade à jornada.

A linha poderá ser traçada na entrada da página. Outros movimentos serão limitados a transições curtas e úteis. Quando `prefers-reduced-motion` estiver ativo, animações não essenciais serão removidas.

## Responsividade e navegação

No desktop, o cabeçalho será horizontal e visualmente discreto durante a rolagem. Em telas estreitas, a navegação será apresentada em um painel compacto.

O menu móvel deve:

- indicar programaticamente seu estado aberto ou fechado;
- mover o foco de forma previsível;
- fechar ao selecionar um item;
- fechar com a tecla `Esc`;
- devolver o foco ao acionador após o fechamento;
- impedir que elementos ocultos recebam foco.

O vídeo será responsivo e manterá sua proporção. Conteúdos em múltiplas colunas serão reorganizados em uma única coluna quando necessário, sem depender de larguras ou margens fixas.

## Formulário de inscrição

O formulário conterá os campos atuais:

- nome;
- e-mail;
- telefone;
- faixa de renda mensal.

Todos os campos serão obrigatórios. O formulário usará Reactive Forms, com validação após a interação com cada campo e novamente na tentativa de envio. As mensagens devem indicar a correção necessária, como “Digite um e-mail válido”.

No envio válido:

1. o botão muda para “Enviando…”;
2. controles são temporariamente desabilitados para evitar envios duplicados;
3. uma espera curta simula o processamento;
4. nenhum dado é transmitido ou armazenado;
5. a aplicação navega para `/confirmacao`.

A página de confirmação informará que o formulário foi recebido na simulação e oferecerá uma ação clara para voltar ao início. Ela não deve afirmar que uma equipe recebeu os dados ou entrará em contato, pois não existe integração real.

## Tratamento de erros e estados

- Campos inválidos exibem mensagens específicas próximas ao controle.
- O resumo visual do campo inválido não dependerá somente de cor.
- Uma tentativa de envio inválida leva o foco ao primeiro campo com erro.
- Links externos inválidos ou indisponíveis não podem quebrar a navegação interna.
- Uma rota desconhecida redireciona de maneira previsível para `/inicio`.
- Se o vídeo externo não carregar, o restante do conteúdo continuará utilizável.

## Acessibilidade

- HTML semântico e hierarquia coerente de títulos.
- Regiões de cabeçalho, navegação, conteúdo principal e rodapé identificáveis.
- Texto alternativo útil em imagens informativas; imagens decorativas serão ignoradas por tecnologias assistivas.
- Estados de foco visíveis em links, botões e campos.
- Rótulos associados aos campos e mensagens de erro anunciáveis.
- Navegação completa por teclado.
- Áreas de toque adequadas em telas pequenas.
- Contraste mínimo WCAG AA.
- Respeito a `prefers-reduced-motion`.

## Estratégia de imagens

As imagens atuais poderão ser reaproveitadas quando tiverem resolução, enquadramento e coerência suficientes com a nova direção. Imagens de baixa qualidade ou meramente decorativas serão removidas em vez de ampliadas artificialmente.

O mapa de decisões e a marca serão construídos com HTML, CSS e, quando adequado, SVG local, garantindo nitidez e fácil adaptação de cor. Não haverá dependência de bibliotecas de ícones para elementos que podem ser representados de forma simples.

## Verificação

A implementação será considerada pronta quando:

- as rotas `/inicio`, `/inscricao` e `/confirmacao` carregarem corretamente;
- as rotas raiz e desconhecidas redirecionarem para `/inicio`;
- todos os campos obrigatórios forem validados;
- o envio inválido mantiver o usuário no formulário e indicar as correções;
- o envio válido simulado levar à confirmação sem persistir dados;
- o menu móvel funcionar por ponteiro e teclado;
- os links internos e externos estiverem corretos;
- o layout permanecer utilizável em celular, tablet e desktop;
- os estados de foco e movimento reduzido estiverem implementados;
- os testes automatizados definidos no plano de implementação passarem;
- o build de produção terminar sem erros.

## Decisões futuras compatíveis

A separação entre o formulário e a navegação permitirá adicionar uma API futuramente. Essa integração deverá substituir apenas o processamento simulado, preservando o contrato visual e as validações do formulário. Nenhuma abstração de backend será antecipada nesta fase.
