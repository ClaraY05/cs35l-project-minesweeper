import ReactMarkdown from "react-markdown";
import tesselation from "./content/tesselation.md?raw"

const Tesselation = () => {
    return (
        <div>
            <h2>Tesselation</h2>
            <ReactMarkdown>{tesselation}</ReactMarkdown>
        </div>
    );
}

export default Tesselation;