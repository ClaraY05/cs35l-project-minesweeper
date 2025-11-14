import ReactMarkdown from "react-markdown";
import debuffs from "./content/debuffs.md?raw"
const Debuffs = () => {
    return (
        <div>
            <h2>Debuffs</h2>
            <ReactMarkdown>{debuffs}</ReactMarkdown>
        </div>
    );
}

export default Debuffs;