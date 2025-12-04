import {useEffect} from "react";
import { Outlet, Link } from "react-router-dom";
import { useSound } from "../../contexts/SoundContext";

const Tutorial = () => {
    const { playBackgroundMusic, stopBackgroundMusic, playSoundEffect } = useSound();

    useEffect(()=>{
        playBackgroundMusic("/audio/menu.wav");
        return () => {
            stopBackgroundMusic();
        };
    }, [playBackgroundMusic, stopBackgroundMusic]);

    const handleClick = (e:React.MouseEvent) => {
        playSoundEffect("/audio/SFX/click.wav", "click");
    };

    const handleHover = (e:React.MouseEvent) => {
        playSoundEffect("/audio/SFX/select.wav", "select");
    };

    return (
        <div className="flex flex-row items-start gap-0 w-full justify-center">
            <nav className="flex bg-lime-500 text-white uppercase rounded-lg p-3 font-bold text-lg flex-shrink-0 min-h-[40vh] max-h-[40vh] overflow-y-auto pb-3 z-10" style={{ marginRight: 0 }}>
                <ul>
                    <li><Link to="basics" className="tutorial-link">Basics</Link></li>
                    <li><Link to="multiplayer" className="tutorial-link">Multiplayer</Link></li>
                    <li><Link to="powerups" className="tutorial-link">Powerups</Link></li>
                    <li><Link to="debuffs" className="tutorial-link">Debuffs</Link></li>
                    <li><Link to="tesselation" className="tutorial-link">Tesselation</Link></li>
                    <li>
                        <Link 
                            to="/home"
                            className="tutorial-link"
                            onMouseEnter={(e)=>handleHover(e)}
                            onClick={(e)=>{handleClick(e)}}
                        >
                            Home
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="flex contentDiv relative -ml-0" style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0 }}>
                <h1 className="text-lime-500 px-5">Tutorial</h1>
                <div className="flex flex-row gap-5">
                    <main className="p-5 flex-1 min-h-[60vh] max-h-[60vh] overflow-y-auto pb-3"> 
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}
export default Tutorial;