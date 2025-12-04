import { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../../api/authFetch";
import './components/leaderboard.css';
import { useSound } from "../../contexts/SoundContext";

type Entry = {
    username:string;
    best_time:{seconds: number, milliseconds: number};
};

const Leaderboard = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [difficulty, setDifficulty] = useState<"easy"|"medium"|"hard">("easy");
    const { playBackgroundMusic, stopBackgroundMusic, playSoundEffect } = useSound();

    // update table based on what option user selects
    useEffect(()=>{
        const loadLeaderboard = async () => {
            setLoading(true);
            setError("");
            try{
                const res = await authFetch(`http://localhost:8000/api/leaderboard?difficulty=${difficulty}`, {
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
        playBackgroundMusic("/audio/menu.wav");
        return () => {
            stopBackgroundMusic();
        };
    }, [difficulty, playBackgroundMusic, stopBackgroundMusic]);

    const handleClick = (e:React.MouseEvent) => {
        playSoundEffect("/audio/SFX/click.wav", "click");
    };

    const handleHover = (e:React.MouseEvent) => {
        playSoundEffect("/audio/SFX/select.wav", "select");
    };

    return (
       <div className="contentDiv flex flex-col justify-between py-2 px-10">
            <div className="flex flex-col px-5">
                <h1 className="text-indigo-500">Leaderboard</h1>
                <hr className="border-t-3 border-dashed h-2"></hr>
                <label className="flex flex-row gap-2 uppercase font-semibold text-xl pb-3">
                    Difficulty:
                    <select 
                        value={difficulty}
                        onChange={(e)=>setDifficulty(e.target.value as "easy"|"medium"|"hard")} 
                        className="bg-indigo-600 text-white flex font-normal uppercase flex-row px-2 rounded-md">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>
                <div className="max-h-[43vh] overflow-y-auto pb-3">
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
                </div>
            </div>
            <button>
                <Link to="/home" 
                    className="hover:font-bold transition-all duration-300"
                    onMouseEnter={(e)=> handleHover(e)}
                    onClick={(e)=>handleClick(e)}
                >
                    Home
                </Link></button>
       </div> 
    );
};

export default Leaderboard;