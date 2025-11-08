import { useState } from "react";

interface Keybind {
  action: string;
  key:string;
}

interface KeybindSetterProp {
    defaultAction: string;
    defaultKey: string;
    thisClassName?: string;
}

const KeybindSetter: React.FC<KeybindSetterProp> = ({ defaultAction, defaultKey, thisClassName}) => {
    // set state vars
    const [keybind, setKeybind] = useState<Keybind>({
        action: defaultAction,
        key: defaultKey,
    });
    const [listening, setListening] = useState(false);
    const [hover, setHover] = useState(false);

    const normalizeKey = (key: string) => {
        if (key === " ") return "Space";
        if (key === "Escape") return "Esc";
        return key;
      };

    const handleKeyDown = (pressedKey: React.KeyboardEvent<HTMLDivElement>) => {
        if (!listening){return;} 
        pressedKey.preventDefault();

        setKeybind(prev => ({action: keybind.action, key: pressedKey.key}));
        setListening(false);
    };

    return (
        <div
        tabIndex={0} // needed to focus the div
        onKeyDown={handleKeyDown}
        className={thisClassName}
        >
        <strong>{keybind.action}: </strong>
      
        <span 
            onClick={() => setListening(true)}
            onMouseEnter={() => setHover(true)}  // update hover state
            onMouseLeave={() => setHover(false)} // update hover state
            style={{
                color: hover ? "blue" : "black",
              }}>
            {listening ? "Press a key..." : normalizeKey(keybind.key)}
        </span>
        </div>
    );
};

export default KeybindSetter;