---
name: sintese-vencedora
description: Cria a segunda rodada de uma competição IArena usando as melhores variantes, votos e comentários. Mantém uma proposta como esqueleto e incorpora apenas elementos sustentados por evidência.
license: MIT
---

# Síntese vencedora

## Entrada

- Brief original.
- Duas melhores variantes da rodada anterior.
- Voto humano.
- Comentários humanos e do revisor de UI.
- Critérios comuns.

## Regras

1. Escolha uma variante como esqueleto; não faça uma média visual sem direção.
2. Para cada elemento importado, registre origem e comentário que justifica a escolha.
3. Resolva primeiro os problemas recorrentes apontados em mais de uma variante.
4. Preserve requisitos e dados reais do brief.
5. Remova elementos elogiados apenas por decoração quando aumentarem complexidade sem melhorar a tarefa.
6. Gere no máximo duas sínteses independentes na rodada final.
7. A síntese deve funcionar de ponta a ponta, não apenas redesenhar o cabeçalho.

## Registro de decisão

Inclua no comentário final do HTML:

```json
{
  "esqueleto": "variante-X",
  "elementos_importados": [
    {"elemento":"...","origem":"variante-Y","evidencia":"comentário/voto"}
  ],
  "problemas_resolvidos": ["..."],
  "suposicoes": []
}
```
