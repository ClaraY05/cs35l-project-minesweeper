import { useState } from 'react';
import './minesweeper-board.css'

const Tile = ({ value }) => {
    return (
    <button 
      className="minesweeper-tile">
        {value}
    </button>
  )
}

const MinesweeperBoard = () => {
    const [Tiles, setTiles] = useState(Array(9).fill(null));

    return (
        <div className="minesweeper-board-container">
            <div className="minesweeper-board">
                {
                    Tiles.map((value, index) => (
                        <Tile value={value} />
                    ))
                }
            </div>
        </div>
    );
}

export default MinesweeperBoard;