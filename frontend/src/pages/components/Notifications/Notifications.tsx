import { useState } from "react";
import Notification from "./Notification";

function Notifications (){
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
    <div>
      <button
        onClick={() => setShowOverlay(true)}
        className="showOverlay"
      >
        Notifications
      </button>

      {showOverlay && (
        <div className="Overlay">
          <h2 className="font-bold">Notifications</h2>
          <div>
            {messages.map((msg, i) => (
                <Notification 
                key={i} 
                message={msg} 
                onDelete={() => removeMessage(i)} 
                />
            ))}
          </div>
          <button onClick={removeAll}>
            Clear All Notifications
          </button>
          <button
            onClick={() => setShowOverlay(false)}
            className="closeOverlay"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;