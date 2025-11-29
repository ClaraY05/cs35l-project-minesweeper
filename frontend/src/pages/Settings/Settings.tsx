import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";

const Settings = () => {
    return (
        <div className="contentDiv">
            <h1 className="text-fuchsia-500">&gt; Settings</h1>
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
            <nav className="flex flex-row gap-x-5 flex-wrap justify-center">
                <button><Link to="/home">Home</Link></button>|
                <button>Save</button>
                <button>Default</button>
            </nav>
        </div>
    )
}
export default Settings;