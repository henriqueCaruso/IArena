import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function runConfig(temp, config) {
  const configFile = path.join(temp, 'config.json');
  fs.writeFileSync(configFile, JSON.stringify(config), 'utf8');
  return spawnSync(process.execPath, ['scripts/nova-competicao.mjs', `--config=${path.relative(project, configFile)}`], { cwd: project, encoding: 'utf8' });
}

test('gera prompts isolados, galeria e manifesto sem dependências', () => {
  const tempRoot = path.join(project, '.tmp-tests');
  fs.mkdirSync(tempRoot, { recursive: true });
  const temp = fs.mkdtempSync(path.join(tempRoot, 'iarena-'));
  const config = {
    slug: 'Teste Ágil', title: 'Teste Ágil', round: 1,
    output_dir: path.relative(project, path.join(temp, 'entries')),
    run_dir: path.relative(project, path.join(temp, 'runs')),
    brief: 'templates/brief-design.pt-BR.md',
    starter: 'templates/starter.html',
    criteria: 'templates/criterios-design.pt-BR.md',
    competitors: [
      { id: 'baseline', label: 'Baseline' },
      { id: 'ui-brs', label: 'UI BRS', skills: ['skills/ui-brs/SKILL.md'] },
    ],
  };
  const result = runConfig(temp, config);
  assert.equal(result.status, 0, result.stderr);
  const galleries = JSON.parse(fs.readFileSync(path.join(temp, 'entries', '_galleries.json'), 'utf8'));
  assert.equal(galleries['teste-agil-r1'].items.length, 2);
  assert.match(fs.readFileSync(path.join(temp, 'runs', 'prompts', '02-ui-brs.md'), 'utf8'), /Não instale pacotes/);
  assert.match(fs.readFileSync(path.join(temp, 'entries', 'teste-agil.md'), 'utf8'), /```vote/);
  const manifest = JSON.parse(fs.readFileSync(path.join(temp, 'runs', 'manifest.json'), 'utf8'));
  assert.equal(manifest.gallery_url, '/gallery/teste-agil-r1/1');
  assert.equal(manifest.theme, null);
  fs.rmSync(temp, { recursive: true, force: true });
});

test('tema BRS é compartilhado e não vira diferencial exclusivo', () => {
  const tempRoot = path.join(project, '.tmp-tests');
  fs.mkdirSync(tempRoot, { recursive: true });
  const temp = fs.mkdtempSync(path.join(tempRoot, 'iarena-brs-'));
  const config = {
    slug: 'Teste BRS', title: 'Teste BRS', round: 1, theme: 'brs',
    output_dir: path.relative(project, path.join(temp, 'entries')),
    run_dir: path.relative(project, path.join(temp, 'runs')),
    brief: 'templates/brief-design.pt-BR.md',
    criteria: 'templates/criterios-design.pt-BR.md',
    execution: { profile: 'multiagente', concurrency: 2, reviewers: 1 },
    competitors: [
      { id: 'baseline', label: 'Baseline BRS' },
      { id: 'ui-brs', label: 'UI BRS', skills: ['skills/ui-brs/SKILL.md'] },
    ],
  };
  const result = runConfig(temp, config);
  assert.equal(result.status, 0, result.stderr);
  const prompt = fs.readFileSync(path.join(temp, 'runs', 'prompts', '01-baseline.md'), 'utf8');
  assert.match(prompt, /Tema compartilhado: \*\*BRS Control Room\*\*/);
  assert.match(prompt, /themes\/brs\/tokens\.css/);
  assert.match(prompt, /restrição comum/);
  const manifest = JSON.parse(fs.readFileSync(path.join(temp, 'runs', 'manifest.json'), 'utf8'));
  assert.equal(manifest.theme.id, 'brs');
  assert.equal(manifest.starter, 'themes/brs/starter.html');
  assert.deepEqual(manifest.execution, { profile: 'multiagente', concurrency: 2, reviewers: 1 });
  assert.ok(manifest.criteria.includes('themes/brs/criterios.md'));
  fs.rmSync(temp, { recursive: true, force: true });
});
