import { useState, useEffect } from "react";
import { authFetch } from "../../api/authFetch";
import './leaderboard.css';

type Entry = {
    username:string;
    best_time:{seconds: number, milliseconds: number};
};

const Leaderboard = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [difficulty, setDifficulty] = useState<"easy"|"medium"|"hard">("easy");
    useEffect(()=>{
        const loadLeaderboard = async () => {
            setLoading(true);
            setError("");
            try{
                const res = await authFetch(`http://localhost:8000/api/leaderboard?difficulty=${difficulty}`, {
                    method: "GET",
                });
                // console.log(res);
                setEntries(res);
            } catch(err:any){
                setError(err.message);
            } finally{
                setLoading(false);
            }
        };
        loadLeaderboard();
    }, [difficulty]);

    return (
       <>
        <h2>Leaderboard</h2>
        <label>
            Difficulty:
            <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value as "easy"|"medium"|"hard")}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error &&(
        <table id="leaderboard-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Best Time</th>
                </tr>
            </thead>
            <tbody>
                {entries.map((entry, ind)=>(
                    <tr key={entry.username}>
                        <td>{ind+1}</td>
                        <td>{entry.username}</td>
                        <td>{entry.best_time.seconds}.{Math.round(entry.best_time.milliseconds)} s</td>
                    </tr>
                ))}
            </tbody>
        </table>
        )}
       </> 
    );
};

export default Leaderboard;