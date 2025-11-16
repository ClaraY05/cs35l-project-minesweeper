interface AccountDisplayProps {        
    userName: string;
    gamerTag: string;
    imgUrl: string;
}

const AccountDisplay:React.FC<AccountDisplayProps> = ({ userName, gamerTag, imgUrl }:AccountDisplayProps)=>{
    return (
        <div className="flex flex-row bg-main p-2 rounded-sm">
            <div className="flex flex-col p-2">
                <strong className="text-primary-text account">{userName}</strong>
                <em className="text-secondary-text">@{gamerTag}</em>
            </div>
            <div className="flex flex-shrink-0">
                <img src={imgUrl} alt="User Profile" style={{ width: "75px", height: "75px" }}/>
            </div>
        </div>
    );
};

export default AccountDisplay;