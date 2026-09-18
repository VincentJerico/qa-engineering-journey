# AI Testing

Evaluating AI / LLM-based features. Because model output is **non-deterministic**, testing shifts from
exact assertions to **schema/keyword/rubric checks scored over a golden dataset** with a pass
threshold. See [ai-testing-guide.md](ai-testing-guide.md) for the concepts.

## Contents
```
08-ai-testing/
├── ai-testing-guide.md              # how testing AI differs + techniques
├── eval/
│   ├── model.mjs                    # pluggable model (mock by default; wire a real API with MODEL=real)
│   ├── dataset.mjs                  # golden set: prompts + tolerant assertions
│   ├── assertions.mjs               # isValidJSON, matchesSchema, fieldEquals, contains, isRefusal, excludes
│   └── run-evals.mjs                # runner — prints report, exits non-zero on failure (CI gate)
└── RESULTS-2026-09-18-ai-evals.md   # execution report (TER-008)
```

## Run
```bash
cd 08-ai-testing
node eval/run-evals.mjs                 # uses the deterministic mock model — no API key needed

# against a real provider (after implementing realModel in model.mjs):
MODEL=real ANTHROPIC_API_KEY=... node eval/run-evals.mjs
```
No dependencies — plain Node ESM, so it runs anywhere and in CI.

## What it covers
6 evals across the categories that matter most for AI features:
classification, extraction/structured output, factual Q&A, **safety/refusal**, and schema validation.
Assertions are deliberately **tolerant** (schema + keyword + refusal detection) so they survive normal
LLM phrasing variation while still catching real regressions — wrong classification, malformed JSON,
or a model that complies with a harmful request all fail the run.

## Note on the mock model
The default model is a deterministic mock so the harness is runnable and CI-friendly without secrets.
The value is the **harness and assertions**; point it at a real model to evaluate actual quality.
