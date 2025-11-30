import KeybindSetter from "./components/AddKey";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_KEYBINDS } from "./defaultSettings";

const Keybinds = () => {
    const [keybinds,setKeybinds] = useLocalStorage("keybinds", DEFAULT_KEYBINDS);
    const update = (newChange:any) => setKeybinds((prev:any)=>({ ...prev, ...newChange}));
    return (
        <div className="w-full">
            <div className="p-2">
                <KeybindSetter defaultAction="Open Cell" nowKey={keybinds.openCell} thisClassName="Game" onChange={(e)=>update({openCell:e})}/>
                <KeybindSetter defaultAction="Flag Cell" nowKey={keybinds.flagCell} thisClassName="Game" onChange={(e)=>update({flagCell:e})}/>
                <KeybindSetter defaultAction="Chord" nowKey={keybinds.chord} thisClassName="Game" onChange={(e)=>update({chord:e})}/>
                <KeybindSetter defaultAction="Escape Game" nowKey={keybinds.escapeGame} thisClassName="Game" onChange={(e)=>update({escapeGame:e})}/>
            </div>
            <div className="p-3">
                <KeybindSetter defaultAction="Restart Game" nowKey={keybinds.restartGame} thisClassName="Sub" onChange={(e)=>update({restartGame:e})}/>
                <KeybindSetter defaultAction="Powerup I" nowKey={keybinds.powerup1} thisClassName="Sub" onChange={(e)=>update({powerup1:e})}/>
                <KeybindSetter defaultAction="Powerup II" nowKey={keybinds.powerup2} thisClassName="Sub" onChange={(e)=>update({powerup2:e})}/>
            </div>
        </div>
    )
}

export default Keybinds;