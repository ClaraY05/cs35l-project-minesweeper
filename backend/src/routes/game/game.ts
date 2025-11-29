import { generateKey } from "crypto";
import { Router } from "express";
import { createBoard, revealRegion } from "./helpers";

// routes relating to game
const gameRoutes = Router();

// -------- unassigned
// TODO: first click safety
// --------

// the generated board. will need to throw this into db later to support multiple live games probably
let boardData : GameTypes.CellData[] = [];

// create a game and return its id to the frontend.
gameRoutes.post("/create", (req, res) => {
    const { rows, cols, mines } = req.body;

    // Basic validation
    if (!rows || !cols || rows <= 0 || cols <= 0) {
        return res.status(400).json({ error: "rows and columns must be positive integers" });
    }

    boardData = createBoard(rows, cols, mines);
    return res.json({ game_id: 1 });
})

// --- routes requiring a game be active
// reveal a cell. 
// gets a cell's content. TODO: add cell index to set of revealed cells for win condition tracking
gameRoutes.post("/:gameid/cell/:cellid/reveal", (req, res) => {
    const game_id = Number(req.params.gameid);
    const cell_id = Number(req.params.cellid);
    const { rows, columns } = req.body;
     // TODO: remove placeholder with actual game ids that generate
    if (game_id === 1) {
        return res.json(revealRegion(boardData, cell_id, rows, columns)); // TODO: change this to backend storing size of each game rather than passing size in on every call
    } else {    
        return res.status(404).send("Unknown game id");
    } 
})


export default gameRoutes;