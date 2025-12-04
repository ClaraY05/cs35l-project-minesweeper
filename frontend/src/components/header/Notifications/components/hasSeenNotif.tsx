interface HasSeenNotifProps {
    onDelete: () => void;
};

const HasSeenNotif = ({ onDelete }: HasSeenNotifProps) => {
    return (
        // need to style, add dot 
        <div className="absolute top-4 right-2">
        <span className="inline-block w-4 h-4 bg-rose-500 rounded-full border-2 border-black"></span>
        </div>
    )

};
export default HasSeenNotif;