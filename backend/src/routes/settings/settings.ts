import { Router } from "express";
import { pool } from "../../db/db";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";
import { KeyAction, SoundAction, VideoAction, NotifAction } from "./settingTypes";
import { DEFAULT_KEYBINDS, DEFAULT_SOUND, DEFAULT_VIDEO, DEFAULT_NOTIF } from "./defaultSettings";

const settingsRoutes = Router();

type KeybindMap = Record<KeyAction, string>;
type SoundMap = Record<SoundAction, number | boolean>;
type VideoMap = Record<VideoAction, string | number | boolean>;
type NotifMap = Record<NotifAction, string | boolean>;


type KeybindsBody = {
    bindings?: Partial<KeybindMap>;
};

// Helper: get current keybinds for user (or defaults if none)
async function getUserKeybinds(userId: number): Promise<KeybindMap> {
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
async function saveUserKeybinds(userId: number, keybinds: KeybindMap): Promise<void> {
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

async function getUserSound(userID:number){
    const result = await pool.query("SELECT sound FROM settings WHERE user_id = $1", [userID]);
    const dbValue = result.rows[0].sound as any;
    const sound: Partial<SoundMap> = typeof dbValue ==="string" ? JSON.parse(dbValue) : dbValue;

    return { ...sound };
};

async function saveUserSound(userID:number, sound:any){
    await pool.query(`
        UPDATE settings
        SET sound=$2
        WHERE user_id=$1
        `,[userID, sound]
    );
};

async function getUserVideo(userID:number){
    const result = await pool.query("SELECT video FROM settings WHERE user_id = $1", [userID]);
    const dbValue = result.rows[0].video;
    const video: Partial<VideoMap> = typeof dbValue === "string" ? JSON.parse(dbValue) : dbValue;
    return { ...DEFAULT_VIDEO, ...video };
};

async function saveUserVideo(userID:number, video:any){
    await pool.query(`
        UPDATE settings
        SET video=$2
        WHERE user_id=$1
        `,[userID, video]
    );
};

async function getUserNotif(userID:number){
    const result = await pool.query("SELECT notif FROM settings WHERE user_id = $1", [userID]);
    const dbValue = result.rows[0].notif;
    const notif: Partial<NotifMap> = typeof dbValue === "string" ? JSON.parse(dbValue) : dbValue;
    return { ...DEFAULT_NOTIF, ...notif };
};

async function saveUserNotif(userID:number, notif:any){
    await pool.query(`
        UPDATE settings
        SET notif=$2
        WHERE user_id=$1
        `,[userID, notif]
    );
};

// GET /api/keybinds/:userid return the keybinds for a user
settingsRoutes.get("/keybinds", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user.userID;
        const bindings = await getUserKeybinds(userId);
        return res.json({ userId, bindings });

    } catch (err) {
        console.error("Error fetching keybinds:", err);
        return res.status(500).json({ error: "Failed to fetch keybinds" });
    }
});

// PUT /api/settings/keybinds replace the entire keybind mapping
settingsRoutes.put("/keybinds", authenticateToken, async (req:AuthRequest, res) => {
    try {
        const userId = req.user.userID;
        const body = req.body as KeybindsBody;

        const supplied = body.bindings ?? {};

        // merge with defaults (so missing fields don't become undefined)
        const merged: KeybindMap = {
            ...DEFAULT_KEYBINDS,
            ...supplied,
        };

        // save to settings table
        await saveUserKeybinds(userId, merged);
        return res.json({ userId, bindings: merged });
    } catch (err) {
        console.error("PUT keybinds error:", err);
        return res.status(500).json({ error: "Failed to replace keybinds" });
    }
});

// PATCH /api/settings/keybinds change only selected keybinds
settingsRoutes.patch("/keybinds", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user.userID;
        const partial = (req.body?.bindings ?? {}) as Partial<KeybindMap>;

        const existing = await getUserKeybinds(userId);
        const updated: KeybindMap = { ...existing, ...partial };

        await saveUserKeybinds(userId, updated);
        return res.json({ userId, bindings: updated });
    } catch (err) {
        console.error("Error updating keybinds:", err);
        return res.status(500).json({ error: "Failed to update keybinds" });
    }
});

// POST /api/settings/keybinds/reset reset to default keybinds
settingsRoutes.post("/keybinds/reset", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user.userID;
        const defaults = { ...DEFAULT_KEYBINDS };
        await saveUserKeybinds(userId, defaults);
        return res.json({ userId, bindings: defaults });
    } catch (err) {
        console.error("Error resetting keybinds: ", err);
        return res.status(500).json({ error: "Failed to reset keybinds" });
    }
});

settingsRoutes.get("/sound", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user.userID;
        const sound = await getUserSound(userID);
        return res.json({ userID, sound });

    } catch (err) {
        console.error("Error fetching sound:", err);
        return res.status(500).json({ error: "Failed to fetch sound" });
    }
});

settingsRoutes.put("/sound", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user.userID;
        const sound = req.body.sound || DEFAULT_SOUND;
        await saveUserSound(userID, sound);
        return res.json({ userID, sound });
    } catch (err) {
        return res.status(500).json({ error: "Failed to update sound "})
    }
})

settingsRoutes.get("/video", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user.userID;
        const video = await getUserVideo(userID);
        return res.json({ userID, video });
    } catch (err) {
        console.error("Error fetching video:", err);
        return res.status(500).json({ error: "Failed to fetch video" });
    }
});

settingsRoutes.put("/video", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user.userID;
        const video = req.body.video || DEFAULT_VIDEO;
        await saveUserVideo(userID, video);
        return res.json({ userID, video });
    } catch (err) {
        return res.status(500).json({ error: "Failed to update video" });
    }
});

settingsRoutes.get("/notif", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user.userID;
        const notif = await getUserNotif(userID);
        return res.json({ userID, notif });
    } catch (err) {
        console.error("Error fetching notif:", err);
        return res.status(500).json({ error: "Failed to fetch notif" });
    }
});

settingsRoutes.put("/notif", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userID = req.user.userID;
        const notif = req.body.notif || DEFAULT_NOTIF;
        await saveUserNotif(userID, notif);
        return res.json({ userID, notif });
    } catch (err) {
        return res.status(500).json({ error: "Failed to update notif" });
    }
});

export default settingsRoutes;
