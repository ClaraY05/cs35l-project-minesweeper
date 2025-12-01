import { pool } from "../../db/db";
import { KeyAction, SoundAction, VideoAction, NotifAction } from "./settingTypes";
import { DEFAULT_KEYBINDS, DEFAULT_SOUND, DEFAULT_VIDEO, DEFAULT_NOTIF } from "./defaultSettings";

export type KeybindMap = Record<KeyAction, string>;
type SoundMap = Record<SoundAction, number | boolean>;
type VideoMap = Record<VideoAction, string | number | boolean>;
type NotifMap = Record<NotifAction, string | boolean>;

// Helper: get current keybinds for user (or defaults if none)
export async function getUserKeybinds(userId: number): Promise<KeybindMap> {
    const result = await pool.query(
        "SELECT keybinds FROM settings WHERE user_id = $1",
        [userId]
    );

    if(result.rowCount === 0) {
        // if no keybinds row, fall back on defaults
        return { ...DEFAULT_KEYBINDS };
    }

    const dbValue = result.rows[0].keybinds as any;

    //dbValue might already be an object; if it's a string, parse it
    const stored: Partial<KeybindMap> = typeof dbValue === "string" ? JSON.parse(dbValue) : dbValue;

    return { ...DEFAULT_KEYBINDS, ...stored };
}

// Helper: save keybinds back to database
export async function saveUserKeybinds(userId: number, keybinds: KeybindMap): Promise<void> {
    await pool.query(
        `
        INSERT INTO settings (user_id, keybinds)
        VALUES ($1, $2)
        ON CONFLICT (user_id) DO UPDATE
        SET keybinds = EXCLUDED.keybinds
        `,
        [userId, keybinds]
    );
}

export async function getUserSound(userID:number){
    const result = await pool.query("SELECT sound FROM settings WHERE user_id = $1", [userID]);
    const dbValue = result.rows[0].sound as any;
    const sound: Partial<SoundMap> = typeof dbValue ==="string" ? JSON.parse(dbValue) : dbValue;

    return { ...sound };
};

export async function saveUserSound(userID:number, sound:any){
    await pool.query(`
        UPDATE settings
        SET sound=$2
        WHERE user_id=$1
        `,[userID, sound]
    );
};

export async function getUserVideo(userID:number){
    const result = await pool.query("SELECT video FROM settings WHERE user_id = $1", [userID]);
    const dbValue = result.rows[0].video;
    const video: Partial<VideoMap> = typeof dbValue === "string" ? JSON.parse(dbValue) : dbValue;
    return { ...DEFAULT_VIDEO, ...video };
};

export async function saveUserVideo(userID:number, video:any){
    await pool.query(`
        UPDATE settings
        SET video=$2
        WHERE user_id=$1
        `,[userID, video]
    );
};

export async function getUserNotif(userID:number){
    const result = await pool.query("SELECT notif FROM settings WHERE user_id = $1", [userID]);
    const dbValue = result.rows[0].notif;
    const notif: Partial<NotifMap> = typeof dbValue === "string" ? JSON.parse(dbValue) : dbValue;
    return { ...DEFAULT_NOTIF, ...notif };
};

export async function saveUserNotif(userID:number, notif:any){
    await pool.query(`
        UPDATE settings
        SET notif=$2
        WHERE user_id=$1
        `,[userID, notif]
    );
};
