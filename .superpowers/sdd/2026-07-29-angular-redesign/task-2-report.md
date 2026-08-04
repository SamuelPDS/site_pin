# Task 2 — Shell compartilhado acessível

## Implementação

- Criei `SiteHeader` standalone com link de salto, marca, navegação por rotas/fragments e menu móvel controlado por `Signal<boolean>`.
- O menu móvel fica com `visibility: hidden` e `pointer-events: none` quando fechado; Escape fecha o menu aberto e devolve o foco ao botão.
- Criei `SiteFooter` semântico com os contatos existentes, Instagram seguro em nova aba e ano atual.
- Compus cabeçalho, conteúdo roteado e rodapé no componente raiz; incluí favicon SVG.
- Defini tokens, reset, foco visível, controles reutilizáveis e redução de movimento globais.
- Empacotei Sora, Source Sans 3 e IBM Plex Mono com `@fontsource`; não há fontes ou preconnects externos em runtime.

## Comandos e resultados

| Comando | Resultado |
| --- | --- |
| `npm install @fontsource/sora @fontsource/source-sans-3 @fontsource/ibm-plex-mono` | concluído; 3 dependências adicionadas |
| `npm run build` | concluído com código 0; bundles de produção gerados em `dist/jovens-empreendedores` |
| `git diff --check` | concluído com código 0; nenhum erro de whitespace |

Não foram criados ou executados testes automatizados, conforme a instrução substituta do usuário.

## Arquivos

- `package.json`, `package-lock.json`
- `public/favicon.svg`
- `src/index.html`, `src/styles.css`
- `src/app/app.ts`, `src/app/app.html`, `src/app/app.css`
- `src/app/shared/site-header/*`
- `src/app/shared/site-footer/*`

## Autoavaliação comportamental

- O salto para conteúdo aponta para o `main` focável; navegação e botão possuem foco visível.
- O botão expõe `aria-controls` e estado `aria-expanded`; os links do menu fechado não podem receber interação de ponteiro ou teclado.
- Os links solicitados preservam os destinos `/inicio#conteudo`, `/inicio#sobre`, `/inicio#contato` e `/inscricao`.
- O rodapé preserva os textos e canais de contato existentes, incluindo email, telefone e Instagram.

## Preocupações

- A home ainda é o placeholder da Task 1, portanto os fragments serão os alvos definitivos quando a Task de home adicionar as seções correspondentes.
- `npm install` reportou 3 vulnerabilidades moderadas já presentes na auditoria de dependências; não foi executado `npm audit fix` para evitar atualização não solicitada.
