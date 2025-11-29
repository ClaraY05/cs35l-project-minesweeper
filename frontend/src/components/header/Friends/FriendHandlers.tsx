import { authFetch } from "../../../api/authFetch";


interface Friend {
    user_id: number;
    username: string;
    email: string;

}

export const createFriendHandlers = (
    setFriends: React.Dispatch<React.SetStateAction<Friend[]>>,
    setSearchResults: React.Dispatch<React.SetStateAction<Friend[]>>,
    friends: Friend[],
    searchResults: Friend[]
  ) => {
    const handleSearch = async (value: string) => {
        try {
        const data = await authFetch(`/api/friends/search?query=${encodeURIComponent(value)}`, { 
            method: "GET" 
        });
        setSearchResults(data);
        } catch (err) {
        console.error("Failed to search users:", err);
        setSearchResults([]);
        }
    };

    const handleRemoveFriend = async (friendId: number) => {
        try {
        await authFetch(`/api/friends/${friendId}`, { method: "DELETE" });
        setFriends(friends.filter(friend => friend.user_id !== friendId));
        } catch (err) {
        console.error("Failed to remove friend:", err);
        }
    };

    const handleAddFriend = async (friendId: number) => {
        try {
        await authFetch("/api/friends", {
            method: "POST",
            body: JSON.stringify({ friendId }),
        });
        
        // Need to remove that friend if you've just friended them
        const updatedResults = searchResults.filter(user => user.user_id !== friendId);
        setSearchResults(updatedResults);
        
        // Now refresh the friends list
        const data = await authFetch("/api/friends", { method: "GET" });
        setFriends(data);
        } catch (err: any) {
        console.error("Failed to add friend:", err);
        alert(err.message || "Failed to add friend");
        }
    };

    return { handleSearch, handleRemoveFriend, handleAddFriend };
};