# Skills do IArena

O repositório contém a skill principal `iarena` na raiz (`SKILL.md`) e skills complementares em `skills/`.

Instalação recomendada para Claude Code:

```bash
npx skills add https://github.com/henriqueCaruso/IArena --skill iarena --skill ui-brs --skill favicon --skill revisor-ui --skill sintese-vencedora -a claude-code -g -y
```

Papéis:

- **Orquestração:** `iarena` prepara o projeto, gera prompts e coordena subagentes.
- **Criação/marca:** `ui-brs` melhora estrutura operacional dentro ou fora do tema BRS.
- **Acabamento:** `favicon` complementa uma proposta.
- **Qualidade:** `revisor-ui` revisa todas as variantes com os mesmos critérios.
- **Síntese:** `sintese-vencedora` entra somente após comentários e voto.

Não compare uma skill criadora contra uma skill de auditoria como se fossem equivalentes. Uma competição justa mantém o mesmo brief, modelo, limite, tema e arquivo de saída, alterando apenas a variável declarada.

A página `http://localhost:4600/skills.html` contém links e comandos copiáveis para todas as opções catalogadas.
