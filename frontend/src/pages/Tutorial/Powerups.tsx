import ReactMarkdown from "react-markdown";
import powerups from "./content/powerups.md?raw"
import "./tutorial-markdown.css"

const Powerups = () => {
    return (
        <div>
            <div className="tutorial-markdown">
                <ReactMarkdown>{powerups}</ReactMarkdown>
            </div>
        </div>
    );
}

export default Powerups;