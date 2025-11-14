import { useState } from 'react';
import * as GameTypes from "@localtypes/gametypes"
import './minesweeper-board.css'

// "any" is not good practice because it blocks typechecking, but is okay for prototyping
const Tile = ({ className, value, onLeftClick, onRightClick } : any) => {
    return (
    <div 
      className={className}
      onClick={onLeftClick}
      onContextMenu={
        (e) => {
            e.preventDefault();
            onRightClick();
        }
      }>
        {value}
    </div>
  )
}

const MinesweeperBoard = ({ GameID } : { GameID : number }) => {
    const [Tiles, setTiles] = useState<(GameTypes.CellContent | null)[]>(Array(5*5).fill(null));

    // TODO: have API handle flagging and board state checks
    const handleTileRightClick = (i : number) => {
/*         if (Tiles[i] && Tiles[i] !== "F") return; // revealed tiles cannot be flagged
        const newTiles = [...Tiles];
        Tiles[i] === "F" ? newTiles[i] = null : newTiles[i] = "F";
        setTiles(newTiles); */
    }

    const handleTileLeftClick = (i : number) => {
        // TODO: API should handle flagged cell clickblocking
        // if (Tiles[i] === "F") return; // flagged tiles cannot be clicked until cleared
        fetch(`/api/game/${GameID}/cell/${i}/reveal`, {
            method: "POST",
        })
        .then(res => res.json())
        .then(data => {
            setTiles(oldTiles => {
                const newTiles = [...oldTiles];
                newTiles[i] = data as GameTypes.CellContent;
                return newTiles;
            })
        })
        .catch((err) => console.error(err));
    }

    return (
        <div className="minesweeper-board-container">
            <div className="minesweeper-board">
                {
                    Tiles.map((cell, i) => (
                        <Tile 
                        className={`minesweeper-tile ${Tiles[i] !== null ? "revealed" : ""}`} /*handle flagging somehow*/
                        value={cell?.Type === 'mine' ? "M" : cell?.Number}  // up to UI to modify display value.
                        onLeftClick={() => handleTileLeftClick(i)}
                        onRightClick={() => handleTileRightClick(i)}/>
                    ))
                }
            </div>
        </div>
    );
}

export default MinesweeperBoard;