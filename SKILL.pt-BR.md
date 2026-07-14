---
name: iarena
description: Executa uma comparação controlada entre IAs, prompts, skills ou modelos usando o mesmo brief, outputs isolados, galeria com comentários, voto e rodada de síntese. Use quando houver duas ou mais abordagens plausíveis e a decisão humana se beneficiar de comparação lado a lado.
license: MIT
---

# IArena

## Objetivo

Criar evidência comparável, não apenas muitas respostas. O fluxo separa geração, revisão, voto, síntese e implementação.

## Procedimento

1. Defina a variável testada.
2. Escreva um brief único e critérios comuns.
3. Selecione de 3 a 5 variantes, incluindo baseline quando o ganho da skill estiver em dúvida.
4. Crie uma configuração e execute:

```bash
node scripts/nova-competicao.mjs --config=<arquivo.json>
```

5. Rode cada prompt em sessão ou agente isolado.
6. Inicie `node server.mjs` e revise a galeria.
7. Aplique a mesma skill de auditoria a todas as variantes.
8. Copie comentários e voto.
9. Faça uma segunda rodada com no máximo duas sínteses.
10. Converta a vencedora em plano de implementação no produto real.

## Seleção de skills

- criação: `frontend-design`, `ui-brs`, `UI/UX Pro Max`, `theme-factory`;
- acabamento: `favicon`;
- qualidade: `revisor-ui`, `web-design-guidelines`, `react-best-practices`;
- síntese: `sintese-vencedora`;
- meta: `Design Systems to Agent Skills`.

Consulte `/skills.html` ou `public/skills.json` para links e comandos.

## Regras de token efficiency

- Referencie arquivos; não duplique brief e skill em cada prompt.
- Leia somente o necessário.
- Use `templates/starter.html`.
- Não execute builds ou instalações durante a geração de mockups.
- Guarde modelos caros para síntese ou revisão crítica.
- Não leve todas as variantes para a rodada final.

## Critério de encerramento

A competição termina quando há vencedor, feedback consolidado, decisões rastreáveis e um plano separado para implementar no código real.
