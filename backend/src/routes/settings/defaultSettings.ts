import { KeyAction, SoundAction, VideoAction, NotifAction } from "./settingTypes.js";

export const DEFAULT_KEYBINDS: Record<KeyAction, string> = {
    openCell: "MouseLeft",
    flagCell: "MouseRight",
    chord: "MouseLeft+MouseRight",
    restartGame: "KeyR",
    escapeGame: "EscapeGame",
    powerup1: "Key1",
    powerup2: "Key2",
};

export const DEFAULT_SOUND: Record<SoundAction, number | boolean> = {
    music:50,
    sfx:50,
    stereo:50,
    sound1:true,
    sound2:true,
    sound3:true,
    sound4:true
};

export const DEFAULT_VIDEO: Record<VideoAction, string | number | boolean> = {
    graphics:"Low",
    displayUsername:true,
    changeCustomBg:false,
    customBg:"/bg.png",
    textSize:16

};

export const DEFAULT_NOTIF: Record<NotifAction, string | boolean> = {
    notifGameUpdates:"Yes",
    notifFriendReq:"Yes"
};


export const DEFAULT_SETTINGS = {
   keybinds: DEFAULT_KEYBINDS,
   sound:DEFAULT_SOUND,
   video:DEFAULT_VIDEO,
   notif:DEFAULT_NOTIF
};