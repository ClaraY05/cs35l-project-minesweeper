import { useEffect, useState } from 'react';
import { PublicCellData } from '../../../types/frontend-gametypes';
import './minesweeper-board.css'
import { authFetch } from '../../../api/authFetch';

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

const MinesweeperBoard = ({ GameID, rows, cols, mines, onFirstClick } : { GameID : number | null, rows : number, cols : number, mines: number, onFirstClick : (arg0 : number) => Promise<any> }) => {
    const [Tiles, setTiles] = useState<Array<PublicCellData | null>>(() => Array(rows * cols).fill(null)); // frontend cell data store. null means "dont know"

    // UI status only
    const [status, setStatus] = useState<GameTypes.GameState>("playing");

    // timer
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedMs, setElapsedMs] = useState<number>(0);

    // count of non-mine cells that have been revealed
    const [revealedSafeCount, setRevealedSafeCount] = useState<number>(0);

    // whenever game ID or board size changes, reset board state
    useEffect(() => {
        setTiles(Array(rows * cols).fill(null));
        setStatus("playing");
        setStartTime(null);
        setElapsedMs(0);
        setRevealedSafeCount(0);
    }, [rows, cols]);

    useEffect(() => {
        if (status !== "playing" || startTime === null) return;

        const id = setInterval(() => {
            setElapsedMs(Date.now() - startTime);
        }, 100);

        return () => clearInterval(id);
    }, [status, startTime]);

    const finishGameOnServer = async (gameId: number, status: "won" | "lost"): Promise<void> => {
        try {
            await authFetch(`http://localhost:8000/api/game/${gameId}/finish`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: status })
            });
        } catch (err) {
            const error = err as Error;
            console.error("Error finishing game:", error.message);
        }
    };

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
        // ignore clicks once game is over
        if (status === "won" || status === "lost")
            return;

        // start game on first click
        let gameIdToUse = GameID;
        if (gameIdToUse === null) {
            if (!onFirstClick) {
                console.error("No GameID and no onFirstClick handler provided.");
                return;
            }
            gameIdToUse = await onFirstClick(i);
            if (gameIdToUse === null) {
                console.error("Failed to start game on first click.");
                return;
            }
        }

        // start timer on first revealing click
        if (startTime === null) {
            setStartTime(Date.now());
        }

        // save api calls
        const cell = Tiles[i];
        const isFlagged = cell && "Flagged" in cell.State ? cell.State.Flagged : false;
        if (cell?.State.Visibility === 'revealed' || isFlagged)
            return;

        // get board data from server for revealed cell
        let res;
        try {
            res = await authFetch(`http://localhost:8000/api/game/cell/reveal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameid: gameIdToUse, cellid: i })
            });
        } catch (err) {
            const error = err as Error;
            console.log("Error during reveal: ", error.message);
            return;
        }

        const revealedCellData = res as GameTypes.CellData[];
        const newTiles = [...Tiles];
        let newRevealedSafeCount = revealedSafeCount;
        let hitMine = false;

        for (const revealedCell of revealedCellData) {
            // if flagged or already revealed, don't reveal (floodfill from backend can still return these)
            const cell = Tiles[revealedCell.Position];
            const isRevealed = cell?.State.Visibility === "revealed";
            const isFlagged = cell && "Flagged" in cell.State ? cell.State.Flagged : false;
            
            if (isRevealed || isFlagged)
                continue;

            // reveal the cell
            newTiles[revealedCell.Position] = {
                Content: revealedCell.Content,
                State: { Visibility: "revealed"},
            };

            if (revealedCell.Content.Type === "mine") {
                hitMine = true;
            } else {
                // only count new safe reveals
                newRevealedSafeCount += 1;
            }
        }

        setTiles(newTiles);
        setRevealedSafeCount(newRevealedSafeCount);

        if (hitMine) {
            setStatus("lost");
            if (gameIdToUse !== null) {
                finishGameOnServer(gameIdToUse, "lost");
            }
            return;
        }

        // check win condition: all safe cells are revealed
        const totalSafeCells = rows * cols - mines;
        if (newRevealedSafeCount === totalSafeCells) {
            setStatus("won");
            if(gameIdToUse !== null) {
                finishGameOnServer(gameIdToUse, "won");
            }
        }
    };

    const seconds = (elapsedMs / 1000).toFixed(1);

    return (
        <div className="minesweeper-wrapper">
            <div className="minesweeper-board-container">
                <div className="game-status-bar">
                    <span className="game-status-text"> 
                        Status: {status} &nbsp;&nbsp; Time: {seconds}s
                    </span>
                </div>
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
        </div>
    );
};

export default MinesweeperBoard;