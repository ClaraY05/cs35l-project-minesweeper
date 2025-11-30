import { useState, useEffect } from "react";

interface Keybind {
  action: string;
  key:string;
}

interface KeybindSetterProp {
    defaultAction: string;
    nowKey: string;
    thisClassName?: string;
    onChange?: (nowKey:string)=> void;
}

const KeybindSetter: React.FC<KeybindSetterProp> = ({ defaultAction, nowKey, thisClassName, onChange}) => {
    // set state vars
    const [keybind, setKeybind] = useState<Keybind>({
        action: defaultAction,
        key: nowKey,
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
        if (onChange) onChange(normalizeKey(pressedKey.key));
        setListening(false);
    };
    useEffect(()=>{setKeybind({action: defaultAction, key: nowKey})},[nowKey]);

    return (
        <div
        tabIndex={0} // needed to focus the div
        onKeyDown={handleKeyDown}
        className={`{thisClassName} w-full flex flex-row p-1 px-20 justify-between items-center`}
        >
            <strong className="uppercase font-semibold text-neutral-300 flex">{keybind.action} </strong>
            <span 
                onClick={() => setListening(true)}
                className="uppercase font-semibold text-slate-50 hover:text-fuchsia-600 text-neutral-50 flex">
                {listening ? "Press a key..." : normalizeKey(keybind.key)}
            </span>
        </div>
    );
};

export default KeybindSetter;