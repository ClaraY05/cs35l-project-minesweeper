import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

interface AccountDisplayProps {        
    userName: string;
    gamerTag: string;
    imgUrl: string;
}

const AccountDisplay:React.FC<AccountDisplayProps> = ({ userName, gamerTag, imgUrl }:AccountDisplayProps)=>{
    const navigate = useNavigate();
    const [,setUser] = useLocalStorage<any|null>("user",null);
    const onLogout = async () =>{
        try {
            await fetch("http://localhost:8000/api/auth/logout", {
                method:"POST",
                credentials:"include"
            });
        } catch (err) {
            console.error(err)
        }
        setUser(null);
        navigate("/login", { replace:true })
    }
    return (
        <div className="flex flex-row bg-main p-2 rounded-sm">
            <div className="flex flex-col p-2">
                <strong className="text-primary-text account">{userName}</strong>
                <em className="text-secondary-text">@{gamerTag}</em>
            </div>
            <div className="flex flex-shrink-0">
                <img src={imgUrl} alt="User Profile" style={{ width: "75px", height: "75px" }}/>
        <button onClick={onLogout}>Logout</button>
            </div>
        </div>
        
    );
};

export default AccountDisplay;