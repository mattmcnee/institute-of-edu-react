import React from 'react';
import Bird from '/src/three/Bird';

const Worksheet = ({setTitle}) => {
  setTitle("Edu Homepage");
  const updateTitleString = (data) => {
    setTitle("Edu Homepage");
  }
  console.log("Home!!!");
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
        <div className="worksheet-section">
          <h2>Probability</h2>
        </div>

        <div className="worksheet-section">
          <div className="game-container">
            <div className="game-window">
              <Bird setTitle={updateTitleString}/>
            </div>
          </div>
        </div>

        <div className="worksheet-section">
          <p>Probability is a fundamental concept in mathematics and statistics, representing the likelihood of an event occurring. It is expressed as a number between 0 and 1, where 0 indicates impossibility and 1 indicates certainty. In the context of probability theory, various formulas and methods are used to calculate probabilities, enabling us to make predictions and decisions in uncertain situations. Understanding probability is essential in fields such as statistics, finance, science, and everyday decision-making, as it helps assess risks, make informed choices, and interpret random events. Whether it's calculating the probability of rolling a specific number on a six-sided die or predicting the likelihood of a particular outcome in complex real-world scenarios, the concept of probability plays a crucial role in shaping our understanding of uncertainty and randomness.</p>
        </div>


      </div>
    </div>
  );
};

export default Worksheet;
