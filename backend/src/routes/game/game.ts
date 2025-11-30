import { generateKey } from "crypto";
import { Router } from "express";
import { createBoard, revealRegion, validateBoard } from "./helpers";
import { addNewGame, getGameById } from "./db-helpers";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";

// routes relating to game
const gameRoutes = Router();

// -------- 
// TODO: first click safety
// --------

// create a game and return its id to the frontend.
gameRoutes.post("/create", authenticateToken, async (req: AuthRequest, res) => {
    const rows = Number(req.body.rows);
    const cols = Number(req.body.cols);
    const mines = Number(req.body.mines);
    const difficulty : GameTypes.Difficulty = String(req.body.difficulty) as GameTypes.Difficulty;

    // Basic validation
    if (!rows || !cols || rows <= 0 || cols <= 0) {
        return res.status(400).json({ error: "rows and columns must be positive integers" });
    }

    const boardData : GameTypes.CellData[] = createBoard(rows, cols, mines);
    validateBoard(boardData, rows, cols);
    
    const userID = Number(req.user?.userID);

    const gameID = await addNewGame(userID, boardData, rows, cols, mines, difficulty);

    return res.json({ game_id: gameID });
})

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
        return res.json(revealRegion(game.board_data, cell_id, game.rows, game.cols));
    } 
})


export default gameRoutes;