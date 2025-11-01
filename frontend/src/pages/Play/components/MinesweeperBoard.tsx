import { useState } from 'react';
import './minesweeper-board.css'

// F, M, numbers are temporary sentinels for tile states. will use contracts / typescript later


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

const MinesweeperBoard = ({ BoardData } : any) => {
    const [Tiles, setTiles] = useState(Array(5*5).fill(null));

    const handleTileRightClick = (i : number) => {
        if (Tiles[i] && Tiles[i] !== "F") return; // revealed tiles cannot be flagged
        const newTiles = [...Tiles];
        Tiles[i] === "F" ? newTiles[i] = null : newTiles[i] = "F";
        setTiles(newTiles);
    }

    const handleTileLeftClick = (i : number) => {
        if (Tiles[i] === "F") return; // flagged tiles cannot be clicked until cleared
        const newTiles = [...Tiles];
        newTiles[i] = BoardData[i];
        setTiles(newTiles);
    }

    return (
        <div className="minesweeper-board-container">
            <div className="minesweeper-board">
                {
                    Tiles.map((value, i) => (
                        <Tile 
                        className={`minesweeper-tile ${Tiles[i] !== null && Tiles[i] !== "F" ? "revealed" : ""}`}
                        value={value} 
                        onLeftClick={() => handleTileLeftClick(i)}
                        onRightClick={() => handleTileRightClick(i)}/>
                    ))
                }
            </div>
        </div>
    );
}

export default MinesweeperBoard;