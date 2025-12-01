import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { authFetch } from "../../api/authFetch";
import { DEFAULT_KEYBINDS, DEFAULT_SOUND, DEFAULT_VIDEO, DEFAULT_NOTIF } from "./utils/defaultSettings";
import { useLocalStorage } from "usehooks-ts";

const Settings = () => {
    const [keybinds, setKeybinds] = useLocalStorage("keybinds", DEFAULT_KEYBINDS);
    const [sound, setSound]    = useLocalStorage("sound", DEFAULT_SOUND);
    const [video, setVideo]    = useLocalStorage("video", DEFAULT_VIDEO);
    const [notif, setNotif]    = useLocalStorage("notif", DEFAULT_NOTIF);
    const handleSave = async () =>{
        try{
            await Promise.all([
                authFetch("http://localhost:8000/api/settings/keybinds", {method:"PUT", body: JSON.stringify({bindings:keybinds})}),
                authFetch("http://localhost:8000/api/settings/sound", {method:"PUT", body: JSON.stringify({sound:sound})}),
                authFetch("http://localhost:8000/api/settings/video", {method:"PUT", body: JSON.stringify({video:video})}),
                authFetch("http://localhost:8000/api/settings/notif", {method:"PUT", body: JSON.stringify({notif:notif})})
                
            ]);
            console.log("saved")
        } catch(err){
            console.error(err);
        }
    }
    const handleDefault = async () =>{
        setKeybinds(DEFAULT_KEYBINDS);
        setSound(DEFAULT_SOUND);
        setVideo(DEFAULT_VIDEO);
        setNotif(DEFAULT_NOTIF);
        try {
            await Promise.all([
                authFetch("http://localhost:8000/api/settings/keybinds", {method:"PUT", body: JSON.stringify(DEFAULT_KEYBINDS)}),
                authFetch("http://localhost:8000/api/settings/sound", {method:"PUT", body: JSON.stringify(DEFAULT_SOUND)}),
                authFetch("http://localhost:8000/api/settings/video", {method:"PUT", body: JSON.stringify(DEFAULT_VIDEO)}),
                authFetch("http://localhost:8000/api/settings/notif", {method:"PUT", body: JSON.stringify(DEFAULT_NOTIF)})
            ]);
            console.log("reverted to default and saved changes");
        } catch(err){
            console.error(err);
        }
    }
    return (
        <div className="contentDiv">
            <h1 className="text-fuchsia-500 mt-0 pt-0">&gt; Settings</h1>
            <nav>
                <ul className="flex flex-row gap-x-11 flex-wrap justify-center py-.5">
                <li className="flex uppercase font-semibold">
                    <NavLink
                    to="keybinds"
                    className={({ isActive }) =>
                        isActive ? "text-fuchsia-600" : "text-slate-50"
                    }
                    >
                    Keybinds
                    </NavLink>
                </li>
                <li className="flex uppercase font-semibold">
                    <NavLink
                    to="sound"
                    className={({ isActive }) =>
                        isActive ? "text-fuchsia-600" : "text-slate-50"
                    }
                    >
                    Sound
                    </NavLink>
                </li>
                <li className="flex uppercase font-semibold">
                    <NavLink
                    to="video_interface"
                    className={({ isActive }) =>
                        isActive ? "text-fuchsia-600" : "text-slate-50"
                    }
                    >
                    Video & Interface
                    </NavLink>
                </li>
                <li className="flex uppercase font-semibold">
                    <NavLink
                    to="notifications"
                    className={({ isActive }) =>
                        isActive ? "text-fuchsia-600" : "text-slate-50"
                    }
                    >
                    Notifications
                    </NavLink>
                </li>
                </ul>
            </nav>
            <hr className="border-t-3 border-dashed h-2"></hr>
            <main className="flex flex-grow"> 
                <Outlet />
            </main>
            <nav className="flex flex-row gap-x-2 flex-wrap justify-center">
                <button><Link to="/home" className="hover:font-bold transition-all duration-300">Home</Link></button>|
                <button onClick={handleSave} className="hover:font-bold transition-all duration-300">Save</button>|
                <button onClick={handleDefault} className="hover:font-bold transition-all duration-300">Default</button>
            </nav>
        </div>
    )
}
export default Settings;