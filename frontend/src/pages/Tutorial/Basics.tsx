import ReactMarkdown from "react-markdown";
import basics from "./content/basics.md?raw"
import "./tutorial-markdown.css"

const Basics = () => {
    return (
        <div>
            <div className="tutorial-markdown">
                <ReactMarkdown>{basics}</ReactMarkdown>
            </div>
        </div>
    );
}

export default Basics;