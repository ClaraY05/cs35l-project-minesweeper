import { Outlet } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import AccountDisplay from "./components/header/AccountDisplay";
import Friends from "./components/header/Friends/Friends"; 
import Notifications from "./components/header/Notifications/Notifications";

const dummyRemove = (id: string) => {
    console.log("Remove called for", id);
};
const dummyFriendList = ["696969","420420","100000"];

const MainLayout = () => {
  const [user] = useLocalStorage<any|null>("user",null);

  return (
    <body className="bg-[url('./components/bg.png')] bg-cover bg-center h-screen">
         <div className="">
          <header className="relative flex flex-row justify-between w-full pb-4">
            <div className = "headerColor absolute inset-0 z-0">
              <div className="bg-main/70 h-[3.5rem]"></div>
              <div className="bg-main/70 mt-1 h-[.7rem]"></div>
              <div className="bg-main/70 mt-1.5 h-[.4rem]"></div>
            </div>
            <h1 className="flex font-pixel logo text-primary-text z-10 pl-5">Sweeper.io</h1>
            {user&&(
            <div className="flex flex-row-reverse gap-5 z-10 pr-5 pt2">
              <AccountDisplay userName="User" gamerTag="676767" imgUrl="https://preview.redd.it/do-you-have-goofy-pics-of-your-pretty-cats-v0-51t4e3gnyvib1.jpg?auto=webp&s=27b628d946d585f415de91edb250544ccff0d02c"/>
              <Friends friendIDList={dummyFriendList} dummyRemove={dummyRemove}/>
              <Notifications/>
            </div>
            )}
          </header>
          <main className="flex self-center">
            <Outlet />
          </main>
        </div>
    </body>
  );
};

export default MainLayout;