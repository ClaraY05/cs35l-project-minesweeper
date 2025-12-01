import ReactMarkdown from "react-markdown";
import multiplayer from "./content/multiplayer.md?raw"
import "./tutorial-markdown.css"

const Multiplayer = () => {
    return (
        <div>
            <div className="tutorial-markdown">
                <ReactMarkdown>{multiplayer}</ReactMarkdown>
            </div>
        </div>
    );
}

export default Multiplayer;