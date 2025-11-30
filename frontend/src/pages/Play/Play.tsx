import { useEffect, useState } from "react";
import MinesweeperBoard from "./components/MinesweeperBoard"
import DifficultySelect from "./components/DifficultySelect";
import './play.css';
import { authFetch } from "../../api/authFetch";

const difficultyConfigs: Record<GameTypes.Difficulty, { rows: number; cols: number; mines: number }> = {
    easy:   { rows: 9,  cols: 9,  mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard:   { rows: 16, cols: 30, mines: 99 },
};

const Play = () => {
    const [activeGameID, setActiveGameID] = useState<number | null>(null);
    const [difficulty, setDifficulty] = useState<GameTypes.Difficulty>("easy");
    const { rows, cols, mines } = difficultyConfigs[difficulty];

    // start a new game
    const startGame = async (firstClickedCell : number) => {
        try {
            const data = await authFetch("http://localhost:8000/api/game/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rows, cols, mines, difficulty, firstClickedCell }),
            });

            setActiveGameID(data.game_id);
            return data.game_id as number;
        } catch (err) {
            console.error("Failed to start game:", err);
            return null;
        }
    };
    
    // Optional: reset game when difficulty changes
    const handleDifficultyChange = (value: GameTypes.Difficulty) => {
        setDifficulty(value);
        setActiveGameID(null); // clear current game so a new one is created on first click
    };
  
    return (
        <div className="play-container">
            <DifficultySelect value={difficulty} onChange={handleDifficultyChange} />
            <MinesweeperBoard GameID={activeGameID} rows={rows} mines={mines} cols={cols} onFirstClick={startGame} />
        </div>
    )
}

export default Play;