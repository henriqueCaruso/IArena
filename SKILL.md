---
name: iarena
description: Instala, configura e opera o IArena no Claude Code. Use quando o usuário pedir para comparar skills, prompts, modelos, layouts ou planos; criar uma competição BRS; executar variantes com múltiplos agentes; revisar resultados; ou abrir a Arena local.
argument-hint: "[normal|multiagente|ultracode] [brs opcional] [objetivo]"
license: MIT
---

# IArena para Claude Code

Orquestre competições reproduzíveis sem misturar o contexto dos competidores. O repositório canônico é `https://github.com/henriqueCaruso/IArena`.

## 1. Localize ou prepare o projeto

Procure nesta ordem:

1. diretório atual, quando contiver `server.mjs` e `scripts/nova-competicao.mjs`;
2. variável `IARENA_HOME`;
3. `%USERPROFILE%\IArena` no Windows;
4. `~/IArena` em macOS/Linux.

Se não existir, clone o repositório. Se existir e estiver limpo, atualize com `git pull --ff-only`. Se houver mudanças locais, não sobrescreva: informe o estado e trabalhe com a versão presente.

Pré-requisitos: Git e Node.js 18 ou superior. Não instale dependências do projeto; ele usa apenas módulos nativos do Node.

## 2. Escolha o perfil

- `normal`: 2 a 3 variantes, execução manual ou sequencial.
- `multiagente`: 3 a 5 variantes criadoras em subagentes isolados, preferencialmente paralelos.
- `ultracode`: perfil do IArena, não um recurso oficial do Claude Code. Executa 4 a 6 variantes, valida contratos, aplica até 2 revisores independentes e prepara a rodada 2 somente após feedback humano.

Detalhes e limites: `references/perfis.md`.

## 3. Tema opcional BRS

Quando o usuário disser `BRS`, `BR Supply`, `tema BRS` ou `competição BRS`, configure:

```json
"theme": "brs"
```

O tema é compartilhado por todos os competidores. Ele fixa tokens, tipografia, componentes mínimos e critérios de marca, mas cada skill continua responsável por sua abordagem. Não declare o tema como vantagem exclusiva de uma variante.

## 4. Prepare brief e configuração

- Use `templates/brief-design.pt-BR.md` como fonte única.
- Para um teste BRS, copie `examples/config.brs.multiagente.json` e `examples/brief.brs-demo.md`.
- Para trabalho real, substitua os dados do exemplo por fatos fornecidos pelo usuário.
- Mude uma variável por variante sempre que possível.

Gere a competição:

```bash
node scripts/nova-competicao.mjs --config=<arquivo.json>
```

Leia o `manifest.json` criado. Não leia outputs ainda inexistentes nem permita que um competidor veja o arquivo de outro.

## 5. Execute com subagentes

Quando o runtime oferecer subagentes/Agent/Task:

1. crie um subagente por item de `manifest.prompts`;
2. envie apenas o caminho do prompt correspondente;
3. permita escrita somente no arquivo `output` daquele item;
4. execute em paralelo até o limite `manifest.execution.concurrency`;
5. aguarde todos terminarem;
6. valide existência, tamanho maior que zero e comentário `<!-- iarena:` em cada HTML.

Não use o mesmo subagente para duas variantes. Não compartilhe mensagens, rascunhos ou outputs entre competidores.

Se subagentes não estiverem disponíveis, execute em sessões novas e sequenciais. O scaffolding continua válido; não simule isolamento dentro de uma única resposta longa.

## 6. Revisão e Arena

Após todas as variantes:

- inicie `node server.mjs` em processo separado;
- abra a URL `http://localhost:4600` e a `gallery_url` do manifesto;
- no perfil `ultracode`, aplique `revisor-ui` e uma auditoria técnica equivalente a todas as variantes;
- não faça síntese antes do usuário comentar e votar;
- depois do feedback, use `sintese-vencedora` com no máximo duas finalistas.

## 7. Contratos de segurança e custo

- Nunca altere o produto real durante uma competição.
- Não instale pacotes, não faça deploy e não rode comandos destrutivos.
- Confirme antes de usar mais de 5 criadores ou 2 revisores.
- Prefira o mesmo modelo para medir efeito de skill.
- Use modelo mais forte apenas na síntese quando necessário.
- Ao final, informe: perfil, tema, quantidade de agentes, outputs, URL da galeria e qualquer fallback usado.
