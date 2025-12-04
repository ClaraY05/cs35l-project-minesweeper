import { useLocalStorage } from "usehooks-ts";
import { useEffect, useRef } from "react";
import { DEFAULT_SOUND } from "../../../utils/defaultSettings";

type SoundSettings = typeof DEFAULT_SOUND;

export const useSoundManager = () => {
    const [soundSettings, setSoundSettings] = useLocalStorage<SoundSettings>("sound", DEFAULT_SOUND);
    const musicVolume = (soundSettings?.music ?? 50) / 100;
    const sfxVolume = (soundSettings?.sfx ?? 50) / 100;

    const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
    const activeSfxRefs = useRef<HTMLAudioElement[]>([]);

    useEffect(() => {
        if (backgroundMusicRef.current) {
            backgroundMusicRef.current.volume = musicVolume;
        }
            activeSfxRefs.current.forEach((audio) => {
            audio.volume = sfxVolume;
        });
    }, [musicVolume, sfxVolume]);

    const playBackgroundMusic = (audioPath: string) => {
        if (backgroundMusicRef.current) {
            backgroundMusicRef.current.pause();
            backgroundMusicRef.current = null;
        }

        const audio = new Audio(audioPath);
        audio.loop = true;
        audio.volume = musicVolume;
        audio.play().catch(console.warn);

        backgroundMusicRef.current = audio;
    };

    const stopBackgroundMusic = () => {
        if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
        backgroundMusicRef.current = null;
        }
    };

    const soundFlagMap = {
        click: "sound1",
        flag: "sound2",
        select: "sound3",
        difficulty: "sound4",
    } as const;

    type SoundName = keyof typeof soundFlagMap;

    const playSoundEffect = (audioPath: string, name: SoundName) => {
        const flagKey = soundFlagMap[name];
        if (!soundSettings[flagKey]) return;

        const audio = new Audio(audioPath);
        audio.volume = sfxVolume;
        audio.play().catch(console.warn);

        activeSfxRefs.current.push(audio);

        audio.addEventListener("ended", () => {
        activeSfxRefs.current = activeSfxRefs.current.filter((a) => a !== audio);
        });
    };

    const updateVolumes = () => {
        if (backgroundMusicRef.current) {
        backgroundMusicRef.current.volume = musicVolume;
        }
        activeSfxRefs.current.forEach((audio) => {
        audio.volume = sfxVolume;
        });
    };

    useEffect(() => {
        return () => {
        if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
        activeSfxRefs.current.forEach((audio) => audio.pause());
        activeSfxRefs.current = [];
        };
    }, []);

    return {
        soundSettings,
        setSoundSettings,
        musicVolume,
        sfxVolume,
        playBackgroundMusic,
        stopBackgroundMusic,
        playSoundEffect,
        updateVolumes,
    };
};
