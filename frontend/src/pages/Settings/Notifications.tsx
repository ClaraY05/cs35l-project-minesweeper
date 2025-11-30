import Selector from "./components/CommonSelector";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_NOTIF } from "./defaultSettings";

const Notifications = () => {
    let bool: string[] = ["No","Yes"];
    const [notif, setNotif] = useLocalStorage("notif",DEFAULT_NOTIF);
    const update = (newChange:any) => setNotif((prev:any)=>({ ...prev, ...newChange}));
    return (
        <div>
            <Selector label="Game Updates" options={bool} value={notif.notifGameUpdates} onChange={(e)=>update({notifGameUpdates:e})}/>
            <Selector label="Friend Requests" options={bool} value={notif.notifFriendReq} onChange={(e)=>update({notifFriendReq:e})}/>
        </div>
    );
}

export default Notifications;