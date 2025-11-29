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
                u.profile_picture_url
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

// Delete a friend from the friend list
export async function deleteFriend(userID: number, friendID: number){
    try {
        const result = await pool.query(`
            DELETE FROM friends
            WHERE (user_id = $1 AND friend_id = $2)
               OR (user_id = $2 AND friend_id = $1)
            RETURNING friends_id
        `, [userID, friendID]);
        if (result.rows.length === 0) {
            throw new Error("Friend not found");
        }

        return result.rows[0];
    } catch (err) {
        console.error("Error deleting friend:", err);
        throw err;
    }
}


// search for friends by their gamertag/username
export async function searchUsers(searchName: string, currentUserID: number, limit: number = 7) {
    try {
        const result = await pool.query(`
            SELECT 
            user_id,
            username,
            email
            profile_picture_url
          FROM users
          WHERE username ILIKE $1
            AND user_id != $2
          ORDER BY username ASC
          LIMIT $3 
        `, [`%${searchName}%`, currentUserID, limit]);

        return result.rows;

    } catch (err) {
        console.error("Error searching users:", err);
        throw err;
    }
}