import Selector from "./components/CommonSelector";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_NOTIF } from "./utils/defaultSettings";

const Notifications = () => {
    let bool: string[] = ["No","Yes"];
    const [notif, setNotif] = useLocalStorage("notif",DEFAULT_NOTIF);
    const update = (newChange:any) => setNotif((prev:any)=>({ ...prev, ...newChange}));
    return (
        <div className="w-full flex flex-col gap-3 px-20">
            <Selector label="Game Updates" options={bool} value={notif.notif_game_updates} onChange={(e)=>update({notif_game_updates:e})}/>
            <Selector label="Friend Requests" options={bool} value={notif.notif_friend_req} onChange={(e)=>update({notif_friend_req:e})}/>
        </div>
    );
}

export default Notifications;