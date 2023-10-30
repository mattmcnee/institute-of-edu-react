import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/Home.jsx';
import CreateSheet from './create-sheet/CreateSheet.jsx';
import ChartLayout from './Chart';
import Quiz from './Quiz';
import Bird from './three/Bird';
import Text from './three/Text';
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
        <Route path="/chart" element={<ChartLayout setTitle={updateTitleString}/>} />
        <Route path="/quiz" element={<Quiz setTitle={updateTitleString}/>} />
        <Route path="/bird" element={<Bird setTitle={updateTitleString}/>} />
        <Route path="/text" element={<Text setTitle={updateTitleString}/>} />
      </Routes>
    </Router>
  );
};

export default App
