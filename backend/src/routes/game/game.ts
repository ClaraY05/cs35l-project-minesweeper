import { Router } from "express";

// routes relating to game
const gameRoutes = Router();

// -------- unassigned
// TODO: have server compute neighor numbers and handle floodfill logic
// TODO: first click safety
// TODO: dynamic board sizes
// --------

// currently sends a hardcoded 5x5 board to the frontend.
// for now 0 represents a blank space. null represents unrevealed space on frontend, but this can be fixed later
// TODO (Marissa): make board randomly generated on each /create call. optionally switch to 2d array
const testBoardSample = [
    1,1,1,0,0,
    1,"M",1,0,0,
    1,1,1,0,0,
    0,0,0,1,1,
    0,0,0,1,"M"
]

const testBoardData: GameTypes.CellContent[] = [];

// create a game and return its id to the frontend.
gameRoutes.post("/create", (req, res) => {
    // initialize a board using sample data. 
    // TODO: should be changed later to generated board
    // TODO: precompute all floodfill regions serverside
    for (let i = 0; i < testBoardSample.length; i++) {
        let curCell: GameTypes.CellContent | null = null;
        if (testBoardSample[i] === "M") {
            curCell = {
                Type: 'mine' 
            };
        } else {
            curCell = {
                Type: 'number', Number: Number(testBoardSample[i]) as GameTypes.CellNumber  // TODO: change with safer logic rather than number assert
            };
        }
        testBoardData.push(curCell);
    }
    return res.json({game_id:1});
})

// --- routes requiring a game be active
// reveal a cell. 
// gets a cell's content. TODO: add cell index to set of revealed cells for win condition tracking
gameRoutes.get("/:gameid/cell/:cellid/reveal", (req, res) => {
    const game_id = Number(req.params.gameid);
    const cell_id = Number(req.params.cellid);
     // TODO: remove placeholder with actual game ids that generate
    if (game_id === 1) {
        return res.json(testBoardData[cell_id]);
    } else {    
        return res.status(404).send("Unknown game id");
    } 
})


export default gameRoutes;