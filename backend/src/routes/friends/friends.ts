import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";
import { getFriends, deleteFriend, addFriend, searchUsers } from "./friendHelpers";


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
      
          await addFriend(userID, friendID);
          return res.json({ message: "Friend added successfully" });
    } catch (err) {
        console.error("Error in POST /friends:", err);
        return res.status(500).json({ error: "Internal server error"});
    }
});
  
export default friendsRouter;