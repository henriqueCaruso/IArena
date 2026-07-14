# Perfis de execução do IArena no Claude Code

## Normal

- 2–3 competidores.
- Concorrência 1.
- Ideal para ensinar o fluxo ou comparar duas abordagens.
- Sem revisores automáticos por padrão.

## Multiagente

- 3–5 competidores.
- Concorrência recomendada: 3 ou 4.
- Um subagente por prompt e um arquivo exclusivo por subagente.
- Após geração, apenas validação mecânica e abertura da galeria.
- Melhor equilíbrio entre diversidade, custo e velocidade.

Exemplo:

```json
"execution": {
  "profile": "multiagente",
  "concurrency": 4,
  "reviewers": 1
}
```

## Ultracode

Nome interno do perfil IArena. Não presuma que seja uma flag ou função oficial do Claude Code.

Fase 1:

- 4–6 criadores isolados;
- concorrência máxima 5;
- validação mecânica de cada saída;
- até 2 revisores independentes usando os mesmos critérios.

Gate humano:

- abrir a galeria;
- comentar elementos concretos;
- votar;
- selecionar até 2 finalistas.

Fase 2:

- 1 ou 2 agentes de síntese;
- recebem apenas brief, finalistas, voto, feedback consolidado e achados dos revisores;
- produzem nova rodada, sem alterar produto real.

Use somente quando o problema justificar custo maior. Para uma tela simples, `multiagente` costuma ser suficiente.
