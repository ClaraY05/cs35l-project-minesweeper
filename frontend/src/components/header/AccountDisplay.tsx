import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { authFetch } from "../../api/authFetch";

interface AccountDisplayProps {        
    userName: string;
    imgUrl: string;
}

const AccountDisplay:React.FC<AccountDisplayProps> = ({ userName, imgUrl }:AccountDisplayProps)=>{
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = useLocalStorage<any|null>("user",null);
    const onLogout = async () =>{
        try {
            localStorage.clear();
            await fetch("http://localhost:8000/api/auth/logout", {
                method:"POST",
                credentials:"include"
            });
        } catch (err) {
            console.error(err)
        }
        setUser(null);
        navigate("/", { replace:true })
    }

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        try {
            const formData = new FormData();
            formData.append('image', file);
    
            const response = await authFetch("/api/pfp", {
                method: "POST",
                body: formData
            });
    
            // update user pfp in localStorage with new profile picture
            if (user) {
                setUser({ ...user, profile_picture: response.profile_picture });
            }
        } catch (err) {
            console.error("Failed to upload profile picture:", err);
        }
    };

    return (
        <div className="flex flex-row bg-main p-2 rounded-sm">
            <div className="flex flex-col p-2">
                <strong className="text-primary-text account">{userName}</strong>
                <button onClick={onLogout} className="uppercase text-xs font-bold">Logout</button>
            </div>
            <div className="flex flex-shrink-0">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
                <img 
                    src={imgUrl} 
                    alt="User Profile" 
                    style={{ width: "75px", height: "75px", cursor: "pointer" }} // Be able to click on the image to change it
                    onClick={handleImageClick}
                />
            </div>
        </div>
        
    );
};

export default AccountDisplay;