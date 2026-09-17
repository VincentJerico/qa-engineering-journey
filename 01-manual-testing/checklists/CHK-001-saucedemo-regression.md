# Regression Checklist — SauceDemo Core Flows

| Field | Value |
|-------|-------|
| **Checklist ID** | CHK-001 |
| **Related plan** | [TP-001](../test-plans/TP-001-saucedemo.md) |
| **Purpose** | Fast smoke/regression pass over the critical SauceDemo journeys |
| **Est. time** | ~10 minutes |
| **Author** | Vincent Jerico |

Use this for a quick confidence check (e.g. after a change or before a demo). For full coverage, run
the detailed cases in `../test-cases/`. Copy this file per run and tick the boxes.

**Run info:** Date: `__________` · Tester: `__________` · Result: ☐ Pass ☐ Fail

## Login
- [ ] `standard_user` / `secret_sauce` logs in and lands on the inventory page
- [ ] `locked_out_user` is blocked with the locked-out error
- [ ] Invalid credentials show the generic mismatch error
- [ ] Empty username / empty password show the required-field errors
- [ ] Logout returns to login; Back button does not restore the session

## Catalog
- [ ] All 6 products display with image, name, description, price, and Add-to-cart
- [ ] Sort works for all four options (Name A–Z / Z–A, Price low→high / high→low)
- [ ] Add to cart updates the button to "Remove" and increments the badge
- [ ] Remove reverts the button and decrements the badge
- [ ] Product detail page opens and "Back to products" returns to the list

## Cart
- [ ] Cart icon opens `/cart.html` with the correct items and QTY
- [ ] Multiple items show the correct badge count
- [ ] Remove works from the cart page; removing all clears the badge
- [ ] Continue Shopping returns to inventory with the cart retained
- [ ] Checkout button proceeds to the information page
- [ ] ⚠️ Regression watch — [BUG-002](../bug-reports/BUG-002-empty-cart-checkout.md): empty cart should NOT complete an order

## Checkout
- [ ] Happy path completes: info → overview → Finish → "Thank you for your order!"
- [ ] Required-field errors fire for missing first name / last name / postal code
- [ ] Overview shows correct line items and item total
- [ ] Tax (8%) and total are correct (Total = Item total + Tax)
- [ ] Cancel returns correctly (info → cart, overview → inventory)
- [ ] Completion clears the cart badge; Back Home returns to inventory

## Known defects to re-verify
- [ ] [BUG-001](../bug-reports/BUG-001-problem-user-identical-images.md) — `problem_user` identical product images
- [ ] [BUG-002](../bug-reports/BUG-002-empty-cart-checkout.md) — empty-cart checkout completes a $0 order
