import { useState } from "react";
import icon from "./mail-svgrepo-com.svg"
import NotificationsPopout from "./components/NotificationsPopout"
import { authFetch } from "../../../api/authFetch";


// notification types and messages
interface Notification {
  notification_id: number;
  message: string;
  type: string;
  comes_from_ID: number | null;
  is_read: boolean;
  created_at: string;
}

const Notifications = () =>{
  const [showOverlay, setShowOverlay] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeMessage = (notif_id: number) => {
    setNotifications(prev => prev.filter(notif => notif.notification_id !== notif_id));
  };

  const removeAll = async () => {
    try {
      await authFetch("/api/notifications", { method: "DELETE" });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
    }
  };

  return (
    <div className="flex flex-shrink-0">
      <button
        onClick={() => setShowOverlay(true)}
        className="showOverlay rounded-sm bg-main ptpt-2.5 pl-3.5 pr-3.5 cursor-pointer"
      >
        <img src={icon} alt="Letter Icon"/>
      </button>

      <NotificationsPopout
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
        notifications={notifications}
        removeMessage={removeMessage}
        removeAll={removeAll}
      />
    </div>
  );
};

export default Notifications;