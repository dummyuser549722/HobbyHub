import React, { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const stored = localStorage.getItem('theme');
  const [theme, setTheme] = useState(stored || 'light');

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
