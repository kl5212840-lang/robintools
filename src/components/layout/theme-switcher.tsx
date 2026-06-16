"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./theme-context";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // During SSR and before hydration, the server always renders with
  // themeId="dark". Render the same output (Sun icon) to avoid a
  // hydration mismatch. After mount, the real theme takes over.
  if (!mounted) {
    return (
      <button
        aria-label="切换到亮色模式"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
        title="切换到亮色模式"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = theme.id === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-all hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]"
      title={isDark ? "切换到亮色模式" : "切换到暗色模式"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
