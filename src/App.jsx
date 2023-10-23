import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/Home.jsx';
import CreateSheet from './create-sheet/CreateSheet.jsx';
import './App.css'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/create" element={<CreateSheet/>} />
      </Routes>
    </Router>
  );
};

export default App
