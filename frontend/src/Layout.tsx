import { Outlet } from "react-router-dom";
import AccountDisplay from "./components/header/AccountDisplay";
import Friends from "./components/header/Friends/Friends"; 
import Notifications from "./components/header/Notifications/Notifications";

const dummyRemove = (id: string) => {
    console.log("Remove called for", id);
};
const dummyFriendList = ["696969","420420","100000"];

const MainLayout = () => {
  return (
    <div className="Layout">
      <header className="header">
        <h1>Sweeper.io</h1>
        <AccountDisplay userName="User" gamerTag="676767" imgUrl="https://preview.redd.it/do-you-have-goofy-pics-of-your-pretty-cats-v0-51t4e3gnyvib1.jpg?auto=webp&s=27b628d946d585f415de91edb250544ccff0d02c"/>
        <Friends friendIDList={dummyFriendList} dummyRemove={dummyRemove}/>
        <Notifications/>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;