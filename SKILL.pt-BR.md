---
name: iarena-reference-ptbr
description: Referência operacional em português para comparar IAs, prompts, skills ou modelos usando brief comum, outputs isolados, tema opcional, galeria, voto e síntese.
license: MIT
---

# IArena — referência operacional

A skill instalável principal está em `SKILL.md`. Este arquivo resume o processo para leitura humana.

## Procedimento

1. Defina a variável testada.
2. Escreva um brief único e critérios comuns.
3. Escolha o perfil: `normal`, `multiagente` ou `ultracode`.
4. Ative `"theme":"brs"` quando todos precisarem seguir o design system BRS.
5. Selecione de 3 a 5 variantes, incluindo baseline quando o ganho da skill estiver em dúvida.
6. Execute:

```bash
node scripts/nova-competicao.mjs --config=<arquivo.json>
```

7. Rode cada prompt em subagente ou sessão isolada.
8. Inicie `node server.mjs` e revise a galeria.
9. Aplique a mesma auditoria a todas as variantes.
10. Faça segunda rodada com no máximo duas sínteses, somente após comentários e voto.
11. Converta a vencedora em plano separado para o produto real.

## Tema BRS

O preset `brs` fornece tokens, starter, componentes e critérios comuns. Ele não deve ser tratado como diferencial exclusivo de `ui-brs`; a skill `ui-brs` compete por estrutura operacional, linguagem e velocidade de decisão.

## Seleção de skills

- orquestração: `iarena`;
- criação: `frontend-design`, `ui-brs`, `UI/UX Pro Max`, `theme-factory`;
- acabamento: `favicon`;
- qualidade: `revisor-ui`, `web-design-guidelines`, `react-best-practices`;
- síntese: `sintese-vencedora`.

## Token efficiency

- Referencie arquivos; não duplique brief, tema e skill no prompt.
- Cada agente lê somente seu contrato.
- Use o starter do tema ou `templates/starter.html`.
- Não execute builds ou instalações durante mockups.
- Guarde modelos caros para síntese ou revisão crítica.
