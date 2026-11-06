#!/usr/bin/env node
// Turns a Playwright JSON report into a Markdown table for the GitHub Actions job summary.
//   node 09-ci-cd/summary/playwright-summary.mjs <results.json> "<heading>" >> "$GITHUB_STEP_SUMMARY"
// A missing report (the suite crashed before writing one) is reported, not ignored.
import { existsSync, readFileSync } from 'node:fs';

const [file, heading = 'Playwright'] = process.argv.slice(2);
if (!file || !existsSync(file)) {
  console.log(`### ${heading}\n\nNo report at \`${file}\`: the suite did not finish. Check the job log.\n`);
  process.exit(0);
}

const report = JSON.parse(readFileSync(file, 'utf8'));
const { expected = 0, unexpected = 0, flaky = 0, skipped = 0, duration = 0 } = report.stats ?? {};

// Failed and flaky tests by title, from the nested suites.
const failed = [];
const flakyTests = [];
const walk = (suite) => {
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      const name = `${spec.title} (${t.projectName || 'default'})`;
      if (t.status === 'unexpected') failed.push(name);
      else if (t.status === 'flaky') flakyTests.push(name);
    }
  }
  for (const child of suite.suites ?? []) walk(child);
};
for (const s of report.suites ?? []) walk(s);

const status = unexpected > 0 || flaky > 0 ? 'FAIL' : 'PASS';
const out = [
  `### ${heading}: ${status}`,
  '',
  '| Passed | Failed | Flaky | Skipped | Duration |',
  '| --: | --: | --: | --: | --: |',
  `| ${expected} | ${unexpected} | ${flaky} | ${skipped} | ${(duration / 1000).toFixed(1)} s |`,
  '',
];
if (failed.length) out.push('**Failed**', '', ...failed.map((t) => `- ${t}`), '');
if (flakyTests.length) {
  out.push('**Flaky** (passed only on retry, which fails the run)', '', ...flakyTests.map((t) => `- ${t}`), '');
}
console.log(out.join('\n'));
