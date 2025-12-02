import { Outlet, useLocation } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import AccountDisplay from "./components/header/AccountDisplay";
import Friends from "./components/header/Friends/Friends"; 
import Notifications from "./components/header/Notifications/Notifications";
import { DEFAULT_VIDEO } from "./pages/Settings/utils/defaultSettings";

const MainLayout = () => {
  const [user] = useLocalStorage<any|null>("user",null);
  const [video] = useLocalStorage("video", DEFAULT_VIDEO);
  const bg = video?.customBg? video.customBg : "/bg.png";

  // checks if page is login, will not render buttons in header if true
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
      <div className="relative bg-cover bg-center h-screen flex flex-col" style={{backgroundImage:`url(${bg})`}}>
      <header className="relative flex flex-row justify-between items-center w-full pb-4 z-20">
        <div className = "headerColor absolute inset-0 z-0">
          <div className="bg-main/70 h-[3.5rem]"></div>
          <div className="bg-main/70 mt-1 h-[.7rem]"></div>
          <div className="bg-main/70 mt-1.5 h-[.4rem]"></div>
        </div>
        <a href="/home" className="flex font-pixel logo text-primary-text z-10 pl-5 shrink-0">Sweeper.io</a>
        {user && !isLoginPage && (

      <div className="flex flex-row-reverse gap-5 z-10 pr-5 pt2 shrink-0">
      <AccountDisplay 
        userName={user.username} 
        imgUrl={user.profile_picture || "https://preview.redd.it/do-you-have-goofy-pics-of-your-pretty-cats-v0-51t4e3gnyvib1.jpg?auto=webp&s=27b628d946d585f415de91edb250544ccff0d02c"}
      />
      <Friends/>
      <Notifications/>
      </div>
        )}
      </header>
      <main className="flex relative z-0 w-full flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;