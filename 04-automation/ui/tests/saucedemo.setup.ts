import { test as setup, expect, STANDARD_USER_STATE } from '../fixtures/test.js';
import { USERS, PASSWORD } from '../pages/testData.js';

/** Logs in standard_user once per run and saves the session for specs that start logged in. */
setup('log in as standard_user', async ({ page, loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(USERS.standard, PASSWORD);
  await inventoryPage.expectLoaded();
  await expect(inventoryPage.cartBadge).toHaveCount(0); // saved session starts with an empty cart
  await page.context().storageState({ path: STANDARD_USER_STATE });
});
