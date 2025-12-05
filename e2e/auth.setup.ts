import { test as setup, expect } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { DEFAULT_SETTINGS } from '../utils/defaultSettings.js';

// Load backend environment variables for database connection
// Priority: 1) Environment variables (from CI/CD secrets), 2) .env file (local dev)
if (!process.env.DB_HOST) {
    dotenv.config({ path: path.join(__dirname, '../backend/.env') });
}

// Create database connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5433),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const authDir = path.join(__dirname, '../playwright/.auth');
const firstTesterFile = path.join(authDir, 'user1.json');
const secondTesterFile = path.join(authDir, 'user2.json');

const firstTester = {
    email: 'testuser1@example.com',
    password: 'Testing123!',
    username: 'testuser1'
};

const secondTester = {
    email: 'testuser2@example.com',
    password: 'Testing123!',
    username: 'testuser2'
};

// add users to db + verify
async function ensureUserVerified(user: typeof firstTester) {
    try {
        const existingUser = await pool.query(
            'SELECT user_id, is_verified FROM users WHERE email = $1',
            [user.email]
        );
        if (existingUser.rows.length > 0) {
            // if exists check verified
            const userID = existingUser.rows[0].user_id;
            if (!existingUser.rows[0].is_verified) {
                await pool.query(
                    'UPDATE users SET is_verified = true WHERE user_id = $1',
                    [userID]
                );
            }
        } else {
            // else add to db + verify
            const passwordHash = await bcrypt.hash(user.password, 10);
            
            const result = await pool.query(
                'INSERT INTO users (username, email, password_hash, is_verified) VALUES ($1, $2, $3, $4) RETURNING user_id',
                [user.username, user.email, passwordHash, true]
            );

            const userID = result.rows[0].user_id;

            await pool.query(
                'INSERT INTO settings (user_id, keybinds, sound, video, notif) VALUES ($1, $2, $3, $4, $5)',
                [
                    userID,
                    DEFAULT_SETTINGS.keybinds,
                    DEFAULT_SETTINGS.sound,
                    DEFAULT_SETTINGS.video,
                    DEFAULT_SETTINGS.notif
                ]
            );
        }
    } catch (error: any) {
        throw new Error(`Failed to ensure user ${user.email} is verified: ${error.message}`);
    }
}

setup('authenticate as first tester', async ({ page }) => {
    await ensureUserVerified(firstTester);
    
    // login through the UI to get cookies in browser context
    await page.goto('http://localhost:5173/');
    await page.fill('input[type="email"]', firstTester.email);
    await page.fill('input[type="password"]', firstTester.password);
    await page.click('button[type="submit"]');
    
    // Wait until the page receives the cookies and redirects to home
    await page.waitForURL('**/home', { timeout: 10000 });
    
    // Verify logged in
    await expect(page).toHaveURL(/.*\/home/);
    
    await page.context().storageState({ path: firstTesterFile });
});

setup('authenticate as second tester', async ({ page }) => {
    await ensureUserVerified(secondTester);
    
    await page.goto('http://localhost:5173/');
    await page.fill('input[type="email"]', secondTester.email);
    await page.fill('input[type="password"]', secondTester.password);
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/home', { timeout: 10000 });
    
    await expect(page).toHaveURL(/.*\/home/);
    
    // Save the storage state (includes cookies)
    await page.context().storageState({ path: secondTesterFile });
});

// Cleanup: close database connection when process exits
process.on('exit', () => {
    pool.end().catch(() => {});
});

