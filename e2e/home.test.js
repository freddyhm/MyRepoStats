const { test, expect } = require('@playwright/test');

test('Title of page is set to MyRepoStats', async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toBe('MyRepoStats');
});

test('Site header contains name of project', async ({ page }) => { 
  await page.goto('/');
  expect(await page.innerText('header')).toBe('MyRepoStats');
});

// test check body contains subtitle text
test('Body contains subtitle question', async ({ page }) => {
  await page.goto('/');
  expect(await page.innerText('body')).toContain('When are commits typically made during the day?');
});