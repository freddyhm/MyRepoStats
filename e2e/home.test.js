const { test, expect } = require('@playwright/test');

test('Title of page is set to MyRepoStats', async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toBe('MyRepoStats');
});

test('Site header contains name of project', async ({ page }) => { 
  await page.goto('/');
  expect(await page.innerText('header')).toBe('MyRepoStats');
});

test('Body contains subtitle question', async ({ page }) => {
  await page.goto('/');
  expect(await page.innerText('body')).toContain('When are commits typically made during the day?');
});

test('Body contains morning entry', async ({ page }) => {
  await page.goto('/');
  expect(await page.innerText('body')).toContain('Morning:');
});

test('Body contains afternoon entry', async ({ page }) => {
  await page.goto('/');
  expect(await page.innerText('body')).toContain('Afternoon:');
});

test('Body contains evening entry', async ({ page }) => {
  await page.goto('/');
  expect(await page.innerText('body')).toContain('Evening:');
});

test('Body contains night entry', async ({ page }) => {
  await page.goto('/');
  expect(await page.innerText('body')).toContain('Night:');
});



test('Footer contains repo address', async ({ page }) => {
  await page.goto('/');
  expect(await page.innerText('footer')).toContain('https://github.com/freddyhm/myrepostats');
});
