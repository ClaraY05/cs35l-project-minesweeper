import { Router } from "express";

// routes relating to game
const gameRoutes = Router();

// -------- unassigned
// TODO: ids so that each game can be kept track of 
// TODO: add endpoints for game actions
// TODO: using those endpoints, have the server store game state and game data rather than passing the whole board to frontend
// TODO: have server compute neighor numbers and handle floodfill logic
// TODO: use type contracts for tile states
// TODO: first click safety
// TODO: dynamic board sizes
// --------

// currently sends a hardcoded 5x5 board to the frontend.
// for now 0 represents a blank space. null represents unrevealed space on frontend, but this can be fixed later
// TODO (Marissa): make board randomly generated on each /create call. optionally switch to 2d array
const testBoard = [
    1,1,1,0,0,
    1,"M",1,0,0,
    1,1,1,0,0,
    0,0,0,1,1,
    0,0,0,1,"M"
]

// create a game
gameRoutes.get("/create", (req, res) => {
    res.json({board:testBoard});
})

export default gameRoutes;