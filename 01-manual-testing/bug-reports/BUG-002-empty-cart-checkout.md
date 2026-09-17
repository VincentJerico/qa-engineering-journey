# BUG-002 — Empty cart can be checked out to a completed $0 order

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-002 |
| **Title** | Checkout can be completed with an empty cart, producing a $0 order confirmation |
| **Application** | SauceDemo — https://www.saucedemo.com |
| **Found in** | Cart → Checkout flow |
| **Related case** | [TC-CART-009](../test-cases/TC-CART-saucedemo.md) |
| **Related report** | [TER-002](../test-cases/RESULTS-2026-09-17-cart-checkout.md) |
| **Reported by** | Vincent Jerico |
| **Date** | 2026-09-17 |
| **Severity** | Medium |
| **Priority** | Medium |
| **Status** | Open |
| **Environment** | Chrome, desktop viewport, `standard_user` |

## Description
The checkout flow can be started and completed with **no items in the cart**. The user reaches the
information form, then the overview (showing Item total: $0, Tax: $0.00, Total: $0.00), and finally
the "Thank you for your order!" confirmation — placing an empty, zero-value order.

## Steps to Reproduce
1. Log in as `standard_user`.
2. Ensure the cart is empty (remove any items).
3. Open the cart (`/cart.html`) and click **Checkout**.
4. Enter any valid First Name, Last Name, and Postal Code; click **Continue**.
5. On the overview page, click **Finish**.

## Expected Result
The user should not be able to check out with an empty cart. The **Checkout** button should be
disabled (or show a message) when the cart is empty, blocking the flow.

## Actual Result
The flow proceeds through every step and reaches `/checkout-complete.html` with
"Thank you for your order!", confirming a $0 order:
- Overview: `Item total: $0`, `Tax: $0.00`, `Total: $0.00`
- Completion: "Thank you for your order!"

## Impact
Allows placing empty/zero-value orders, which is invalid for an e-commerce checkout and could create
junk orders or downstream processing errors in a real system. Not data-destructive, hence Medium.

## Suggested Fix
Disable **Checkout** when the cart is empty, or validate item count > 0 before allowing progression
past the cart page.

## Notes
Discovered while executing TC-CART-009 (a behavior-documentation case). Confirmed end-to-end on the
live demo.
