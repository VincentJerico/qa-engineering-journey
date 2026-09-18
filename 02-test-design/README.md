# Test Design Techniques

Worked examples of the core black-box test-design techniques. Each is grounded in a feature from the
apps tested elsewhere in this repo (SauceDemo, The Internet), so the theory connects to real cases.

| Technique | Folder | Use it when… |
|-----------|--------|--------------|
| Equivalence Partitioning | [equivalence-partitioning/](equivalence-partitioning/) | a field accepts a range/category of values |
| Boundary Value Analysis | [boundary-value-analysis/](boundary-value-analysis/) | edges/limits matter (min/max, first/last) |
| Decision Tables | [decision-tables/](decision-tables/) | output depends on several conditions |
| State Transition | [state-transition/](state-transition/) | behavior depends on current state + events |

Quick reference: [notes/testing/test-design-techniques.md](../notes/testing/test-design-techniques.md).

## Why these matter
They turn "test everything" (impossible) into a **small, justified** set of cases with good coverage.
Each example below shows the analysis *and* the resulting concrete test cases.
