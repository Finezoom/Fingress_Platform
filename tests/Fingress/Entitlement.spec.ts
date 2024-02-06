import { test, expect, Page } from '@playwright/test';
let baseURL = 'http://192.168.1.49:8086/'
let RefID = "USR20240202762177"
async function Maker_login(page: Page, domainId: string, loginId: string, password: string) {
    await page.locator('#toolbar-logout').getByRole('button').click();
    await page.getByRole('button', { name: 'Login ' }).click();
    await page.getByPlaceholder('Domain Id').fill(domainId);
    await page.getByPlaceholder('Login Id').fill(loginId);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
}
async function Entitlement_Module(page: Page) {
    await page.getByRole('heading', { name: 'Flows & Settings' }).click();
    await page.getByRole('button', { name: ' Entitlements' }).click();
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
async function MiddleOffice(page: Page) {
    await page.getByLabel('Organization *').locator('span').click();
    await page.getByText('Bank').click();
    await page.waitForTimeout(1000);
    await page.getByText(' Domain').click();
    await page.getByText('FINGRESS FIRST BANK').click();
    await page.getByRole('button', { name: 'Fetch' }).click();
    await page.waitForTimeout(5000);
}
async function Customer(page: Page) {
    await page.getByLabel('Organization *').locator('span').click();
    await page.getByText('Customer', { exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Domain').click();
    await page.getByText('BSITSELVA').click();
    await page.getByRole('button', { name: 'Fetch' }).click();
}
async function CustomerUser(page: Page) {
    await page.locator('#mat-select-value-3').click();
    await page.getByRole('option', { name: 'User' }).click();
    await page.locator('form div').filter({ hasText: 'Organization *' }).nth(4).click();
    await page.getByText('Customer', { exact: true }).click();
    await page.waitForTimeout(1000);
    await page.locator('form div').filter({ hasText: 'Domain *' }).nth(4).click();
    await page.getByText('BSITSELVA').click();
    await page.waitForTimeout(1000);
    await page.getByLabel('User *').locator('span').click();
    await page.getByText('ACCOUNT123').click();
    await page.getByRole('button', { name: 'Fetch' }).click();
}
async function MiddleOfficeUser(page: Page) {
    await page.locator('#mat-select-value-3').click();
    await page.waitForTimeout(1000);
    await page.getByText('User').click();
    await page.locator('form div').filter({ hasText: 'Organization *' }).nth(4).click();
    await page.getByText('Bank').click();
    await page.waitForTimeout(1000);
    await page.getByText('Domain').click();
    await page.getByText('FINGRESS FIRST BANK').click();
    await page.waitForTimeout(1000);
    await page.getByLabel('User *').locator('span').click();
    await page.getByText('ADMIN05').click();
    await page.getByRole('button', { name: 'Fetch' }).click();
}
const Group = async (page: Page, GroupOption: string): Promise<void> => {
    await page.locator('#mat-select-value-3').click();
    await page.getByText('Groups').click();
    await page.waitForTimeout(2000);
    await page.getByText('Organization').first().click();
    await page.getByText('Customer').click();
    await page.waitForTimeout(1000);
    await page.getByLabel('Group *').locator('span').click();
    await page.locator("[class*='mat-option-text']").getByText(GroupOption).nth(0).click();
    await page.getByRole('button', { name: 'Fetch Product' }).click();
};
async function Submit(page: Page) {  
    await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();                                                                                                      
    expect(await page.getByRole('button', { name: 'Submit' }).click());
    const okButton = page.getByRole('button', { name: 'OK' });
    if (await okButton.isVisible()) {
        await okButton.click();
        await page.close();
    } else {
        const [response] = await Promise.all([
            page.waitForResponse(re => re.url() === "http://192.168.1.49:8086/data-service/getPartyFeatureList"),
            await page.getByRole('button', { name: 'Yes' }).click()      
        ]);  
        console.log(await page.locator('[id="swal2-html-container"]').textContent());  
        const res = await response.json();
        let ref = res.partyInfo;
        RefID = ref.partyReferenceId;
        console.log(`Reference ID: ${RefID}`);
    }
}
async function Group_Submit(page: Page) {
    await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
    await page.getByRole('button', { name: 'Submit' }).click();
    const [response] = await Promise.all([
        page.waitForResponse(re => re.url() === "http://192.168.1.49:8086/data-service/fgGroupSave"),
        await page.getByRole('button', { name: 'Yes' }).click()
    ]);
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
    const res = await response.json();
    RefID = res.referenceId;
    console.log(`Reference ID: ${RefID}`);
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
test('Test Case 21029: Validate that the entitlement is created for Middle Office', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    expect(await Entitlement_Module(page));
    expect(await MiddleOffice(page));
    expect(await page.getByRole('tab', { name: 'Permission' }).click());
    await page.waitForTimeout(5000);
    expect(await Submit(page));
});
test('Test Case 20983: Validate the Save as Template Functionality', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await MiddleOffice(page);
    await page.getByRole('tab', { name: 'Permission' }).click();
    await page.getByText(' Save as Template').click();
    //await page.getByRole('textbox', { name: 'Template' }).fill('User123');
    await page.getByRole('button', { name: 'Apply' }).click();
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
});
test('Test Case 20985: Validate the Update Template Functionality', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await MiddleOffice(page);
});
test('Test Case 21283: Validate that Products and Permissions are granted for Middle Office', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await MiddleOffice(page);
    await page.locator('#mat-checkbox-2').click();
    await page.locator('#mat-checkbox-5').click();
    await page.locator('#mat-checkbox-12').click();
    await page.getByText('Permission', { exact: true }).click();
    await page.locator('[id="mat-checkbox-257"]').click();
    await page.locator('[id="mat-checkbox-259"]').click();
    await page.locator('[id="mat-checkbox-261"]').click();
    await page.locator('[id="mat-checkbox-263"]').click();
    await Submit(page);
});
test('Test Case 21285: Validate that Products and Permissions are removed for Middle Office', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await MiddleOffice(page);
    await page.getByText('None').nth(0).click();
    await page.getByRole('tab', { name: 'Permission' }).click();
    await page.getByText('None').nth(0).click();
    await Submit(page);
});
test('Test Case 21291: Validate the Removal of Approval for Products and Permissions in Middle Office', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await MiddleOffice(page);
    await page.getByText('None').nth(0).click();
    await page.getByRole('tab', { name: 'Permission' }).click();
    await page.getByText('None').nth(0).click();
    await Submit(page);
});
test('Test Case 21067: Validate that the entitlement is created for Customer', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await Customer(page);
    await Submit(page);
});
test('Test Case 21281: Validate that Products and Permissions are granted for Customer', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await Customer(page);
    await page.getByRole('button', { name: 'All' }).click();
    await page.getByText('Permission', { exact: true }).click();
    await page.getByRole('button', { name: 'All' }).click();
    await Submit(page);
});
test('Test Case 21287: Validate that Products and Permissions are removed for Customer', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await Customer(page);
    await page.getByRole('button', { name: 'None' }).click();
    await page.getByText('Permission', { exact: true }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'None' }).click();
    await Submit(page);
});
test('Test Case 21253: Validate that the Customer can be approved', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await Customer(page);
    await page.locator('#mat-checkbox-2').click();
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page)
});
test('Test Case 21279: Validate that the Customer can be rejected', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await Customer(page);
    await page.locator('#mat-checkbox-2').click();
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Rejection(page)
});
test('Test Case 21290: Validate the Removal of Approval for Products and Permissions in Customer', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await Customer(page);
    await page.locator('#mat-checkbox-2').click();
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page)
});
test('Test Case 11874: Validate that the entitlement is created for Middle Office user', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await MiddleOfficeUser(page);
    await Submit(page);
});
test('Test Case 21284: Validate that Products and Permissions are granted for Middle Office user', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await MiddleOfficeUser(page);
    await page.getByRole('button', { name: 'All' }).click();
    await page.getByText('Permission', { exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'All' }).click();
    await Submit(page);
});
test('Test Case 21286: Validate that Products and Permissions are removed for Middle Office user', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await MiddleOfficeUser(page);
    await page.getByRole('button', { name: 'None' }).click();
    await page.getByText('Permission', { exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'None' }).click();
    await Submit(page);
});
test('Test Case 21252: Validate that the Middle Office user can be approved', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await MiddleOfficeUser(page);
    await page.getByRole('button', { name: 'None' }).click();
    await page.getByText('Permission', { exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'None' }).click();
    await Submit(page);
});
test('Test Case 21278: Validate that the Middle Office user can be rejected', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await MiddleOfficeUser(page);
    await page.getByRole('button', { name: 'None' }).click();
    await page.getByText('Permission', { exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'None' }).click();
    await Submit(page);
});
test('Test Case 21292: Validate the Removal of Approval for Products and Permissions in Middle Office user', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await MiddleOfficeUser(page);
    await page.getByRole('button', { name: 'None' }).click();
    await page.getByText('Permission', { exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'None' }).click();
    await Submit(page);
});
test('Test Case 21068: Validate that the entitlement is created for Customer user', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await CustomerUser(page);
    await Submit(page);
});
test('Test Case 21282: Validate that Products and Permissions are granted for Customer user', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await CustomerUser(page);
    await page.getByRole('button', { name: 'All' }).click();
    await page.getByRole('tab', { name: 'Permission' }).click();
    await page.waitForTimeout(2000);
    await Submit(page);
});
test('Test Case 21288: Validate that Products and Permissions are removed for Customer user', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await CustomerUser(page);
    await page.getByRole('button', { name: 'None' }).click();
    await page.getByText('Permission').click();
    await page.getByRole('button', { name: 'None' }).nth(1).click();
    await Submit(page);
});
test('Test Case 21254: Validate that the Customer user can be approved', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await CustomerUser(page);
    await page.getByRole('button', { name: 'None' }).click();
    await page.getByText('Permission').click();
    await page.getByRole('button', { name: 'None' }).nth(1).click();
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21280: Validate that the Customer user can be rejected', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await CustomerUser(page);
    await page.getByRole('button', { name: 'None' }).click();
    await page.getByText('Permission').click();
    await page.getByRole('button', { name: 'None' }).nth(1).click();
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Rejection(page);
});
test('Test Case 21289: Validate the Removal of Approval for Products and Permissions in Customer User', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Entitlement_Module(page);
    await CustomerUser(page);
    await page.getByRole('button', { name: 'None' }).click();
    await page.getByText('Permission').click();
    await page.getByRole('button', { name: 'None' }).nth(1).click();
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21734: Validate that the entitlement is created for Group', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await Group(page, 'Admin');
    await Group_Submit(page);
});
test('Test Case 21735: Validate that Products and Permissions are granted for Group', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await Group(page, 'Admin');
    await page.getByRole('button', { name: 'All' }).click();
    await Group_Submit(page);
});
test('Test Case 21745: Validate that Products and Permissions are removed for Group', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await Group(page, ' Admin ');
    await page.getByRole('button', { name: 'None' }).click();
    await Group_Submit(page);
});
test('Test Case 21741: Validate that the Group can be approved', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await Group(page, ' Admin ');
    await Group_Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21743: Validate that the Group can be rejected', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await Group(page, 'Admin ');
    await Group_Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Rejection(page);
});
test('Test Case 21747: Validate the Removal of Approval for Products and Permissions in Group', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Entitlement_Module(page);
    await Group(page, 'Admin');
    await Group_Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
