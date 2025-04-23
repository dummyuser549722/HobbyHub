import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <button onClick={toggle} className="btn btn-outline-secondary btn-sm">
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

export default ThemeToggle;
