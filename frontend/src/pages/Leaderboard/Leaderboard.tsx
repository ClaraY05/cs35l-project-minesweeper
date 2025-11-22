import { useState, useEffect } from "react";
import { authFetch } from "../../api/authFetch";

type Entry = {
    username:string;
    best_score:number;
};

const Leaderboard = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(()=>{
        const loadLeaderboard = async () => {
            setLoading(true);
            try{
                const res = await authFetch("http://localhost:8000/api/leaderboard", {
                    method: "GET",
                });
                setEntries(res);
            } catch(err:any){
                setError(err.message);
            } finally{
                setLoading(false);
            }
        };
        loadLeaderboard();
    }, []);

    return (
       <>
        <h2>Leaderboard</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Best Score</th>
                </tr>
            </thead>
            <tbody>
                {entries.map((entry, ind)=>(
                    <tr key={entry.username}>
                        <td>{ind+1}</td>
                        <td>{entry.username}</td>
                        <td>{entry.best_score}</td>
                    </tr>
                ))}
            </tbody>
        </table>
       </> 
    );
};

export default Leaderboard;