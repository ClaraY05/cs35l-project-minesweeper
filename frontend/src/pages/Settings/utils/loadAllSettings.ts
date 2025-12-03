import { authFetch } from "../../../api/authFetch";

export async function loadAllSettings(){
    const [kb, sd, vd, ntf] = await Promise.all([
        authFetch("http://localhost:8000/api/settings/keybinds", {method:"GET"}),
        authFetch("http://localhost:8000/api/settings/sound", {method:"GET"}),
        authFetch("http://localhost:8000/api/settings/video", {method:"GET"}),
        authFetch("http://localhost:8000/api/settings/notif", {method:"GET"})
    ]);

    const keybinds = kb.bindings;
    const sound = sd.sound;
    const video = vd.video;
    const notif = ntf.notif;

    localStorage.setItem("keybinds", JSON.stringify(keybinds));
    localStorage.setItem("sound", JSON.stringify(sound));
    localStorage.setItem("video", JSON.stringify(video));
    localStorage.setItem("notif", JSON.stringify(notif));

    return { keybinds, sound, video, notif };
}