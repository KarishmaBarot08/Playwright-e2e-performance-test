import { test, Page, Browser, BrowserContext } from '@playwright/test';
import UtilMethods from '../utils/utilityMethods'

// Variables for browser, context, page, and utility methods
let browser: Browser;
let context: BrowserContext;
let page: Page;
let util: UtilMethods;

// Setup before all tests: initialize browser, context, and page, and create an instance of utility methods
test.beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    context = await browser.newContext();
    page = await context.newPage();
    util = new UtilMethods(page);
});

// Teardown after all tests: close context and browser
test.afterAll(async () => {
    await context.close();
    await browser.close();
});

test.describe('Image Links Validation', () => {
    test('Validate SVG Image Links', async () => {
        test.setTimeout(360000);

        await util.navigateURL();
        const srcLIST = await util.getSRCsFromElements('s-image-resized__img--svg');
        await util.makeSRCRequests(srcLIST);
    });

    test('Validate Image Element Links', async () => {
        test.setTimeout(360000);

        await util.navigateURL();
        const srcLIST = await util.getSRCsFromElements('s-image-resized__root');
        await util.makeSRCRequests(srcLIST);
    });
});
