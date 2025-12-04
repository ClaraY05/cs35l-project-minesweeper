import { useEffect, useState } from 'react';
import { PublicCellData } from '../../../types/frontend-gametypes';
import './minesweeper-board.css'
import { authFetch } from '../../../api/authFetch';
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_KEYBINDS } from "../../../../../utils/defaultSettings"

const Tile = ({ className, content, onLeftClick, onRightClick, onMouseEnter } : any) => {
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
            onMouseEnter={onMouseEnter}
        >
            {/* content is what the player sees: null, number, "M" , or "F" */}
            {content}
        </div>
    )
};

const MinesweeperBoard = ({ GameID, rows, cols, mines, onFirstClick, onRestart } : { GameID : number | null, rows : number, cols : number, mines: number, onFirstClick : (arg0 : number) => Promise<any>, onRestart?: () => Promise<void> | void }) => {
    const [Tiles, setTiles] = useState<Array<PublicCellData | null>>(() => Array(rows * cols).fill(null)); // frontend cell data store. null means "dont know"

    // UI status only
    const [status, setStatus] = useState<GameTypes.GameState>("playing");

    // timer
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedMs, setElapsedMs] = useState<number>(0);
    const seconds = (elapsedMs / 1000).toFixed(1);

    // count of non-mine cells that have been revealed
    const [revealedSafeCount, setRevealedSafeCount] = useState<number>(0);

    // keybinds
    const [keybinds] = useLocalStorage("keybinds", DEFAULT_KEYBINDS);
    // console.log(keybinds.openCell);
    // console.log(keybinds.flagCell);
    // console.log(keybinds.chord);
    // console.log(keybinds.restartGame);
    // console.log(keybinds.escapeGame);

    // track tile that mouse hovers over on key press
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // whenever game ID changes, reset board state
    const resetLocalState = () => {
        setTiles(Array(rows * cols).fill(null));
        setStatus("playing");
        setStartTime(null);
        setElapsedMs(0);
        setRevealedSafeCount(0);
    };

    useEffect(() => {
        resetLocalState();
    }, [rows, cols]);

    // useEffect(() => {
    //     setTiles(Array(rows * cols).fill(null));
    //     setStatus("playing");
    //     setStartTime(null);
    //     setElapsedMs(0);
    //     setRevealedSafeCount(0);
    // }, [GameID, rows, cols]);

    useEffect(() => {
        if (status !== "playing" || startTime === null) return;

        const id = setInterval(() => {
            setElapsedMs(Date.now() - startTime);
        }, 100);

        return () => clearInterval(id);
    }, [status, startTime]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // only react while game is in progress
            if (status !== "playing")
                return;

            if (focusedIndex === null)
                return;

            const code = event.key; // not event.code because we store "F", "ESC", rather than "KEY F", or "ESCAPE"
            console.log(event.key);

            if (code === keybinds.openCell) {
                event.preventDefault();
                handleTileLeftClick(focusedIndex);
                return;
            }

            if (code === keybinds.flagCell) {
                event.preventDefault();
                handleTileRightClick(focusedIndex);
                return;
            }

            if (code === keybinds.chord) {
                event.preventDefault();
                // TODO: implement chording logic later
                return;
            }

            if (code === keybinds.escapeGame) {
                event.preventDefault();
                // TODO: onEscape()
                return;
            }

            if (code === keybinds.restartGame) {
                event.preventDefault();
                resetLocalState(); // local board + timer reset
                if (onRestart)
                    onRestart(); // tell parent to clearn Game ID
                return;
            }
            
            //  powerup1 and powerup 2 can be wired here one the feature exists
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [keybinds, status, focusedIndex]);
    
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
        
        // save api calls
        const cell = Tiles[i];
        const isFlagged = cell && "Flagged" in cell.State ? cell.State.Flagged : false;
        if (cell?.State.Visibility === 'revealed' || isFlagged)
            return;

        // start game on first click
        let gameIdToUse = GameID;
        if (gameIdToUse === null) {
            if (!onFirstClick) {
                console.error("No GameID and no onFirstClick handler provided.");
                return;
            }
            gameIdToUse = await onFirstClick(i);
            await cellRevealHelper(i, gameIdToUse); // reveal first cell
            setStartTime(Date.now());
            return; // force re-render with new GameID
        }
        
        // not first click? then just reveal cells normally
        await cellRevealHelper(i);
    };

    const cellRevealHelper = async (i : number, GameIDToUse : number|null = GameID) => {
        // get board data from server for revealed cell
        let res;
        try {
            res = await authFetch(`http://localhost:8000/api/game/cell/reveal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameid: GameIDToUse, cellid: i })
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
            const cell = Tiles[revealedCell.Position];
            const isRevealed = cell?.State.Visibility === "revealed";
            let isFlagged = cell && "Flagged" in cell.State ? cell.State.Flagged : false;
            
            if (revealedCell.Content.Type === "mine") isFlagged = false; // if the game ends (hit a mine), reveal the cell even if flagged

            if (isRevealed || isFlagged) // if flagged or already revealed, don't reveal (floodfill from backend can still return these)
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
            return;
        }

        // check win condition: all safe cells are revealed
        const totalSafeCells = rows * cols - mines;
        if (newRevealedSafeCount === totalSafeCells) {
            setStatus("won");
        }
    }

    return (
        <div className="minesweeper-wrapper">
            <div className="minesweeper-board-container flex flex-row items-center justify-around">
                <div className="game-status-bar h-full">
                    <span className="game-status-text"> 
                        Status: {status} &nbsp;&nbsp; Time: {seconds}s
                    </span>
                </div>
                {/* <div>Focused index: {focusedIndex === null ? "none" : focusedIndex}</div> */}
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
                                className={`minesweeper-tile ${isRevealed ? "revealed" : ""} ${focusedIndex === i ? "focused-tile" : ""}`} 
                                content={content}
                                onLeftClick={() => handleTileLeftClick(i)}
                                onRightClick={() => handleTileRightClick(i)}
                                onMouseEnter={() => setFocusedIndex(i)}
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