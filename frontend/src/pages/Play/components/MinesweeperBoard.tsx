import { useState } from 'react';
import './minesweeper-board.css'

// F, M, numbers are temporary sentinels for tile states. will use contracts / typescript later

const testBoard = [
    1,1,1,
    1,"M",1,
    1,1,1
];

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

const MinesweeperBoard = () => {
    const [Tiles, setTiles] = useState(Array(9).fill(null));

    const handleTileRightClick = (i : number) => {
        if (Tiles[i] && Tiles[i] !== "F") return; // revealed tiles cannot be flagged
        const newTiles = [...Tiles];
        Tiles[i] === "F" ? newTiles[i] = null : newTiles[i] = "F";
        setTiles(newTiles);
    }

    const handleTileLeftClick = (i : number) => {
        if (Tiles[i] === "F") return; // flagged tiles cannot be clicked until cleared
        const newTiles = [...Tiles];
        newTiles[i] = testBoard[i];
        setTiles(newTiles);
    }

    return (
        <div className="minesweeper-board-container">
            <div className="minesweeper-board">
                {
                    Tiles.map((value, i) => (
                        <Tile 
                        className={`minesweeper-tile ${Tiles[i] && Tiles[i] !== "F" ? "revealed" : ""}`}
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