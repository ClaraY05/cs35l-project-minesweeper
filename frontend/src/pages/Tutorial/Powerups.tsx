import ReactMarkdown from "react-markdown";
import powerups from "./content/powerups.md?raw"

const Powerups = () => {
    return (
        <div>
            <h2>Powerups</h2>
            <ReactMarkdown>{powerups}</ReactMarkdown>
        </div>
    );
}

export default Powerups;