const { test, expect } = require('@playwright/test');

test('Title of page is set to MyRepoStats', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/');
  expect(await page.title()).toBe('MyRepoStats');
});