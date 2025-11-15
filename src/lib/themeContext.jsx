import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "system",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "app-theme",
}) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  // Apply the theme to HTML root element
  const applyTheme = (themeValue) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (themeValue === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.add(systemPrefersDark ? "dark" : "light");
      return;
    }

    root.classList.add(themeValue);
  };

  // Initial theme apply + listen to system changes
  useEffect(() => {
    applyTheme(theme);

    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  // Save theme to localStorage & update state
  const setTheme = (value) => {
    localStorage.setItem(storageKey, value);
    setThemeState(value);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
