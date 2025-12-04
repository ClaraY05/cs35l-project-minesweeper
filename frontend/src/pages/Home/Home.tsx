import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect} from "react"
import { createPageTransition } from "./utils/pageTransition"
import { useSound } from "../../contexts/SoundContext";


const Home = () => {
    const navigate = useNavigate();
    const [expandingBar, setExpandingBar] = useState<number | null>(null);
    const [targetPath, setTargetPath] = useState<string>("");
    const barRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const { playBackgroundMusic, stopBackgroundMusic, playSoundEffect } = useSound();

    useEffect(() => {
        playBackgroundMusic("/audio/menu.wav");
      
        return () => {
          stopBackgroundMusic();
      };
    }, [playBackgroundMusic, stopBackgroundMusic]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number, path: string) => {
      e.preventDefault();
      playSoundEffect("/audio/SFX/click.wav", "click");
      const bar = barRefs.current[index];
      if (!bar) return;

      setExpandingBar(index);
      setTargetPath(path);

      // Ensure the bar is at full width before starting transition
      bar.style.width = '100vw';
      
      // Wait for the width transition to complete (500ms) before starting page transition
      setTimeout(() => {
          createPageTransition(bar, path, navigate, () => {
              setExpandingBar(null);
              bar.style.width = '';
          });
      }, 500);
    };

    const handleHover = (e: React.MouseEvent<HTMLAnchorElement>) =>{
      playSoundEffect("/audio/SFX/select.wav", "select");
    };

    return (
      <div className="w-full h-full relative flex flex-col items-end gap-2 p-4">
        <a
          href="/play"
          ref={(el) => { barRefs.current[0] = el; }}
          onClick={(e) => handleClick(e, 0, "/play")}
          onMouseEnter={(e)=> handleHover(e)}
          className="option-bar bg-amber-500"
        >
          <div className="option-text">&gt; Single Player_</div>
        </a>
        {/* DID NOT IMPLEMENT MULTIPLAYER
        <a
          href="/play"
          ref={(el) => { barRefs.current[1] = el; }}
          onClick={(e) => handleClick(e, 1, "/play")}
          onMouseEnter={(e)=> handleHover(e)}
          className="option-bar bg-sky-500"
        >
          <div className="option-text">&gt; Multiplayer_</div>
        </a>
        */}
  
        <a
          href="/tutorial"
          ref={(el) => { barRefs.current[2] = el; }}
          onClick={(e) => handleClick(e, 2, "/tutorial")}
          onMouseEnter={(e)=> handleHover(e)}
          className="option-bar bg-lime-500"
        >
          <div className="option-text">&gt; Tutorial_</div>
        </a>
  
        <a
          href="/settings"
          ref={(el) => { barRefs.current[3] = el; }}
          onClick={(e) => handleClick(e, 3, "/settings")}
          onMouseEnter={(e)=> handleHover(e)}
          className="option-bar bg-fuchsia-500"
        >
          <div className="option-text">&gt; Settings_</div>
        </a>
  
        <a
          href="/leaderboard"
          ref={(el) => { barRefs.current[4] = el; }}
          onClick={(e) => handleClick(e, 4, "/leaderboard")}
          onMouseEnter={(e)=> handleHover(e)}
          className="option-bar bg-indigo-600"
        >
          <div className="option-text">&gt; Leaderboard_</div>
        </a>
      </div>
    );
}

export default Home;