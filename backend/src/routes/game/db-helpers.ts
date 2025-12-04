import { pool } from "../../db/db.js";

type GameStatusDB = "waiting" | "play" | "end_win" | "end_lose";

export const updateRevealedCells = async (
    gameId: number,
    revealedCells: GameTypes.CellData[]
): Promise<number | null> => {
    try {
        // block writes after status has been updated to end_x.
        const curStatus = await getGameStatus(gameId);
        if (curStatus !== "play") 
            return null;

        for (const cell of revealedCells) {
            await pool.query(
                `
                UPDATE games
                SET revealed_cells =
                    CASE
                        WHEN NOT $1 = ANY (revealed_cells)
                        THEN array_append(revealed_cells, $1)
                        ELSE revealed_cells
                    END
                WHERE game_id = $2;
                `,
                [cell.Position, gameId]
            );
        }

        const res = await pool.query (
            `SELECT cardinality(revealed_cells) AS num_revealed
            FROM games
            WHERE game_id = $1;
            `,[gameId]
        );
        
        return res.rows[0].num_revealed;
    } catch (err) {
        console.error("Error updating game status:", err);
        throw err;
    }
};

export const updateGameStatus = async (
    gameId: number,
    status: GameTypes.GameState
): Promise<any> => {
    try {
        // block writes after status has been updated to end_x.
        const curStatus = await getGameStatus(gameId);
        if (curStatus !== "play") 
            return;

        const dbstatus : GameStatusDB = status === "won" ? "end_win" : "end_lose";
        let res = await pool.query(
            `
            UPDATE games
            SET status = $1,
            ended_at = CASE
                                WHEN $1 IN ('end_win', 'end_lose')
                                THEN (NOW() AT TIME ZONE 'UTC')
                                ELSE ended_at
                            END
            WHERE game_id = $2
            RETURNING EXTRACT(EPOCH FROM (ended_at - started_at)) * 1000 AS gametime_ms
            `,
            [dbstatus, gameId]
        );
        return res.rows[0].gametime_ms;
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
        const result = await pool.query(
        `
        INSERT INTO games (user_id, board_data, rows, cols, mines, diff_level, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'play')
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

export const updateStartTime = async(gameId: number):Promise<any> =>{
    try {
        const result = await pool.query(
            `UPDATE games
            SET started_at = (NOW() AT TIME ZONE 'UTC')
            WHERE game_id = $1
            `,[gameId]
        );
    } catch (err) {
        console.error("Error updating start time: ", err);
        throw err;
    }
}

// check what game queried status is, if any.
const getGameStatus = async (gameId: number): Promise<GameStatusDB | null> => {
    try {
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

        return result.rows[0].status as GameStatusDB;
    } catch (err) {
        console.error("Error fetching game:", err);
        throw err;
    }
};