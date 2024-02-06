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
async function Enrollment_Module(page: Page) {
    await page.getByRole('heading', { name: 'Profile Management' }).click();
}
async function General_Info(page: Page, Organization: string, Name: string, Constitution: string) {
    await page.waitForTimeout(1000);
    await page.getByLabel('Organization *').click();
    await page.getByLabel('Organization *').fill(Organization);
    await page.getByLabel('Name *').click();
    await page.getByLabel('Name *').fill(Name);
    await page.getByLabel('Constitution').locator('span').click();
    await page.getByRole('option', { name: Constitution }).click();
}
async function User_General_Info(page: Page, Organization: string, UserID: string, FName: string, LName: string) {
    await page.waitForTimeout(1000);
    await page.getByLabel('Organization  *').locator('span').click();
    await page.getByRole('option', { name: Organization }).click();
    await page.getByLabel('User ID *').fill(UserID);
    await page.getByLabel('First Name *').fill(FName);
    await page.getByLabel('Last Name').fill(LName);
    await page.locator('label').filter({ hasText: 'Authorize own transaction' }).click();
}
async function Contact_Info(page: Page, Type: string, Purpose: string, Reference: string) {
    await page.waitForTimeout(1000);
    await page.getByLabel('Type  *').locator('span').click();
    await page.getByRole('option', { name: Type }).click();
    await page.getByText('Purpose *').click();
    await page.getByRole('option', { name: Purpose }).click();
    await page.getByLabel('Reference *').click();
    await page.getByLabel('Reference *').fill(Reference);
    await page.getByRole('button', { name: 'Add' }).click();
}
async function Address_Info(page: Page, Purpose: string, City: string, Address: string, Pincode: string) {
    await page.waitForTimeout(1000);
    await page.getByLabel('Purpose  *').locator('span').click();
    await page.getByRole('option', { name: Purpose }).click();
    await page.getByLabel('City *').click();
    await page.getByLabel('City *').fill(City);
    await page.getByLabel('Address *').click();
    await page.getByLabel('Address *').fill(Address);
    await page.getByLabel('Country  *').locator('span').click();
    await page.getByRole('option', { name: 'India' }).click();
    await page.getByLabel('Pincode *').fill(Pincode);
    await page.getByRole('button', { name: 'Add' }).click();
}
async function Address_InfoUser(page: Page, Purpose: string, City: string, Address: string, Pincode: string) {
    await page.waitForTimeout(1000);
    await page.getByLabel('Purpose  *').locator('span').click();
    await page.getByRole('option', { name: Purpose }).click();
    await page.getByLabel('City *').click();
    await page.getByLabel('City *').fill(City);
    await page.getByLabel('Address *').click();
    await page.getByLabel('Address *').fill(Address);
    await page.getByLabel('Country  *').locator('span').click();
    await page.getByRole('option', { name: 'India' }).click();
    await page.getByLabel('Post Code *').fill(Pincode);
    await page.getByRole('button', { name: 'Add' }).click();
}
async function Search(page: Page, Search: string) {
    await page.goBack();
    await page.waitForTimeout(1000);
    await page.locator('button').filter({ hasText: 'search' }).click();
    await page.getByLabel('Organization').fill(Search);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForTimeout(1000);
    console.log(await page.locator("[class*='ABBV_NAME']").allTextContents());
}
async function Submit(page: Page) {
    await page.getByRole('button', { name: 'Submit' }).click();
    const yesButton = await page.$('button[name="Yes"]');
    if (yesButton) {
        await yesButton.click();
    } else {
        await page.locator("[class*='confirm']").click();
    }
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
    const okButton = page.locator('[class="swal2-confirm swal2-styled"]');
    if (await okButton.isVisible()) {
        await okButton.click();
        await page.close();
    } else {
        const [response] = await Promise.all([
            page.waitForResponse(re => re.url() === "http://192.168.1.49:8086/data-service/mutationService")
        ]);
        interface MyResponse {
            [x: string]: any;
            REFERENCE_ID: string;
        }
        const res: MyResponse = await response.json();
        console.log(res);
        RefID = res.REFERENCE_ID;
        const Status = res.statusCode;
        console.log(`Reference ID: ${RefID}`);
        console.log(`Status: ${Status}`);
    }
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
    await page.waitForTimeout(2000);
    await page.getByRole('heading', { name: 'Flows & Settings' }).click();
    await page.getByRole('button', { name: ' Master pending' }).click();
}
test('Test Case 21109: Verify that the middle office organization can be created', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Enrollment_Module(page);
    await page.getByRole('button', { name: ' Middle Office' }).click();
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await General_Info(page, 'FingressBank01', 'Bank01', 'Partnership');
    await page.locator("[class*='add-record-button']").nth(0).click();
    await Contact_Info(page, 'Contact', 'Billing', '1234567890');
    await page.locator("[class*='add-record-button']").nth(1).click();
    await Address_Info(page, 'Billing', 'Nellai', 'ABC123', '641104');
    await Submit(page);
});
test('Test Case 21244: Validate middle office organization can be search by custom criteria', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Enrollment_Module(page);
    await page.getByRole('button', { name: ' Middle Office' }).click();
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await Search(page, 'FINGRESS');
});
test('Test Case 21112: Verify that the middle office organization user can be submitted for approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Enrollment_Module(page);
    await page.getByRole('button', { name: ' Users ' }).click();
    await page.getByRole('menuitem', { name: 'Middle Office Users' }).click();
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await User_General_Info(page, 'ICICI BANK', '007', 'BSIT', 'BANK');
    await page.locator("[class*='add-record-button']").nth(0).click();
    await Contact_Info(page, 'Contact', 'Billing', '1234567890');
    await page.locator("[class*='add-record-button']").nth(1).click();
    await Address_Info(page, 'Billing', 'Nellai', 'ABC123', '641104');
    await Submit(page);
});
test('Test Case 21242: Validate middle office organization user approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fggroup', 'maker', '1234');
    await Enrollment_Module(page);
    await page.getByRole('button', { name: ' Users ' }).click();
    await page.getByRole('menuitem', { name: 'Middle Office Users' }).click();
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await User_General_Info(page, 'ICICI BANK', '007', 'BSIT', 'BANK');
    await page.locator("[class*='add-record-button']").nth(0).click();
    await Contact_Info(page, 'Contact', 'Billing', '1234567890');
    await page.locator("[class*='add-record-button']").nth(1).click();
    await Address_Info(page, 'Billing', 'Nellai', 'ABC123', '641104');
    await Submit(page);
});
test('Test Case 21115: Validate that the customer organization can be submitted  for approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Enrollment_Module(page);
    await page.getByRole('button', { name: ' Organizations' }).click();
    await page.locator('button').filter({ hasText: 'Add Customer' }).click();
    await General_Info(page, 'FingressBank02', 'Bank02', 'Partnership');
    await page.locator("[class*='add-record-button']").nth(1).click();
    await Contact_Info(page, 'Contact', 'Billing', '1234567890');
    await page.locator("[class*='add-record-button']").nth(2).click();
    await Address_InfoUser(page, 'Billing', 'Nellai', 'ABC123', '641104');
    await Submit(page);
});
test('Test Case 21259: Validate customer organization approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Enrollment_Module(page);
    await page.getByRole('button', { name: ' Organizations' }).click();
    await page.locator('button').filter({ hasText: 'Add Customer' }).click();
    await General_Info(page, 'FingressBank009', 'Bank009', 'Partnership');
    await page.locator("[class*='add-record-button']").nth(1).click();
    await Contact_Info(page, 'Contact', 'Billing', '1234567890');
    await page.locator("[class*='add-record-button']").nth(2).click();
    await Address_InfoUser(page, 'Billing', 'Nellai', 'ABC123', '641104');
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await expect(page.getByText(`${RefID}`)).toBeVisible();
    const entity = await page.locator('td[class*="ENTITY_REF"]').allTextContents();
    for (let i = 0; i < entity.length; i++) {
        if (entity[i].includes(RefID)) {
            await page.locator('td[class*="ACTIONS"]').nth(i).getByText('Approve').click();
            await page.getByRole('button', { name: 'Approve' }).click();
            break;
        }
    } await page.waitForTimeout(10000);
    await expect(page.getByText(`${RefID}`)).not.toBeVisible();
    if (await page.getByText(`${RefID}`).isHidden()) {
        console.log('Layout is approved in the master pending');
    } else {
        console.log('Layout is not approved in the master pending');
    }
});
test('Test Case 21119: Validate that the customer organization user can be submitted for approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Enrollment_Module(page);
    await page.getByRole('button', { name: ' Users ' }).click();
    await page.getByRole('menuitem', { name: 'Organization Users' }).click();
    await page.locator('button').filter({ hasText: 'Add User' }).click();
    await User_General_Info(page, 'BSITSELVA', '007', 'BSIT', 'BANK');
    await page.locator("[class*='add-record-button']").nth(0).click();
    await Contact_Info(page, 'Contact', 'Billing', '1234567890');
    await page.locator("[class*='add-record-button']").nth(1).click();
    await Address_InfoUser(page, 'Billing', 'Nellai', 'ABC123', '641104');
    await Submit(page);
});
test('Test Case 21264: Validate customer organization user approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await Enrollment_Module(page);
    await page.getByRole('button', { name: ' Users ' }).click();
    await page.getByRole('menuitem', { name: 'Organization Users' }).click();
    await page.locator('button').filter({ hasText: 'Add User' }).click();
    await User_General_Info(page, 'BSITSELVA', '007', 'BSIT', 'BANK');
    await page.locator("[class*='add-record-button']").nth(0).click();
    await Contact_Info(page, 'Contact', 'Billing', '1234567890');
    await page.locator("[class*='add-record-button']").nth(1).click();
    await Address_InfoUser(page, 'Billing', 'Nellai', 'ABC123', '641104');
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await expect(page.getByText(`${RefID}`)).toBeVisible();
    const entity = await page.locator('td[class*="ENTITY_REF"]').allTextContents();
    for (let i = 0; i < entity.length; i++) {
        if (entity[i].includes(RefID)) {
            await page.locator('td[class*="ACTIONS"]').nth(i).getByText('Approve').click();
            await page.getByRole('button', { name: 'Approve' }).click();
            break;
        }
    } await page.waitForTimeout(10000);
    await expect(page.getByText(`${RefID}`)).not.toBeVisible();
    if (await page.getByText(`${RefID}`).isHidden()) {
        console.log('Layout is approved in the master pending');
    } else {
        console.log('Layout is not approved in the master pending');
    }
});
