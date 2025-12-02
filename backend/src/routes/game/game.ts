import { Router } from "express";
import { createBoard, revealRegion, validateBoard } from "./helpers";
import { addNewGame, getGameById, updateGameStatus, updateRevealedCells, updateStartTime } from "./db-helpers";
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
// gets a cell's content. checks immediately if the game has been won or lost
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
        if (!game.started_at) {
            await updateStartTime(game_id);
        }
        // if player revealed a mine, mark a loss by force
        const revealedCells = revealRegion(game.board_data, cell_id, game.rows, game.cols);
        const numRevealed = await updateRevealedCells(game_id, revealedCells.length);
        if (revealedCells[0]?.Content.Type === "mine") { 
            let gametime = await updateGameStatus(game_id, "lost")
            console.log(gametime);
        }
        else if (numRevealed === game.rows*game.cols-game.mines) {
            console.log("player won")
            await updateGameStatus(game_id, "won");
        }
        return res.json(revealedCells);
    } 
});

export default gameRoutes;