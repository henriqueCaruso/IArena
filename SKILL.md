---
name: IArena
description: "Run a competition between multiple AI agents/prompts/skills on the SAME task, then compare results side by side — comment on any element (not just text), vote, copy feedback back to your AI in one click. Use when: comparing design mockups, comparing plans/approaches, A/B-testing prompts or models, deciding between several drafts of anything an AI can produce."
---

# IArena

A small, dependency-free tool for running "AI vs AI" (or "prompt vs prompt", "skill vs skill") comparisons
and collecting structured feedback on the results. Works with **any** AI system — Claude, GPT, Gemini,
a local model, or a human copy-pasting into a chat UI — because the only contract is: *write files to
a folder, read a JSON file back*. No dependency on any particular agent framework.

## When to use this

- You can generate N independent attempts at the same problem (different models, different prompts,
  different skills/tools, different people) and want a human to compare and pick a winner.
- The artifacts are either **visual/interactive** (HTML mockups, dashboards, prototypes) or **textual**
  (plans, analyses, written approaches) — both are supported, see the two modes below.
- You want reviewer feedback to be *structured* (tied to a specific element or passage) instead of a
  vague paragraph, and you want to feed that structured feedback back into another round with an AI.

## Quickstart

```bash
node server.mjs            # starts on http://localhost:4600, entries/ dir auto-created
# or: PORT=8080 ENTRIES_DIR=./my-comp node server.mjs
```

Open `http://localhost:4600/` — it lists everything in `entries/`.

## The two modes

### Text mode (plans, written analyses, prompt comparisons)

Each competitor writes ONE markdown file into `entries/<slug>-N.md`, first line `# Title`. Write an
index file `entries/<slug>.md` linking to each competitor plus a vote block at the end:

````markdown
# Which approach wins?

1. [Approach A](/my-comp-a.md) — one-line summary of what it does differently
2. [Approach B](/my-comp-b.md) — ...

```vote
Which approach should we go with?
- Approach A
- Approach B
```
````

Open `/<slug>.md` in the browser — it renders with `marked.js`, gets a comment sidebar, and the
```vote``` block becomes clickable buttons whose answer is saved as a comment (answer can be changed
later via "change answer", it never duplicates).

### Gallery mode (visual/interactive HTML — mockups, dashboards, prototypes)

1. Each competitor writes ONE self-contained HTML file: `entries/<slug>-variant-N.html`. It must be
   fully standalone (inline CSS/JS, no build step) so it can be opened directly OR wrapped in an iframe.
   **Token efficiency tip**: tell each competitor to copy `templates/starter.html` as a base instead
   of inventing a whole CSS system from scratch — it ships a small design-token skeleton (header,
   stat tiles, cards, table, badges, buttons) marked with `<!-- FILL: ... -->` comments. The model
   spends tokens on content and its own visual direction, not on re-deriving boilerplate every time.
   Restyling the CSS variables at the top is still 100% fair game — the point is to skip re-typing
   the skeleton, not to constrain the design.
2. Register the group in `entries/_galleries.json`:

```json
{
  "<slug>": {
    "title": "Human-readable title of the competition",
    "entry_index": "<slug>.md",
    "items": [
      { "file": "<slug>-variant-1.html", "title": "Variant 1", "variant": "gpt-4 / prompt A" },
      { "file": "<slug>-variant-2.html", "title": "Variant 2", "variant": "claude / prompt B" }
    ]
  }
}
```

3. Open `http://localhost:4600/gallery/<slug>/1` — this wraps variant 1 in a chrome with:
   - **Comment by text selection** (drag-select inside the entry, click "Comment").
   - **Comment by element** ("🎯 Element" toggle — click ANYTHING, even an icon or empty area, no
     selectable text required).
   - **prev/next** navigation between variants (`←`/`→` keys too).
   - **Copy ALL** — one click aggregates open comments across every variant in the group into one
     paste-ready block.
   - Opening the raw file directly (`/<slug>-variant-1.html`, no `/gallery/` prefix) still works and
     shows the file's own favicon/title untouched — useful to sanity-check a mockup's favicon in a
     real browser tab.

## Running the "fan-out" — model/framework agnostic

This tool does **not** orchestrate your agents — it only provides the comparison surface. However you
run N competitors (a workflow engine, N separate terminal sessions, N chat tabs, a for-loop calling an
API), the contract each one needs is:

1. Receive the **same** shared brief (be concrete: real file paths, real constraints, real data — never
   let one competitor infer more than another).
2. Know which "variable" it's testing (which model/prompt/skill) and mention it in its own summary.
3. Write its output to the exact file path you tell it (`entries/<slug>-variant-N.html` or `.md`).
4. NOT touch anything outside that one file. NOT run builds/installs/deploys. Competitors produce
   isolated artifacts, never real side effects.

A minimal orchestration loop (pseudocode, adapt to whatever agent API you have):

```
brief = read_file("brief.md")
for i, competitor in enumerate(competitors):
    prompt = brief + f"\n\nYou are competitor {i}, using {competitor.name}. Write your result to entries/comp-variant-{i}.html"
    run_agent(competitor, prompt)   # however your stack invokes an agent — sequential is fine, parallel is faster
write_json("entries/_galleries.json", {...})
```

## Feeding feedback back to an AI

- **Text mode**: open the `/<slug>.md` page, click "📋 Copy" (per page) — pastes as a ready-made
  markdown list of `"quoted passage" → comment`.
- **Gallery mode**: click "📋 Copy ALL" on any variant page — aggregates every open comment across
  every variant + the index page's vote, grouped by page, ready to paste into your next agent prompt.
- Or read `entries/_comments.json` directly (flat JSON, keyed by filename) — no HTTP needed if your
  agent has filesystem access.

## Comments API (if you want to build your own UI on top)

- `GET /api/comments/<file>` → `[{id, ts, text, section, quote, resolved}, ...]`
- `POST /api/comments/<file>` body `{text, section?, quote?}` → `{ok, idx}`
- `DELETE /api/comments/<file>/<idx>` → `{ok}` (this is also how "resolve" works — same intent)

## Reviewer-AI technique (optional)

After competitors finish, have the same or a different AI add its OWN comments via the same API —
label the `section` field `[AI review]` so it's visually distinct from human feedback in the sidebar.
Good for surfacing technical issues (a11y, layout bugs, inconsistencies) a human reviewer might miss.

## What this deliberately does NOT do

- No build step, no framework, no database — one Node process, JSON files on disk. Delete the `entries/`
  folder to reset everything.
- No auth — this is meant for local/trusted use (a team reviewing internally), not a public multi-tenant
  service. Put it behind a reverse proxy with auth if you expose it beyond localhost.
- No opinion on what "good design" looks like — that's for your competitors' prompts/skills to decide.
