import { test, expect } from '@playwright/test';
import { libertyflames, syracuse } from '../pages/rosterPages';
import 'dotenv/config';
import config from '../config';

const { baseURL } = config;

// Get the current test file name for unique identification
const testFileName = __filename.split('/').pop()?.replace('.test.ts', '') || 'default';

test.describe(`Test URL groups and verify elements [${testFileName}]`, () => {
  // Determine the tenant and corresponding group of URLs
  const tenant = process.env.TENANT || 'syracuse'; // Default to syracuse if no tenant is provided
  const urls = tenant === 'libertyuni' ? libertyflames : syracuse;

  // Define selectors directly in the test file
  const selectors = [
    '//*[@data-test-id="s-person-details__bio-stats-person-position-short"]',
    '//*[@data-test-id="s-person-details__bio-stats-person-title"]',
    '//*[@data-test-id="s-person-details__bio-stats-person-weight"]',
    '//*[@data-test-id="s-person-card-list__content-location-person-hometown"]',
    '//*[@data-test-id="s-person-card-list__content-location-person-high-school"]',
    '//*[@data-test-id="s-person-card-list__content-call-to-action-link"]',
  ];

  // Iterate over each URL in the selected group
  urls.forEach((urlPath, index) => {
    test(`[${tenant} | ${testFileName} | Test ${index}] Verify selectors and links for URL: ${urlPath}`, async ({ page }) => {
      test.setTimeout(120000);
      // Construct the full URL by appending the path to baseURL
      const fullURL = `${baseURL}${urlPath}`;
      console.log(`Testing URL: ${fullURL}`);

      // Navigate to the URL
      await page.goto(fullURL, { timeout: 60000 });

      // Verify all selectors are visible
      for (const selector of selectors) {
        const elements = await page.locator(selector);
        const count = await elements.count();

        // Check if elements are visible
        for (let i = 0; i < count; i++) {
          await expect(elements.nth(i)).toBeVisible();
        }

        console.log(`Verified ${count} elements for selector: ${selector}`);
      }

      // Skip logic for the call-to-action links if the URL path matches /sports/rowing/roster
      if (urlPath === '/sports/rowing/roster') {
        console.log(`Skipping call-to-action links test for URL: ${urlPath}`);
        return;
      }

      // Additional logic for the call-to-action links
      const linkSelector = '//*[@data-test-id="s-person-card-list__content-call-to-action-link"]';
      const links = await page.locator(linkSelector);
      const linkCount = await links.count();

      console.log(`Found ${linkCount} call-to-action links.`);

      for (let i = 0; i < linkCount; i++) {
        // Get the href attribute of the link
        const href = await links.nth(i).getAttribute('href');

        if (href) {
          // Construct the full URL by combining baseURL and href if the href is relative
          const fullLinkURL = href.startsWith('http')
            ? href
            : `${baseURL.replace(/\/+$/, '')}/${href.replace(/^\/+/, '')}`;
          console.log(`Testing link: ${fullLinkURL}`);

          // Make a GET request to the full URL
          const response = await page.request.get(fullLinkURL);

          // Assert that the response status is 200 or 302
          const status = response.status();
          console.log(`Response status: ${status}`);
          expect([200, 302]).toContain(status);
        } else {
          console.warn(`Link at index ${i} does not have an href attribute.`);
        }
      }
    });
  });
});
