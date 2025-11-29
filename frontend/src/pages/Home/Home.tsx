import { useNavigate } from "react-router-dom"
import { useState, useRef } from "react"
import { createPageTransition } from "./utils/pageTransition"

const Home = () => {
    const navigate = useNavigate();
    const [expandingBar, setExpandingBar] = useState<number | null>(null);
    const [targetPath, setTargetPath] = useState<string>("");
    const barRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number, path: string) => {
        e.preventDefault();
        const bar = barRefs.current[index];
        if (!bar) return;

        setExpandingBar(index);
        setTargetPath(path);

        createPageTransition(bar, path, navigate, () => {
            setExpandingBar(null);
        });
    };

    return (
      <div className="w-full h-full relative flex flex-col items-end gap-2 p-4">
        <a
          href="/play"
          ref={(el) => { barRefs.current[0] = el; }}
          onClick={(e) => handleClick(e, 0, "/play")}
          className="option-bar bg-amber-500"
        >
          <div className="option-text">&gt; Single Player_</div>
        </a>
  
        <a
          href="/play"
          ref={(el) => { barRefs.current[1] = el; }}
          onClick={(e) => handleClick(e, 1, "/play")}
          className="option-bar bg-sky-500"
        >
          <div className="option-text">&gt; Multiplayer_</div>
        </a>
  
        <a
          href="/tutorial"
          ref={(el) => { barRefs.current[2] = el; }}
          onClick={(e) => handleClick(e, 2, "/tutorial")}
          className="option-bar bg-lime-500"
        >
          <div className="option-text">&gt; Tutorial_</div>
        </a>
  
        <a
          href="/settings"
          ref={(el) => { barRefs.current[3] = el; }}
          onClick={(e) => handleClick(e, 3, "/settings")}
          className="option-bar bg-fuchsia-500"
        >
          <div className="option-text">&gt; Settings_</div>
        </a>
  
        <a
          href="/leaderboard"
          ref={(el) => { barRefs.current[4] = el; }}
          onClick={(e) => handleClick(e, 4, "/leaderboard")}
          className="option-bar bg-indigo-600"
        >
          <div className="option-text">&gt; Leaderboard_</div>
        </a>
      </div>
    );
}

export default Home;