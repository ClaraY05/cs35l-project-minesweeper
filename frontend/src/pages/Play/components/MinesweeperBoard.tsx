import { useEffect, useState } from 'react';
import { PublicCellData } from '../../../types/frontend-gametypes';
import './minesweeper-board.css'

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
};

const MinesweeperBoard = ({ GameID, rows, cols } : { GameID : number, rows : number, cols : number }) => {
    const [Tiles, setTiles] = useState<Array<PublicCellData | null>>(() => Array(rows * cols).fill(null)); // frontend cell data store. null means "dont know"
    const [status, setStatus] = useState<"playing" | "won" | "lost">("playing"); // TODO: notify server (Marissa's doing this)

    // whenever game ID or board size changes, reset board state
    useEffect(() => {
        setTiles(Array(rows * cols).fill(null));
        setStatus("playing");
    }, [GameID, rows, cols]);

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

    const handleTileLeftClick = async (i : number) : Promise<void> => {
        // save api calls
        const cell = Tiles[i];
        const isFlagged = cell && "Flagged" in cell.State ? cell.State.Flagged : false;
        if (cell?.State.Visibility === 'revealed' || isFlagged)
            return; 

        // get board data from server for revealed cell
        const res = await fetch(`http://localhost:8000/api/game/${GameID}/cell/${i}/reveal`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rows: rows, columns: cols })
        }); // localhost for performance. NOT DEPLOYABLE
        if (!res.ok) throw res;
        const revealedCellData = (await res.json()) as GameTypes.CellData[];

        const newTiles = [...Tiles];

        for (const revealedCell of revealedCellData) {
            // if flagged or already revealed, don't reveal (floodfill from backend can still return these)
            const cell = Tiles[revealedCell.Position];
            const isFlagged = cell && "Flagged" in cell.State ? cell.State.Flagged : false;
            if (cell?.State.Visibility === 'revealed' || isFlagged) continue;

            // reveal the cell
            newTiles[revealedCell.Position] = {
                Content: revealedCell.Content,
                State: { Visibility: "revealed"},
            };

            if (revealedCell.Content.Type === "mine") {
                // TODO: reveal all mines on loss

/*                 hiddenBoard.forEach((hc, idx) => {
                    if (hc.hasMine) {
                        newTiles[idx] = {
                            Content: makeContentFromHidden(hc),
                            State: { Visibility: "revealed"},
                        };
                    }
                }); */

                setStatus("lost");
            }
        }
        
        setTiles(newTiles);
    }

    return (
        <div className="minesweeper-board-container">
            <div className="minesweeper-board" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
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