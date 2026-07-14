# 🏟️ IArena

Compare várias IAs, prompts, skills ou modelos no **mesmo problema**, lado a lado. Comente em qualquer elemento, vote, copie o feedback estruturado e use esse material na rodada seguinte.

O IArena é AI First: agentes trabalham com arquivos pequenos e contratos explícitos; o humano decide usando a galeria. Continua **sem dependências**: um servidor Node.js, HTML estático e JSON em disco.

## Início rápido

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

## Criar uma competição de design

1. Copie e preencha `templates/brief-design.pt-BR.md`.
2. Copie `examples/config.design.pt-BR.json` e escolha os competidores.
3. Gere prompts isolados e o registro da galeria:

```bash
node scripts/nova-competicao.mjs --config=examples/config.design.pt-BR.json
```

4. Entregue cada arquivo de `runs/<competicao>/prompts/` a um agente diferente.
5. Execute `node server.mjs` e abra a URL indicada pelo gerador.

O script cria:

```text
runs/<slug>-rN/
  PROMPTS.md
  manifest.json
  prompts/                 # um prompt mínimo por competidor
entries/
  <slug>.md                # visão geral e votação
  _galleries.json          # grupo da galeria
  <slug>-rN-vX-*.html      # arquivos que os agentes devem produzir
```

## Fluxo recomendado

```text
brief único
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

A página oferece links e comandos copiáveis para:

- skills internas compartilháveis: `ui-brs`, `favicon`, `revisor-ui`, `sintese-vencedora`;
- Anthropic: `frontend-design`, `theme-factory`, `brand-guidelines`;
- NextLevelBuilder: `UI/UX Pro Max`;
- Vercel: `web-design-guidelines`, `react-best-practices` e pipeline para transformar design systems em skills.

O catálogo está em `public/skills.json`, portanto pode ser atualizado sem alterar o servidor.

## Economia de tokens

- O brief é um arquivo referenciado; não é duplicado em todos os prompts.
- Cada competidor lê somente brief, critérios, template e sua própria skill.
- A baseline mede se a skill realmente melhora o resultado.
- `templates/starter.html` evita reescrever CSS e estrutura comum.
- Cada competidor altera somente seu HTML; sem build, instalação ou leitura do projeto inteiro.
- A rodada 2 recebe apenas vencedoras e feedback consolidado, não todas as transcrições.
- Skills são usadas por link ou pelo `npx skills use`, sem colar seus textos no prompt.

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
public/
  index.html
  skills.html
  skills.json
  entry-shell.html
  gallery-shell.html
scripts/
  nova-competicao.mjs
templates/
  starter.html
  brief-design.pt-BR.md
  criterios-design.pt-BR.md
skills/
  ui-brs/
  favicon/
  revisor-ui/
  sintese-vencedora/
example/entries/
SKILL.md                   # referência em inglês
SKILL.pt-BR.md             # processo em português
GUIA_PT-BR.md
AGENTS.md
```

## Configuração

| Variável/flag | Padrão | Uso |
|---|---|---|
| `PORT` / `--port=` | `4600` | Porta HTTP |
| `ENTRIES_DIR` / `--dir=` | `./entries` | Pasta de competições e comentários |

## Segurança e limites

O IArena foi projetado para uso local ou em rede interna confiável. Não possui autenticação nem isolamento multi-tenant. Se for publicado, coloque-o atrás de proxy com autenticação e controle de acesso.

## Documentação

- `GUIA_PT-BR.md`: processo completo para colegas.
- `AGENTS.md`: contrato curto para agentes.
- `SKILL.pt-BR.md`: skill operacional em português.
- `SKILL.md`: referência técnica em inglês.

## Licença

MIT — consulte `LICENSE`.
