import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize Google Analytics
import ReactGA from 'react-ga4';

ReactGA.initialize(`${import.meta.env.VITE_GOOGLE_ANALYTICS_KEY}`);

// Create the root element for React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Initial theme from localStorage or default to 'light'
const initialTheme = localStorage.getItem('theme') || 'light';

// Set the initial theme attribute on the body
document.body.setAttribute('data-theme', initialTheme);

root.render(<App/>);


































































































