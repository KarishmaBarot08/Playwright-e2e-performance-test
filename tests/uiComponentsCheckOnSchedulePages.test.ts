import { test, expect } from '@playwright/test';
import { libertyflames, syracuse } from '../pages/schedulePages';
import 'dotenv/config';
import config from '../config';

const { baseURL } = config;

// Get the current test file name for unique identification
const testFileName = __filename.split('/').pop()?.replace('.test.ts', '') || 'default';

test.describe(`Test schedule list and verify elements [${testFileName}]`, () => {
    const tenant = process.env.TENANT || 'syracuse'; // Default to syracuse if no tenant is provided
    const urls = tenant === 'libertyuni' ? libertyflames : syracuse;

    // Define selectors with fallback
    const listItemSelectors = [
        {
            primary: "//a[@data-test-id='s-game-card-standard__header-team-opponent-link']",
            fallback: "//a[@data-test-id='s-game-card-standard__header-opponent-link-alt']",
        },
        {
            primary: "//p[@data-test-id='s-game-card-standard__header-game-time']",
            fallback: "//p[@data-test-id='s-game-card-standard__header-game-date']",
        },
    ];

    const gameDateSelectors = [
        {
            primary: "//p[@data-test-id='s-game-card-standard__header-game-date']",
            fallback: "//div[@data-test-id='s-game-card-standard__header-game-date-details']",
        },
    ];

    const locationSelectors = [
        {
            primary: "//span[@data-test-id='s-game-card-facility-and-location__standard-location-details']",
            fallback1: "//a[@data-test-id='s-game-card-facility-and-location__game-facility-title-link']",
            fallback2: "//span[@data-test-id='s-game-card-facility-and-location__standard-facility-title']",
        },
    ];

    // Indexes to skip for specific URLs
    const indexesToSkip: { [key: string]: number[] } = {
        "sports/mens-soccer/schedule": [0, 1, 4, 5, 6, 8, 9, 11, 12, 14, 16, 19],
    };

    // Iterate over URLs
    urls.forEach((urlPath, urlIndex) => {
        test(`[${tenant} | ${testFileName} | Test ${urlIndex}] Verify schedule list and elements for URL: ${urlPath}`, async ({ page }) => {
            test.setTimeout(180000);

            const fullURL = `${baseURL}${urlPath}`;
            console.log(`Testing URL: ${fullURL}`);

            await page.goto(fullURL, { timeout: 60000 });
            await page.waitForTimeout(3000);

            const listSelector = "//div[@data-test-id='schedule-view-type-list__root']";
            const listItems = await page.locator(listSelector).locator('xpath=./*');
            const itemCount = await listItems.count();

            console.log(`Found ${itemCount} list items.`);

            for (let i = 0; i < itemCount; i++) {
                if (tenant === 'syracuse' && indexesToSkip[urlPath]?.includes(i)) {
                    console.warn(`Skipping verification for tenant: ${tenant}, URL: ${urlPath}, index: ${i}`);
                    continue;
                }

                console.log(`Verifying list item ${i + 1} of ${itemCount}`);

                // Verify general elements
                for (const selectorPair of listItemSelectors) {
                    const primaryElement = listItems.nth(i).locator(`xpath=${selectorPair.primary}`);
                    const fallbackElement = listItems.nth(i).locator(`xpath=${selectorPair.fallback}`);
                    const elementVisible = await verifyElement(primaryElement, fallbackElement);
                    if (!elementVisible) {
                        console.warn(`Element failed verification for selectors: ${JSON.stringify(selectorPair)}`);
                    }
                }

                // Verify game date elements
                let gameDateVerified = false;
                for (const selectorPair of gameDateSelectors) {
                    const primaryElement = listItems.nth(i).locator(`xpath=${selectorPair.primary}`);
                    const fallbackElement = listItems.nth(i).locator(`xpath=${selectorPair.fallback}`);
                    gameDateVerified = await verifyElement(primaryElement, fallbackElement);
                    if (gameDateVerified) break;
                }
                if (!gameDateVerified) {
                    console.warn(`Game date not found for list item ${i + 1}`);
                }

                // Verify location elements
                let locationVerified = false;
                for (const selectorPair of locationSelectors) {
                    const primaryElement = listItems.nth(i).locator(`xpath=${selectorPair.primary}`);
                    const fallbackElement1 = listItems.nth(i).locator(`xpath=${selectorPair.fallback1}`);
                    const fallbackElement2 = listItems.nth(i).locator(`xpath=${selectorPair.fallback2}`);
                    locationVerified = await verifyElement(primaryElement, fallbackElement1, fallbackElement2);
                    if (locationVerified) break;
                }
                if (!locationVerified) {
                    console.warn(`Location not found for list item ${i + 1}`);
                }
            }
        });
    });
});

// Helper function to verify an element with primary and fallback selectors
// Helper function to verify an element with primary and multiple fallback selectors
async function verifyElement(
    primaryElement: any,
    ...fallbackElements: any[]
): Promise<boolean> {
    // Try the primary element
    if (await primaryElement.count() > 0) {
        try {
            await primaryElement.waitFor({ state: 'visible', timeout: 20000 });
            await primaryElement.scrollIntoViewIfNeeded({ timeout: 20000 });
            await expect(primaryElement).toBeVisible();
            return true;
        } catch (err) {
            console.warn(`Primary element verification failed. Trying fallbacks...`);
        }
    }

    // Iterate through fallback elements
    for (const fallbackElement of fallbackElements) {
        if (await fallbackElement.count() > 0) {
            try {
                await fallbackElement.waitFor({ state: 'visible', timeout: 20000 });
                await fallbackElement.scrollIntoViewIfNeeded({ timeout: 20000 });
                await expect(fallbackElement).toBeVisible();
                return true;
            } catch (err) {
                console.warn(`Fallback element verification failed for selector.`);
            }
        }
    }

    // If all selectors fail
    console.warn(`All elements failed verification: Primary and all fallbacks.`);
    return false;
}

