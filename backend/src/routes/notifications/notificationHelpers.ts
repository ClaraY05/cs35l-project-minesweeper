import { pool } from "../../db/db";
import { addFriend } from "../friends/friendHelpers";

// get all the notifications for some user
export async function getNotifications(userID: number){
    try {
        const result = await pool.query(`
            SELECT
                n.notification_id,
                n.message,
                n.type,
                n."comes_from_ID",
                n.is_read,
                n.created_at,
                u.username as related_username
            FROM notifications n
            LEFT JOIN users u ON n."comes_from_ID" = u.user_id 
            -- get username of person who sent notification
            -- If the notification is friend, then username is from the user who sent the friend request
            -- the notification should be null if it is not a friend request
            WHERE n.user_id = $1
            ORDER BY n.created_at DESC
        `, [userID]);
        return result.rows;
    }
    catch (err) {
        console.error("Error getting notifications:", err);
        throw err;
    }
}

// create a new notification
export async function createNotification(userID: number, message: string, type: string, comesFromID?: number){
    try {
        const result = await pool.query(`
            INSERT INTO notifications (user_id, message, type, "comes_from_ID")
            VALUES ($1, $2, $3, $4)
            RETURNING notification_id, user_id, message, type, "comes_from_ID", is_read, created_at
        `, [userID, message, type, comesFromID || null]);
        return result.rows[0];
    }
    catch (err) {
        console.error("Error creating notification:", err);
        throw err;
    }
}

// Mark a notification as read which is deleting the notification
export async function readNotification(notificationID: number, userID: number){
    try {
        const result = await pool.query(`
            DELETE FROM notifications
            WHERE notification_id = $1 AND user_id = $2
            RETURNING notification_id
        `, [notificationID, userID]);
        if (result.rows.length === 0) {
            throw new Error("Notification not found");
        }
        return result.rows[0];
    }
    catch (err) {
        console.error("Error reading notification:", err);
        throw err;
    }
}

// Clear all notifications from a user
export async function clearAllNotifications(userID: number){
    try {
        const result = await pool.query(`
            DELETE FROM notifications
            WHERE user_id = $1
            RETURNING notification_id
        `, [userID]);
        return result.rows;
    }
    catch (err) {
        console.error("Error clearing all notifications:", err);
        throw err;
    }
}