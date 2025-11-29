import { Router, Response } from "express";
import multer from "multer";
import { pool } from "../../db/db";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";

const profilePictureRoutes = Router();

// Configure multer to store files in memory
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {

      // Only allow image files from jpg, jpeg, png, gif, or webp
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed'));
      }
    }
});

profilePictureRoutes.post("/upload", authenticateToken, upload.single('profilePicture'), async (req: AuthRequest, res: Response) => {
    try {
        const userID = req.user?.userID;
        if (!userID) {
            return res.status(400).json({ error: "Missing user ID in token" });
        }
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        
        // Convert the image to base64 to store in db
        const imageBase64 = req.file.buffer.toString('base64');
        const imageUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

        // update the user pfp in database
        await pool.query(
            "UPDATE users SET profile_picture_url = $1 WHERE user_id = $2",
            [imageUrl, userID]
        );

        return res.status(200).json({
            message: "Profile picture uploaded successfully",
            profilePictureUrl: imageUrl
        })
        
    } catch (err) {
        console.error("Error uploading profile picture:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
  
export default profilePictureRoutes;