import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";
import { pool } from "../../db/db";



// Add routes for friends
const friendsRouter = Router();

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

// Get route to get friends for the current authenticated user
friendsRouter.get("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userID = req.user?.userID;
  
      if (!userID) {
        return res.status(400).json({ error: "Missing user ID in token" });
      }
  
      const friends = await getFriends(userID);
      return res.json(friends);
    } catch (err) {
      console.error("Error in GET /friends:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Make sure the user is authenticated, then delete a friend
  friendsRouter.delete("/:friendId", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user?.userID; // Get user ID from the token
        const friendID = Number(req.params.friendId); // get the friend ID from the req param

        if (!userID) {
            return res.status(400).json({ error: "Missing ID in token"});
        }

        if (!friendID){
            return res.status(400).json({ error: "Invalid friend ID"});
        }

        await deleteFriend(userID, friendID);
        return res.json({ message: "Deleted friend"});
    } catch (err) {
        console.error("Error in DELETE /friends:", err);
        return res.status(500).json({ error: "Internal server error"});
    }
  });
  
  export default friendsRouter;