import { useState, useEffect, useRef } from "react";
import icon from "./mail-svgrepo-com.svg"
import NotificationsPopout from "./components/NotificationsPopout"
import HasSeenNotif from "./components/hasSeenNotif"
import { authFetch } from "../../../api/authFetch";

const Notifications = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const prevCount = useRef(0);

  const checkNotifications = async () => {
    try {
      const notifs = await authFetch("/api/notifications", { method: "GET" });
      // uses ref to check if there are new notifications
      if (notifs.length > prevCount.current) {
        setHasNotifications(true);
      }
      // saves the current amount of notifications to a previous count
      prevCount.current = notifs.length;
    } catch (err) {
      console.error("Failed to check notifications:", err);
    }
  };

  // check every 5 seconds for new notifications
  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-shrink-0">
      <button
        onClick={() => {
          setShowOverlay(true);
          setHasNotifications(false);
        }}
        className="showOverlay rounded-sm bg-main pt-2.5 pl-3.5 pr-3.5 hover:border-2 transition-all duration-300 cursor-pointer relative"
      >
        <img src={icon} alt="Letter Icon"/>
        {hasNotifications &&  <HasSeenNotif onDelete={() => setHasNotifications(false)}/> }
      </button>

      <NotificationsPopout
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
      />
    </div>
  );
};

export default Notifications;