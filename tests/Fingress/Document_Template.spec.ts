import { test, expect, Page, chromium, Browser, BrowserContext } from '@playwright/test';
let baseURL = 'http://192.168.1.49:8086/';
let browser: Browser;
let context: BrowserContext;
let page: Page;
test.beforeEach(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await DocTemp_Module(page);
})
test.afterEach(async () => {
    await page.close();
    await context.close();
    await browser.close();
})
async function Maker_login(page: Page, domainId: string, loginId: string, password: string) {
    await page.locator('#toolbar-logout').getByRole('button').click();
    await page.getByRole('button', { name: 'Login ' }).click();
    await page.getByPlaceholder('Domain Id').fill(domainId);
    await page.getByPlaceholder('Login Id').fill(loginId);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
}
async function DocTemp_Module(page: Page) {
    await page.getByRole('heading', { name: 'System Configurations' }).click();
    await page.getByText('Document Templates').click();
}
async function ModelField(page: Page, modelName: string) {
    await page.waitForTimeout(30000);
    await page.waitForLoadState('domcontentloaded');
    await page.getByLabel('Model  *').locator('span').click();
    await page.getByText(modelName, { exact: true }).click();
}
async function PurposeField(page: Page, printPurpose: string): Promise<void> {
    await page.waitForTimeout(1000);
    await page.getByText('Print Purpose *').click();
    await page.locator('[id*="mat-option"]').getByText(printPurpose).click();
}
async function RenderTypeField(page: Page, renderType: string): Promise<void> {
    await page.waitForTimeout(1000);
    await page.getByText('HTML Render Type *').click();
    await page.getByRole('option', { name: renderType }).click();
}
async function submit(page: Page): Promise<string> {
    await page.click("(//button[@type='button'])[4]", { position: { x: 40, y: 30 } });
    await page.getByRole('button', { name: 'Yes' }).click();
    const [response] = await Promise.all([
        page.waitForResponse(re => re.url() === "http://192.168.1.49:8086/data-service/mutationService")
    ]);
    interface MyResponse {
        REFERENCE_ID: string;
    }
    const res: MyResponse = await response.json();
    const id: string = res.REFERENCE_ID;
    console.log(`Reference ID: ${id}`);
    return id;
}
async function Maker_logout(page: Page) {
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
test('Test Case 21037: Validate the attributes of template design for any specific products', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'General');
    await RenderTypeField(page, 'Dynamic Form');
    const referenceId = await submit(page);
});
test('Test Case 21038: Validate that designing the templates based on the different types', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Print');
    await RenderTypeField(page, 'Dynamic Form');
    const referenceId = await submit(page);
});
test('Test Case 21275: Validate document template can be searched by custom criteria', async () => {
    await page.locator('button').filter({ hasText: 'search' }).click();
    await page.getByLabel('Name').fill('AAA');
    //await page.getByLabel('Entity').fill('Solution');
    await page.getByRole('button', { name: 'Search' }).click();
    console.log(await page.locator('[role="rowgroup"]').nth(1).innerText());
});
test('Test Case 21274: Validate that the document templates can be modified', async () => {
    await page.locator('td:nth-child(6)').first().click();
    await page.getByLabel('Name *').fill('AAA');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Print');
    await RenderTypeField(page, 'HTML');
    await page.waitForTimeout(30000);
    const referenceId = await submit(page);
});
test('Test Case 21276: Validate document templates can be exported as pdf or excel', async () => {
    await page.locator('button').filter({ hasText: 'cloud_download' }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: 'pdf' }).click();
    const download = await downloadPromise;
    await page.locator('button').filter({ hasText: 'cloud_download' }).click();
    const download1Promise = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: 'xls' }).click();
    const download1 = await download1Promise;
});
test('Test Case 21717: Validate that HTML based document template is defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Print');
    await RenderTypeField(page, 'HTML');
    const referenceId = await submit(page);
});
test('Test Case 21718: Validate based on the cover letter purpose with dynamic form using Freemarker template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Cover Letter');
    await RenderTypeField(page, 'Dynamic Form');
    expect(await page.getByText('Free Marker').click());
    const referenceId = await submit(page);
});
test('Test Case 21729: Validate based on the cover letter purpose with HTML using thymeleaf template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Cover Letter');
    await RenderTypeField(page, 'HTML');
    expect(await page.getByText('Thymeleaf').click());
    const referenceId = await submit(page);
});
test('Test Case 21719: Validate based on the report purpose with thymeleaf template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Report');
    await RenderTypeField(page, 'HTML');
    expect(await page.getByText('Thymeleaf').click());
    const referenceId = await submit(page);
});
test('Test Case 21720: Validate based on the report purpose with Freemarker template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Report');
    await RenderTypeField(page, 'HTML');
    expect(await page.getByText('Free marker').click());
    const referenceId = await submit(page);
});
test('Test Case 21721: Validate based on the general purpose and HTML rendering type with thymeleaf template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'General');
    await RenderTypeField(page, 'HTML');
    expect(await page.getByText('Thymeleaf').click());
    const referenceId = await submit(page);
});
test('Test Case 21722: Validate based on the general purpose and dynamic form rendering with Freemarker template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'General');
    await RenderTypeField(page, 'Dynamic Form');
    expect(await page.getByText('Free Marker').click());
    const referenceId = await submit(page);
});
test('Test Case 21723: Validate based on the Advice purpose with HTML rendering and thymeleaf template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Advice');
    await RenderTypeField(page, 'HTML');
    expect(await page.getByText('Thymeleaf').click());
    const referenceId = await submit(page);
});
test('Test Case 21724: Validate based on the Advice purpose with Dynamic form and Freemarker template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Advice');
    await RenderTypeField(page, 'Dynamic Form');
    expect(await page.getByText('Free Marker').click());
    const referenceId = await submit(page);
});
test('Test Case 21744: Validate based on the Advice purpose with schema form rendering type for freemarker template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Advice');
    await RenderTypeField(page, 'Schema form');
    expect(await page.getByText('Free Marker').click());
    const referenceId = await submit(page);
});
test('Test Case 21728: Validate based on the advice purpose with dynamic form rendering using document can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Advice');
    await RenderTypeField(page, 'Dynamic Form');
    expect(await page.getByText('Docx').click());
    const referenceId = await submit(page);
});
test('Test Case 21725: Validate based on the print purpose and dynamic form with thymeleaf template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Print');
    await RenderTypeField(page, 'Dynamic Form');
    expect(await page.getByText('Thymeleaf').click());
    const referenceId = await submit(page);
});
test('Test Case 21726: Validate based on the print purpose and dynamic form rendering with Freemarker template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, ' print');
    await RenderTypeField(page, 'Dynamic Form');
    expect(await page.getByText('Free Marker').click());
    const referenceId = await submit(page);
});
test('Test Case 21730: Validate based on the transaction summary purpose with schema form using Freemarker template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Transaction Summary');
    await RenderTypeField(page, 'Schema form');
    expect(await page.getByText('Free Marker').click());
    const referenceId = await submit(page);
});
test('Test Case 21731: Validate based on the transaction summary purpose with dynamic form using Freemarker template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Transaction Summary');
    await RenderTypeField(page, 'Dynamic Form');
    expect(await page.getByText('Free Marker').click());
    const referenceId = await submit(page);
});
test('Test Case 21732: Validate based on the transaction summary purpose with HTML using thymeleaf template can be defined', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress123');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Transaction Summary');
    await RenderTypeField(page, 'HTML');
    expect(await page.getByText('Thymeleaf').click());
    const referenceId = await submit(page);
});
test('Test Case 21749: Validate the approval of created document templates', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress002');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Transaction Summary');
    await RenderTypeField(page, 'HTML');
    expect(await page.getByText('Thymeleaf').click());
    const referenceId = await submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await expect(page.getByText(`${referenceId}`).nth(0)).toBeVisible();
    const entity = await page.locator('td[class*="ENTITY_REF"]').allTextContents();
    for (let i = 0; i < entity.length; i++) {
        if (entity[i].includes(referenceId)) {
            await page.locator('td[class*="ACTIONS"]').nth(i).getByText('Approve').click();
            await page.getByRole('button', { name: 'Approve' }).click();
            break;
        }
    } await page.waitForTimeout(10000);
    await expect(page.getByText(`${referenceId}`)).not.toBeVisible();
    if (await page.getByText(`${referenceId}`).isHidden()) {
        console.log('Layout is approved in the master pending');
    } else {
        console.log('Layout is not approved in the master pending');
    }
});
test('Test Case 21750: Validate the rejection of created document templates', async () => {
    await page.locator('button').filter({ hasText: 'add_circle' }).click();
    await page.getByLabel('Name *').fill('Fingress001');
    await ModelField(page, 'Solution ');
    await PurposeField(page, 'Transaction Summary');
    await RenderTypeField(page, 'HTML');
    expect(await page.getByText('Thymeleaf').click());
    const referenceId = await submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await expect(page.getByText(`${referenceId}`).nth(0)).toBeVisible();
    const entity = await page.locator('td[class*="ENTITY_REF"]').allTextContents();
    for (let i = 0; i < entity.length; i++) {
        if (entity[i].includes(referenceId)) {
            await page.locator('td[class*="ACTIONS"]').nth(i).getByText('Return').click();
            await page.getByRole('button', { name: 'Return' }).click();
            break;
        }
    } await page.waitForTimeout(10000);
    await expect(page.getByText(`${referenceId}`)).not.toBeVisible();
    if (await page.getByText(`${referenceId}`).isHidden()) {
        console.log('Layout is Rejected in the master pending');
    } else {
        console.log('Layout is not Rejected in the master pending');
    }
});