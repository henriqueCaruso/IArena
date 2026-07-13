#!/usr/bin/env node
// IArena — zero-dependency comparison arena for AI-generated artifacts.
// Node built-ins only (http, fs, path). No npm install needed: `node server.mjs`.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || process.argv.find(a => a.startsWith('--port='))?.split('=')[1] || 4600);
const ENTRIES_DIR = path.resolve(process.env.ENTRIES_DIR || process.argv.find(a => a.startsWith('--dir='))?.split('=')[1] || './entries');
const COMMENTS_FILE = path.join(ENTRIES_DIR, '_comments.json');
const GALLERIES_FILE = path.join(ENTRIES_DIR, '_galleries.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

fs.mkdirSync(ENTRIES_DIR, { recursive: true });

// ---------- tiny JSON store helpers (file-based, no DB) ----------
function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}
function readComments() { return readJson(COMMENTS_FILE, {}); }
function writeComments(obj) { writeJson(COMMENTS_FILE, obj); }
function readGalleries() { return readJson(GALLERIES_FILE, {}); }

function newId() { return crypto.randomBytes(4).toString('hex'); }

function contentTypeFor(file) {
  const ext = path.extname(file).toLowerCase();
  return { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml', '.md': 'text/markdown; charset=utf-8' }[ext] || 'application/octet-stream';
}

function sendJson(res, obj, status = 200) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}
function sendBytes(res, buf, contentType, status = 200) {
  res.writeHead(status, { 'Content-Type': contentType, 'Content-Length': buf.length });
  res.end(buf);
}
function readBody(req) {
  return new Promise((resolve) => {
    let chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch { resolve({}); } });
  });
}
function htmlEscape(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ---------- gallery render (wraps a static entry in nav/comment/vote chrome) ----------
function renderGallery(group, index) {
  const galleries = readGalleries();
  const g = galleries[group];
  if (!g) return null;
  const items = g.items || [];
  const total = items.length;
  if (index < 1 || index > total) return null;
  const item = items[index - 1];
  const prevBtn = index > 1
    ? `<a class="btn" data-nav="prev" href="/gallery/${encodeURIComponent(group)}/${index - 1}">&larr; prev</a>`
    : `<span class="btn back" style="opacity:.35;pointer-events:none">&larr; prev</span>`;
  const nextBtn = index < total
    ? `<a class="btn" data-nav="next" href="/gallery/${encodeURIComponent(group)}/${index + 1}">next &rarr;</a>`
    : `<span class="btn back" style="opacity:.35;pointer-events:none">next &rarr;</span>`;
  const itemsForClient = (g.entry_index ? [{ file: g.entry_index, title: 'Overview / vote', variant: '' }] : []).concat(
    items.map((it) => ({ file: it.file, title: it.title, variant: it.variant || '' }))
  );
  const shell = fs.readFileSync(path.join(PUBLIC_DIR, 'gallery-shell.html'), 'utf8');
  return shell
    .replaceAll('{{GROUP_TITLE}}', htmlEscape(g.title))
    .replaceAll('{{ITEM_TITLE}}', htmlEscape(item.title))
    .replaceAll('{{VARIANT}}', htmlEscape(item.variant || ''))
    .replaceAll('{{INDEX}}', String(index))
    .replaceAll('{{TOTAL}}', String(total))
    .replaceAll('{{PREV_BTN}}', prevBtn)
    .replaceAll('{{NEXT_BTN}}', nextBtn)
    .replaceAll('{{FILE}}', htmlEscape(item.file))
    .replace('{{ITEMS_JSON}}', JSON.stringify(itemsForClient).replaceAll('</script', '<\\/script'));
}

// ---------- HTTP server ----------
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const parts = url.pathname.split('/').filter(Boolean);

    if (url.pathname === '/health') return sendJson(res, { ok: true, service: 'IArena' });

    if (url.pathname === '/' || url.pathname === '/index.html') {
      const galleries = readGalleries();
      const files = fs.readdirSync(ENTRIES_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
      let rows = '';
      for (const [slug, g] of Object.entries(galleries)) {
        rows += `<li><a href="/gallery/${encodeURIComponent(slug)}/1">${htmlEscape(g.title)}</a> — ${g.items.length} entries</li>`;
      }
      for (const f of files) rows += `<li><a href="/${encodeURIComponent(f)}">${htmlEscape(f)}</a></li>`;
      const body = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8').replace('{{ROWS}}', rows || '<li>No entries yet — see README to seed the example.</li>');
      return sendBytes(res, Buffer.from(body, 'utf8'), 'text/html; charset=utf-8');
    }

    // gallery route: /gallery/<group>/<index>
    const galleryMatch = url.pathname.match(/^\/gallery\/([^/]+)\/(\d+)$/);
    if (galleryMatch) {
      const body = renderGallery(decodeURIComponent(galleryMatch[1]), Number(galleryMatch[2]));
      if (!body) { res.writeHead(404); return res.end('gallery/index not found'); }
      return sendBytes(res, Buffer.from(body, 'utf8'), 'text/html; charset=utf-8');
    }

    // text-mode entry: /<slug>.md -> wraps in entry-shell (markdown render + comments + vote)
    const mdMatch = url.pathname.match(/^\/([^/]+\.md)$/);
    if (mdMatch) {
      const file = path.join(ENTRIES_DIR, decodeURIComponent(mdMatch[1]));
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, 'utf8');
        const titleMatch = raw.match(/^#\s+(.+)$/m);
        const shell = fs.readFileSync(path.join(PUBLIC_DIR, 'entry-shell.html'), 'utf8');
        const b64 = Buffer.from(raw, 'utf8').toString('base64');
        const body = shell
          .replaceAll('{{TITLE}}', htmlEscape(titleMatch ? titleMatch[1] : mdMatch[1]))
          .replaceAll('{{DOC_ID}}', htmlEscape(mdMatch[1]))
          .replace('{{MD_B64}}', b64);
        return sendBytes(res, Buffer.from(body, 'utf8'), 'text/html; charset=utf-8');
      }
    }

    // comments API: /api/comments/<doc> [GET list | POST add] and /api/comments/<doc>/<idx> [DELETE]
    if (parts[0] === 'api' && parts[1] === 'comments') {
      const doc = decodeURIComponent(parts[2] || '');
      const store = readComments();
      const list = store[doc] || [];
      if (req.method === 'GET' && parts.length === 3) return sendJson(res, list);
      if (req.method === 'POST' && parts.length === 3) {
        const body = await readBody(req);
        const entry = {
          id: newId(), ts: new Date().toISOString().replace('T', ' ').slice(0, 16),
          text: String(body.text || ''), section: String(body.section || ''), quote: String(body.quote || ''),
          resolved: false,
        };
        list.push(entry); store[doc] = list; writeComments(store);
        return sendJson(res, { ok: true, idx: list.length - 1 });
      }
      if (req.method === 'DELETE' && parts.length === 4) {
        const idx = Number(parts[3]);
        if (idx >= 0 && idx < list.length) { list.splice(idx, 1); store[doc] = list; writeComments(store); }
        return sendJson(res, { ok: true });
      }
      return sendJson(res, { error: 'unknown comments route' }, 404);
    }

    // static: serve any file directly from ENTRIES_DIR (mockups, images, raw html)
    const rel = decodeURIComponent(url.pathname.replace(/^\//, ''));
    if (rel.includes('..')) { res.writeHead(403); return res.end('forbidden'); }
    const file = path.join(ENTRIES_DIR, rel);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      return sendBytes(res, fs.readFileSync(file), contentTypeFor(file));
    }
    // static: public/ assets (gallery-shell.js if split out later, favicon, etc.)
    const pubFile = path.join(PUBLIC_DIR, rel);
    if (fs.existsSync(pubFile) && fs.statSync(pubFile).isFile()) {
      return sendBytes(res, fs.readFileSync(pubFile), contentTypeFor(pubFile));
    }

    res.writeHead(404); res.end('not found');
  } catch (err) {
    res.writeHead(500); res.end('server error: ' + (err?.message || err));
  }
});

server.listen(PORT, () => {
  console.log(`IArena running: http://localhost:${PORT}/`);
  console.log(`entries dir: ${ENTRIES_DIR}`);
});
