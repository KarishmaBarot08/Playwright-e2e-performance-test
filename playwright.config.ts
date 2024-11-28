import * as dotenv from 'dotenv';
dotenv.config();
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  //retries: 2,
  workers: 4,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    //baseURL: 'https://www.google.com/',
    actionTimeout: 10 * 1000,
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    browserName: 'chromium'
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        //...devices['Desktop Chrome'],
      },
    },
  ],
  outputDir: 'test-results/',
  reporter: [['list'], ['html', { outputFolder: 'html-report', open: 'on-failure' }]],
});
