import Home from "./pages/Home/Home";
import Play from "./pages/Play/Play";
import Settings from "./pages/Settings/Settings"
import Keybinds from "./pages/Settings/Keybinds"
import Sound from "./pages/Settings/Sound"
import VideoInterface from "./pages/Settings/VideoInterface"
import Notifications from "./pages/Settings/Notifications"
import Login from "./pages/Login/Login"

import { Routes, Route, Navigate } from 'react-router-dom';

// because of react-router conventions, App now contains all available routes rather than the homepage.
// you can add more routes as you see fit.
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/play" element={<Play/>}/>
            <Route path="/settings" element={<Settings/>}>
                <Route index element={<Navigate to="keybinds" replace />} /> 
                <Route path="keybinds" element={< Keybinds/>} />
                <Route path="sound" element={<Sound />} />
                <Route path="video_interface" element={<VideoInterface />} />
                <Route path="notifications" element={<Notifications />} />
            </Route>
        </Routes>
    );
}

export default App;