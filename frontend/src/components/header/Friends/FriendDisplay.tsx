import { useState } from "react";

interface Friend {
    id: string;
    name: string;
    avatar: string;
}

interface FriendProps extends Friend {
    onRemove: (id: string) => void; // add callback to remove Friend
  }

const Friends = ({ id, name, avatar, onRemove}:FriendProps) =>{
    return (
        <div>
            <div>
                <strong>{name}</strong>
                <em>@{id}</em>
            </div>
            <img src={avatar} alt={`Friend ${name}'s Profile`} style={{ width: "100px", height: "auto" }}/>
            <button
                onClick={() => onRemove(id)}
            >
                Remove Friend
            </button>
        </div>
    );
};

export default Friends;
