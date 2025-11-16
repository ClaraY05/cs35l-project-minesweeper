import React from "react";
import { Outlet, Link } from "react-router-dom";

const Settings = () => {
    return (
        <div className="contentDiv">
            <h1>Settings</h1>
            <nav>
                <ul>
                    <li><Link to="keybinds">Keybinds</Link></li>
                    <li><Link to="sound">Sound</Link></li>
                    <li><Link to="video_interface">Video & Interface</Link></li>
                    <li><Link to="notifications">Notifications</Link></li>
                </ul>
            </nav>
            <main> 
                <Outlet />
            </main>
            <button><Link to="/">Home</Link></button>
            <button>Save</button>
        </div>
    )
}
export default Settings;