# Prompt único — instalar e testar o IArena no Claude Code

Cole todo o texto abaixo em uma sessão nova do Claude Code:

```text
Instale e prepare o IArena deste repositório:
https://github.com/henriqueCaruso/IArena

Objetivo: deixar o IArena disponível como skill global do Claude Code e executar um teste BRS com múltiplos agentes, sem alterar nenhum projeto real.

Proceda de forma autônoma e segura:

1. Detecte o sistema operacional e verifique `git`, `node --version` e `npx --version`. Exija Node.js 18 ou superior. Se faltar um pré-requisito, pare e informe somente o comando oficial necessário para instalá-lo.
2. Use como pasta padrão `%USERPROFILE%\IArena` no Windows ou `~/IArena` em macOS/Linux. Clone o repositório se não existir. Se já existir e o working tree estiver limpo, rode `git pull --ff-only`. Se houver mudanças locais, não apague nem sobrescreva nada.
3. Instale globalmente para o Claude Code as skills `iarena`, `ui-brs`, `favicon`, `revisor-ui` e `sintese-vencedora` usando:
   `npx skills add https://github.com/henriqueCaruso/IArena --skill iarena --skill ui-brs --skill favicon --skill revisor-ui --skill sintese-vencedora -a claude-code -g -y`
4. Confirme que a skill `iarena` foi instalada. Depois leia e siga `SKILL.md` no clone local.
5. Execute o teste de scaffolding: `node --test tests/scaffold.test.mjs`. Não instale dependências.
6. Crie uma competição de demonstração usando `examples/config.brs.multiagente.json`. O tema BRS deve ser uma restrição compartilhada por todos, nunca uma vantagem exclusiva de um competidor.
7. Leia o manifesto gerado e use um subagente isolado para cada prompt. Execute em paralelo até o limite definido no manifesto. Cada subagente pode ler somente seu prompt e escrever somente seu output. Se este runtime não oferecer subagentes, execute as variantes em sessões novas e sequenciais e registre esse fallback.
8. Valide que todos os HTMLs existem, não estão vazios e contêm o comentário `<!-- iarena:`. Não faça síntese e não altere produto real.
9. Inicie `node server.mjs` em um processo separado, sem bloquear a sessão. Abra ou informe a URL da galeria gerada.
10. Ao terminar, responda em português com: pasta instalada, skills instaladas, resultado dos testes, quantidade de agentes executados, tema usado e URL da Arena.

Regras: não usar flags perigosas, não instalar pacotes no IArena, não fazer deploy, não editar repositórios de trabalho e não permitir que um competidor veja a saída dos outros.
```
