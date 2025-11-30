import Checkbox from "./components/CommonCheckbox";
import Selector from "./components/CommonSelector";
import Slider from "./components/CommonSlider";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_VIDEO } from "./utils/defaultSettings";

const VideoInterface = () => {
    let graphics: string[] = ["Low","Medium","Tobias"];
    const [video, setVideo] = useLocalStorage("video", DEFAULT_VIDEO);
    const update = (newChange:any) => setVideo((prev:any)=>({ ...prev, ...newChange}))
    return (
        <div className="w-full flex flex-col gap-3 px-20">
            <Selector label="Graphics" options={graphics} value={video.graphics} onChange={(e)=>update({graphics:e})}/>
            <Slider label="Text Size" nowValue={video.textSize} min={1} max={13} onChange={(e)=>update({testSize:e})}/>
            <Checkbox label="Display Username" nowChecked={video.displayUsername} onChange={(e)=>update({displayUsername:e})}/>
            <Checkbox label="Use Custom Background" nowChecked={video.changeCustomBg} onChange={(e)=>update({changeCustomBg:e})}/>
        </div>
    );
}

export default VideoInterface;