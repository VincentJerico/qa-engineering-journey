// LLM evaluation runner.
// Runs every case in the dataset through the (mock or real) model, applies its assertions, and prints
// a pass/fail report. Exits non-zero if any case fails — so it can gate a CI pipeline.
//
//   node eval/run-evals.mjs

import { getCompletion } from './model.mjs';
import { dataset } from './dataset.mjs';

const results = [];
let passCount = 0;

for (const testCase of dataset) {
  const output = await getCompletion(testCase.prompt, testCase.task);
  const checks = testCase.assertions.map((fn) => fn(output));
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
console.log('─'.repeat(48));

// Non-zero exit on any failure → usable as a CI gate.
if (passCount < total) process.exit(1);
