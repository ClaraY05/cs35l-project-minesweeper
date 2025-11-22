import { Router } from "express";
import { pool } from "../../db/db";
import { authenticateToken } from "../middleware/authMiddleware";

const leaderboardRoutes = Router();

leaderboardRoutes.get("/", authenticateToken, async (req, res)=>{
    try{
        const result = await pool.query(`
            SELECT
                U.username,
                MIN(S.score) AS best_score,
                MIN(S.created_at) AS earlier_score
            FROM users as U
            JOIN scores as S ON S.user_id = U.user_id
            WHERE S.game_status = 'win'
            GROUP BY U.user_id, U.username
            ORDER BY best_score ASC, earlier_score ASC
            LIMIT 20
        `);
        res.json(result.rows);
    } catch(err){
        console.error(err);
        res.status(500).json({error: "Internal server error"});
    }
});

export default leaderboardRoutes;