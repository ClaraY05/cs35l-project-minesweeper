interface FriendDisplayProps {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  // "request" shows both Accept and Deny buttons
  buttonType: "add" | "remove" | "request";
  onAction: () => void;          // primary action (add / remove / accept)
  onSecondaryAction?: () => void; // used for "request" mode as deny
}

const FriendDisplay = ({ id, name, avatar, email, buttonType, onAction, onSecondaryAction }: FriendDisplayProps) => {
  const isRequest = buttonType === "request";

  const buttonText =
    buttonType === "add"
      ? "Add Friend"
      : buttonType === "request"
        ? "Accept"
        : "Remove Friend";

  const buttonClass =
    buttonType === "add"
      ? "uppercase text-xs font-bold text-white hover:text-green-500"
      : buttonType === "request"
        ? "uppercase text-xs font-bold text-white hover:text-emerald-500"
        : "uppercase text-xs font-bold text-white hover:text-red-500";

  return (
    <div className="flex flex-row gap-2 p-3 bg-stone-900 rounded-sm items-center">
      <img src={avatar} alt={`${name}'s Profile`} style={{ width: "100px", height: "100px" }}/>
      <div className="flex flex-col gap-2 items-start justify-between p-3">
        <div>
          <strong className="friend-name">@{name}</strong>
          {email && <em className="block text-sm text-gray-400">@{email}</em>}
        </div>
        {isRequest ? (
          <div className="flex flex-row gap-3">
            <button
              onClick={onAction}
              className="uppercase text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              Accept
            </button>
            <button
              onClick={onSecondaryAction}
              className="uppercase text-xs font-bold text-red-400 hover:text-red-300"
            >
              Deny
            </button>
          </div>
        ) : (
          <button onClick={onAction} className={buttonClass}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default FriendDisplay;

