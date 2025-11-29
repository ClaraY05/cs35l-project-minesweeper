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

      {showOverlay && (
        <div className="Overlay">
          <h2 className="font-bold">Friends</h2>
          <div>
            <h3>Search Friends</h3>
            <TextInput placeholder="Search gamertag..." value={text} onChange={setText} onSubmit={handleSearch}/>
          </div>
            {searchResults.length > 0 && (
              <div>
                <h3>Search Results</h3>
                {searchResults.map((user) => (
                  <div key={user.user_id}>
                    <div>
                      <strong>{user.username}</strong>
                      <em>@{user.email}</em>
                    </div>
                    <button onClick={() => handleAddFriend(user.user_id)}>
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            )}
          <div>
            <h3>Friend List</h3>
            {friends.length === 0 ? (
              <p>No friends found</p>
            ) : (
              friends.map((friend) => (
                <div key={friend.user_id}>
                  {renderFriendDisplay(friend, handleRemoveFriend)}
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