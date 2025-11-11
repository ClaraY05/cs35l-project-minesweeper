import { useEffect, useState } from "react";
import MinesweeperBoard from "./components/MinesweeperBoard"


const Play = () => {
    const [boardData, setBoardData] = useState<any[] | null>(null);

    useEffect(() => {
        fetch("/api/game/create")
        .then((res) => res.json())
        .then((data) => setBoardData(data.board))
        .catch((err) => console.error(err));
    }, []);
  
    return (
        <MinesweeperBoard BoardData={boardData} />
    )
}

export default Play;