# README #

This README would normally document whatever steps are necessary to get your application up and running.

# Playwright E2E Test Automation Framework

This repository contains an End-to-End (E2E) test automation framework built using Playwright with TypeScript for UI testing and Jest for API response validation. The framework is designed to test navigation links, image links, and UI element visibility on a specified website.

## Project Structure
- **config.ts**: Manages dynamic configuration for base URL and tenant mapping.
- **tests**: Organized test cases for different validation groups:
  - **Navigation Links Validation**: Verifies internal and external links.
  - **Image Links Validation**: Checks image and SVG links.
  - **UI Tests**: Checks visibility and interactivity of elements.
- **utils**: Reusable utility methods for navigating URLs, interacting with elements, and handling HTTP requests.
- **Pipeline File**: Configuration for running tests in a CI/CD pipeline.

## Prerequisites
- **Node.js** (version 20.16.0 or later)
- **Playwright**
- **Jest**

## Set Up
1. Clone the repository:
  ```sh
   git clone https://bitbucket.org/sidearmsports/sidearm-e2e-tests.git
   ```

2. Navigate to the project directory:
  ```sh
  cd sidearm-e2e-tests
  ```

3. Install dependencies:
    ```sh
    npm install
    ```

4. Create a .env file in the root directory and add the following:
  ```sh
  TENANT=syracuse
  ```

5. Install required browsers:
  ```sh
  npx playwright install
  ```

6. Run all Tests:
    ```sh
    npx playwright test
    ```

7. Run a specific Tests:
  ```sh
  npx playwright test tests/filename.test.ts
  ```

