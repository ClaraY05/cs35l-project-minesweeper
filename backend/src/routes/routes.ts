import { Router } from "express";
import gameRoutes from "./game/game";
import authRoutes from "./auth/auth";
import friendsRoutes from "./friends/friends";
import leaderboardRoutes from "./leaderboard/leaderboard";
import profilePictureRoutes from "./pfp/pfp";
import notificationRoutes from "./notifications/notification";

// routes for our api.
const router = Router();

router.use("/game", gameRoutes);
router.use("/auth", authRoutes);
router.use("/friends", friendsRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/pfp", profilePictureRoutes);
router.use("/notifications", notificationRoutes);

router.use((req, res) => {
    res.status(404).send("page not found");
})

export default router;