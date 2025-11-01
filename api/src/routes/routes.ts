import { Router } from "express";
import gameRoutes from "./game/game";

// routes for our api.
const router = Router();

// test endpoint /api
router.get("/", (req, res) => {
    res.send("hello world");
})

router.use("/game", gameRoutes);

router.use((req, res) => {
    res.status(404).send("page not found");
})

export default router;