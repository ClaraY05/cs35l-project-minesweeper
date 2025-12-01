import { useState } from "react";
import icon from "./mail-svgrepo-com.svg"
import NotificationsPopout from "./components/NotificationsPopout"

const Notifications = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="flex flex-shrink-0">
      <button
        onClick={() => setShowOverlay(true)}
        className="showOverlay rounded-sm bg-main pt-2.5 pl-3.5 pr-3.5 hover:border-2 transition-all duration-300 cursor-pointer"
      >
        <img src={icon} alt="Letter Icon"/>
      </button>

      <NotificationsPopout
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
      />
    </div>
  );
};

export default Notifications;