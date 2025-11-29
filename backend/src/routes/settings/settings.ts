import { Router } from "express";
import { pool } from "../../db/db";
import { authenticateToken } from "../middleware/authMiddleware";
import { KeyAction } from "../settings/keybindTypes";

const router = Router();

type KeybindMap = Record<KeyAction, string>;

type KeybindsBody = {
    bindings?: Partial<KeybindMap>;
};

const DEFAULT_KEYBINDS: Record<KeyAction, string> = {
    openCell: "MouseLeft",
    flagCell: "MouseRight",
    chord: "MouseLeft+MouseRight",
    restartGame: "KeyR",
    escapeGame: "EscapeGame",
    powerup1: "Key1",
    powerup2: "Key2",
}

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
        SET keybinds = EXCLUDED.keybinds,
            updated_at = NOW()
        `,
        [userId, keybinds]
    );
}

// GET /api/keybinds/:userid return the keybinds for a user
router.get("/keybinds", authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const bindings = await getUserKeybinds(userId);
        return res.json({ userId, bindings });

    } catch (err) {
        console.error("Error fetching keybinds:", err);
        return res.status(500).json({ error: "Failed to fetch keybinds" });
    }
});

// PUT /api/settings/keybinds replace the entire keybind mapping
router.put("/keybinds", authenticateToken, async (req:any, res) => {
    try {
        const userId = req.user.id;
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
router.patch("/keybinds", authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
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
router.post("/keybinds/reset", authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const defaults = { ...DEFAULT_KEYBINDS };
        await saveUserKeybinds(userId, defaults);
        return res.json({ userId, bindings: defaults });
    } catch (err) {
        console.error("Error resetting keybinds: ", err);
        return res.status(500).json({ error: "Failed to reset keybinds" });
    }
});

export default router;