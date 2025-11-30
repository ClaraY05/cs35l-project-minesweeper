import { pool } from "../../db/db";

type GameStatusDB = "waiting" | "play" | "end_win" | "end_lose";

export const updateGameStatus = async (
    gameId: number,
    status: GameStatusDB
): Promise<void> => {
    try {
        await pool.query(
            `
            UPDATE games
            SET status = $1,
                ended_at = CASE
                                WHEN $1 IN ('end_win', 'end_lose')
                                THEN (NOW() AT TIME ZONE 'UTC')
                                ELSE ended_at
                            END
            WHERE game_id = $2
            `,
            [status, gameId]
        );
    } catch (err) {
        console.error("Error updating game status:", err);
        throw err;
    }
};

export const addNewGame = async (
    userID : number, 
    boardData : GameTypes.CellData[], 
    rows : number, 
    cols : number, 
    mines : number, 
    difficulty : GameTypes.Difficulty
) : Promise<number> => {
    try {
        // TODO: initiate statuses after first click.
        const result = await pool.query(
        `
        INSERT INTO games (user_id, board_data, rows, cols, mines, diff_level, status, started_at)
        VALUES ($1, $2, $3, $4, $5, $6, 'play', (NOW() AT TIME ZONE 'UTC'))
        RETURNING game_id
        `,
        [userID, JSON.stringify(boardData), rows, cols, mines, String(difficulty)]
        );
        return Number(result.rows[0].game_id);
    }
    catch (err) {
        console.error("Error adding game:", err);
        throw err;
    }
};

export const getGameById = async (gameId: number): Promise<any> => {
    try {
        // TODO: guards to ensure user matches user created ?
        const result = await pool.query(
            `
            SELECT *
            FROM games
            WHERE game_id = $1
            `,
            [gameId]
        );

        // No game found
        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
    } catch (err) {
        console.error("Error fetching game:", err);
        throw err;
    }
};