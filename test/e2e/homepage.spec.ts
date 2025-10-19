import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Mushroom Map Ireland/);
    
    // Check header
    await expect(page.locator('h1')).toContainText('Mushroom Map Ireland');
    
    // Check navigation
    await expect(page.getByRole('link', { name: 'Species Guide' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Glossary' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Add a Find' })).toBeVisible();
  });

  test('should display welcome message', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('Welcome to Mushroom Map Ireland')).toBeVisible();
    await expect(page.getByText('privacy-first citizen science')).toBeVisible();
  });

  test('should display safety notice', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('Important Safety Notice')).toBeVisible();
    await expect(page.getByText('Never consume mushrooms based solely on online identification')).toBeVisible();
  });

  test('should have accessible skip link', async ({ page }) => {
    await page.goto('/');
    
    // Focus on skip link (keyboard navigation)
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-to-content')).toBeFocused();
  });

  test('should navigate to species guide', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Species Guide' }).click();
    await expect(page).toHaveURL('/species');
  });

  test('should navigate to glossary', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Glossary' }).click();
    await expect(page).toHaveURL('/glossary');
  });

  test('should navigate to add observation', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Add a Find' }).click();
    await expect(page).toHaveURL('/observe');
  });
});

