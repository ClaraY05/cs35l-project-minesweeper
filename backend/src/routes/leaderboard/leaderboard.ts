import { Router } from "express";
import { pool } from "../../db/db";
import { authenticateToken } from "../middleware/authMiddleware";

const leaderboardRoutes = Router();

leaderboardRoutes.get("/", authenticateToken, async (req, res)=>{
    const difficulty=(req.query.difficulty as string);
    try{
        const result = await pool.query(`
            SELECT
                U.username,
                MIN(G.score) AS best_score,
                MIN(G.ended_at) AS earlier_score
            FROM users as U
            JOIN games as G ON G.user_id = U.user_id
            WHERE G.status = 'end_win' AND G.diff_level = $1
            GROUP BY U.user_id, U.username
            ORDER BY best_score ASC, earlier_score ASC
            LIMIT 20
        `,[difficulty]);
        res.json(result.rows);
    } catch(err){
        console.error(err);
        res.status(500).json({error: "Internal server error"});
    }
});

export default leaderboardRoutes;