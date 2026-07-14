# 🏟️ IArena

Compare várias IAs, prompts, skills ou modelos no **mesmo problema**, lado a lado. Comente em qualquer elemento, vote, copie o feedback estruturado e use esse material na rodada seguinte.

O IArena é AI First: agentes trabalham com arquivos pequenos e contratos explícitos; o humano decide usando a galeria. Continua **sem dependências**: um servidor Node.js, HTML estático e JSON em disco.

## Instalar no Claude Code com um único prompt

Abra `PROMPT-INSTALAR-CLAUDE-CODE.md`, copie o bloco completo e cole em uma sessão nova do Claude Code. Ele:

- clona ou atualiza o IArena sem sobrescrever mudanças locais;
- instala globalmente as skills `iarena`, `ui-brs`, `favicon`, `revisor-ui` e `sintese-vencedora`;
- valida o projeto;
- executa uma demonstração BRS com múltiplos agentes isolados;
- inicia a Arena e informa a URL.

Instalação direta das skills, sem executar a demonstração:

```bash
npx skills add https://github.com/henriqueCaruso/IArena --skill iarena --skill ui-brs --skill favicon --skill revisor-ui --skill sintese-vencedora -a claude-code -g -y
```

Depois, no Claude Code, peça em linguagem natural:

```text
Use a skill iarena em modo multiagente com tema BRS para comparar quatro propostas desta tela.
```

## Início rápido manual

```bash
git clone https://github.com/henriqueCaruso/IArena.git
cd IArena
node server.mjs
# http://localhost:4600
```

Para abrir o exemplo incluído:

```bash
ENTRIES_DIR=./example/entries node server.mjs
```

## Tema opcional BRS

O preset `brs` foi extraído dos tokens e componentes compartilhados pelo AI OS e pela Mesa BRS. Ele usa a identidade **Control Room**:

- fundo `#0c1118`, painéis `#121a25` e `#18222f`;
- laranja de marca `#FF782D`;
- Archivo para títulos, Hanken Grotesk para texto e JetBrains Mono para dados;
- componentes operacionais para header, painel, card, botão, badge, tabela e campos.

Ative no arquivo de configuração:

```json
{
  "theme": "brs"
}
```

O tema é uma restrição compartilhada. Baseline e demais competidores recebem os mesmos tokens, starter e critérios. Assim, a Arena compara a qualidade das abordagens dentro da mesma identidade, e não “BRS contra outra marca”.

Arquivos do tema:

```text
themes/brs/theme.json
themes/brs/tokens.css
themes/brs/components.css
themes/brs/starter.html
themes/brs/criterios.md
```

## Perfis para Claude Code

- `normal`: 2–3 variantes, execução manual ou sequencial.
- `multiagente`: 3–5 subagentes isolados, preferencialmente paralelos. É o padrão recomendado.
- `ultracode`: perfil próprio do IArena com 4–6 criadores, validação e até 2 revisores; a síntese só começa depois do voto humano.

`ultracode` é um nome do fluxo IArena, não uma flag oficial do Claude Code. Se o runtime não oferecer subagentes, a skill usa sessões novas e sequenciais sem fingir isolamento.

## Criar uma competição de design

1. Copie e preencha `templates/brief-design.pt-BR.md`.
2. Copie `examples/config.design.pt-BR.json` ou `examples/config.brs.multiagente.json`.
3. Gere prompts isolados e o registro da galeria:

```bash
node scripts/nova-competicao.mjs --config=examples/config.brs.multiagente.json
```

4. Entregue cada arquivo de `runs/<competicao>/prompts/` a um agente diferente, ou deixe a skill `iarena` orquestrar.
5. Execute `node server.mjs` e abra a URL indicada pelo gerador.

O script cria:

```text
runs/<slug>-rN/
  PROMPTS.md
  manifest.json             # inclui tema e perfil de execução
  prompts/                  # um prompt mínimo por competidor
entries/
  <slug>.md                 # visão geral e votação
  _galleries.json           # grupo da galeria
  <slug>-rN-vX-*.html       # arquivos que os agentes devem produzir
```

## Fluxo recomendado

```text
brief único
  → tema compartilhado opcional
  → baseline + variantes criadoras isoladas
  → galeria + comentários humanos
  → revisão técnica igual para todas
  → voto
  → rodada 2 com no máximo duas sínteses
  → implementação real da vencedora
```

Não misture papéis na primeira rodada. `frontend-design`, `ui-brs` e `UI/UX Pro Max` podem gerar propostas. `web-design-guidelines`, `react-best-practices` e `revisor-ui` são melhores como auditoria posterior. `sintese-vencedora` trabalha apenas depois do feedback.

## Catálogo de skills

Com o servidor aberto, acesse:

```text
http://localhost:4600/skills.html
```

A página oferece links e comandos copiáveis para skills internas, Anthropic, NextLevelBuilder e Vercel. O catálogo está em `public/skills.json`.

## Economia de tokens

- O brief é referenciado; não é duplicado em todos os prompts.
- Tema, critérios e referências são arquivos comuns carregados sob demanda.
- Cada competidor lê somente brief, critérios, starter, tema e suas próprias skills.
- A baseline mede se a skill realmente melhora o resultado.
- Cada competidor altera somente seu HTML; sem build, instalação ou leitura do projeto inteiro.
- A rodada 2 recebe apenas finalistas e feedback consolidado.
- Skills são instaladas ou usadas por link, sem colar seu conteúdo no prompt.

## Modos de comparação

### Galeria visual

Cada competidor escreve um HTML autocontido. O IArena adiciona navegação, comentário por seleção, comentário por elemento, nota geral e cópia de todo o feedback.

### Texto

Cada competidor escreve um Markdown. Um bloco `vote` vira votação clicável:

````markdown
```vote
Qual proposta vence?
- Proposta A
- Proposta B
```
````

## Estrutura

```text
server.mjs
CLAUDE.md
PROMPT-INSTALAR-CLAUDE-CODE.md
public/
scripts/
  nova-competicao.mjs
templates/
themes/
  brs/
skills/
  ui-brs/
  favicon/
  revisor-ui/
  sintese-vencedora/
references/
  perfis.md
examples/
  config.brs.multiagente.json
  brief.brs-demo.md
SKILL.md                   # skill principal instalável
SKILL.pt-BR.md             # referência operacional
GUIA_PT-BR.md
AGENTS.md
```

## Configuração

| Campo/variável | Padrão | Uso |
|---|---|---|
| `theme` | nenhum | Preset compartilhado, por exemplo `brs` |
| `execution.profile` | `manual` | `normal`, `multiagente` ou `ultracode` |
| `execution.concurrency` | `1` | Limite sugerido de subagentes paralelos |
| `execution.reviewers` | `0` | Revisores após a geração |
| `PORT` / `--port=` | `4600` | Porta HTTP |
| `ENTRIES_DIR` / `--dir=` | `./entries` | Pasta de competições e comentários |

## Segurança e limites

O IArena foi projetado para uso local ou em rede interna confiável. Não possui autenticação nem isolamento multi-tenant. Se for publicado, coloque-o atrás de proxy com autenticação e controle de acesso.

Uma competição não deve alterar produto real, instalar pacotes, fazer deploy ou compartilhar outputs entre competidores.

## Licença

MIT — consulte `LICENSE`.
