import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.href =
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
fontAwesomeLink.rel = 'stylesheet';
document.head.appendChild(fontAwesomeLink);

const faviconLink = document.createElement('link');
faviconLink.rel = 'icon';
faviconLink.href = './src/assets/document.ico'; // Replace 'path/to/your/favicon.ico' with the actual path to your favicon.ico file
document.head.appendChild(faviconLink);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)