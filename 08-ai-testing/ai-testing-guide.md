# Testing AI / LLM-Based Systems — Guide

Testing AI features is different from testing deterministic software. This guide summarizes what
changes and the techniques used in this repo's eval harness.

## Why it's different
| Traditional software | LLM-based features |
|----------------------|--------------------|
| Same input → same output | Same input → **varying** output (non-deterministic) |
| One correct answer | A *range* of acceptable answers |
| Exact assertions work | Need tolerant assertions (schema, keywords, rubrics) |
| Pass/fail is binary | Often a **score/threshold** over a dataset |

## Core techniques
1. **Deterministic assertions where possible.** For classification/extraction, force structured
   (JSON) output and assert the schema and key fields — not the exact prose.
2. **Keyword / semantic checks.** For open-ended answers, assert required facts are present
   (e.g. contains "Manila") rather than matching a whole sentence.
3. **Schema / structured-output validation.** Verify the model returns valid JSON matching the
   expected shape — the most common integration failure.
4. **Safety / refusal tests.** Confirm harmful requests are refused and no disallowed content leaks.
5. **Consistency / robustness.** Run the same prompt N times (or paraphrases) and require the answer
   to stay within an acceptable set — catches flakiness.
6. **Golden dataset + threshold.** Keep a curated set of cases; require e.g. ≥ 95% to pass. Track the
   score over time to catch regressions after prompt/model changes.
7. **LLM-as-judge (rubric).** For subjective quality, have a model score outputs against a rubric —
   useful, but validate the judge itself (it's also non-deterministic).

## Assertion types in this harness
| Helper | Use for |
|--------|---------|
| `isValidJSON` | structured-output integration safety |
| `matchesSchema` | required keys + types present |
| `fieldEquals` | classification / exact field value |
| `contains` | required fact/keyword in free text |
| `isRefusal` | safety tests |
| `excludes` | no forbidden/leaked content |

## Metrics to track
- **Accuracy / pass-rate** over the golden set.
- **Schema-valid rate** (how often output parses correctly).
- **Refusal rate** on the safety subset (should be ~100%).
- **Consistency** (variance across repeated runs).
- **Latency & cost** per call (operational quality).

## Pitfalls
- Don't assert exact strings for generative output — it will be flaky.
- Non-determinism cuts both ways: a single green run isn't proof; run the set and use a threshold.
- Validate the judge if you use LLM-as-judge.
- Keep a **regression set** of past failures so fixed issues stay fixed.

## This repo's harness
`eval/` contains a runnable harness: a pluggable model (`model.mjs`, mock by default), a golden
dataset (`dataset.mjs`), tolerant assertions (`assertions.mjs`), and a runner (`run-evals.mjs`) that
exits non-zero on failure so it can gate CI. Swap in a real provider with `MODEL=real` + an API key.
