# BUG-001 — All product images are identical for `problem_user`

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-001 |
| **Title** | Product catalog shows the same image for every product when logged in as `problem_user` |
| **Application** | SauceDemo — https://www.saucedemo.com |
| **Found in** | Catalog / Inventory page (`/inventory.html`) |
| **Related case** | [TC-CAT-012](../test-cases/TC-CATALOG-saucedemo.md) |
| **Related report** | [TER-001](../test-cases/RESULTS-2026-09-17-login-catalog.md) |
| **Reported by** | Vincent Jerico |
| **Date** | 2026-09-17 |
| **Severity** | Medium |
| **Priority** | Medium |
| **Status** | Open |
| **Environment** | Chrome, desktop viewport |

## Description
When logged in as `problem_user`, every product on the inventory page displays the **same** image
instead of its own product photo. All six `<img>` elements resolve to a single placeholder/404
asset (`sl-404-*.jpg`). The correct, distinct images render for `standard_user`.

## Steps to Reproduce
1. Go to https://www.saucedemo.com.
2. Log in with username `problem_user` and password `secret_sauce`.
3. Observe the product images on the inventory page.

## Expected Result
Each product displays its own unique image, matching the behavior seen with `standard_user`
(6 distinct product images).

## Actual Result
All 6 products display the identical image (`https://www.saucedemo.com/assets/sl-404-*.jpg`).
Distinct image sources: **1** (should be 6).

## Evidence
- `problem_user`: `document.querySelectorAll('.inventory_item_img img')` → 6 images, **1** unique `src` (`sl-404`).
- `standard_user` (baseline): 6 images, **6** unique `src` values.

## Impact
Users cannot visually distinguish products, which undermines product recognition and could lead to
wrong selections. Product names/prices remain correct, so the defect is visual rather than
data-integrity related — hence Medium severity.

## Notes
`problem_user` is a SauceDemo account seeded with **intentional** defects for practice. This report
documents the finding as it would be raised against a real application; it is expected behavior for
this demo account and confirms the account is functioning as a training fixture.
