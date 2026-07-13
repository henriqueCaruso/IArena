# 🏟️ design-arena

Run a competition between multiple AI agents/prompts/skills/models on the **same** task, then compare
the results side by side: comment on any element (not just selectable text), vote on a winner, and copy
the structured feedback straight back into your next AI prompt.

Born out of comparing design mockups (5 different AI "design skills" redesigning the same UI shell),
then generalized: it works for anything you can generate N independent versions of — design mockups,
written plans, prompt A/B tests, model comparisons.

**Zero dependencies.** One Node.js file, JSON on disk. No framework, no database, no build step.

```bash
git clone https://github.com/<you>/design-arena.git
cd design-arena
node server.mjs
# → http://localhost:4600
```

The `example/` folder ships a tiny seeded competition so you see something immediately — copy its
`entries/` folder over the real one (or point `ENTRIES_DIR` at it) to try the UI before running your own.

```bash
ENTRIES_DIR=./example/entries node server.mjs
```

## Why this exists

Getting an AI to generate one thing is easy. Getting a *human* to efficiently compare 5 AI-generated
things and give feedback specific enough for another AI round to act on is the actual bottleneck. This
tool is just the review surface for that loop:

```
generate N variants (any AI, any tool)  →  arena (this repo)  →  human comments + votes  →  feed back to AI  →  repeat
```

## How it works

Two modes, pick whichever matches what your competitors produce — see **[SKILL.md](./SKILL.md)** for
the full instructions (written so any AI agent can follow them, not just a specific tool):

- **Text mode** — each competitor writes a markdown file; renders with a comment sidebar and a
  clickable `vote` block.
- **Gallery mode** — each competitor writes a self-contained HTML mockup; wrapped in a chrome with
  prev/next navigation, comment-by-selection AND comment-by-clicking-any-element, and a "copy all
  comments from every variant" button.

Both modes share the same tiny JSON comment store (`entries/_comments.json`) and the same feedback-loop
philosophy: structured, quotable, easy to paste back into an AI.

## Configuration

| Env var / flag | Default | What |
|---|---|---|
| `PORT` / `--port=` | `4600` | HTTP port |
| `ENTRIES_DIR` / `--dir=` | `./entries` | Where competition artifacts + `_comments.json` + `_galleries.json` live |

## Project layout

```
server.mjs           # the whole server — Node built-ins only, no npm install
public/
  index.html         # landing page listing competitions
  entry-shell.html   # text-mode chrome (markdown render + comments + vote)
  gallery-shell.html # gallery-mode chrome (iframe + comments + element-picker + prev/next)
entries/             # created on first run — your competitions live here (gitignored by default)
example/entries/     # a tiny seeded example you can point ENTRIES_DIR at
SKILL.md             # instructions for an AI agent on how to run a competition with this tool
```

## License

MIT — see [LICENSE](./LICENSE).
