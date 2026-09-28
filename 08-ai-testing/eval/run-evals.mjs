// LLM evaluation runner.
// Checks that every assertion helper rejects its negative control, then runs every case in the dataset
// through the (mock or real) model, applies its assertions, and prints a pass/fail report. Exits
// non-zero if any control or case fails, or if there is nothing to evaluate — so it can gate a CI pipeline.
//
//   node eval/run-evals.mjs

import { getCompletion } from './model.mjs';
import { dataset } from './dataset.mjs';
import { controls } from './controls.mjs';
import * as assertions from './assertions.mjs';

let controlsHeld = 0;
const uncontrolled = Object.keys(assertions).filter((name) => !controls.some((c) => c.helper === name));
for (const name of uncontrolled) console.log(`✗ control: ${name} has no negative control`);
const controlTotal = controls.length + uncontrolled.length;

for (const { helper, run } of controls) {
  const held = !run().pass;
  if (held) controlsHeld++;
  console.log(`${held ? '✓' : '✗'} control: ${helper} rejects a known-bad output`);
}
console.log();

const results = [];
let passCount = 0;

for (const testCase of dataset) {
  const output = await getCompletion(testCase.prompt, testCase.task);
  const checks = testCase.assertions.map((fn) => fn(output));
  if (checks.length === 0) checks.push({ pass: false, detail: 'case has no assertions' });
  const passed = checks.every((c) => c.pass);
  if (passed) passCount++;
  results.push({ testCase, output, checks, passed });

  const icon = passed ? '✓' : '✗';
  console.log(`${icon} ${testCase.id} [${testCase.category}]`);
  for (const c of checks) {
    if (!c.pass) console.log(`      ↳ FAILED: ${c.detail}`);
  }
}

const total = dataset.length;
console.log('\n' + '─'.repeat(48));
console.log(`  ${passCount}/${total} evals passed  (model: ${process.env.MODEL === 'real' ? 'real' : 'mock'})`);
console.log(`  ${controlsHeld}/${controlTotal} negative controls rejected`);
if (total === 0) console.log('  FAILED: dataset is empty');
console.log('─'.repeat(48));

// Non-zero exit on any failure → usable as a CI gate.
if (total === 0 || passCount < total || controlsHeld < controlTotal) process.exit(1);
