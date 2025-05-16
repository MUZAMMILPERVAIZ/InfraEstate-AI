import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Create the root element for React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Initial theme from localStorage or default to 'light'
const initialTheme = localStorage.getItem('theme') || 'light';

// Set the initial theme attribute on the body
document.body.setAttribute('data-theme', initialTheme);

root.render(<App />);