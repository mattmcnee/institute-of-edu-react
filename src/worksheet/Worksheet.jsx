import React from 'react';
import Game from '/src/three/Game';
import worksheetData from './worksheetData.json';

const Worksheet = ({setTitle}) => {
  setTitle("Game Worksheet");
  const updateTitleString = (data) => {
    return;
  }
  console.log("Home!!!");
  console.log(worksheetData);
  return (
    <div className="home-page">
      <nav className="video-nav flex-div">
        <div className="nav-left flex-div">
          <i className="fas fa-bars menu-icon hover-div"></i>
          <div className="hover-div">New Worksheet</div>
        </div>
        <div className="nav-middle flex-div">
          <div className="bar-content">
            <div className="progress-container" id="main-bar"></div>
          </div>
        </div>
        <div className="nav-right flex-div">
          <div className="hover-div" id="nav-week">
            MarginalRabbit45
          </div>
          <i className="fas fa-user hover-div"></i>
        </div>
      </nav>
      <div className="worksheet-conatiner">
        {worksheetData.sections.map((section) => (
          <div key={section.id} className="worksheet-section">
            {section.label === 'subheading' && <h2>{section.value.text}</h2>}
            {section.label === 'paragraph' && <p>{section.value.text}</p>}
            {section.label === 'game' && (
              <div className="game-container">
                <div className="game-window">
                  {/* You can pass the gameType and src as props if needed */}
                  <Game gameType={section.value.data.gameType} src={section.value.data.src} />
                </div>
              </div>
            )}
          </div>
        ))}



{/*        <div className="worksheet-section">
          <div className="game-container">
            <div className="game-window">
              <Game/>
            </div>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default Worksheet;
