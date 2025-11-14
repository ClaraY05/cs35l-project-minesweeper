import React from "react";
import { Outlet, Link } from "react-router-dom";

const Tutorial = () => {
    return (
        <div>
            <h1>Tutorial</h1>
            <nav>
                <ul>
                    <li><Link to="basics">Basics</Link></li>
                    <li><Link to="multiplayer">Multiplayer</Link></li>
                    <li><Link to="powerups">Powerups</Link></li>
                    <li><Link to="debuffs">Debuffs</Link></li>
                    <li><Link to="tesselation">Tesselation</Link></li>
                    <li><button><Link to="/">Home</Link></button></li>
                </ul>
            </nav>
            <main> 
                <Outlet />
            </main>
        </div>
    )
}
export default Tutorial;