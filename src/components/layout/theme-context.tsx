"use client";

import { createContext, useContext, useState, useLayoutEffect, useCallback, ReactNode } from "react";

export type ThemeId = "dark" | "light";

interface Theme {
  id: ThemeId;
  name: string;
}

const themes: Record<ThemeId, Theme> = {
  dark: { id: "dark", name: "暗色" },
  light: { id: "light", name: "亮色" },
};

interface ThemeContextValue {
  theme: Theme;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.dark,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: reads localStorage synchronously so React state
  // matches the DOM class already set by layout.tsx's blocking <script>.
  // On the server (SSR) window is undefined → defaults to "dark" which
  // matches the server-rendered HTML (always has dark class).
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch { /* localStorage unavailable (e.g. iframe sandbox) */ }
    return "dark";
  });

  // Synchronise <html> dark class with React state.
  //
  // Why useLayoutEffect (not useEffect):
  //   The blocking <script> in layout.tsx sets the correct class before
  //   first paint, but React hydration may REVERT it — layout.tsx hardcodes
  //   "dark" on <html>, so React "fixes" the DOM to match its virtual DOM.
  //   useLayoutEffect fires synchronously after the hydration commit,
  //   BEFORE the browser paints the next frame, correcting the class
  //   without any visible flicker.
  //
  // Why NOT a second effect for class toggling:
  //   setTheme (below) already writes the class directly in the click
  //   handler. The effect only needs to handle the initial mount correction
  //   and keep things consistent on subsequent state-driven changes.
  useLayoutEffect(() => {
    if (themeId === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [themeId]);

  // Theme switch triggered by user (ThemeSwitcher button).
  // Direct DOM write is intentional — CSS variables (including body bg)
  // react to the .dark class instantly, avoiding any frame of wrong color.
  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    if (id === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    localStorage.setItem("theme", id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: themes[themeId], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
