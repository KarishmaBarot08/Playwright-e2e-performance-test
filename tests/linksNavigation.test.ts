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

test.describe('Tests for Link Navigation', () => {
    test('Internal Navigation Links Validation', async () => {
        test.setTimeout(360000); // Set timeout for the test

        // Navigate to base URL
        await util.navigateURL();

        // Get all href attributes for internal links and validate their responses
        const hrefLIST = await util.getHREFsfromAnchorTag('nav-link__root--link-internal');
        await util.makeHREFRequests(hrefLIST);
    });

    test('External Navigation Links Validation', async () => {
        test.setTimeout(360000);

        // Navigate to base URL
        await util.navigateURL();

        // Get all href attributes for external links and validate their responses
        const hrefLIST = await util.getHREFsfromAnchorTag('nav-link__root--link-external');
        await util.makeHREFRequests(hrefLIST);
    });

    test('Advert Skip Links Validation', async () => {
        test.setTimeout(360000);

        // Navigate to base URL
        await util.navigateURL();

        // Get all href attributes for advert skip links and validate their responses
        const hrefLIST = await util.getHREFsfromAnchorTag('s-advert__skip-link');
        await util.makeHREFRequests(hrefLIST);
    });
});
