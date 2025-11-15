import { Router } from "express";
import gameRoutes from "./game/game";
import authRoutes from "./auth/auth"

// routes for our api.
const router = Router();

router.use("/game", gameRoutes);

router.use((req, res) => {
    res.status(404).send("page not found");
})

export default router;