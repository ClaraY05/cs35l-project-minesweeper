import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { authFetch } from "../../api/authFetch";
import { DEFAULT_KEYBINDS, DEFAULT_SOUND, DEFAULT_VIDEO, DEFAULT_NOTIF } from "../../../../utils/defaultSettings";

interface AccountDisplayProps {        
    userName: string;
    imgUrl: string;
}

const AccountDisplay:React.FC<AccountDisplayProps> = ({ userName, imgUrl }:AccountDisplayProps)=>{
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = useLocalStorage<any|null>("user",null);
    const [,setKeybinds] = useLocalStorage("keybinds", DEFAULT_KEYBINDS);
    const [,setSound] = useLocalStorage("sound", DEFAULT_SOUND);
    const [,setVideo] = useLocalStorage("video", DEFAULT_VIDEO);
    const [,setNotif] = useLocalStorage("notif", DEFAULT_NOTIF);
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
        // revert settings to default after user logs out
        setKeybinds(DEFAULT_KEYBINDS);
        setSound(DEFAULT_SOUND);
        setVideo(DEFAULT_VIDEO);
        setNotif(DEFAULT_NOTIF);
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
                <button onClick={onLogout} className="uppercase text-xs font-bold hover:text-red-500">Logout</button>
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
                    className="hover:border-2 transition-all duration-300"
                    style={{ width: "75px", height: "75px", cursor: "pointer" }} // Be able to click on the image to change it
                    onClick={handleImageClick}
                />
            </div>
        </div>
        
    );
};

export default AccountDisplay;
