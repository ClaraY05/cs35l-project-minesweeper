import ReactMarkdown from "react-markdown";
import debuffs from "./content/debuffs.md?raw"
import "./tutorial-markdown.css"

const Debuffs = () => {
    return (
        <div>
            <div className="tutorial-markdown">
                <ReactMarkdown>{debuffs}</ReactMarkdown>
            </div>
        </div>
    );
}

export default Debuffs;