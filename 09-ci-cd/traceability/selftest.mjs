#!/usr/bin/env node
// Self-test for the traceability gate: a gate that can't fail isn't a gate. A clean fixture must
// pass, and each planted defect must be reported. Exits 1 if the gate misses anything.
import assert from 'node:assert/strict';
import { check, collectTests, githubAnchor, parseCases } from './lib.mjs';

const doc = 'cases/TC-DEMO.md';
const cases = parseCases(
  [
    '### TC-DEMO-001 — Log in with valid credentials',
    '**Priority:** High · **Technique:** Positive',
    '### TC-DEMO-002 — Locked user is refused',
    '**Priority:** Medium',
    '### SC-API-DEMO-001 — Health check',
    '**Priority:** Low',
    '### TC-DEMO-003 — No priority line',
  ].join('\n'),
  doc,
);
// A title may carry tags after it: 'TC-DEMO-001: logs in @high'. Like Playwright's JSON reporter,
// the fixture lists them without the @ ("high"), so the self-test covers that format too.
const spec = (entry, file = 'demo.spec.ts') => {
  const [title, ...tags] = entry.split(' @');
  return { title, file, tags, tests: [{ projectName: 'demo' }] };
};
const listJson = (entries, extra = []) => ({ suites: [{ file: 'demo.spec.ts', specs: [...entries.map((e) => spec(e)), ...extra] }] });
const tests = (entries, extra) => collectTests(listJson(entries, extra), { suite: 'UI', dir: 'suite' });
const clean = ['TC-DEMO-001: logs in @high', 'TC-DEMO-002: refuses a locked user @medium', 'SC-API-DEMO-001: health check @low'];
const manualOnly = { 'TC-DEMO-003': 'fixture case without a priority, never automated' };

const results = [];
const expect = (name, fn) => {
  try {
    fn();
    results.push(`PASS ${name}`);
  } catch (err) {
    results.push(`FAIL ${name}\n     ${err.message.split('\n')[0]}`);
  }
};
const problemsFor = (input) => check({ cases, manualOnly, ...input }).problems;
const reports = (problems, pattern) =>
  assert.ok(problems.some((p) => pattern.test(p)), `expected a problem matching ${pattern}, got: ${JSON.stringify(problems)}`);

expect('parses ID, title and priority', () => {
  assert.deepEqual(
    cases.map((c) => [c.id, c.title, c.priority]),
    [
      ['TC-DEMO-001', 'Log in with valid credentials', 'High'],
      ['TC-DEMO-002', 'Locked user is refused', 'Medium'],
      ['SC-API-DEMO-001', 'Health check', 'Low'],
      ['TC-DEMO-003', 'No priority line', undefined],
    ],
  );
});
expect('builds GitHub heading anchors', () => {
  assert.equal(githubAnchor('SC-API-012 — Get /booking/:id'), 'sc-api-012--get-bookingid');
});
expect('clean fixture passes', () => assert.deepEqual(problemsFor({ tests: tests(clean) }), []));
expect('catches a test with no case ID', () =>
  reports(problemsFor({ tests: tests([...clean, 'logs out']) }), /^untraced test: "logs out"/));
expect('catches a test pointing at an unknown case', () =>
  reports(problemsFor({ tests: tests([...clean, 'TC-DEMO-999: ghost']) }), /^unknown case: .* TC-DEMO-999/));
expect('catches a case that lost its test', () =>
  reports(problemsFor({ tests: tests(clean.slice(1)) }), /^not automated: TC-DEMO-001/));
expect('accepts a listed manual-only case', () =>
  assert.deepEqual(problemsFor({ tests: tests(clean.slice(1)), manualOnly: { ...manualOnly, 'TC-DEMO-001': 'needs a human eye' } }), []));
expect('catches a manual-only entry without a reason', () =>
  reports(problemsFor({ tests: tests(clean.slice(1)), manualOnly: { 'TC-DEMO-001': ' ' } }), /without a reason/));
expect('catches a manual-only entry that is automated', () =>
  reports(problemsFor({ tests: tests(clean), manualOnly: { 'TC-DEMO-001': 'x' } }), /but it is automated/));
expect('catches a manual-only entry for an unknown case', () =>
  reports(problemsFor({ tests: tests(clean), manualOnly: { 'TC-DEMO-404': 'x' } }), /manual-only lists TC-DEMO-404, which no manual doc/));
expect('catches a duplicate case ID', () =>
  reports(check({ cases: [...cases, { ...cases[0], doc: 'cases/OTHER.md' }], tests: tests(clean), manualOnly }).problems, /^duplicate case ID TC-DEMO-001/));
expect('catches a test with no priority tag', () =>
  reports(problemsFor({ tests: tests(['TC-DEMO-001: logs in', ...clean.slice(1)]) }), /^priority tag mismatch: "TC-DEMO-001: logs in" .* has \[\], its case says @high/));
expect('catches a priority tag that disagrees with the case', () =>
  reports(problemsFor({ tests: tests(['TC-DEMO-001: logs in @low', ...clean.slice(1)]) }), /^priority tag mismatch: .* has \[@low\], its case says @high/));
expect('catches two priority tags on one test', () =>
  reports(problemsFor({ tests: tests(['TC-DEMO-001: logs in @high @low', ...clean.slice(1)]) }), /has \[@high, @low\]/));
expect('ignores non-priority tags', () =>
  assert.deepEqual(problemsFor({ tests: tests(['TC-DEMO-001: logs in @high @bug', ...clean.slice(1)]) }), []));
expect('catches a tested case with no priority line', () =>
  reports(check({ cases, tests: tests([...clean, 'TC-DEMO-003: no priority @low']) }).problems, /^no priority: TC-DEMO-003/));
expect('skips setup steps', () =>
  assert.deepEqual(problemsFor({ tests: tests(clean, [spec('log in once', 'auth.setup.ts')]) }), []));

console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(failed ? `\n${failed} self-test(s) failed: the traceability gate is not trustworthy` : '\nPASS: the traceability gate fails when it should');
process.exit(failed ? 1 : 0);
