import { test, expect, Page } from '@playwright/test';
let baseURL = 'http://192.168.1.49:8086/'
let RefID = "BRL20240201761218"
async function Maker_login(page: Page, domainId: string, loginId: string, password: string) {
    await page.locator('#toolbar-logout').getByRole('button').click();
    await page.getByRole('button', { name: 'Login ' }).click();
    await page.getByPlaceholder('Domain Id').fill(domainId);
    await page.getByPlaceholder('Login Id').fill(loginId);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
}
async function StageFlow_Module(page: Page) {
    await page.waitForTimeout(1000);
    await page.getByRole('heading', { name: 'Flows & Settings' }).click();
    await page.getByRole('button', { name: ' Stage flow' }).click();
}
async function Maker_logout(page: Page) {
    await page.waitForTimeout(1000);
    await page.locator('#toolbar-languages').getByRole('button').click();
    await page.getByText('Sign out').click();
    await page.getByRole('button', { name: 'Log out' }).click();
}
async function Checker_login(page: Page) {
    await page.waitForTimeout(1000);
    await page.locator('#toolbar-logout').getByRole('button').click();
    await page.getByRole('button', { name: 'Login ' }).click();
    await page.getByPlaceholder('Domain Id').fill('fingress');
    await page.getByPlaceholder('Login Id').fill('checker');
    await page.getByPlaceholder('Password').fill('Fingress@123');
    await page.getByRole('button', { name: 'Sign in' }).click();
}
async function Master_Pending(page: Page) {
    await page.waitForTimeout(1000);
    await page.getByRole('heading', { name: 'Flows & Settings' }).click();
    await page.getByRole('button', { name: ' Master pending' }).click();
}
const selectType = async (page: Page, typeName: string): Promise<void> => {
    await page.waitForTimeout(1000);
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Type').locator('span').click();
    await page.getByText(typeName, { exact: true }).click();
};
const selectLaunchOption = async (page: Page, launchOptionText: string): Promise<void> => {
    await page.locator('button').filter({ hasText: 'launch' }).click();
    await page.getByText(launchOptionText, { exact: true }).first().click();
    await page.waitForTimeout(10000);
};
const selectModule = async (page: Page, moduleName: string): Promise<void> => {
    await page.waitForTimeout(1000);
    await page.getByLabel('Module').locator('span').click();
    await page.getByText(moduleName).click();
    await page.waitForTimeout(2000);
    const errorMessageElement = page.locator('[id="swal2-html-container"]');
    if (await errorMessageElement.isVisible()) {
        const errorMessageElement = await page.waitForSelector('[id="swal2-html-container"]');
        const errorMessageText = await page.evaluate(el => el.textContent, errorMessageElement);
        console.error(`Error Message: ${errorMessageText}`);
        await page.getByText('OK').click();
        await page.close();
    }
};
const Single_Auth_AutoAuth = async (page: Page): Promise<void> => {
    await page.waitForTimeout(1000);
    await page.getByText('add_circle').click();
    await page.getByText('Single').click();
    await page.getByRole('option', { name: 'Single' }).locator('span').click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.locator('button').filter({ hasText: 'settings' }).click();
    await page.getByLabel('Stages').getByText('Stage', { exact: true }).click();
    await page.getByText('Initiation').click();
    await page.getByLabel('Stages').getByText('Performer Role').click();
    await page.getByText('BankGroup').click();
    await page.getByRole('row', { name: 'Stage Initiation Performer' }).getByRole('button').click();
    await page.getByRole('cell', { name: 'Auto Authorize' }).click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.waitForTimeout(2000);
};
const Single_Auth_STP = async (page: Page): Promise<void> => {
    await page.waitForTimeout(1000);
    await page.getByText('add_circle').click();
    await page.getByText('Single').click();
    await page.getByRole('option', { name: 'Single' }).locator('span').click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.locator('button').filter({ hasText: 'settings' }).click();
    await page.getByLabel('Stages').getByText('Stage', { exact: true }).click();
    await page.getByText('Initiation').click();
    await page.getByLabel('Stages').getByText('Performer Role').click();
    await page.getByText('BankGroup').click();
    await page.getByRole('row', { name: 'Stage Initiation Performer' }).getByRole('button').click();
    await page.getByRole('cell', { name: 'STP' }).click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.waitForTimeout(2000);
};
const Single_Auth_Autosubmit = async (page: Page): Promise<void> => {
    await page.waitForTimeout(1000);
    await page.getByText('add_circle').click();
    await page.getByText('Single').click();
    await page.getByRole('option', { name: 'Single' }).locator('span').click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.locator('button').filter({ hasText: 'settings' }).click();
    await page.getByLabel('Stages').getByText('Stage', { exact: true }).click();
    await page.getByText('Initiation').click();
    await page.getByLabel('Stages').getByText('Performer Role').click();
    await page.getByText('BankGroup').click();
    await page.getByRole('row', { name: 'Stage Initiation Performer' }).getByRole('button').click();
    await page.getByRole('cell', { name: 'Auto Submit' }).click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.waitForTimeout(2000);
};
const File_Auth_Level = async (page: Page): Promise<void> => {
    await page.waitForTimeout(1000);
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByText('SingleAuthorization Level').click();
    await page.getByText('File', { exact: true }).click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.locator('button').filter({ hasText: 'settings' }).nth(1).click();
    await page.getByLabel('Stage', { exact: true }).locator('span').click();
    await page.getByText('Acceptance').click();
    await page.getByLabel('Stages').getByText('Performer Role').click();
    await page.getByText('Buyer', { exact: true }).click();
    await page.getByRole('row', { name: 'Stage Acceptance Performer' }).getByRole('button').click();
    await page.getByRole('button', { name: 'Apply' }).click();
};
async function Submit(page: Page) {
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
    const okButton = page.getByRole('button', { name: 'OK' });
    if (await okButton.isVisible()) {
        await okButton.click();
        await page.close();
    } else {
        const [response] = await Promise.all([
            page.waitForEvent('response', re => re.url() == "http://192.168.1.49:8086/data-service/fgModRule")
        ]);
        interface MyResponse {
            referenceId: string;
        }
        const res: MyResponse = await response.json();
        RefID = res[0].referenceId;
        console.log(`Reference ID: ${RefID}`);
    }
};
async function Approval(page: Page) {
    await expect(page.getByText(`${RefID}`)).toBeVisible();
    const entity = await page.locator('td[class*="ENTITY_REF"]').allTextContents();
    for (let i = 0; i < entity.length; i++) {
        if (entity[i].includes(RefID)) {
            await page.locator('td[class*="ACTIONS"]').nth(i).getByText('Approve').click();
            break;
        }
    } await page.getByRole('button', { name: 'Approve' }).click();
    await page.waitForTimeout(10000);
    await expect(page.getByText(`${RefID}`)).not.toBeVisible();
    if (await page.getByText(`${RefID}`).isHidden()) {
        console.log('Layout is approved in the master pending');
    } else {
        console.log('Layout is not approved in the master pending');
    }
}
async function Rejection(page: Page) {
    await expect(page.getByText(`${RefID}`)).toBeVisible();
    const entity = await page.locator('td[class*="ENTITY_REF"]').allTextContents();
    for (let i = 0; i < entity.length; i++) {
        if (entity[i].includes(RefID)) {
            await page.locator('td[class*="ACTIONS"]').nth(i).getByText('Return').click();
            break;
        }
    } await page.getByRole('button', { name: 'Return' }).click();
    await page.waitForTimeout(10000);
    await expect(page.getByText(`${RefID}`)).not.toBeVisible();
    if (await page.getByText(`${RefID}`).isHidden()) {
        console.log('Layout is Rejected in the master pending');
    } else {
        console.log('Layout is not Rejected in the master pending');
    }
}
test('Test Case 21684: Validate the approval of stage flow with multiple rules', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await StageFlow_Module(page);
    await selectType(page, 'Customer');
    await selectLaunchOption(page, ' HCL ');
    await selectModule(page, 'Sweeping Rule');
    await Single_Auth_AutoAuth(page);
    await File_Auth_Level(page);
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21685: Validate the rejection of stage flow with multiple rules', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await StageFlow_Module(page);
    await selectType(page, 'Customer');
    await selectLaunchOption(page, 'SELVA');
    await selectModule(page, 'FileUpload');
    await Single_Auth_AutoAuth(page);
    await File_Auth_Level(page);
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Rejection(page);
});
test('Test Case 21694: Validate the approval of stage flow with Auto-authorize', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await StageFlow_Module(page);
    await selectType(page, 'Customer');
    await selectLaunchOption(page, 'SELVA');
    await selectModule(page, ' Site Apps ');
    await Single_Auth_AutoAuth(page);
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21695: Validate the rejection of stage flow with Auto-authorize', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await StageFlow_Module(page);
    await selectType(page, 'Customer');
    await selectLaunchOption(page, 'SELVA');
    await selectModule(page, ' Site Apps ');
    await Single_Auth_AutoAuth(page);
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Rejection(page);
});
test('Test Case 21696: Validate the approval of stage flow with STP', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await StageFlow_Module(page);
    await selectType(page, 'Customer');
    await selectLaunchOption(page, 'SELVA');
    await selectModule(page, ' Site Apps ');
    await Single_Auth_STP(page);
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21697: Validate the rejection of stage flow with STP', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await StageFlow_Module(page);
    await selectType(page, 'Customer');
    await selectLaunchOption(page, 'SELVA');
    await selectModule(page, ' Site Apps ');
    await Single_Auth_STP(page);
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Rejection(page);
});
test('Test Case 21698: Validate the approval of stage flow with Auto-submit', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await StageFlow_Module(page);
    await selectType(page, 'Customer');
    await selectLaunchOption(page, 'SELVA');
    await selectModule(page, ' Site Apps ');
    await Single_Auth_Autosubmit(page);
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21699: Validate the rejection of stage flow with Auto-submit', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await StageFlow_Module(page);
    await selectType(page, 'Customer');
    await selectLaunchOption(page, 'SELVA');
    await selectModule(page, ' Site Apps ');
    await page.pause();
    await Single_Auth_Autosubmit(page);
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Rejection(page);
});