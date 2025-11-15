import { useState } from 'react';
import { PublicCellData } from '../../../types/frontend-gametypes';
import './minesweeper-board.css'

const Tile = ({ className, content, onLeftClick, onRightClick } : any) => {
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
        {content}
    </div>
  )
}

const MinesweeperBoard = ({ GameID } : { GameID : number }) => {
    const [Tiles, setTiles] = useState<(PublicCellData | null)[]>(Array(5*5).fill(null));

    const handleTileRightClick = (i : number) => {
        if (Tiles[i]?.State.Visibility === 'revealed') return;
        const newTiles = [...Tiles];
        newTiles[i] = { State: { Visibility: 'hidden', Flagged: !Tiles[i]?.State.Flagged }, Content: Tiles[i]?.Content || null };
        setTiles(newTiles);
    }

    const handleTileLeftClick = (i : number) => {
        if (Tiles[i]?.State.Visibility === 'revealed' || Tiles[i]?.State.Flagged) return; // save api calls & block flagged cells from reveal
        fetch(`http://localhost:8000/api/game/${GameID}/cell/${i}/reveal`) // for performance.
        .then(res => {    
            if (!res.ok) throw res; // if express returns 409
            else return res.json();
        })
        .then(data => {
            setTiles(oldTiles => {
                const newTiles = [...oldTiles];
                newTiles[i] = { State: { Visibility:'revealed' }, Content: data as GameTypes.CellContent };
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
                        className={`minesweeper-tile ${Tiles[i]?.State.Visibility === 'revealed' ? "revealed" : ""}`}
                        content={cell === null ? null : 
                            (cell.State.Visibility === 'hidden' && cell.State.Flagged) ? "F" :
                            cell.Content === null ? null :
                            (cell.Content.Type === 'mine' ? "M" : cell.Content.Number)}  // up to UI to modify display value.
                        onLeftClick={() => handleTileLeftClick(i)}
                        onRightClick={() => handleTileRightClick(i)}/>
                    ))
                }
            </div>
        </div>
    );
}

export default MinesweeperBoard;