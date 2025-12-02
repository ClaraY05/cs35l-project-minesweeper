import { Notification } from "../utils/notificationInter";
import NotificationItem from "./Notification"

interface NotificationsContentProps {
  messages: Notification[];
  removeMessage: (index: number) => void;
  removeAll: () => void;
  onFriendRequestAction: (notification: Notification, action: "accept" | "deny") => void;
}

const NotificationsContent = ({ messages, removeMessage, removeAll, onFriendRequestAction }: NotificationsContentProps) => {
  return (
    <div>
        {messages.length === 0 ? (
          <p>No notifications</p>
        ) : (
          messages.map((msg, i) => (
            <NotificationItem 
              notification={msg} 
              onDelete={() => removeMessage(i)} 
              onFriendRequestAction={(action) => {onFriendRequestAction(msg, action)}}
            />
          ))
        )}
      <div className="pt-3">
          <button onClick={removeAll} className="uppercase font-bold hover:text-red-500 hover:bg-stone-900 border border-white rounded-sm p-1">
            Clear All Notifications
          </button>
      </div>
    </div>
  );
};

export default NotificationsContent;

