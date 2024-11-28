import { Page, expect, test } from '@playwright/test';
import config from '../config';

const baseURL = config.baseURL;

class UtilMethods {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigates to the base URL defined in the configuration.
     * Throws an error if baseURL is not defined in the environment variables.
     */
    async navigateURL() {
        if (!baseURL) {
            throw new Error('BASE_URL is not defined in the environment variables');
        }

        await this.page.goto(baseURL);
        await this.page.waitForTimeout(3000); // Adding delay to allow full page load
    }

    /**
     * Retrieves the href attribute from all anchor tags with a specific data-test-id.
     * 
     * @param dataTestId - The data-test-id of the anchor tags to select.
     * @returns Array of absolute URLs derived from the href attributes.
     */
    async getHREFsfromAnchorTag(dataTestId: string) {
        const elements = await this.page.locator(`[data-test-id="${dataTestId}"]`).all();
        const hrefs: string[] = [];

        for (const element of elements) {
            try {
                const href = await element.getAttribute('href');
                if (href) {
                    // Converts href to absolute URL using baseURL
                    hrefs.push(new URL(href, baseURL).href);
                }
            } catch (error) {
                console.log(`Failed to retrieve href for element with data-test-id="${dataTestId}". Error: ${error.message}`);
            }
        }

        console.log(`Collected ${hrefs.length} URLs for data-test-id="${dataTestId}"`);
        return hrefs;
    }

    /**
     * Makes GET requests to each URL in the hrefsLIST array and logs any unexpected status codes.
     * If the response is not 200 or 302, retries with the relative URL.
     * 
     * @param hrefsLIST - List of URLs to make requests to.
     */
    async makeHREFRequests(hrefsLIST: string[]) {
        let hasFailure = false;  // Tracks if any requests returned unexpected status

        for (const url of hrefsLIST) {
            try {
                await this.page.waitForTimeout(500);  // Prevents rate limiting by adding delay
                const response = await this.page.request.get(url, { timeout: 10000 });
                const status = response.status();

                if (status !== 200 && status !== 302) {
                    hasFailure = true;
                    test.info().annotations.push({ type: 'Unexpected Status', description: `URL: ${url} returned status code: ${status}` });
                    console.log(`URL: ${url} returned unexpected status code: ${status}`);

                    // Retry request using relative URL
                    const relativeURL = url.replace(baseURL, '');
                    console.log(`Retrying with relative URL: ${relativeURL}`);

                    const retryResponse = await this.page.request.get(relativeURL, { timeout: 10000 });
                    const retryStatus = retryResponse.status();

                    if (retryStatus >= 100 && retryStatus <= 599) {
                        console.log(`Server returned status code ${retryStatus} for relative URL: ${relativeURL}`);
                        test.info().annotations.push({ type: 'Retry Status', description: `Server returned status code ${retryStatus} for relative URL: ${relativeURL}` });
                    } else {
                        console.log(`No valid response received for relative URL: ${relativeURL}`);
                        test.info().annotations.push({ type: 'No Response', description: `No valid response received for relative URL: ${relativeURL}` });
                    }
                }
            } catch (error) {
                hasFailure = true;
                if (error.name === 'TimeoutError') {
                    console.log(`Timeout error: Request for URL ${url} took too long and was aborted.`);
                } else {
                    console.log(`Failed to request URL: ${url}. Error: ${error.message}`);
                }
            }
        }

        // Fails the test if any URL check failed
        expect(hasFailure).toBe(false);
    }

    /**
     * Retrieves the src attribute from all elements with a specified data-test-id.
     * 
     * @param dataTestId - The data-test-id of the elements to select.
     * @returns Array of absolute URLs derived from the src attributes.
     */
    async getSRCsFromElements(dataTestId: string) {
        const elements = await this.page.locator(`[data-test-id="${dataTestId}"]`).all();
        const srcs: string[] = [];

        for (const element of elements) {
            try {
                const src = await element.getAttribute('src');
                if (src) {
                    // Converts src to absolute URL using baseURL
                    srcs.push(new URL(src, baseURL).href);
                }
            } catch (error) {
                console.log(`Failed to retrieve src for element with data-test-id="${dataTestId}". Error: ${error.message}`);
            }
        }

        console.log(`Collected ${srcs.length} URLs for data-test-id="${dataTestId}"`);
        return srcs;
    }

    /**
     * Makes GET requests to each URL in the srcList array and logs any unexpected status codes.
     * If any URL returns a status code other than 200 or 302, marks the test as failed.
     * 
     * @param srcList - List of URLs to make requests to.
     */
    async makeSRCRequests(srcList: string[]) {
        let hasFailure = false;  // Tracks if any requests returned unexpected status

        for (const url of srcList) {
            try {
                await this.page.waitForTimeout(500);  // Prevents rate limiting by adding delay
                const response = await this.page.request.get(url, { timeout: 10000 });
                const status = response.status();

                if (status !== 200 && status !== 302) {
                    hasFailure = true;
                    test.info().annotations.push({ type: 'Unexpected Status', description: `URL: ${url} returned status code: ${status}` });
                    console.log(`URL: ${url} returned unexpected status code: ${status}`);
                }
            } catch (error) {
                hasFailure = true;
                if (error.name === 'TimeoutError') {
                    console.log(`Timeout error: Request for URL ${url} took too long and was aborted.`);
                } else {
                    console.log(`Failed to request URL: ${url}. Error: ${error.message}`);
                }
            }
        }

        // Fails the test if any URL check failed
        expect(hasFailure).toBe(false);
    }
}

export default UtilMethods;
