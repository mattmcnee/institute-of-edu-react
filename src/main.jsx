import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const updateTitleString = (data) => {
  document.title = data;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App onTitleString={updateTitleString} />
  // </React.StrictMode>,
)