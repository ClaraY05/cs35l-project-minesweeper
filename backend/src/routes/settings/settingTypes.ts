export type KeyAction = 
| "openCell"
| "flagCell"
| "chord"
| "restartGame"
| "escapeGame"
| "powerup1"
| "powerup2";

export type SoundAction = 
|"music" 
| "sfx" 
| "stereo" 
| "sound1" 
| "sound2" 
| "sound3" 
| "sound4";

export type VideoAction =
| "graphics"
| "displayUsername"
| "changeTextSize"
| "changeCustomBg"
| "customBg"
| "textSize";

export type NotifAction = 
|"notif_game_updates" 
| "notif_friend_req";