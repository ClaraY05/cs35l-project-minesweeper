import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";
import { getFriends, deleteFriend, addFriend, searchUsers } from "./friendHelpers";
import { createNotification, readNotification } from "../notifications/notificationHelpers";
import { pool } from "../../db/db";


// Add routes for friends
const friendsRouter = Router();


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

// Get route to search for friends by their gamertag/username
friendsRouter.get("/search", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user?.userID;
        const query = req.query.query as string; // get the search query from req

        if (!userID) {
            return res.status(400).json({ error: "Missing user ID in token" });
        }

        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const users = await searchUsers(query, userID);
        return res.json(users);
    } catch (err) {
        console.error("Error in GET /friends/search:", err);
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

// Add friend to current user friend list
friendsRouter.post("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user?.userID;
        const { friendId } = req.body;
    

        if (!userID) {
            return res.status(400).json({ error: "Missing user ID in token" });
        }
        
        if (!friendId || isNaN(Number(friendId))) {
            return res.status(400).json({ error: "Valid friend ID is required" });
          }
      
          const friendID = Number(friendId);
          
          // Prevent adding yourself as a friend
          if (userID === friendID) {
            return res.status(400).json({ error: "Cannot add yourself as a friend" });
          }
      
          // Get the sender's username for the notification message
          const senderResult = await pool.query(
            "SELECT username FROM users WHERE user_id = $1",
            [userID]
          );
          
          if (senderResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
          }
          
          const senderUsername = senderResult.rows[0].username;
          
          // Create a notification representing a friend request
          await createNotification(
            friendID, 
            `${senderUsername} sent you a friend request`,
            "friend_request",
            userID
          );

          return res.json({ message: "Friend request sent" });
    } catch (err) {
        console.error("Error in POST /friends:", err);
        return res.status(500).json({ error: "Internal server error"});
    }
});

// Accept a friend request
friendsRouter.post("/accept", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user?.userID;
        const { requesterId, notificationId } = req.body;

        if (!userID) {
            return res.status(400).json({ error: "Missing user ID in token" });
        }

        const requesterID = Number(requesterId);

        // wait to add friends until user has accepted the request
        await addFriend(userID, requesterID);
        await addFriend(requesterID, userID);

        // get the person who accepted the request
        const accepterResult = await pool.query(
            "SELECT username FROM users WHERE user_id = $1",
            [userID]
        );

        // get the username otherwise "Someone"
        const accepterUsername = accepterResult.rows[0]?.username || "Someone";

        // Notify the requester that their request was accepted
        await createNotification(
            requesterID,
            `${accepterUsername} accepted your friend request`,
            "friend_accept",
            userID
        );
        await getFriends(userID);

        return res.json({ message: "Friend request accepted" });
    } catch (err) {
        console.error("Cannot accept friend request", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// deny friend request
friendsRouter.post("/deny", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user?.userID;
        const { requesterId, notificationId } = req.body;

        if (!userID) {
            return res.status(400).json({ error: "Missing user ID in token" });
        }

        const requesterID = Number(requesterId);

        // get the username of the user who denied the request
        const denierResult = await pool.query(
            "SELECT username FROM users WHERE user_id = $1",
            [userID]
        );
        const denierUsername = denierResult.rows[0]?.username || "Someone";

        // notify the requester that their request was denied
        await createNotification(
            requesterID,
            `${denierUsername} denied your friend request`,
            "friend_deny",
            userID
        );

        return res.json({ message: "Friend request denied" });
    } catch (err) {
        console.error("error in denying request", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
  
export default friendsRouter;