import Notification from "./Notification";

interface NotificationsContentProps {
  messages: string[];
  removeMessage: (index: number) => void;
  removeAll: () => void;
}

const NotificationsContent = ({ messages, removeMessage, removeAll }: NotificationsContentProps) => {
  return (
    <>
      <div className="p-3 flex flex-col gap-2 bg-stone-900 rounded-sm h-[90vh] overflow-y-auto">
        {messages.length === 0 ? (
          <p>No notifications</p>
        ) : (
          messages.map((msg, i) => (
            <Notification 
              key={i} 
              message={msg} 
              onDelete={() => removeMessage(i)} 
            />
          ))
        )}
      </div>
      {messages.length > 0 && (
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

