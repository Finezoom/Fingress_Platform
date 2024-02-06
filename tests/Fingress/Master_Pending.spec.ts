import { test, expect, Page, chromium, Browser, BrowserContext } from '@playwright/test';
let baseURL = 'http://192.168.1.49:8086/launcher';
async function Checker_login(page: Page) {
    await page.locator('#toolbar-logout').getByRole('button').click();
    await page.getByRole('button', { name: 'Login ' }).click();
    await page.getByPlaceholder('Domain Id').fill('fingress');
    await page.getByPlaceholder('Login Id').fill('checker');
    await page.getByPlaceholder('Password').fill('Fingress@123');
    await page.getByRole('button', { name: 'Sign in' }).click();
}
async function Master_Pending(page: Page) {
    await page.getByRole('heading', { name: 'Flows & Settings' }).click();
    await page.getByRole('button', { name: ' Master pending' }).click();
}
async function selectOptionFromSearch(page: Page, searchText: string, optionName: string) {
    await page.getByLabel('Choose the category').click();
    await page.getByRole('combobox', { name: 'Choose the category' }).fill(searchText);
    await page.waitForTimeout(2000);
    await page.getByRole('option', { name: optionName }).nth(0).click();
}
let browser: Browser;
let context: BrowserContext;
let page: Page;
test.beforeEach(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(baseURL);
    await Checker_login(page);
    await Master_Pending(page);
})
test.afterEach(async () => {
    await page.close();
    await context.close();
    await browser.close();
})
test('Test Case 13627: Validate by click the application tab Flows and settings ', async () => {
    await page.goBack();
    await page.waitForTimeout(2000);
    const topAppTitleElement = page.locator('div[class*="topAppTitle"]');
    const textContent = await topAppTitleElement.textContent();
    if (textContent && textContent.includes('Flows & Settings')) {
        console.log('Flows and settings Button is clickable');
    } else {
        console.log('Flows and settings Button is not clickable');
    }
});
test('Test Case 13628: Validate the list page in master pending application ', async () => {
    await page.locator('#mat-checkbox-1').click();
    await page.locator('#mat-checkbox-2').click();
    await page.locator('#mat-checkbox-11').click();
    await page.locator('#mat-checkbox-4').click();
    await page.locator('#mat-checkbox-11').click();
    await page.locator('#mat-checkbox-11').click();
    console.log(await page.locator("[class*='cdk-row']").nth(0).innerText());
});
test('Test Case 13629: Validate the search filter for entity Reference', async () => {
    await selectOptionFromSearch(page, 'Fi', 'File Layout');
    await page.waitForTimeout(2000);
    console.log(await page.locator("[class*='cdk-column-CATEGORY_NAME']").allTextContents());
});
test('Test Case 13630: Validate the Approve and Return buttons for select all transactions', async () => {
    const initialRefIds = await page.locator("td[class*='ENTITY_REF_ID']").allTextContents();
    await page.locator('[id="mat-checkbox-11"]').click();
    await page.locator('[class="actionLabel"]').nth(1).click();
    await page.locator("(//span[normalize-space()='Yes'])[1]").click();
    await page.waitForTimeout(5000);
    const newRefIds = await page.locator("td[class*='ENTITY_REF_ID']").allTextContents();
    expect(newRefIds).not.toEqual(initialRefIds);
    await page.waitForTimeout(2000);
    const initialRefIds1 = await page.locator("td[class*='ENTITY_REF_ID']").allTextContents();
    await page.locator('[id="mat-checkbox-22"]').click();
    await page.locator('[class="actionLabel"]').nth(0).click({ position: { x: 40, y: 20 } });
    await page.locator("(//span[normalize-space()='Yes'])[1]").click();
    await page.waitForTimeout(5000);
    const newRefIds1 = await page.locator("td[class*='ENTITY_REF_ID']").allTextContents();
    expect(newRefIds1).not.toEqual(initialRefIds1);
});
test('Test Case 13631: Validate the functionality of View button and fields in view page', async () => {
    await page.locator('td[class*="ACTIONS"]').nth(0).getByText('arrow_forward').click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'ViewPage.png', fullPage: true });
});