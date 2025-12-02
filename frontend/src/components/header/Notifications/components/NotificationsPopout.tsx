import NotificationsContent from "./NotificationsContent";
import { Notification } from "../utils/notificationInter";
import { useEffect, useState } from "react";
import { createNotificationHandlers } from "../utils/helpers";

interface NotificationsPopoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPopout = ({ 
  isOpen, 
  onClose
}: NotificationsPopoutProps) => {
  if (!isOpen) {
    return null;
  }
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Get the notification handlers
  const { getNotifications, handleRemoveMessage, handleRemoveAll } = createNotificationHandlers(
    setNotifications,
    notifications
  );

  useEffect(() => {
    if (isOpen) {
      getNotifications();
    }
  }, [isOpen]);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div 
          className="friends-overlay rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-600/60 flex flex-col mx-auto w-[min(75%,40rem)] p-7 relative z-0 overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-row justify-between items-center">
            <h1 className="tracking-wide">Notifications</h1>
            <button onClick={onClose} className="closeOverlay uppercase hover:font-bold">Close</button>
          </div>
          <NotificationsContent 
            messages={notifications}
            removeMessage={handleRemoveMessage}
            removeAll={handleRemoveAll}
          />
        </div>
      </div>
    </>
  );
};

export default NotificationsPopout;

