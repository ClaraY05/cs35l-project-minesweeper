import { Router } from "express";
import gameRoutes from "./game/game";
import authRoutes from "./auth/auth";
import friendsRoutes from "./friends/friends";
import leaderboardRoutes from "./leaderboard/leaderboard";
import settingsRoutes from "./settings/settings";
import profilePictureRoutes from "./pfp/pfp";

// routes for our api.
const router = Router();

router.use("/game", gameRoutes);
router.use("/auth", authRoutes);
router.use("/friends", friendsRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/settings", settingsRoutes);
router.use("/pfp", profilePictureRoutes);

router.use((req, res) => {
    res.status(404).send("page not found");
})

export default router;