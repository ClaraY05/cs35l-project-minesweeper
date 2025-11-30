import Checkbox from "./components/CommonCheckbox";
import Selector from "./components/CommonSelector";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_VIDEO } from "./utils/defaultSettings";

const VideoInterface = () => {
    let graphics: string[] = ["Low","Medium","Tobias"];
    const [video, setVideo] = useLocalStorage("video", DEFAULT_VIDEO);
    const update = (newChange:any) => setVideo((prev:any)=>({ ...prev, ...newChange}))
    return (
        <div>
            <Selector label="Graphics" options={graphics} value={video.graphics} onChange={(e)=>update({graphics:e})}/>
            {/* <Checkbox label="Display Tag"/> */}
            <Checkbox label="Display Username" nowChecked={video.displayUsername} onChange={(e)=>update({displayUsername:e})}/>
            <Checkbox label="Change Text Size" nowChecked={video.changeTextSize} onChange={(e)=>update({changeTextSize:e})}/>
            <Checkbox label="Use Custom Background" nowChecked={video.changeCustomBg} onChange={(e)=>update({changeCustomBg:e})}/>
        </div>
    );
}

export default VideoInterface;