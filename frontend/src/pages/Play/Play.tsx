import { useEffect, useState } from "react";
import MinesweeperBoard from "./components/MinesweeperBoard"


const Play = () => {
    const [activeGameID, setActiveGameID] = useState<number | null>(null);

    // start a new game when page loads
    useEffect(() => {
        fetch("/api/game/create")
        .then((res) => res.json())
        .then((data) => setActiveGameID(data.game_id))
        .catch((err) => console.error(err));
    }, []);
  
    return (
        <MinesweeperBoard GameID={activeGameID ?? 0} />
    )
}

export default Play;