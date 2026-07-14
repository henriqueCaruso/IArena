---
name: ui-brs
description: Cria e revisa interfaces operacionais consistentes com os produtos internos da BR Supply. Use em dashboards, filas, portais, ferramentas de IA e automações. Em competições IArena, pode ser uma abordagem exclusiva ou complementar ao tema BRS compartilhado.
license: MIT
---

# UI BRS

Padrão de produto operacional. O tema visual canônico vive em `themes/brs/`; esta skill adiciona decisões de UX, linguagem e estrutura, evitando duplicar tokens.

## Leia sob demanda

- Tokens: `themes/brs/tokens.css`
- Componentes: `themes/brs/components.css`
- Starter autocontido: `themes/brs/starter.html`
- Critérios de marca: `themes/brs/criterios.md`

## Prioridade

1. O usuário entende o estado e a próxima ação.
2. Dados reais aparecem antes de decoração.
3. Ações críticas têm rótulos claros em português.
4. A interface parece parte do mesmo ecossistema.
5. O código permanece simples e implementável.

## Componentes e layout

- Cabeçalho compacto com produto, contexto, alertas e ações globais.
- Navegação curta, com SVG consistente; não use emoji como ícone principal.
- Tabelas e listas para comparação operacional; cards apenas quando agrupam informação de verdade.
- Status sempre com texto, não apenas cor.
- Ação primária única por contexto; ações secundárias discretas.
- Dados recebidos e resolvidos lado a lado quando a decisão depende da comparação.
- Termos técnicos explicados em uma frase próxima ao rótulo.
- Densidade suficiente para trabalho diário sem sacrificar legibilidade.

## Linguagem

- Português simples e direto.
- Prefira verbos concretos: `Revisar`, `Aprovar`, `Buscar manualmente`, `Ver auditoria`.
- Evite jargão sem explicação e nomes ingleses quando houver termo operacional claro.
- Erros dizem o que aconteceu e qual é a próxima ação.

## Qualidade mínima

- Contraste legível e foco visível.
- Navegação por teclado nas ações principais.
- Layout utilizável em 1366×768 e telas menores.
- Estados vazio, carregando, sucesso, alerta e erro coerentes.
- Nenhuma regra de negócio inventada para preencher espaço.

## IArena

Quando a configuração usar `"theme":"brs"`, todos recebem a identidade BRS. Nesse caso, esta skill deve competir pela qualidade da estrutura operacional e da linguagem, não por simplesmente aplicar a paleta.
