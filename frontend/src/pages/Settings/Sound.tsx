import Slider from "./components/CommonSlider";
import Checkbox from "./components/CommonCheckbox";

const Sound = () => {
    return (
        <div>
            <h2>Sound</h2>
                <Slider label="music"/>
                <Slider label="sfx"/>
                <Slider label="stereo"/>
                <Checkbox label="Sound 1"/>
                <Checkbox label="Sound 2"/>
                <Checkbox label="Sound 3"/>
                <Checkbox label="Sound 4"/>
        </div>
    );
}

export default Sound;