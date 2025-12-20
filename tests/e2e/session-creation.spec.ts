import { test, expect } from '@playwright/test';

test.describe('Session Creation', () => {
  test('should create a new session with valid name', async ({ page }) => {
    await page.goto('/');

    // Fill in user details
    await page.fill('input[name="name"]', 'Alice');
    await page.fill('input[name="email"]', 'alice@example.com');

    // Create session
    await page.click('button:has-text("Create Session")');

    // Wait for navigation to session page
    await page.waitForURL(/\/session\/.+/);

    // Verify session page loaded
    await expect(page.locator('text=Participants')).toBeVisible();
    await expect(page.locator('text=Alice')).toBeVisible();
    await expect(page.locator('text=You (Host)')).toBeVisible();

    // Verify host controls visible
    await expect(page.locator('button:has-text("Start Feature")')).toBeVisible();
  });

  test('should require name to create session', async ({ page }) => {
    await page.goto('/');

    // Try to create without name
    const createButton = page.locator('button:has-text("Create Session")');
    
    // Button should be disabled or form should validate
    const isDisabled = await createButton.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('should allow email to be optional', async ({ page }) => {
    await page.goto('/');

    // Fill only name
    await page.fill('input[name="name"]', 'Bob');

    // Should be able to create
    await page.click('button:has-text("Create Session")');
    await page.waitForURL(/\/session\/.+/);

    await expect(page.locator('text=Bob')).toBeVisible();
  });
});

test.describe('Session Persistence', () => {
  test('should persist participant after page refresh', async ({ page }) => {
    await page.goto('/');

    // Create session
    await page.fill('input[name="name"]', 'Charlie');
    await page.click('button:has-text("Create Session")');
    await page.waitForURL(/\/session\/.+/);

    // Get the session URL
    const sessionUrl = page.url();

    // Refresh the page
    await page.reload();

    // Verify still in same session
    expect(page.url()).toBe(sessionUrl);
    
    // Verify participant still exists (no duplicate)
    const participants = page.locator('[data-testid="participant-card"]');
    await expect(participants).toHaveCount(1);
    await expect(page.locator('text=Charlie')).toBeVisible();
    await expect(page.locator('text=You (Host)')).toBeVisible();
  });
});
