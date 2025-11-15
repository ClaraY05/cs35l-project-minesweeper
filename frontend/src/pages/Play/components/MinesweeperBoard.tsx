import { useState, useMemo } from 'react';
import { PublicCellData } from '../../../types/frontend-gametypes';
import './minesweeper-board.css'

type HiddenCell = {
    hasMine: boolean;
    adjacentMines: number;
};

const ROWS = 9;
const COLS = 9;
const MINES = 10;

const Tile = ({ className, content, onLeftClick, onRightClick } : any) => {
    return (
        <div
            className={className}
            // Left click => reveal cell or flood-fill
            onClick={onLeftClick}
            // Right click => flag
            onContextMenu={(e) => {
                e.preventDefault();
                onRightClick();
            }}
        >
            {/* content is what the player sees: null, number, "M" , or "F" */}
            {content}
        </div>
    )
}

// generate random hidden board in place of testBoard

// Helper Functions
function indexToCoord(i : number) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    return { row, col };
}

function coordToIndex(row : number, col : number) : number {
    return row * COLS + col;
}

function getNeighborIndices(i : number) : number[] {
    const { row, col } = indexToCoord(i);
    const neighbors : number[] = [];
    
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) // the cell itself => skip
                continue;

            const nr = row + dr;
            const nc = col + dc;

            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) // out of bounds => skip
                continue;

            neighbors.push(coordToIndex(nr, nc));
        }
    }
    
    return neighbors;
}

// create hidden board with mines and neighbor counts client-side
function createHiddenBoard(): HiddenCell[] {
    const totalCells = ROWS * COLS;

    // start with all empty cells
    const cells: HiddenCell[] = Array.from({ length: totalCells}, () => ({
        hasMine: false,
        adjacentMines: 0,
    }))

    // create array, shuffle, and choose the mines
    const indices = Array.from({ length: totalCells}, (_, i) => i);

    for (let i = indices.length - 1; i > 0; i--) { // Fisher-Yates
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    for (let k = 0; k < MINES; k++) {
        const mineIndex = indices[k];
        cells[mineIndex].hasMine = true;
    }

    // compute adjacentMines for every non-mine cell
    for(let i = 0; i < totalCells; i++) {
        const cell = cells[i];
        if(cell.hasMine) {
            cell.adjacentMines = 0; // if a cell has a mine a number will not be displayed
            continue;
        }

        const neighbors = getNeighborIndices(i);
        let count = 0;
        for(const nIdx of neighbors) {
            if(cells[nIdx].hasMine)
                count++;
        }
        cell.adjacentMines = count;
    }

    return cells;
}

function makeContentFromHidden(cell: HiddenCell) {
    if (cell.hasMine) {
        return { Type: "mine" as const };
    }
    return { Type: "number" as const, Number: cell.adjacentMines as GameTypes.CellNumber};
}

// regien reveal (flood-fill)
function revealRegion(hiddenBoard : HiddenCell[], currentTiles : Array<PublicCellData | null>, startIndex : number) : Array<PublicCellData | null> {
    const newTiles = [...currentTiles];
    const queue: number[] = [startIndex] // BFS queue

    while (queue.length > 0) {
        const i = queue.shift() as number;
        const hidden = hiddenBoard[i];
        const tile = newTiles[i];

        const isFlagged = tile && "Flagged" in tile.State ? tile.State.Flagged : false;
        if (tile?.State.Visibility === "revealed" || isFlagged)
            continue;

        if (hidden.hasMine) // never flood through mines
            continue;

        newTiles[i] = {
            Content: makeContentFromHidden(hidden),
            State: { Visibility: "revealed" },
        };

        if (hidden.adjacentMines > 0)
            continue;

        const neighbors = getNeighborIndices(i);
        for (const nIdx of neighbors) {
            const neighborTile = newTiles[nIdx];
            const neighborFlagged = neighborTile && "Flagged" in neighborTile.State ? neighborTile.State.Flagged : false;
            if (!neighborTile || (neighborTile.State.Visibility === "hidden" && !neighborFlagged)) {
                queue.push(nIdx);
            }
        }
    }

    return newTiles;
}

const MinesweeperBoard = ({ GameID } : { GameID : number }) => {
    const [Tiles, setTiles] = useState<Array<PublicCellData | null>>(() => Array(ROWS * COLS).fill(null));

    const hiddenBoard = useMemo(() => createHiddenBoard(), []);

    const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

    const handleTileRightClick = (i : number) : void => {
        const cell = Tiles[i];

        // if already revealed, don't flag
        if (cell?.State.Visibility === 'revealed')
            return;

        const newTiles = [...Tiles];

        // previous flag status, defaults to false if we don't know
        const wasFlagged = cell && "Flagged" in cell.State ? cell.State.Flagged : false;

        const newCell : PublicCellData = {
            Content: cell?.Content ?? null,
            State: {
                Visibility: "hidden", 
                Flagged: !wasFlagged,
            },
        };
        
        newTiles[i] = newCell;
        setTiles(newTiles);
    }

    const handleTileLeftClick = (i : number) : void => {
        const cell = Tiles[i];

        const isFlagged = cell && "Flagged" in cell.State ? cell.State.Flagged : false;
        if (cell?.State.Visibility === 'revealed' || isFlagged)
            return; // save api calls & block flagged cells from reveal

        const hidden = hiddenBoard[i];
        if (hidden.hasMine) {
            const newTiles = [...Tiles];

            hiddenBoard.forEach((hc, idx) => {
                if (hc.hasMine) {
                    newTiles[idx] = {
                        Content: makeContentFromHidden(hc),
                        State: { Visibility: "revealed"},
                    };
                }
            });

            setTiles(newTiles);
            setStatus("lost");
            return;
        }

        // Non-mine:
        if (hidden.adjacentMines > 0) {
            const newTiles = [...Tiles];
            newTiles[i] = {
                Content: makeContentFromHidden(hidden),
                State: { Visibility: "revealed" },
            };
            setTiles(newTiles);
        } else {
            const newTiles = revealRegion(hiddenBoard, Tiles, i);
            setTiles(newTiles);
        }
        // fetch(`http://localhost:8000/api/game/${GameID}/cell/${i}/reveal`) // for performance.
        // .then(res => {    
        //     if (!res.ok)
        //         throw res; // if express returns 409
            
        //     return res.json() as Promise<GameTypes.CellContent>;
        // })
        // .then(data => {
        //     setTiles(oldTiles => {
        //         const newTiles = [...oldTiles];
        //         const oldCell = oldTiles[i];
                
        //         const newCell: PublicCellData = {
        //             Content: data,
        //             State: {
        //                 Visibility: "revealed",
        //             }
        //         };
        //         newTiles[i] = newCell;
        //         return newTiles;
        //     });
        // })
        // .catch((err) => console.error(err));
    };

    return (
        <div className="minesweeper-board-container">
            <div className="minesweeper-board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                {
                    Tiles.map((cell, i) => {
                        const isRevealed = cell?.State.Visibility === "revealed";
                        const isHidden = cell?.State.Visibility === "hidden";
                        const isFlagged = cell && "Flagged" in cell.State ? cell.State.Flagged : false;

                        const content = cell === null ? null 
                        : isHidden && isFlagged ? "F" 
                        : cell.Content === null ? null 
                        : cell.Content.Type === "mine" ? "M" 
                        : cell.Content.Number;

                        return (
                            <Tile key={i} 
                            className={`minesweeper-tile ${isRevealed ? "revealed" : ""}`} 
                            content={content}
                            onLeftClick={() => handleTileLeftClick(i)}
                            onRightClick={() => handleTileRightClick(i)}
                            />
                        );
                    })
                }
            </div>
        </div>
    );
};

export default MinesweeperBoard;