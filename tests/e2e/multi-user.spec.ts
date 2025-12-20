import { test, expect, Page } from '@playwright/test';

async function createSessionAndGetUrl(page: Page, name: string): Promise<string> {
  await page.goto('/');
  await page.fill('input[name="name"]', name);
  await page.click('button:has-text("Create Session")');
  await page.waitForURL(/\/session\/.+/);
  return page.url();
}

async function joinSession(page: Page, url: string, name: string): Promise<void> {
  await page.goto(url);
  await page.fill('input[name="name"]', name);
  if (await page.locator('button:has-text("Join")').isVisible()) {
    await page.click('button:has-text("Join")');
  }
  // Wait for participant list to load
  await page.waitForSelector('text=Participants');
}

test.describe('Multi-User Sessions', () => {
  test('multiple users can join same session', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // Host creates session
      const sessionUrl = await createSessionAndGetUrl(page1, 'Alice');

      // Second user joins
      await joinSession(page2, sessionUrl, 'Bob');

      // Verify both users see each other
      await expect(page1.locator('text=Bob')).toBeVisible({ timeout: 5000 });
      await expect(page2.locator('text=Alice')).toBeVisible();
      await expect(page2.locator('text=You (Host)').first()).toBeVisible();

      // Verify participant count
      const participantsPage1 = page1.locator('[data-testid="participant-card"]');
      await expect(participantsPage1).toHaveCount(2);

      const participantsPage2 = page2.locator('[data-testid="participant-card"]');
      await expect(participantsPage2).toHaveCount(2);
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('feature creation syncs to all users', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // Setup: Host and participant
      const sessionUrl = await createSessionAndGetUrl(page1, 'Alice');
      await joinSession(page2, sessionUrl, 'Bob');

      // Host creates feature
      await page1.click('button:has-text("Start Feature")');
      await page1.fill('input[name="name"]', 'Real-time Feature');
      await page1.click('button:has-text("Start")');

      // Verify both users see the feature
      await expect(page1.locator('text=Real-time Feature')).toBeVisible();
      await expect(page2.locator('text=Real-time Feature')).toBeVisible({ timeout: 5000 });

      // Verify voting cards enabled for both
      await expect(page1.locator('button[data-value="5"]')).toBeEnabled();
      await expect(page2.locator('button[data-value="5"]')).toBeEnabled();
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('votes sync in real-time', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const context3 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    const page3 = await context3.newPage();

    try {
      // Setup: Three participants
      const sessionUrl = await createSessionAndGetUrl(page1, 'Alice');
      await joinSession(page2, sessionUrl, 'Bob');
      await joinSession(page3, sessionUrl, 'Carol');

      // Host creates feature
      await page1.click('button:has-text("Start Feature")');
      await page1.fill('input[name="name"]', 'Voting Test');
      await page1.click('button:has-text("Start")');

      // Each user votes
      await page1.click('button[data-value="3"]');
      await page2.click('button[data-value="5"]');
      await page3.click('button[data-value="5"]');

      // Verify all users see vote statuses
      await expect(page1.locator('text=Alice').locator('..').locator('text=Voted')).toBeVisible();
      await expect(page1.locator('text=Bob').locator('..').locator('text=Voted')).toBeVisible({ timeout: 5000 });
      await expect(page1.locator('text=Carol').locator('..').locator('text=Voted')).toBeVisible({ timeout: 5000 });
    } finally {
      await context1.close();
      await context2.close();
      await context3.close();
    }
  });

  test('results sync to all users when revealed', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // Setup
      const sessionUrl = await createSessionAndGetUrl(page1, 'Alice');
      await joinSession(page2, sessionUrl, 'Bob');

      // Create feature and vote
      await page1.click('button:has-text("Start Feature")');
      await page1.fill('input[name="name"]', 'Results Test');
      await page1.click('button:has-text("Start")');
      await page1.click('button[data-value="8"]');
      await page2.click('button[data-value="13"]');

      // Wait for both to be marked as voted
      await expect(page1.locator('text=Bob').locator('..').locator('text=Voted')).toBeVisible({ timeout: 5000 });

      // Host reveals
      await page1.click('button:has-text("Reveal Results")');

      // Verify both users see results
      await expect(page1.locator('text=Results')).toBeVisible();
      await expect(page2.locator('text=Results')).toBeVisible({ timeout: 5000 });

      // Verify vote values visible to all
      await expect(page1.locator('text=8')).toBeVisible();
      await expect(page1.locator('text=13')).toBeVisible();
      await expect(page2.locator('text=8')).toBeVisible();
      await expect(page2.locator('text=13')).toBeVisible();
    } finally {
      await context1.close();
      await context2.close();
    }
  });
});

test.describe('Permission Controls', () => {
  test('non-host cannot create features', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // Setup
      const sessionUrl = await createSessionAndGetUrl(page1, 'Alice');
      await joinSession(page2, sessionUrl, 'Bob');

      // Verify host sees button
      await expect(page1.locator('button:has-text("Start Feature")')).toBeVisible();

      // Verify non-host does NOT see button
      await expect(page2.locator('button:has-text("Start Feature")')).not.toBeVisible();
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('non-host cannot reveal results', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // Setup with feature
      const sessionUrl = await createSessionAndGetUrl(page1, 'Alice');
      await joinSession(page2, sessionUrl, 'Bob');
      
      await page1.click('button:has-text("Start Feature")');
      await page1.fill('input[name="name"]', 'Permission Test');
      await page1.click('button:has-text("Start")');
      
      await page1.click('button[data-value="5"]');
      await page2.click('button[data-value="8"]');

      // Verify host sees reveal button
      await expect(page1.locator('button:has-text("Reveal Results")')).toBeVisible();

      // Verify non-host does NOT see reveal button
      await expect(page2.locator('button:has-text("Reveal Results")')).not.toBeVisible();
    } finally {
      await context1.close();
      await context2.close();
    }
  });
});
