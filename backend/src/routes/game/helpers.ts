
// local type to make board generation easier. might refactor later
// not to be used outside of helpers. defer to global types instead
type HiddenCell = {
    hasMine: boolean;
    adjacentMines: GameTypes.CellNumber;
}

// Helper Functions
function indexToCoord(i : number, COLS : number) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    return { row, col };
}

function coordToIndex(row : number, col : number, COLS : number) : number {
    return row * COLS + col;
}

function getNeighborIndices(i : number, ROWS : number, COLS : number) : number[] {
    const { row, col } = indexToCoord(i, COLS);
    const neighbors : number[] = [];
    
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) // the cell itself => skip
                continue;

            const nr = row + dr;
            const nc = col + dc;

            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) // out of bounds => skip
                continue;

            neighbors.push(coordToIndex(nr, nc, COLS));
        }
    }
    
    return neighbors;
}

/**
 * Generate a random board with computed neighbor counts server-side.
 * @param FIRST the first clicked cell (safety guarantee.) pass null if don't care
 * @returns A randomly generated board
 */
export function createBoard(ROWS : number, COLS : number, MINES : number, FIRST : number | null): GameTypes.CellData[] {
    const totalCells = ROWS * COLS;

    // start with all empty cells
    const cells: HiddenCell[] = Array.from({ length: totalCells }, () => ({
        hasMine: false,
        adjacentMines: 0,
    }))

    // create array, shuffle
    const indices = Array.from({ length: totalCells }, (_, i) => i);

    for (let i = indices.length - 1; i > 0; i--) { // Fisher-Yates
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // choose first MINES indicies as mines (k), unless that index is the FIRST click
    // k should never go out of bounds because MINES << totalCells always but added a check anyways
    for (let i = 0, k = 0; i < MINES && k < indices.length; i++, k++) {
        const mineIndex = indices[k];
        if (mineIndex === FIRST) {
            k++;
            i--;
            continue;
        }
        cells[mineIndex].hasMine = true;
    }

    // compute adjacentMines for every non-mine cell
    for(let i = 0; i < totalCells; i++) {
        const cell = cells[i];
        if(cell.hasMine) {
            cell.adjacentMines = 0; // if a cell has a mine a number will not be displayed
            continue;
        }

        const neighbors = getNeighborIndices(i, ROWS, COLS);
        let count = 0;
        for(const nIdx of neighbors) {
            if(cells[nIdx].hasMine)
                count++;
        }
        cell.adjacentMines = count as GameTypes.CellNumber;
    }

    let generatedBoard : GameTypes.CellData[] = []; // return a board from generation data respecting type contracts

    for (let i = 0; i < cells.length; i++) {
        generatedBoard.push({
            Content: cells[i].hasMine ? { Type: "mine" as const } as GameTypes.CellContent : { Type: "number" as const, Number: cells[i].adjacentMines } as GameTypes.CellContent,
            Position: i
    } as GameTypes.CellData);
    }

    return generatedBoard;
}

/**
 * Uses floodfill to compute all cells to reveal given a base reveal cell, *regardless of flagged or revealed state*
 * @param boardData The data of the board to reveal on
 * @param cellIndex The base cell to reveal
 * @returns Array of all cells to be revealed. Up to frontend to interpret the data correctly
 */
export function revealRegion(boardData : GameTypes.CellData[], cellIndex : number, ROWS : number, COLS : number) : GameTypes.CellData[] {
    let revealedCells : GameTypes.CellData[] = []; 

    // check first cell first, then do floodfill logic if it applies
    if (boardData[cellIndex].Content.Type === "mine") { // if caught a mine, send back all mines
        for (const cell of boardData) {
            if (cell.Content.Type === "mine") {
                revealedCells.push(cell);
            }
        }
        return revealedCells;
    } else if (boardData[cellIndex].Content.Number !== 0) {
        return [boardData[cellIndex]];
    } 

    const queue: number[] = [cellIndex] // BFS queue
    const visited: number[] = []; // so that the BFS doesn't crawl back onto itself. wasn't needed in Marissa's implementation bc she tracked revealed on frontend
    visited.push(cellIndex);

    while (queue.length > 0) {
        const i = queue.shift() as number;
        const hidden = boardData[i];

        if (hidden.Content.Type === "mine") // never flood through mines
            continue;

        revealedCells.push(boardData[i]);

        if (hidden.Content.Number !== 0) // stop at first non-0 border
            continue;

        const neighbors = getNeighborIndices(i, ROWS, COLS);
        for (const nIdx of neighbors) {
            if(!visited.includes(nIdx)) {
                queue.push(nIdx);
                visited.push(nIdx);
            }
        }
    }

    return revealedCells;
}

// helpers.ts (or a debug utils file)
export function validateBoard(boardData: GameTypes.CellData[], ROWS : number, COLS : number): void {
    const errors: string[] = [];

    const totalCells = boardData.length;

    for (let i = 0; i < totalCells; i++) {
        const cell = boardData[i];
        if (cell.Content.Type === "mine") continue;

        const neighbors = getNeighborIndices(i, ROWS, COLS);
        let count = 0;

        for (const nIdx of neighbors) {
            if (boardData[nIdx].Content.Type === "mine") {
                count++;
            }
        }

        if (count !== cell.Content.Number) {
            errors.push(
                `Mismatch at index ${i}: displayed=${cell.Content.Number}, actual=${count}`
            );
        }
    }

    console.log("Board validation:", errors.length === 0 ? "OK" : errors);
    errors.forEach(e => console.error(e));
}

export function chordReveal(
    boardData: GameTypes.CellData[],
    cellIndex: number,
    flaggedNeighbors: number[],
    ROWS: number,
    COLS: number
): GameTypes.CellData[] {
    const base = boardData[cellIndex];

    // must be a number cell to chord
    if (base.Content.Type !== "number") {
        return [];
    }

    const neighbors = getNeighborIndices(cellIndex, ROWS, COLS);

    // count how many of those neighbors are flagged
    const flaggedCount = neighbors.filter((idx) =>
        flaggedNeighbors.includes(idx)
    ).length;

    // only chord when flags match the number
    if (flaggedCount !== base.Content.Number) {
        return [];
    }

    // reveal all neighbors that are not flagged, using the existing flood-fill logic
    const revealedMap = new Map<number, GameTypes.CellData>();

    for (const nIdx of neighbors) {
        // flagged cells are not revealed
        if (flaggedNeighbors.includes(nIdx))
            continue;
        
        const region = revealRegion(boardData, nIdx, ROWS, COLS);
        for (const cell of region) {
            revealedMap.set(cell.Position, cell);
        }
    }

    return Array.from(revealedMap.values());
}