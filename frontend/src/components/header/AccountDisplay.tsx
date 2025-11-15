interface AccountDisplayProps {        
    userName: string;
    gamerTag: string;
    imgUrl: string;
}

const AccountDisplay:React.FC<AccountDisplayProps> = ({ userName, gamerTag, imgUrl }:AccountDisplayProps)=>{
    return (
        <div>
        <strong>{userName}</strong>
        <em>@{gamerTag}</em>
        <img src={imgUrl} alt="User Profile" style={{ width: "75px", height: "auto" }}/>
        </div>
    );
};

export default AccountDisplay;