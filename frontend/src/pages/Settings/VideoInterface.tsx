import Checkbox from "./components/CommonCheckbox";
import Selector from "./components/CommonSelector";
import Slider from "./components/CommonSlider";
import TextInput from "../../components/header/Friends/components/TextInput";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_VIDEO } from "./utils/defaultSettings";
import { useEffect, useState } from "react";

const VideoInterface = () => {
    let graphics: string[] = ["Low","Medium","Tobias"];
    const [video, setVideo] = useLocalStorage("video", DEFAULT_VIDEO);
    const update = (newChange:any) => setVideo((prev:any)=>({ ...prev, ...newChange}))
    const [error, setError] = useState("");

    // make sure url provided is an image
    const checkImage = async (url:string) => {
        try {
            const res = await fetch(url, {method:"GET"});
            if (!res.ok){
                return false;
            }
            const blob = await res.blob();
            return blob.type.startsWith("image/");
        } catch(err){
            return false;
        }
    }
    // updates local storage only when user hit enter and is valid image
    const handleSubmit = async (text: string) => {
        try{
            const res = await checkImage(text);
            if(!res){
                setError("Image URL is not valid or reachable");
                return;
            }
            setError("");
            update({customBg:text});
            setBgUrl(text);
        } catch(err){
            setError("Image check failed");
        }
    };
    const [bgUrl, setBgUrl] = useState(video.customBg);
    useEffect(()=>{ setBgUrl(video.customBg); },[video.customBg]);

    // for conversion from percent to size
    const getTextSizeLabel = (value: number): string => {
        const labels = [
            "xs", "sm", "base", "lg", "xl", 
            "2xl", "3xl", "4xl", "5xl", "6xl", 
            "7xl", "8xl", "9xl"
        ];
        return labels[value - 1] || value.toString();
    };

    return (
        <div className="w-full flex flex-col gap-3 px-20">
            <Selector label="Graphics" options={graphics} value={video.graphics} onChange={(e)=>update({graphics:e})}/>
            <Slider 
                label="Text" 
                nowValue={video.textSize} 
                min={1} 
                max={13} 
                onChange={(e)=>update({textSize:e})}
                displayValue={getTextSizeLabel}
            />
            <Checkbox label="Display Username" nowChecked={video.displayUsername} onChange={(e)=>update({displayUsername:e})}/>
            <Checkbox
                label="Use Custom Background"
                nowChecked={video.changeCustomBg}
                onChange={(e)=>{
                    if(!e){
                        // revert to default background when checkbox deselected
                        setBgUrl(DEFAULT_VIDEO.customBg);
                        update({changeCustomBg:false, customBg: DEFAULT_VIDEO.customBg});
                    } else {
                        update({changeCustomBg:true});
                    }
                }}
            />
            <TextInput 
                placeholder="Enter background url" 
                value={bgUrl}
                onChange={(text)=>{
                    if(video.changeCustomBg) {
                        setBgUrl(text);
                    }
                }}
                onSubmit={(text)=>{
                    if(video.changeCustomBg){
                        handleSubmit(text);
                    }
                }}
                buttonText="Enter"
                disabled={!video.changeCustomBg}/>
                {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
}

export default VideoInterface;
