#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fail(message) {
  console.error(`Erro: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const out = {};
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, ...rest] = arg.slice(2).split('=');
    out[key] = rest.length ? rest.join('=') : true;
  }
  return out;
}

function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) {
    if (fallback !== null && error.code === 'ENOENT') return fallback;
    fail(`não foi possível ler JSON em ${file}: ${error.message}`);
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function safeRelative(value, field) {
  const normalized = path.normalize(String(value || ''));
  if (!normalized || path.isAbsolute(normalized) || normalized.startsWith('..') || normalized.includes(`..${path.sep}`)) {
    fail(`${field} deve ser um caminho relativo seguro`);
  }
  return normalized;
}

function list(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map(String).filter(Boolean);
}

function unique(values) {
  return [...new Set(values)];
}

function skillRefs(competitor) {
  return list(competitor.skills || competitor.skill);
}

function skillName(ref) {
  const parts = String(ref).replace(/[\\/]+$/, '').split(/[\\/]/).filter(Boolean);
  const last = parts.at(-1) || String(ref);
  return last.toLowerCase() === 'skill.md' ? (parts.at(-2) || last) : last;
}

function loadTheme(config) {
  if (!config.theme && !config.preset) return null;
  const raw = String(config.theme || config.preset);
  const themePath = raw.endsWith('.json')
    ? safeRelative(raw, 'theme')
    : safeRelative(`themes/${slugify(raw)}/theme.json`, 'theme');
  const absolute = path.resolve(ROOT, themePath);
  if (!fs.existsSync(absolute)) fail(`tema não encontrado: ${themePath}`);
  const theme = readJson(absolute);
  if (!theme || typeof theme !== 'object') fail(`tema inválido: ${themePath}`);
  return { ...theme, id: theme.id || slugify(raw), manifest: themePath };
}

function assertFiles(paths, field) {
  for (const item of paths) {
    if (!fs.existsSync(path.resolve(ROOT, item))) fail(`${field} não encontrado: ${item}`);
  }
}

function numbered(values, emptyText) {
  return values.length ? values.map((value, i) => `${i + 1}. ${value}`).join('\n') : emptyText;
}

function promptFor({ competitor, index, outputFile, promptFile, briefPath, starterPath, criteriaPaths, theme, sharedSkills, sharedReferences }) {
  const ownSkills = skillRefs(competitor);
  const allSkills = unique([...sharedSkills, ...ownSkills]);
  const criteriaBlock = numbered(criteriaPaths.map(value => `\`${value}\``), 'Nenhum critério adicional.');
  const themeBlock = theme
    ? `Tema compartilhado: **${theme.name || theme.id}** (\`${theme.manifest}\`).\n` +
      `Referências do tema:\n${numbered(sharedReferences.map(value => `\`${value}\``), 'Nenhuma referência adicional.')}`
    : 'Sem tema compartilhado. A direção visual é definida pelo brief e pelas skills desta variante.';

  return `# Competidor ${index + 1} — ${competitor.label}\n\n` +
`Você participa de uma competição IArena. Resolva o mesmo problema dos demais competidores sem ler nenhuma saída concorrente.\n\n` +
`## Leia somente o necessário\n\n` +
`1. Brief compartilhado: \`${briefPath}\`\n` +
`2. Critérios de avaliação:\n${criteriaBlock}\n` +
`3. Template econômico: \`${starterPath}\`\n` +
`4. ${themeBlock}\n` +
`5. Skills compartilhadas da competição:\n${numbered(sharedSkills, 'Nenhuma.')}\n` +
`6. Skill(s) exclusivas desta variante:\n${numbered(ownSkills, 'Nenhuma. Esta é a variante de controle dentro das restrições compartilhadas.')}\n\n` +
`## Variável testada\n\n${competitor.objective || `Aplicar a abordagem ${competitor.label}.`}\n\n` +
`## Contrato obrigatório\n\n` +
`- Escreva somente: \`${outputFile}\`.\n` +
`- Gere um HTML autocontido, com CSS e JavaScript inline.\n` +
`- Não instale pacotes, não rode build, não faça deploy e não altere outros arquivos.\n` +
`- Não leia \`entries/\` nem \`runs/\` além dos arquivos explicitamente citados neste prompt.\n` +
`- Preserve requisitos, dados e estados descritos no brief. Não invente regras de negócio.\n` +
`- Quando existir tema compartilhado, trate-o como restrição comum; não o declare como diferencial exclusivo.\n` +
`- Use o template como esqueleto quando ele poupar boilerplate; a direção visual continua livre dentro das restrições.\n` +
`- No fim do HTML, inclua um comentário com skills, modelo, decisões e suposições.\n\n` +
`Exemplo de metadado:\n\n` +
`\`\`\`html\n<!-- iarena: {"competidor":"${competitor.id}","prompt":"${path.basename(promptFile)}","theme":${JSON.stringify(theme?.id || null)},"skills":${JSON.stringify(allSkills)},"suposicoes":[]} -->\n\`\`\`\n`;
}

function voteBlock(title, items) {
  return `\n## ${title}\n\n` + items.map((item, i) => `${i + 1}. [${item.title}](/gallery/${item.group}/${i + 1}) — ${item.variant}`).join('\n') +
    `\n\n\`\`\`vote\nQual variante vence esta rodada?\n${items.map(item => `- ${item.title}`).join('\n')}\n\`\`\`\n`;
}

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.config) {
  console.log('Uso: node scripts/nova-competicao.mjs --config=examples/config.design.pt-BR.json [--force]');
  process.exit(args.help ? 0 : 1);
}

const configPath = path.resolve(ROOT, safeRelative(args.config, 'config'));
const config = readJson(configPath);
if (!config || typeof config !== 'object') fail('configuração inválida');
if (!Array.isArray(config.competitors) || config.competitors.length < 2) fail('informe pelo menos 2 competidores');

const theme = loadTheme(config);
const slug = slugify(config.slug || config.title);
if (!slug) fail('slug/título inválido');
const round = Number(config.round || 1);
if (!Number.isInteger(round) || round < 1) fail('round deve ser inteiro maior ou igual a 1');
const group = slugify(config.group || `${slug}-r${round}`);
const outputDirRel = safeRelative(config.output_dir || 'entries', 'output_dir');
const outputDir = path.resolve(ROOT, outputDirRel);
const runDirRel = safeRelative(config.run_dir || `runs/${slug}-r${round}`, 'run_dir');
const runDir = path.resolve(ROOT, runDirRel);
const promptsDir = path.join(runDir, 'prompts');
const briefPath = safeRelative(config.brief || 'templates/brief-design.pt-BR.md', 'brief');
const starterPath = safeRelative(config.starter || theme?.starter || 'templates/starter.html', 'starter');
const criteriaPaths = unique([
  safeRelative(config.criteria || 'templates/criterios-design.pt-BR.md', 'criteria'),
  ...list(theme?.criteria_addendum).map(value => safeRelative(value, 'theme.criteria_addendum')),
  ...list(config.criteria_addendum).map(value => safeRelative(value, 'criteria_addendum')),
]);
const sharedSkills = unique([
  ...list(theme?.shared_skills),
  ...list(config.shared_skills),
]).map(value => safeRelative(value, 'shared_skills'));
const sharedReferences = unique([
  ...list(theme?.references),
  ...list(config.shared_references),
]).map(value => safeRelative(value, 'shared_references'));

assertFiles([briefPath, starterPath, ...criteriaPaths, ...sharedSkills, ...sharedReferences], 'arquivo obrigatório');

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(promptsDir, { recursive: true });

const seen = new Set();
const items = config.competitors.map((competitor, index) => {
  const id = slugify(competitor.id || competitor.label || `variante-${index + 1}`);
  if (!id || seen.has(id)) fail(`id de competidor inválido ou duplicado: ${id || '(vazio)'}`);
  seen.add(id);
  const outputFile = `${slug}-r${round}-v${index + 1}-${id}.html`;
  const promptFile = path.join(promptsDir, `${String(index + 1).padStart(2, '0')}-${id}.md`);
  const prompt = promptFor({
    competitor: { ...competitor, id }, index, outputFile: `${outputDirRel}/${outputFile}`,
    promptFile, briefPath, starterPath, criteriaPaths, theme, sharedSkills, sharedReferences,
  });
  if (fs.existsSync(promptFile) && !args.force) fail(`prompt já existe: ${path.relative(ROOT, promptFile)}; use --force para sobrescrever`);
  fs.writeFileSync(promptFile, prompt, 'utf8');
  return {
    file: outputFile,
    title: competitor.label || `Variante ${index + 1}`,
    variant: [competitor.model, theme?.name, skillRefs(competitor).map(ref => skillName(ref)).join(' + ')].filter(Boolean).join(' · ') || 'baseline',
    competitor_id: id,
    group,
  };
});

const galleriesFile = path.join(outputDir, '_galleries.json');
const galleries = readJson(galleriesFile, {});
galleries[group] = {
  title: `${config.title || slug} — rodada ${round}`,
  entry_index: config.entry_index || `${slug}.md`,
  items: items.map(({ file, title, variant }) => ({ file, title, variant })),
};
writeJson(galleriesFile, galleries);

const indexFile = path.join(outputDir, config.entry_index || `${slug}.md`);
const roundMarker = `<!-- iarena-round:${round}:${group} -->`;
let indexContent = fs.existsSync(indexFile)
  ? fs.readFileSync(indexFile, 'utf8')
  : `# ${config.title || slug}\n\nBrief: \`${briefPath}\`  \nCritérios: ${criteriaPaths.map(value => `\`${value}\``).join(' + ')}${theme ? `  \nTema: **${theme.name || theme.id}**` : ''}\n`;
if (!indexContent.includes(roundMarker)) {
  indexContent += `\n${roundMarker}${voteBlock(`Rodada ${round}`, items)}`;
  fs.writeFileSync(indexFile, indexContent, 'utf8');
}

const execution = {
  profile: config.execution?.profile || 'manual',
  concurrency: Number(config.execution?.concurrency || 1),
  reviewers: Number(config.execution?.reviewers || 0),
};
if (!Number.isInteger(execution.concurrency) || execution.concurrency < 1) fail('execution.concurrency deve ser inteiro maior ou igual a 1');
if (!Number.isInteger(execution.reviewers) || execution.reviewers < 0) fail('execution.reviewers deve ser inteiro maior ou igual a 0');

const manifest = {
  generated_at: new Date().toISOString(),
  slug,
  round,
  group,
  title: config.title || slug,
  brief: briefPath,
  starter: starterPath,
  criteria: criteriaPaths,
  theme: theme ? { id: theme.id, name: theme.name || theme.id, manifest: theme.manifest } : null,
  shared_skills: sharedSkills,
  shared_references: sharedReferences,
  execution,
  entry_index: path.relative(ROOT, indexFile).replaceAll(path.sep, '/'),
  gallery_url: `/gallery/${group}/1`,
  prompts: items.map((item, i) => ({
    competitor_id: item.competitor_id,
    prompt: path.relative(ROOT, path.join(promptsDir, `${String(i + 1).padStart(2, '0')}-${item.competitor_id}.md`)).replaceAll(path.sep, '/'),
    output: `${outputDirRel.replaceAll(path.sep, '/')}/${item.file}`,
  })),
};
writeJson(path.join(runDir, 'manifest.json'), manifest);

const promptsIndex = `# Prompts — ${manifest.title} — rodada ${round}\n\n` +
  `Perfil: **${execution.profile}** · concorrência sugerida: **${execution.concurrency}**${theme ? ` · tema: **${theme.name || theme.id}**` : ''}\n\n` +
  manifest.prompts.map((item, i) => `${i + 1}. [${item.competitor_id}](./prompts/${path.basename(item.prompt)}) → \`${item.output}\``).join('\n') +
  `\n\nDepois que os arquivos forem gerados, execute \`node server.mjs\` e abra \`http://localhost:4600${manifest.gallery_url}\`.\n`;
fs.writeFileSync(path.join(runDir, 'PROMPTS.md'), promptsIndex, 'utf8');

console.log(`Competição criada: ${manifest.title}`);
console.log(`Perfil: ${execution.profile} (concorrência ${execution.concurrency})`);
if (theme) console.log(`Tema: ${theme.name || theme.id}`);
console.log(`Prompts: ${path.relative(ROOT, promptsDir)}`);
console.log(`Manifesto: ${path.relative(ROOT, path.join(runDir, 'manifest.json'))}`);
console.log(`Galeria: http://localhost:4600${manifest.gallery_url}`);
