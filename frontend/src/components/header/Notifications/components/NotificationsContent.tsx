import NotificationItem from "./Notification";
import { Notification } from "../utils/notificationInter";

interface NotificationsContentProps {
  notifications: Notification[];
  removeMessage: (notif_id: number) => void;
  removeAll: () => void;
}

const NotificationsContent = ({ notifications, removeMessage, removeAll }: NotificationsContentProps) => {
  return (
    <>
      <div className="p-3 flex flex-col gap-2 bg-stone-900 rounded-sm h-[90vh] overflow-y-auto">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notification) => (
            <NotificationItem 
              key={notification.notification_id} 
              notification={notification} 
              onDelete={() => removeMessage(notification.notification_id)} 
            />
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <div className="pt-3">
          <button onClick={removeAll} className="uppercase font-bold hover:text-red-500 hover:bg-stone-900 border border-white rounded-sm p-1">
            Clear All Notifications
          </button>
        </div>
      )}
    </>
  );
};

export default NotificationsContent;

