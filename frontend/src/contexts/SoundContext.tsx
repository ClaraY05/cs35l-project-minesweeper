import React, { createContext, useContext, ReactNode } from "react";
import { useSoundManager } from "../utils/useSoundManager";

type SoundManagerReturn = ReturnType<typeof useSoundManager>;
const SoundContext = createContext<SoundManagerReturn | undefined>(undefined);
interface SoundProviderProps {
  children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const soundManager = useSoundManager();

  return (
    <SoundContext.Provider value={soundManager}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundManagerReturn => {
  const context = useContext(SoundContext);
  
  if (context === undefined) {
    throw new Error("must use within context of provider!");
  }
  
  return context;
};