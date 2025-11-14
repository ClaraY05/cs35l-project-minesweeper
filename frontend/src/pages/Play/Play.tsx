import { useEffect, useState } from "react";
import type { CellData } from "@localtypes/gametypes"
import MinesweeperBoard from "./components/MinesweeperBoard"


const Play = () => {
    const [activeGameID, setActiveGameID] = useState<Number | null>(null);
    const [boardData, setBoardData] = useState<CellData[] | null>(null);

    useEffect(() => {
        fetch("/api/game/create")
        .then((res) => res.json())
        .then((data) => setActiveGameID(data.game_id))
        .catch((err) => console.error(err));
    }, []);
  
    return (
        <MinesweeperBoard BoardData={boardData} />
    )
}

export default Play;