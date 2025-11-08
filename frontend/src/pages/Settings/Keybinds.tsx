import KeybindSetter from "./components/AddKey";

const Keybinds = () => {
    return (
        <div>
            <h2>Keybinds</h2>
            <div>
                <KeybindSetter defaultAction="Game Action 1" defaultKey="Keybind 1" thisClassName="Game"/>
                <KeybindSetter defaultAction="Game Action 2" defaultKey="Keybind 2" thisClassName="Game"/>
                <KeybindSetter defaultAction="Game Action 3" defaultKey="Keybind 3" thisClassName="Game"/>
                <KeybindSetter defaultAction="Game Action 4" defaultKey="Keybind 4" thisClassName="Game"/>
            </div>
            <div>
                <KeybindSetter defaultAction="Sub Action 1" defaultKey="Keybind 1" thisClassName="Sub"/>
                <KeybindSetter defaultAction="Sub Action 2" defaultKey="Keybind 2" thisClassName="Sub"/>
                <KeybindSetter defaultAction="Sub Action 3" defaultKey="Keybind 3" thisClassName="Sub"/>
            </div>
        </div>
    )
}

export default Keybinds;