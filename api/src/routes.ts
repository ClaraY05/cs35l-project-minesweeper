import { Router } from "express";

// routes for our api.
const router = Router();

router.get("/", (req, res) => {
    res.send("hello world");
})

export default router;