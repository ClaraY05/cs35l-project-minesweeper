import { pool } from "../../db/db";

// Add friends to the current user
export async function addFriend(userID: number, friendID: number){
    try {
        const result = await pool.query(`
            INSERT INTO friends (user_id, friend_id)
            VALUES ($1, $2)
            RETURNING friends_id, user_id, friend_id, created_at
        `, [userID, friendID]);
        return result.rows[0];
    }
    catch (err) {
        console.error("Error adding friend:", err);
        throw err;
    }
}


// Display a list of friends that are connected to the current user
export async function getFriends(userID: number){
    try {
        const result = await pool.query(`
            SELECT 
                u.user_id,
                u.username,
                u.email
            FROM friends f
            JOIN users u ON f.friend_id = u.user_id
            WHERE f.user_id = $1
            ORDER BY u.username ASC
        `, [userID]);

        return result.rows;
    } catch (err) {
        console.error("Error getting friends:", err);
        throw err;
    }
}