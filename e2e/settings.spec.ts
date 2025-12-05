import { test, expect } from '@playwright/test';

const firstTesterFile = './playwright/.auth/user1.json';
const customBgUrl = 'https://www.ozziecollectables.com/cdn/shop/articles/0.png?v=1679014725&width=1100';

test('Changing background value in settings and checking this is true', async ({ browser }) => {
    // Create a new context with firstTester already logged in
    const context = await browser.newContext({ storageState: firstTesterFile });
    const page = await context.newPage();

    // Navigate to video interface settings
    await page.goto('http://localhost:5173/settings/video_interface');
    await page.waitForURL('**/settings/video_interface');

    // Check the "Use Custom Background" checkbox
    const checkbox = page.getByLabel('Use Custom Background');
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Fill in the custom background URL
    const urlInput = page.getByPlaceholder('Enter background url');
    await urlInput.fill(customBgUrl);

    // Press Enter to submit the form (this triggers image validation and updates localStorage)
    await urlInput.press('Enter');

    // Wait for the image validation to complete (check that error message doesn't appear)
    await page.waitForTimeout(1000); // Give time for async image check
    const errorMessage = page.locator('text=Image URL is not valid or reachable');
    await expect(errorMessage).not.toBeVisible();

    // Click the Save button to persist to database
    await page.getByRole('button', { name: 'Save' }).click();

    // Wait a moment for save to complete
    await page.waitForTimeout(500);

    // Navigate to home page
    await page.goto('http://localhost:5173/home');
    await page.waitForURL('**/home');

    // Check if the background image URL matches the custom URL
    // The background is set via inline style on the main container div in Layout.tsx
    // Find the div with the backgroundImage style attribute
    const mainContainer = page.locator('div[style*="backgroundImage"]').first();
    
    // Get the computed background-image style
    const backgroundImage = await mainContainer.evaluate((el) => {
        return window.getComputedStyle(el).backgroundImage;
    });

    // The backgroundImage should contain the custom URL
    // It will be in the format: url("https://...") or url('https://...')
    expect(backgroundImage).toContain(customBgUrl);

    await context.close();
});
