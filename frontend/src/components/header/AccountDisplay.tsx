import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

interface AccountDisplayProps {        
    userName: string;
    gamerTag: string;
    imgUrl: string;
}

const AccountDisplay:React.FC<AccountDisplayProps> = ({ userName, gamerTag, imgUrl }:AccountDisplayProps)=>{
    const navigate = useNavigate();
    const [,setToken] = useLocalStorage<string|null>("token",null);
    const [,setUser] = useLocalStorage<any|null>("user",null);
    const onLogout = () =>{
        setToken(null);
        setUser(null);
        navigate("/login", { replace:true })
    }
    return (
        <div>
        <strong>{userName}</strong>
        <em>@{gamerTag}</em>
        <img src={imgUrl} alt="User Profile" style={{ width: "75px", height: "auto" }}/>
        <button onClick={onLogout}>Logout</button>
        </div>
        
    );
};

export default AccountDisplay;