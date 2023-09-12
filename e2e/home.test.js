const { test, expect } = require('@playwright/test');

test('Title of page is set to MyRepoStats', async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toBe('MyRepoStats');
});

test('Site header contains name of project', async ({ page }) => { 
  await page.goto('/');
  expect(await page.innerText('header')).toBe('MyRepoStats');
});