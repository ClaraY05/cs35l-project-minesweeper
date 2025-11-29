import { useEffect, useState } from "react";
import TextInput from "./TextInput"
import FriendDisplay from "./FriendDisplay"
import icon from "./person-group-svgrepo-com.svg"

import { authFetch } from "../../../api/authFetch";

interface Friend {
  user_id: number;
  username: string;
  email: string;
}

type RemoveCallback = (id: string) => void; // type from FriendDisplay

const renderFriendDisplay = (friend: Friend, onRemove: RemoveCallback) => {
  return (
    <FriendDisplay
      id={friend.username}
      name={friend.username}
      avatar="https://i.redd.it/help-me-find-the-cat-or-og-picture-from-the-cat-owl-meowl-v0-dghbx7likhgf1.jpg?width=1200&format=pjpg&auto=webp&s=45a83cd201b14934ad2000bf7834a4b92296f4a0"
      onRemove={onRemove}
    />
  );
};


const Friends = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [text, setText] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);

  const handleSearch = (value: string) => {
    console.log("Search submitted for:", value);
  };

  useEffect(() => {
    async function loadFriends() {
      try {
        const data = await authFetch("/api/friends", { method: "GET" });
        setFriends(data);
      } catch (err) {
        console.error("Failed to load friends:", err);
      }
    }

    loadFriends();
  }, []);

  return (
    <div className="flex flex-shrink-0">
      <button
        onClick={() => setShowOverlay(true)}
        className="showOverlay rounded-sm bg-main ptpb-2.5 pl-3.5 pr-3.5"
      >
        <img src={icon} alt="People Icon flex-shrink-0"/>
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
            {friends.length === 0 ? (
              <p>No friends found</p>
            ) : (
              friends.map((friend) => (
                <div key={friend.user_id}>
                  {renderFriendDisplay(friend, () =>
                    console.log("remove", friend.user_id)
                  )}
                </div>
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