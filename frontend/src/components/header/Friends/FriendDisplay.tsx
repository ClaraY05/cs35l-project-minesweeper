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
        <div className="flex flex-row gap-2 p-3 bg-stone-900 rounded-sm items-center">
            <img src={avatar} alt={`Friend ${name}'s Profile`} style={{ width: "100px", height: "100px" }}/>
            <div className="flex flex-col gap-2 items-start justify-between p-3">
                <strong className="friend-name">@{name}</strong>
                <button onClick={() => onRemove(id)} className="uppercase text-xs font-bold hover:text-red-500">Remove Friend</button>
            </div>
        </div>
    );
};

export default Friends;
