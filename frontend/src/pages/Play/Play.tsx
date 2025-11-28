import { useEffect, useState } from "react";
import MinesweeperBoard from "./components/MinesweeperBoard"

const ROWS = 5;
const COLS = 5;
const MINES = 3;

const Play = () => {
    const [activeGameID, setActiveGameID] = useState<number | null>(null);

    // start a new game when page loads
    useEffect(() => {
        fetch("http://localhost:8000/api/game/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rows: ROWS, columns: COLS, mines : MINES })
        })
        .then((res) => res.json())
        .then((data) => setActiveGameID(data.game_id))
        .catch((err) => console.error(err));
    }, []);
  
    return (
        <MinesweeperBoard GameID={activeGameID ?? 0} rows={ROWS} cols={COLS} />
    )
}

export default Play;