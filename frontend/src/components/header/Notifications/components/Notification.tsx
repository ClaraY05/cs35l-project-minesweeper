import { Notification } from "../utils/notificationInter";

interface NotificationItemProps{
    notification: Notification;
    onDelete: () => void; // parent callback
};

const NotificationItem = ({notification, onDelete}:NotificationItemProps) =>{
    return(
        <div className="flex flex-row gap-2 items-cente justify-between hover:bg-blue-900 pr-3 pl-3 pt-1 pb-1 rounded-sm">
            <p>{notification.message}</p>
            <button onClick={onDelete} className="uppercase text-xs font-bold hover:text-red-500">
                Delete
            </button>
        </div>
    );
};

export default NotificationItem;