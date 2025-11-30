import KeybindSetter from "./components/AddKey";

const Keybinds = () => {
    return (
        <div className="w-full">
            <div className="p-2">
                <KeybindSetter defaultAction="open Cell" defaultKey="MouseLeft" thisClassName="Game"/>
                <KeybindSetter defaultAction="flag Cell" defaultKey="MouseRight" thisClassName="Game"/>
                <KeybindSetter defaultAction="chord" defaultKey="MouseLeft+MouseRight" thisClassName="Game"/>
            </div>
            <div className="p-3">
                <KeybindSetter defaultAction="restartGame" defaultKey="R" thisClassName="Sub"/>
                <KeybindSetter defaultAction="escapeGame" defaultKey="Esc" thisClassName="Sub"/>
                <KeybindSetter defaultAction="powerup1" defaultKey="1" thisClassName="Sub"/>
                <KeybindSetter defaultAction="powerup2" defaultKey="2" thisClassName="Sub"/>
            </div>
        </div>
    )
}

export default Keybinds;