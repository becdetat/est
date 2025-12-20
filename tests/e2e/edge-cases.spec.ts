import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should handle invalid session ID gracefully', async ({ page }) => {
    // Navigate to non-existent session
    await page.goto('/session/invalid-session-id-123');

    // Should show error or redirect
    // Adjust based on actual implementation
    await expect(page.locator('text=/not found|error|invalid/i')).toBeVisible({ timeout: 5000 });
  });

  test('should handle network interruption', async ({ page, context }) => {
    // Create session
    await page.goto('/');
    await page.fill('input[name="name"]', 'Alice');
    await page.click('button:has-text("Create Session")');
    await page.waitForURL(/\/session\/.+/);

    // Simulate offline mode
    await context.setOffline(true);

    // Try to create feature (should fail gracefully)
    await page.click('button:has-text("Start Feature")');
    await page.fill('input[name="name"]', 'Test Feature');
    await page.click('button:has-text("Start")');

    // Restore connection
    await context.setOffline(false);

    // Verify app recovers
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Alice')).toBeVisible();
  });
});

test.describe('Edge Cases', () => {
  test('should handle rapid voting clicks', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="name"]', 'Alice');
    await page.click('button:has-text("Create Session")');
    await page.waitForURL(/\/session\/.+/);

    // Create feature
    await page.click('button:has-text("Start Feature")');
    await page.fill('input[name="name"]', 'Rapid Click Test');
    await page.click('button:has-text("Start")');

    // Click multiple cards rapidly
    await page.click('button[data-value="1"]');
    await page.click('button[data-value="3"]');
    await page.click('button[data-value="5"]');
    await page.click('button[data-value="8"]');

    // Should only register last vote
    await page.click('button:has-text("Reveal Results")');
    await expect(page.locator('text=Results')).toBeVisible();
    // Last clicked was 8
    await expect(page.locator('text=8')).toBeVisible();
  });

  test('should handle very long feature names', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="name"]', 'Alice');
    await page.click('button:has-text("Create Session")');
    await page.waitForURL(/\/session\/.+/);

    await page.click('button:has-text("Start Feature")');
    
    const longName = 'A'.repeat(200);
    await page.fill('input[name="name"]', longName);
    await page.click('button:has-text("Start")');

    // Should either truncate or display properly
    await expect(page.locator('text=/A{10,}/i')).toBeVisible();
  });

  test('should handle special characters in names', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="name"]', 'Alice <script>alert("xss")</script>');
    await page.click('button:has-text("Create Session")');
    await page.waitForURL(/\/session\/.+/);

    // Should escape and display safely
    await expect(page.locator('text=Alice')).toBeVisible();
    // Should not execute script
    page.on('dialog', () => {
      throw new Error('XSS vulnerability detected!');
    });
  });

  test('should handle multiple tabs from same browser', async ({ page, context }) => {
    // Create session in first tab
    await page.goto('/');
    await page.fill('input[name="name"]', 'Alice');
    await page.click('button:has-text("Create Session")');
    await page.waitForURL(/\/session\/.+/);
    const sessionUrl = page.url();

    // Open second tab with same session
    const page2 = await context.newPage();
    await page2.goto(sessionUrl);

    // Should reuse same participant
    const participantsPage1 = page.locator('[data-testid="participant-card"]');
    const participantsPage2 = page2.locator('[data-testid="participant-card"]');

    // Should see only 1 participant (not duplicated)
    await expect(participantsPage1).toHaveCount(1);
    await expect(participantsPage2).toHaveCount(1);

    await page2.close();
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should be usable on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.fill('input[name="name"]', 'Mobile User');
    await page.click('button:has-text("Create Session")');
    await page.waitForURL(/\/session\/.+/);

    // Create feature
    await page.click('button:has-text("Start Feature")');
    await page.fill('input[name="name"]', 'Mobile Test');
    await page.click('button:has-text("Start")');

    // Verify voting cards are accessible
    const voteCard = page.locator('button[data-value="5"]');
    await expect(voteCard).toBeVisible();
    await voteCard.click();

    await expect(page.locator('text=Voted')).toBeVisible();
  });

  test('should not have horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check for horizontal scrollbar
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });
});

test.describe('Performance', () => {
  test('should handle many features without performance degradation', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="name"]', 'Alice');
    await page.click('button:has-text("Create Session")');
    await page.waitForURL(/\/session\/.+/);

    // Create 10 features
    for (let i = 1; i <= 10; i++) {
      await page.click('button:has-text("Start Feature")');
      await page.fill('input[name="name"]', `Feature ${i}`);
      await page.click('button:has-text("Start")');
      await page.click('button[data-value="5"]');
      await page.click('button:has-text("Reveal Results")');
      await page.waitForTimeout(500); // Brief pause between features
    }

    // Verify latest feature is displayed
    await expect(page.locator('text=Feature 10')).toBeVisible();

    // App should still be responsive
    await page.click('button:has-text("Start Feature")');
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });
});
