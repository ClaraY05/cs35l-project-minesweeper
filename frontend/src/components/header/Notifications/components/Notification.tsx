import { Notification } from "../utils/notificationInter";

interface NotificationItemProps{
    notification: Notification;
    onDelete: () => void; // parent callback
    onFriendRequestAction: (action: "accept" | "deny") => void;
};

const NotificationItem = ({notification, onDelete, onFriendRequestAction}:NotificationItemProps) =>{
    return(
        <div className="flex flex-row gap-2 items-cente justify-between hover:bg-blue-900 pr-3 pl-3 pt-1 pb-1 rounded-sm">
            <p>{notification.message}</p>
            {notification.type === "friend_request" && onFriendRequestAction ? (
                <div className="flex gap-2">
                    <button
                        onClick={() => onFriendRequestAction("accept")}
                        className="uppercase text-xs font-bold hover:text-green-400"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => onFriendRequestAction("deny")}
                        className="uppercase text-xs font-bold hover:text-red-500"
                    >
                        Deny
                    </button>
                </div>
            ) : (
                <button onClick={onDelete} className="uppercase text-xs font-bold hover:text-red-500">
                    Delete
                </button>
            )}
        </div>
    );
};

export default NotificationItem;