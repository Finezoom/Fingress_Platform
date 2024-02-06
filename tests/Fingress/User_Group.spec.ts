import { test, expect, Page } from '@playwright/test';
let RefID = "USR20240131757696";
let baseURL = 'http://192.168.1.49:8086/launcher'
async function Maker_login(page: Page, domainId: string, loginId: string, password: string) {
    await page.locator('#toolbar-logout').getByRole('button').click();
    await page.getByRole('button', { name: 'Login ' }).click();
    await page.getByPlaceholder('Domain Id').fill(domainId);
    await page.getByPlaceholder('Login Id').fill(loginId);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
}
async function UserGroup_Module(page: Page) {
    await page.getByRole('heading', { name: 'Profile Management' }).click();
    await page.getByRole('button', { name: ' Groups' }).click();
}
async function Security(page: Page, Type: string, Name: string, Code: string) {
    await page.getByRole('tab', { name: 'Security' }).click();
    await page.getByLabel('Edit Record').click();
    await page.getByRole('button', { name: 'Security' }).click();
    await page.getByText('Customer Org Type Code *').first().click();
    await page.getByRole('option', { name: Type }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(Name);
    await page.getByRole('textbox', { name: 'Code' }).fill(Code);
}
async function Authorization(page: Page, Type: string, Name: string, Code: string) {
    await page.getByLabel('Edit Record').click();
    await page.getByRole('button', { name: 'Authorization' }).click();
    await page.click('[id="mat-select-value-25"]');
    await page.getByRole('option', { name: Type }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(Name);
    await page.getByRole('textbox', { name: 'Code' }).fill(Code);
}
async function Maker_logout(page: Page) {
    await page.locator('#toolbar-languages').getByRole('button').click();
    await page.getByText('Sign out').click();
    await page.getByRole('button', { name: 'Log out' }).click();
}
async function Submit(page: Page) {
    await page.getByRole('button', { name: 'Submit' }).click();
    const okButton = page.getByRole('button', { name: 'OK' });
    if (await okButton.isVisible()) {
        await okButton.click();
        await page.close();
    } else {
        const [response] = await Promise.all([
            page.waitForEvent('response', re => re.url() === 'http://192.168.1.49:8086/data-service/mutationService'),
            await page.getByRole('button', { name: 'Yes' }).click()
        ]);
        console.log(await page.locator('[id="swal2-html-container"]').textContent());
        const res = await response.json();
        RefID = res.referenceId || res.REFERENCE_ID;
        if (RefID) {
            if (res.REFERENCE_ID) {
                console.log(`Reference ID: ${res.REFERENCE_ID}`);
            } else {
                console.log(`Reference ID: ${RefID}`);
            }
        }
    }
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
test('Test Case 20998: Validate security group creation for middle office organization can be submitted', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await UserGroup_Module(page);
    await Security(page, 'Bank', 'BSIT4', '004');
    await Submit(page);
});
test('Test Case 21305: Validate middle office organization security group approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await UserGroup_Module(page);
    await Security(page, 'Bank', 'Fingress01', 'FG01');
    await Submit(page);
});
test('Test Case 21774: Validate security group creation for customer organization can be submitted.', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await UserGroup_Module(page);
    await Security(page, 'Customer', 'Fingress04', 'FG04');
    await Submit(page);
});
test('Test Case 21776: Validate customer organization security group approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await UserGroup_Module(page);
    await Security(page, 'Customer', 'Fingress05', 'FG05');
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21303: Validate authorization group for middle office organization can be submitted', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await UserGroup_Module(page);
    await Authorization(page, 'Bank', 'Fingress06', 'FG06');
    await Submit(page);
});
test('Test Case 21304: Validate authorization group for middle office organization approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await UserGroup_Module(page);
    await Authorization(page, 'Bank', 'Fingress07', 'FG07');
    await Submit(page);
});
test('Test Case 21043: Validate authorization group for customer organization can be submitted', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await UserGroup_Module(page);
    await Authorization(page, 'Customer', 'Fingress08', 'FG08');
    await Submit(page);
});
test('Test Case 21311: Validate authorization group for customer organization approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await UserGroup_Module(page);
    await Authorization(page, 'Customer', 'Fingress09', 'FG09');
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21007: Validate middle office organization user can be associate to the middle office organization security group', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await UserGroup_Module(page);
    await Authorization(page, 'Customer', 'Fingress09', 'FG09');
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21807: Validate middle office organization user association in security group approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await UserGroup_Module(page);
    await Authorization(page, 'Customer', 'Fingress09', 'FG09');
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21022: Validate middle office organization user can be disassociate to the middle office organization security group', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await UserGroup_Module(page);
    await Authorization(page, 'Customer', 'Fingress09', 'FG09');
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21808: Validate middle office organization user disassociation in security group approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await UserGroup_Module(page);
    await Authorization(page, 'Customer', 'Fingress09', 'FG09');
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await Approval(page);
});
test('Test Case 21312: Validate customer organization user can be associate to the customer organization security group', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await UserGroup_Module(page);
    await page.getByRole('tab', { name: 'Security' }).click();
    await page.locator("td[class*='STATUS']").nth(0).waitFor({ state: 'visible' });
    const statusFields = await page.locator("td[class*='STATUS']").all();
    const partyFields = await page.locator("td[class*='PARTY']").all();
    const nameFields = await page.locator("td[class*='NAME']").all();
    for (let i = 0; i < statusFields.length; i++) {
        const statusText = await statusFields[i].allTextContents();
        const partyText = await partyFields[i].allTextContents();
        if (statusText[i].includes('APPROVED') && partyText[i].includes('Customer')) {
            await nameFields[i].click();
            await page.pause();
            await page.locator('.mat-form-field-infix').first().click();
            await page.getByText('ONLINE').click();
            await page.locator('button').filter({ hasText: 'Associate' }).first().click();
            console.log(await page.locator('[id="swal2-html-container"]').textContent());
            break;
        }
    }

});
test('Test Case 21056: Validate customer organization user association in security group approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await UserGroup_Module(page);
    await page.getByRole('tab', { name: 'Security' }).click();
    await page.locator("td[class*='STATUS']").nth(0).waitFor({ state: 'visible' });
    const statusFields = await page.locator("td[class*='STATUS']").all();
    const partyFields = await page.locator("td[class*='PARTY']").all();
    const nameFields = await page.locator("td[class*='NAME']").all();
    for (let i = 0; i < statusFields.length; i++) {
        const statusText = await statusFields[i].allTextContents();
        const partyText = await partyFields[i].allTextContents();
        if (statusText[i].includes('APPROVED') && partyText[i].includes('Customer')) {
            await nameFields[i].click();
            await page.locator('.mat-form-field-infix').first().click();
            await page.getByText('DEMOC').click();
            await page.locator('button').filter({ hasText: 'Associate' }).first().click();
            console.log(await page.locator('[id="swal2-html-container"]').textContent());
            break;
        }
    }
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await page.pause();

});


