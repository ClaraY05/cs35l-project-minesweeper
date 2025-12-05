import { Router } from "express";
import gameRoutes from "./game/game.js";
import authRoutes from "./auth/auth.js";
import friendsRoutes from "./friends/friends.js";
import leaderboardRoutes from "./leaderboard/leaderboard.js";
import settingsRoutes from "./settings/settings.js";
import profilePictureRoutes from "./pfp/pfp.js";
import notificationRoutes from "./notifications/notification.js";

// routes for our api.
const router = Router();

// Health check endpoint for testing
router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

router.use("/game", gameRoutes);
router.use("/auth", authRoutes);
router.use("/friends", friendsRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/settings", settingsRoutes);
router.use("/pfp", profilePictureRoutes);
router.use("/notifications", notificationRoutes);

router.use((req, res) => {
    res.status(404).send("page not found");
})

export default router;