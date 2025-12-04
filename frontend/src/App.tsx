import Home from "./pages/Home/Home";
import Play from "./pages/Play/Play";
import Settings from "./pages/Settings/Settings"
import Keybinds from "./pages/Settings/Keybinds"
import Sound from "./pages/Settings/Sound"
import VideoInterface from "./pages/Settings/VideoInterface"
import Notifications from "./pages/Settings/Notifications"
import Tutorial from "./pages/Tutorial/Tutorial"
import Basics from "./pages/Tutorial/Basics"
import Debuffs from "./pages/Tutorial/Debuffs"
import Multiplayer from "./pages/Tutorial/Multiplayer"
import Powerups from "./pages/Tutorial/Powerups"
import Tesselation from "./pages/Tutorial/Tesselation"
import MainLayout from "./Layout"
import Login from "./pages/Login/Login"
import Leaderboard from "./pages/Leaderboard/Leaderboard"
import Verify from "./pages/VerifyEmail/Verify"

import { Routes, Route, Navigate } from 'react-router-dom';
import AuthRedirect from "./components/AuthRedirect";
import RequireAuth from "./components/RequireAuth";
import { SoundProvider } from "./contexts/SoundContext"; // Add this import


// because of react-router conventions, App now contains all available routes rather than the homepage.
// you can add more routes as you see fit.
const App = () => {
    return (
        <SoundProvider>
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={
                    <AuthRedirect>
                        <Login />
                    </AuthRedirect>
                }/>
                <Route path="/verify" element={<Verify/>}/>
                
                <Route element={<RequireAuth />}>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/play" element={<Play/>}/>
                    <Route path="/leaderboard" element={<Leaderboard/>}/>
                    <Route path="/tutorial" element={<Tutorial/>}>
                        <Route index element={<Navigate to="basics" replace />} /> 
                        <Route path="basics" element={< Basics/>} />
                        <Route path="multiplayer" element={<Multiplayer />} />
                        <Route path="powerups" element={<Powerups />} />
                        <Route path="debuffs" element={<Debuffs />} />
                        <Route path="tesselation" element={<Tesselation />} />
                    </Route>
                    <Route path="/settings" element={<Settings/>}>
                        <Route index element={<Navigate to="keybinds" replace />} /> 
                        <Route path="keybinds" element={< Keybinds/>} />
                        <Route path="sound" element={<Sound />} />
                        <Route path="video_interface" element={<VideoInterface />} />
                        <Route path="notifications" element={<Notifications />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
        </SoundProvider>
    );
}

export default App;