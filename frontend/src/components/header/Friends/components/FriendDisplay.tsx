interface FriendDisplayProps {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  buttonType: "add" | "remove";
  onAction: () => void;
}

const FriendDisplay = ({ id, name, avatar, email, buttonType, onAction }: FriendDisplayProps) => {
  const buttonText = buttonType === "add" ? "Add Friend" : "Remove Friend";
  const buttonClass = buttonType === "add" 
    ? "uppercase text-xs font-bold hover:text-green-500" 
    : "uppercase text-xs font-bold hover:text-red-500";

  return (
    <div className="flex flex-row gap-2 p-3 bg-stone-900 rounded-sm items-center">
      <img src={avatar} alt={`${name}'s Profile`} style={{ width: "100px", height: "100px" }}/>
      <div className="flex flex-col gap-2 items-start justify-between p-3">
        <div>
          <strong className="friend-name">@{name}</strong>
          {email && <em className="block text-sm text-gray-400">@{email}</em>}
        </div>
        <button onClick={onAction} className={buttonClass}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default FriendDisplay;

