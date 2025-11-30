import { Router } from "express";
import { createBoard, revealRegion, validateBoard } from "./helpers";
import { addNewGame, getGameById, updateGameStatus } from "./db-helpers";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";

// routes relating to game
const gameRoutes = Router();

// create a game and return its id to the frontend.
gameRoutes.post("/create", authenticateToken, async (req: AuthRequest, res) => {
    const rows = Number(req.body.rows);
    const cols = Number(req.body.cols);
    const mines = Number(req.body.mines);
    const difficulty : GameTypes.Difficulty = String(req.body.difficulty) as GameTypes.Difficulty;
    const first = Number(req.body.firstClickedCell)

    // Basic validation
    if (!rows || !cols || rows <= 0 || cols <= 0) {
        return res.status(400).json({ error: "rows and columns must be positive integers" });
    }

    const boardData : GameTypes.CellData[] = createBoard(rows, cols, mines, first);
    validateBoard(boardData, rows, cols);
    
    const userID = Number(req.user?.userID);

    const gameID = await addNewGame(userID, boardData, rows, cols, mines, difficulty);

    return res.json({ game_id: gameID });
});

// --- routes requiring a game be active
// reveal a cell. 
// gets a cell's content. TODO: add cell index to set of revealed cells for win condition tracking
gameRoutes.post("/cell/reveal", authenticateToken, async (req: AuthRequest, res)  => {
    const game_id = Number(req.body.gameid);
    const cell_id = Number(req.body.cellid);
    const game = await getGameById(game_id);

    if (!game) {
        return res.status(404).send("Unknown game id");
    } else {  
        // ensure the caller owns this game
        const userID = Number(req.user?.userID);
        if (game.user_id !== userID) {
            return res.status(403).json({ error: "Not your game" });
        } 
        // if player revealed a mine, mark a loss by force
        const revealedCells = revealRegion(game.board_data, cell_id, game.rows, game.cols);
        if (revealedCells[0]?.Content.Type === "mine") {  
            await updateGameStatus(game_id, "lost");
        }
        return res.json(revealedCells);
    } 
});

// mark a game as finished (win or loss) and set ended_at
gameRoutes.post("/:gameid/finish", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const gameId = Number(req.params.gameid);
        const { status } = req.body as { status: GameTypes.GameState };

        if (status !== "won" && status !== "lost") {
            return res.status(400).json({ error: "Invalid status" });
        }

        const game = await getGameById(gameId);
        if(!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        // ensure the caller owns this game
        const userID = Number(req.user?.userID);
        if (game.user_id !== userID) {
            return res.status(403).json({ error: "Not your game" });
        }

        await updateGameStatus(gameId, status);

        return res.json({ game_id: gameId, status });
    } catch (err) {
        console.error("Error in POST /game/:gameid/finish:", err);
        return res.status(500).json({ error: "Failed to finish game" });
    }
});

export default gameRoutes;