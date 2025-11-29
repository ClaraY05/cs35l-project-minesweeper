import { useEffect, useState } from "react";
import MinesweeperBoard from "./components/MinesweeperBoard"
import DifficultySelect, { Difficulty } from "./components/DifficultySelect";
import './play.css';

const difficultyConfigs: Record<Difficulty, { rows: number; cols: number; mines: number }> = {
  easy:   { rows: 9,  cols: 9,  mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard:   { rows: 16, cols: 30, mines: 99 },
};

const Play = () => {
    const [activeGameID, setActiveGameID] = useState<number | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>("easy");
    const { rows, cols, mines } = difficultyConfigs[difficulty];

    // start a new game when page loads
    useEffect(() => {
        fetch("http://localhost:8000/api/game/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rows, cols, mines })
        })
        .then((res) => res.json())
        .then((data) => setActiveGameID(data.game_id))
        .catch((err) => console.error(err));
    }, [rows, cols, mines]);
  
    return (
        <div className="play-container">
            <DifficultySelect value={difficulty} onChange={setDifficulty} />
            <MinesweeperBoard GameID={activeGameID ?? 0} rows={rows} cols={cols} />
        </div>
    )
}

export default Play;