export interface Notification {
    notification_id: number;
    message: string;
    type: string;
    comes_from_ID: number | null;
    is_read: boolean;
    created_at: string;
    related_username?: string;
}