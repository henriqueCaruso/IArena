# IArena — instruções para Claude Code

Quando o usuário pedir comparação de skills, prompts, modelos, layouts ou abordagens, use a skill `iarena`.

- O servidor é zero-dependency: `node server.mjs`.
- O gerador é `node scripts/nova-competicao.mjs --config=<config>`.
- Tema opcional da BR Supply: `"theme":"brs"`.
- Perfis: `normal`, `multiagente` e `ultracode`.
- Cada competidor escreve apenas seu output e não lê outras variantes.
- Competições nunca alteram o produto real.
- Síntese ocorre somente depois de comentários e voto humano.

Comece por `SKILL.md`. Para instalação em outra máquina, use `PROMPT-INSTALAR-CLAUDE-CODE.md`.
