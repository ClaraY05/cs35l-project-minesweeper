import { useState } from "react";
import TextInput from "./TextInput"
import FriendDisplay from "./FriendDisplay"
import icon from "./person-group-svgrepo-com.svg"

interface UserFriends{
    friendIDList:string[]; // fetch actual friend info from DB holding account info of every player
    dummyRemove: (id: string) => void;
}

type RemoveCallback = (id: string) => void; // type from Friend Display

const renderFriendDisplay = (friendID:string, dummyRemove:RemoveCallback) => {
    return(
        <FriendDisplay id={friendID} name="Friend Name" avatar="https://i.redd.it/help-me-find-the-cat-or-og-picture-from-the-cat-owl-meowl-v0-dghbx7likhgf1.jpg?width=1200&format=pjpg&auto=webp&s=45a83cd201b14934ad2000bf7834a4b92296f4a0" onRemove={dummyRemove}/>
    );
};

const Friends = ({ friendIDList = [], dummyRemove}: UserFriends) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [text, setText] = useState("");

  const handleSearch = (value: string) => {
    console.log("Search submitted for:", value);
  };

  return (
    <div>
      <button
        onClick={() => setShowOverlay(true)}
        className="showOverlay rounded-sm bg-main p-2.5"
      >
        <img src={icon} alt="People Icon"/>
      </button>

      {showOverlay && (
        <div className="Overlay">
          <h2 className="font-bold">Friends</h2>
          <div>
            <h3>Search Friends</h3>
            <TextInput placeholder="Search gamertag..." value={text} onChange={setText} onSubmit={handleSearch}/>
          </div>

          <div>
            <h3>Friend List</h3>
            {friendIDList.length === 0 ? (
              <p>No friends found</p>
            ) : (
                friendIDList.map(friendID => (
                renderFriendDisplay(friendID,dummyRemove)
              ))
            )}
          </div>
          <button
            onClick={() => setShowOverlay(false)}
            className="closeOverlay"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Friends;