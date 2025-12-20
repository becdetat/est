import { test, expect, Page } from '@playwright/test';

async function createSession(page: Page, name: string, email?: string): Promise<string> {
  await page.goto('/');
  await page.fill('input[name="name"]', name);
  if (email) {
    await page.fill('input[name="email"]', email);
  }
  await page.click('button:has-text("Create Session")');
  await page.waitForURL(/\/session\/.+/);
  return page.url();
}

test.describe('Feature Creation and Voting', () => {
  test('host can create a feature', async ({ page }) => {
    await createSession(page, 'Alice');

    // Click start feature button
    await page.click('button:has-text("Start Feature")');

    // Fill feature details
    await page.fill('input[name="name"]', 'User Authentication');
    await page.fill('textarea[name="description"]', 'Implement login and signup');

    // Submit form
    await page.click('button:has-text("Start")');

    // Verify feature appears
    await expect(page.locator('text=User Authentication')).toBeVisible();
    await expect(page.locator('text=Implement login and signup')).toBeVisible();

    // Verify voting cards are available
    await expect(page.locator('button[data-value="1"]')).toBeVisible();
    await expect(page.locator('button[data-value="2"]')).toBeVisible();
  });

  test('host can submit a vote', async ({ page }) => {
    await createSession(page, 'Alice');

    // Create feature
    await page.click('button:has-text("Start Feature")');
    await page.fill('input[name="name"]', 'API Design');
    await page.click('button:has-text("Start")');

    // Vote
    await page.click('button[data-value="5"]');

    // Verify voted status
    await expect(page.locator('text=Voted')).toBeVisible();

    // Verify reveal button appears
    await expect(page.locator('button:has-text("Reveal Results")')).toBeVisible();
  });

  test('host can reveal results', async ({ page }) => {
    await createSession(page, 'Alice');

    // Create feature and vote
    await page.click('button:has-text("Start Feature")');
    await page.fill('input[name="name"]', 'Database Schema');
    await page.click('button:has-text("Start")');
    await page.click('button[data-value="8"]');

    // Reveal results
    await page.click('button:has-text("Reveal Results")');

    // Verify results section appears
    await expect(page.locator('text=Results')).toBeVisible();
    await expect(page.locator('text=8')).toBeVisible();
    await expect(page.locator('text=Alice')).toBeVisible();
  });

  test('can create multiple features', async ({ page }) => {
    await createSession(page, 'Alice');

    // Create first feature
    await page.click('button:has-text("Start Feature")');
    await page.fill('input[name="name"]', 'Feature 1');
    await page.click('button:has-text("Start")');
    await page.click('button[data-value="3"]');
    await page.click('button:has-text("Reveal Results")');

    // Create second feature
    await page.click('button:has-text("Start Feature")');
    await page.fill('input[name="name"]', 'Feature 2');
    await page.click('button:has-text("Start")');

    // Verify new feature is current
    await expect(page.locator('text=Feature 2')).toBeVisible();
  });
});
