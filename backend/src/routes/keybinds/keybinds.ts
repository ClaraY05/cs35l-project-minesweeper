import { Router } from "express";
import { KeyAction, UserKeybinds } from "./keybindTypes";

const DEFAULT_KEYBINDS: Record<KeyAction, string> = {
    openCell: "MouseLeft",
    flagCell: "MouseRight",
    chord: "MouseLeft+MouseRight",
    restartGame: "KeyR",
    escapeGame: "EscapeGame",
    powerup1: "Key1",
    powerup2: "Key2",
}

const userKeybindsStore = new Map<number, UserKeybinds>(); // modify for our database

const router = Router();

// GET /api/keybinds/:userid return the keybinds for a user
router.get("/:userid", (req, res) => {
    const userId = Number(req.params.userid);
    const stored = userKeybindsStore.get(userId);

    if(!stored) {
        const defaults: UserKeybinds = { userId, bindings: { ...DEFAULT_KEYBINDS }};
        return res.json(defaults);
    }

    return res.json(stored);
});

// PUT /api/keybinds/:userid replace the entire keybind mapping
router.put("/:userid", (req, res) => {
    const userId = Number(req.params.userid);
    const body = req.body as Partial<UserKeybinds>;

    const bindings = body.bindings ?? {};
    const full: UserKeybinds = {
        userId, 
        bindings: { ...DEFAULT_KEYBINDS, ...bindings },
    };

    userKeybindsStore.set(userId, full);
    return res.json(full);
});

// PATCH /api/keybinds/:userid change only selected keybinds
router.patch("/:userid", (req, res) => {
    const userId = Number(req.params.userid);
    const existing = userKeybindsStore.get(userId) ?? ({
        userId, 
        bindings: { ...DEFAULT_KEYBINDS },
    } as UserKeybinds);

    const updated: UserKeybinds = {
        userId, 
        bindings: { ...existing.bindings, ...Router(req.body.bindings ?? {}) },
    };

    userKeybindsStore.set(userId, updated);
    return res.json(updated);
});

// POST /api/keybinds/:userid/reset reset to default keybinds
router.post("/:userid/reset", (req, res) => {
    const userId = Number(req.params.userid);
    const defaults: UserKeybinds = { userId, bindings: { ...DEFAULT_KEYBINDS } };
    userKeybindsStore.set(userId, defaults);
    return res.json(defaults);
});

export default router;