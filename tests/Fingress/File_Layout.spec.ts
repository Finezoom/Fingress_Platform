import { test, expect, Page } from '@playwright/test';
let RefID = "LAY20240129753730";
let baseURL = 'http://192.168.1.49:8086/launcher'
async function Maker_login(page: Page, domainId: string, loginId: string, password: string) {
    await page.locator('#toolbar-logout').getByRole('button').click();
    await page.getByRole('button', { name: 'Login ' }).click();
    await page.getByPlaceholder('Domain Id').fill(domainId);
    await page.getByPlaceholder('Login Id').fill(loginId);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
}
async function FileLayout_Module(page: Page) {
    await page.getByRole('heading', { name: 'System Configurations' }).click();
    await page.getByRole('button', { name: ' Uploads' }).click();
    await page.getByText('Layout Designer').click();
    await page.waitForTimeout(2000);
    const ele = page.locator("(//button[@mattooltip='Add new layout'])[1]");
    await ele.click({ position: { x: 40, y: 20 } });
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
async function Submit(page: Page) {
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
    const okButton = page.locator('[class="swal2-confirm swal2-styled"]');
    if (await okButton.isVisible()) {
        await okButton.click();
        await page.close();
    } else {
        const [response] = await Promise.all([
            page.waitForResponse(re => re.url() === "http://192.168.1.49:8086/data-service/fgLayoutTemplate")
        ]);
        const res = await response.json();
        RefID = res[0].referenceId; const Version = res[0].versionId; const StatusCode = res[0].statusCode;
        console.log(`Reference ID: ${RefID}`);
        console.log(`version id: ${Version}`);
        console.log(`StatusCode: ${StatusCode}`);
    }
}
async function DetailTab(page: Page, Typecode: string, Purpose: string, Type: string, nameValue: string): Promise<void> {
    await page.getByText('Entity Type Code *').click();
    await page.getByText(Typecode).click();
    await page.getByLabel('Layout Name *').click();
    await page.getByLabel('Layout Name *').fill(nameValue);
    await page.getByLabel('Purpose  *').locator('span').click();
    await page.getByRole('option', { name: Purpose }).click();
    await page.getByText('File Type *').click();
    await page.getByRole('option', { name: Type }).click();
}
async function Delimited(page: any, Delimeter: string): Promise<void> {
    await page.getByText(', Delimiter').click();
    await page.getByRole('option', { name: Delimeter }).click();
}
async function Option(page: Page, optionName: string): Promise<void> {
    await page.getByLabel('Active').getByText('Active').click();
    await page.getByRole('option', { name: optionName }).nth(0).click();
}
async function RecordTypetab(page: Page) {
    await page.getByRole('tab', { name: 'Record Types' }).click();
    await page.getByText('Invoices', { exact: true }).first().click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
}
async function Mul_RecordTypetab(page: Page) {
    await page.getByRole('tab', { name: 'Record Types' }).click();
    await page.getByText('Invoices', { exact: true }).first().click();
    await page.getByText('Line Item', { exact: true }).click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
}
async function Recordtype_Reorder(page: Page) {
    await page.getByRole('tab', { name: 'Record Types' }).click();
    await page.getByText('Invoices', { exact: true }).first().click();
    await page.getByText('Line Item', { exact: true }).click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    await page.getByText('Invoices').click();
    await page.locator('button').filter({ hasText: 'arrow_upward' }).click();
    await page.locator('button').filter({ hasText: 'arrow_downward' }).click();
}
async function RecordGroupTab(page: Page, recordGroupName: string, layoutOption: string, minOccur: string, maxOccur: string): Promise<void> {
    await page.getByText('Record Group').click();
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByLabel('Name *').fill(recordGroupName);
    await page.getByLabel('Layout Group  *').locator('span').click();
    await page.getByRole('option', { name: layoutOption }).click();
    await page.locator('.cdk-overlay-container > div:nth-child(3)').click();
    await page.getByLabel('Min Occur *').fill(minOccur);
    await page.getByLabel('Max Occur *').fill(maxOccur);
    await page.locator("[class*='mat-button-disabled']").click();
}
async function RecordIndicator(page: Page) {
    await page.getByRole('tab', { name: 'Design' }).click();
    await page.locator("[class*='arrow-wrapper']").click();
    await page.locator("[class*='mat-option-text']").getByText('Invoices').click();
    await page.getByPlaceholder('Record Indicator').fill('H');
    await page.locator("[class*='arrow-wrapper']").click();
    await page.locator("[class*='mat-option-text']").getByText('Line Item').click();
    await page.getByPlaceholder('Record Indicator').fill('P');
}
async function Mul_Designtab(page: Page) {
    await page.getByRole('tab', { name: 'Design' }).click();
    await page.locator("[class*='arrow-wrapper']").click();
    await page.locator("[class*='mat-option-text']").getByText('Invoices').click();
    await page.getByText('Id', { exact: true }).click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    await page.locator("[class*='arrow-wrapper']").click();
    await page.locator("[class*='mat-option-text']").getByText('Line Item').click();
    await page.getByText('Name').click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
}
async function CustomField(page: Page) {
    await page.getByRole('tab', { name: 'Design' }).click();
    await page.locator("[class*='arrow-wrapper']").click();
    await page.locator("[class*='mat-option-text']").getByText('Invoices').click();
    await page.getByText('Id', { exact: true }).click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    await page.locator('label').filter({ hasText: 'Generate Custom Fields' }).click();
    await page.getByText('Custom Field1', { exact: true }).click();
    await page.getByText('Custom Field2').click();
    await page.getByText('Custom Field3').click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
}
async function MulFields(page: Page) {
    await page.getByRole('tab', { name: 'Design' }).click();
    await page.locator("[class*='arrow-wrapper']").click();
    await page.locator("[class*='mat-option-text']").getByText('Invoices').click();
    await page.getByText('Id', { exact: true }).click();
    await page.getByText('Reference #').click();
    await page.getByText('Type Code').click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
}
async function Designtab(page: Page) {
    await page.getByRole('tab', { name: 'Design' }).click();
    await page.locator("[class*='arrow-wrapper']").click();
    await page.locator("[class*='mat-option-text']").getByText('Invoices').click();
    await page.getByText('Id', { exact: true }).click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
}
async function EncryptedData(page: Page) {
    await page.goBack();
    await page.waitForTimeout(5000);
    const rows = await page.locator('//table//tr').all();
    for (let i = 0; i < rows.length; i++) {
        const cellText = await page.locator('td[class*="column-status"]').nth(i).textContent();
        if (cellText?.includes('Approved')) {
            await page.locator('[mattooltip="View existing layout"]').nth(i).click();
            break;
        }
    }
    await page.getByRole('tab', { name: 'Associations' }).click();
    await page.getByText('edit').first().click();
    await page.locator('label').filter({ hasText: 'Encryption' }).click();
    await page.getByLabel('Algorithm').locator('span').click();
    await page.getByText('AES-128').click();
    await page.getByLabel('Secret Key *').fill('Abc@123');
    await page.getByRole('button', { name: 'Submit' }).click();
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
}
async function Association(page: Page) {
    await page.goBack();
    await page.waitForTimeout(5000);
    const rows = await page.locator('//table//tr').all();
    for (let i = 0; i < rows.length; i++) {
        const cellText = await page.locator('td[class*="column-status"]').nth(i).textContent();
        if (cellText?.includes('Approved')) {
            await page.locator('[mattooltip="View existing layout"]').nth(i).click();
            break;
        }
    }
    await page.getByRole('tab', { name: 'Associations' }).click();
    await page.getByRole('button', { name: 'Link', exact: true }).click();
    await page.locator('#mat-checkbox-27').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
    await page.waitForTimeout(5000);
    console.log(await page.locator('[class*=column-name]').allTextContents());
    console.log(await page.locator('[class*=column-statusCode]').allTextContents());
}
async function Disassociation(page: Page) {
    await page.goBack();
    await page.waitForTimeout(5000);
    const rows = await page.locator('//table//tr').all();
    for (let i = 0; i < rows.length; i++) {
        const cellText = await page.locator('td[class*="column-status"]').nth(i).textContent();
        if (cellText?.includes('Approved')) {
            await page.locator('[mattooltip="View existing layout"]').nth(i).click();
            break;
        }
    } await page.getByRole('tab', { name: 'Associations' }).click();
    await page.locator('#mat-checkbox-32').click();
    await page.locator('#mat-checkbox-33').click();
    await page.getByRole('button', { name: 'Unlink' }).click();
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
    console.log(await page.locator('[class*=column-name]').allTextContents());
    console.log(await page.locator('[class*=column-statusCode]').allTextContents());
}

test('Test Case 14103: Verify that the input layout with text format can be submitted for approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await page.locator('#mat-radio-2').click();
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
});
test('Test Case 13649: Verify that the user can define a layout for XLSX files', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'xlsx')
    await page.locator('#mat-radio-2').click();
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
});
test('Test Case 21097: Validate that the customer can be associated to the file layout', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await page.waitForTimeout(2000);
    await Association(page);
});
test('Test Case 13646: Validate that the customer can be disassociated from the file layout', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await page.waitForTimeout(2000);
    await Disassociation(page);
});
test('Test Case 13647: Validate the multi band layout creation', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await page.locator('#mat-radio-2').click();
    await Mul_RecordTypetab(page);
    await Mul_Designtab(page);
    await Submit(page);
});
test('Test Case 13648: Validate that the file layout can be created with partial file processing', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await page.locator('#mat-radio-2').click();
    await page.getByText('Allow Partial File Processing').click();
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
});
test('Test Case 21537: Verify that the user can define layout for any delimiter with single character for a data file', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await page.locator('#mat-radio-2').click();
    await Delimited(page, ',')
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
});
test('Test Case 21538: Verify that the user can define a layout for CSV files', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'csv')
    await page.locator('#mat-radio-2').click();
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
});
test('Test Case 21539: Verify that the user can define a layout pipe (|) delimited files', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'csv')
    await page.locator('#mat-radio-2').click();
    await Delimited(page, '|')
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
});
test('Test Case 21540: Verify that the file layout defined with file header section', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'csv')
    await page.locator('#mat-radio-2').click();
    await page.getByText('File Header').click();
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
});
test('Test Case 21541: Verify that the file layout defined with the file footer section', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'csv')
    await page.locator('#mat-radio-2').click();
    await page.getByRole('tab', { name: 'Record Types' }).click();
    await page.locator('label').filter({ hasText: 'Show Linked/Default Record' }).click();
    await page.getByRole('option', { name: 'File Trailer' }).locator('mat-pseudo-checkbox').click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    await page.getByRole('tab', { name: 'Design' }).click();
    await page.getByLabel('File Bands').locator('span').click();
    await page.getByText('File Trailer').click();
    await Submit(page);
});
test('Test Case 21542: Verify that the file layout defined with the Transaction header section', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'csv')
    await page.locator('#mat-radio-2').click();
    await page.getByRole('tab', { name: 'Record Types' }).click();
    await page.locator('label').filter({ hasText: 'Show Linked/Default Record' }).click();
    await page.getByRole('option', { name: 'Transaction Header' }).locator('mat-pseudo-checkbox').click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    await page.getByRole('tab', { name: 'Design' }).click();
    await page.getByLabel('File Bands').locator('span').click();
    await page.getByText('Transaction Header').click();
    await Submit(page);
});
test('Test Case 21543: Verify that the file layout defined the Transaction trailer section', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'csv')
    await page.locator('#mat-radio-2').click();
    await page.getByRole('tab', { name: 'Record Types' }).click();
    await page.locator('label').filter({ hasText: 'Show Linked/Default Record' }).click();
    await page.getByRole('option', { name: 'Transaction Trailer' }).locator('mat-pseudo-checkbox').click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    await page.getByRole('tab', { name: 'Design' }).click();
    await page.getByLabel('File Bands').locator('span').click();
    await page.getByText('Transaction Trailer').click();
    await Submit(page);
});
test('Test Case 21544: Verify that the file layout defined with the advise section for a record band', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'csv')
    await page.locator('#mat-radio-2').click();
    await page.getByRole('tab', { name: 'Record Types' }).click();
    await page.locator('label').filter({ hasText: 'Show Linked/Default Record' }).click();
    await page.getByRole('option', { name: 'Advise Record' }).locator('mat-pseudo-checkbox').click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    await page.getByRole('tab', { name: 'Design' }).click();
    await page.getByLabel('File Bands').locator('span').click();
    await page.getByText('Advise Record').click();
    await Submit(page);
});
test('Test Case 21545: Verify that the file layout defined with the advise header section', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'csv')
    await page.locator('#mat-radio-2').click();
    await page.getByRole('tab', { name: 'Record Types' }).click();
    await page.locator('label').filter({ hasText: 'Show Linked/Default Record' }).click();
    await page.getByRole('option', { name: 'Advise Header' }).locator('mat-pseudo-checkbox').click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    await page.getByRole('tab', { name: 'Design' }).click();
    await page.getByLabel('File Bands').locator('span').click();
    await page.getByText('Advise Header').click();
    await Submit(page);
});
/*test('Test Case 21546: Verify that the file layout defined with the advise footer section', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page,'Invoices','Bank01','Beneficiary','txt')
    await page.locator('#mat-radio-2').click();
    await FileType(page, 'txt');
    await page.getByRole('tab', { name: 'Record Types' }).click();
    await page.locator('label').filter({ hasText: 'Show Linked/Default Record' }).click();
    await page.getByRole('option', { name: 'Advise Footer' }).locator('mat-pseudo-checkbox').click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    await page.getByRole('tab', { name: 'Design' }).click();
    await page.getByLabel('File Bands').locator('span').click();
    await page.getByText('Advise Footer').click();
    //await Submit(page);
});*/
test('Test Case 21547: Verify that the user can define the record groups for multiple record sections', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await page.locator('#mat-radio-2').click();
    await Delimited(page, ',')
    await Mul_RecordTypetab(page);
    await RecordGroupTab(page, 'Name1', 'Invoices', '0', '10');
    await RecordGroupTab(page, 'Name2', 'Line Item', '0', '10');
    await Designtab(page);
    await Submit(page);
});
test('Test Case 21548: Verify that the user can define the order of the sections within the record group', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await page.locator('#mat-radio-2').click();
    await Delimited(page, ',')
    await RecordTypetab(page);
    await RecordGroupTab(page, 'Name1', 'Invoices', '0', '10');
    await RecordGroupTab(page, 'Name2', 'Line Item', '0', '10');
    await page.getByText('arrow_upward').nth(1).click();
    await Designtab(page);
    await Submit(page);
});
test('Test Case 21549: Verify that the user can define a layout for fixed length data file', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await Option(page, 'Forgot Password');
    await page.locator('#mat-radio-2').click();
    await page.getByText('Fixed Size').click();
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
});
test('Test Case 21550: Verify that multiple file layouts defined for the data model', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await Option(page, 'Active');
    await page.locator('#mat-radio-2').click();
    await page.getByText('Fixed Size').click();
    await Mul_RecordTypetab(page);
    await Mul_Designtab(page);
    await Submit(page);
});
test('Test Case 21551: Verify that the layout name for a data model is unique with in the organization scope', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await Option(page, 'Active');
    await page.locator('#mat-radio-2').click();
    await page.getByText('Fixed Size').click();
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
});
test('Test Case 21552: Verify that the valid list of file extensions can be defined for the file layout based on model', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'xls/xlsx')
    await Option(page, 'Active');
    await page.locator('#mat-radio-2').click();
    await Designtab(page);
    await RecordTypetab(page);
    await Submit(page);
});
test('Test Case 21553: Verify that the layout for the encrypted data file can be defined with the encryption algorithm', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'xls/xlsx')
    await Option(page, 'Active');
    await page.locator('#mat-radio-2').click();
    await page.locator('label').filter({ hasText: 'Encryption' }).click();
    await page.getByLabel('Algorithm').locator('span').click();
    await page.getByText('AES-128').click();
    await page.getByLabel('Secret Key').fill('Abc@007');
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
});
test('Test Case 22961: Verify that the layout for the encrypted data file can be defined with the encryption algorithm to the customer', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await page.waitForTimeout(2000);
    await EncryptedData(page);
});
// test('Test Case 21554: Verify that the encryption public and private keys can be set for the layout', async ({ page }) => {
//     await page.goto(baseURL);
//     await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
//     await FileLayout_Module(page);
// });
test('Test Case 21555: Verify that the file layout sections can be re-ordered', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await Recordtype_Reorder(page);
    await Designtab(page);
    await Submit(page);
});
// test('Test Case 21556: Verify that the fields for a specific section is available for ordering once the section are part of the file layout', async ({ page }) => {
//     await page.goto(baseURL);
//     await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
//     await FileLayout_Module(page);
//     await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
//     await RecordTypetab(page);
//     await Designtab(page);
//     await Submit(page);
// });
test('Test Case 21557: Verify that the user can define any number of custom fields to a specific section', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await CustomField(page);
    await Submit(page);
});
test('Test Case 21558: Verify that the user can choose a set of fields from the section as part of the layout', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await MulFields(page);
    await Submit(page);
});
test('Test Case 21559: Verify that the user can re-order the fields in the specific section of the layout', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await MulFields(page);
    await page.getByText('Reference #').click();
    await page.locator('button').filter({ hasText: 'arrow_upward' }).click();
    await page.getByText('Type Code').click();
    await page.locator('button').filter({ hasText: 'arrow_upward' }).click();
    await Submit(page);
});
test('Test Case 21560: Verify that the fields associated to the section can be removed in the layout', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await MulFields(page);
    await page.getByText('Remove').click();
    await page.getByText('Reference #').click();
    await page.getByText('Type Code').click();
    await page.locator('button').filter({ hasText: 'arrow_back' }).click();
    await Submit(page);
});
test('Test Case 21561: Verify that the fields in the record or section set to ignore to avoid field validations.', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await Designtab(page);
    await page.getByText('Id', { exact: true }).click();
    await page.locator('label').filter({ hasText: 'Required' }).click();
    await Submit(page);
});
test('Test Case 21562: Verify that the record indicator as one of the field can be set for the section in the layout', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await Mul_RecordTypetab(page);
    await RecordIndicator(page);
    await Submit(page);
});
test('Test Case 21564: Verify that the field format can be set as regular expression for any section', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await Designtab(page);
    await page.getByText('Id', { exact: true }).click();
    await page.getByLabel('RegEx').click();
    await page.getByPlaceholder('Reg Ex').fill('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b\n');
    await Submit(page);
});
test('Test Case 21565: Verify that the date format can be set for the date/datetime fields in the section', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await Designtab(page);
    await page.getByText('Due Date').click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    await page.getByText('Due Date').click();
    await page.getByText('Format').click();
    await page.getByText('dd-MM-yy', { exact: true }).click();
    await Submit(page);
});
test('Test Case 21598: Verify that the submitted layouts available in the approval queue for processing', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    const refIDElement = page.locator(`${RefID}`);
    if (await refIDElement.isVisible()) {
        console.log('Submitted layout available in the approval queue');
    } else {
        console.log('Submitted layout not available in the approval queue');
    }
});
test('Test Case 21599: Verify that the layout is amended for changes and submitted for approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await page.goBack();
    await page.waitForTimeout(5000);
    const statuscode = await page.locator("td[class*='status']").allTextContents();
    for (let i = 0; i < statuscode.length; i++) {
        if (statuscode[i].includes('Approved')) {
            await page.getByText('edit').nth(i).click();
            break;
        }
    } await page.getByLabel('Layout Name *').fill('ABC');
    await page.locator('#mat-select-value-19').click();
    await page.getByText('csv').click();
    await page.locator('#mat-select-value-13').click();
    await page.getByText('Export').click();
    await Submit(page);
});
test('Test Case 21600: Verify that the amendment or version history is available for the layout', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await page.goBack();
    await page.waitForTimeout(5000);
    const statuscode = await page.locator("td[class*='status']").allTextContents();
    for (let i = 0; i < statuscode.length; i++) {
        if (statuscode[i].includes('Approved')) {
            await page.getByText('edit').nth(i).click();
            break;
        }
    } await page.getByLabel('Layout Name *').fill('ABC');
    await page.locator('#mat-select-value-19').click();
    await page.getByText('xls', { exact: true }).click();
    await page.locator('#mat-select-value-13').click();
    await page.getByText('Export').click();
    await Submit(page);
});
test('Test Case 21601: Verify that the activity history for a specific layout', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
});
test('Test Case 21602: Verify that the approver can approve the layout submitted', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await Designtab(page);
    await Submit(page);
    await Maker_logout(page);
    await Checker_login(page);
    await Master_Pending(page);
    await expect(page.getByText(`${RefID}`)).toBeVisible();
    const entity = await page.locator('td[class*="ENTITY_REF"]').allTextContents();
    for (let i = 0; i < entity.length; i++) {
        if (entity[i].includes(RefID)) {
            await page.locator('td[class*="ACTIONS"]').nth(i).getByText('Approve').click();
            break;
        }
    }
    await page.getByRole('button', { name: 'Approve' }).click();
    await expect(page.getByText(`${RefID}`)).not.toBeVisible();
    if (await page.getByText(`${RefID}`).isHidden()) {
        console.log('Layout is approved in the master pending');
    } else {
        console.log('Layout is not approved in the master pending');
    }
});
test('Test Case 21603: Verify that the approver can return the revision submitted for approval with the reason and the comments', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await Designtab(page);
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
test('Test Case 21609: Verify that the layouts can saved in drafts state', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await page.goBack();
    await page.waitForTimeout(5000);
    const statuscode = await page.locator("td[class*='status']").allTextContents();
    for (let i = 0; i < statuscode.length; i++) {
        if (statuscode[i].includes('Pending')) {
            await page.locator("[mattooltip='Edit existing layout']").nth(i).getByText('edit').click();
            break;
        }
    } await page.locator('#mat-select-value-19').click();
    await page.getByText('xls', { exact: true }).click();
    await page.locator('#mat-select-value-13').click();
    await page.getByText('Export').click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
});
test('Test Case 21610: Verify that the layouts in drafts state can be submitted for approval', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    const statuscode = await page.locator("td[class*='status']").allTextContents();
    for (let i = 0; i < statuscode.length; i++) {
        if (statuscode[i].includes('Pending')) {
            await page.getByText('Pending').nth(i).click();
            break;
        }
    } await page.locator('#mat-select-value-19').click();
    await page.getByText('xls', { exact: true }).click();
    await page.locator('#mat-select-value-13').click();
    await page.getByText('Export').click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    console.log(await page.locator('[id="swal2-html-container"]').textContent());
});
test('Test Case 27541: Verify that the file layout designer has configuration to set the minor and major units for decimal datatype', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await Designtab(page);
    await page.getByText('Amount', { exact: true }).click();
    await page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    await page.getByText('Amount', { exact: true }).click();
    await page.getByLabel('Format  *').fill('5000.00');
    await page.getByLabel('Major Units  *').fill('4');
    await page.getByLabel('Minor Units *').fill('2');
    await Submit(page);
});
test('Test Case 27546: Verify that the fixed size file layout has maximum length configurations for the decimal datatype', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await DetailTab(page, 'Invoices', 'Bank01', 'Beneficiary', 'txt')
    await RecordTypetab(page);
    await Designtab(page);
    await page.getByText('Id', { exact: true }).click();
    await page.getByLabel('Min Length').fill('0');
    await page.getByLabel('', { exact: true }).fill('300');
    await Submit(page);
});
test('Test Case 30287: Verify that in the layout designer list page "copy existing layout" action copies the layout template with the same data ', async ({ page }) => {
    await page.goto(baseURL);
    await Maker_login(page, 'fingress', 'maker', 'Fin@1234');
    await FileLayout_Module(page);
    await page.pause();
});