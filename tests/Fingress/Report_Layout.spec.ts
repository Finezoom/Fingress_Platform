import { test, expect, Page } from '@playwright/test';
let baseURL = 'http://192.168.1.49:8086/launcher'
let RefID = "LAY20240122750325"
async function Maker_login(page: Page, domainId: string, loginId: string, password: string) {
    await page.locator('#toolbar-logout').getByRole('button').click();
    await page.getByRole('button', { name: 'Login ' }).click();
    await page.getByPlaceholder('Domain Id').fill(domainId);
    await page.getByPlaceholder('Login Id').fill(loginId);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
}
async function ReportLayout_Module(page: Page) {
    await page.getByRole('heading', { name: 'System Configurations' }).click();
    await page.getByRole('button', { name: ' Report' }).click();
    await page.getByText('Report Layout').click();
    await page.waitForTimeout(3000);
}
async function selectPageOrientation(page: any, orientation: string): Promise<void> {
    await page.getByText('Page Orientation').click();
    await page.getByText(orientation).click();
}
async function Maker_logout(page: Page) {
    await page.locator('#toolbar-languages').getByRole('button').click();
    await page.getByText('Sign out').click();
    await page.getByRole('button', { name: 'Log out' }).click();
}
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
async function fillNameField(page: any, nameValue: string): Promise<void> {
    await page.getByText('Name').click();
    await page.getByPlaceholder('Name').fill(nameValue);
}
async function selectPageSize(page: Page, size: string): Promise<void> {
    await page.waitForSelector('#mat-select-value-11');
    await page.locator('#mat-select-value-11').click();
    await page.getByRole('option', { name: size }).click();
}
async function selectmodel(page: any, model: string): Promise<void> {
    await page.waitForTimeout(5000);
    expect(await page.locator('[class="col-md-4"]').nth(2).click());
    expect(await page.getByText(model).click());
}
async function selectTabularViewType(page: any, viewType: string): Promise<void> {
    await page.waitForTimeout(2000);
    await page.locator("[class*='mat-option-text']").getByText(viewType);
}
async function Save_Template(page: any): Promise<void> {
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
}
async function Submit(page: Page) {
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
    const okButton = page.getByRole('button', { name: 'OK' });
    if (await okButton.isVisible()) {
        await okButton.click();
        await page.close();
    } else {
        const [response] = await Promise.all([
            page.waitForEvent('response', re => re.url() == "http://192.168.1.49:8086/data-service/fgLayoutTemplate")
        ]);
        interface MyResponse {
            referenceId: string;
        }
        const res: MyResponse = await response.json();
        RefID = res[0].referenceId;
        console.log(`Reference ID: ${RefID}`);
    }
}
test('Test Case 21611: Verify that the new report layout defined for the data model', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await ReportLayout_Module(page);
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await fillNameField(page, 'Fingress1');
    await selectPageOrientation(page, 'Portrait');
    await selectmodel(page, 'Invoices');
    await Submit(page);
});
test('Test Case 21612: Verify that the existing report layout can be modified', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await ReportLayout_Module(page);
    await page.getByText('edit').nth(0).click();
    await page.waitForTimeout(2000);
    await selectPageSize(page, 'A3');
    await selectTabularViewType(page, 'PDF');
    await Submit(page);
});
test('Test Case 21613: Verify that the new report layout can be defined with the unique name', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await ReportLayout_Module(page);
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await fillNameField(page, 'Fingress2');
    await selectPageOrientation(page, 'Portrait');
    await selectmodel(page, 'Invoices');
    await Submit(page);
});
test('Test Case 21614: Verify that the report layout is saved for later submission for approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await ReportLayout_Module(page);
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await fillNameField(page, 'Fingress3');
    await selectPageOrientation(page, 'Portrait');
    await selectmodel(page, 'Invoices');
    await Save_Template(page);
});
test('Test Case 21615: Verify that the report layouts submitted is available in the master pending', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await ReportLayout_Module(page);
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await fillNameField(page, 'FG001');
    await selectPageOrientation(page, 'Portrait');
    await selectmodel(page, 'Charge Code');
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    const isRefIdVisible = await page.locator('[class="content"]').first().isVisible();
    if (isRefIdVisible) {
        console.log('Layout is available in the master pending');
    } else {
        console.log('Layout not available in the master pending');
    }
    expect(isRefIdVisible).toBe(true);
});
test('Test Case 21616: Verify that the report layouts is approved by the user with the optional comments', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await ReportLayout_Module(page);
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await fillNameField(page, 'Fingress5');
    await selectPageOrientation(page, 'Portrait');
    await selectmodel(page, 'Charge Code');
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await page.getByText('arrow_forward').first().click();
    await page.getByLabel('Text', { exact: true }).fill('OK');
    const ele = page.locator('[class="actionLabel"]').nth(1);
    await ele.click({ position: { x: 40, y: 20 } });
    await page.getByRole('button', { name: 'Yes' }).click();
});
test('Test Case 21617: Verify that the submitted report layout revision is rejected by the user with the reason and the comments', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await ReportLayout_Module(page);
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await fillNameField(page, 'Fingress07');
    await selectPageOrientation(page, 'Portrait');
    await selectmodel(page, 'Charge Code');
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await expect(page.getByText(`${RefID}`)).toBeVisible();
    const entity = await page.locator('td[class*="ENTITY_REF"]').allTextContents();
    for (let i = 0; i < entity.length; i++) {
        if (entity[i].includes(RefID)) {
            await page.locator('td[class*="ACTIONS"]').nth(i).getByText('Return').click();
            console.log("cell count : " + i);
            break;
        }
    }
    await page.getByRole('button', { name: 'Return' }).click();
    await page.waitForTimeout(10000);
    await expect(page.getByText(`${RefID}`)).not.toBeVisible();
    if (await page.getByText(`${RefID}`).isHidden()) {
        console.log('Layout is approved in the master pending');
    } else {
        console.log('Layout is not approved in the master pending');
    }
});