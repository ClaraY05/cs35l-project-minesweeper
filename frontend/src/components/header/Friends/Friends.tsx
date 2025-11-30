import { useState } from "react";
import icon from "./person-group-svgrepo-com.svg"
import FriendsPopout from "./components/FriendsPopout"

interface Friend {
  user_id: number;
  username: string;
  email: string;
  profile_picture: string | null;
}

const Friends = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="flex flex-shrink-0">
      <button
        onClick={() => setShowOverlay(true)}
        className="showOverlay rounded-sm bg-main ptpb-2.5 pl-3.5 pr-3.5"
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