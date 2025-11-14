import ReactMarkdown from "react-markdown";
import multiplayer from "./content/multiplayer.md?raw"

const Multiplayer = () => {
    return (
        <div>
            <h2>Multiplayer</h2>
            <ReactMarkdown>{multiplayer}</ReactMarkdown>
        </div>
    );
}

export default Multiplayer;