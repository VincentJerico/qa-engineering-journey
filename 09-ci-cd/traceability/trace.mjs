#!/usr/bin/env node
// Traceability gate. Reads the manual case docs and the test list Playwright reports for each suite,
// then either checks TRACEABILITY.md is current and the rules hold (default) or rewrites it (--update).
//
//   node 09-ci-cd/traceability/trace.mjs            # check: exit 1 on any problem or a stale matrix
//   node 09-ci-cd/traceability/trace.mjs --update   # regenerate TRACEABILITY.md
//
// Needs `npm ci` in each suite folder (for Playwright), but no browsers: --list doesn't launch one.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { check, collectTests, parseCases, render } from './lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CASE_DIRS = ['01-manual-testing/test-cases', '03-api-testing/test-scenarios'];
const SUITES = [
  { suite: 'UI', dir: '04-automation/ui' },
  { suite: 'API', dir: '04-automation/api' },
];
const MATRIX = join(root, 'TRACEABILITY.md');

const markdownFiles = (dir) =>
  readdirSync(join(root, dir), { recursive: true })
    .filter((f) => f.endsWith('.md') && !f.split('/').pop().startsWith('RESULTS-'))
    .sort()
    .map((f) => join(dir, f));

const cases = CASE_DIRS.flatMap(markdownFiles).flatMap((doc) =>
  parseCases(readFileSync(join(root, doc), 'utf8'), doc),
);

const tests = SUITES.flatMap(({ suite, dir }) => {
  const json = execFileSync('npx', ['playwright', 'test', '--list', '--reporter=json'], {
    cwd: join(root, dir),
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
  return collectTests(JSON.parse(json), { suite, dir });
});

const manualOnly = JSON.parse(readFileSync(join(root, '09-ci-cd/traceability/manual-only.json'), 'utf8'));
const { problems, rows } = check({ cases, tests, manualOnly });
const matrix = render(rows) + '\n';
const automated = rows.filter((r) => r.tests.length > 0).length;

if (problems.length > 0) {
  for (const p of problems) console.error(`FAIL ${p}`);
  process.exit(1);
}

if (process.argv.includes('--update')) {
  writeFileSync(MATRIX, matrix);
  console.log(`updated ${relative(root, MATRIX)}: ${rows.length} cases, ${automated} automated, ${tests.length} tests`);
} else if (readFileSync(MATRIX, 'utf8') !== matrix) {
  console.error(`FAIL ${relative(root, MATRIX)} is stale. Run: node 09-ci-cd/traceability/trace.mjs --update`);
  process.exit(1);
} else {
  console.log(`PASS traceability: ${rows.length} cases, ${automated} automated, ${tests.length} tests, matrix current`);
}
