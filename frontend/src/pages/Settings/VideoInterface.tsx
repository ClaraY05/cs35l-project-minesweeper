import Checkbox from "./components/CommonCheckbox";
import Selector from "./components/CommonSelector";

const VideoInterface = () => {
    let graphics: string[] = ["Low","Medium","Tobias"];

    return (
        <div>
            <Selector label="Graphics" options={graphics}/>
            <Checkbox label="Display Tag"/>
            <Checkbox label="Display Username"/>
            <Checkbox label="Change Text Size"/>
            <Checkbox label="Use Custom Background"/>
        </div>
    );
}

export default VideoInterface;