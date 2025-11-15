import { useState } from "react";

interface NotificationProps{
    message:string;
    onDelete: () => void; // parent callback
};

function Notification({message,onDelete}:NotificationProps){
    return(
        <div>
            <p>{message}</p>
            <button onClick={onDelete}>
                Delete
            </button>
        </div>
    );
};

export default Notification;