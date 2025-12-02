import { authFetch } from "../../../../api/authFetch";
import { Notification } from "./notificationInter";

export const createNotificationHandlers = (
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
    notifications: Notification[]
    ) => {
    const getNotifications = async () => {
        try {
            const data = await authFetch("/api/notifications", { method: "GET" });
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            setNotifications([]);
        }
    };

    const handleRemoveMessage = async (notificationId: number) => {
        try {
            await authFetch(`/api/notifications/${notificationId}`, {
                method: "DELETE",
            });
            setNotifications(notifications.filter(notif => notif.notification_id !== notificationId));
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    const handleRemoveAll = async () => {
        try {
            await authFetch("/api/notifications", { method: "DELETE" });
            setNotifications([]);
        } catch (err) {
            console.error("Failed to delete all notifications:", err);
        }
    };
    
    const handleFriendRequest = async (notification: Notification, action: "accept" | "deny") => {
        const body = {
            requesterId: notification.comes_from_ID,
            notificationId: notification.notification_id,
        }
        try {
            await authFetch(`/api/friends/${action === "accept" ? "accept" : "deny"}`, {
                method: "POST",
                body: JSON.stringify(body),
            });
        } catch (err) {
            console.error("Failed to handle friend request:", err);
        }
    };
    
    return { getNotifications, handleRemoveMessage, handleRemoveAll, handleFriendRequest };
};