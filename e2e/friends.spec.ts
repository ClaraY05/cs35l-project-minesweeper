import { test, expect } from '@playwright/test';


const firstTester = {
    email: 'firstTester@example.com',
    password: 'Testing123!',
    username: 'firstTester'
}

const secondTester = {
    email: 'secondTester@example.com',
    password: 'Testing123!',
    username: 'secondTester'
}

test('Sending friend request and confirming a notification is sent', async ({ page, request }) => {
    
    // register the first tester
    await page.goto('http://localhost:5173/register');
    await page.fill('input[name="email"]', firstTester.email);
    await page.fill('input[name="password"]', firstTester.password);
    await page.fill('input[name="username"]', firstTester.username);
    await page.click('button[type="submit"]');

    // login the first tester
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"]', firstTester.email);
    await page.fill('input[name="password"]', firstTester.password);
    await page.click('button[type="submit"]');
}