import MinesweeperBoard from "./components/MinesweeperBoard"
import DifficultySelect from "./components/DifficultySelect";
import './play.css';
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { authFetch } from "../../api/authFetch";
import { useSound } from "../../contexts/SoundContext";

const difficultyConfigs: Record<GameTypes.Difficulty, { rows: number; cols: number; mines: number }> = {
    easy:   { rows: 9,  cols: 9,  mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard:   { rows: 16, cols: 30, mines: 99 },
};

const Play = () => {
    const [activeGameID, setActiveGameID] = useState<number | null>(null);
    const [difficulty, setDifficulty] = useState<GameTypes.Difficulty>("easy");
    const { rows, cols, mines } = difficultyConfigs[difficulty];
    const { playBackgroundMusic, stopBackgroundMusic, playSoundEffect } = useSound();

    useEffect(()=>{
        playBackgroundMusic("/audio/play.wav");
        return () => {
            stopBackgroundMusic();
        };
    }, [playBackgroundMusic, stopBackgroundMusic]);

    const handleClick = (e:React.MouseEvent) => {
        playSoundEffect("/audio/SFX/click.wav", "click");
    };

    const handleHover = (e:React.MouseEvent) => {
        playSoundEffect("/audio/SFX/select.wav", "select");
    };

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

    const restartGame = async () => {
        setActiveGameID(null);
    }
    
    // reset game when difficulty changes
    const handleDifficultyChange = (value: GameTypes.Difficulty) => {
        setDifficulty(value);
        setActiveGameID(null); // clear current game so a new one is created on first click
    };
  
    return (
        <div className="contentDiv play-page h-full p-5">
            <div className="play-container flex flex-row items-center gap-4">
                <div className="flex flex-col items-start gap-4 p-4 text-xl font-bold bg-stone-900 rounded-xl">
                    <DifficultySelect value={difficulty} onChange={handleDifficultyChange} />
                    <button>
                        <Link 
                            to="/home" 
                            className="hover:text-amber-500 transition-all duration-300"
                            onMouseEnter={(e)=>handleHover(e)}
                            onClick={(e)=>{handleClick(e)}}
                        >
                            Home
                        </Link>
                    </button>
                </div>
                <MinesweeperBoard GameID={activeGameID} rows={rows} mines={mines} cols={cols} onFirstClick={startGame} onRestart={restartGame}/>
            </div>
        </div>
    )
}

export default Play;