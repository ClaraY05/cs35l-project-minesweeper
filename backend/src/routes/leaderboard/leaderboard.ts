import { Router } from "express";
import { pool } from "../../db/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const leaderboardRoutes = Router();

leaderboardRoutes.get("/", authenticateToken, async (req, res) => {
    const difficulty = req.query.difficulty as string;

    try {
        const result = await pool.query(`
            SELECT
                U.username,
                MIN(G.ended_at - G.started_at) AS best_time,
                MIN(G.ended_at) AS earlier_time
            FROM users AS U
            JOIN games AS G ON G.user_id = U.user_id
            WHERE G.status = 'end_win'
              AND G.diff_level = $1
            GROUP BY U.user_id, U.username
            ORDER BY best_time ASC, earlier_time ASC
            LIMIT 20;
        `, [difficulty]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default leaderboardRoutes;