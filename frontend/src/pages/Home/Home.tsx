import { Link } from "react-router-dom"

const Home = () => {
    return (
        <div className="w-full h-full flex justify-end">
        <li className="h-full flex gap-2 flex-col w-[55%]">
            <ul><Link to="/play" className="option-text option-bar bg-amber-500 flex">
              &gt; <div className="truncate">Single Player</div>
            </Link></ul>
            <ul><Link to="/play" className="option-text option-bar bg-sky-500 flex">
                &gt; <div className="truncate">Multiplayer</div>
            </Link></ul>
            <ul><Link to="/tutorial" className="option-text option-bar bg-lime-500 flex">
              &gt; <div className="truncate">Tutorial</div>
            </Link> </ul>
            <ul><Link to="/settings" className="option-text option-bar bg-fuchsia-500 flex">
              &gt; <div className="truncate w-">Settings</div>
            </Link></ul>
            <ul><Link to="/leaderboard" className="option-text option-bar bg-indigo-600 flex">
              &gt; <div className="truncate">Leaderboard</div>
            </Link></ul>
        </li>
      </div>      
    )
}

export default Home;