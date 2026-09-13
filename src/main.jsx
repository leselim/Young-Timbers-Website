import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/* The static site added a "js" class from script.js so nothing
   was left hidden if scripting failed. React owns the render
   here, so the flag is set once, up front. */
document.documentElement.classList.add('js');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
