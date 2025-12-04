import { useState } from "react";
import icon from "./person-group-svgrepo-com.svg"
import FriendsPopout from "./components/FriendsPopout"
import { useSound } from "../../../contexts/SoundContext";

interface Friend {
  user_id: number;
  username: string;
  email: string;
  profile_picture: string | null;
}

const Friends = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const {playSoundEffect } = useSound();

  const handleClick = (e: React.MouseEvent) =>{
    playSoundEffect("/audio/SFX/click.wav", "click");
  };
  const handleHover = (e: React.MouseEvent) =>{
    playSoundEffect("/audio/SFX/select.wav", "select");
  };

  return (
    <div className="flex flex-shrink-0">
      <button
        onClick={(e) => {
          setShowOverlay(true)
          handleClick(e);
        }}
        onMouseEnter={(e)=> handleHover(e)}
        className="showOverlay rounded-sm bg-main ptpb-2.5 pl-3.5 pr-3.5 hover:border-2 transition-all duration-300 cursor-pointer"
      >
        <img src={icon} alt="People Icon flex-shrink-0"/>
      </button>

      <FriendsPopout
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
      />
    </div>
  );
};

export default Friends;