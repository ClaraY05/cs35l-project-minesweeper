import { useState } from "react";
import icon from "./person-group-svgrepo-com.svg"
import FriendsPopout from "./FriendsPopout"

interface UserFriends{
    friendIDList:string[]; // fetch actual friend info from DB holding account info of every player
    dummyRemove: (id: string) => void;
}

const Friends = ({ friendIDList = [], dummyRemove}: UserFriends) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [text, setText] = useState("");

  const handleSearch = (value: string) => {
    console.log("Search submitted for:", value);
  };

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
        friendIDList={friendIDList}
        dummyRemove={dummyRemove}
        text={text}
        setText={setText}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default Friends;