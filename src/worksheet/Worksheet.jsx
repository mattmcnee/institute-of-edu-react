import React, { useState, useEffect } from 'react';
import Game from '/src/three/Game';
import worksheetData from './worksheetData.json';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Nav from '/src/Nav';

const Worksheet = ({ setTitle }) => {
  setTitle("Game Worksheet");

  function convertToFirebaseFormat(data) {
    const firebaseFormat = {};
    data.sections.forEach(section => {
      firebaseFormat[section.id] = section;
    });
    return firebaseFormat;
  }

  console.log("Home!!!");
  console.log(worksheetData);
  console.log(convertToFirebaseFormat(worksheetData));

  return (
    <div className="home-page">
      <Nav title={"New Worksheet"}/>
      <div className="worksheet-conatiner">
        {worksheetData.sections.map((section) => (
          <div key={section.id} className="worksheet-section">
            {section.label === 'subheading' && <h2>{section.value.text}</h2>}
            {section.label === 'paragraph' && <p>{section.value.text}</p>}
            {section.label === 'game' && (
              <div className="game-container">
                <div className="game-window">
                  <Game gameType={section.value.data.gameType} src={section.value.data.src} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Worksheet;

