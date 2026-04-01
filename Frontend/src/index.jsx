import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

console.log("index.js is executing!");
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
