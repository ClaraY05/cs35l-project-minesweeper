import { test, expect } from '@playwright/test';

// precondition is that these users already exist in the database and their email has been verified already
const firstTester = {
    email: 'testuser1@example.com',
    password: 'Testing123!',
    username: 'testuser1'
}

const secondTester = {
    email: 'testuser2@example.com',
    password: 'Testing123!',
    username: 'testuser2'
}

test('Sending friend request and confirming a notification is sent', async ({ page, request }) => {
    
    // login as the first tester
    await page.goto('http://localhost:5173/');
    await page.fill('input[type="email"]', firstTester.email);
    await page.fill('input[type="password"]', firstTester.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/home', { timeout: 10000 });
    
    // open friends popout
    await page.locator('button').filter({ has: page.locator('img[alt*="People"]') }).click();
    await page.waitForSelector('text=Friend List', { timeout: 5000 });
    await page.locator('input[type="text"]').first().fill(secondTester.username);
    await page.locator('button').filter({ hasText: /Search/i }).click();
    await page.waitForTimeout(1000); // wait for search results to load
    await page.locator('button').filter({ hasText: /Add Friend/i }).click();
    await page.locator('button').filter({ hasText: /Close/i }).click(); // close popout

    // login as second tester 
    await page.locator('button').filter( { hasText: 'logout'}).click();
    await page.waitForURL('**/', { timeout: 5000 }); // waits for the login page now
    await page.fill('input[type="email"]', secondTester.email);
    await page.fill('input[type="password"]', secondTester.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/home', { timeout: 10000 });


    // open notifications popout to check for friend request
    // click the notifications icon button
    await page.locator('button').filter({ has: page.locator('img[alt*="Letter"]') }).click();
    await page.waitForSelector('text=Friend request', { timeout: 5000 });

    // verify the friend request notification is visible
    await expect(page.locator('text=Friend request')).toBeVisible();
    await expect(page.locator(`text=${firstTester.username}`)).toBeVisible(); // should show first users username

});