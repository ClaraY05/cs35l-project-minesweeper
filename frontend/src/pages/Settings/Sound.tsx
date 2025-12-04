import Slider from "./components/CommonSlider";
import Checkbox from "./components/CommonCheckbox";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_SOUND } from "../../../../utils/defaultSettings";

const Sound = () => {
    const [sound,setSound] = useLocalStorage("sound", DEFAULT_SOUND);
    // update local storage when a change is made
    const update = (newChange:any) => setSound((prev:any)=>({ ...prev,...newChange}));
    return (
        <div className="w-full flex flex-col gap-2 px-20"> 
            <div className="flex flex-col w-full items-center justify-center mx-auto max-w-2xl">
                <Slider label="music" nowValue={sound.music} onChange={(e)=>update({music:e})}/>
                <Slider label="sfx" nowValue={sound.sfx} onChange={(e)=>update({sfx:e})}/>
                <Slider label="stereo" nowValue={sound.stereo} onChange={(e)=>update({stereo:e})}/>
            </div>
                <div className="flex flex-col gap-1">
                    <h2 className="uppercase font-bold">SFX Controls</h2>
                    <Checkbox label="Click" nowChecked={sound.sound1} onChange={(e)=>update({sound1:e})}/>
                    <Checkbox label="Place Flag" nowChecked={sound.sound2} onChange={(e)=>update({sound2:e})}/>
                    <Checkbox label="Select" nowChecked={sound.sound3} onChange={(e)=>update({sound3:e})}/>
                    <Checkbox label="Change Difficulty" nowChecked={sound.sound4} onChange={(e)=>update({sound4:e})}/>
                </div>
        </div>
    );
}

export default Sound;