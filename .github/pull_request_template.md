## What & why

<!-- What changed and the reason for it. -->

## Type of change

- [ ] New or changed test cases
- [ ] New or changed automation
- [ ] CI / tooling
- [ ] Docs only

## Checklist

- [ ] New cases have an ID heading (`### TC-XXX-001 — Title`) and a `**Priority:**` line
- [ ] New tests start with their case ID and carry its priority tag (`{ tag: '@high' }`)
- [ ] `node 09-ci-cd/traceability/trace.mjs` passes (ran `--update` if cases or tests changed)
- [ ] `npm run lint`, `npm run format:check`, `npm run typecheck` pass in each suite I touched
- [ ] The suites I touched pass locally (`npm test`)
- [ ] Every number in a doc comes from a real run, with its date
