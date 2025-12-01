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
| "changeCustomBg"
| "customBg"
| "textSize";

export type NotifAction = 
|"notifGameUpdates" 
| "notifFriendReq";