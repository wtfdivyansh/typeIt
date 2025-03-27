import { create } from "zustand";
import { persist } from "zustand/middleware";
import { commonWords } from "@/utils/constants";

export type time = 15 | 30 | 60 | 90 | 120 | number;
export type wordsAmmount = 25 | 50 | 75 | 100 | number;
export type mode = "time" | "words";

export type Settings = {
  settings: {
    time: time;
    commonWords: string[];
    wordsAmmount: wordsAmmount;
    punctuation: boolean;
    mode: mode;
  };
  setSettings: (settings: Partial<Settings["settings"]>) => void;
};

const initialSettings: Settings["settings"] = {
  time: 15,
  commonWords: commonWords,
  wordsAmmount: 25,
  punctuation: false,
  mode: "time",
};
if(!localStorage.getItem("settings")) {
  localStorage.setItem("settings", JSON.stringify(initialSettings));
}
export const useSettingsStore = create<Settings>()(
  persist(
    (set) => ({
      settings: initialSettings,
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: "settings", 
    }
  )
);
