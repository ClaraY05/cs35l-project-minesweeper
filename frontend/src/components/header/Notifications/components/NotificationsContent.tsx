import { Notification } from "../utils/notificationInter";
import NotificationItem from "./Notification"

interface NotificationsContentProps {
  messages: Notification[];
  removeMessage: (notificationId: number) => void;
  removeAll: () => void;
}

const NotificationsContent = ({ messages, removeMessage, removeAll }: NotificationsContentProps) => {
  return (
    <div>
        {messages.length === 0 ? (
          <p>No notifications</p>
        ) : (
          messages.map((msg) => (
            <NotificationItem 
              notification={msg} 
              onDelete={() => removeMessage(msg.notification_id)} 
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

