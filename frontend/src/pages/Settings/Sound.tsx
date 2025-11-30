import Slider from "./components/CommonSlider";
import Checkbox from "./components/CommonCheckbox";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_SOUND } from "./utils/defaultSettings";

const Sound = () => {
    const [sound,setSound] = useLocalStorage("sound", DEFAULT_SOUND);
    const update = (newChange:any) => setSound((prev:any)=>({ ...prev,...newChange}));
    return (
        <div>
                <Slider label="music" nowValue={sound.music} onChange={(e)=>update({music:e})}/>
                <Slider label="sfx" nowValue={sound.sfx} onChange={(e)=>update({sfx:e})}/>
                <Slider label="stereo" nowValue={sound.stereo} onChange={(e)=>update({stereo:e})}/>
                <Checkbox label="Sound 1" nowChecked={sound.sound1} onChange={(e)=>update({sound1:e})}/>
                <Checkbox label="Sound 2" nowChecked={sound.sound2} onChange={(e)=>update({sound2:e})}/>
                <Checkbox label="Sound 3" nowChecked={sound.sound3} onChange={(e)=>update({sound3:e})}/>
                <Checkbox label="Sound 4" nowChecked={sound.sound4} onChange={(e)=>update({sound4:e})}/>
        </div>
    );
}

export default Sound;