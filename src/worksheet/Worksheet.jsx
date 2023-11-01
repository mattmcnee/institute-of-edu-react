import React from 'react';
import Game from '/src/three/Game';

const Worksheet = ({setTitle}) => {
  setTitle("Game Worksheet");
  const updateTitleString = (data) => {
    return;
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
          <h2>Definition of Independent Events</h2>
        </div>

        <div className="worksheet-section">
          <p>Two events, A and B, are considered independent if the occurrence (or non-occurrence) of one event does not affect the probability of the other event happening. Mathematically, events A and B are independent if and only if the probability of their intersection is equal to the product of their individual probabilities</p>
        </div>

        <div className="worksheet-section">
          <p>P(A∩B)=P(A)×P(B)</p>
        </div>

        <div className="worksheet-section">
          <h2>Multiplication Rule for Independent Events</h2>
        </div>

        <div className="worksheet-section">
          <p>The multiplication rule for independent events states that the probability of the intersection of two or more independent events is the product of their individual probabilities. For a sequence of independent events A, B, C, ..., the probability of all these events occurring together is given by:</p>
        </div>

        <div className="worksheet-section">
          <p>P(A∩B∩C∩…)=P(A)×P(B)×P(C)×…</p>
        </div>

        <div className="worksheet-section">
          <h2>Conclusion</h2>
        </div>

        <div className="worksheet-section">
          <p>Understanding the concept of independent events and their probabilities is crucial in various fields such as statistics, finance, and engineering. It allows for accurate predictions and modeling of real-world scenarios where events occur independently of each other. By applying the multiplication rule for independent events, one can calculate the likelihood of complex outcomes, making it a powerful tool in probability theory.</p>
        </div>

        <div className="worksheet-section">
          <h2>Test your knowledge</h2>
        </div>

        <div className="worksheet-section">
          <div className="game-container">
            <div className="game-window">
              <Game setTitle={updateTitleString}/>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Worksheet;
