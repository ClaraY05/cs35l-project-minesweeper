export type KeyAction = 
| "openCell"
| "flagCell"
| "chord"
| "restartGame"
| "escapeGame"
| "powerup1"
| "powerup2";

export interface UserKeybinds {
    userId: number;
    bindings: Record<KeyAction, string>;
}