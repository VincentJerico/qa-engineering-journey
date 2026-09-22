/** Shared test data for the SauceDemo suite (see TP-001). */

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
} as const;

export const PASSWORD = 'secret_sauce';

/** Known product data captured during manual execution (TER-001). */
export const PRODUCTS = {
  backpack: { id: 'sauce-labs-backpack', name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { id: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light', price: 9.99 },
  boltTShirt: { id: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  fleeceJacket: { id: 'sauce-labs-fleece-jacket', name: 'Sauce Labs Fleece Jacket', price: 49.99 },
  onesie: { id: 'sauce-labs-onesie', name: 'Sauce Labs Onesie', price: 7.99 },
  redTShirt: {
    id: 'test.allthethings()-t-shirt-(red)',
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
  },
} as const;

export const CUSTOMER = {
  firstName: 'Vincent',
  lastName: 'Jerico',
  postalCode: '1000',
} as const;

/** Sauce tax rate observed in TER-002 (tax = 8% of item total). */
export const TAX_RATE = 0.08;
