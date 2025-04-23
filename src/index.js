import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ThemeProvider from './contexts/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css'; // You’ll create this next

if (!localStorage.getItem('userId')) {
  const randomId = 'user_' + Math.random().toString(36).slice(2, 10);
  localStorage.setItem('userId', randomId);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);