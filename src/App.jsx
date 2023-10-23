import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/Home.jsx';
import CreateSheet from './create-sheet/CreateSheet.jsx';
import './App.css'

const App = ({onTitleString}) => {
  const updateTitleString = (data) => {
    onTitleString(data);
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home setTitle={updateTitleString}/>} />
        <Route path="/create" element={<CreateSheet setTitle={updateTitleString}/>} />
      </Routes>
    </Router>
  );
};

export default App
