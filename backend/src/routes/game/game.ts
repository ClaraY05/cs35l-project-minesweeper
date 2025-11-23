import { generateKey } from "crypto";
import { Router } from "express";
import { createBoard, revealRegion, validateBoard } from "./helpers";

// routes relating to game
const gameRoutes = Router();

// -------- unassigned
// TODO: first click safety
// TODO: dynamic board sizes
// --------

// the generated board. will need to throw this into db later to support multiple live games probably
let boardData : GameTypes.CellData[] = [];

// create a game and return its id to the frontend.
gameRoutes.post("/create", (req, res) => {
    boardData = createBoard();
    validateBoard(boardData);
    return res.json({ game_id: 1 });
})

// --- routes requiring a game be active
// reveal a cell. 
// gets a cell's content. TODO: add cell index to set of revealed cells for win condition tracking
gameRoutes.get("/:gameid/cell/:cellid/reveal", (req, res) => {
    const game_id = Number(req.params.gameid);
    const cell_id = Number(req.params.cellid);
     // TODO: remove placeholder with actual game ids that generate
    if (game_id === 1) {
        return res.json(revealRegion(boardData, cell_id));
    } else {    
        return res.status(404).send("Unknown game id");
    } 
})


export default gameRoutes;