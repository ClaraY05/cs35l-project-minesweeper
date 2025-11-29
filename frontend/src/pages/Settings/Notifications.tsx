import Selector from "./components/CommonSelector";

const Notifications = () => {
    let bool: string[] = ["No","Yes"];
    return (
        <div>
            <Selector label="Game Updates" options={bool} defaultValue="Yes"/>
            <Selector label="Friend Requests" options={bool} defaultValue="Yes"/>
        </div>
    );
}

export default Notifications;