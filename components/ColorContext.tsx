"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    name: "amber",
    primary: "#ff8c00",
    secondary: "#ffb347",
    tertiary: "#ffd180",
    accent: "#e67300",
  },
  {
    name: "olive",
    primary: "#7cb342",
    secondary: "#aed581",
    tertiary: "#c5e1a5",
    accent: "#558b2f",
  },
  {
    name: "lavender",
    primary: "#9b51e0",
    secondary: "#ba68c8",
    tertiary: "#ce93d8",
    accent: "#7b1fa2",
  },
];

interface ColorContextValue {
  activeTheme: ColorTheme;
  setActiveTheme: (theme: ColorTheme) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  setCustomTheme: (theme: ColorTheme | null) => void;
}

const ColorContext = createContext<ColorContextValue>({
  activeTheme: COLOR_THEMES[0],
  setActiveTheme: () => {},
  activeIndex: 0,
  setActiveIndex: () => {},
  setCustomTheme: () => {},
});

export function ColorProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [customTheme, setCustomTheme] = useState<ColorTheme | null>(null);
  const activeTheme = customTheme || COLOR_THEMES[activeIndex];

  const setActiveTheme = (theme: ColorTheme) => {
    const idx = COLOR_THEMES.findIndex((t) => t.name === theme.name);
    if (idx >= 0) {
      setActiveIndex(idx);
      setCustomTheme(null);
    }
  };

  const handleSetActiveIndex = (idx: number) => {
    setActiveIndex(idx);
    setCustomTheme(null);
  };

  return (
    <ColorContext.Provider
      value={{ activeTheme, setActiveTheme, activeIndex, setActiveIndex: handleSetActiveIndex, setCustomTheme }}
    >
      {children}
    </ColorContext.Provider>
  );
}

export function useColorTheme() {
  return useContext(ColorContext);
}
