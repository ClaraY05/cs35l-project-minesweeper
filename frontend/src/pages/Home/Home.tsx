import { Link } from "react-router-dom"

const Home = () => {
    return (
    <>
        <li>
            <ul><Link to="/play">Single Player</Link></ul>
            <ul>Multiplayer</ul>
            <ul><Link to="/tutorial">Tutorial</Link></ul>
            <ul><Link to="/settings">Settings</Link></ul>
            <ul><Link to="/login">Login</Link></ul>
            <ul><Link to="/leaderboard">Leaderboard</Link></ul>
        </li>
    </>
    )
}

export default Home;