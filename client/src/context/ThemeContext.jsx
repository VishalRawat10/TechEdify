import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : "light";
  });

  const changeTheme = () => {
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
    setTheme(localStorage.getItem("theme"));
  };
  useEffect(() => {
    theme === "dark"
      ? document.body.classList.add("dark")
      : document.body.classList.remove("dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
