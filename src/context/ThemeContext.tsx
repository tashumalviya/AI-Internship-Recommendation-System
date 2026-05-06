import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getStorage, setStorage } from "../utils/storage";

export type Theme = "light" | "dark" | "beige" | "pastel-pink" | "lavender" | "mint" | "light-blue";

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEMES: Theme[] = ["light", "dark", "beige", "pastel-pink", "lavender", "mint", "light-blue"];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => getStorage("theme", "light"));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...THEMES.map(t => t === "dark" || t === "light" ? t : `theme-${t}`));
    
    if (currentTheme === "dark") {
      root.classList.add("dark");
    } else if (currentTheme !== "light") {
      root.classList.add(`theme-${currentTheme}`);
    }
    
    setStorage("theme", currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
