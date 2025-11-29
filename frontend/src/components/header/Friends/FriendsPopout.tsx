import TextInput from "./TextInput"
import FriendDisplay from "./FriendDisplay"

interface FriendsPopoutProps {
  isOpen: boolean;
  onClose: () => void;
  friendIDList: string[];
  dummyRemove: (id: string) => void;
  text: string;
  setText: (value: string) => void;
  handleSearch: (value: string) => void;
}

type RemoveCallback = (id: string) => void;

const renderFriendDisplay = (friendID: string, dummyRemove: RemoveCallback) => {
  return (
    <FriendDisplay 
      id={friendID} 
      name="Friend Name" 
      avatar="https://i.redd.it/help-me-find-the-cat-or-og-picture-from-the-cat-owl-meowl-v0-dghbx7likhgf1.jpg?width=1200&format=pjpg&auto=webp&s=45a83cd201b14934ad2000bf7834a4b92296f4a0" 
      onRemove={dummyRemove}
    />
  );
};

const FriendsPopout = ({ 
  isOpen, 
  onClose, 
  friendIDList, 
  dummyRemove, 
  text, 
  setText, 
  handleSearch 
}: FriendsPopoutProps) => {
  if (!isOpen) return null;

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
            <button onClick={onClose}className="closeOverlay uppercase">Close</button>
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

          <div className="p-3 flex flex-col gap-2">
            <h3 className="uppercase font-bold">Friend List</h3>
            {friendIDList.length === 0 ? (
              <p>No friends found</p>
            ) : (
              friendIDList.map(friendID => (
                renderFriendDisplay(friendID, dummyRemove)
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendsPopout;

