import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Import the App component

// Get the root element from the HTML
const container = document.getElementById('root');
// Create a root
const root = createRoot(container);
// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
