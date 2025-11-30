import { useState } from "react";
import icon from "./mail-svgrepo-com.svg"
import NotificationsPopout from "./NotificationsPopout"

const Notifications = () =>{
  const [showOverlay, setShowOverlay] = useState(false);
  const [messages, setMessages] = useState([
    "You have a new friend request!",
    "Your game has started!",
    "Daily reward available!"
  ]); //setup to load values later

  const removeMessage = (index: number) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
  };

  const removeAll = () => {
    setMessages([]); 
  };

  return (
    <div className="flex flex-shrink-0">
      <button
        onClick={() => setShowOverlay(true)}
        className="showOverlay rounded-sm bg-main ptpt-2.5 pl-3.5 pr-3.5"
      >
        <img src={icon} alt="Letter Icon"/>
      </button>

      <NotificationsPopout
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
        messages={messages}
        removeMessage={removeMessage}
        removeAll={removeAll}
      />
    </div>
  );
};

export default Notifications;