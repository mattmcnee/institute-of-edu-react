import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/Home.jsx';
import CreateSheet from './create-sheet/CreateSheet.jsx';
import CreateCards from './create-sheet/CreateCards.jsx';
import ChartLayout from './Chart';
import Quiz from './Quiz';
import Game from './three/Game';
import Worksheet from './worksheet/Worksheet';
import Login from './login/Login';
import Signup from './login/Signup';
import './App.css'

const App = ({onTitleString}) => {
  const updateTitleString = (data) => {
    onTitleString(data);
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home setTitle={updateTitleString}/>} />
        <Route path="/new-sheet" element={<CreateSheet setTitle={updateTitleString}/>} />
        <Route path="/new-cards" element={<CreateCards setTitle={updateTitleString}/>} />
        <Route path="/chart" element={<ChartLayout setTitle={updateTitleString}/>} />
        <Route path="/quiz" element={<Quiz setTitle={updateTitleString}/>} />
        <Route path="/bird" element={<Game setTitle={updateTitleString}/>} />
        <Route path="/login" element={<Login setTitle={updateTitleString}/>} />
        <Route path="/worksheet/:id" element={<Worksheet setTitle={updateTitleString}/>} />
        <Route path="/signup" element={<Signup setTitle={updateTitleString}/>} />
      </Routes>
    </Router>
  );
};

export default App
