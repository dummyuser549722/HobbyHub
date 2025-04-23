import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const CustomizeUI = ({ layout, setLayout }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || '16px');

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Font size change
  const handleFontSizeChange = (e) => {
    const size = e.target.value;
    setFontSize(size);
    document.body.style.fontSize = size;
    localStorage.setItem('fontSize', size);
  };

  // Layout toggle (grid or list)
  const toggleLayout = () => {
    const newLayout = layout === 'grid' ? 'list' : 'grid';
    setLayout(newLayout);
    localStorage.setItem('layout', newLayout);
  };

  useEffect(() => {
    document.body.style.fontSize = fontSize;
  }, [fontSize]);

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
      <button onClick={toggleTheme} className="btn btn-outline-secondary btn-sm">
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode
      </button>

      <select
        value={fontSize}
        onChange={handleFontSizeChange}
        className="form-select form-select-sm w-auto"
        title="Font Size"
      >
        <option value="14px">Small</option>
        <option value="16px">Medium</option>
        <option value="18px">Large</option>
      </select>

      <button onClick={toggleLayout} className="btn btn-outline-secondary btn-sm">
        {layout === 'grid' ? '📄 List View' : '🔲 Grid View'}
      </button>
    </div>
  );
};

export default CustomizeUI;
