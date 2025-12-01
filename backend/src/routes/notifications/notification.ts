import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";
import { getNotifications, createNotification, readNotification, clearAllNotifications } from "./notificationHelpers";

const notificationRoutes = Router();

// get notification for a user
notificationRoutes.get("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user?.userID;
        if (!userID) {
            return res.status(400).json({ error: "Missing user ID in token" });
        }
        const notifications = await getNotifications(userID);
        return res.json(notifications);
    }
    catch (err) {
        console.error("error in geeting notifications", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// create a new notification
notificationRoutes.post("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user?.userID;
        const { message, type, comesFromID } = req.body;
        if (!userID || !message || !type || !comesFromID) {
            return res.status(400).json({ error: "missing fields"});
        }
        const newNotification = await createNotification(userID, message, type, comesFromID);
        return res.status(201).json(newNotification);
    }
    catch (err) {
        console.error("error in creating notification", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// delete a notification
notificationRoutes.delete("/:notificationID", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user?.userID;
        const notificationID = Number(req.params.notificationID);
        if (!userID || !notificationID) {
            return res.status(400).json({ error: "missing fields"});
        }
        const deletedNotification = await readNotification(notificationID);
        return res.json(deletedNotification);
    }
    catch (err) {
        console.error("error in deleting notification", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// clear all notifications
notificationRoutes.delete("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user?.userID;
        if (!userID) {
            return res.status(400).json({ error: "missing fields"});
        }
        const deletedNotifications = await clearAllNotifications(userID);
        return res.json(deletedNotifications);
    }
    catch (err) {
        console.error("error in clearing all notifications", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default notificationRoutes;