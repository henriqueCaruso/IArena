---
name: ui-brs
description: Cria e revisa interfaces operacionais consistentes com o padrão digital usado nos produtos internos da BR Supply: modo escuro, preto/branco/laranja, linguagem simples, tabelas claras e foco em decisão. Use em dashboards, filas, portais, ferramentas de IA e automações internas.
license: MIT
---

# UI BRS

Padrão compartilhável para produtos digitais internos. Não substitui um manual corporativo oficial; traduz as decisões já validadas em IA Pedidos, Produto Certo e ferramentas do AI OS.

## Prioridade

1. O usuário entende o estado e a próxima ação.
2. Dados reais aparecem antes de decoração.
3. Ações críticas têm rótulos claros em português.
4. A interface parece parte do mesmo ecossistema.
5. O código permanece simples e implementável.

## Tokens recomendados

```css
:root{
  --bg:#0b0d10;
  --panel:#14171c;
  --panel-2:#1b1f26;
  --line:#2a2f38;
  --text:#f5f6f7;
  --muted:#9aa1ab;
  --brand:#ea580c;
  --success:#3ecf8e;
  --warning:#f59e0b;
  --danger:#ef4444;
  --sans:"Archivo","Segoe UI",system-ui,sans-serif;
  --mono:"JetBrains Mono","Cascadia Code",Consolas,monospace;
  --radius:8px;
}
```

Use o laranja como sinal de marca, ação principal, foco ou destaque operacional. Não pinte grandes áreas de laranja sem motivo. Fundo, painéis e tabelas devem usar tons neutros escuros.

## Componentes e layout

- Cabeçalho compacto com produto, contexto atual, alertas e ações globais.
- Navegação curta, com SVG consistente; não use emoji como ícone principal.
- Tabelas e listas para comparação operacional; cards apenas quando agrupam informação de verdade.
- Status sempre com texto, não apenas cor.
- Ação primária única por contexto; ações secundárias visualmente discretas.
- Dados recebidos e resolvidos devem aparecer lado a lado quando a decisão depende da comparação.
- Explique termos técnicos em uma frase próxima ao rótulo.
- Preserve densidade suficiente para trabalho diário, sem reduzir fonte ou espaçamento até ficar ilegível.

## Linguagem

- Português simples e direto.
- Prefira verbos concretos: `Revisar`, `Aprovar`, `Buscar manualmente`, `Ver auditoria`.
- Evite jargão sem explicação, frases publicitárias e nomes ingleses quando houver termo operacional claro.
- Mensagens de erro devem dizer o que aconteceu e qual é a próxima ação.

## Favicon e identidade

- SVG autocontido, `viewBox="0 0 32 32"`.
- Base quadrada com `rx="7"` e cor principal `#ea580c`.
- Símbolo simples, reconhecível em 16×16; evite gráfico genérico ou detalhe fino.
- Inclua `<link rel="icon" ...>` no HTML final.

## Qualidade mínima

- Contraste legível e foco visível.
- Navegação por teclado nas ações principais.
- Layout utilizável em 1366×768 e em telas menores.
- Estados vazio, carregando, sucesso, alerta e erro coerentes.
- Nenhuma regra de negócio inventada para preencher espaço.

## Saída em uma competição IArena

Produza um único HTML autocontido. Leia somente o brief, esta skill, os critérios e o template indicados. Não leia outras variantes. No comentário final, registre decisões e suposições.
