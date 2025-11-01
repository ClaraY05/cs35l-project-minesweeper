import { useState } from 'react';
import './minesweeper-board.css'

const Tile = ({ value, onLeftClick, onRightClick }) => {
    return (
    <button 
      className="minesweeper-tile"
      onContextMenu={
        (e) => {
            e.preventDefault();
            onRightClick();
        }
      }>
        {value}
    </button>
  )
}

const MinesweeperBoard = () => {
    const [Tiles, setTiles] = useState(Array(9).fill(null));

    const handleTileRightClick = (i) => {
        const newTiles = [...Tiles];
        Tiles[i] === "F" ? newTiles[i] = null : newTiles[i] = "F";
        setTiles(newTiles);
    }

    return (
        <div className="minesweeper-board-container">
            <div className="minesweeper-board">
                {
                    Tiles.map((value, index) => (
                        <Tile 
                        value={value} 
                        onRightClick={() => handleTileRightClick(index)}/>
                    ))
                }
            </div>
        </div>
    );
}

export default MinesweeperBoard;