import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme as rnUseColorScheme } from "react-native";

type Theme = "light" | "dark";

interface ThemeContextType {
  colorScheme: Theme;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: "light",
  toggleColorScheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = rnUseColorScheme();
  const [colorScheme, setColorScheme] = useState<Theme>(systemScheme ?? "light");

  useEffect(() => {
    setColorScheme(systemScheme ?? "light");
  }, [systemScheme]);

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useColorScheme = () => useContext(ThemeContext);
