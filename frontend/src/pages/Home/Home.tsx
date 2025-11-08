import { Link } from "react-router-dom"

const Home = () => {
    return (
    <>
        <li>
            <ul><Link to="/play">Play</Link></ul>
            <ul><Link to="/settings">Settings</Link></ul>
        </li>
    </>
    )
}

export default Home;