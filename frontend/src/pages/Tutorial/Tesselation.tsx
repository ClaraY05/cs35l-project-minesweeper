import ReactMarkdown from "react-markdown";
import tesselation from "./content/tesselation.md?raw"
import "./tutorial-markdown.css"

const Tesselation = () => {
    return (
        <div>
            <div className="tutorial-markdown">
                <ReactMarkdown>{tesselation}</ReactMarkdown>
            </div>
        </div>
    );
}

export default Tesselation;