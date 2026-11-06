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
  ].join('\n'),
  doc,
);
const listJson = (titles) => ({
  suites: [{ file: 'demo.spec.ts', specs: titles.map((title) => ({ title, file: 'demo.spec.ts', tests: [{ projectName: 'demo' }] })) }],
});
const tests = (titles) => collectTests(listJson(titles), { suite: 'UI', dir: 'suite' });
const clean = ['TC-DEMO-001: logs in', 'TC-DEMO-002: refuses a locked user', 'SC-API-DEMO-001: health check'];

const results = [];
const expect = (name, fn) => {
  try {
    fn();
    results.push(`PASS ${name}`);
  } catch (err) {
    results.push(`FAIL ${name}\n     ${err.message.split('\n')[0]}`);
  }
};
const problemsFor = (input) => check({ cases, ...input }).problems;
const reports = (problems, pattern) =>
  assert.ok(problems.some((p) => pattern.test(p)), `expected a problem matching ${pattern}, got: ${JSON.stringify(problems)}`);

expect('parses ID, title and priority', () => {
  assert.deepEqual(
    cases.map((c) => [c.id, c.title, c.priority]),
    [
      ['TC-DEMO-001', 'Log in with valid credentials', 'High'],
      ['TC-DEMO-002', 'Locked user is refused', 'Medium'],
      ['SC-API-DEMO-001', 'Health check', undefined],
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
  assert.deepEqual(problemsFor({ tests: tests(clean.slice(1)), manualOnly: { 'TC-DEMO-001': 'needs a human eye' } }), []));
expect('catches a manual-only entry without a reason', () =>
  reports(problemsFor({ tests: tests(clean.slice(1)), manualOnly: { 'TC-DEMO-001': ' ' } }), /without a reason/));
expect('catches a manual-only entry that is automated', () =>
  reports(problemsFor({ tests: tests(clean), manualOnly: { 'TC-DEMO-001': 'x' } }), /but it is automated/));
expect('catches a manual-only entry for an unknown case', () =>
  reports(problemsFor({ tests: tests(clean), manualOnly: { 'TC-DEMO-404': 'x' } }), /manual-only lists TC-DEMO-404, which no manual doc/));
expect('catches a duplicate case ID', () =>
  reports(check({ cases: [...cases, { ...cases[0], doc: 'cases/OTHER.md' }], tests: tests(clean) }).problems, /^duplicate case ID TC-DEMO-001/));

console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(failed ? `\n${failed} self-test(s) failed: the traceability gate is not trustworthy` : '\nPASS: the traceability gate fails when it should');
process.exit(failed ? 1 : 0);
