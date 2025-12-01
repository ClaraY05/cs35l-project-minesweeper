import TextInput from "./TextInput"
import FriendDisplay from "./FriendDisplay"
import { useEffect, useState } from "react";
import { createFriendHandlers } from "../utils/FriendHandlers";
import { authFetch } from "../../../../api/authFetch";

interface FriendsPopoutProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Friend {
  user_id: number;
  username: string;
  email: string;
  profile_picture: string | null;
}

const defaultPfp = "https://i.redd.it/help-me-find-the-cat-or-og-picture-from-the-cat-owl-meowl-v0-dghbx7likhgf1.jpg?width=1200&format=pjpg&auto=webp&s=45a83cd201b14934ad2000bf7834a4b92296f4a0";

const FriendsPopout = ({ 
  isOpen, 
  onClose
}: FriendsPopoutProps) => {
  if (!isOpen) return null;
  
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [text, setText] = useState("");

  // change to work w/ backend
  const [hasRequests, setHasRequests] = useState(true);
  const handleAcceptFriend = (userId: number) => {
    console.log("Accepting friend request for user:", userId);
  };
  const friendRequests = [{user_id: 1, username: "Desperate", email: "pls.pls@example.com", profile_picture: defaultPfp}, {user_id: 2, username: "Tobias Duerschmid", email: "tobias.duerschmid@example.com", profile_picture: defaultPfp}];
  
  // Get the friend handlers
  const { handleSearch, handleRemoveFriend, handleAddFriend } = createFriendHandlers(
    setFriends,
    setSearchResults,
    friends,
    searchResults
  );

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
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div 
          className="friends-overlay rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-600/60 flex flex-col mx-auto w-[min(75%,40rem)] p-7 relative z-0 overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-row justify-between items-center">
            <h1>Friends</h1>
            <button onClick={onClose}className="closeOverlay uppercase hover:font-bold">Close</button>
          </div>
          <div className="w-full p-3">
            <h3 className="uppercase font-bold">Search Friends</h3>
            <TextInput 
              placeholder="Search username..." 
              value={text} 
              onChange={setText} 
              onSubmit={handleSearch}
            />
          </div>
  
          {searchResults.length > 0 && (
            <div>
            <h3 className="uppercase font-bold">Search Results</h3>
            <div className="p-3 flex flex-col gap-2 min-h-[40vh] max-h-[40vh] overflow-y-auto pb-3">
              {searchResults.map((user) => (
                <FriendDisplay
                  key={user.user_id}
                  id={user.username}
                  name={user.username}
                  avatar={user.profile_picture || defaultPfp}
                  email={user.email}
                  buttonType="add"
                  onAction={() => handleAddFriend(user.user_id)}
                />
              ))}
            </div>
            </div>
          )}

          {hasRequests && (
            <div>
              <h3 className="uppercase font-bold">Friend Requests</h3>
              <div className="min-h-[40vh] max-h-[40vh] overflow-y-auto pb-3 flex flex-col gap-2">
                {friendRequests.map((friend) => (
                  <FriendDisplay
                    key={friend.user_id}
                    id={friend.username}
                    name={friend.username}
                    avatar={friend.profile_picture || defaultPfp}
                    email={friend.email}
                    buttonType="accept"
                    onAction={() => handleAcceptFriend(friend.user_id)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="p-3 flex flex-col gap-2">
            <h3 className="uppercase font-bold">Friend List</h3>
            <div className="min-h-[40vh] max-h-[40vh] overflow-y-auto pb-3 flex flex-col gap-2">
              {friends.length === 0 ? (
                <p>No friends found</p>
              ) : (
                friends.map((friend) => (
                  <FriendDisplay
                    key={friend.user_id}
                    id={friend.username}
                    name={friend.username}
                    avatar={friend.profile_picture || defaultPfp}
                    email={friend.email}
                    buttonType="remove"
                    onAction={() => handleRemoveFriend(friend.user_id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendsPopout;

