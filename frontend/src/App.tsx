import Home from "./pages/Home/Home";
import Play from "./pages/Play/Play";
import { Routes, Route } from 'react-router-dom';

// because of react-router conventions, App now contains all available routes rather than the homepage.
// you can add more routes as you see fit.
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/play" element={<Play/>}/>
        </Routes>
    );
}

export default App;