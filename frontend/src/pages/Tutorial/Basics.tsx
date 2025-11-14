import ReactMarkdown from "react-markdown";
import basics from "./content/basics.md?raw"

const Basics = () => {
    return (
        <div>
            <h2>Basics</h2>
            <ReactMarkdown>{basics}</ReactMarkdown>
        </div>
    );
}

export default Basics;