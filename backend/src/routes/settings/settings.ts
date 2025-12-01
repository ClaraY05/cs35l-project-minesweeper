import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";
import { DEFAULT_KEYBINDS, DEFAULT_SOUND, DEFAULT_VIDEO, DEFAULT_NOTIF } from "./defaultSettings";
import type { KeybindMap } from "./settingsHelper";
import { getUserKeybinds, getUserSound, getUserVideo, getUserNotif, saveUserKeybinds, saveUserSound, saveUserVideo, saveUserNotif } from "./settingsHelper";

const settingsRoutes = Router();

type KeybindsBody = {
    bindings?: Partial<KeybindMap>;
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
