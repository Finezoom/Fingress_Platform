/*import { test as setup, expect, Page } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';
let baseUrl = "http://192.168.1.49:8086/";

async function Maker_login(page: Page, domainId: string, loginId: string, password: string) {
    await page.locator('#toolbar-logout').getByRole('button').click();
    await page.getByRole('button', { name: 'Login ' }).click();
    await page.getByPlaceholder('Domain Id').fill(domainId);
    await page.getByPlaceholder('Login Id').fill(loginId);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
}
setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto(baseUrl);
  await Maker_login(page,'fingress','maker','1234');
//   await page.locator('app-logout-button').nth(0).click();
//   await page.getByText('Login').nth(0).click(); 
//   await page.getByPlaceholder('Domain Id').nth(0).fill('fingress');
//   await page.getByPlaceholder('Login Id').nth(0).fill('maker');
//   await page.getByPlaceholder('Password').nth(0).fill('1234');
//   await page.getByRole('button',{name:"Sign in"}).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('http://192.168.1.49:8086/launcher');
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByText('My Apps').nth(0)).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});*/