import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/Home.jsx';
import './App.css'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        {/*<Route path="/worksheet" component={WorksheetPage} />*/}
      </Routes>
    </Router>
  );
};

export default App
