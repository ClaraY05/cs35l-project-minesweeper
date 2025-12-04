interface HasSeenNotifProps {
    onDelete: () => void;
};

const HasSeenNotif = ({ onDelete }: HasSeenNotifProps) => {
    return (
        // need to style, add dot 
        <div className="blob">
            <button onClick={onDelete} className="uppercase text-xs font-bold hover:text-red-500">Temp</button>
        </div>
    )

};
export default HasSeenNotif;