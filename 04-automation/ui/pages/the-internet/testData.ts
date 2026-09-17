/** Shared test data for The Internet suite (see TP-002). */

export const CREDENTIALS = {
  valid: { username: 'tomsmith', password: 'SuperSecretPassword!' },
} as const;

export const FLASH = {
  loginSuccess: 'You logged into a secure area!',
  logoutSuccess: 'You logged out of the secure area!',
  invalidUsername: 'Your username is invalid!',
  invalidPassword: 'Your password is invalid!',
  mustLogin: 'You must login to view the secure area!',
} as const;
